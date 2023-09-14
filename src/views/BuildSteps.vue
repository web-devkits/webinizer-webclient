<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <section class="banner flex-center text-center b2">
    <div>
      <h1>{{ getProjectName(route.query.root as string, config) }} Build Steps</h1>
      <h2>
        How did you build your native project? Modify the native build steps accordingly to build
        for the web.
      </h2>
    </div>
  </section>
  <div class="mx-auto w-75">
    <v-card flat>
      <template v-if="root">
        <RadioButtons
          label="Choose build target :"
          first-btn-label="Static"
          second-btn-label="Shared"
          :tip="tip"
          :model-val="buildTarget"
          @update="createOrChangeBuildTarget"></RadioButtons>
        <EditBuilderList
          v-if="config?.target"
          :builders="config?.buildTargets?.[config.target]?.builders"
          @change="saveProjectBuilders"></EditBuilderList
      ></template>
      <v-card v-else flat>
        <v-card-text>
          <p class="text-center">
            Please add a new project or select an existing project at first.
          </p>
        </v-card-text></v-card
      >

      <v-card-actions
        ><v-btn color="info" prepend-icon="mdi-arrow-left" @click="router.push({ path: '/basic' })"
          >Basic</v-btn
        ></v-card-actions
      >
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useStore } from "../store";
import { useRouter, useRoute } from "vue-router";
import { Builder } from "../webinizer";
import EditBuilderList from "../components/config/EditBuilderList.vue";
import { getProjectName } from "../common/utility/utility";
import { log } from "../helper";
import RadioButtons from "../components/config/RadioButtons.vue";

const tip =
  "Select the <b>static</b> build target if you want to build your project with static linking. All dependent libraries will be built into Wasm archive files (.a), and then linked to the main project to get a standalone Wasm module with no external dependencies.\n\nSelect the <b>shared</b> build target if you want to build your project with dynamic linking. All dependent libraries will be built into Wasm binary files (.wasm/.so) as side modules (using flag -sSIDE_MODULE), whose exports will be dynamically imported into the context of main project's Wasm module (using flag -sMAIN_MODULE) by JavaScript glue code.\n\nMore details for static and dynamic linking are available <a href='https://emscripten.org/docs/compiling/Dynamic-Linking.html' target='_blank'>here</a>.";

const store = useStore();
const router = useRouter();
const route = useRoute();

const buildTarget = ref("static");
const config = computed(() => store.state.projectConfig);
const root = computed(() => store.state.root);

onMounted(async () => {
  try {
    if (route.query.root) {
      store.commit("setRoot", route.query.root);
    }

    if (root.value) {
      await store.dispatch("fetchProjectConfig");
      await store.dispatch("fetchTemplateLiterals");

      if (config.value?.target) {
        buildTarget.value = config.value?.target;
      } else {
        await store.dispatch("saveProjectConfig", {
          target: buildTarget.value,
        });
      }
    }
  } catch (error) {
    log.errMsgNCuz(error);
  }
});

async function saveProjectBuilders(builders: Builder[] | undefined) {
  try {
    if (config.value && config.value.target)
      await store.dispatch("saveProjectBuildConfig", { [config.value.target]: { builders } });
  } catch (error) {
    log.errMsgNCuz(error);
  }
}

async function createOrChangeBuildTarget(value: string) {
  // if no target is defined in metadata yet, use 'static' as default
  if (config.value?.target !== value) {
    await store.dispatch("saveProjectConfig", {
      target: value,
    });
  }
}
</script>
<style lang="scss" scoped></style>
