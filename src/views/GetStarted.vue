<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <div id="lib">
    <section class="banner flex-center text-center parallax z1">
      <div>
        <h1>Get Started and Demos</h1>
        <h2>Select following projects to start or add a new one</h2>
      </div>
    </section>

    <section id="projectPanel" class="mb-4 mx-auto mw1280 pt-6">
      <div id="navi">
        <div>
          <v-tabs
            :model-value="displayMode"
            direction="vertical"
            density="comfortable"
            color="blue">
            <v-tab
              min-width="200px"
              prepend-icon="mdi-card-bulleted"
              value="card"
              @click="updateDisplayMode('card')"
              >Card</v-tab
            >
            <v-tab
              min-width="200px"
              prepend-icon="mdi-format-list-bulleted-square"
              value="list"
              @click="updateDisplayMode('list')"
              >List</v-tab
            >
          </v-tabs>
        </div>

        <div class="add_wrapper" @click="toAddProject">
          <div class="add_icon">
            <span class="text-h4"> + </span>
          </div>
          <div class="add_title"><span>Add Project</span></div>
        </div>
      </div>
      <div v-if="displayMode === 'card'" class="rs rg">
        <div v-for="(lib, index) in reactiveLibsList" :key="index" class="profile">
          <div
            v-if="!lib.id && lib.id !== 0"
            title="Delete this project"
            class="w-100 text-right mb-n8 pl-1 pt-1">
            <v-icon class="delete-icon" icon="mdi-close-thick" @click="showAlert(index)"></v-icon>
          </div>
          <div class="pi">
            <div class="pti">
              <div v-if="lib.img && lib.img.length > 0">
                <img :src="lib.img" />
              </div>
              <h3 :title="lib.name">{{ lib.name }}</h3>
            </div>
            <p class="desc" :title="lib.desc">{{ lib.desc }}</p>
          </div>
          <div class="psg">
            <div class="ps">
              <p class="pst">Category</p>
              <p class="psi">{{ lib.category !== undefined ? lib.category : "-" }}</p>
            </div>
            <div class="ps">
              <p class="pst">Version</p>
              <p class="psi">{{ lib.version }}</p>
            </div>
            <div class="ps">
              <button class="select-btn" @click="selectProject(index)">SELECT</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="mx-auto">
        <div v-for="(lib, index) in reactiveLibsList" :key="index">
          <div class="project_list">
            <div v-if="!lib.id && lib.id !== 0" class="project_delete_icon">
              <v-icon
                title="Delete this project"
                class="delete-icon"
                icon="mdi-close-thick"
                @click="showAlert(index)"></v-icon>
            </div>
            <div class="project_img">
              <v-avatar size="36px" rounded="0">
                <v-img v-if="lib.img && lib.img.length > 0" :src="lib.img"></v-img>
              </v-avatar>
            </div>
            <div class="project_name">
              <h3 :title="lib.name">
                {{ lib.name }}
              </h3>
            </div>
            <div class="project_version">
              <span class="version_badge">
                <span class="px-1">V{{ lib.version }}</span>
              </span>
            </div>
            <div class="project_desc">
              <span class="text-medium-emphasis" :title="lib.desc">{{ lib.desc }}</span>
            </div>
            <div class="project_category">
              <span v-if="lib.category" class="text-medium-emphasis pr-1">{{ lib.category }}</span>
              <span v-else> - </span>
            </div>
            <div class="project_select_btn">
              <button class="select-btn" @click="selectProject(index)">select</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="pagination" class="mw1280 mx-auto">
      <div class="page">
        <v-pagination
          v-model="pageNum"
          :length="totalPageNum"
          :total-visible="8"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"></v-pagination>
      </div>
    </section>
  </div>
  <Transition name="slide-fade">
    <Alert
      v-if="alert"
      content="Are you sure to delete?"
      @confirm="deleteProject()"
      @cancel="alert = false"></Alert
  ></Transition>
</template>

<script setup lang="ts">
import Alert from "../components/Alert.vue";
import { computed, onMounted, ref } from "vue";
import { useStore } from "../store";
import { useRouter } from "vue-router";
import { log } from "../helper";
import { DisplayMode } from "../webinizer";

const store = useStore();
const router = useRouter();

let deleteIdx = -1;
const alert = ref(false);
const pageNum = ref(1);

/* limit 6 for card mode and 10 for list mode */
const eachPageProjNum = computed(() => (displayMode.value === "card" ? 6 : 10));
const reactiveLibsList = computed(() =>
  store.state.projectsPool.slice(
    (pageNum.value - 1) * eachPageProjNum.value,
    pageNum.value * eachPageProjNum.value
  )
);
const displayMode = computed(() => store.state.displayMode);
const totalPageNum = computed(() =>
  store.state.projectsPool.length === 0
    ? "0"
    : (store.state.projectsPool.length / eachPageProjNum.value) % 1 === 0
    ? store.state.projectsPool.length / eachPageProjNum.value
    : Math.trunc(store.state.projectsPool.length / eachPageProjNum.value) + 1
);

function showAlert(idx: number) {
  deleteIdx = idx;
  alert.value = true;
}

