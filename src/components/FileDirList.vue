<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <template v-if="propsObj.files">
    <template v-for="(items, idx) in propsObj.files" :key="idx">
      <template v-if="items.type === 'directory'">
        <v-list-group collapse-icon="mdi-chevron-down" expand-icon="mdi-chevron-right">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :id="items.path"
              :title="items.name"
              :prepend-icon="props.appendIcon"
              class="v-list-item-icon--start v-list-group--prepend"
              @click="checkDir(items)"></v-list-item>
          </template>
          <FileDirList v-if="items.children" :files="items.children" @selected="clicked($event)">
          </FileDirList>
        </v-list-group>
      </template>
      <template v-else>
        <v-list-item
          :id="items.path"
          :title="items.name"
          :value="items"
          class="v-list-item--prepend"
          prepend-icon="mdi-file-outline"
          active-color="blue"
          @click="clicked(items.path)">
        </v-list-item>
      </template> </template
  ></template>
</template>

<script setup lang="ts">
import * as webinizer from "../webinizer";
import { useStore } from "../store";
import { log } from "../helper";

const propsObj = defineProps<{
  files: webinizer.DTreeNode[];
}>();

const emit = defineEmits<{
  (e: "selected", value: string): void;
}>();

const store = useStore();

function clicked(path: string) {
  emit("selected", path);
}

async function checkDir(items: webinizer.DTreeNode) {
  if (!items.children) {
    await getFileDirPath(items);
  }
}

async function getFileDirPath(items: webinizer.DTreeNode) {
  try {
    const dir = await webinizer.getFileDirPath(store.state.root, items.path);
    items.children = dir.tree.children;
  } catch (error) {
    log.errMsgNCuz(error);
  }
}
</script>

<style lang="scss" scoped>
:deep(.v-list-item-icon--start) {
  margin-inline-start: -8px !important;
  margin-inline-end: 4px !important;
}

:deep(.v-list-item--prepend) {
  margin-inline-start: 0px !important;
}

:deep(.v-list-item__append) {
  grid-area: prepend !important;
  margin-left: -48px !important;
}

:deep(.v-list-item__prepend) {
  margin-right: -30px !important;
}

:deep(.v-list) {
  padding-left: 25px !important;
}
</style>
