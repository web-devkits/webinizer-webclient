<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-list lines="three">
    <v-list-item class="mb-4 text-left">
      <template #title>
        <span class="text-h6 font-weight-medium"> {{ props.title }}</span>
      </template>

      <template #subtitle>
        <span :title="props.subTitle"
          >{{
            props.subTitle?.includes(".")
              ? props.subTitle?.substring(0, props.subTitle.indexOf("."))
              : props.subTitle
          }}.</span
        >
      </template>

      <template #append>
        <v-switch
          :model-value="props.value === undefined ? false : props.value"
          color="blue"
          @change="change"></v-switch>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
const props = defineProps<{
  value?: boolean;
  optionType?: string;
  title?: string;
  subTitle?: string;
}>();

const emit = defineEmits<{
  (e: "change", value: string): void;
}>();

function change() {
  emit("change", props.optionType as string);
}
</script>

<style lang="scss" scoped>
.v-list {
  margin: 0;
  padding: 0 8px !important;
}

.v-list-item {
  min-height: auto !important;
  padding: 0px 8px !important;
}

.v-list-item-title {
  font-size: 0.8rem !important;
}
</style>
