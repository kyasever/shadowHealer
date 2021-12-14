<script setup lang="ts">
import { IEntity, Entity } from '@core/battle';
import { SHLog } from '@core/utils';
import { ref, StyleValue } from 'vue';
import SHBar from './SHBar.vue'
const props = defineProps<{ entitys: Entity[] }>()



function onClickItem(item) {
  item.battle.emit('selectEntity', item.name);
}

// 点击角色名字在控制台查看角色信息
function onClickName(item) {
  SHLog.info(`查看角色信息: ${item.name}`, item)
}

</script>

<template>
  <el-card
    class="box-card"
    :body-style="{ padding: '5px' }"
    style="margin: 10px; border: 1px solid black"
  >
    <div v-for="item in entitys" class="text item">
      <div
        @click="onClickItem(item)"
        :style="{ paddingBottom: '8px', backgroundColor: item.isSelected ? '#b8ecec' : '' }"
      >
        <div style="display: flex; width: 100%;">
          <div style="width: 60px;" @click="onClickName(item)">{{ item.name }}:</div>
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="item.hp / item.hpmax * 100"
            color="#fc5d5d"
            style="flex-grow: 2; "
          >
            <span>{{ item.hp }}/{{ item.hpmax }}</span>
          </el-progress>
        </div>
        <el-progress :percentage="item.ap / item.apmax * 100">
          <div>{{ item.ap }}</div>
        </el-progress>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
</style>