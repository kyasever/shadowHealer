<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'
import { createPhaser } from '../phaser'

const enableGame = ref(false)
const enableDebug = ref(true)


if (!enableGame.value) {
  setTimeout(() => { document.querySelector('canvas').style.display = 'none' }, 100)

}
function onCanvasEnable(value) {
  const display = value ? 'block' : 'none'
  const canvas = document.querySelector('canvas').style.display = display
}

</script>

<template>
  <van-switch v-model="enableGame" @change="onCanvasEnable" />gameCanvas
  <van-switch v-model="enableDebug" />debugPanel
  <HelloWorld v-if="enableDebug" msg="vue-interface" />
  <canvas id="glcanvas"></canvas>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
