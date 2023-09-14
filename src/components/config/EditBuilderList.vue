<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <v-card flat>
    <div
      v-if="
        buildersCopy.buildersArr.length === 0 &&
        recommendedBuilders &&
        recommendedBuilders.length > 0 &&
        !startFromScratch
      "
      class="d-md-flex align-baseline mb-6">
      <v-banner
        icon="mdi-information"
        max-width="620px"
        class="text-left align-center mr-n16 mb-n6">
        <template #text>
          <span style="padding-inline-end: 0px" class="text-subtitle-2"
            >The following are recommended build steps, do you want to apply them ?
          </span></template
        >

        <template #prepend>
          <v-avatar color="info" variant="text" class="mr-n6"></v-avatar>
        </template>
      </v-banner>

      <div>
        <v-btn variant="text" color="info" @click="adoptRecommendedBuilders()"> Yes </v-btn>
        <v-btn variant="plain" @click="startFromScratch = true"> No </v-btn>
      </div>
    </div>

    <div class="g1x2">
      <template
        v-if="
          buildersCopy.buildersArr.length === 0 &&
          recommendedBuilders &&
          recommendedBuilders.length > 0 &&
          !startFromScratch
        ">
        <v-card-text v-for="(v, idx) in recommendedBuilders" :key="idx">
          <div>
            <div style="text-align: left; margin-top: -10px">
              <v-container fluid
                ><v-row
                  ><v-col cols="4" style="padding: 0">
                    <span class="text-h6 step">Step {{ idx + 1 }}</span></v-col
                  >
                </v-row>
              </v-container>
            </div>
            <EditBuilder
              :label="'Recommended build steps'"
              :builder="recommendedBuilders[idx]"
              @change="emitUpdate(idx, $event)"
              @delete="emitDelete(idx)">
            </EditBuilder>
          </div>
        </v-card-text>
      </template>

      <template v-for="(v, idx) in buildersCopy.buildersArr" :key="idx">
        <v-card-text>
          <div>
            <div style="text-align: left; margin-top: -10px">
              <v-container fluid
                ><v-row
                  ><v-col cols="4" style="padding: 0">
                    <span class="text-h6 step">Step {{ idx + 1 }}</span></v-col
                  >
                  <v-col v-if="enableStepManage" cols="8" class="text-right" style="padding: 0">
                    <v-icon v-if="idx !== 0" size="x-large" color="blue" @click="moveStepPrev(idx)"
                      >mdi-arrow-up-bold-box-outline</v-icon
                    >
                    <v-icon
                      v-if="idx !== buildersCopy.buildersArr.length - 1"
                      size="x-large"
                      color="blue"
                      @click="moveStepNext(idx)"
                      >mdi-arrow-down-bold-box-outline</v-icon
                    >
                  </v-col></v-row
                ></v-container
              >
            </div>
            <EditBuilder
              :builder="buildersCopy.buildersArr[idx]"
              :enable-step-manage="enableStepManage"
              @change="emitUpdate(idx, $event)"
              @delete="emitDelete(idx)">
            </EditBuilder>
          </div>
        </v-card-text>
      </template>
    </div>

    <div class="btn_wrapper_box mb-6">
      <template
        v-if="
          buildersCopy.buildersArr.length === 0 &&
          recommendedBuilders &&
          recommendedBuilders.length > 0 &&
          startFromScratch
        ">
        <v-btn class="otlshadow" variant="outlined" color="blue">
          <BuildStepDialogVue @change="addItem"></BuildStepDialogVue>
        </v-btn>
      </template>

      <template v-else-if="buildersCopy.buildersArr.length > 0">
        <v-btn class="btn_add otlshadow" variant="outlined" color="blue">
          <BuildStepDialogVue @change="addItem"></BuildStepDialogVue>
        </v-btn>
        <Transition name="btn">
          <v-btn
            v-if="!enableStepManage"
            color="blue"
            class="btn_manage mainbtn"
            append-icon="mdi-plus-minus"
            @click="enableStepManage = true"
            >Manage Steps</v-btn
          >
          <v-btn
            v-else
            color="blue"
            class="btn_manage mainbtn"
            append-icon="mdi-check-bold"
            @click="enableStepManage = false"
            >Finish</v-btn
          >
        </Transition></template
      >
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, reactive, watch } from "vue";
import { Builder } from "../../webinizer";
import { cloneDeep } from "lodash";
import { useStore } from "../../store";
import EditBuilder from "./EditBuilder.vue";
import BuildStepDialogVue from "../dialog/BuildStepDialog.vue";

const props = defineProps<{
  builders?: Builder[];
}>();

const emit = defineEmits<{
  (e: "change", value: Builder[]): void;
}>();

const store = useStore();

const enableStepManage = ref(false);
const startFromScratch = ref(false);
const buildersCopy = reactive({ buildersArr: cloneDeep(props.builders) || [] });
const recommendedBuilders = computed(() => store.state.recommendedBuilders);

function adoptRecommendedBuilders() {
  emit("change", recommendedBuilders.value as Builder[]);
}

function addItem(v: Builder | undefined) {
  emitUpdate(buildersCopy.buildersArr.length ? buildersCopy.buildersArr.length : 0, v);
}

function emitUpdate(idx: number, v: Builder | undefined) {
  const valueCopy = cloneDeep(props.builders) || [];
  if (v) valueCopy[idx] = v;
  else valueCopy.splice(idx, 1);
  emit("change", valueCopy);
}

function emitDelete(idx: number) {
  const valueCopy = cloneDeep(props.builders) || [];
  valueCopy.splice(idx, 1);
  emit("change", valueCopy);
}

function moveStepPrev(idx: number) {
  [buildersCopy.buildersArr[idx], buildersCopy.buildersArr[idx - 1]] = [
    buildersCopy.buildersArr[idx - 1],
    buildersCopy.buildersArr[idx],
  ];
  emit("change", buildersCopy.buildersArr);
}

function moveStepNext(idx: number) {
  [buildersCopy.buildersArr[idx], buildersCopy.buildersArr[idx + 1]] = [
    buildersCopy.buildersArr[idx + 1],
    buildersCopy.buildersArr[idx],
  ];
  emit("change", buildersCopy.buildersArr);
}

onMounted(async () => {
  if (buildersCopy.buildersArr.length === 0) {
    await store.dispatch("fetchRecommendedBuilders");
  }
  await store.dispatch("fetchAllBuilders");
});

watch(
  () => props.builders,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (newVal, _) => {
    buildersCopy.buildersArr = cloneDeep(newVal) || [];
    if (buildersCopy.buildersArr.length === 0) {
      startFromScratch.value = false;
      await store.dispatch("fetchRecommendedBuilders");
    }
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.v-banner {
  border: 0;
}
.btn-enter-active {
  transition: all 0.15s ease-in;
}
.btn-leave-active {
  transition: all 0.15s ease-out;
}
.btn-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.btn-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.btn_wrapper_box {
  min-height: 80px;
  padding: 1rem 0;
  display: inline-block;
  position: relative;
  width: 100%;
}

.btn_add {
  width: 168px;
  position: absolute;
  left: 50%;
  bottom: 1%;
  margin-left: -192px;
}

.mainbtn {
  position: absolute;
  left: 50%;
  bottom: 1%;
  margin-left: 12px;
}

@media only screen and (max-width: 640px) {
  .btn_add {
    width: 168px;
    position: absolute;
    left: 25%;
    bottom: 50%;
    margin-left: 0;
  }

  .mainbtn {
    width: 168px;
    position: absolute;
    left: 25%;
    bottom: 0%;
    margin-left: 0;
  }
}
</style>
