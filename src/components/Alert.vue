<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-alert
    v-click-outside="onClickOutside"
    prominent
    class="alert"
    :color="props.color || 'pink-darken-1'"
    :icon="props.icon || 'mdi-delete'"
    :width="props.width || '300px'">
    <template #title
      ><div class="text-subtitle-1 font-weight-bold">{{ props.content }}</div></template
    >
    <template #text>
      <div class="d-flex justify-space-evenly mt-2">
        <v-btn variant="plain" size="small" @click="$emit(`confirm`)"> Yes </v-btn
        ><v-btn variant="plain" size="small" @click="$emit(`cancel`)"> Cancel </v-btn>
      </div>
    </template>
  </v-alert>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string;
  icon?: string;
  color?: string;
  width?: string;
}>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{ (e: "confirm"): void; (e: "cancel"): void }>();

const onClickOutside = () => {
  emit(`cancel`);
};
</script>

<style lang="scss" scoped>
.alert {
  position: fixed !important;
  z-index: 100;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 50px;
}

:deep(.v-alert__content) {
  margin-left: -28px;
}

:deep(.v-alert-title) {
  justify-content: center !important;
}
</style>
