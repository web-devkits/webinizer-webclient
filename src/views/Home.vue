<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <div>
    <div id="mask"></div>
    <video id="bgvideo" playsinline autoplay muted loop poster="/src/assets/video/bg.jpg">
      <source src="/src/assets/video/bg.mp4" type="video/mp4" />
    </video>
    <Feature />
  </div>
</template>

<script lang="ts" setup>
import Feature from "../components/HomeFeature.vue";
</script>

<style scoped>
#bgvideo {
  object-fit: cover;
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -2;
}

#mask {
  width: 100%;
  height: 100vh;
  background-color: var(--black-2);
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
