<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-card class="text-left">
    <v-list v-if="props.files">
      <v-list-item
        v-for="(item, idx) in props.files"
        :key="idx"
        :value="item"
        active-color="blue"
        @click="selected(item)">
        <template #title>
          <span :title="`&#x200E;` + item.replace(root, `.`)">{{
            `&#x200E;` + item.replace(root, `.`)
          }}</span>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  root: string;
  files: string[];
}>();

const emit = defineEmits<{
  (e: "selected", value: string): void;
}>();

function selected(path: string) {
  emit("selected", path);
}
</script>

<style lang="scss" scoped>
:deep(.v-list-item-title > span) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fol {
  height: 204px;
  margin: auto;
  width: auto;
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid var(--black-03);
  border-radius: 5px;
  direction: rtl;
}

.fol:hover {
  border: 1px solid var(--black-1);
  box-shadow: 1px 3px 5px 0px rgb(35 100 210 / 10%);
}

.v-card-text {
  color: var(--p-8);
}

.v-card-text svg path {
  fill: var(--p-8);
}
:deep(.v-list-item-title) {
  direction: rtl !important;
}

:deep(.v-list) {
  margin: 0;
  padding: 0 8px !important;
}

:deep(.v-list-item) {
  min-height: auto !important;
  padding: 0px 8px !important;
}

:deep(.v-list-item-title) {
  font-size: 0.8rem !important;
}
</style>
