<script setup lang="ts">

import VEntity from './VEntity.vue'
import { Battle, Entity, IEntity } from '@core/battle';
import { createBattle, custom1 } from './runner'
import { ref } from 'vue';
import { GameConfig } from '@core/game';

const time = ref('0');
const fps = ref('0')
let battle: Battle
GameConfig.speed = 0.01

const items = ref<Array<IEntity>>()
function startBattle(b: Battle) {
  battle = b;
  console.time('battle')
  battle.on('update', () => {
    time.value = battle.time.toFixed(2)
    fps.value = battle.FPS.toFixed(2)
    items.value = {
      ...battle.entitys as any
    }
  })
  battle.on('end', () => {
    console.timeEnd('battle')
  })
  battle.init()
  items.value = {
    ...battle.entitys as any
  }

}

function loadBattle() {
  startBattle(createBattle())
}
function loadPlayground() {
  startBattle(custom1())
}

function runBattle() {
  battle.run()
}





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
  </div>
  <ul id="array-rendering">
    <li v-for="entity in items">
      <!-- 这样来让子组件认为,每次更新都是一个新的Entity.. -->
      <VEntity :entity="{ ...entity }"></VEntity>
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
