<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <nav>
    <ul>
      <li
        v-for="(nav, index) in reactiveData.navList"
        :key="index"
        :class="{ active: nav.isActive }"
        @click="reactiveData.navClick(nav)">
        {{ nav.name }}
      </li>
      <li class="github">
        <a href="https://github.com/intel/webinizer">
          <svg
            height="13"
            viewBox="0 0 16 16"
            version="1.1"
            width="13"
            data-view-component="true"
            class="octicon octicon-mark-github v-align-middle color-fg-default">
            <path
              d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
          GitHub
        </a>
      </li>
    </ul>

    <i class="bx bx-menu mobile-nav-toggle"></i>
  </nav>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { NavItem } from "../common/types";

const whiteListOfSubNav = [
  "/getstarted",
  "/basic",
  "/build",
  "/config",
  "/buildSteps",
  "/edit",
  "/publish",
];

const emits = defineEmits<{ (e: "changeSubNavStat", value: boolean): void }>();

const router = useRouter();

const reactiveData = reactive({
  navList: [
    {
      name: "Get Started",
      isActive: false,
      path: "/getstarted",
    },
    {
      name: "Libs",
      isActive: false,
      path: "/libs",
    },
    // {
    //   name: "Docs",
    //   isActive: false,
    //   path: "/docs",
    // },
    {
      name: "Settings",
      isActive: false,
      path: "/settings",
    },
    {
      name: "About",
      isActive: false,
      path: "/about",
    },
  ],

  async navClick(e: NavItem) {
    await router.push(e.path);
  },
});

const changeNavActive = (currentPath: string) => {
  reactiveData.navList.forEach((v: NavItem) => {
    const temp = v;
    temp.isActive = temp.path === currentPath;
    if (whiteListOfSubNav.indexOf(currentPath) > -1) {
      emits("changeSubNavStat", true);
    } else {
      emits("changeSubNavStat", false);
    }
    return temp;
  });
};

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

<style scoped>
nav {
  justify-self: end;
}

nav ul li {
  color: #333;
  display: inline-block;
  padding: 10px 0 10px 2rem;
  cursor: pointer;
}

@media only screen and (max-width: 1246px) {
  nav ul li {
    padding: 10px 8px;
  }
}

nav li:before {
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

nav ul li:hover {
  color: var(--p);
}

nav li:hover:before {
  color: var(--white);
  transform: scale(1);
}

nav .mobile-nav-toggle {
  display: none;
}

.github svg {
  display: inline-block;
  margin-bottom: -1px;
}

.github a {
  color: rgb(51, 51, 51);
  text-decoration: none;
}

.github a:hover {
  color: var(--p);
}

.github:hover svg path {
  fill: var(--p);
}

@media only screen and (max-width: 640px) {
  nav {
    justify-self: center;
  }

  nav ul li {
    color: #333;
    display: inline-block;
    padding: 10px 1rem 10px 1rem;
  }
}

@media screen and (min-width: 641px) and (max-width: 1024px) {
  nav ul li {
    display: inline-block;
    padding: 10px 0.5rem 10px 0.5rem;
  }
}

@media (max-width: 991px) {
  .mobile-nav-toggle {
    display: block;
  }
}
</style>
