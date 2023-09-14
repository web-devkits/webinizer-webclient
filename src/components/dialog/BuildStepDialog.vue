<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <div class="text-center">
    <v-dialog v-model="dialog">
      <template #activator="{ props }">
        <span v-bind="props"> Add Step <v-icon icon="mdi-plus-thick"></v-icon> </span>
      </template>

      <v-card flat style="width: 500px" class="mx-auto">
        <v-card-item> <v-card-title> New Build Step </v-card-title> </v-card-item>
        <EditBuilderVue
          is-adding
          @cancel-adding="dialog = false"
          @change="saveBuildStep"></EditBuilderVue>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import EditBuilderVue from "../config/EditBuilder.vue";
import { Builder } from "../../webinizer";
import { ref } from "vue";

const emits = defineEmits<{ (e: "change", value: Builder | undefined): void }>();

const dialog = ref(false);

function saveBuildStep(build: Builder | undefined) {
  emits("change", build);
  dialog.value = false;
}
</script>
