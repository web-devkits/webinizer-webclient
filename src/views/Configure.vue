<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <section class="banner flex-center text-center b4">
    <div>
      <h1>{{ getProjectName(route.query.root as string, config) }} Configuration</h1>
      <h2>Customize your detailed configurations</h2>
    </div>
  </section>

  <section v-if="root">
    <div class="d-flex justify-space-around">
      <nav class="nav-body-position hidden-md-and-down text-left">
        <v-list>
          <v-list-item
            ><template #title><span class="text-h6">Configuration</span></template
            ><template #subtitle><span>Click to jump</span></template></v-list-item
          >
        </v-list>

        <v-list density="compact" nav mandatory>
          <v-list-item
            v-for="(item, index) in validElementRefObj"
            :key="index"
            :title="item.title"
            :class="item.isActive ? 'active-section' : ''"
            @click="elementClickHandler(item.id)"></v-list-item
        ></v-list>
      </nav>

      <div class="config-body mt-8">
        <div :id="ConfigElementId.BuildTarget" name="configOption" class="mb-4">
          <v-card variant="elevated" flat>
            <RadioButtons
              label="Choose build target :"
              first-btn-label="Static"
              second-btn-label="Shared"
              :tip="tip"
              :model-val="buildTarget"
              @update="createOrChangeBuildTarget"></RadioButtons>
          </v-card>
        </div>

        <div v-if="config?.target" class="text-left">
          <div :id="ConfigElementId.OverAllEnvVariable" name="configOption" class="bl mr-6 mb-4">
            <v-card variant="elevated" flat>
              <v-card-item class="mb-10"
                ><v-card-title> Overall env variables </v-card-title></v-card-item
              >
              <v-card-text>
                <EditTextField
                  need-tip
                  label="Compiler flags"
                  type-name="cflags"
                  :value="config?.overallEnvs?.cflags"
                  :tip-content="generateTemplatesTip()"
                  read-only></EditTextField>
              </v-card-text>

              <v-card-text>
                <EditTextField
                  need-tip
                  label="Linker flags"
                  type-name="ldflags"
                  :value="config?.overallEnvs?.ldflags"
                  :tip-content="generateTemplatesTip()"
                  read-only></EditTextField>
              </v-card-text>
            </v-card>
          </div>

          <div class="g1x2">
            <div :id="ConfigElementId.EnvVariable" name="configOption" class="bl mr-6 mb-4">
              <v-card variant="elevated" flat>
                <v-card-item class="mb-10"
                  ><v-card-title> Env variables </v-card-title></v-card-item
                >

                <v-card-text>
                  <EditTextField
                    need-tip
                    label="Compiler flags"
                    type-name="cflags"
                    :value="config?.buildTargets?.[config.target]?.envs?.cflags"
                    :tip-content="generateTemplatesTip()"
                    :update-value-manually="updateManuallyFlag4Cflags"
                    @change-with-type="saveProjectEnv"
                    @reset-update-val-manually-flag="
                      updateManuallyFlag4Cflags = false
                    "></EditTextField>
                </v-card-text>

                <v-card-text>
                  <EditTextField
                    need-tip
                    label="Linker flags"
                    type-name="ldflags"
                    :value="config?.buildTargets?.[config.target]?.envs?.ldflags"
                    :tip-content="generateTemplatesTip()"
                    :update-value-manually="updateManuallyFlag4Ldflags"
                    @change-with-type="saveProjectEnv"
                    @reset-update-val-manually-flag="
                      updateManuallyFlag4Ldflags = false
                    "></EditTextField>
                </v-card-text>

                <v-card-text>
                  <EditTextField
                    need-tip
                    label="Exported functions"
                    :value="config?.buildTargets?.[config.target]?.exportedFuncs"
                    :tip-content="exportedFuncsTip"
                    :rules="configFieldRulesObject.exportedFunctionsRules"
                    :update-value-manually="updateManuallyFlag4ExpFuncs"
                    @change="saveProjectExportedFuncs"
                    @reset-update-val-manually-flag="
                      updateManuallyFlag4ExpFuncs = false
                    "></EditTextField>
                </v-card-text>

                <v-card-text>
                  <EditTextField
                    need-tip
                    label="Exported runtime methods"
                    :value="config?.buildTargets?.[config.target]?.exportedRuntimeMethods"
                    :tip-content="exportedRuntimeMethodsTip"
                    :rules="configFieldRulesObject.exportedFunctionsRules"
                    :update-value-manually="updateManuallyFlag4ExpRTM"
                    @change="saveProjectExportedRuntimeMethods"
                    @reset-update-val-manually-flag="
                      updateManuallyFlag4ExpRTM = false
                    "></EditTextField>
                </v-card-text>
              </v-card>
            </div>

            <div :id="ConfigElementId.LocalData" name="configOption" class="bl mb-4">
              <EditTextFieldList
                need-add
                need-tip
                :title="'Local data files'"
                :value="config?.buildTargets?.[config.target]?.preloadFiles"
                :label="'Path to local data file'"
                :tip-content="generateLocalDataFilesTip()"
                :rules="configFieldRulesObject.localDataFileRules"
                @change="saveProjectDataFiles"></EditTextFieldList>
            </div>
          </div>

          <div :id="ConfigElementId.OptionSwitch" name="configOption" class="g2x3 mb-4 bl">
            <div class="mb-6">
              <EditOptionSwitch
                option-type="needMainLoop"
                title="Infinite main loop"
                sub-title="Enable this option if your application uses an infinite main loop."
                :value="config?.buildTargets?.[config.target]?.options?.needMainLoop"
                @change="saveProjectOptions"></EditOptionSwitch>
            </div>

            <div class="mb-6">
              <EditOptionSwitch
                option-type="needPthread"
                title="Pthreads"
                sub-title="Enable this option if your application uses pthreads."
                :value="config?.buildTargets?.[config.target]?.options?.needPthread"
                @change="saveProjectOptions"></EditOptionSwitch>
            </div>

            <div class="mb-6">
              <EditOptionSwitch
                option-type="needCppException"
                title="C++ exception"
                sub-title="Enable this option if you want to enable C++ exception catching in WebAssembly. It was disabled by default for performance and browser compatibility consideration."
                :value="config?.buildTargets?.[config.target]?.options?.needCppException"
                @change="saveProjectOptions"></EditOptionSwitch>
            </div>

            <div class="mb-6">
              <EditOptionSwitch
                option-type="needSimd"
                title="SIMD support"
                sub-title="Enable WebAssembly SIMD by default for performance consideration."
                :value="config?.buildTargets?.[config.target]?.options?.needSimd"
                @change="saveProjectOptions"></EditOptionSwitch>
            </div>

            <div class="mb-6">
              <EditOptionSwitch
                option-type="needModularize"
                title="Modularize JS output"
                sub-title="Enable this option by default will emit the JS code wrapped in a function that returns a promise. The promise is resolved with the module instance when it is safe to run the compiled code."
                :value="config?.buildTargets?.[config.target]?.options?.needModularize"
                @change="saveProjectOptions"></EditOptionSwitch>
            </div>
          </div>
        </div>

        <div
          v-if="config?.resolutions && config?.resolutions.length"
          :id="ConfigElementId.Dependencies"
          name="configOption"
          class="bl mb-4 text-left">
          <v-card variant="flat">
            <v-card-title>Dependencies</v-card-title>
            <div class="g1x2r">
              <template v-if="depConfigs && Object.keys(depConfigs)">
                <v-card-item v-for="(v, idx) in Object.keys(depConfigs)" :key="idx">
                  <EditDepConfig :dest="v" :config="depConfigs[v]" @change="updateDepTarget">
                  </EditDepConfig>
                </v-card-item>
              </template></div
          ></v-card>
        </div>

        <div v-if="config?.isLibrary" class="g1x2 text-left">
          <div :id="ConfigElementId.Package" name="configOption" class="bl mr-6 mb-4">
            <div v-if="config?.target">
              <v-card variant="elevated" flat>
                <v-card-item class="mb-10"
                  ><v-card-title> Package configs </v-card-title></v-card-item
                >
                <v-card-text>
                  <EditTextField
                    need-tip
                    label="Prefix"
                    type-name="prefix"
                    :value="config?.buildTargets?.[config.target]?.pkgConfig?.prefix"
                    :tip-content="generateTemplatesTip()"
                    @change-with-type="saveProjectPkgConfig"></EditTextField>
                </v-card-text>
                <v-card-text>
                  <EditTextField
                    need-tip
                    label="Compiler flags"
                    type-name="cflags"
                    :value="config?.buildTargets?.[config.target]?.pkgConfig?.cflags"
                    :tip-content="generateTemplatesTip()"
                    @change-with-type="saveProjectPkgConfig"></EditTextField>
                </v-card-text>
                <v-card-text>
                  <EditTextField
                    need-tip
                    label="Linker flags"
                    type-name="ldflags"
                    :value="config?.buildTargets?.[config.target]?.pkgConfig?.ldflags"
                    :tip-content="generateTemplatesTip()"
                    @change-with-type="saveProjectPkgConfig"></EditTextField>
                </v-card-text>
              </v-card>
            </div>
          </div>
          <div :id="ConfigElementId.NativeLibrary" name="configOption" class="bl mb-4">
            <v-card variant="elevated" flat>
              <v-card-item class="mb-10"
                ><v-card-title> Native library info </v-card-title></v-card-item
              >
              <v-card-text>
                <EditTextField
                  label="Name"
                  type-name="name"
                  :value="config?.nativeLibrary?.name"
                  @change-with-type="saveProjectNativeLib"></EditTextField>
              </v-card-text>
              <v-card-text>
                <EditTextField
                  label="Version"
                  type-name="version"
                  :value="config?.nativeLibrary?.version"
                  @change-with-type="saveProjectNativeLib"></EditTextField>
              </v-card-text>
            </v-card>
          </div>
        </div>

        <div class="mb-4">
          <v-btn
            tile
            color="blue"
            class="mainbtn mr-6"
            append-icon="mdi-arrow-right"
            @click="router.push({ path: '/build' })">
            Build</v-btn
          >

          <v-btn
            tile
            variant="outlined"
            color="blue"
            class="otlshadow"
            append-icon="mdi-restore"
            @click="alertReset = true">
            Reset Configs</v-btn
          >

          <Transition name="slide-fade">
            <Alert
              v-if="alertReset"
              content="Are you sure to reset?"
              @confirm="resetProjectConfig()"
              @cancel="alertReset = false"></Alert
          ></Transition>
        </div>
      </div>

      <div class="hidden-md-and-down" style="width: 10%">
        <span class="d-none">/* This occupied flex area is for displaying tip well */</span>
      </div>
    </div>
  </section>

  <div v-else class="mx-auto w-75">
    <v-card flat>
      <v-card-text> <p class="text-center">Please set up project root path first.</p></v-card-text>

      <v-card-actions
        ><v-btn
          prepend-icon="mdi-arrow-left"
          color="info"
          @click="router.push({ path: '/getstarted' })"
          >Set Project Path</v-btn
        ></v-card-actions
      >
    </v-card>
  </div>
