<script setup lang="ts">

import Entity from './VEntity.vue'
import { Battle, DeltaTime, GameConfig, IEntity } from '@core/common';
import { createBattle, custom1 } from './runner'
import { ref } from 'vue';

const time = ref('0');
const fps = ref('0')
let battle: Battle
GameConfig.gameSpeed = 0.01

function startBattle(b) {
  battle = b;
  battle.onUpdate(() => {
    time.value = battle.time.toFixed(2)
    fps.value = battle.FPS.toFixed(2)
    items.value = {
      ...battle.characters
    }
  })
  items.value = {
    ...battle.characters
  }
}

function loadBattle() {
  startBattle(createBattle())
}
function loadPlayground() {
  startBattle(custom1())
}

function runBattle() {
  battle.start()
}

function output() {
  battle?.skada.outPut('monk')
}


const items = ref<Array<IEntity>>()

</script>

<template>
  <div style="display: flex; height: 40px; align-items: center;">
    <div class="label">time: {{ time }}</div>
    <div class="label">logicFPS: {{ fps }}</div>
  </div>
  <div style="display: flex;">
    <van-button class="btn" @click="loadPlayground" plain type="primary">startPlayground</van-button>
    <van-button class="btn" @click="loadBattle" plain type="primary">startBattle</van-button>
    <van-button class="btn" @click="runBattle" plain type="primary">runBattle</van-button>
    <van-button class="btn" @click="output" plain type="primary">outputSkada</van-button>
  </div>
  <ul id="array-rendering">
    <li v-for="entity in items">
      <!-- 这样来让子组件认为,每次更新都是一个新的Entity.. -->
      <Entity :entity="{ ...entity }"></Entity>
    </li>
  </ul>
</template>

<style scoped>
.btn {
  margin-left: 20px;
}

.label {
  margin-left: 20px;
}
</style>
