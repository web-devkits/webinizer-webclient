<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <div id="lib" class="">
    <section class="rh">
      <h2>Explore public WebAssembly (Wasm) and JavaScript libraries for your Web applications.</h2>
    </section>

    <div class="fsw">
      <section class="fs">
        <div class="filters">
          <h5 class="ft">Category</h5>
          <div v-for="(cat, idx) in Object.keys(allCategoryObjRef)" :key="idx" class="fi">
            <template v-if="allCategoryObjRef[cat].number > 0">
              <div class="checkbox">
                <input
                  :id="'cate_' + idx"
                  type="checkbox"
                  :checked="allCategoryObjRef[cat].checked"
                  @click="reverseCheckCategory(cat)" />
                <label :for="'cate_' + idx">{{ cat }}<span class="box"></span> </label>
              </div>
              <span class="badge sp">{{ allCategoryObjRef[cat].number }}</span>
            </template>
          </div>
        </div>
        <div class="filters">
          <h5 class="ft">File Size</h5>
          <div class="fi">
            <div class="checkbox">
              <input
                id="checkbox-lessThanFlag"
                type="checkbox"
                checked
                @click="lessThanFlag = !lessThanFlag" />
              <label for="checkbox-lessThanFlag"
                >&lt; {{ filterSize }}MB<span class="box"></span
              ></label>
            </div>
            <span class="badge sp">{{ lessThanCount }}</span>
          </div>
          <div class="fi">
            <div class="checkbox">
              <input
                id="checkbox-greaterThanFlag"
                type="checkbox"
                checked
                @click="greaterThanFlag = !greaterThanFlag" />
              <label for="checkbox-greaterThanFlag"
                >&gt;= {{ filterSize }}MB<span class="box"></span
              ></label>
            </div>
            <span class="badge sp">{{ greaterThanCount }}</span>
          </div>
        </div>
      </section>
    </div>

    <section class="rs rg">
      <template v-for="(lib, index) in reactiveData.LibsList" :key="index">
        <div
          v-if="
            (supportedCategoryArr.includes(lib.category)
              ? allCategoryObjRef[lib.category].checked
              : allCategoryObjRef[`Others`].checked) &&
            ((greaterThanFlag && lib.size > filterSize) || (lessThanFlag && lib.size < filterSize))
          "
          class="profile">
          <div class="pi">
            <div class="pti">
              <h3>{{ lib.title }}</h3>
              <div v-if="lib.img.length > 0"><img :src="lib.img" /></div>
            </div>
            <p class="desc" :title="lib.desc">{{ lib.desc }}</p>
          </div>
          <div class="psg">
            <div class="ps">
              <p class="pst">Size</p>
              <p class="psi">
                {{ lib.size }} <span class="sizeunit">{{ lib.sizeunit }}</span>
              </p>
            </div>
            <div class="ps">
              <p class="pst">Cate</p>
              <p class="psi">{{ lib.category }}</p>
            </div>
            <div class="ps">
              <p class="pst">Update</p>
              <p class="psi">{{ lib.lastupdate }}</p>
            </div>
          </div>
          <div class="pc">
            <a v-if="lib.iswebinizer" class="button" :href="lib.url">Download Now</a>
            <a v-if="!lib.iswebinizer" class="button external" :href="lib.url">View More</a>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";

type AllCategoryObject = Record<string, { checked: boolean; number: number }>;

enum SupportedCategoryEnum {
  Media = "Media",
  Performance = "Performance",
  Productivity = "Productivity",
  Vision = "Vision",
}

// libs' filter size. MB
const filterSize = 10;
const greaterThanFlag = ref(true);
const greaterThanCount = ref(0);
const lessThanFlag = ref(true);
const lessThanCount = ref(0);

const reactiveData = reactive({
  LibsList: [
    {
      iswebinizer: false,
      title: "FFMPEG",
      desc: "A pure WebAssembly / JavaScript port of FFmpeg. It enables video & audio record, convert and stream right inside browsers.",
      size: 32,
      sizeunit: "MB",
      img: "https://ffmpegwasm.netlify.app/img/logo192.png",
      url: "https://ffmpegwasm.netlify.app/",
      category: "Media",
      lastupdate: "23-08-18",
    },
    {
      iswebinizer: false,
      title: "oneTBB",
      desc: "oneAPI Threading Building Blocks (oneTBB) is a flexible C++ library that simplifies the work of adding parallelism to complex applications.",
      size: 5.88,
      sizeunit: "MB",
      img: "https://oneapi-src.github.io/oneTBB/_static/oneAPI-rgb-rev-100.png",
      url: "https://oneapi-src.github.io/oneTBB/",
      category: "Performance",
      lastupdate: "23-08-18",
    },
    {
      iswebinizer: false,
      title: "PyScript",
      desc: "PyScript allows users to create rich Python applications in the browser using HTML's interface and the power of Pyodide, Wasm, and modern web technologies.",
      size: 4.9,
      sizeunit: "MB",
      img: "https://pyscript.net/assets/images/pyscript-sticker-black.svg",
      url: "http://pyscript.net/",
      category: "Productivity",
      lastupdate: "23-08-18",
    },
    {
      iswebinizer: false,
      title: "OpenCV.js",
      desc: "An open-source BSD-licensed library that includes several hundreds of computer vision algorithms.",
      size: 17.1,
      sizeunit: "MB",
      img: "https://docs.opencv.org/4.5.5/opencv-logo-small.png",
      url: "https://docs.opencv.org/4.5.5/d5/d10/tutorial_js_root.html",
      category: "Vision",
      lastupdate: "23-08-18",
    },
  ],
});

