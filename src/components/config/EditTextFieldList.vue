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
        <div ref="helpPopover" class="helpPopover" @mouseover="popoverPosition()">
          <v-btn
            v-if="props.needTip && props.tipContent"
            icon="mdi-help-circle-outline"
            size="x-small"
            variant="flat">
          </v-btn>

          <div v-if="props.needTip && props.tipContent" ref="popover" class="popover">
            <div ref="leftBar" class="leftBar">
              <span ref="popoverArrow"></span>
            </div>
            <div>
              <div ref="tips" class="tips">Tips</div>
              <!-- eslint-disable vue/no-v-html -->
              <div
                ref="description"
                v-dompurify-html="props.tipContent || ''"
                class="description"
                style="white-space: pre-line"></div>
            </div>
          </div>
        </div>
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
import { ref, watch, reactive, onMounted } from "vue";
import { cloneDeep } from "lodash";
import EditTextField from "./EditTextField.vue";

const props = defineProps<{
  title?: string;
  value?: string[];
  label?: string;
  needNav?: boolean;
  needAdd?: boolean;
  needTip?: boolean;
  tipContent?: string;
}>();

const emit = defineEmits<{
  (e: "change", value: string[] | undefined): void;
  (e: "delete"): void;
}>();

const rules = [(v: string) => !!v || "The path can't be empty!"];

const isAdding = ref(false);
const helpPopover = ref<HTMLDivElement>();
const popover = ref<HTMLDivElement>();
const popoverArrow = ref<HTMLSpanElement>();
const leftBar = ref<HTMLDivElement>();
const tips = ref<HTMLDivElement>();
const description = ref<HTMLDivElement>();
const initValArr = reactive({ valArr: cloneDeep(props.value) || [] });

function popoverPosition() {
  let left = helpPopover.value?.getBoundingClientRect().left || 0;
  let top = helpPopover.value?.getBoundingClientRect().top || 0;
  let height = popover.value?.clientHeight || 0;
  left = left + 20;
  let topnew = top - height / 2.0 + 3;

  if (left && top && height) {
    let style = `left: ${left}px; top: ${topnew}px; width: 400px;`;
    tips.value?.setAttribute("style", "width: 390px;");
    description.value?.setAttribute("style", "width: 390px;");
    popover.value?.setAttribute("style", style);
    popoverArrow.value?.setAttribute("style", `left: ${left + 2}px; top: ${top + 4}px`);
  }

  if (left * top * height == 0) {
    popover.value?.setAttribute("style", "left: 50%; top: 50%; transform: translate(-50%, -50%);");
    leftBar.value?.setAttribute("style", "display: none;");
  }
}

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

onMounted(() => {
  return {
    helpPopover,
    popover,
    popoverArrow,
    leftBar,
    tips,
    description,
  };
});

watch(
  () => props.value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (newVal, _) => {
    initValArr.valArr = cloneDeep(newVal) || [];
  }
);
</script>
