<script setup lang="ts">

import Entity from './Entity.vue'
import { Battle, DeltaTime, GameConfig, IEntity } from '@core/common';
import { loadData } from '@core/data'
import { createBattle, custom1 } from './runner'
import { ref } from 'vue';

defineProps<{ msg: { v: string } }>()

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
  battle?.skada.outPut()
}



const logLevel = ref(1)
function changeLogLevel() {
  GameConfig.logLevel = logLevel.value
}

const gameSpeed = ref(2)
const gameSpeedDescription = ['pause', 'x1', 'x2', 'x4', 'x8', 'x16', 'instance']
const gameSpeedTruth = [-1, DeltaTime, DeltaTime / 2, DeltaTime / 4, DeltaTime / 8, DeltaTime / 16, 0]
function changeGameSpeed() {
  GameConfig.gameSpeed = gameSpeedTruth[gameSpeed.value]
}

const items = ref<Array<IEntity>>()

</script>

<template>
  <div>time: {{ time }}</div>
  <div>logicFPS: {{ fps }}</div>
  <div style="height: 30px; display: flex; align-items: center;">
    <div>logLevel:{{ logLevel }}</div>
    <van-slider
      v-model="logLevel"
      @change="changeLogLevel"
      min="1"
      max="5"
      step="1"
      style="margin-left: 20px; margin-right: 30px;"
    />
    <div>gameSpeed:{{ gameSpeedDescription[gameSpeed] }}</div>
    <van-slider
      v-model="gameSpeed"
      @change="changeGameSpeed"
      min="0"
      max="6"
      step="1"
      style="margin-left: 20px; margin-right: 30px;"
    />
  </div>
  <van-button class="btn" @click="loadPlayground" plain type="primary">loadPlayground</van-button>
  <van-button class="btn" @click="loadBattle" plain type="primary">loadBattle</van-button>
  <van-button class="btn" @click="runBattle" plain type="primary">run</van-button>
  <van-button class="btn" @click="output" plain type="primary">output</van-button>
  <ul id="array-rendering">
    <li v-for="entity in items">
      <!-- 这样来让子组件认为,每次更新都是一个新的Entity.. -->
      <Entity :entity="{ ...entity }"></Entity>
    </li>
  </ul>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

.debug-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn {
  width: 100px;
}
</style>
