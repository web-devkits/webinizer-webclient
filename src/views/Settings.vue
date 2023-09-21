<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <div id="settings" class="">
    <section class="rh">
      <h2>Settings for the Webinizer tool.</h2>
    </section>

    <div v-if="settings">
      <div class="bl mr-6 mb-4 mt-6">
        <v-card variant="elevated" flat>
          <v-card-item class="text-left mb-8"><v-card-title> Registry </v-card-title> </v-card-item>
          <v-card-text>
            <EditTextField
              label="Registry address"
              type-name="registry"
              :value="settings?.registry"
              :rules="registryRules"
              :has-error="registryUpdateFailure"
              :need-tip="true"
              tip-content="Set a npm compatible registry address to use the registry service with Webinizer."
              @change-with-type="saveRegistrySettings"></EditTextField>
          </v-card-text>
        </v-card>
      </div>

      <div
        v-if="settings?.extensions && Object.keys(settings?.extensions).length"
        class="bl mr-6 mb-4 mt-6 g2x3">
        <v-card variant="elevated" flat>
          <v-card-item class="text-left mb-10"
            ><v-card-title> Extensions </v-card-title
            ><v-card-subtitle>
              Manage the installed extensions by enable or disable.
            </v-card-subtitle>
            <div v-for="(ext, idx) in Object.keys(settings?.extensions)" :key="idx" class="mb-6">
              <EditOptionSwitch
                :option-type="ext"
                :title="ext"
                :sub-title="settings?.extensions?.[ext].desc"
                :value="settings?.extensions?.[ext].status === 'enable' ? true : false"
                @change="saveExtensionStatus"></EditOptionSwitch></div
          ></v-card-item>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useStore } from "../store";
import { log } from "../helper";
import EditTextField from "../components/config/EditTextField.vue";
import EditOptionSwitch from "../components/config/EditOptionSwitch.vue";

const store = useStore();

const registryUpdateFailure = ref(false);
const settings = computed(() => store.state.webinizerSettings);

const registryRules = [
  (value: string) => {
    if (value && value.trim()) {
      if (value.trim().startsWith("http://") || value.trim().startsWith("https://")) return true;
      return "Registry address must be full url, starting with 'http://' or 'https://'.";
    }
    return true;
  },
];

async function saveRegistrySettings(type: string, value: string | undefined) {
  try {
    registryUpdateFailure.value = false;
    await store.dispatch("updateWebinizerSettings", { registry: value });
  } catch (error) {
    log.errMsgNCuz(error);
    registryUpdateFailure.value = true;
  }
}

async function saveExtensionStatus(type: string) {
  const originSettings = settings.value?.extensions?.[type];
  // set the opposite status as newStatus
  const newStatus = originSettings?.status === "enable" ? "disable" : "enable";
  const newExtSettings = Object.assign({}, originSettings, { status: newStatus });
  await store.dispatch("updateWebinizerSettings", { extensions: { [type]: newExtSettings } });
}

onMounted(async () => {
  try {
    await store.dispatch("fetchWebinizerSettings");
  } catch (error) {
    log.errMsgNCuz(error);
  }
});
</script>

<style lang="scss" scoped>
.settings {
  margin: 1rem auto;
}

/*overall layout*/
#settings {
  margin: 0 auto;
  padding: 0 3rem;
  max-width: 1280px;
  color: var(--foregroundColor);
  text-align: left;
}

#settings section {
  position: relative;
}

.rh h2 {
  font-size: 14px;
  font-weight: 400;
  color: #333;
}
</style>
