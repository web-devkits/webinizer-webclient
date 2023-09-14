/*-------------------------------------------------------------------------------------------------
 *  Copyright (C) 2023 Intel Corporation. All rights reserved.
 *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
 *  SPDX-License-Identifier: Apache-2.0
 *-----------------------------------------------------------------------------------------------*/

import { Store } from "vuex";
import * as webinizer from "./webinizer";

declare module "@vue/runtime-core" {
  interface State {
    root: string;
    projectConfig: webinizer.ProjectConfig;
    recommendedBuilders?: webinizer.Builder[];
    recipes: webinizer.Recipe[];
    needSaveConfig: boolean;
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
