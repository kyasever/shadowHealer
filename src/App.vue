<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Root from './pages/Root.vue'
import { ref } from 'vue'
import { createPhaser } from '../phaser'

const enableGame = ref(true)
const enableVue = ref(false)


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
  <el-switch v-model="enableGame" @change="onCanvasEnable" active-text="enableGame" />
  <el-switch v-model="enableVue" active-text="enableVue" />
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
  left: 0;
  top: 0;
  position: absolute;
  width: 100%;
}

body {
  margin: 0px;
  padding: 0px;
}
</style>
