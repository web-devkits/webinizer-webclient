<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <section v-if="!root" class="banner flex-center text-center">
    <div>
      <h1>Edit</h1>
      <h2>No project selected. Please select a project first.</h2>
    </div>
  </section>
  <v-container v-else>
    <v-dialog v-model="openDialog">
      <v-card width="600px" class="mx-auto">
        <v-card-item> <v-card-title class="text-h6 pb-4"> Open File </v-card-title></v-card-item>

        <v-card-text>
          <v-text-field
            v-model="newFilePath"
            class="mb-2"
            variant="outlined"
            color="blue"
            label="Relative path of file"
            placeholder="Please input relative path of file.">
          </v-text-field>

          <v-btn
            v-if="newFilePath !== ''"
            location="center"
            variant="outlined"
            color="blue"
            class="otlshadow mb-n2"
            size="small"
            @click="
              openDialog = false;
              openFile(newFilePath);
            ">
            Ok
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="saveDialog">
      <v-card width="600px" class="mx-auto"
        ><v-card-item>
          <v-card-title class="text-h6 pb-4"> Save New File </v-card-title></v-card-item
        >

        <v-card-text>
          <v-text-field
            v-model="newFilePath"
            class="mb-2"
            variant="outlined"
            color="blue"
            label="Relative path of file"
            placeholder="Please input relative path of file.">
          </v-text-field>
          <v-btn
            v-if="newFilePath !== ''"
            location="center"
            variant="outlined"
            color="blue"
            class="otlshadow mb-n2"
            size="small"
            @click="
              saveDialog = false;
              serverCommand(newFilePath, 'saveAsNewFile');
            ">
            Ok
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <div class="g8fr2fr pb-3 justify-space-around">
      <div class="container text-left d-flex align-center">
        <span v-if="routePath" class="font-weight-bold pr-2" style="white-space: nowrap"
          >You are editing:</span
        >
        <span
          v-if="routePath"
          class="path"
          :title="`&#x200E;` + String(routePath).replace(root, `.`)"
          >{{ `&#x200E;` + String(routePath).replace(root, ".") }}</span
        >
      </div>

      <div class="text-right">
        <v-btn color="blue" size="small" append-icon="mdi-folder">
          File
          <v-menu activator="parent">
            <v-list style="padding: 0 !important; min-width: 140px">
              <v-list-item class="my-1">
                <v-list-item-title>
                  <v-btn
                    variant="text"
                    min-width="140px"
                    color="blue"
                    size="small"
                    append-icon="mdi-folder-plus-outline"
                    @click="openNewFile()">
                    New File
                  </v-btn></v-list-item-title
                >
              </v-list-item>

              <v-list-item class="mb-1">
                <v-list-item-title>
                  <v-btn
                    variant="text"
                    min-width="140px"
                    color="blue"
                    size="small"
                    append-icon="mdi-folder-open-outline"
                    @click="openDialog = true">
                    Open file
                  </v-btn></v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </div>
    </div>

    <v-container>
      <v-row no-gutters>
        <v-col cols="3">
          <v-expansion-panels v-model="panels" variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title color="grey-lighten-3" class="text-overline">
                PROJECT EXPLORER
              </v-expansion-panel-title>
              <v-expansion-panel-text eager>
                <div class="text-left">
                  <v-list open-strategy="multiple">
                    <FileDirList
                      :files="store.state.fileDirTree"
                      @selected="setFileEditorPath($event)">
                    </FileDirList>
                  </v-list></div
              ></v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title color="grey-lighten-3" class="text-overline"
                >OPENED FILES</v-expansion-panel-title
              >
              <v-expansion-panel-text eager>
                <FileList
                  :files="store.state.openFiles"
                  :root="root"
                  @selected="setFileEditorPath($event)"></FileList
              ></v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>

        <v-col cols="9">
          <Editor
            ref="editor"
            :type="Number(route.query.type === undefined ? EditorType.FILE : route.query.type)"
            :path="String(route.query.path === undefined ? '' : route.query.path)"
            :resource-type="
              String(route.query.resourceType === undefined ? 'file' : route.query.resourceType)
            "
            :display="true"
            @hide-actions="hideActionsButtons"></Editor>

          <div v-if="!hideActionsFlag" class="mt-6">
            <v-btn
              variant="outlined"
              color="blue"
              class="otlshadow mr-6"
              append-icon="mdi-content-save"
              @click="saveDialog = true">
              Save As
            </v-btn>
            <v-btn
              v-if="routePath"
              class="mainbtn"
              append-icon="mdi-content-save-outline"
              color="blue"
              @click="serverCommand(routePath as string, 'updateFileContent')">
              Save
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
<script setup lang="ts">
/*
  eslint-disable
    @typescript-eslint/no-unsafe-member-access,
    @typescript-eslint/no-unsafe-call
 */

