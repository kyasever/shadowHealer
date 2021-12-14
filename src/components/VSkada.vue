<script setup lang="ts">
// defineProps<{ msg: string }>()
import { Skada } from '@core/battle'
import { ref, } from 'vue'


// 主界面展示数据  key,展示字段, 百分比
const props = defineProps<{ items: { name: string, value: string, percent: number }[], defaultOption: string }>()
const emit = defineEmits(['change', 'touch-name'])

// 下拉框改变选项时触发
function onChange(value) {
  emit('change', value)
}

// 点击具体的条触发
function onTouchItem(name) {
  emit('touch-name', name)
}

// 下拉框选项列表
const options = ref([
  {
    value: 'totalDamage',
  },
  {
    value: 'dps',
  },
  {
    value: 'totalHeal',
  }
])

</script>

<template>
  <div style="width: 300px">
    <div style="padding-top: 20px">
      <span style="font-size: 14px;">Skada,mode:</span>
      <el-select v-model="defaultOption" placeholder="Select" @change="onChange" size="mini">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.value"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <el-card
      class="box-card"
      :body-style="{ padding: '5px' }"
      style="margin: 10px; border: 1px solid black"
    >
      <div v-for="item in items" class="text item">
        <div style="display: flex; width: 100%; padding-bottom: 5px;">
          <div style="width: 60px;" @click="onTouchItem(item.name)">{{ item.name }}:</div>
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="item.percent"
            color="#fc5d5d"
            style="flex-grow: 2; "
          >
            <span>{{ item.value }}</span>
          </el-progress>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
</style>