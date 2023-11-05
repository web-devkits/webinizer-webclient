<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-card variant="elevated" class="text-left" flat>
    <v-card-item class="mb-10">
      <v-card-title class="d-flex">
        <div>{{ propsVal.title }}</div>
        <template v-if="propsVal.needTip && propsVal.tipContent"
          ><TipPopover type="M" :tip-content="propsVal.tipContent"></TipPopover
        ></template>
      </v-card-title>
    </v-card-item>

    <v-card-text v-if="initValArr.valArr.length > 0" class="mt-n8">
      <v-chip-group v-model="chipGroupModelVal" column multiple class="ma-2">
        <v-chip
          v-for="(val, idx) in initValArr.valArr || []"
          :key="idx"
          :value="val"
          :disabled="propsVal.defaultItems?.includes(val)"
          color="blue"
          class="mb-4"
          filter
          :variant="propsVal.defaultItems?.includes(val) ? `tonal` : `outlined`"
          >{{ val }}</v-chip
        >
        <span v-if="propsVal.needAdd && !isAdding">
          <v-icon
            size="large"
            class="ma-2"
            color="blue"
            icon="mdi-plus"
            @click="isAdding = true"></v-icon>
        </span>

        <span v-if="chipGroupModelVal.length > 0">
          <v-icon
            size="large"
            class="ma-2"
            color="red"
            icon="mdi-close"
            @click="deleteItem"></v-icon>
        </span>
      </v-chip-group>
    </v-card-text>

    <v-card-text v-if="isAdding">
      <EditTextField
        :is-adding="isAdding"
        :label="propsVal.itemLabel"
        :rules="propsVal.rules"
        @change="addItem($event)"
        @cancel-add="isAdding = false"></EditTextField>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
/*
  eslint-disable
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/no-unused-vars
 */
import { ref, reactive, watch } from "vue";
import { cloneDeep } from "lodash";
import TipPopover from "../TipPopover.vue";
import EditTextField from "./EditTextField.vue";

const chipGroupModelVal = ref<string[]>([]);

const propsVal = defineProps<{
  title?: string;
  value?: string[];
  /**
   * The items that can't be modified.
   */
  defaultItems?: string[];
  itemLabel: string;
  needAdd?: boolean;
  rules?: any;
  needTip?: boolean;
  tipContent?: string;
}>();

const emit = defineEmits<{
  (e: "change", value: string[] | undefined): void;
}>();

const isAdding = ref(false);
const initValArr = reactive({ valArr: cloneDeep(propsVal.value) || [] });

function deleteItem() {
  const valueCopy = cloneDeep(initValArr.valArr) || [];
  const result = valueCopy.filter((v) => !Object.values(chipGroupModelVal.value).includes(v));
  emit("change", result);
  chipGroupModelVal.value = [];
}

function addItem(val: string) {
  const valueCopy = cloneDeep(initValArr.valArr) || [];
  // detect possible duplication
  if (!valueCopy.includes(val)) {
    valueCopy.push(val);
    emit("change", valueCopy);
  }
}

watch(
  () => propsVal.value,
  (newVal, _) => {
    initValArr.valArr = cloneDeep(newVal) || [];
  }
);
</script>

<style lang="scss" scoped></style>