import Editor from "../components/editor/Editor.vue";
import { useRoute } from "vue-router";
import { computed, ref, onMounted } from "vue";
import { EditorType } from "../components/editor/customerEditor";
import { useStore } from "../store";
import FileList from "../components/FileList.vue";
import FileDirList from "../components/FileDirList.vue";
import { log } from "../helper";
import { useToast } from "vue-toastification";

const store = useStore();
const route = useRoute();
const toast = useToast();

const panels = ref([0]);
const newFilePath = ref("");
const routePath = ref(route.query.path);
const openDialog = ref(false);
const saveDialog = ref(false);
const hideActionsFlag = ref(false);
const editor = ref<InstanceType<typeof Editor>>();
const root = computed(() => store.state.root);

function openNewFile() {
  routePath.value = null;
  editor.value?.openNewFile();
}

function hideActionsButtons(flag: boolean) {
  hideActionsFlag.value = flag;
}

async function setFileEditorPath(path: string) {
  if (path.length) {
    try {
      await editor.value?.setFileEditorPath(path);
      routePath.value = path;
    } catch (error) {
      log.errMsgNCuz(error);
    }
  }
}

async function openFile(relPath: string) {
  try {
    const absFilePath = relPath.trim().startsWith(`./`)
      ? relPath.trim().replace(".", root.value)
      : `${root.value}/${relPath.trim()}`;

    await editor.value?.openFile(absFilePath);
    routePath.value = absFilePath;
    await selectFileDir();
  } catch (error) {
    log.errMsgNCuz(error);
  }
}

async function serverCommand(path: string, command: string) {
  if (path.length) {
    try {
      switch (command) {
        case "updateFileContent":
          await editor.value?.updateFileContent();
          break;

        case "saveAsNewFile": {
          const absFilePath = path.trim().startsWith(`./`)
            ? path.trim().replace(".", root.value)
            : `${root.value}/${path.trim()}`;
          await editor.value?.saveAsNewFile(absFilePath);
          routePath.value = absFilePath;
          await store.dispatch("getFileDirPath", absFilePath);
          await selectFileDir();
          break;
        }
        default:
          return;
      }
      toast.success("Save file successfully!");
    } catch (error) {
      log.errMsgNCuz(error);
    }
  }
}

async function selectFileDir() {
  const path = routePath.value ? routePath.value : root.value;
  if (path) {
    try {
      await store.dispatch("getSelectedFileDirPath", path);
      const array = String(path).split("/");
      if (array.length < 3) return;

      let part = "/" + array[1]; // part = /project
      let item: HTMLElement | null;

      for (let i = 2; i < array.length; i++) {
        part += "/" + array[i];
        item = document.getElementById(part);
        /** NOTE - if current directory is active and in opened status
         *         should not click this directory dom, otherwise
         *         the directory will be collapsed
         *         if `v-list` is expand, the classList will contain
         *         the `v-list-item-active` (defined in `vuetify`)
         */
        if (item && !item.classList.contains("v-list-item--active")) {
          item.click();
        }
      }
      setTimeout(() => item && item.scrollIntoView(), 500);
    } catch (error) {
      log.errMsgNCuz(error);
    }
  }
}

onMounted(async () => {
  try {
    if (!root.value) return;
    await store.dispatch("fetchFileDirPath");
    await selectFileDir();
  } catch (error) {
    log.errMsgNCuz(error);
  }
});
</script>

<style lang="scss" scoped>
.container {
  max-width: 65vw;
}
.path {
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  white-space: nowrap;
  max-width: 100%;
}

.v-dir-list {
  max-height: 400px;
  margin: auto;
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid var(--black-03);
  border-radius: 5px;
}

.v-dir-list:hover {
  border: 1px solid var(--black-1);
  box-shadow: 1px 3px 5px 0px rgb(35 100 210 / 10%);
}

.editorlists {
  max-width: 226px;
  overflow: auto;
}

.v-container {
  padding: 0 !important;
}

.block {
  display: block !important;
  margin-top: 10px;
  font-size: 0.8rem !important;
}

.v-card--variant-elevated {
  box-shadow: none;
}

.v-label {
  cursor: default;
}

.newopenfile {
  padding: 0px 18px;
  min-width: 140px;
}

.g8fr2fr {
  display: grid;
  grid-template-columns: 80fr 20fr;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 0px;
}

// set the height for active expansion panel
.v-expansion-panel--active > .v-expansion-panel-title {
  min-height: 36px !important;
}

.v-expansion-panel-title {
  min-height: 36px !important;
  padding: 10px 6px;
}

:deep(.v-expansion-panel) {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 65vh !important;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 !important;
}

:deep(.v-list) {
  margin: 0;
  padding: 0 8px !important;
}

:deep(.v-list-item) {
  min-height: auto !important;
}

:deep(.v-list-item-title) {
  font-size: 0.8rem !important;
}

:deep(.v-list-group--prepend) {
  --parent-padding: calc(var(--indent-padding) - 8px) !important;
}
</style>
