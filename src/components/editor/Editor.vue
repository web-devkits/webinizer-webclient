<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <div
    v-show="errorOccurred"
    style="width: auto; height: 460px; text-align: center; padding: 100px 0">
    <div class="ma-4">
      <v-icon size="x-large" color="blue-darken-2"> mdi-file-alert-outline </v-icon>
    </div>
    <div>
      <pre>{{ encodingErrorStr }}</pre>
    </div>
  </div>

  <div
    v-show="props.type == EditorType.FILE && !errorOccurred"
    id="containerFile"
    style="margin: auto; width: auto; height: 65vh; text-align: left"></div>

  <div
    v-show="props.type == EditorType.LOG && !errorOccurred"
    id="containerLog"
    :class="{ active: props.display }"
    style="
      margin: auto;
      width: 80vw;
      height: 80vh;
      border: 1px solid var(--black-03);
      text-align: left;
    "></div>
</template>

<script setup lang="ts">
import { monaco, EditorType } from "./customerEditor";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useStore } from "../../store";
import { log } from "../../helper";

const props = defineProps<{
  path: string;
  type: number;
  resourceType: string;
  display: boolean;
}>();

const emit = defineEmits<{
  (e: "showLogTab", value: boolean): void;
  (e: "hideActions", value: boolean): void;
}>();

let timerId: ReturnType<typeof setTimeout>;
let instanceFile: monaco.editor.IStandaloneCodeEditor;
let instanceLog: monaco.editor.IStandaloneCodeEditor;

const cmakeStr = "cmake";
const defaultStr = "// This is default editor for you to use.";

const encodingErrorStr = ref(
  "The file is not displayed in the editor because it \n" +
    "is either binary or uses an unsupported text encoding."
);

const store = useStore();

const errorOccurred = ref(false);
const buildStatus = computed(() => store.state.buildingStatus);
const root = computed(() => store.state.root);

const triggerFetchLogContent = () => {
  if (instanceLog === undefined) return;
  store.dispatch("fetchLogContent").then(
    () => {
      emit("showLogTab", true);
      instanceLog.setValue("" + store.state.logContent + "");
      instanceLog.revealLineInCenterIfOutsideViewport(store.state.logContent.split("\n").length, 1);
    },
    (error) => {
      if (instanceLog) instanceLog.setValue("");
      log.errMsgNCuz(error);
    }
  );
};

function openNewFile() {
  if (props.type === EditorType.FILE) {
    errorOccurred.value = false;
    emit("hideActions", false);
    instanceFile.setValue(defaultStr);
    store.commit("setFileContent", undefined);
  }
}

