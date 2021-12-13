<script setup lang="ts">
import { ref } from 'vue';
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
const gameSpeedDescription = ['pause', 'x1', 'x2', 'x4', 'x32', 'instance']
const gameSpeedTruth = [-1, DeltaTime, DeltaTime / 2, DeltaTime / 4, DeltaTime / 32, 0]


function changeGameSpeed() {
  GameConfig.speed = gameSpeedTruth[gameSpeed.value]
}

const active = ref("Battle")

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
    <el-slider
      class="slider"
      v-model="logLevel"
      @change="changeLogLevel"
      :min="1"
      :max="5"
      show-stops
    />
  </div>
  <div class="sliderContainer">
    <div>gameSpeed:{{ gameSpeedDescription[gameSpeed] }}</div>
    <el-slider
      class="slider"
      v-model="gameSpeed"
      @change="changeGameSpeed"
      :min="0"
      :max="5"
      show-stops
    />
    <el-button @click="pause">{{ gameSpeed === 0 ? 'run' : 'pause' }}</el-button>
  </div>

  <el-tabs v-model="active">
    <el-tab-pane label="Game" name="Game">game</el-tab-pane>
    <el-tab-pane label="Battle" name="Battle">
      <VBattle />
    </el-tab-pane>
    <el-tab-pane label="Simulate" name="Simulate">simulate</el-tab-pane>
    <el-tab-pane label="Test" name="Test">test</el-tab-pane>
  </el-tabs>
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
  flex-grow: 2;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
