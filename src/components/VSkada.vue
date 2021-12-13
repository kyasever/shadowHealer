<script setup lang="ts">
// defineProps<{ msg: string }>()
import { Skada } from '@core/battle'
import { ref, } from 'vue'


// 传入skada要展示的数据
const props = defineProps<{ items: { name: string, value: string, percent: number }[] }>()
const emit = defineEmits(['change', 'touch-item'])

// 当改变mode时触发, 表达当前mode
function onChange(value) {
  emit('change', value)
}

// 当点击具体详情时触发, 在console中打印角色数据详情
function onTouchItem(value) {
  console.log(value)
  emit('touch-item', value)
}

// skada模式选择数据
const options = ref([
  {
    value: 'damage',
    label: 'damage',
  },
  {
    value: 'dps',
    label: 'dps',
  },
  {
    value: 'heal',
    label: 'heal',
  }
])
const mode = ref('damage')

</script>

<template>
  <el-card class="box-card" style="margin: 10px; border: 1px solid black;">
    <template #header>
      <div>
        <span>Skada,mode:</span>
        <el-select v-model="mode" placeholder="Select" @change="onChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </template>

    <div v-for="item in items" class="text item">
      <div style="display: flex; width: 100%; padding-bottom: 5px;">
        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="item.percent"
          color="#fc5d5d"
          style="flex-grow: 2; "
          @click="onTouchItem(item.name)"
        >
          <span>{{ item.name }}:{{ item.value }}</span>
        </el-progress>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
</style>