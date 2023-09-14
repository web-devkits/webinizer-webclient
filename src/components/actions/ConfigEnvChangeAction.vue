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
  action: webinizer.ConfigEnvChangeAction;
  index: number;
}>();

function convertToMarkdown() {
  const desc = props.action.desc;
  const subTitleCpFlag = props.action.partToUpdate.cflags ? `**_Compiler flags to change:_**` : "";
  const cpFlagOptions = props.action.partToUpdate.cflags ? constructCompilerFlags() : "";

  const subTitleLkFlag = props.action.partToUpdate.ldflags ? `**_Linker flags to change:_**` : "";
  const lkFlagOptions = props.action.partToUpdate.ldflags ? constructLinkerFlags() : "";

  return `${desc}\n\n${subTitleCpFlag}\n${cpFlagOptions}\n${subTitleLkFlag}\n${lkFlagOptions}\n`;
}

function constructCompilerFlags() {
  let result = ``;
  for (const flagObj of props.action.partToUpdate.cflags) {
    result += `- ${flagObj.type === "merge" || flagObj.type === "replace" ? "Add " : "Delete "} \`${
      flagObj.option
    }${flagObj.value ? "=" + String(flagObj.value) : ""}\`\n`;
  }
  return result;
}

function constructLinkerFlags() {
  let result = ``;
  for (const flagObj of props.action.partToUpdate.ldflags) {
    result += `- ${flagObj.type === "merge" || flagObj.type === "replace" ? "Add " : "Delete "} \`${
      flagObj.option
    }${flagObj.value ? "=" + String(flagObj.value) : ""}\`\n`;
  }
  return result;
}
</script>
