<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-card variant="flat">
    <v-tabs v-model="tab">
      <v-tab color="info" value="Executable">Web modules</v-tab>
      <v-tab color="info" value="Library">Library</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="Executable">
          <v-table>
            <thead>
              <tr>
                <th>Target</th>
                <th>Name</th>
                <th>Path</th>
                <th>Size (MB)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(target, idx) in eachPageExecutableTarget" :key="idx">
                <tr>
                  <td>{{ target.target }}</td>
                  <td>
                    <v-icon v-if="target.type === 'file'">mdi-file</v-icon>
                    <v-icon v-else-if="target.type === 'directory'">mdi-folder</v-icon
                    >{{ target.name }}
                  </td>
                  <td class="modulelink" @click="toEdit($event, target.type)">
                    {{ target.path.substring(1) }}
                  </td>
                  <td>{{ (target.size / (1024 * 1024)).toFixed(3) }}</td>
                  <td>{{ convertDate(new Date(target.date)) }}</td>
                </tr>
              </template>
            </tbody>
          </v-table>
          <div v-if="Math.ceil(executableTargets.length / lengthEachPage) > 1" class="text-center">
            <v-pagination
              v-model="executablePage"
              :length="Math.ceil(executableTargets.length / lengthEachPage)"
              :total-visible="5"></v-pagination>
          </div>
        </v-window-item>

        <v-window-item value="Library">
          <v-table>
            <thead>
              <tr>
                <th>Target</th>
                <th>Name</th>
                <th>Path</th>
                <th>Size (MB)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(target, idx) in eachPageLibraryTarget" :key="idx">
                <tr>
                  <td>{{ target.target }}</td>
                  <td>
                    <v-icon v-if="target.type === 'file'">mdi-file</v-icon>
                    <v-icon v-else-if="target.type === 'directory'">mdi-folder</v-icon
                    >{{ target.name }}
                  </td>
                  <td class="modulelink" @click="toEdit($event, target.type)">
                    {{ target.path.substring(1) }}
                  </td>
                  <td>{{ (target.size / (1024 * 1024)).toFixed(3) }}</td>
                  <td>{{ convertDate(new Date(target.date)) }}</td>
                </tr>
              </template>
            </tbody>
          </v-table>
          <div v-if="Math.ceil(libraryTargets.length / lengthEachPage) > 1" class="text-center">
            <v-pagination
              v-model="libraryPage"
              :length="Math.ceil(libraryTargets.length / lengthEachPage)"
              :total-visible="5"></v-pagination>
          </div>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import * as webinizer from "../webinizer";
import { useRouter } from "vue-router";
import { EditorType } from "./editor/customerEditor";
import { computed, ref } from "vue";
import { convertDate } from "../common/utility/utility";

const props = defineProps<{
  buildTargetResults: webinizer.TargetResult[];
}>();

interface IterationResults extends webinizer.ResultFile {
  target: string;
  targetType: string;
}

const router = useRouter();

const tab = ref("");
const executablePage = ref(1);
const libraryPage = ref(1);
const lengthEachPage = 10;

const executableTargets = computed(() => {
  let resultsArr: IterationResults[] = [];
  props.buildTargetResults
    .filter((item) => item.type === "executable")
    .map((target) => {
      target.result.map((t) => {
        resultsArr.push({
          date: t.date,
          name: t.name,
          path: t.path,
          size: t.size,
          type: t.type,
          target: target.target,
          targetType: target.type,
        });
      });
    });
  return resultsArr;
});

const eachPageExecutableTarget = computed(() =>
  executableTargets.value.slice(
    (executablePage.value - 1) * lengthEachPage,
    executablePage.value * lengthEachPage
  )
);

const libraryTargets = computed(() => {
  let resultsArr: IterationResults[] = [];
  props.buildTargetResults
    .filter((item) => item.type === "library")
    .map((target) => {
      target.result.map((t) => {
        resultsArr.push({
          date: t.date,
          name: t.name,
          path: t.path,
          size: t.size,
          type: t.type,
          target: target.target,
          targetType: target.type,
        });
      });
    });
  return resultsArr;
});

const eachPageLibraryTarget = computed(() =>
  libraryTargets.value.slice(
    (libraryPage.value - 1) * lengthEachPage,
    libraryPage.value * lengthEachPage
  )
);

const toEdit = async (e: unknown, ftype: "file" | "directory") => {
  let absolutePath = "/" + ((e as PointerEvent).currentTarget as HTMLElement).innerText;
  await router.push({
    path: "/edit",
    query: { type: EditorType.FILE, path: absolutePath, resourceType: ftype },
  });
};
</script>

<style lang="css" scoped>
tr th {
  white-space: nowrap;
  text-align: left;
  font-size: 14px !important;
  font-weight: 400;
}

tr td {
  white-space: nowrap;
  text-align: left;
  font-size: 14px !important;
}

tr td i {
  color: var(--font);
  margin-right: 0.25em;
}

tr:hover td,
tr:hover td i {
  color: var(--p);
}
.modulelink {
  color: var(--p-6);
  max-width: 300px;
  width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  direction: rtl;
}

.modulelink:hover {
  color: var(--p);
  text-decoration: underline;
  cursor: pointer;
}

.v-tabs .v-btn {
  text-transform: none;
  font-weight: 400;
  letter-spacing: normal;
  font-size: 14px;
}
</style>
