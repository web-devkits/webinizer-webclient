<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <section class="banner flex-center text-center b3">
    <div>
      <h1 v-if="buildStatusType !== 'building_with_recipes' && buildStatusType !== 'building'">
        Build {{ getProjectName(route.query.root as string, config) }}
      </h1>
      <div v-if="!root" class="mx-auto">No project selected. Please select a project first.</div>
      <div v-else class="mx-auto">
        <div
          v-if="
            !(
              config?.target &&
              config?.buildTargets?.[config.target].builders &&
              (config?.buildTargets?.[config.target].builders || []).length > 0
            )
          ">
          No build step found, please add build steps first.
        </div>
        <section
          v-if="buildStatusType === 'building_with_recipes' || buildStatusType === 'building'"
          class="flex-center text-center align-center mb-6">
          <div id="loader">
            <div id="shadow"></div>
            <div id="box"></div>
            <div class="text-center mt-6">
              Building {{ getProjectName(route.query.root as string, config) }}, please wait ...
            </div>
          </div>
        </section>
        <div v-if="recipes !== undefined && recipes.length > 0">
          <h2 v-if="buildStatusType !== 'building_with_recipes' && buildStatusType !== 'building'">
            Followings are the latest build recipes, re-build if you have made configuration or code
            changes.
          </h2>
        </div>
      </div>
      <div v-if="root && showSuccessBuild">
        <div>
          <span class="mr-2 build-success">Build successfully!</span>
          <span class="mr-2">Built @ {{ buildTimeStart }}</span>
          <span>Time elapsed: {{ buildTimeDuration ? buildTimeDuration / 1000 : "" }}s</span>
        </div>
      </div>
    </div>
    <div class="slide-lines">
      <div class="line hz-line"></div>
      <div class="line hz-line"></div>
    </div>
  </section>

  <v-container
    v-if="root && recipes !== undefined && recipes.length > 0 && config?.target"
    class="w-75 text-center">
    <Recipe
      v-for="(recipe, index) in recipes"
      :key="index"
      :recipe="recipe"
      :keys="index"
      :disabled-advisors="config?.buildTargets?.[config.target].disabledAdvisors"
      class="mx-auto"></Recipe>
  </v-container>

  <div class="mx-auto w-75">
    <div id="buildLog" :class="{ active: showLog }">
      <div id="title" :class="{ active: showLogEditor }">
        <v-btn :append-icon="buildLogIcon" @click="logEditorSwitch">Build log</v-btn>
      </div>
      <LogEditor
        :path="path"
        :type="type"
        :resource-type="resourceType"
        :display="showLogEditor"
        @show-log-tab="
          (flag) => {
            showLog = flag;
          }
        "></LogEditor>
    </div>
  </div>

  <div class="mx-auto w-75 mt-6">
    <div v-if="root">
      <div
        v-if="
          config?.target &&
          config?.buildTargets?.[config.target].builders &&
          (config?.buildTargets?.[config.target].builders || []).length > 0
        "
        class="d-flex justify-center">
        <v-btn
          tile
          color="blue"
          class="mainbtn"
          append-icon="mdi-cog-outline"
          :disabled="disabledBuildBtn"
          :loading="loadingBuildBtn"
          @click="build"
          >BUILD</v-btn
        >
      </div>
    </div>
  </div>

  <v-container v-if="root && showSuccessBuild" class="w-75 text-center">
    <BuildResults
      v-if="buildTargetResults?.files && buildTargetResults.files.length"
      :build-target-results="buildTargetResults?.files"
      class="text-left"></BuildResults>
  </v-container>

  <div v-if="root" class="mx-auto mt-5 w-75">
    <v-card flat>
      <v-card-actions>
        <v-btn
          prepend-icon="mdi-arrow-left"
          color="info"
          @click="router.push({ path: '/buildSteps' })"
          >BUILD STEPS
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
/*
  eslint-disable
    @typescript-eslint/no-unsafe-assignment,
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/no-unsafe-member-access,
    @typescript-eslint/no-unsafe-call
 */

import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "../store";
import { getProjectName } from "../common/utility/utility";
import { convertDate } from "../common/utility/utility";
import Recipe from "../components/Recipe.vue";
import BuildResults from "../components/BuildResults.vue";
import lodash from "lodash";
import { log } from "../helper";
import { EditorType } from "../components/editor/customerEditor";
import LogEditor from "../components/editor/Editor.vue";
import WebSocket from "isomorphic-ws";
import { WS_SERVER_PATH, WsMessageType } from "../webinizer";

const type = EditorType.LOG;
const path = "";
const resourceType = "";

const store = useStore();
const router = useRouter();
const route = useRoute();

const buildLogIcon = ref("mdi-arrow-up-drop-circle-outline");
const showLog = ref(false);
const showLogEditor = ref(true);
const disabledBuildBtn = ref(false);
const loadingBuildBtn = ref(false);
const showSuccessBuild = ref(false);

let wsClient: WebSocket;

