<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <hr v-if="props.index > 0" class="mb-5 bl" />
  <v-card-item class="mx-auto mb-5">
    <Markdown :md-raw-content="convertToMarkdown()"></Markdown>
  </v-card-item>
</template>

<script setup lang="ts">
import * as webinizer from "../../webinizer";
import Markdown from "../Markdown.vue";

const props = defineProps<{
  action: webinizer.BuildStepChangeAction;
  index: number;
}>();

function convertToMarkdown() {
  const desc = props.action.desc;
  const subTitle = `**_${
    props.action.newBuildSteps.length
      ? props.action.region.iStart === props.action.region.iEnd
        ? "Add"
        : "Replace"
      : "Delete"
  } below build step(s) at step \`${String(props.action.region.iStart + 1)}\`_**`;

  const table = constructTable();
  return `${desc}\n\n${subTitle}\n${table}\n`;
}

function constructTable() {
  let row1st = `| **Type** |`;
  let row2nd = `| **Arguments** |`;
  let row3rd = `| **Working directory** |`;
  let tableBorder = `| :-------------- |`;

  for (let val of props.action.newBuildSteps) {
    row1st += `\`${val.desc}\`|`;
    tableBorder += ` :------------: |`;
    row2nd += `\`${val.args}\`|`;
    row3rd += `\`${val.rootBuildFilePath}\`|`;
  }

  return `${row1st}\n${tableBorder}\n${row2nd}\n${row3rd}\n`;
}
</script>
