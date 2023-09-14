<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-card-text style="width: 400px" class="my-n4 d-flex justify-start align-center">
    <span class="text-left text-subtitle-2"> {{ props.label }}</span>

    <div class="mr-2">
      <v-radio-group
        v-model="modelValue"
        hide-details
        inline
        @update:model-value="$emit('update', $event)">
        <v-radio color="info" value="static">
          <template #label>
            <span class="text-subtitle-2"> {{ props.firstBtnLabel }} </span></template
          ></v-radio
        >
        <v-radio color="info" value="shared">
          <template #label
            ><span class="text-subtitle-2"> {{ props.secondBtnLabel }} </span></template
          ></v-radio
        >
      </v-radio-group>
    </div>

    <div ref="helpPopover" class="helpPopover" @mouseover="popoverPosition()">
      <v-icon size="x-small" variant="flat" icon="mdi-help-circle-outline"></v-icon>
      <div ref="popover" class="popover">
        <div ref="leftBar" class="leftBar"><span ref="popoverArrow"></span></div>
        <div>
          <div ref="tips" class="tips">Tips</div>
          <div
            ref="description"
            v-dompurify-html="props.tip || ''"
            class="description"
            style="white-space: pre-line"></div>
        </div>
      </div>
    </div>
  </v-card-text>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps<{
  label?: string;
  modelVal?: string;
  tip?: string;
  firstBtnLabel?: string;
  secondBtnLabel?: string;
}>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  (e: "update", value: string): void;
}>();

const helpPopover = ref<HTMLDivElement>();
const popover = ref<HTMLDivElement>();
const popoverArrow = ref<HTMLSpanElement>();
const leftBar = ref<HTMLDivElement>();
const tips = ref<HTMLDivElement>();
const description = ref<HTMLDivElement>();
const modelValue = ref(props.modelVal);

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

watch(
  () => props.modelVal,
  (_n) => {
    modelValue.value = _n;
  }
);
</script>
