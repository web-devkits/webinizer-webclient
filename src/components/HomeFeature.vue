<!--
  *  Copyright (C) 2023 Intel Corporation. All rights reserved.
  *  Licensed under the Apache License 2.0. See LICENSE in the project root for license information.
  *  SPDX-License-Identifier: Apache-2.0
  -->

<template>
  <div id="feature" class="mw1280">
    <h3>Feature</h3>
    <div class="cards">
      <div class="card c1">
        <div class="ci ci-c1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
            <path
              d="M131.5 217.5L55.1 100.1c47.6-59.2 119-91.8 192-92.1 42.3-.3 85.5 10.5 124.8 33.2 43.4 25.2 76.4 61.4 97.4 103L264 133.4c-58.1-3.4-113.4 29.3-132.5 84.1zm32.9 38.5c0 46.2 37.4 83.6 83.6 83.6s83.6-37.4 83.6-83.6-37.4-83.6-83.6-83.6-83.6 37.3-83.6 83.6zm314.9-89.2L339.6 174c37.9 44.3 38.5 108.2 6.6 157.2L234.1 503.6c46.5 2.5 94.4-7.7 137.8-32.9 107.4-62 150.9-192 107.4-303.9zM133.7 303.6L40.4 120.1C14.9 159.1 0 205.9 0 256c0 124 90.8 226.7 209.5 244.9l63.7-124.8c-57.6 10.8-113.2-20.8-139.5-72.5z" />
          </svg>
        </div>
        <div class="cl cl-c1">Native to Web</div>
        <div class="card_un">Conversion</div>
        <div class="cu-description">
          Converting your native applications to high quality cross-platform web applications,
          running everywhere with Wasm and JavaScript.
        </div>

        <div class="cu-stats cs-c1 clearfix">
          <div class="ot">
            <div class="stat">C</div>
            <div class="stat-value">Native</div>
          </div>

          <div class="ot">
            <div class="stat">C++</div>
            <div class="stat-value">Native</div>
          </div>

          <div class="ot no-border">
            <div class="stat">Rust</div>
            <div class="stat-value">Native</div>
          </div>
        </div>
      </div>

      <div class="card c2">
        <div class="ci ci-c2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
            <path
              id="wasm"
              d="m376 0c0 1.08 0 2.16 0 3.3 0 38.76-31.42 70.17-70.17 70.17-38.76 0-70.17-31.42-70.17-70.17l0 0c0-1.14 0-2.22 0-3.3L0 0l0 612 612 0 0-612z" />
            <path
              d="m142.16 329.81 40.56 0 27.69 147.47 0.5 0 33.28-147.47 37.94 0 30.06 149.28 0.59 0 31.56-149.28 39.78 0-51.69 216.69-40.25 0-29.81-147.47-0.78 0-31.91 147.47-41 0zm287.69 0 63.94 0 63.5 216.69-41.84 0-13.81-48.22-72.84 0-10.66 48.22-40.75 0zm24.34 53.41-17.69 79.5 55.06 0-20.31-79.5z"
              fill="#fff" />
          </svg>
        </div>
        <div class="cl cl-c2">Out-of-the-box</div>
        <div class="card_un">Wasm Libraries</div>
        <div class="cu-description">
          Reaching near native performance by utilizing the pre-built Web Assembly (Wasm) libraries
          in your web applications.
        </div>

        <div class="cu-stats cs-c2 clearfix">
          <div class="ot">
            <div class="stat">OpenCV<sup>.js</sup></div>
            <div class="stat-value">Vision</div>
          </div>

          <div class="ot">
            <div class="stat" title="Threading Building Blocks">TBB</div>
            <div class="stat-value">Performance</div>
          </div>

          <div class="ot no-border">
            <div class="stat">FFMPEG</div>
            <div class="stat-value">Media</div>
          </div>
        </div>
      </div>

      <div class="card c3">
        <div class="ci ci-c3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
            <path
              d="M256 48C256 21.49 277.5 0 304 0H592C618.5 0 640 21.49 640 48V464C640 490.5 618.5 512 592 512H381.3C383 506.1 384 501.6 384 496V253.3C402.6 246.7 416 228.9 416 208V176C416 149.5 394.5 128 368 128H256V48zM571.3 347.3C577.6 341.1 577.6 330.9 571.3 324.7L507.3 260.7C501.1 254.4 490.9 254.4 484.7 260.7L420.7 324.7C414.4 330.9 414.4 341.1 420.7 347.3C426.9 353.6 437.1 353.6 443.3 347.3L480 310.6V432C480 440.8 487.2 448 496 448C504.8 448 512 440.8 512 432V310.6L548.7 347.3C554.9 353.6 565.1 353.6 571.3 347.3H571.3zM0 176C0 167.2 7.164 160 16 160H368C376.8 160 384 167.2 384 176V208C384 216.8 376.8 224 368 224H16C7.164 224 0 216.8 0 208V176zM352 480C352 497.7 337.7 512 320 512H64C46.33 512 32 497.7 32 480V256H352V480zM144 320C135.2 320 128 327.2 128 336C128 344.8 135.2 352 144 352H240C248.8 352 256 344.8 256 336C256 327.2 248.8 320 240 320H144z" />
          </svg>
        </div>
        <div class="cl cl-c3">One stop</div>
        <div class="card_un">Deployment</div>
        <div class="cu-description">
          The one stop portal from UI, CLI to docker images greatly improves efficiency of the
          conversion and deployment.
        </div>

        <div class="cu-stats cs-c3 clearfix">
          <div class="ot">
            <div class="stat">Compiler</div>
            <div class="stat-value">Suite</div>
          </div>

          <div class="ot">
            <div class="stat">Tools</div>
            <div class="stat-value">Suite</div>
          </div>

          <div class="ot no-border">
            <div class="stat">Package</div>
            <div class="stat-value">Suite</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
