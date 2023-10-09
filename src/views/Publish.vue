<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <section class="banner flex-center text-center b2">
    <div>
      <h1>Publish {{ getProjectName(route.query.root as string, config) }}</h1>
      <div v-if="!root" class="mx-auto">No project selected. Please select a project first.</div>
      <h2 v-else>Publish your package to registry</h2>
    </div>
  </section>

  <div v-if="root" class="mx-auto w-75 mt-6">
    <div class="mb-8 text-left">
      <v-expansion-panels v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-3" color="blue">mdi-alert-circle-outline</v-icon>
            <v-toolbar-title>Notice</v-toolbar-title>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-card variant="text" class="mt-n4 mb-4 ml-8 mr-8">
              <Markdown :md-raw-content="publishNotice"></Markdown>
            </v-card>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>

    <div class="g1x2 mb-8">
      <div class="bl mr-6">
        <v-card variant="elevated" class="text-left" flat>
          <v-card-item class="mb-10"><v-card-title> Author info </v-card-title></v-card-item>
          <v-card-text>
            <EditTextField
              need-tip
              label="Name"
              type-name="name"
              :tip-content="'Please enter your name here.'"
              :value="config?.author?.name"
              @change-with-type="saveAuthorConfig"></EditTextField>
          </v-card-text>
          <v-card-text>
            <EditTextField
              need-tip
              label="Email"
              type-name="email"
              :tip-content="'Please enter your email address.'"
              :value="config?.author?.email"
              :rules="configFieldRulesObject.emailFieldRules"
              @change-with-type="saveAuthorConfig"></EditTextField>
          </v-card-text>
          <v-card-text>
            <EditTextField
              need-tip
              label="URL"
              type-name="url"
              :tip-content="'Please enter the URL to your homepage if any.'"
              :value="config?.author?.url"
              :rules="configFieldRulesObject.urlFieldRules"
              @change-with-type="saveAuthorConfig"></EditTextField>
          </v-card-text>
        </v-card>
      </div>

      <div class="bl">
        <v-card variant="elevated" class="text-left" flat>
          <v-card-item class="mb-10"><v-card-title> Package info </v-card-title></v-card-item>
          <v-card-text>
            <EditTextField
              need-tip
              label="Keywords"
              type-name="keywords"
              :tip-content="'Please enter the keywords for the project and separate each keyword with a comma.'"
              :value="config?.keywords"
              @change-with-type="saveProjectConfig"></EditTextField>
          </v-card-text>

          <v-card-text>
            <EditTextField
              need-tip
              label="Repository"
              type-name="repository"
              :tip-content="'Please enter the URL to the project git repository.'"
              :value="config?.repository?.url"
              :rules="configFieldRulesObject.repositoryFieldRules"
              @change-with-type="saveProjectConfig"></EditTextField>
          </v-card-text>

          <v-card-text>
            <EditTextField
              need-tip
              label="Homepage"
              type-name="homepage"
              :tip-content="'Please enter the URL to the project homepage.'"
              :value="config?.homepage"
              :rules="configFieldRulesObject.urlFieldRules"
              @change-with-type="saveProjectConfig"></EditTextField>
          </v-card-text>

          <v-card-text>
            <EditTextField
              need-tip
              label="Bugs"
              type-name="bugs"
              :tip-content="'Please enter the url to your project\'s issue tracker.'"
              :value="config?.bugs"
              :rules="configFieldRulesObject.urlFieldRules"
              @change-with-type="saveProjectConfig"></EditTextField>
          </v-card-text>

          <v-card-text>
            <EditTextField
              need-tip
              label="License"
              type-name="license"
              :tip-content="'Please enter your project license.'"
              :value="config?.license"
              @change-with-type="saveProjectConfig"></EditTextField>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <template v-if="disabledPublishBtn">
      <span
        title="Add a valid registry address in the Settings page to enable publishing a project to registry.">
        <v-btn tile disabled color="grey" class="mainbtn" append-icon="mdi-publish-off">
          PUBLISH
        </v-btn>
      </span>
    </template>

    <template v-else
      ><v-btn
        tile
        color="blue"
        class="mainbtn"
        append-icon="mdi-publish"
        :loading="publishStatus === webinizer.ProjectPublishStatus.processing ? true : false"
        @click="showAlert">
        PUBLISH
      </v-btn>
    </template>
  </div>

  <Transition name="slide-fade">
    <Alert
      v-if="alert"
      :content="projectSummary"
      icon="mdi-cloud-alert"
      width="500px"
      @confirm="publish()"
      @cancel="alert = false"></Alert
  ></Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "../store";
