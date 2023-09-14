<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <span class="text-body-1 text-decoration-underline">{{ relPath }}</span>
  <span class="ml-3 text-body-1" style="color: red">
    Line: {{ region.lineStart }} - {{ region.lineEnd }}</span
  >
</template>

<script setup lang="ts">
import * as webinizer from "../webinizer";
import { computed, ref } from "vue";
import { useStore } from "../store";

const props = defineProps<{
  region: webinizer.FileRegion;
}>();

const store = useStore();

const root = computed(() => store.state.root);
let relPath = ref(props.region.file.replace(root.value, "."));
</script>