const allCategoryObjRef = ref<AllCategoryObject>({});
allCategoryObjRef.value[SupportedCategoryEnum.Media] = { checked: true, number: 0 };
allCategoryObjRef.value[SupportedCategoryEnum.Performance] = { checked: true, number: 0 };
allCategoryObjRef.value[SupportedCategoryEnum.Productivity] = { checked: true, number: 0 };
allCategoryObjRef.value[SupportedCategoryEnum.Vision] = { checked: true, number: 0 };
allCategoryObjRef.value["Others"] = { checked: true, number: 0 };

const supportedCategoryArr = Object.keys(SupportedCategoryEnum);

// loop the libs data list and count the number of each category
for (const lib of reactiveData.LibsList) {
  for (const cate of supportedCategoryArr) {
    if (!supportedCategoryArr.includes(lib.category)) {
      allCategoryObjRef.value["Others"].number++;
      break;
    } else {
      if (lib.category === cate) {
        allCategoryObjRef.value[cate].number++;
        break;
      }
    }
  }

  lib.size > filterSize ? greaterThanCount.value++ : lessThanCount.value++;
}

function reverseCheckCategory(cate: string) {
  for (const _cate of Object.keys(allCategoryObjRef.value)) {
    if (_cate === cate) {
      allCategoryObjRef.value[_cate].checked = !allCategoryObjRef.value[_cate].checked;
      return;
    }
  }
}
</script>

<style lang="scss" scoped>
.lib {
  margin: 1rem auto;
}

/*overall layout*/
#lib {
  margin: 0 auto;
  padding: 0 3rem;
  max-width: 1280px;
  color: var(--foregroundColor);
  text-align: left;
}

#lib section {
  position: relative;
}

.rh h2 {
  font-size: 14px;
  font-weight: 400;
  color: #333;
}

.pi h3 {
  font-size: 26px;
  color: #333;
  font-weight: 600;
  margin: 5px 0;
}

.pti {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 0px;
  justify-items: center;
}

.pti h3 {
  justify-self: flex-start;
  align-self: center;
}

.pti div {
  justify-self: flex-end;
  align-self: center;
}

.pti div img {
  max-height: 26px;
  height: 26px;
}

/*checkboxes*/
input:disabled ~ * {
  opacity: 0.3;
  user-select: none;
  pointer-events: none;
}

.checkbox {
  position: relative;
  user-select: none;
  margin-bottom: 10px;
}
.checkbox input {
  display: none;
}
.checkbox label {
  position: relative;
  vertical-align: middle;
  cursor: pointer;
  font-weight: 500;
  padding-left: 35px;
}

.checkbox input:checked + label span.box {
  background: var(--btn);
  border-color: var(--btn);
}

.checkbox span.box {
  display: inline-block;
  border-radius: 3px;
  border: 1px solid var(--black-2);
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 3px;
  transition: 0.3s ease;
  position: absolute;
  left: 0;
  box-shadow:
    0px 3px 1px -2px rgb(0 0 0 / 3%),
    0px 2px 2px 0px rgb(0 0 0 / 14%),
    0px 1px 5px 0px rgb(0 0 0 / 12%);
}

.checkbox span.box:hover {
  box-shadow:
    0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%),
    0px 1px 10px 0px rgb(0 0 0 / 12%);
}

.checkbox span.box:before,
.checkbox span.box:after {
  content: "";
  position: absolute;
  width: 4px;
  height: 16px;
  border-radius: 40px;
  background: var(--white);
  transition: all 0.3s ease;
}
.checkbox span.box:before {
  transform: rotate(45deg) translateY(-5px) translateX(10px) scale(0);
}
.checkbox span.box:after {
  height: 8px;
  transform: rotate(-45deg) translateY(10px) translateX(-4px) scale(0);
}

.checkbox input:checked + label span.box:before {
  transform: rotate(45deg) translateY(-5px) translateX(10px) scale(1);
}
.checkbox input:checked + label span.box:after {
  height: 8px;
  transform: rotate(-45deg) translateY(10px) translateX(-4px) scale(1);
}
.checkbox input:disabled:checked + span.box {
  background: var(--black-2);
  border: var(--black-2);
}
.checkbox input:disabled:checked ~ label:before,
.checkbox input:disabled:checked ~ label:after {
  background: var(--black);
}

/*buttons & links*/
.buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.buttons > * {
  flex: 1 1 calc(50% - 20px);
  margin-top: 20px;
}
.buttons > *:nth-child(odd) {
  margin-right: 20px;
}

.sizeunit {
  font-size: 0.8rem;
}

