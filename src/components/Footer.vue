<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <div class="waves">
    <svg width="100%" height="160px" fill="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f1f1f1" />
        <stop offset="50%" stop-color="#f1f1f1" />
        <stop offset="100%" stop-color="#f1f1f1" />
      </linearGradient>
      <path fill="url(#grad)" d="M0 67 C 273,183 822,-40 4096.00,106 V 359 H 0 V 67 Z">
        <animate
          repeatCount="indefinite"
          fill="url(#grad)"
          attributeName="d"
          dur="30s"
          values="
            M0 77 C 473,283 822,-40 4096,116 V 359 H 0 V 67  Z; M0 77 C 473,-40 1222,283 4096,136 V 359 H 0 V 67 Z;
            M0 77 C 973,260 1722,-53 4096,120 V 359 H 0 V 67 Z; M0 77 C 473,283 822,-40 4096,116 V 359 H 0 V 67 Z
            "></animate>
      </path>
    </svg>
  </div>
  <footer>
    <div class="footer">
      <ul>
        <li
          v-for="(nav, index) in navList"
          :key="index"
          :class="{ active: nav.isActive }"
          @click="navClick(nav)">
          {{ nav.name }}
        </li>
      </ul>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { NavItem } from "../common/types";

export default defineComponent({
  name: "FooterComp",

  setup() {
    const router = useRouter();

    const reactiveData = reactive({
      navList: [
        {
          name: "©2023 Webinizer",
          isActive: false,
          path: "/",
        },
        {
          name: "About",
          isActive: false,
          path: "/about",
        },
        {
          name: "GitHub",
          isActive: false,
          path: "/github",
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
        return temp;
      });
    };

    watch(
      () => router.currentRoute.value,
      (_n) => {
        changeNavActive(_n.path);
      }
    );

    onMounted(async () => {
      await router.isReady().then(() => {
        changeNavActive(router.currentRoute.value.path);
      });
    });

    return {
      ...toRefs(reactiveData),
    };
  },
});
</script>
<style lang="scss" scoped>
.waves {
  margin: 0;
  margin-bottom: -1rem;
}

footer {
  color: #333;
  padding: 0rem 1rem 3rem 1rem;
  background: var(--second-bg);
}

.footer {
  max-width: 1280px;
  margin: 0px auto;
  text-align: left;
  padding: 0 2rem;
}

@media only screen and (max-width: 640px) {
  .footer {
    max-width: 640px;
  }
}

@media screen and (min-width: 641px) and (max-width: 1024px) {
  .footer {
    max-width: 1024px;
  }
}

.footer div {
  display: inline-block;
}

ul {
  margin-left: 1rem;
}

ul,
ul li {
  display: inline-block;
}

ul li {
  margin: 0 2rem 0 0;
}

ul li:hover {
  cursor: pointer;
  color: var(--p);
}

@media only screen and (max-width: 640px) {
  footer {
    padding: 3rem 1rem 3rem 0rem;
  }
}

@media screen and (min-width: 641px) and (max-width: 1024px) {
  footer {
    padding: 3rem 1rem 3rem 0rem;
  }
}

@media screen and (min-width: 1025px) and (max-width: 1280px) {
  footer {
    padding: 3rem 1rem 3rem 0rem;
  }
}
</style>
