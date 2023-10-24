<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-card variant="elevated" flat>
    <v-card-item class="text-left mb-10">
      <v-card-title class="d-flex">
        <div>{{ props.title }}</div>
        <template v-if="props.needTip && props.tipContent"
          ><TipPopover type="L" :tip-content="props.tipContent"></TipPopover
        ></template>
      </v-card-title>
    </v-card-item>

    <template v-if="initValArr">
      <v-card-text v-for="(v, idx) in initValArr.valArr" :key="idx" class="d-flex text-left">
        <EditTextField
          support-delete
          :value="initValArr.valArr[idx]"
          :label="props.label"
          :rules="rules"
          @change="changeItem(idx, $event)"
          @delete="deleteItem(idx)"></EditTextField>
      </v-card-text>

      <v-card-text v-if="isAdding">
        <EditTextField
          need-delete
          :is-adding="isAdding"
          :label="props.label"
          :rules="rules"
          @change="changeItem(props.value !== undefined ? props.value.length : 0, $event)"
          @cancel-add="isAdding = false"></EditTextField>
      </v-card-text>

      <v-card-actions v-if="props.needAdd" class="mt-n6">
        <v-spacer></v-spacer>
        <v-btn v-if="!isAdding" color="blue" icon="mdi-plus" @click="isAdding = true"></v-btn>
        <v-spacer></v-spacer>
      </v-card-actions> </template
  ></v-card>
</template>

<script setup lang="ts">
/*
  eslint-disable
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/no-unused-vars
 */
import { ref, watch, reactive } from "vue";
import { cloneDeep } from "lodash";
import EditTextField from "./EditTextField.vue";
import TipPopover from "../TipPopover.vue";

const props = defineProps<{
  title?: string;
  value?: string[];
  label?: string;
  needNav?: boolean;
  needAdd?: boolean;
  needTip?: boolean;
  tipContent?: string;
  rules?: any;
}>();

const emit = defineEmits<{
  (e: "change", value: string[] | undefined): void;
  (e: "delete"): void;
}>();

const isAdding = ref(false);
const initValArr = reactive({ valArr: cloneDeep(props.value) || [] });

function changeItem(idx: number, v?: string) {
  const valueCopy = cloneDeep(initValArr.valArr) || [];
  if (v) valueCopy[idx] = v;
  emit("change", valueCopy);
}

function deleteItem(idx: number) {
  const valueCopy = cloneDeep(initValArr.valArr) || [];
  valueCopy.splice(idx, 1);
  emit("change", valueCopy);
}

watch(
  () => props.value,
  (newVal, _) => {
    initValArr.valArr = cloneDeep(newVal) || [];
  }
);
</script>
