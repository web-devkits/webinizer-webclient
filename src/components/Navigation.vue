<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-btn class="mx-3" :disabled="isDisabled('/')" :color="getColor('/')" @click="toHome"
    >Home</v-btn
  >
  <v-btn
    class="mx-3"
    :disabled="isDisabled('/config')"
    :color="getColor('/config')"
    @click="toConfig"
    >Config</v-btn
  >
  <v-btn class="mx-3" :disabled="isDisabled('/build')" :color="getColor('/build')" @click="toBuild"
    >Build</v-btn
  >
  <v-btn
    class="mx-3"
    :disabled="isDisabledHrefWithParam('/edit')"
    :color="getColorHrefWithParam('/edit')"
    @click="toEdit"
    >Edit</v-btn
  >
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { EditorType } from "./editor/customerEditor";

const router = useRouter();

function isDisabled(href: string): boolean {
  return router.currentRoute.value.fullPath === href;
}

function isDisabledHrefWithParam(href: string): boolean {
  return router.currentRoute.value.fullPath.indexOf(href) > -1;
}

function getColor(href: string): string {
  return isDisabled(href) ? "orange" : "white";
}

function getColorHrefWithParam(href: string): string {
  return isDisabledHrefWithParam(href) ? "orange" : "white";
}

async function toHome() {
  await router.push({ path: "/" });
}

async function toConfig() {
  await router.push({ path: "/config" });
}

async function toBuild() {
  await router.push({ path: "/build" });
}

async function toEdit() {
  await router.push({ path: "/edit", query: { type: EditorType.FILE, path: "" } });
}
</script>
