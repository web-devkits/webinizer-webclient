/*-------------------------------------------------------------------------------------------------
 *  Copyright (C) 2023 Intel Corporation. All rights reserved.
 *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
 *  SPDX-License-Identifier: Apache-2.0
 *-----------------------------------------------------------------------------------------------*/

import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./views/Home.vue"),
    },
    {
      path: "/getstarted",
      component: () => import("./views/GetStarted.vue"),
    },
    {
      path: "/basic",
      component: () => import("./views/BasicConfig.vue"),
    },
    {
      path: "/config",
      component: () => import("./views/Configure.vue"),
    },
    {
      path: "/build",
      component: () => import("./views/Build.vue"),
    },
    {
      path: "/edit",
      component: () => import("./views/Edit.vue"),
    },
    {
      path: "/libs",
      component: () => import("./views/Libs.vue"),
    },
    {
      path: "/settings",
      component: () => import("./views/Settings.vue"),
    },
    {
      path: "/about",
      component: () => import("./views/About.vue"),
    },
    {
      path: "/github",
      component: () => {
        window.location.href = "https://github.com/intel/webinizer";
      },
    },
    {
      path: "/buildSteps",
      component: () => import("./views/BuildSteps.vue"),
    },
    {
      path: "/publish",
      component: () => import("./views/Publish.vue"),
    },
  ],
});
