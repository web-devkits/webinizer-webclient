/*-------------------------------------------------------------------------------------------------
 *  Copyright (C) 2023 Intel Corporation. All rights reserved.
 *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
 *  SPDX-License-Identifier: Apache-2.0
 *-----------------------------------------------------------------------------------------------*/

import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import Toast, { PluginOptions, POSITION } from "vue-toastification";
import VueDOMPurifyHTML from "vue-dompurify-html";
import "vue-toastification/dist/index.css";
import "github-markdown-css";

import router from "./router";
import { store, key } from "./store";

try {
  await loadFonts();
} catch (error) {
  console.log(error);
}

const toastOptions: PluginOptions = {
  position: POSITION.BOTTOM_CENTER,
};

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const app = createApp(App)
  .use(vuetify)
  .use(router)
  .use(store, key)
  .use(Toast, toastOptions)
  .use(VueDOMPurifyHTML, {
    hooks: {
      beforeSanitizeAttributes: (node: any) => {
        if (node.tagName === "A") {
          if (!node.hasAttribute("target")) {
            node.setAttribute("target", "_self");
          }
          if (node.hasAttribute("target")) {
            node.setAttribute("data-temp-href-target", node.getAttribute("target"));
          }
        }
      },
      afterSanitizeAttributes: (node: any) => {
        if (node.tagName === "A" && node.hasAttribute("data-temp-href-target")) {
          node.setAttribute("target", node.getAttribute("data-temp-href-target"));
          node.removeAttribute("data-temp-href-target");
          if (node.getAttribute("target") === "_blank") {
            node.setAttribute("rel", "noopener");
          }
        }
      },
    },
  });

app.mount("#app");
