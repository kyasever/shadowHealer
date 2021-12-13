<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps<{ percent: number, color?: string, zIndex?: number }>()


</script>

<template>
  <div class="bg">
    <slot></slot>
    <div
      class="fg"
      :style="{ width: `${(props.percent * 100).toFixed(2)}%`, backgroundColor: color, zIndex }"
    ></div>
  </div>
</template>

<style scoped>
.bg {
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px, solid, black;
}

.fg {
  background-color: rgb(255, 197, 197);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: -100;
}
</style>