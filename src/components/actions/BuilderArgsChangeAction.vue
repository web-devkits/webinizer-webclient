<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-card variant="outlined" class="mx-auto mb-2">
    <v-card-text class="text-subtitle-1">
      <v-icon class="mr-2" color="blue">mdi-hammer-wrench</v-icon>
      <span v-for="(line, idx) in props.action.desc.split('\n')" :key="idx" class="text-body-1"
        >{{ line }}<br
      /></span>
    </v-card-text>
    <v-card-text v-if="props.action.args.length" class="pt-0 pb-0">
      <v-card-header class="text-caption font-weight-bold font-italic mb-n6">{{
        "Build step " + props.action.builderID + " arguments to change: "
      }}</v-card-header>
      <v-container>
        <v-row v-for="(arg, idx) in props.action.args" :key="idx">
          <v-col cols="1"><v-icon>mdi-check</v-icon></v-col>
          <v-col align-self="start">
            <span>{{
              (arg.type === "merge" || arg.type === "replace" ? "Add " : "Delete ") +
              arg.option +
              (arg.value ? "=" + arg.value : "")
            }}</span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import * as webinizer from "../../webinizer";

const props = defineProps<{
  action: webinizer.BuilderArgsChangeAction;
}>();
</script>
