<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-card variant="elevated" class="text-left" flat>
    <v-card-title class="d-flex">
      <div>{{ propsVal.title }}</div>
      <template v-if="propsVal.needTip && propsVal.tipContent"
        ><TipPopover type="L" :tip-content="propsVal.tipContent"></TipPopover
      ></template>
    </v-card-title>

    <v-card-text>
      <template v-for="(val, idx) in initValArr.valArr || []" :key="idx">
        <v-hover v-slot="{ isHovering, props }">
          <v-chip
            v-bind="props"
            :value="val"
            class="ma-2"
            :color="propsVal.defaultItems?.includes(val) ? 'default' : 'blue'"
            ><template v-if="isHovering && !propsVal.defaultItems?.includes(val)" #append>
              <v-icon
                class="ml-2 display-keywords"
                color="blue"
                icon="mdi-close-circle"
                size="small"
                variant="plain"
                @click="deleteItem(idx)"></v-icon>
            </template>
            {{ val }}</v-chip
          ></v-hover
        >
      </template>
      <span v-if="propsVal.needAdd" class="ma-2">
        <v-btn
          v-if="!isAdding"
          color="blue"
          icon="mdi-plus"
          class="add-keywords"
          variant="plain"
          @click="isAdding = true"></v-btn>
      </span>
    </v-card-text>

    <v-card-text v-if="propsVal.needAdd && isAdding" class="ma-2">
      <EditTextField
        need-delete
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

function deleteItem(idx: number) {
  const valueCopy = cloneDeep(initValArr.valArr) || [];
  valueCopy.splice(idx, 1);
  emit("change", valueCopy);
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

<style lang="scss" scopes>
.v-btn__content .v-icon .display-keywords {
  opacity: 0.8 !important;
}

.v-btn__content .v-icon .add-keywords {
  opacity: 0.2 !important;
}
</style>
