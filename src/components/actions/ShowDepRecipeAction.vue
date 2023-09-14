<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <hr v-if="props.index > 0" class="mb-5 bl" />
  <v-card-item class="mx-auto mb-5">
    <Markdown
      :action-type="webinizer.ActionsTypes.ShowDepRecipe"
      :md-raw-content="convertToMarkdown()"></Markdown>
  </v-card-item>
</template>

<script setup lang="ts">
import * as webinizer from "../../webinizer";
import Markdown from "../Markdown.vue";
import { useStore } from "../../store";
import { log } from "../../helper";
import { onMounted, ref } from "vue";

const props = defineProps<{
  action: webinizer.ShowDepRecipeAction;
  index: number;
}>();

const store = useStore();
const depsRootMap = ref(new Map<string, string>());

onMounted(async () => {
  try {
    for (let dep of props.action.deps) {
      depsRootMap.value.set(dep, await webinizer.evalTemplateLiterals(store.state.root, dep));
    }
  } catch (error) {
    log.errMsgNCuz(error);
  }
});

function convertToMarkdown() {
  const desc = props.action.desc;
  const subTitle = `**_Dependency list:_**`;
  const optionsTableHeader = `| Project name | Link |`;
  const tableBorder = `| -------------- | :------------: |`;
  const deps = constructDeps();
  return `${desc}\n\n${subTitle}\n${optionsTableHeader}\n${tableBorder}\n${deps}`;
}

function constructDeps() {
  let result = ``;
  for (let dep of props.action.deps) {
    result += ` |  \`${dep}\` | **_[GOTO](/build?root=${encodeURIComponent(
      depsRootMap.value.get(dep) as string
    )})_**|\n`;
  }
  return result;
}
</script>
