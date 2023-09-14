/*-------------------------------------------------------------------------------------------------
 *  Copyright (C) 2023 Intel Corporation. All rights reserved.
 *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
 *  SPDX-License-Identifier: Apache-2.0
 *-----------------------------------------------------------------------------------------------*/

import { ProjectConfig } from "../../webinizer";

export function getProjectName(queryRoot: string, config: ProjectConfig | undefined): string {
  const projectNameFromQuery = queryRoot
    ? queryRoot.substring(queryRoot.lastIndexOf("/") + 1, queryRoot.length)
    : "";
  return config?.name ? config.name : projectNameFromQuery;
}

function padTo2Digits(num: number): string {
  return num.toString().padStart(2, "0");
}

export function convertDate(date: Date): string {
  return (
    [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join(
      "-"
    ) +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(":")
  );
}

export function hyperlinkingUrl(url: string): string {
  let replacedString = "";
  const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
  replacedString = url.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

  const replacePattern2 = /(^|[^/])(www\.[\S]+(\b|$))/gim;
  replacedString = replacedString.replace(
    replacePattern2,
    '$1<a href="http://$2" target="_blank">$2</a>'
  );

  return replacedString;
}
