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

const teams = ref<Array<Entity>>([])
const enemys = ref<Array<Entity>>([])

function updateTree(b: Battle) {
  time.value = battle.time.toFixed(2)
  fps.value = battle.FPS.toFixed(2)
  teams.value = [
    ...battle.teams
  ]
  enemys.value = [
    ...battle.enemys
  ]
}

function startBattle(b: Battle) {
  battle = b;
  battle.on('init', () => {
    console.time('battle')
  })
  battle.on('update', () => {
    updateTree(battle)
  })
  battle.on('selectEntity', () => {
    updateTree(battle)
  })
  battle.on('end', () => {
    console.timeEnd('battle')
  })
  battle.on('perSecond', () => {
    skadaItems.value = battle.skada.calculateResult(option.value as any)
  })
  battle.init()
  teams.value = [
    ...battle.teams
  ]
  enemys.value = [
    ...battle.enemys
  ]

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

function debug() {
  console.log(battle)
}
</script>

<template>
  <div style="display: flex; height: 40px; align-items: center;">
    <div class="label" @click="debug">time: {{ time }}</div>
    <div class="label">logicFPS: {{ fps }}</div>
  </div>
  <div style="display: flex;">
    <el-button size="mini" class="btn" @click="loadPlayground" plain type="primary">startPlayground</el-button>
    <el-button size="mini" class="btn" @click="loadBattle" plain type="primary">startBattle</el-button>
    <el-button size="mini" class="btn" @click="runBattle" plain type="primary">runBattle</el-button>
  </div>
  <VEntity :entitys="teams"></VEntity>
  <VEntity :entitys="enemys"></VEntity>
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
