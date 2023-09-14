<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-text-field
    v-if="!isAdding"
    ref="field"
    v-model="editValue"
    variant="outlined"
    color="blue"
    :class="['mt-n6', props.readOnly ? 'text-readonly' : '']"
    :clearable="!props.readOnly"
    :readonly="props.readOnly"
    :label="props.label"
    :rules="rules"
    @blur="onblur_handler()">
    <template v-if="supportDelete" #prepend>
      <v-icon
        size="small"
        class="delete-icon"
        icon="mdi-minus-circle-outline"
        @click="alert = true"></v-icon>
    </template>

    <template v-if="editStatus === EditStatus.DEFAULT && props.needTip && props.tipContent" #append>
      <div ref="helpPopover" class="helpPopover" @mouseover="popoverPosition()">
        <v-icon size="x-small" variant="flat" icon="mdi-help-circle-outline"></v-icon>
        <div ref="popover" class="popover">
          <div ref="leftBar" class="leftBar"><span ref="popoverArrow"></span></div>
          <div>
            <div ref="tips" class="tips">Tips</div>
            <div
              ref="description"
              v-dompurify-html="props.tipContent || ''"
              class="description"
              style="white-space: pre-line"></div>
          </div>
        </div></div
    ></template>

    <template v-else-if="editStatus === EditStatus.UPDATING" #append>
      <v-fade-transition leave-absolute>
        <v-progress-circular size="24" color="info" indeterminate></v-progress-circular>
      </v-fade-transition>
      <div
        v-if="props.needTip && props.tipContent"
        ref="helpPopover"
        class="helpPopover"
        @mouseover="popoverPosition()">
        <v-icon size="x-small" variant="flat" icon="mdi-help-circle-outline"></v-icon>
        <div ref="popover" class="popover">
          <div ref="leftBar" class="leftBar"><span ref="popoverArrow"></span></div>
          <div>
            <div ref="tips" class="tips">Tips</div>
            <div
              ref="description"
              v-dompurify-html="props.tipContent || ''"
              class="description"
              style="white-space: pre-line"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="editStatus === EditStatus.DONE" #append>
      <v-icon large icon="mdi-check-bold" color="blue"></v-icon>
      <div
        v-if="props.needTip && props.tipContent"
        ref="helpPopover"
        class="helpPopover"
        @mouseover="popoverPosition()">
        <v-icon size="x-small" variant="flat" icon="mdi-help-circle-outline"></v-icon>
        <div v-if="props.needTip && props.tipContent" ref="popover" class="popover">
          <div ref="leftBar" class="leftBar"><span ref="popoverArrow"></span></div>
          <div>
            <div ref="tips" class="tips">Tips</div>
            <div
              ref="description"
              v-dompurify-html="props.tipContent || ''"
              class="description"
              style="white-space: pre-line"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="editStatus === EditStatus.FAIL" #append>
      <v-icon large icon="mdi-alert-circle-outline" color="#f5381b"></v-icon>
      <div
        v-if="props.needTip && props.tipContent"
        ref="helpPopover"
        class="helpPopover"
        @mouseover="popoverPosition()">
        <v-icon size="x-small" variant="flat" icon="mdi-help-circle-outline"></v-icon>
        <div v-if="props.needTip && props.tipContent" ref="popover" class="popover">
          <div ref="leftBar" class="leftBar"><span ref="popoverArrow"></span></div>
          <div>
            <div ref="tips" class="tips">Tips</div>
            <div
              ref="description"
              v-dompurify-html="props.tipContent || ''"
              class="description"
              style="white-space: pre-line"></div>
          </div>
        </div>
      </div>
    </template>
  </v-text-field>

  <v-text-field
    v-else
    v-model="editNewItem"
    clearable
    color="blue"
    variant="outlined"
    class="mt-n6 rounded"
    :label="props.label"
    :rules="rules">
    <template v-if="editNewItem" #append
      ><v-icon
        size="small"
        color="blue"
        icon="mdi-checkbox-marked-circle-outline"
        @click="addItem"></v-icon>
    </template>

    <template #prepend>
      <v-icon
        size="small"
        class="delete-icon"
        icon="mdi-minus-circle-outline"
        @click="cancelItem"></v-icon>
    </template>
  </v-text-field>

  <Transition name="slide-fade">
    <Alert
      v-if="alert"
      content="Are you sure to delete?"
      @confirm="deleteItem()"
      @cancel="alert = false"></Alert
  ></Transition>
