<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <div v-dompurify-html="mdToHTML(props.mdRawContent)" class="markdown-body"></div>
</template>
<script setup lang="ts">
import { marked } from "marked";
import * as webinizer from "../webinizer";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css";

const props = defineProps<{
  mdRawContent: string;
  actionType?: webinizer.ActionsTypes;
}>();

marked.setOptions({
  highlight: (code) => {
    return hljs.highlightAuto(code).value;
  },
});

function mdToHTML(mdRaw: string) {
  let HTMLResult = marked.parse(mdRaw);
  if (props.actionType === webinizer.ActionsTypes.ShowDepRecipe) {
    HTMLResult = HTMLResult.replace(/<a href=/g, `<a target="_blank" href=`);
  }

  return HTMLResult;
}
</script>
<style lang="scss" scoped>
:deep(ul li) {
  list-style: inside;
}
</style>