.desc {
  height: 82px;
  overflow: hidden;
  text-overflow: ellipsis;
}

a.button,
input.button,
button {
  outline: none;
  text-align: center;
  font-size: 1em;
  padding: 10px 30px;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 3px;
  background: var(--btn);
  color: var(--white);
  position: relative;
  top: 0;
  transition: 0.2s ease;
  text-decoration: none;
  box-shadow:
    0px 3px 1px -2px rgb(0 0 0 / 3%),
    0px 2px 2px 0px rgb(0 0 0 / 14%),
    0px 1px 5px 0px rgb(0 0 0 / 12%);
}
a.button:hover,
a.button.hover,
input.button:hover,
input.button.hover,
button:hover,
button.hover {
  color: var(--white);
  letter-spacing: 2px;
  background: linear-gradient(135deg, var(--btn) 25%, var(--secondary) 25%);
  transition: 0.2s;
  box-shadow:
    0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%),
    0px 1px 10px 0px rgb(0 0 0 / 12%);
}
a.button:active,
a.button.active,
input.button:active,
input.button.active,
button:active,
button.active {
  background: linear-gradient(135deg, var(--btn) 25%, var(--secondary) 25%);
  outline: none;
  box-shadow:
    0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%),
    0px 1px 10px 0px rgb(0 0 0 / 12%);
  top: 0;
}

a.external {
  background: var(--secondary);
}

a.external:hover {
  background: linear-gradient(135deg, var(--btn) 25%, var(--secondary) 25%);
}

a.button.disabled,
input.button.disabled,
button.disabled {
  opacity: 0.4;
  user-select: none;
  pointer-events: none;
}
a.button.medium,
input.button.medium,
button.medium {
  padding: 15px 18px;
  width: auto;
}
a.button.small,
input.button.small,
button.small {
  padding: 10px 12px;
  width: auto;
  font-size: 14px;
  font-weight: 500;
}

/*badges*/
.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 50px;
  font-weight: 500;
  text-transform: uppercase;
  line-height: 1;
}

.sp {
  background: var(--p-05);
  color: var(--btn);
  box-shadow: 1px 3px 5px 0px rgb(35 100 210 / 10%);
}

.sp:hover {
  box-shadow:
    0px 3px 1px -2px rgb(0 0 0 / 3%),
    0px 2px 2px 0px rgb(0 0 0 / 14%),
    0px 1px 5px 0px rgb(0 0 0 / 12%);
}
.sp:before,
.sp:after {
  background: var(--p-05);
}

.rh {
  grid-column: span 2;
  display: grid;
  grid-template-columns: 1fr max-content;
}

.rs {
  display: grid;
  grid-gap: 1rem;
}

.rg {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

.profile {
  position: relative;
  background: var(--backgroundColor);
  color: var(--foregroundColor);
  border-radius: 5px;
  overflow: hidden;
  transition: 0.2s ease;
  display: grid;
  border: 1px solid var(--black-03);
}

.profile:hover {
  border: 1px solid var(--black-1);
  box-shadow: 1px 3px 5px 0px rgb(35 100 210 / 10%);
}

.pimg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-bottom: 7px solid var(--secondaryColor);
}
.pi {
  padding: 20px 20px;
}

.psg {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 0px;
  justify-items: center;
}

.pst {
  color: var(--black-2);
  font-size: 12px;
  margin-bottom: -1rem;
}

.ps {
  text-align: center;
}

.psi {
  height: 1rem;
  font-size: 1rem;
  margin: 1rem 0;
}

.pc {
  padding: 15px 25px 35px 25px;
  justify-self: center;
}

.fs {
  margin: 0;
}

.ft {
  font-size: 18px;
  margin: 25px 0;
}
.fi {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  margin-bottom: 10px;
}
.fi .checkbox {
  position: relative;
  margin: 0;
}

.filters:not(:first-of-type) {
  border-top: 0.5px solid var(--lightGrayColor);
  margin-top: 25px;
}

@media (min-width: 500px) and (max-width: 992px) {
  .fs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  .fs h3 {
    grid-column: span 2;
  }

  .filters:nth-child(2) {
    margin-right: 25px;
  }

  .filters:nth-child(3) {
    border-top: none;
    border-left: 0.5px solid var(--lightGrayColor);
    margin-top: 0;
    padding-left: 25px;
  }
}
@media (min-width: 500px) {
  .rs.rg .profile {
    margin: auto;
    overflow: hidden;
  }
  .rh h2 {
    margin-bottom: 2rem;
  }
  .fs {
    margin: 0 0 2rem 0;
  }
}

@media (min-width: 992px) {
  #lib {
    display: grid;
    grid: min-content auto 1fr;
  }

  .fsw {
    position: relative;
    width: 200px;
  }

  .fs {
    position: sticky;
  }

  .rs {
    margin-left: 2em;
  }
}

@media only screen and (max-width: 640px) {
  #lib {
    padding: 0 1rem;
  }
  .rh h2 {
    margin-bottom: 1rem;
  }
  .fs {
    margin: 0 0 2rem 0;
  }
}
</style>
