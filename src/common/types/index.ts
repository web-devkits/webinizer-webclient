/*-------------------------------------------------------------------------------------------------
 *  Copyright (C) 2023 Intel Corporation. All rights reserved.
 *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
 *  SPDX-License-Identifier: Apache-2.0
 *-----------------------------------------------------------------------------------------------*/

export interface NavItem {
  path: string;
  name: string;
  isActive: boolean;
}

export interface LibsItem {
  iswebinizer: boolean;
  title: string;
  desc: string;
  size: number;
  sizeunit: string;
  img: string;
  url: string;
  category: string;
  lastupdate: string;
}
