<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <div style="width: 100%">
    <v-expansion-panels class="recipes mb-3">
      <v-expansion-panel v-for="(item, index) in [props.recipe]" :key="index">
        <v-expansion-panel-title class="text-left">
          <v-icon class="mr-3" color="grey">mdi-view-headline</v-icon>
          <v-toolbar-title>{{ item.desc }}</v-toolbar-title>
          <template v-if="item.advisor !== 'DepBuildAdvisor'">
            <v-btn
              v-show="checkActionsType()"
              class="ma-1 mainbtn"
              size="small"
              color="blue"
              :disabled="disabledIgnoreFromClicking || disabledApplyBtn"
              :loading="loadingApplyBtn && props.keys === setLastApplyRecipeIndex"
              @click.stop="applyRecipeAndBuild">
              Apply Recipe
              <v-icon> mdi-check </v-icon>
            </v-btn>
            <v-btn
              v-if="item.showNoAdvisor"
              class="ma-1"
              size="small"
              color="default"
              :disabled="disabledIgnoreFromClicking || disabledIgnoreBtn"
              @click.stop="disableAdvisor">
              IGNORE <v-icon> mdi-delete-alert-outline </v-icon>
            </v-btn></template
          >
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card variant="text" class="mt-n4 mb-n7">
            <v-card-text>
              <template v-for="(action, i) in item.actions" :key="i">
                <Action class="text-left" :index="i" :action="action"></Action></template
            ></v-card-text>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
import * as webinizer from "../webinizer";
import lodash from "lodash";
import Action from "./Action.vue";
import { useStore } from "../store";
import { computed, onMounted, watch, ref } from "vue";
import { log } from "../helper";

const props = defineProps<{
  recipe: webinizer.Recipe;
  keys: number;
  disabledAdvisors?: { [k: string]: boolean };
}>();

const store = useStore();

const disabledApplyBtn = ref(false);
const loadingApplyBtn = ref(false);
const disabledIgnoreBtn = ref(false);

const root = computed(() => store.state.root);
const buildStatusType = computed(() => store.state.buildingStatus);
const setLastApplyRecipeIndex = computed(() => store.state.lastApplyRecipeIndex);

const disabledIgnoreFromClicking = computed(() =>
  props.disabledAdvisors ? props.recipe.advisor in props.disabledAdvisors : false
);

const applyRecipeAndBuildWithDebounce = lodash.debounce(
  async () => {
    try {
      store.commit("setBuildingStatus", "building_with_recipes");
      store.commit("setLastApplyRecipeIndex", props.keys);
      await store.dispatch("applyRecipesAndBuild", [props.recipe]);
    } catch (error) {
      log.errMsgNCuz(error);
    }
  },
  1000,
  {
    leading: true,
    trailing: false,
  }
);

function checkActionsType(): boolean {
  // hide the `APPLY RECIPE` btn if the recipe just contains suggestion type
  for (let i = 0; i < props.recipe.actions.length; i++) {
    if (props.recipe.actions[i].__type__ !== "ShowSuggestion") {
      return true;
    }
  }
  return false;
}

async function applyRecipeAndBuild() {
  await applyRecipeAndBuildWithDebounce();
}

async function disableAdvisor() {
  try {
    await store.dispatch("disableAdvisor", props.recipe.advisor);
  } catch (error) {
    log.errMsgNCuz(error);
  }
}

onMounted(() => {
  if (root.value) {
    // if user refresh or re-enter the page, should keep
    // the build status
    if (buildStatusType.value === "building_with_recipes") {
      loadingApplyBtn.value = true;
      disabledApplyBtn.value = true;
      disabledIgnoreBtn.value = true;
    } else if (buildStatusType.value === "building") {
      disabledIgnoreBtn.value = true;
    }
  }
});

watch(
  () => buildStatusType.value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (_n, _o) => {
    if (_n === "building") {
      disabledApplyBtn.value = true;
      loadingApplyBtn.value = false;
      disabledIgnoreBtn.value = true;
    } else if (_n === "building_with_recipes") {
      loadingApplyBtn.value = true;
      disabledApplyBtn.value = true;
      disabledIgnoreBtn.value = true;
    } else {
      disabledApplyBtn.value = false;
      loadingApplyBtn.value = false;
      disabledIgnoreBtn.value = false;
    }
  }
);
</script>
