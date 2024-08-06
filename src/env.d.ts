/*-------------------------------------------------------------------------------------------------
 *  Copyright (C) 2023 Intel Corporation. All rights reserved.
 *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
 *  SPDX-License-Identifier: Apache-2.0
 *-----------------------------------------------------------------------------------------------*/

/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  /*
    eslint-disable-next-line
      @typescript-eslint/no-explicit-any
   */
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
