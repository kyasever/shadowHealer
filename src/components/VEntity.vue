<script setup lang="ts">
import { IEntity } from '@core/common';
defineProps<{ entity: IEntity }>()
</script>

<template>
  {{ entity.name }}:{{ entity.hp }}/{{ entity.hpmax }} {{ entity.attackRelease?.toFixed(2) }}
  <li v-for="buff in entity.buffs">{{ buff.name }} {{ buff.release?.toFixed(2) }}</li>
</template>

<style scoped>
</style>