const config = computed(() => store.state.projectConfig);
const root = computed(() => store.state.root);
const recipes = computed(() => store.state.recipes);
const buildStatusType = computed(() => store.state.buildingStatus);
const buildTargetResults = computed(() => store.state.buildResults);

const buildTimeStart = computed(() =>
  buildTargetResults.value ? convertDate(new Date(buildTargetResults.value?.timestamps.tStart)) : ""
);
const buildTimeDuration = computed(() => buildTargetResults.value?.timestamps.tDur);

onMounted(async () => {
  try {
    if (route.query.root) {
      store.commit("setRoot", route.query.root);
    }
    if (root.value) {
      //NOTE - if user refresh or re-enter the page,
      //       should keep the build status, only get
      //       latest recipes when building process
      //       finish, otherwise use the latest recipes
      //       in state
      await store.dispatch("fetchProjectConfig");
      await store.dispatch("getProjectBuildStatus");
      initWebsocket();
    }

    if (buildStatusType.value === "building") {
      disabledBuildBtn.value = true;
      loadingBuildBtn.value = true;
    } else if (buildStatusType.value === "building_with_recipes") {
      disabledBuildBtn.value = true;
    } else if (buildStatusType.value === "idle_success") {
      await store.dispatch("fetchBuildResults");
      showSuccessBuild.value = true;
    } else {
      try {
        await store.dispatch("getRecipes");
      } catch (error) {
        log.errMsgNCuz(error);
      }
    }
  } catch (error) {
    log.errMsgNCuz(error);
  }
});

onUnmounted(() => {
  if (wsClient) {
    // close the websocket connection before leaving the page
    wsClient.close();
  }
});

const buildWithDebounce = lodash.debounce(
  async () => {
    try {
      store.commit("setRecipes", []);
      await store.dispatch("applyRecipesAndBuild");
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

function logEditorSwitch() {
  showLogEditor.value = !showLogEditor.value;
  showLogEditor.value
    ? (buildLogIcon.value = "mdi-arrow-up-drop-circle-outline")
    : (buildLogIcon.value = "mdi-arrow-down-drop-circle-outline");
}

function initWebsocket() {
  //NOTE - create websocket connection between the browser and
  //       server, the server will send the message when parent
  //       project triggers the building process of deps
  wsClient = new WebSocket(`${WS_SERVER_PATH}?root=${root.value}`);

  wsClient.onopen = () => {
    log.info("The websocket connected");
  };
  wsClient.onclose = () => {
    log.info(`The websocket connection of ${root.value} disconnected`);
  };

  wsClient.onmessage = (data: any) => {
    log.info("data from websocket server", JSON.parse(data.data as string));
    const dataObj = JSON.parse(data.data as string);
    // only handle the `UpdateBuildStatus` message in this
    // `Build` page
    if (dataObj.wsMsgType === WsMessageType.UpdateBuildStatus) {
      const newBuildStatus = dataObj.buildStatus;
      store.commit("setBuildingStatus", newBuildStatus as string);
    }
  };
}

async function build() {
  showLog.value = true;
  await buildWithDebounce();
}

watch(
  () => buildStatusType.value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_n, _o) => {
    if (_n === "building") {
      showSuccessBuild.value = false;
      disabledBuildBtn.value = true;
      loadingBuildBtn.value = true;
    } else if (_n === "building_with_recipes") {
      showSuccessBuild.value = false;
      disabledBuildBtn.value = true;
      loadingBuildBtn.value = false;
    } else if (_n === "idle_success") {
      showSuccessBuild.value = true;
      disabledBuildBtn.value = false;
      loadingBuildBtn.value = false;
      try {
        await store.dispatch("fetchBuildResults");
      } catch (error) {
        log.errMsgNCuz(error);
      }
    } else {
      showSuccessBuild.value = false;
      disabledBuildBtn.value = false;
      loadingBuildBtn.value = false;
    }
  }
);
</script>

<style lang="scss" scoped>
#loader {
  position: relative;
  margin-left: auto;
  margin-right: auto;
}

#box {
  width: 50px;
  height: 50px;
  background: #42a5f5;
  animation: animate 0.5s linear infinite;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  border-radius: 3px;
}

@keyframes animate {
  17% {
    border-bottom-right-radius: 3px;
  }

  25% {
    transform: translateY(9px) rotate(22.5deg);
  }

  50% {
    transform: translateY(18px) scale(1, 0.9) rotate(45deg);
    border-bottom-right-radius: 40px;
  }

  75% {
    transform: translateY(9px) rotate(67.5deg);
  }

  100% {
    transform: translateY(0) rotate(90deg);
  }
}

#shadow {
  width: 50px;
  height: 5px;
  background: #000;
  opacity: 0.1;
  position: relative;
  top: 65px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 50%;
  animation: shadow 0.5s linear infinite;
}

@keyframes shadow {
  50% {
    transform: scale(1.2, 1);
  }
}

.build-success {
  background: linear-gradient(90deg, var(--p-2) 20%, var(--p) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 500;
}
</style>
