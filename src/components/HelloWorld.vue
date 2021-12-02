<script setup lang="ts">
defineProps<{ msg: string }>()
import { Battle, GameConfig } from '@core/common';
import { createBattle } from './runner'
import { ref } from 'vue';
const time = ref('0');

const battle:Battle = createBattle()


battle.onUpdate(()=> {
  time.value = battle.time.toFixed(2)
})

function run(){
  GameConfig.gameSpeed = 0.02
  battle.start()
}

function pause(){
  GameConfig.gameSpeed = -1
}

function setContinue(){
  GameConfig.gameSpeed = 0.02
}

function output(){
  battle.skada.outPut()
}

function setBattleField(){
  // 在角色上挂一个事件处理器, 然后用vue去监听角色的事件
  // afterEffect afterBehit afterCalculate 这些
}

</script>

<template>
  <h1>{{ msg }}</h1>
  <div>time: {{ time }}</div>
  <van-button class="btn" @click="run" plain type="primary">run</van-button>
  <van-button class="btn" @click="pause" plain type="primary">pause</van-button>
  <van-button class="btn" @click="setContinue" plain type="primary">continue</van-button>
  <van-button class="btn" @click="output" plain type="primary">output</van-button>
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

.debug-panel{
  display: flex; 
  flex-direction: column;
  align-items: center;
}

.btn {
  width: 100px;
}
</style>