</template>

<script setup lang="ts">
/*
  eslint-disable
    @typescript-eslint/no-unsafe-member-access,
    @typescript-eslint/no-unsafe-call,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/no-unsafe-assignment,
    @typescript-eslint/no-unsafe-enum-comparison
*/
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useStore } from "../store";
import {
  ProjectEnv,
  EnvType,
  updateProjectConfigPart,
  ProjectPkgConfig,
  PkgConfigType,
  ProjectPkgInfo,
  PkgInfoType,
  ConfigParameterTypes,
  WS_SERVER_PATH,
  WsMessageType,
} from "../webinizer";
import { useRouter, useRoute } from "vue-router";
import { getProjectName } from "../common/utility/utility";
import EditTextField from "../components/config/EditTextField.vue";
import EditTextFieldList from "../components/config/EditTextFieldList.vue";
import EditOptionSwitch from "../components/config/EditOptionSwitch.vue";
import EditDepConfig from "../components/config/EditDepConfig.vue";
import Alert from "../components/Alert.vue";
import RadioButtons from "../components/config/RadioButtons.vue";
import { log } from "../helper";
import WebSocket from "isomorphic-ws";

enum ConfigElementId {
  BuildTarget = "BUILD_TARGET",
  OverAllEnvVariable = "OVERALL_ENV_VARIABLE",
  EnvVariable = "ENV_VARIABLE",
  LocalData = "LOCAL_DATA",
  OptionSwitch = "OPTION_SWITCH",
  Dependencies = "DEPENDENCIES",
  Package = "PACKAGE",
  NativeLibrary = "NATIVE_LIBRARY",
}