function updateDisplayMode(mode: DisplayMode) {
  pageNum.value = 1;
  store.commit("setDisplayMode", mode);
}

async function saveConfig(configToMerge?: { [k: string]: unknown }) {
  try {
    if (!store.state.projectConfig) {
      await store.dispatch("fetchProjectConfig");
    }
    if (configToMerge) {
      await store.dispatch("saveProjectConfig", configToMerge);
    } else {
      await store.dispatch("saveProjectConfig");
    }
  } catch (error) {
    log.errMsgNCuz(error);
  }
}

async function selectProject(index: number) {
  try {
    store.commit("initState");
    store.commit("setRoot", reactiveLibsList.value[index].path);
    await saveConfig({
      name: reactiveLibsList.value[index].name,
      desc: reactiveLibsList.value[index].desc,
    });
    await router.push("basic");
  } catch (error) {
    log.errMsgNCuz(error);
  }
  // remove the previous project state before selecting new one
}

async function deleteProject() {
  try {
    if (deleteIdx === -1) return;
    await store.dispatch("deleteProject", reactiveLibsList.value[deleteIdx].path);
  } catch (error) {
    log.errMsgNCuz(error);
  } finally {
    alert.value = false;
    deleteIdx = -1;
  }
}

async function toAddProject() {
  store.commit("initState");
  await router.push("basic");
}

onMounted(async () => {
  try {
    await store.dispatch("fetchProjects");
  } catch (error) {
    log.errMsgNCuz(error);
  }
});
</script>

<style lang="scss" scoped>
#projectPanel {
  display: grid;
  grid-template-columns: 200px 1fr;
}

#navi {
  justify-self: end;
}

#pagination {
  display: grid;
  grid-template-columns: 200px 1fr;
}

.page {
  grid-column: 2;
}

.vertical_center {
  align-items: center;
  display: -webkit-flex;
}
.parallax {
  width: 100%;
  height: 500px;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}

.mw1280 {
  padding-left: 10px !important;
  padding-right: 10px !important;
}

.z1 {
  background-image: url("../assets/getstarted/bg.jpg");
  height: 30rem;
}

.parallax h2 {
  color: white;
}

.parallax h1 {
  display: block;
  background: linear-gradient(90deg, white 20%, var(--p-05) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 500;
}

.parallax:hover h1 {
  background: linear-gradient(90deg, var(--p-05) 20%, white 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/*overall layout*/
#lib {
  margin: 0 auto;
  color: var(--foregroundColor);
  text-align: left;
}

#lib section {
  position: relative;
}

.rh h1 {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.rh h2 {
  font-size: 14px;
  font-weight: 400;
  color: #333;
}

.pi h3 {
  font-size: 26px;
  color: #333;
  font-weight: 600;
  margin: 5px 0;
}

.pti h3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pti div {
  text-align: center;
}
.pti div img {
  height: 128px;
  border-radius: 12%;
  border: 1px solid var(--black-03);
}

.desc {
  height: 82px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

button.select-btn {
  outline: none;
  text-align: center;
  font-size: 1em;
  padding: 6px 12px;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 3px;
  background: var(--btn);
  color: var(--white);
  position: relative;
  top: 0;
  transition: 0.2s ease;
  text-decoration: none;
  box-shadow:
    0px 3px 1px -2px rgb(0 0 0 / 3%),
    0px 2px 2px 0px rgb(0 0 0 / 14%),
    0px 1px 5px 0px rgb(0 0 0 / 12%);
}

button.select-btn:hover,
button.select-btn.hover {
  color: var(--white);
  letter-spacing: 1px;
  background: linear-gradient(135deg, var(--p-8) 40%, var(--secondary) 25%);
  transition: 0.2s;
  box-shadow:
    0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%),
    0px 1px 10px 0px rgb(0 0 0 / 12%);
}

button.select-btn:active,
button.select-btn.active {
  background: linear-gradient(135deg, var(--p-8) 40%, var(--secondary) 25%);
  outline: none;
  box-shadow:
    0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%),
    0px 1px 10px 0px rgb(0 0 0 / 12%);
  top: 0;
}

button.select-btn.disabled {
  opacity: 0.4;
  user-select: none;
  pointer-events: none;
}
button.select-btn.medium {
  padding: 15px 18px;
  width: auto;
}
button.select-btn.small {
  padding: 10px 12px;
  width: auto;
  font-size: 14px;
  font-weight: 500;
}

.rh {
  grid-column: span 2;
  display: grid;
  grid-template-columns: 1fr max-content;
  padding-left: 40px;
}

.rs {
  display: grid;
  grid-gap: 1rem;
}

.rg {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1fr;
  align-items: center;
  justify-items: center;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}

.add_wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px transparent solid;
  background: var(--backgroundColor);
  color: var(--foregroundColor);
  border-radius: 5px;
  border: 1px solid var(--black-03);
  width: 180px;
  height: 180px;
}

.add_title {
  padding: 5px 5px;
}

.add_wrapper:hover {
  cursor: pointer;
  border: 1px solid var(--black-1);
  box-shadow: 1px 3px 5px 0px rgb(35 100 210 / 10%);
}

