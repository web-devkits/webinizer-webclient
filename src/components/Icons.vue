<template>
  <v-menu v-model="iconsMenu" :close-on-content-click="false" location="end">
    <template #activator="{ props }">
      <v-avatar
        style="cursor: pointer"
        :image="propsVal.selectedIcon"
        color="indigo"
        v-bind="props"
        @click="$emit('getIcons')"
        >Icon</v-avatar
      >
    </template>

    <v-card max-height="400" width="400">
      <v-toolbar height="20"
        ><v-icon class="ml-n2" icon="mdi-menu"></v-icon>
        <v-toolbar-title>Select icon</v-toolbar-title>
        <v-spacer></v-spacer>
        <template v-if="propsVal.showAction && propsVal.existUploadIcon">
          <v-btn v-if="!inEditingMode" variant="text" @click="inEditingMode = true">edit</v-btn>
          <v-btn v-else class="mr-n2" variant="text" @click="inEditingMode = false"
            >cancel</v-btn
          ></template
        >
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-file-input
              accept="image/*"
              color="blue"
              label="Upload from local"
              prepend-icon="mdi-image-area"
              variant="outlined"
              :rules="rules"
              :model-value="propsVal.uploadIcon"
              :show-size="1000"
              @click:clear="$emit('clear')"
              @change="$emit('upload', $event)">
              <template #append>
                <v-btn
                  v-if="showAction"
                  size="small"
                  color="blue"
                  variant="flat"
                  :disabled="propsVal.uploadIcon.length === 0"
                  @click="$emit('uploadImmediately')"
                  >upload</v-btn
                >
              </template>
            </v-file-input>
          </v-col>
          <v-col v-for="(obj, idx) in propsVal.icons" :key="idx" class="d-flex child-flex" cols="3">
            <v-img
              :style="inEditingMode ? `` : `cursor: pointer`"
              max-height="70px"
              max-width="70px"
              aspect-ratio="1"
              cover
              class="bg-grey-lighten-2"
              :src="obj.url"
              @click="
                () => {
                  if (inEditingMode) return;
                  else emit('change', obj.url);
                }
              ">
              <!-- only the icon that is uploaded and not used can be removed -->
              <v-badge
                v-if="inEditingMode && obj.uploaded && obj.url !== propsVal.selectedIcon"
                floating
                color="error"
                offset-x="-50"
                offset-y="5"
                ><template #badge
                  ><span style="cursor: pointer" @click.stop="$emit('removeIcon', obj.url)"
                    >X</span
                  ></template
                ></v-badge
              >

              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col> </v-row
      ></v-container>
    </v-card>
  </v-menu>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { Icons } from "../webinizer";

const iconsMenu = ref(false);
const inEditingMode = ref(false);

const rules = [
  /* eslint-disable */
  (value: any) => {
    return (
      !value || !value.length || value[0].size < 1024 * 1024 || "Size should be less than 1 MB!"
    );
  },
];

const propsVal = defineProps<{
  icons: Icons[] | undefined;
  selectedIcon: string | undefined;
  uploadIcon: File[];
  showAction?: boolean;
  existUploadIcon?: boolean;
}>();

const emit = defineEmits<{
  (e: "upload", value: Event): void;
  (e: "change", value: string): void;
  (e: "clear"): void;
  (e: "getIcons"): void;
  (e: "uploadImmediately"): void;
  (e: "removeIcon", value: string): void;
}>();

watch(
  () => propsVal.existUploadIcon,
  async (_n) => {
    if (_n === false) {
      inEditingMode.value = false;
    }
  }
);
</script>
<style lang=""></style>
