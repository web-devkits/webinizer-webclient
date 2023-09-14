<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-card variant="outlined" class="mx-auto mb-2">
    <v-card-text class="text-subtitle-1">
      <v-icon class="mr-2" color="blue">mdi-account-voice</v-icon>
      <span v-for="(line, idx) in props.action.desc.split('\n')" :key="idx" class="text-body-2"
        >{{ line }}<br
      /></span>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import * as webinizer from "../../webinizer";

const props = defineProps<{
  action: webinizer.IAction;
}>();
</script>