interface ConfigElemRefType {
  id: ConfigElementId; // bind with the element id
  title: string; // bind with the navigation title
  isActive?: boolean;
}

// this is to fix the tricky scenario that when users click the
// navigation item, the window will scroll to the element, it will
// also trigger the scroll event handler.
let isClicking = false;

let wsClient: WebSocket;

const tip =
  "Select the <b>static</b> build target if you want to build your project with static linking. All dependent libraries will be built into Wasm archive files (.a), and then linked to the main project to get a standalone Wasm module with no external dependencies.\n\nSelect the <b>shared</b> build target if you want to build your project with dynamic linking. All dependent libraries will be built into Wasm binary files (.wasm/.so) as side modules (using flag -sSIDE_MODULE), whose exports will be dynamically imported into the context of main project's Wasm module (using flag -sMAIN_MODULE) by JavaScript glue code.\n\nMore details for static and dynamic linking are available <a href='https://emscripten.org/docs/compiling/Dynamic-Linking.html' target='_blank'>here</a>.";

const exportedFuncsTip = `Add <b>native</b> function names here if you want to keep them alive and available to be called from JavaScript.\n\nPlease separate each function name with a <b>comma</b>.\n\nMore details are available <a href='https://github.com/emscripten-core/emscripten/blob/main/src/settings.js#L991' target='_blank'>here</a>.`;
const exportedRuntimeMethodsTip = `Add any runtime elements (i.e., methods, library objects, etc.) here if you want to export these additional JavaScript runtime elements provided by Emscripten on Module for better interaction with the WASM binary.\n\nPlease separate each element name with a <b>comma</b>.\n\nMore details are available <a href='https://github.com/emscripten-core/emscripten/blob/main/src/settings.js#L888' target='_blank'>here</a>.`;