import { log } from "../helper";
import * as webinizer from "../webinizer";
import { getProjectName } from "../common/utility/utility";
import { useToast } from "vue-toastification";
import Alert from "../components/Alert.vue";
import Markdown from "../components/Markdown.vue";
import EditTextField from "../components/config/EditTextField.vue";

const store = useStore();
const route = useRoute();
const toast = useToast();

const panel = ref([0]);
const alert = ref(false);

const config = computed(() => store.state.projectConfig);
const root = computed(() => store.state.root);
const buildStatusType = computed(() => store.state.buildingStatus);
const publishStatus = computed(() => store.state.projPublishStatus);
const settings = computed(() => store.state.webinizerSettings);

const disabledPublishBtn = ref(settings.value?.registry ? false : true);

const publishNotice = `Webinizer supports publishing a project to a registry that is npm compatible as an \`experimental\` feature.

  As this is under construction and unstable, to experience this feature, it's recommended to setup a private registry locally using tools such as [verdaccio](https://github.com/verdaccio/verdaccio) instead of using a public registry directly.

  If a registry is not configured yet, please follow the steps below.

  - Set the registry address at the [Settings](/settings) page.
  - Run \`docker exec -it webinizer bash\` to attach to the container process.
  - Run \`npm adduser --registry \${REGISTRY_URL}\` to add user or login to the registry.`;

const projectSummary = `Do you want to publish the project ${config.value?.name || ""}@${
  config.value?.version || ""
} to the registry ${settings.value?.registry || ""} ?`;

const configFieldRulesObject = {
  requiredFieldRules: [
    (value: string) => {
      if (value && value.trim()?.length > 0) return true;
      return "This field is required.";
    },
  ],

  emailFieldRules: [
    (value: string) => {
      if (value && value.trim()) {
        if (
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
            value.trim()
          )
        )
          return true;
        else return "The email format is not correct.";
      }
      return true;
    },
  ],

  urlFieldRules: [
    (value: string) => {
      if (value && value.trim()) {
        if (/^(https|http):\/\//.test(value.trim())) return true;
        return "The URL address must be full url, starting with 'http://' or 'https://'.";
      }
      return true;
    },
  ],

  repositoryFieldRules: [
    (value: string) => {
      if (value && value.trim()) {
        if (/^(https|https\+git|git\+https|git):\/\//.test(value.trim())) return true;
        else
          return "The URL format of the git repository is not correct. Please start with https:// or git://.";
      }
      return true;
    },
  ],
};

function showAlert() {
  // show project summary alert to users before publishing to the registry
  alert.value = true;
}

async function publish() {
  try {
    await store.dispatch("publishProject");
  } catch (error) {
    log.errMsgNCuz(error);
  } finally {
    alert.value = false;
  }
}

async function saveConfig(configToMerge?: { [k: string]: unknown }) {
  try {
    if (configToMerge) {
      await store.dispatch("saveProjectConfig", configToMerge);
    } else {
      await store.dispatch("saveProjectConfig");
    }
  } catch (error) {
    log.errMsgNCuz(error);
  }
}

async function saveAuthorConfig(type: string, value: string | undefined) {
  const newAuthorConfig =
    config.value && config.value.author
      ? Object.assign({}, config.value.author, { [type]: value })
      : { [type]: value };
  return saveConfig({ author: newAuthorConfig });
}

async function saveProjectConfig(type: string, value: string | undefined) {
  if (type === "repository") return saveConfig({ repository: { type: "git", url: value } });
  return saveConfig({ [type]: value });
}

onMounted(async () => {
  try {
    await store.dispatch("fetchWebinizerSettings");
    if (route.query.root) {
      store.commit("setRoot", route.query.root);
    }
    if (root.value) {
      await store.dispatch("fetchProjectConfig");
    }
    if (buildStatusType.value === "building" || buildStatusType.value === "building_with_recipes") {
      disabledPublishBtn.value = true;
    }
  } catch (error) {
    log.errMsgNCuz(error);
  }
});

watch(
  () => publishStatus.value,
  (_n) => {
    if (_n === webinizer.ProjectPublishStatus.success) {
      toast.success(
        `Publish ${config.value?.name || ""}@${config.value?.version || ""} successfully!`
      );
    }
  }
);
</script>
<style lang="scss" scoped></style>
