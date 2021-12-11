<script setup lang="ts">
import { ref } from 'vue';
import { Entity } from '@core/battle';
import VBattle from './VBattle.vue'
import { GameConfig, DeltaTime } from '@core/game';
import { log_level } from '@core/utils';

const defaultLogLevel = log_level.verbose
const logLevel = ref(defaultLogLevel)
const logLevelDescription = ['verbose', 'debug', 'info', 'warn', 'error']
function changeLogLevel() {
  GameConfig.logLevel = logLevel.value
}

const defaultGameSpeed = 2
const gameSpeed = ref(defaultGameSpeed)
const gameSpeedDescription = ['pause', 'x1', 'x2', 'x4', 'x8', 'instance']
const gameSpeedTruth = [-1, DeltaTime, DeltaTime / 2, DeltaTime / 4, DeltaTime / 8, 0]


function changeGameSpeed() {
  GameConfig.speed = gameSpeedTruth[gameSpeed.value]
}

const active = ref(1)

let lastSpeed = gameSpeed.value
function pause() {
  if (gameSpeed.value !== 0) {
    lastSpeed = gameSpeed.value
    gameSpeed.value = 0
  } else {
    gameSpeed.value = lastSpeed
  }
  GameConfig.speed = gameSpeedTruth[gameSpeed.value]
}

</script>

<template>
  <div class="sliderContainer">
    <div>logLevel:{{ logLevelDescription[logLevel] }}</div>
    <van-slider
      class="slider"
      v-model="logLevel"
      @change="changeLogLevel"
      min="1"
      max="5"
      step="1"
    />
  </div>
  <div class="sliderContainer">
    <div>gameSpeed:{{ gameSpeedDescription[gameSpeed] }}</div>
    <van-slider
      class="slider"
      v-model="gameSpeed"
      @change="changeGameSpeed"
      min="0"
      max="5"
      step="1"
    />
    <van-button @click="pause">{{ gameSpeed === 0 ? 'run' : 'pause' }}</van-button>
  </div>

  <van-tabs v-model:active="active">
    <van-tab title="Game">game</van-tab>
    <van-tab title="Battle">
      <VBattle />
    </van-tab>
    <van-tab title="Simulate">simulate</van-tab>
    <van-tab title="Test">test</van-tab>
  </van-tabs>
</template>

<style scoped>
.sliderContainer {
  height: 30px;
  display: flex;
  align-items: center;
  margin-left: 20px;
  margin-right: 20px;
}

.slider {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