const allConfigElemRefObjArr: ConfigElemRefType[] = [
  {
    id: ConfigElementId.BuildTarget,
    title: "Build target",
  },

  {
    id: ConfigElementId.OverAllEnvVariable,
    title: "Overall env variables",
  },

  {
    id: ConfigElementId.EnvVariable,
    title: "Env variables & Local data",
  },

  {
    id: ConfigElementId.OptionSwitch,
    title: "Options",
  },

  {
    id: ConfigElementId.Dependencies,
    title: "Dependencies",
  },
  {
    id: ConfigElementId.Package,
    title: "Package & Native library info",
  },
];

const configFieldRulesObject = {
  exportedFunctionsRules: [
    (value: string) => {
      if (value) {
        const functionArr = value
          .trim()
          .split(",")
          .map((v) => v.trim());
        if (functionArr.length === new Set(functionArr).size) return true;
        else return "The added function/method name cannot be repeated.";
      }
    },
  ],
  localDataFileRules: [
    (value: string) => {
      if (value && value.trim()?.length > 0) return true;
      return "The path can't be empty.";
    },
  ],
};

const configOptionGroup = document.getElementsByName("configOption");

const store = useStore();
const router = useRouter();
const route = useRoute();
const alertReset = ref(false);

const updateManuallyFlag4Cflags = ref(false),
  updateManuallyFlag4Ldflags = ref(false),
  updateManuallyFlag4ExpFuncs = ref(false),
  updateManuallyFlag4ExpRTM = ref(false);

const buildTarget = ref("static");
const validElementRefObj = ref<ConfigElemRefType[]>();

const config = computed(() => store.state.projectConfig);
const root = computed(() => store.state.root);
const templates = computed(() => store.state.templateLiterals);
const depConfigs = computed(() => store.state.depConfigs);

function generateTemplatesTip(): string {
  return (
    `Below are the available template literals and their values for your reference:\n\n` +
    templates.value.join("\n\n")
  );
}

function generateLocalDataFilesTip(): string {
  return (
    `Set the path to the file you'd like to preload and Webinizer by default maps it to the root of Emscripten's <a href='https://emscripten.org/docs/porting/files/file_systems_overview.html#file-system-overview' target='_blank'>virtual FS</a> (@/). If you want to map your file to a different location in the virtual FS, set the file path as /path/to/local/file@/path/in/virtual/FS.\n\n` +
    generateTemplatesTip()
  );
}

function elementClickHandler(elemId: ConfigElementId) {
  isClicking = true;
  // reset previous active navigation item and
  // set active class for current navigation item
  validElementRefObj.value?.map((_obj) => {
    if (_obj.id === elemId) {
      _obj.isActive = true;
    } else {
      _obj.isActive = false;
    }
  });
  // get corresponding element and scroll to it
  const element = document.getElementById(elemId);
  window.scrollTo({
    top: element?.offsetTop,
  });
  setTimeout(() => {
    isClicking = false;
  }, 500);
}

function filterAllConfigElemRefObjArr() {
  validElementRefObj.value = allConfigElemRefObjArr.filter((_obj) => {
    return document.getElementById(_obj.id) !== null;
  });
}

