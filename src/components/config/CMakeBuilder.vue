<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-card-text class="mt-n3"
    ><EditTextField
      :read-only="props.readOnly"
      :label="'Arguments for build'"
      :value="builderCopy.val.args"
      :no-need-save-instantly="noNeedSaveInstantly"
      :need-tip="true"
      :tip-content="generateTemplatesTips()"
      @change="changeArgs">
    </EditTextField
  ></v-card-text>

  <v-card-text
    ><EditTextField
      :read-only="props.readOnly"
      :label="'Working directory for build'"
      :value="builderCopy.val.rootBuildFilePath as string"
      :no-need-save-instantly="noNeedSaveInstantly"
      :need-tip="true"
      :tip-content="generateTemplatesTips()"
      @change="changeRootPath">
    </EditTextField
  ></v-card-text>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { useStore } from "../../store";
import { cloneDeep } from "lodash";
import { CMakeBuilder, Builder } from "../../webinizer";
import EditTextField from "./EditTextField.vue";

const props = defineProps<{
  builder: CMakeBuilder;
  isAdding?: boolean;
  readOnly?: boolean;
}>();

const emit = defineEmits<{ (e: "updateBuilder", value: Builder | undefined): void }>();

const store = useStore();

const noNeedSaveInstantly = props.isAdding ? ref(true) : ref(false);
const builderCopy = reactive({ val: cloneDeep(props.builder) });
const templates = computed(() => store.state.templateLiterals);

function changeArgs(v: string) {
  builderCopy.val.args = v;
  emit("updateBuilder", builderCopy.val);
}

function changeRootPath(v: string) {
  builderCopy.val.rootBuildFilePath = v;
  emit("updateBuilder", builderCopy.val);
}

function generateTemplatesTips(): string {
  return (
    `Below are the available template literals and their values for your reference:\n\n` +
    templates.value.join("\n\n")
  );
}

watch(
  () => props.builder,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (newVal, _) => {
    builderCopy.val = newVal;
  }
);
</script>
