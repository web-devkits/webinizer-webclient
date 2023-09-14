<!--
 *  Copyright (C) 2023 Intel Corporation. All rights reserved.
 *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
 *  SPDX-License-Identifier: Apache-2.0
 -->
<template>
  <p>
    <component
      :is="getActionComponent(action.__type__)"
      :action="action"
      :index="props.index"></component>
  </p>
</template>

<script setup lang="ts">
import * as webinizer from "../webinizer";
import GeneralAction from "./actions/GeneralAction.vue";
import FileChangeAction from "./actions/FileChangeAction.vue";
import ShowSuggestionAction from "./actions/ShowSuggestionAction.vue";
import ConfigEnvChangeAction from "./actions/ConfigEnvChangeAction.vue";
import ConfigOptionChangeAction from "./actions/ConfigOptionChangeAction.vue";
import BuilderArgsChangeAction from "./actions/BuilderArgsChangeAction.vue";
import ShowDepRecipeAction from "./actions/ShowDepRecipeAction.vue";
import BuildStepChangeAction from "./actions/BuildStepChangeAction.vue";

const props = defineProps<{
  action: webinizer.IAction;
  index: number;
}>();

const actionComponents = new Map<string, unknown>([
  ["FileChange", FileChangeAction],
  ["ShowSuggestion", ShowSuggestionAction],
  ["ConfigEnvChange", ConfigEnvChangeAction],
  ["ConfigOptionChange", ConfigOptionChangeAction],
  ["BuilderArgsChange", BuilderArgsChangeAction],
  ["ShowDepRecipe", ShowDepRecipeAction],
  ["BuildStepChange", BuildStepChangeAction],
]);

function getActionComponent(type: string): unknown {
  return actionComponents.get(type) || GeneralAction;
}
</script>
<style lang="scss" scoped>
.v-card--variant-outlined {
  border: 1px solid var(--black-03);
  border-radius: 5px;
  box-shadow: none !important;
  background-color: var(--p-001);
}

.v-card--variant-outlined:hover {
  border: 1px solid var(--black-03);
  box-shadow: 1px 3px 5px 0px rgb(35 100 210 / 10%);
  background-color: var(--black-03);
}
</style>
