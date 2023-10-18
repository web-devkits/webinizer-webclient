<template>
  <v-menu v-model="iconsMenu" :close-on-content-click="true" location="end">
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

    <v-card max-height="500" width="500">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-file-input
              accept="image/*"
              color="blue"
              label="Browse"
              prepend-icon="mdi-image-area"
              :append-icon="showAction && propsVal.uploadIcon.length > 0 ? 'mdi-upload' : ''"
              variant="outlined"
              :rules="rules"
              :model-value="propsVal.uploadIcon"
              :show-size="1000"
              @click:clear="$emit('clear')"
              @click:append="$emit('uploadImmediately')"
              @change="$emit('upload', $event)">
            </v-file-input>
          </v-col>
          <v-col v-for="(url, idx) in propsVal.icons" :key="idx" class="d-flex child-flex" cols="3">
            <v-img
              style="cursor: pointer"
              max-height="75px"
              max-width="75px"
              aspect-ratio="1"
              cover
              class="bg-grey-lighten-2"
              :src="url"
              @click="emit('change', url)">
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
import { ref } from "vue";

const iconsMenu = ref(false);

const rules = [
  /* eslint-disable */
  (value: any) => {
    return (
      !value || !value.length || value[0].size < 1024 * 1024 || "Size should be less than 1 MB!"
    );
  },
];

const propsVal = defineProps<{
  icons: string[] | undefined;
  selectedIcon: string | undefined;
  uploadIcon: File[];
  showAction?: boolean;
}>();

const emit = defineEmits<{
  (e: "upload", value: Event): void;
  (e: "change", value: string): void;
  (e: "clear"): void;
  (e: "getIcons"): void;
  (e: "uploadImmediately"): void;
}>();
</script>
<style lang=""></style>
