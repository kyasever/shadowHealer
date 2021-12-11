<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Root from './components/Root.vue'
import { ref } from 'vue'
import { createPhaser } from '../phaser'

const enableGame = ref(false)
const enableVue = ref(true)


if (!enableGame.value) {
  setTimeout(() => { document.querySelector('canvas').style.display = 'none' }, 100)

}
function onCanvasEnable(value) {
  const display = value ? 'block' : 'none'
  const canvas = document.querySelector('canvas').style.display = display
}

const refMsg = ref({ v: 'msg' })

</script>

<template>
  <van-switch v-model="enableGame" @change="onCanvasEnable" />enableGame
  <van-switch v-model="enableVue" />enableVue
  <Root v-if="enableVue" />
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
  position: absolute;
  width: 100%;
}
</style>
