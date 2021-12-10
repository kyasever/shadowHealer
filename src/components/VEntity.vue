<script setup lang="ts">
import { Entity } from '@core/battle';
defineProps<{ entity: any }>()



</script>

<template>
  <div @click="entity.battle.skada.outPut(entity.name)">
    {{ entity.name }}:{{ entity.hp }}/{{ entity.hpmax }} {{ entity.attackRelease?.toFixed(2) }}
    <li v-for="buff in entity.buffs">{{ buff.name }} {{ buff.release?.toFixed(2) }}</li>
  </div>
</template>

<style scoped>
</style>