#feature {
  text-align: center;
  margin: 3rem 1rem;
  color: #333;
}

.cards {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 2rem;
  grid-row-gap: 0px;
  justify-items: center;
  align-items: center;
}

.card {
  margin: auto;
  border-radius: 5px;
  border: 1px solid var(--black-03);
}

.card:hover {
  border: 1px solid var(--black-1);
  box-shadow: 1px 3px 5px 0px rgb(35 100 210 / 10%);
  transition: 0.2s ease;
}

.ci {
  position: relative;
  margin-bottom: 10px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.ci svg {
  height: 88px;
  width: 88px;
  padding-top: 2.5rem;
}

.c2 {
  margin: 0px auto;
  text-align: center;
}

.ci-c2 {
  height: 88px;
  width: 88px;
  overflow: hidden;
  display: inline-block;
}
.ci-c2 svg {
  display: inline-block;
  height: 88px;
  width: 88px;
}

.ci-c2 svg path {
  transform: scale(0.095);
}

.ci-c1 svg,
#wasm,
.ci-c3 svg {
  fill: #666;
}

.c1:hover svg {
  fill: var(--secondary);
}

.c2:hover #wasm {
  fill: var(--p);
}

.c3:hover svg {
  fill: #7b1fa2;
}

.cl {
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
}

.card_un {
  font-size: 26px;
  color: var(--black);
  font-weight: 600;
}

.cu-description {
  padding: 20px;
  height: 102px;
  max-height: 102px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.cs-c1 {
  background: var(--white);
}
.cs-c1 .ot {
  color: #333;
  border-right: 1px solid rgba(0, 0, 0, 0.02);
}

.cs-c2 {
  background: var(--white);
}
.cs-c2 .ot {
  color: #333;
  border-right: 1px solid rgba(0, 0, 0, 0.02);
}

.cs-c3 {
  background: var(--white);
}
.cs-c3 .ot {
  color: #333;
  border-right: 1px solid rgba(0, 0, 0, 0.02);
}

.c1:hover .cs-c1 {
  background: var(--secondary);
}

.c1:hover .cs-c1 .ot {
  color: var(--white);
  border-right: 1px solid var(--black-2);
}

.c2:hover .cs-c2 {
  background: var(--p);
}
.c2:hover .cs-c2 .ot {
  color: var(--white);
  border-right: 1px solid var(--black-2);
}

.c3:hover .cs-c3 {
  background: #7b1fa2;
}
.c3:hover .cs-c3 .ot {
  color: var(--white);
  border-right: 1px solid var(--black-2);
}

.c1:hover .cs-c1 .ot:last-child,
.c2:hover .cs-c2 .ot:last-child,
.c3:hover .cs-c3 .ot:last-child {
  border-right: 0px;
}

.cu-stats {
  color: var(--white);
  font-weight: 700;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 0px;
  justify-items: stretch;
  align-items: center;
}
.cu-stats .ot {
  padding: 20px 15px;
}
.cu-stats sup {
  position: absolute;
  bottom: 0px;
  top: 18px;
  font-size: 45%;
  margin-left: 2px;
}
.cu-stats .stat {
  position: relative;
  font-size: 22px;
}
.cu-stats .stat-value {
  text-transform: uppercase;
  font-weight: 400;
  font-size: 10px;
}
.cu-stats .no-border {
  border-right: none;
}

@media only screen and (max-width: 640px) {
  .cards {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
  }
  .card {
    width: 90vw;
  }

  .cu-stats .stat {
    font-size: 16px;
  }

  .cu-stats .stat-value {
    font-size: 8px;
  }
}

@media screen and (min-width: 641px) and (max-width: 1024px) {
  .cards {
    grid-column-gap: 0.5rem;
  }
  .cu-stats .ot {
    padding: 10px 5px;
  }

  .cu-description {
    font-size: 12px;
  }

  .cu-stats .stat {
    font-size: 16px;
  }

  .cu-stats .stat-value {
    font-size: 6px;
  }
}

@media screen and (min-width: 1025px) and (max-width: 1280px) {
  .cards {
    grid-column-gap: 0rem;
  }
  .card {
    width: 90%;
  }
  .cu-stats .ot {
    padding: 20px 10px;
  }
  .cu-stats .stat {
    font-size: 20px;
  }
}
</style>