</template>

<script setup lang="ts">
/*
  eslint-disable
    @typescript-eslint/no-unsafe-member-access,
    @typescript-eslint/no-unsafe-assignment,
    @typescript-eslint/no-unsafe-call,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/no-unused-vars
 */
import Alert from "../Alert.vue";
import { nextTick, ref, watch, onMounted } from "vue";

const props = defineProps<{
  noNeedSaveInstantly?: boolean;
  supportDelete?: boolean;
  isAdding?: boolean;
  readOnly?: boolean;
  value?: string;
  label?: string;
  typeName?: string;
  placeholder?: string;
  needTip?: boolean;
  tipContent?: string;
  rules?: any;
  hasError?: boolean;
}>();

const emit = defineEmits<{
  (e: "change", value: string): void;
  (e: "changeWithType", type: string, value: string): void;
  (e: "delete"): void;
  (e: "cancelAdd"): void;
}>();

enum EditStatus {
  DEFAULT = 0,
  UPDATING,
  DONE,
  FAIL,
}

const alert = ref(false);
const editNewItem = ref("");
const field = ref<any>();
const editValue = ref(props.value);
const editStatus = ref(EditStatus.DEFAULT);

const helpPopover = ref<HTMLDivElement>();
const popover = ref<HTMLDivElement>();
const popoverArrow = ref<HTMLSpanElement>();
const leftBar = ref<HTMLDivElement>();
const tips = ref<HTMLDivElement>();
const description = ref<HTMLDivElement>();

function popoverPosition() {
  let left = helpPopover.value?.getBoundingClientRect().left || 0;
  let top = helpPopover.value?.getBoundingClientRect().top || 0;
  let height = popover.value?.clientHeight || 0;
  left = left + 20;
  let topnew = top - height / 2.0 + 3;

  if (left && top && height) {
    let style = `left: ${left}px; top: ${topnew}px`;
    popover.value?.setAttribute("style", style);
    popoverArrow.value?.setAttribute("style", `left: ${left + 2}px; top: ${top + 4}px`);
  }

  if (left * top * height == 0) {
    popover.value?.setAttribute("style", "left: 50%; top: 50%; transform: translate(-50%, -50%);");
    leftBar.value?.setAttribute("style", "display: none;");
  }
}

function cancelItem() {
  emit("cancelAdd");
  editNewItem.value = "";
}

function deleteItem() {
  emit("delete");
  alert.value = false;
}

async function addItem() {
  emit("change", editNewItem.value.trim());
  await nextTick(() => {
    emit("cancelAdd");
    editNewItem.value = "";
  });
}

async function onblur_handler() {
  /*
   * if props.rules is not set, which means that this text field
   * does not need to validate, emit event directly, else should
   * pass the validation before emitting.
   */
  const _value = editValue.value ? editValue.value.trim() : "";

  if (props.rules && props.rules.length > 0) {
    const valid = await field.value?.validate();
    if (valid && valid.length > 0) return;
  }

  if ((_value && _value === props.value) || (!_value && !props.value)) {
    return;
  }

  if (props.typeName) {
    emit("changeWithType", props.typeName, _value);
  } else {
    emit("change", _value);
  }

  if (!props.noNeedSaveInstantly) {
    editStatus.value = EditStatus.UPDATING;
  }
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
  (newVal, _) => {
    if (newVal !== editValue.value) {
      editValue.value = newVal;
    }

    if (!props.noNeedSaveInstantly) {
      editStatus.value = EditStatus.DONE;

      setTimeout(() => {
        editStatus.value = EditStatus.DEFAULT;
      }, 1500);
    }
  }
);

watch(
  () => props.hasError,
  (newVal) => {
    if (newVal === true && !props.noNeedSaveInstantly) {
      editStatus.value = EditStatus.FAIL;

      setTimeout(() => {
        editStatus.value = EditStatus.DEFAULT;
      }, 2000);
    }
  }
);
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

.text-readonly {
  color: rgba(0 0 0 / 30%);
}

.text-readonly .popover {
  color: rgba(0 0 0 / 87%);
}
</style>
