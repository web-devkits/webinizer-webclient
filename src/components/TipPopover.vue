<template>
  <div ref="helpPopover" class="helpPopover" @mouseover="popoverPosition()">
    <v-btn icon="mdi-help-circle-outline" size="x-small" variant="flat"> </v-btn>
    <div ref="popover" class="popover">
      <div ref="leftBar" class="leftBar"><span ref="popoverArrow"></span></div>
      <div>
        <div ref="tips" class="tips">Tips</div>
        <div
          ref="description"
          v-dompurify-html="props.tipContent"
          class="description"
          style="white-space: pre-line"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const helpPopover = ref<HTMLDivElement>();
const popover = ref<HTMLDivElement>();
const popoverArrow = ref<HTMLSpanElement>();
const leftBar = ref<HTMLDivElement>();
const tips = ref<HTMLDivElement>();
const description = ref<HTMLDivElement>();

type TipType = "M" | "L";

const props = defineProps<{
  tipContent: string;
  type: TipType;
}>();

// the default position is behind of the help icon
function popoverPosition() {
  let left = helpPopover.value?.getBoundingClientRect().left || 0;
  let top = helpPopover.value?.getBoundingClientRect().top || 0;
  let height = popover.value?.clientHeight || 0;
  left = left + 20;
  let topnew = top - height / 2.0 + 3;

  if (left && top && height) {
    let style = "";

    if (props.type === "M") {
      style = `left: ${left}px; top: ${topnew}px`;
    } else if (props.type === "L") {
      style = `left: ${left}px; top: ${topnew}px; width: 400px;`;
      tips.value?.setAttribute("style", "width: 390px;");
      description.value?.setAttribute("style", "width: 390px;");
    }

    popover.value?.setAttribute("style", style);
    popoverArrow.value?.setAttribute("style", `left: ${left + 2}px; top: ${top + 4}px`);
  }

  if (left * top * height == 0) {
    popover.value?.setAttribute("style", "left: 50%; top: 50%; transform: translate(-50%, -50%);");
    leftBar.value?.setAttribute("style", "display: none;");
  }
}
</script>
<style lang="css"></style>
