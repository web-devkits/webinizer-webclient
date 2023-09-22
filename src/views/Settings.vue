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
      <div class="mr-6 mb-4 mt-6">
        <v-card variant="elevated" flat>
          <v-card-item class="text-left mb-8"
            ><v-card-title class="d-flex">
              <span class="pr-2">Registry</span>
              <TipPopover type="L" :tip-content="registryTip"></TipPopover>
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <EditTextField
              label="Registry address"
              type-name="registry"
              :value="settings?.registry"
              :rules="registryRules"
              :has-error="registryUpdateFailure"
              :need-tip="true"
              @change-with-type="saveRegistrySettings"></EditTextField>
          </v-card-text>
        </v-card>
      </div>

      <div
        v-if="settings?.extensions && Object.keys(settings?.extensions).length"
        class="mr-6 mb-4 mt-6">
        <v-card variant="elevated" flat>
          <v-card-item class="text-left"
            ><v-card-title class="d-flex">
              <span class="pr-2">Extensions</span>
              <TipPopover type="L" :tip-content="extensionTip"></TipPopover> </v-card-title
            ><v-card-subtitle>
              Manage the installed extensions by enable or disable.
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <div v-if="settings?.extensions && Object.keys(settings?.extensions).length">
              <div v-for="(ext, idx) in Object.keys(settings?.extensions)" :key="idx">
                <div class="extension_list">
                  <div class="extension_name text-left">
                    <h3 :title="ext">
                      {{ ext }}
                    </h3>
                  </div>

                  <div class="extension_desc">
                    <span class="text-medium-emphasis" :title="settings?.extensions?.[ext].desc">{{
                      settings?.extensions?.[ext].desc
                    }}</span>
                  </div>

                  <div class="extension_switch">
                    <v-switch
                      :model-value="settings?.extensions?.[ext].status === 'enable' ? true : false"
                      color="blue"
                      hide-details
                      @change="saveExtensionStatus(ext)"></v-switch>
                  </div>
                </div>
              </div></div
          ></v-card-text>
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
import TipPopover from "../components/TipPopover.vue";

const registryTip =
  "Webinizer supports interacting (i.e., publishing, fetching, etc.) with a registry that is <b>npm</b> compatible to manage migrated projects as an experimental feature.\n\nAs this is under construction and unstable, to experience this feature, it's recommended to setup a private registry locally using tools such as <a href='https://github.com/verdaccio/verdaccio' target='_blank'>verdaccio</a> instead of using a public registry directly.";

const extensionTip =
  "Webinizer provides an extension mechanism to extend the capabilities of the tool. More details are available <a href='https://github.com/intel/webinizer/tree/main#extending-webinizer' target='_blank'>here</a>.";

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

.extension_list {
  height: 3.5rem;
  display: grid;
  grid-template-columns: 3fr 4fr 1fr;
  gap: 20px;
  align-items: center;
  margin-bottom: 0.5rem;
}

.extension_list:hover {
  cursor: default;
  box-shadow:
    inset 1px 0 0 var(--black-03),
    inset -1px 0 0 var(--black-03),
    0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 1px 3px 1px rgba(60, 64, 67, 0.15);

  z-index: 2;
}

.extension_name {
  grid-column: 1;
  justify-items: start;
  padding-left: 10px;
}

.extension_desc {
  grid-column: 2;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  justify-self: start;
}

.extension_name,
.extension_desc {
  cursor: text;
}

.extension_switch {
  justify-self: end;
  padding-right: 10px;
}

@media only screen and (max-width: 600px) {
  .extension_list {
    width: 100%;
    grid-template-columns: 4fr 1fr;
    gap: 10px;
  }

  .extension_name {
    grid-column: 1;
  }

  .extension_desc {
    display: none;
  }
}
</style>
