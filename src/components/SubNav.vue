<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <nav>
    <ul>
      <li
        v-for="(nav, idx) in navData.navList"
        :key="idx"
        :class="[
          nav.needRootPath ? (root ? 'route_pointer' : 'route_cursor_default') : 'route_pointer',
          nav.isActive ? 'li_active_text_color' : '',
        ]"
        @click="navClickHandler(nav)">
        {{ nav.name }}
        <div :class="[nav.isActive ? 'li_active_underline' : '']"></div>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useStore } from "../store";
import { computed, onMounted, reactive, watch } from "vue";
import { NavItem } from "../common/types";

interface subNavObj extends NavItem {
  needRootPath: boolean;
}

const store = useStore();
const router = useRouter();
const root = computed(() => store.state.root);

const navData = reactive({
  navList: [
    {
      name: "Basic",
      needRootPath: false,
      isActive: false,
      path: "/basic",
    },
    {
      name: "Steps",
      needRootPath: true,
      isActive: false,
      path: "/buildSteps",
    },
    {
      name: "Build",
      needRootPath: true,
      isActive: false,
      path: "/build",
    },
    {
      name: "Config",
      needRootPath: true,
      isActive: false,
      path: "/config",
    },
    {
      name: "Publish",
      needRootPath: true,
      isActive: false,
      path: "/publish",
    },
    {
      name: "Edit",
      needRootPath: true,
      isActive: false,
      path: "/edit",
    },
  ],
});

function changeNavActive(currentPath: string) {
  navData.navList.forEach((v: NavItem) => {
    const temp = v;
    temp.isActive = temp.path === currentPath;
    return temp;
  });
}

async function navClickHandler(nav: subNavObj) {
  if (nav.needRootPath) {
    if (root.value) await router.push(nav.path);
  } else {
    await router.push(nav.path);
  }
}

onMounted(async () => {
  await router.isReady().then(() => {
    changeNavActive(router.currentRoute.value.path);
  });
});

watch(
  () => router.currentRoute.value,
  (_n) => {
    changeNavActive(_n.path);
  }
);
</script>

<style lang="scss" scoped>
nav {
  border-radius: 0px;
  justify-self: center;
  border: 1px solid white;
}

nav:hover {
  border-radius: 10px;
  background: linear-gradient(to bottom right, rgb(255, 255, 255), rgb(242, 252, 252));
  transition: 0.1s ease;
  text-decoration: none;
  border: 1px solid var(--btn);
}

nav ul li {
  color: var(--font);
  display: inline-block;
  padding: 10px 10px;
}

/*
nav:hover ui li {
  color: var(--white) !important;
}
*/

.route_cursor_default {
  cursor: default;
}

.route_pointer {
  cursor: pointer;
}

nav li.li_active_text_color:before,
.route_pointer:before {
  content: "";
  display: block;
  width: 100%;
  height: 3px;
  background-color: var(--p-8);
  position: relative;
  left: 0;
  bottom: -1.6rem;
  transform-origin: left;
  transform: scale(0);
  transition: 0.25s linear;
}
.li_active_text_color {
  color: var(--p);
}

.li_active_underline {
  position: relative;
  left: 0;
  bottom: -0.1em;
  margin: 0;
  background-color: var(--p-8);
  width: 100%;
  height: 2px;
}

/*
nav:hover .li_active_text_color, nav:hover li.li_active_text_color:hover, nav:hover .route_pointer, nav:hover .route_pointer:hover {
  color: white;
}
*/

nav li.li_active_text_color:hover,
.route_pointer:hover {
  color: var(--p);
}

nav li:hover:before {
  transform: scale(1);
}

nav .mobile-nav-toggle {
  display: none;
}

@media only screen and (max-width: 640px) {
  nav {
    justify-self: center;
  }

  nav ul li {
    display: inline-block;
    padding: 10px 25px;
  }
}

@media screen and (min-width: 641px) and (max-width: 1024px) {
  nav ul li {
    display: inline-block;
    padding: 10px 25px;
  }
}

@media (max-width: 991px) {
  .mobile-nav-toggle {
    display: block;
  }
}

@media only screen and (max-width: 1246px) {
  nav ul li {
    padding: 10px 8px;
  }
}
</style>