.profile {
  background: var(--backgroundColor);
  color: var(--foregroundColor);
  border-radius: 5px;
  overflow: hidden;
  transition: 0.2s ease;
  border: 1px solid var(--black-03);
  height: 348.6px;
  width: 100%;
}

.profile:hover {
  border: 1px solid var(--black-1);
  box-shadow: 1px 3px 5px 0px rgb(35 100 210 / 10%);
}

.pi {
  padding: 15px 15px;
}

.psg {
  padding: 0px 0px 15px 0px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 0px;
  justify-items: center;
  align-items: center;
}

.pst {
  color: var(--black-2);
  font-size: 12px;
  margin-bottom: -1rem;
}

.ps {
  text-align: center;
}

.psi {
  height: 1rem;
  font-size: 1rem;
  margin: 0.8rem 0;
}

.add_icon {
  display: flex;
  justify-content: center;
  border-radius: 50%;
  align-items: center;
  border: 2px solid var(--p-8);
  background-color: transparent;
  height: 36px;
  width: 36px;
  margin: 0;
}

.add_wrapper .add_icon span {
  color: var(--p-8);
}

.add_wrapper:hover .add_icon {
  background-color: var(--p-8);
  box-shadow: 1px 3px 5px 0px rgb(35 100 210 / 10%);
}

.add_wrapper:hover .add_icon span {
  color: white;
}

.add_wrapper:hover .add_title {
  color: var(--p-8);
}

.version_badge {
  align-items: center;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  height: 1.25rem;
  min-width: 20px;
  padding: 2px 6px;
  pointer-events: auto;
  text-align: center;
  text-indent: 0;
  white-space: nowrap;
  background-color: #eeeeee !important;
  color: rgb(66, 66, 66) !important;
}

.project_list {
  height: 3.5rem;
  display: grid;
  grid-template-columns:
    25px 40px minmax(180px, 2fr) minmax(90px, 1fr) minmax(150px, 5fr) minmax(90px, 1fr)
    minmax(90px, 1fr);
  gap: 20px;
  align-items: center;
  justify-items: center;
  margin-bottom: 0.5rem;
}

.project_list:hover {
  cursor: default;
  box-shadow:
    inset 1px 0 0 var(--black-03),
    inset -1px 0 0 var(--black-03),
    0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 1px 3px 1px rgba(60, 64, 67, 0.15);

  z-index: 2;
}

.project_delete_icon {
  grid-column: 1;
  padding-left: 10px;
  justify-self: start;
}

.project_img {
  grid-column: 2;
}

.project_name {
  grid-column: 3;
  justify-self: start;
}

.project_version {
  grid-column: 4;
  justify-self: start;
}

.project_desc {
  grid-column: 5;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  justify-self: start;
}

.project_name,
.project_version,
.project_desc,
.project_category {
  cursor: text;
}

.project_select_btn {
  justify-self: center;
  padding-right: 10px;
}

@media only screen and (min-width: 1280px) {
  .rg {
    grid-template-columns: repeat(3, 1fr);
  }

  #projectPanel {
    padding: 0 2rem;
  }
}

@media only screen and (max-width: 1279px) {
  .rg {
    grid-template-columns: repeat(2, 1fr);
  }
  #projectPanel {
    padding: 0 1rem;
  }
  .rh h1 {
    margin-bottom: 1rem;
  }
}

@media only screen and (max-width: 1000px) {
  .project_list {
    width: 100%;
    grid-template-columns:
      25px 40px minmax(150px, 5fr) minmax(80px, 1fr) minmax(80px, 1fr)
      minmax(80px, 1fr);
  }

  .project_name {
    grid-column: 3;
  }

  .project_desc {
    display: none;
  }
}

@media only screen and (max-width: 800px) {
  .rg {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  .rs.rg .profile {
    margin: auto;
    overflow: hidden;
  }

  .rs.rg .add_wrapper {
    margin: auto;
    overflow: hidden;
  }

  .rh h1 {
    margin-bottom: 2rem;
  }

  #projectPanel {
    display: grid;
    grid-template-columns: unset;
    grid-template-rows: 100px 1fr;
    gap: 10px;
  }

  #navi {
    justify-self: start;
  }

  #pagination {
    display: grid;
    grid-template-columns: 1fr;
  }

  .page {
    grid-column: 1;
  }

  .add_wrapper {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -100%);
    width: 96px;
    height: 96px;
  }

  .add_title {
    display: none;
  }

  .project_list {
    width: 100%;
    grid-template-columns:
      25px 40px minmax(150px, 5fr) minmax(90px, 2fr) minmax(90px, 1fr)
      minmax(90px, 2fr);
    gap: 10px;
  }
}

@media only screen and (max-width: 600px) {
  .project_list {
    width: 100%;
    grid-template-columns:
      25px minmax(150px, 4fr) minmax(90px, 1fr)
      3fr;
    gap: 10px;
  }

  .project_name {
    grid-column: 2;
  }

  .project_version {
    grid-column: 3;
  }

  .project_img,
  .project_desc,
  .project_category {
    display: none;
  }
}
</style>
