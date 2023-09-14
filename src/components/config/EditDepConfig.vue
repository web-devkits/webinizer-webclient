<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-card class="mx-auto" width="100%" variant="elevated">
    <v-card-item
      ><v-card-title class="d-flex align-center justify-space-between">
        <a class="modulelink" :title="'Go to the project page'" @click="navigateToProject()">{{
          props.config.name
        }}</a>

        <v-menu
          v-if="props.config.requiredBy && Object.keys(props.config.requiredBy)"
          open-on-hover>
          <!-- eslint-disable-next-line vue/no-template-shadow -->
          <template #activator="{ props }">
            <v-btn size="small" variant="text" color="info" v-bind="props"> required-By </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, idx) in Object.keys(props.config.requiredBy)"
              :key="idx"
              density="compact">
              <v-list-item-title>{{ item }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title></v-card-item
    >
    <v-card-text class="text-left">
      <v-select
        persistent-hint
        label="Build target"
        density="comfortable"
        :items="getAvailableTargets()"
        :model-value="getTarget()"
        @update:model-value="changeBuildTarget"></v-select
    ></v-card-text>
    <v-card-text
      ><EditTextField
        read-only
        :label="'Prefix'"
        :value="getTargetPkgConfig()?.prefix"
        :need-tip="true"
        :tip-content="templatesTips">
      </EditTextField
    ></v-card-text>
    <v-card-text
      ><EditTextField
        read-only
        :label="'Compiler flags'"
        :value="getTargetPkgConfig()?.cflags"
        :need-tip="true"
        :tip-content="templatesTips">
      </EditTextField
    ></v-card-text>
    <v-card-text
      ><EditTextField
        read-only
        :label="'Linker flags'"
        :value="getTargetPkgConfig()?.ldflags"
        :need-tip="true"
        :tip-content="templatesTips">
      </EditTextField></v-card-text
  ></v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ProjectConfig, ProjectPkgConfig, getAllTemplateLiterals } from "../../webinizer";
import { useStore } from "../../store";
import { log } from "../../helper";
import { useRouter } from "vue-router";
import EditTextField from "./EditTextField.vue";

const props = defineProps<{
  dest: string;
  config: ProjectConfig;
}>();

const emit = defineEmits<{
  (e: "change", target: string, dest: string): void;
}>();

const store = useStore();
const router = useRouter();

const templatesTips = ref("");
const root = computed(() => store.state.root);

function getAvailableTargets(): string[] {
  if (props.config.buildTargets) {
    return Object.keys(props.config.buildTargets);
  }
  return [];
}

function getTarget(): string {
  if (props.config.target) return props.config.target;
  else {
    const targets = getAvailableTargets();
    if (targets.length) return targets[0];
    else return "";
  }
}

function getTargetPkgConfig(): ProjectPkgConfig | undefined {
  if (props.config.buildTargets) {
    if (props.config.target) {
      return props.config.buildTargets[props.config.target].pkgConfig;
    } else {
      return props.config.buildTargets[Object.keys(props.config.buildTargets)[0]].pkgConfig;
    }
  }
}

function changeBuildTarget(target: string) {
  emit("change", target, props.dest);
}

function navigateToProject() {
  if (root.value) {
    const depRoot = root.value.concat("/", props.dest);
    window
      .open(router.resolve({ path: "/basic", query: { root: depRoot } }).href, depRoot)
      ?.focus();
  }
}

onMounted(async () => {
  try {
    if (root.value) {
      const templates = await getAllTemplateLiterals(root.value.concat("/", props.dest));
      templatesTips.value =
        `Below are the available template literals and their values for your reference:\n\n` +
        templates.join("\n\n");
    }
  } catch (error) {
    log.errMsgNCuz(error);
  }
});
</script>

<style lang="css" scoped>
.modulelink {
  color: var(--p-6);
  max-width: 300px;
  width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  direction: rtl;
}

.modulelink:hover {
  color: var(--p);
  text-decoration: underline;
  cursor: pointer;
}
</style>
