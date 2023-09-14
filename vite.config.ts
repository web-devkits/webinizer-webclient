/*-------------------------------------------------------------------------------------------------
 *  Copyright (C) 2023 Intel Corporation. All rights reserved.
 *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
 *  SPDX-License-Identifier: Apache-2.0
 *-----------------------------------------------------------------------------------------------*/

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from "vite-plugin-static-copy";
// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from "vite-plugin-vuetify";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    monacoEditorPlugin({}),
    topLevelAwait({ promiseExportName: "__tla", promiseImportName: (i) => `__tla_${i}` }),
    viteStaticCopy({
      targets: [
        {
          src: "src/assets/getstarted",
          dest: "assets",
        },
        {
          src: "src/assets/basic/preseticons/192x192",
          dest: "assets/basic/preseticons",
        },
      ],
    }),
  ],
  build: { target: "es2020" },
});
