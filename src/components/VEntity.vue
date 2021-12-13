<script setup lang="ts">
import { IEntity } from '@core/battle';
import { ref, StyleValue } from 'vue';
import SHBar from './SHBar.vue'
const props = defineProps<{ entitys: IEntity[] }>()


// 然后使用面板和其他组件重搞一下entiy
// 战场两栏布局, 每栏纵向布局card组件, 有边框

// card
// name  放上去显示tooltip, 角色详情.
// tags 用来做buff, 每一个tag就是一个buff
// progress 先用自带的.. 后期考虑隐藏自己搞一个居中的
// prpgress ap 短条, 无文字或 尾文字
// 最下面是加人条, 有一个加号和一个下拉框,选择角色并添加. 战斗中也能加

function onTouchItem(name) {

}

</script>

<template>
  <el-card
    class="box-card"
    :body-style="{ padding: '5px' }"
    style="margin: 10px; border: 1px solid black"
  >
    <div v-for="item in entitys" class="text item">
      <div style="display: flex; width: 100%; padding-bottom: 5px;">
        <div style="width: 60px;">{{ item.name }}:</div>
        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="item.hp / item.hpmax * 100"
          color="#fc5d5d"
          style="flex-grow: 2; "
          @click="onTouchItem(item.name)"
        >
          <span>{{ item.hp }}/{{ item.hpmax }}</span>
        </el-progress>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
</style>