function scrollEventHandler() {
  if (isClicking) {
    return;
  }
  for (let i = 0; i < configOptionGroup.length; i++) {
    const currentElement = document.getElementById(configOptionGroup[i].id);
    if (currentElement) {
      const viewportTop = window.scrollY;
      const viewportBottom = viewportTop + window.innerHeight;
      const elementTop = currentElement.offsetTop;
      const elementBottom = elementTop + currentElement.offsetHeight;
      if (
        elementTop < viewportBottom &&
        elementBottom - currentElement.offsetHeight / 2 > viewportTop
      ) {
        validElementRefObj.value?.map((_item) => {
          if (_item.id === configOptionGroup[i].id) {
            _item.isActive = true;
          } else {
            _item.isActive = false;
          }
        });

        // if current element has not been moved out of the view port,
        // keep current navigation item active, which means there
        // will always only the first element meets the condition
        // is active and it will change following the scroll
        break;
      }
    }
  }
}

function initWebsocket() {
  //NOTE - create websocket connection between the browser and
  //       server, the server will send the message when dependency
  //       project updates the config
  wsClient = new WebSocket(`${WS_SERVER_PATH}?root=${root.value}`);

  wsClient.onopen = () => {
    log.info("The websocket connected");
  };
  wsClient.onclose = () => {
    log.info(`The websocket connection of ${root.value} disconnected`);
  };

  wsClient.onmessage = async (data: any) => {
    log.info("data from websocket server", JSON.parse(data.data as string));
    const dataObj = JSON.parse(data.data as string);
    // only handle the `UpdateDependenciesConfig` message in this
    // `Configure` page
    if (dataObj.wsMsgType === WsMessageType.UpdateDependenciesConfig) {
      if (root.value) {
        // for sub-project, should update the config like the
        // build target that is changed from the main project
        await store.dispatch("fetchProjectConfig");
        await updateBuildTarget();
        // for main project, re-fetch dependency config to update
        await fetchDependencyConfig();
      }
    }
  };
}

async function saveConfig(configToMerge: { [k: string]: unknown }, forTarget = false) {
  try {
    if (config.value) {
      if (config.value.target && forTarget) {
        // save per project build target
        await store.dispatch("saveProjectBuildConfig", { [config.value.target]: configToMerge });
      }
      if (!forTarget) {
        // save on overall project config
        await store.dispatch("saveProjectConfig", configToMerge);
      }
    }
  } catch (error) {
    log.errMsgNCuz(error);
  }
}

async function saveProjectEnv(type: string, env: string | undefined) {
  let newEnvs = {} as ProjectEnv;
  if (
    config.value &&
    config.value.target &&
    config.value.buildTargets?.[config.value.target].envs
  ) {
    newEnvs = Object.assign({}, config.value.buildTargets?.[config.value.target].envs);
  }
  newEnvs[type as EnvType] = env ? env : "";
  await saveConfig({ envs: newEnvs }, true);

  if (
    config.value &&
    config.value.target &&
    config.value.buildTargets &&
    JSON.stringify(config.value.buildTargets[config.value.target].envs) !== JSON.stringify(newEnvs)
  ) {
    if (type === "ldflags") {
      updateManuallyFlag4Ldflags.value = true;
    } else if (type === "cflags") {
      updateManuallyFlag4Cflags.value = true;
    }
  }
}

async function saveProjectDataFiles(preloadFiles: string[] | undefined) {
  return saveConfig({ preloadFiles }, true);
}

async function saveProjectExportedFuncs(exportedFuncs: string | undefined) {
  await saveConfig({ exportedFuncs }, true);
  // Check if the exportedFuncs changed after requesting
  //
  // In most cases, the config will be updated and changes after
  // the requesting. Whereas, there is sometimes unusually
  // like changing `func1, func2, func1` from `func1,func2`,
  // but got `func1, func2` from the server because of the rules,
  // the props.value(config.buildTarget[target].exportedFuncs)
  // keeps the same, and the sub-component could not sync because
  // it cannot be detected by the watcher in sub-component.
  if (
    config.value &&
    config.value.target &&
    config.value.buildTargets &&
    config.value.buildTargets[config.value.target].exportedFuncs !== exportedFuncs
  ) {
    updateManuallyFlag4ExpFuncs.value = true;
  }
}

async function saveProjectExportedRuntimeMethods(exportedRuntimeMethods: string | undefined) {
  await saveConfig({ exportedRuntimeMethods }, true);
  if (
    config.value &&
    config.value.target &&
    config.value.buildTargets &&
    config.value.buildTargets[config.value.target].exportedRuntimeMethods !== exportedRuntimeMethods
  ) {
    updateManuallyFlag4ExpRTM.value = true;
  }
}

