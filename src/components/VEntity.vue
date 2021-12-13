<script setup lang="ts">
import { IEntity } from '@core/battle';
import { ref, StyleValue } from 'vue';
import SHBar from './SHBar.vue'
const props = defineProps<{ entity: IEntity }>()


// 然后使用面板和其他组件重搞一下entiy
// 战场两栏布局, 每栏纵向布局card组件, 有边框

// card
// name  放上去显示tooltip, 角色详情.
// tags 用来做buff, 每一个tag就是一个buff
// progress 先用自带的.. 后期考虑隐藏自己搞一个居中的
// prpgress ap 短条, 无文字或 尾文字
// 最下面是加人条, 有一个加号和一个下拉框,选择角色并添加. 战斗中也能加

</script>

<template>
  <SHBar :percent="entity.hp / entity.hpmax" style="border-radius: 5px;">
    <div @click="entity.battle.skada.outPut(entity.name)">
      entitys:
      {{ entity.name }}:{{ entity.hp }}/{{ entity.hpmax }} {{ entity.attackRelease?.toFixed(2) }}
      <li v-for="buff in entity.buffs">{{ buff.name }} {{ buff.release?.toFixed(2) }}</li>
    </div>
    <SHBar :percent="entity.ap / entity.apmax" color="#b3af77" style="height: 3px;" :z-index="-10"></SHBar>
  </SHBar>
</template>

<style scoped>
</style>