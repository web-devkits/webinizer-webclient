<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <main :class="{ home: reactiveData.isHome }">
    <div class="header">
      <Header />
    </div>
    <div class="content">
      <router-view />
    </div>
    <Footer />
  </main>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import Header from "./Header.vue";
import Footer from "./Footer.vue";

const router = useRouter();

const reactiveData = reactive({
  isHome: false,
});

const getCurrentPath = (currentPath: string) => {
  if (currentPath === "/") {
    reactiveData.isHome = true;
  } else {
    reactiveData.isHome = false;
  }
};

onMounted(async () => {
  await router.isReady().then(() => {
    getCurrentPath(router.currentRoute.value.path);
  });
});

watch(
  () => router.currentRoute.value,
  (_n) => {
    getCurrentPath(_n.path);
  }
);
</script>

<style lang="scss" scoped>
.header,
.home .content {
  margin: 0 auto;
  text-align: center;
}
.home .header {
  height: 100vh;
}
</style>
