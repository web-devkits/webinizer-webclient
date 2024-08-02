<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-menu v-model="iconsMenu" :close-on-content-click="false" location="end">
    <template #activator="{ props }">
      <v-avatar
        style="cursor: pointer"
        :image="
          propsVal.selectedIcon
            ? propsVal.selectedIcon?.isUploaded
              ? prefix4ProjIcon + propsVal.selectedIcon?.name
              : prefix4DefaultIcon + propsVal.selectedIcon?.name
            : ''
        "
        color="indigo"
        v-bind="props"
        @click="$emit('getIcons')"
        >Icon</v-avatar
      >
    </template>

    <v-card max-height="400" width="400">
      <v-toolbar height="20"
        ><v-icon class="ml-n2" icon="mdi-menu"></v-icon>
        <v-toolbar-title>Select icon</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- only when project is created and users have uploaded icons -->
        <template v-if="propsVal.showAction && propsVal.existUploadIcon">
          <v-btn v-if="!inEditingMode" variant="text" @click="inEditingMode = true">edit</v-btn>
          <v-btn v-else class="mr-n2" variant="text" @click="inEditingMode = false"
            >cancel</v-btn
          ></template
        >
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-file-input
              accept="image/*"
              color="blue"
              label="Upload from local"
              prepend-icon="mdi-image-area"
              variant="outlined"
              :rules="rules"
              :model-value="propsVal.uploadIcon"
              :show-size="1000"
              @click:clear="$emit('clear')"
              @change="$emit('upload', $event)">
              <template #selection="{ fileNames }">
                <template v-for="fileName in fileNames" :key="fileName">
                  <v-chip size="small" label color="blue" class="me-1">
                    {{ fileName }}
                  </v-chip>
                </template>
              </template>

              <template #append>
                <v-btn
                  v-if="showAction"
                  size="small"
                  color="blue"
                  variant="flat"
                  :disabled="propsVal.uploadIcon.length === 0"
                  @click="$emit('uploadImmediately')"
                  >upload</v-btn
                >
              </template>
            </v-file-input>
          </v-col>
          <v-col v-for="(obj, idx) in propsVal.icons" :key="idx" class="d-flex child-flex" cols="3">
            <v-img
              :style="inEditingMode ? `` : `cursor: pointer`"
              max-height="70px"
              max-width="70px"
              aspect-ratio="1"
              cover
              class="bg-grey-lighten-2"
              :src="obj?.isUploaded ? prefix4ProjIcon + obj?.name : prefix4DefaultIcon + obj?.name"
              @click="
                () => {
                  if (inEditingMode) return;
                  else emit('change', obj);
                }
              ">
              <!-- only the icon that is uploaded and not used can be removed -->
              <v-badge
                v-if="inEditingMode && obj.isUploaded && obj.name !== propsVal.selectedIcon?.name"
                floating
                color="error"
                offset-x="-50"
                offset-y="5"
                ><template #badge
                  ><span style="cursor: pointer" @click.stop="$emit('removeIcon', obj)"
                    >X</span
                  ></template
                ></v-badge
              >

              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col> </v-row
      ></v-container>
    </v-card>
  </v-menu>
</template>
<script lang="ts" setup>
import { useStore } from "../store";
import { computed, ref, watch } from "vue";
import { API_SERVER, ProjectIcon } from "../webinizer";

const store = useStore();
const iconsMenu = ref(false);
const inEditingMode = ref(false);

const root = computed(() => store.state.root);

const prefix4DefaultIcon = `${API_SERVER}/assets/icons/default/`;
const prefix4ProjIcon = `${API_SERVER}/api/projects/${encodeURIComponent(root.value)}/icons/`;

const rules = [
  /* eslint-disable */
  (value: any) => {
    return (
      !value || !value.length || value[0].size < 1024 * 1024 || "Size should be less than 1 MB!"
    );
  },
];

const propsVal = defineProps<{
  icons: ProjectIcon[] | undefined;
  selectedIcon: ProjectIcon | undefined;
  uploadIcon: File[];
  // whether to show the upload button
  // 'true' when project root is filled
  showAction?: boolean;
  // the flag to decide whether to show the edit button
  // 'true' when users have uploaded icons for this project
  existUploadIcon?: boolean;
}>();

const emit = defineEmits<{
  (e: "upload", value: Event): void;
  (e: "change", value: ProjectIcon): void;
  (e: "clear"): void;
  (e: "getIcons"): void;
  (e: "uploadImmediately"): void;
  (e: "removeIcon", value: ProjectIcon): void;
}>();

watch(
  () => propsVal.existUploadIcon,
  async (_n) => {
    if (_n === false) {
      inEditingMode.value = false;
    }
  }
);
</script>

<style scoped>
.v-field__field > .v-file-input {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px;
}
</style>
