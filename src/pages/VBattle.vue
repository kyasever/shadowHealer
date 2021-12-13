<script setup lang="ts">

import VEntity from '../components/VEntity.vue'
import { Battle, Entity, IEntity, Skada } from '@core/battle';
import { createBattle, custom1 } from './runner'
import { ref } from 'vue';
import { GameConfig } from '@core/game';
import VSkada from '../components/VSkada.vue'


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
  battle.on('perSecond', () => {
    skadaItems.value = battle.skada.calculateResult(option.value as any)
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




const skadaItems = ref([{
  name: 'aaa',
  value: '350.12',
  percent: 100
},
{
  name: 'bbb',
  value: '310.3',
  percent: 80
},
{
  name: 'ccc',
  value: '245',
  percent: 60
},
])

let option = ref('dps');
function onSelectChange(value) {
  option.value = value
}
function onTouchSkadaItem(value) {
  battle.skada.getEntityDetails(value)
}
</script>

<template>
  <div style="display: flex; height: 40px; align-items: center;">
    <div class="label">time: {{ time }}</div>
    <div class="label">logicFPS: {{ fps }}</div>
  </div>
  <div style="display: flex;">
    <el-button class="btn" @click="loadPlayground" plain type="primary">startPlayground</el-button>
    <el-button class="btn" @click="loadBattle" plain type="primary">startBattle</el-button>
    <el-button class="btn" @click="runBattle" plain type="primary">runBattle</el-button>
  </div>
  <div id="array-rendering">
    <VEntity :entitys="items"></VEntity>
  </div>
  <VSkada
    :items="skadaItems"
    @change="onSelectChange"
    @touch-item="onTouchSkadaItem"
    :default-option="option"
  ></VSkada>
</template>

<style scoped>
.btn {
  margin-left: 20px;
}

.label {
  margin-left: 20px;
}
</style>
