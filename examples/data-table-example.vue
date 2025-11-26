<template>
  <div class="example">
    <h2>数据表示例 - 扩展字段演示</h2>
    
    <div class="controls">
      <button class="btn" @click="addNewColumn">添加扩展字段</button>
      <button class="btn-secondary" @click="toggleColumnVisible">切换列可见性</button>
      <button class="btn-secondary" @click="addRow">添加行</button>
    </div>
    
    <DataTable
      ref="tableRef"
      :config="tableConfig"
      :data="tableData"
      @refresh="handleRefresh"
      @rowClick="handleRowClick"
      @cellEdit="handleCellEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DataTable } from '../src/components/data-table'
import type { DataTableConfig } from '../src/types'

const tableRef = ref()

const tableConfig = ref<DataTableConfig>({
  columns: [
    { field: 'id', title: 'ID', width: 80, sortable: true },
    { field: 'name', title: '姓名', width: 120, editable: true },
    { field: 'age', title: '年龄', width: 80, type: 'number', editable: true, sortable: true },
    { field: 'email', title: '邮箱', width: 200 },
    { 
      field: 'status', 
      title: '状态', 
      width: 100, 
      type: 'select',
      options: [
        { label: '激活', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ],
      editable: true,
      formatter: (value) => {
        return value === 'active' ? '✓ 激活' : '✗ 禁用'
      }
    },
  ],
  stripe: true,
  border: true,
})

const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', status: 'active' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', status: 'active' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', status: 'inactive' },
])

let columnCounter = 0

function addNewColumn() {
  columnCounter++
  const newColumn = {
    field: `custom_${columnCounter}`,
    title: `扩展字段${columnCounter}`,
    width: 120,
    editable: true,
    visible: true
  }
  
  tableRef.value?.addExtendField(newColumn)
  
  // 为现有数据添加新字段的默认值
  tableData.value.forEach(row => {
    row[`custom_${columnCounter}`] = `值${columnCounter}`
  })
  
  console.log('添加新列:', newColumn)
}

function toggleColumnVisible() {
  const firstColumn = tableConfig.value.columns[0]
  if (firstColumn) {
    tableRef.value?.updateExtendField(firstColumn.field, {
      visible: firstColumn.visible === false
    })
  }
}

function addRow() {
  const newRow = {
    id: tableData.value.length + 1,
    name: `用户${tableData.value.length + 1}`,
    age: 20 + Math.floor(Math.random() * 20),
    email: `user${tableData.value.length + 1}@example.com`,
    status: 'active'
  }
  
  tableData.value.push(newRow)
}

function handleRefresh() {
  console.log('刷新表格')
}

function handleRowClick(row: any, index: number) {
  console.log('点击行:', row, '索引:', index)
}

function handleCellEdit(row: any, field: string, value: any) {
  console.log('编辑单元格:', { row, field, value })
}
</script>

<style scoped>
.example {
  padding: 20px;
}

.controls {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
</style>
