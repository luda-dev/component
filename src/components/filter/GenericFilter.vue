<template>
  <div class="generic-filter" :class="{ inline: inline }">
    <div class="filter-form" :class="{ inline: inline }">
      <div
        v-for="item in filterItems"
        :key="item.field"
        class="filter-item"
        :style="{ width: inline ? 'auto' : '100%' }"
      >
        <label v-if="!inline" class="filter-label" :style="{ width: labelWidth }">
          {{ item.label }}
        </label>
        
        <div class="filter-control">
          <!-- 文本输入 -->
          <input
            v-if="item.type === 'input'"
            v-model="filterValues[item.field]"
            type="text"
            :placeholder="item.placeholder || `请输入${item.label}`"
            class="filter-input"
          />
          
          <!-- 数字输入 -->
          <input
            v-else-if="item.type === 'number'"
            v-model.number="filterValues[item.field]"
            type="number"
            :placeholder="item.placeholder || `请输入${item.label}`"
            class="filter-input"
          />
          
          <!-- 数字范围 -->
          <div v-else-if="item.type === 'numberrange'" class="filter-range">
            <input
              v-model.number="filterValues[item.field + '_min']"
              type="number"
              placeholder="最小值"
              class="filter-input range-input"
            />
            <span class="range-separator">-</span>
            <input
              v-model.number="filterValues[item.field + '_max']"
              type="number"
              placeholder="最大值"
              class="filter-input range-input"
            />
          </div>
          
          <!-- 下拉选择 -->
          <select
            v-else-if="item.type === 'select'"
            v-model="filterValues[item.field]"
            class="filter-select"
          >
            <option value="">{{ item.placeholder || `请选择${item.label}` }}</option>
            <option
              v-for="option in item.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          
          <!-- 日期选择 -->
          <input
            v-else-if="item.type === 'date'"
            v-model="filterValues[item.field]"
            type="date"
            class="filter-input"
          />
          
          <!-- 日期范围 -->
          <div v-else-if="item.type === 'daterange'" class="filter-range">
            <input
              v-model="filterValues[item.field + '_start']"
              type="date"
              class="filter-input range-input"
            />
            <span class="range-separator">-</span>
            <input
              v-model="filterValues[item.field + '_end']"
              type="date"
              class="filter-input range-input"
            />
          </div>
          
          <!-- 自定义组件 -->
          <component
            v-else-if="item.type === 'custom' && item.component"
            :is="item.component"
            v-model="filterValues[item.field]"
            v-bind="item.props"
          />
        </div>
      </div>
    </div>
    
    <div class="filter-actions" :class="{ inline: inline }">
      <button v-if="showSearch" class="btn" @click="handleSearch">
        搜索
      </button>
      <button v-if="showReset" class="btn-secondary" @click="handleReset">
        重置
      </button>
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FilterConfig, FilterValue, FilterItem } from '@/types'

export interface Props {
  config: FilterConfig
  modelValue?: FilterValue
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: FilterValue]
  search: [value: FilterValue]
  reset: []
}>()

const filterItems = ref<FilterItem[]>(props.config.items || [])
const filterValues = ref<FilterValue>({ ...props.modelValue })
const inline = ref(props.config.inline ?? true)
const labelWidth = ref(props.config.labelWidth || '100px')
const showReset = ref(props.config.showReset ?? true)
const showSearch = ref(props.config.showSearch ?? true)

function handleSearch() {
  emit('update:modelValue', filterValues.value)
  emit('search', filterValues.value)
}

function handleReset() {
  // 重置所有过滤值
  const resetValues: FilterValue = {}
  filterItems.value.forEach(item => {
    if (item.type === 'numberrange' || item.type === 'daterange') {
      resetValues[item.field + '_min'] = undefined
      resetValues[item.field + '_max'] = undefined
      resetValues[item.field + '_start'] = undefined
      resetValues[item.field + '_end'] = undefined
    } else {
      resetValues[item.field] = undefined
    }
  })
  
  filterValues.value = resetValues
  emit('update:modelValue', filterValues.value)
  emit('reset')
}

// 获取当前过滤值
function getFilterValues(): FilterValue {
  return { ...filterValues.value }
}

// 设置过滤值
function setFilterValues(values: FilterValue) {
  filterValues.value = { ...values }
}

// 添加过滤项
function addFilterItem(item: FilterItem) {
  filterItems.value.push(item)
}

// 移除过滤项
function removeFilterItem(field: string) {
  const index = filterItems.value.findIndex(item => item.field === field)
  if (index > -1) {
    filterItems.value.splice(index, 1)
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    filterValues.value = { ...newValue }
  }
}, { deep: true })

defineExpose({
  getFilterValues,
  setFilterValues,
  addFilterItem,
  removeFilterItem,
  handleSearch,
  handleReset
})
</script>

<script lang="ts">
export default {
  name: 'GenericFilter'
}
</script>

<style scoped>
.generic-filter {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.generic-filter.inline {
  flex-direction: row;
  align-items: center;
}

.filter-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.filter-form.inline {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  flex-shrink: 0;
  text-align: right;
  color: #606266;
  font-size: 14px;
}

.filter-control {
  flex: 1;
  min-width: 0;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  outline: none;
  transition: border-color 0.2s;
}

.filter-input:focus,
.filter-select:focus {
  border-color: #409eff;
}

.filter-input::placeholder {
  color: #c0c4cc;
}

.filter-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-input {
  flex: 1;
}

.range-separator {
  color: #909399;
  flex-shrink: 0;
}

.filter-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.filter-actions.inline {
  flex-shrink: 0;
}

/* 内联模式下的样式调整 */
.generic-filter.inline .filter-item {
  width: auto;
}

.generic-filter.inline .filter-label {
  width: auto !important;
}

.generic-filter.inline .filter-control {
  width: 200px;
}

.generic-filter.inline .filter-range {
  width: 320px;
}

/* 按钮样式 */
.btn,
.btn-secondary {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn {
  background-color: #409eff;
  color: white;
}

.btn:hover {
  background-color: #66b1ff;
}

.btn:active {
  background-color: #3a8ee6;
}

.btn-secondary {
  background-color: #909399;
  color: white;
}

.btn-secondary:hover {
  background-color: #a6a9ad;
}

.btn-secondary:active {
  background-color: #82848a;
}
</style>
