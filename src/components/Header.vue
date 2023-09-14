<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <div id="wrap" :class="{ onScroll: !reactiveData.isTopOfPage }" class="mw1280">
    <header>
      <a class="logo" href="/">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 82">
          <defs></defs>
          <title>Webinizer</title>
          <text class="logo-1" transform="translate(72.99 53.93)">webinizer</text>
          <path
            class="logo-2"
            d="M43.69,43.26a21.72,21.72,0,0,1,30.53-.18l11.2-11.2L83.55,30a4.24,4.24,0,0,0-6,0l-.14.15a4.25,4.25,0,0,1-4.9.77,31.29,31.29,0,0,0-3.28-1.39,4.25,4.25,0,0,1-2.85-4v-.16a4.22,4.22,0,0,0-4.22-4.22H56.35a4.22,4.22,0,0,0-4.22,4.22h0a4.25,4.25,0,0,1-2.9,4,28.74,28.74,0,0,0-3.41,1.4A4.25,4.25,0,0,1,41,30a4.22,4.22,0,0,0-6,0l-4.13,4.13a4.22,4.22,0,0,0,0,6A4.23,4.23,0,0,1,31.66,45a32.17,32.17,0,0,0-1.4,3.41,4.24,4.24,0,0,1-4,2.91h0A4.22,4.22,0,0,0,22,55.49v5.84a4.22,4.22,0,0,0,4.22,4.22h.17a4.23,4.23,0,0,1,4,2.85,31.13,31.13,0,0,0,1.39,3.27,4.24,4.24,0,0,1-.77,4.9l-.14.15a4.21,4.21,0,0,0,0,6l1.87,1.88L43.5,73.8A21.73,21.73,0,0,1,43.69,43.26Z"
            transform="translate(-20.52 -19.66)" />
          <path
            class="logo-2"
            d="M43.54,74.27A21.73,21.73,0,1,0,74.27,43.54l-.19-.18L43.36,74.08Z"
            transform="translate(-20.52 -19.66)" />
        </svg>
        <span>beta</span>
      </a>
      <SubNav v-if="showSubNav" id="subNav" />
      <div v-if="!showSubNav" />
      <Nav id="nav" @change-sub-nav-stat="changeSubNavStat" />
    </header>
    <HomeHero />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from "vue";
import Nav from "./Nav.vue";
import SubNav from "./SubNav.vue";
import HomeHero from "./HomeHero.vue";

const showSubNav = ref(false);
const reactiveData = reactive({
  isTopOfPage: true,
});

const handleScroll = () => {
  if (window.pageYOffset > 0) {
    if (reactiveData.isTopOfPage) reactiveData.isTopOfPage = false;
  } else if (!reactiveData.isTopOfPage) reactiveData.isTopOfPage = true;
};

function changeSubNavStat(val: boolean) {
  showSubNav.value = val;
}

onBeforeMount(() => {
  window.addEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped>
header {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  justify-items: stretch;
  align-items: center;
}
.logo {
  cursor: pointer;
  display: flex;
  justify-self: flex-start;
}
.logo svg {
  display: inline-block;
  width: 180px;
}
.logo svg,
.logo svg text {
  text-decoration: none;
  -webkit-font-smoothing: subpixel-antialiased;
  font-family: Roboto, Helvetica, Arial, sans-serif;
}

.logo span {
  padding: 1px 6px;
  height: 22px;
  display: inline-block;
  margin-left: -6px;
  border-radius: 6px;
}

a.logo {
  text-decoration: none !important;
}

.logo span {
  color: white;
  background-color: var(--p);
}

.home .logo span {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

@media only screen and (max-width: 580px) {
  header {
    grid-template-columns: 1fr !important;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    padding: 2rem 0.5rem 1rem 0.5rem;
    height: auto;
  }
}
</style>
