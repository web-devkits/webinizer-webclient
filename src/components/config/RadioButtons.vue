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

    <TipPopover type="L" :tip-content="props.tip || ``"></TipPopover>
  </v-card-text>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import TipPopover from "../TipPopover.vue";

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

const modelValue = ref(props.modelVal);

watch(
  () => props.modelVal,
  (_n) => {
    modelValue.value = _n;
  }
);
</script>
