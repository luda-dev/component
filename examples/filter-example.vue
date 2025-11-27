<template>
  <div class="filter-example">
    <h2>通用过滤器示例 (GenericFilter Example)</h2>

    <!-- 示例 1: 内联模式 -->
    <section class="example-section">
      <h3>1. 内联模式 (Inline Mode)</h3>
      <GenericFilter
        v-model="inlineFilterValues"
        :config="inlineFilterConfig"
        @search="handleInlineSearch"
        @reset="handleInlineReset"
      />
      <div class="result">
        <strong>当前过滤值:</strong>
        <pre>{{ JSON.stringify(inlineFilterValues, null, 2) }}</pre>
      </div>
    </section>

    <!-- 示例 2: 垂直模式 -->
    <section class="example-section">
      <h3>2. 垂直模式 (Vertical Mode)</h3>
      <GenericFilter
        v-model="verticalFilterValues"
        :config="verticalFilterConfig"
        @search="handleVerticalSearch"
        @reset="handleVerticalReset"
      />
      <div class="result">
        <strong>当前过滤值:</strong>
        <pre>{{ JSON.stringify(verticalFilterValues, null, 2) }}</pre>
      </div>
    </section>

    <!-- 示例 3: 使用 useFilter Composable -->
    <section class="example-section">
      <h3>3. 使用 useFilter Composable</h3>
      <div class="composable-demo">
        <button @click="addNewFilter" class="btn">添加过滤项</button>
        <button @click="removeLastFilter" class="btn-secondary">移除最后过滤项</button>
        <button @click="resetAllFilters" class="btn-secondary">重置所有过滤</button>
      </div>
      <div class="result">
        <strong>过滤项数量:</strong> {{ filterItems.length }}<br>
        <strong>活动过滤值:</strong>
        <pre>{{ JSON.stringify(activeFilters, null, 2) }}</pre>
      </div>
    </section>

    <!-- 示例 4: 动态过滤 -->
    <section class="example-section">
      <h3>4. 动态过滤示例</h3>
      <GenericFilter
        v-model="dynamicFilterValues"
        :config="dynamicFilterConfig"
        @search="handleDynamicSearch"
      >
        <template #actions>
          <button @click="exportFilters" class="btn">导出过滤条件</button>
        </template>
      </GenericFilter>
      <div v-if="searchResults.length > 0" class="result">
        <strong>搜索结果 ({{ searchResults.length }} 条):</strong>
        <ul>
          <li v-for="item in searchResults" :key="item.id">
            {{ item.name }} - {{ item.status }} ({{ item.age }}岁)
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { GenericFilter } from '../src/components/filter'
import { useFilter } from '../src/composables'
import type { FilterConfig } from '../src/types'

// 示例 1: 内联模式配置
const inlineFilterConfig = ref<FilterConfig>({
  items: [
    { 
      field: 'keyword', 
      label: '关键字', 
      type: 'input', 
      placeholder: '请输入关键字' 
    },
    { 
      field: 'category', 
      label: '分类', 
      type: 'select',
      options: [
        { label: '全部', value: '' },
        { label: '技术', value: 'tech' },
        { label: '生活', value: 'life' },
        { label: '娱乐', value: 'entertainment' }
      ]
    },
    { 
      field: 'price', 
      label: '价格', 
      type: 'numberrange' 
    },
  ],
  inline: true,
  showSearch: true,
  showReset: true,
})

const inlineFilterValues = ref({})

function handleInlineSearch(values: any) {
  console.log('内联模式搜索:', values)
}

function handleInlineReset() {
  console.log('内联模式重置')
}

// 示例 2: 垂直模式配置
const verticalFilterConfig = ref<FilterConfig>({
  items: [
    { 
      field: 'username', 
      label: '用户名', 
      type: 'input',
      placeholder: '输入用户名'
    },
    { 
      field: 'email', 
      label: '邮箱', 
      type: 'input',
      placeholder: '输入邮箱地址'
    },
    { 
      field: 'age', 
      label: '年龄范围', 
      type: 'numberrange' 
    },
    { 
      field: 'registerDate', 
      label: '注册日期', 
      type: 'daterange' 
    },
    { 
      field: 'status', 
      label: '状态', 
      type: 'select',
      options: [
        { label: '全部', value: '' },
        { label: '激活', value: 'active' },
        { label: '禁用', value: 'inactive' },
        { label: '待审核', value: 'pending' }
      ]
    },
  ],
  inline: false,
  labelWidth: '120px',
  showSearch: true,
  showReset: true,
})

