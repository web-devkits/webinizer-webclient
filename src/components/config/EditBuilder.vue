<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <v-card class="mx-auto" width="100%" variant="elevated">
    <v-card-text v-if="props.isAdding" class="pb-10">
      <div class="add_build_step_wrapper" style="position: relative">
        <section id="select_label"><label>Build tools type: </label></section>
        <section id="select_option">
          <label class="custom_select">
            <select v-model="selectedVal" @change="changeBuilderType(selectedVal)">
              <option disabled selected style="display: none" value=""></option>
              <option v-for="(opt, idx) in getBuilderSelections()" :key="idx" :value="opt.value">
                {{ opt.title }}
              </option>
            </select></label
          >
        </section>
      </div>
    </v-card-text>

    <v-card-text v-else class="text-left">
      <v-select
        persistent-hint
        label="Build tools types"
        density="comfortable"
        class="mb-8"
        :disabled="!props.enableStepManage"
        :items="getBuilderSelections()"
        :hint="builderCopy?.buildVal?.desc"
        :model-value="builderCopy?.buildVal?.__type__"
        @update:modelValue="
          changeBuilderType($event);
          $emit('change', builderCopy.buildVal);
        "></v-select
    ></v-card-text>
    <component
      :is="
        specialUIs[builderCopy.buildVal.__type__]
          ? specialUIs[builderCopy.buildVal.__type__]
          : CMakeBuilder
      "
      v-if="builderCopy.buildVal && builderCopy.buildVal.__type__"
      :builder="builderCopy.buildVal"
      :is-adding="props.isAdding"
      :read-only="!props.enableStepManage && !props.isAdding"
      @update-builder="updateBuilderVal"></component>

    <v-card-actions class="mt-n5"
      ><v-btn v-if="enableStepManage" color="pink accent-2" @click="fireDelete">DELETE</v-btn>
    </v-card-actions>
    <v-card-actions v-if="isAdding"
      ><v-spacer></v-spacer
      ><v-btn
        class="otlshadow"
        variant="outlined"
        color="blue"
        @click="$emit('change', builderCopy.buildVal)"
        >Save</v-btn
      ><v-btn class="otlshadow" variant="outlined" color="blue" @click="onCancelAdding()">
        Cancel </v-btn
      ><v-spacer></v-spacer
    ></v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
/*
  eslint-disable
    @typescript-eslint/no-non-null-assertion,
    @typescript-eslint/no-unused-vars
 */
import { ref, reactive, watch, computed } from "vue";
import { cloneDeep } from "lodash";
import { Builder } from "../../webinizer";
import { useStore } from "../../store";
import CMakeBuilder from "./CMakeBuilder.vue";
import NativeBuilder from "./NativeBuilder.vue";

const props = defineProps<{
  label?: string;
  builder?: Builder;
  isAdding?: boolean;
  enableStepManage?: boolean;
}>();

const emit = defineEmits<{
  (e: "change", value: Builder | undefined): void;
  (e: "delete"): void;
  (e: "cancelAdding"): void;
}>();

/*
 * Beside the general stuff, each Builder may have its own
 * special configuration settings.
 * So far, several UI are the same so shared the CMakeBuilder
 */
const specialUIs: { [k: string]: unknown } = {
  CMakeBuilder: CMakeBuilder,
  ConfigureBuilder: CMakeBuilder,
  MakeBuilder: CMakeBuilder,
  EmccBuilder: CMakeBuilder,
  NativeBuilder: NativeBuilder,
};
const newBuilderCache: { [k: string]: Builder } = {};

const store = useStore();

const alert = ref(false);
const selectedVal = ref("");
const builderCopy = reactive({
  buildVal: cloneDeep(props.builder),
});
const availableBuilders = computed(() => store.state.availableBuilders);

/*
 * In edit mode, when we switch between builder types, we hope to
 * retain configurations previously made.
 * e.g. select CMake first, add some args, then switch to
 * configure, and switch back toCMake, typically we don't want to
 * reenter the args for CMake, so we cached previous state here
 */
if (props.builder) {
  newBuilderCache[props.builder.__type__] == builderCopy.buildVal;
}

function getBuilderSelections(): { title: string; value: string }[] {
  const selections = [];
  if (availableBuilders.value) {
    for (const k of availableBuilders.value) {
      selections.push({
        title: k.desc,
        value: k.__type__,
      });
    }
  }
  return selections;
}

function changeBuilderType(v: string) {
  if (builderCopy.buildVal) {
    newBuilderCache[builderCopy.buildVal.__type__] = builderCopy.buildVal;
  }
  if (v in newBuilderCache) {
    builderCopy.buildVal = newBuilderCache[v];
  } else {
    builderCopy.buildVal = cloneDeep(
      availableBuilders.value?.filter((builder) => builder.__type__ === v)[0]
    );
  }
}

function updateBuilderVal(v: Builder | undefined) {
  builderCopy.buildVal!.args = v!.args;
  builderCopy.buildVal!.rootBuildFilePath = v!.rootBuildFilePath;
  builderCopy.buildVal!.needInstall = v!.needInstall;
  if (!props.isAdding) {
    emit("change", builderCopy.buildVal);
  }
}

function fireDelete() {
  emit("delete");
  alert.value = false;
}

function onCancelAdding() {
  emit("cancelAdding");
}

watch(
  () => props.builder,
  (_n, _o) => {
    builderCopy.buildVal = cloneDeep(_n);
  }
);
</script>
<style lang="scss" scoped>
.add_build_step_wrapper {
  display: grid;
  grid-template-columns: 4fr 10fr;
  grid-column-gap: 0px;
  justify-items: stretch;
}
#select_label {
  font-size: 14px;
  padding: 25px 0 15px 0;
  margin: 0;
}
#select_option {
  padding: 15px 0 0 0;
}
.custom_select {
  width: 100%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  border-radius: 5px;
  padding: 10px 0px 10px 0px;
  margin-left: -15px;
  /* Styling the select background */
  background-color: rgba(100, 100, 111, 0.2);
  -webkit-appearance: none;
  -moz-appearance: none;
  &::-ms-expand {
    display: none;
  }
  select {
    font-size: 14px;
    width: 100%;
    margin-top: 10px;
    outline: none;
    cursor: pointer;
    background-color: transparent;
    color: black;
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 5px;
    &::-ms-expand {
      display: none;
    }
  }
  &:after {
    position: absolute;
    top: 2em;
    left: 31em;
    /* Styling the down arrow */
    width: 0;
    height: 0;
    padding: 0;
    content: "";
    border-left: 0.35em solid transparent;
    border-right: 0.35em solid transparent;
    border-top: 0.5em solid black;
  }
}
@-moz-document url-prefix() {
  .custom-select select {
    padding-right: 1.75em;
  }
}
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .custom-select select {
    padding-right: 2em;
  }
}
.v-card--variant-elevated {
  border: 1px solid var(--black-03) !important;
  box-shadow: none !important;
}

.v-card-text:hover .v-card--variant-elevated {
  border: 1px solid var(--black-1) !important;
  box-shadow: 1px 3px 5px 0px rgb(35 100 210 / 10%) !important;
}
</style>
