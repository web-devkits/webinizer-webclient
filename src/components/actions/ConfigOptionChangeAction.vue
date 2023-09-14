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
  action: webinizer.ConfigOptionChangeAction;
  index: number;
}>();

const OptionsDisplayNameObj = {
  needMainLoop: "Infinite main loop",
  needCppException: "C++ exception",
  needSimd: "SIMD support",
  needPthread: "Pthread",
  needModularize: "Modularize JS output",
};

type configOptionStr = keyof typeof OptionsDisplayNameObj;

function convertToMarkdown() {
  const desc = props.action.desc;
  const subTitle = `**_Config option to change:_**`;
  const optionsTableHeader = `| Configurations | Target status |`;
  const tableBorder = `| -------------- | :------------: |`;
  const options = constructTableOptions();
  return `${desc}\n\n${subTitle}\n${optionsTableHeader}\n${tableBorder}\n${options}`;
}

function constructTableOptions() {
  let result = ``;
  for (const optKey of Object.keys(props.action.partToUpdate)) {
    result = `|\`${convertOptionToDisplayName(optKey as configOptionStr)}\`|**_${
      props.action.partToUpdate[optKey] ? "`Enable`" : "`Disable`"
    }_**|\n`;
  }
  return result;
}

function convertOptionToDisplayName(option: configOptionStr): string {
  return OptionsDisplayNameObj[option];
}
</script>
