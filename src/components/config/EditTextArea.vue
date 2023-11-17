<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <v-textarea
    :ref="fieldArea"
    :readonly="readOnly"
    :model-value="refValue"
    :label="label"
    :rows="rows"
    :rules="rules"
    color="blue"
    :class="['mt-n6', props.readOnly ? 'text-readonly' : '']"
    density="comfortable"
    variant="outlined"
    @update:model-value="change($event)"
    @blur="onBlurHandler()">
    <template v-if="editStatus === EditStatus.UPDATING" #append>
      <v-fade-transition leave-absolute>
        <v-progress-circular size="24" color="info" indeterminate></v-progress-circular>
      </v-fade-transition>
    </template>
    <template v-else-if="editStatus === EditStatus.DONE" #append>
      <v-icon large icon="mdi-check-bold" color="blue"></v-icon> </template
  ></v-textarea>
</template>

<script setup lang="ts">
/*
  eslint-disable
    @typescript-eslint/no-unsafe-member-access,
    @typescript-eslint/no-unsafe-assignment,
    @typescript-eslint/no-unsafe-call,
    @typescript-eslint/no-explicit-any
 */
import { ref, watch } from "vue";
import { EditStatus } from "../../common/types/config";

const props = defineProps<{
  readOnly?: boolean;
  noNeedSaveInstantly?: boolean;
  rows?: number;
  rules?: any;
  value?: string;
  label?: string;
}>();

const emit = defineEmits<{
  (e: "change", value: string): void;
}>();

const refValue = ref(props.value);
const editStatus = ref(EditStatus.DEFAULT);
const fieldArea = ref<any>();

function change(val: string) {
  if (val === undefined) return;
  refValue.value = val;
}

async function onBlurHandler() {
  const _value = refValue.value ? refValue.value.trim() : "";

  if (props.rules && props.rules.length > 0) {
    const valid = await fieldArea.value?.validate();
    if (valid && valid.length > 0) return;
  }

  if ((_value && _value === props.value) || (!_value && !props.value)) {
    return;
  }

  emit("change", _value);
  if (!props.noNeedSaveInstantly) {
    //UPDATING the value to back-end server
    editStatus.value = EditStatus.UPDATING;
  }
}

watch(
  () => props.value,
  (_n) => {
    if (_n !== refValue.value) {
      refValue.value = _n;
    }

    if (!props.noNeedSaveInstantly) {
      editStatus.value = EditStatus.DONE;

      setTimeout(() => {
        //reset the status to DEFAULT after 1500ms.
        editStatus.value = EditStatus.DEFAULT;
      }, 1500);
    }
  }
);
</script>

<style scoped>
.text-readonly {
  color: rgba(0 0 0 / 30%);
}

.text-readonly .popover {
  color: rgba(0 0 0 / 87%);
}
</style>