function updateFileContentInEditor(filePath: string, content: string | undefined) {
  const file = monaco.Uri.file(filePath);
  const lower = filePath.toLowerCase();
  let model = monaco.editor.getModel(file);
  if (!model) {
    let languageType =
      lower.endsWith("." + cmakeStr) || lower.endsWith("cmakelists.txt") ? cmakeStr : undefined;
    if (languageType === undefined && content) {
      const re = new RegExp(/^#!\s*\/bin\/(sh|bash)\s*\n/);
      // eslint-disable-next-line no-unsafe-optional-chaining
      if (content.search(re) !== -1) {
        languageType = "shell";
      }
    }
    model = monaco.editor.createModel(content === undefined ? "" : content, languageType, file);
  }
  model.setValue(content as string);
  instanceFile.setModel(model);
}

function startFetchLogTimerJob() {
  if (instanceLog !== undefined) {
    instanceLog.setValue("");
  }
  timerId = setInterval(triggerFetchLogContent, 1000);
}

//NOTE - Will be invoked when building process finish or enter the
//       build page
function fetchLogContentOnce() {
  //NOTE - if the action starts before the editor instance creates
  //       (from `watch`), the instanceLog is undefined.
  if (instanceLog === undefined) return;
  store.dispatch("fetchLogContent").then(
    () => {
      emit("showLogTab", true);
      instanceLog.setValue("" + store.state.logContent + "");
      instanceLog.revealLineInCenter(store.state.logContent.split("\n").length - 1, 1);
    },
    (error) => {
      if (instanceLog) instanceLog.setValue("");
      log.errMsgNCuz(error);
    }
  );
}

async function updateFileContent() {
  if (props.type === EditorType.FILE && store.state.editFile?.name) {
    try {
      await store.dispatch("updateFileContent", {
        name: store.state.editFile?.name,
        content: instanceFile.getValue(),
      });
      if (store.state.editFile && store.state.editFile.content !== instanceFile.getValue()) {
        updateFileContentInEditor(store.state.editFile.name, store.state.editFile.content);
      }
    } catch (error) {
      throw error as Error;
    }
  }
}

async function setFileEditorPath(path: string) {
  try {
    await store.dispatch("fetchFileContent", path);
    errorOccurred.value = false;
    emit("hideActions", false);
    if (props.type === EditorType.FILE) {
      updateFileContentInEditor(path, store.state.editFile?.content);
    }
  } catch (error) {
    errorOccurred.value = true;
    emit("hideActions", true);
    throw error as Error;
  }
}

async function openFile(path: string) {
  try {
    await store.dispatch("fetchFileContent", path);
    if (props.type === EditorType.FILE) {
      updateFileContentInEditor(path, store.state.editFile?.content);
    }
  } catch (error) {
    throw error as Error;
  }
}

async function saveAsNewFile(path: string) {
  if (props.type === EditorType.FILE) {
    try {
      await store.dispatch("saveAsNewFile", {
        name: path,
        content: instanceFile.getValue(),
      });
    } catch (error) {
      throw error as Error;
    }
  }
}

defineExpose({
  updateFileContent,
  setFileEditorPath,
  saveAsNewFile,
  openNewFile,
  openFile,
});

onMounted(async () => {
  try {
    if (root.value) await store.dispatch("getProjectBuildStatus");
  } catch (error) {
    log.errMsgNCuz(error);
  }

  switch (props.type) {
    case EditorType.FILE:
      if (monaco.languages.getEncodedLanguageId(cmakeStr) == 0) {
        monaco.languages.register({ id: cmakeStr });

        monaco.languages.setMonarchTokensProvider(cmakeStr, {
          keywords: [
            "cmake_host_system_information",
            "cmake_language",
            "cmake_minimum_required",
            "cmake_parse_arguments",
            "cmake_path",
            "cmake_policy",
            "configure_file",
            "execute_process",
            "file",
            "find_file",
            "find_library",
            "find_package",
            "find_path",
            "find_program",
            "get_cmake_property",
            "get_directory_property",
            "get_filename_component",
            "get_property",
            "if",
            "include",
            "include_guard",
            "list",
            "mark_as_advanced",
            "math",
            "message",
            "option",
            "return",
            "separate_arguments",
            "set",
            "set_directory_properties",
            "set_property",
            "site_name",
            "string",
            "unset",
            "variable_watch",
            "add_compile_definitions",
            "add_compile_options",
            "add_custom_command",
            "add_custom_target",
            "add_definitions",
            "add_dependencies",
            "add_executable",
            "add_library",
            "add_link_options",
            "add_subdirectory",
            "add_test",
            "aux_source_directory",
            "build_command",
            "create_test_sourcelist",
            "define_property",
            "enable_language",
            "enable_testing",
            "export",
            "fltk_wrap_ui",
            "get_source_file_property",
            "get_target_property",
            "get_test_property",
            "include_directories",
            "include_external_msproject",
            "include_regular_expression",
            "install",
            "link_directories",
            "link_libraries",
            "load_cache",
            "project",
            "remove_definitions",
            "set_source_files_properties",
            "set_target_properties",
            "set_tests_properties",
            "source_group",
            "target_compile_definitions",
            "target_compile_features",
            "target_compile_options",
            "target_include_directories",
            "target_link_directories",
            "target_link_libraries",
            "target_link_options",
            "target_precompile_headers",
            "target_sources",
            "try_compile",
            "try_run",
            "ctest_build",
            "ctest_configure",
            "ctest_coverage",
            "ctest_empty_binary_directory",
            "ctest_memcheck",
            "ctest_read_custom_files",
            "ctest_run_script",
            "ctest_sleep",
            "ctest_start",
            "ctest_submit",
            "ctest_test",
            "ctest_update",
            "ctest_upload",
          ],

          controlWords: [
            "if",
            "elseif",
            "else",
            "endif",
            "foreach",
            "endforeach",
            "while",
            "endwhile",
            "continue",
            "break",
            "return",
            "macro",
            "endmacro",
            "function",
            "endfunction",
          ],

          operators: [
            "NOT",
            "AND",
            "OR",
            "LESS",
            "GREATER",
            "EQUAL",
            "NOTEQUAL",
            "LESS_EQUAL",
            "GREATER_EQUAL",
            "STRLESS",
            "STRGREATER",
            "STREQUAL",
            "STREGREATER_EQUAL",
            "VERSION_LESS",
            "VERSION_GREATER",
            "VERSION_EQUAL",
            "VERSION_LES_EQUAL",
            "VERSION_GREATER_EQUAL",
          ],

          symbols: /[=><!~?:&|+\-*/^%]+/,

          escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

          tokenizer: {
            root: [
              // identifiers and keywords
              [
                /[a-zA-Z_][\w$]*/,
                {
                  cases: {
                    "@controlWords": "keyword",
                    "@keywords": "keyword",
                    "@default": "identifier",
                  },
                },
              ],
              [/\$<.*>/, "type.identifier"], // to show GeneratorExpression
              [/\$(ENV|CACHE)?{.*}/, "type.identifier"], // to show reference

              // whitespace
              { include: "@whitespace" },

              // delimiters and operators
              [/[{}()[\]]/, "@brackets"],
              [/[<>](?!@symbols)/, "@brackets"],
              [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],

              // numbers
              [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
              [/0[xX][0-9a-fA-F]+/, "number.hex"],
              [/\d+/, "number"],

              // delimiter: after number because of .\d floats
              [/[;,.]/, "delimiter"],

              // strings
              [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
              [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

              // characters
              [/'[^\\']'/, "string"],
              [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
              [/'/, "string.invalid"],
            ],

            string: [
              [/[^\\"]+/, "string"],
              [/@escapes/, "string.escape"],
              [/\\./, "string.escape.invalid"],
              [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
            ],

            whitespace: [
              [/[ \t\r\n]+/, "white"],
              [/#.*$/, "comment"],
            ],
          },
        });
      }
      instanceFile = monaco.editor.create(document.querySelector("#containerFile") as HTMLElement, {
        value: defaultStr,
        language: "c",
        theme: "vs",
        renderValidationDecorations: "on",
        automaticLayout: true,
      });
      break;

    case EditorType.LOG:
      if (monaco.languages.getEncodedLanguageId("Log") == 0) {
        monaco.languages.register({ id: "Log" });

        // Register a tokens provider for the language
        // FIXME - "log-builder" regular expression should be updated
        //         due to the dynamic builders getting from server
        monaco.languages.setMonarchTokensProvider("Log", {
          tokenizer: {
            root: [
              [/\[error]/, "log-error"],
              [/\[warn]/, "log-warn"],
              [/\[info]/, "log-info"],
              [
                /(\[project\]|\[CMakeBuildStep\]|\[ConfigureBuildStep\]|\[MakeBuildStep\]|\[EmccBuildStep\]|\[NativeCommand\])/,
                "log-builder",
              ],
              [/\[[0-2][0-9]:[0-5][0-9]:[0-5][0-9]\]/, "log-date"],
            ],
          },
        });

        monaco.editor.defineTheme("logTheme", {
          base: "vs",
          inherit: false,
          rules: [
            { token: "log-info", foreground: "#2979FF", fontStyle: "bold" },
            { token: "log-error", foreground: "#ff0000", fontStyle: "bold" },
            { token: "log-warn", foreground: "#FF6D00", fontStyle: "bold" },
            { token: "log-date", foreground: "#808080", fontStyle: "bold" },
            { token: "log-builder", foreground: "#008800", fontStyle: "bold" },
            { token: "", foreground: "#212121", fontStyle: "bold" },
          ],
          colors: {
            "editor.foreground": "#808080",
          },
        });
      }

      instanceLog = monaco.editor.create(document.querySelector("#containerLog") as HTMLElement, {
        value: "",
        language: "Log",
        theme: "logTheme",
        automaticLayout: true,
        formatOnPaste: true,
        renderValidationDecorations: "on",
        readOnly: true,
        minimap: {
          enabled: false,
        },
      });
      //NOTE - fetch the build log content if the pre-build process
      //       finished when component is mounted.
      if (buildStatus.value !== "idle_default") {
        fetchLogContentOnce();
      }

      break;

    default:
      break;
  }
});

onUnmounted(() => {
  if (props.type === EditorType.LOG && timerId !== undefined) {
    clearInterval(timerId);
  }
});

watch(
  () => buildStatus.value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_n, _o) => {
    if (_n === "building" || _n === "building_with_recipes") {
      startFetchLogTimerJob();
    } else {
      clearInterval(timerId);
      //NOTE -  TEMPORARILY SOLUTION: will fetch the content if the
      //        timer stop to make sure that all the log return.
      if (_n !== "idle_default") {
        fetchLogContentOnce();
      }
    }
  },
  //NOTE - will start watching immediately before the page is mounted
  { immediate: true }
);
</script>

<style lang="scss" scoped>
#containerFile {
  border: 1px solid var(--black-03);
  border-radius: 5px;
}

#containerFile:hover {
  border: 1px solid var(--black-1);
  box-shadow: 1px 3px 5px 0px rgb(35 100 210 / 10%);
}
</style>