const verticalFilterValues = ref({})

function handleVerticalSearch(values: any) {
  console.log('垂直模式搜索:', values)
}

function handleVerticalReset() {
  console.log('垂直模式重置')
}

// 示例 3: useFilter Composable
const {
  filterItems,
  filterValues,
  activeFilters,
  addFilterItem,
  removeFilterItem,
  resetFilterValues
} = useFilter([
  { field: 'name', label: '姓名', type: 'input' },
  { field: 'status', label: '状态', type: 'select', options: [
    { label: '激活', value: 'active' },
    { label: '禁用', value: 'inactive' }
  ]}
])

function addNewFilter() {
  const newField = `field_${Date.now()}`
  addFilterItem({
    field: newField,
    label: `动态字段 ${filterItems.value.length + 1}`,
    type: 'input'
  })
}

function removeLastFilter() {
  if (filterItems.value.length > 0) {
    const lastItem = filterItems.value[filterItems.value.length - 1]
    removeFilterItem(lastItem.field)
  }
}

function resetAllFilters() {
  resetFilterValues()
}

// 示例 4: 动态过滤
const dynamicFilterConfig = ref<FilterConfig>({
  items: [
    { field: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' },
    { field: 'age', label: '年龄', type: 'numberrange' },
    { field: 'status', label: '状态', type: 'select', 
      options: [
        { label: '全部', value: '' },
        { label: '激活', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
  ],
  inline: true,
  showSearch: true,
  showReset: true,
})

const dynamicFilterValues = ref({})

// 模拟数据
const mockData = [
  { id: 1, name: '张三', age: 25, status: 'active' },
  { id: 2, name: '李四', age: 30, status: 'active' },
  { id: 3, name: '王五', age: 28, status: 'inactive' },
  { id: 4, name: '赵六', age: 35, status: 'active' },
  { id: 5, name: '钱七', age: 22, status: 'inactive' },
]

const searchResults = ref<any[]>([])

function handleDynamicSearch(values: any) {
  console.log('动态搜索:', values)
  
  // 模拟过滤逻辑
  let results = [...mockData]
  
  // 按姓名过滤
  if (values.name) {
    results = results.filter(item => item.name.includes(values.name))
  }
  
  // 按年龄范围过滤
  if (values.age_min !== undefined && values.age_min !== null && values.age_min !== '') {
    results = results.filter(item => item.age >= values.age_min)
  }
  if (values.age_max !== undefined && values.age_max !== null && values.age_max !== '') {
    results = results.filter(item => item.age <= values.age_max)
  }
  
  // 按状态过滤
  if (values.status) {
    results = results.filter(item => item.status === values.status)
  }
  
  searchResults.value = results
}

function exportFilters() {
  const filters = JSON.stringify(dynamicFilterValues.value, null, 2)
  console.log('导出过滤条件:', filters)
  alert('过滤条件已导出到控制台')
}
</script>

<style scoped>
.filter-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 30px;
  color: #303133;
  border-bottom: 3px solid #409eff;
  padding-bottom: 10px;
}

.example-section {
  margin-bottom: 40px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

h3 {
  margin-bottom: 20px;
  font-size: 16px;
  color: #606266;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 10px;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.result strong {
  color: #303133;
}

.result pre {
  margin-top: 10px;
  padding: 10px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  color: #606266;
}

.result ul {
  margin-top: 10px;
  padding-left: 20px;
}

.result ul li {
  margin: 5px 0;
  color: #606266;
}

.composable-demo {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.btn,
.btn-secondary {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn {
  background: #409eff;
  color: white;
}

.btn:hover {
  background: #66b1ff;
}

.btn-secondary {
  background: #909399;
  color: white;
}

.btn-secondary:hover {
  background: #a6a9ad;
}
</style>