async function saveProjectOptions(opt: string) {
  let newOptions: { [k: string]: boolean } = {};

  if (
    config.value &&
    config.value.target &&
    config.value.buildTargets?.[config.value.target].options
  ) {
    newOptions = Object.assign({}, config.value.buildTargets?.[config.value.target].options);
  }

  if (Object.keys(newOptions).includes(opt)) {
    newOptions[opt] = !newOptions[opt];
  } else {
    // to handle new options added but we're still using the configs from older version
    Object.assign(newOptions, { [opt]: true });
  }
  return saveConfig({ options: newOptions }, true);
}

async function resetProjectConfig() {
  try {
    await store.dispatch("resetProjectConfig");
  } catch (error) {
    log.errMsgNCuz(error);
  } finally {
    alertReset.value = false;
  }
}

async function createOrChangeBuildTarget(value: string) {
  // if no target is defined in metadata yet, use 'static' as default
  if (config.value?.target !== value) {
    await store.dispatch("saveProjectConfig", {
      target: value,
    });
  }
}

async function updateDepTarget(target: string, dest: string) {
  if (root.value) {
    // update dependency project config
    const updatedConfig = await updateProjectConfigPart(root.value.concat("/", dest), {
      target,
    });
    store.commit("setDependencyConfig", { [dest]: updatedConfig });
    // update main project overallEnvs due to dependency target change
    await store.dispatch("updateProjectConfigDueToDepsUpdate");
  }
}

async function saveProjectPkgConfig(type: string, configVal: string | undefined) {
  let newConfig = {} as ProjectPkgConfig;
  if (
    config.value &&
    config.value.target &&
    config.value.buildTargets?.[config.value.target].pkgConfig
  ) {
    newConfig = Object.assign({}, config.value.buildTargets?.[config.value.target].pkgConfig);
  }
  newConfig[type as PkgConfigType] = configVal ? configVal : "";
  return saveConfig({ pkgConfig: newConfig }, true);
}

async function saveProjectNativeLib(type: string, infoVal: string | undefined) {
  let newInfo = {} as ProjectPkgInfo;
  if (config.value && config.value.nativeLibrary) {
    newInfo = Object.assign({}, config.value.nativeLibrary);
  }
  newInfo[type as PkgInfoType] = infoVal ? infoVal : "";
  return saveConfig({ nativeLibrary: newInfo });
}

async function fetchDependencyConfig() {
  // fetch dependency project configs
  if (config.value?.resolutions && config.value?.resolutions.length) {
    // fresh fetch for dependency configs
    store.commit("resetDependencyConfigs");
    await Promise.all(
      config.value?.resolutions.map(async (pkgResolution) => {
        await store.dispatch("fetchDependencyProjectConfig", pkgResolution);
      })
    );
  }
}

async function updateBuildTarget() {
  if (config.value?.target) {
    buildTarget.value = config.value?.target;
  } else {
    await store.dispatch("saveProjectConfig", {
      target: buildTarget.value,
    });
  }
}

onMounted(async () => {
  try {
    if (route.query.root) {
      store.commit("setRoot", route.query.root);
    }
    if (root.value) {
      await store.dispatch("fetchProjectConfig");
      await store.dispatch("fetchTemplateLiterals");

      await updateBuildTarget();

      await fetchDependencyConfig();

      // element has been rendered after mounted,assign value
      filterAllConfigElemRefObjArr();

      // scroll to the view to the specific configure part
      if (route.query.configParameterType) {
        switch (Number(route.query.configParameterType)) {
          case ConfigParameterTypes.nativeLibrary:
            elementClickHandler(ConfigElementId.Package);
            break;

          case ConfigParameterTypes.dependency:
            elementClickHandler(ConfigElementId.Dependencies);
            break;

          default:
            break;
        }
      }

      window.addEventListener("scroll", scrollEventHandler);

      // init websocket connection
      initWebsocket();
    }
  } catch (error) {
    log.errMsgNCuz(error);
  }
});

onUnmounted(() => {
  if (wsClient) {
    // close the websocket connection before leaving the page
    wsClient.close();
  }
});
</script>

<style lang="css" scoped>
.nav-body-position {
  position: -webkit-sticky;
  position: sticky;
  top: 20px;
  max-height: 80vh;
}

.config-body {
  width: 65%;
}

.active-section {
  color: rgb(33, 150, 243);
}
@media only screen and (max-width: 1279px) {
  .config-body {
    width: 75%;
  }
}
</style>
