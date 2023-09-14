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
import { useStore } from "../../store";
import Markdown from "../Markdown.vue";
import { computed } from "vue";
import { EditorType } from "../editor/customerEditor";

const props = defineProps<{
  action: webinizer.FileChangeAction;
  index: number;
}>();

const store = useStore();
const root = computed(() => store.state.root);

function convertToMarkdown() {
  const desc = props.action.desc;
  const fileDetails = ` [${props.action.region.file.replace(root.value, ".")}](/edit?type=${
    EditorType.FILE
  }&path=${encodeURIComponent(props.action.region.file)}) **_Line: ${
    props.action.region.lineStart
  } - ${props.action.region.lineEnd}_**`;

  return `${desc}\n\n${fileDetails}\n`;
}
</script>
