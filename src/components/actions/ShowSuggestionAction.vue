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
  action: webinizer.ShowSuggestionAction;
  index: number;
}>();

function convertToMarkdown() {
  const desc = props.action.desc;
  const beforeCodeSuggestion =
    props.action.suggestion && props.action.suggestion.before
      ? `**_Before_**\n\`\`\`\n${props.action.suggestion.before}\n\`\`\``
      : ``;
  const afterCodeSuggestion =
    props.action.suggestion && props.action.suggestion.after
      ? `**_After_**\n\`\`\`\n${props.action.suggestion.after}\n\`\`\``
      : ``;

  return `${desc}\n\n${beforeCodeSuggestion}\n${afterCodeSuggestion}`;
}
</script>
