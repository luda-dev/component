<template>
  <div class="data-table">
    <div v-if="showToolbar" class="table-toolbar">
      <slot name="toolbar">
        <button class="btn" @click="handleRefresh">刷新</button>
        <button class="btn-secondary" @click="handleColumnConfig">列配置</button>
      </slot>
    </div>
    
    <div class="table-container">
      <table class="custom-table" :class="{ 'table-stripe': stripe, 'table-border': border }">
        <thead>
          <tr>
            <th
              v-for="column in visibleColumns"
              :key="column.field"
              :style="{ width: column.width ? `${column.width}px` : 'auto' }"
              @click="column.sortable && handleSort(column.field)"
              :class="{ sortable: column.sortable }"
            >
              {{ column.title }}
              <span v-if="column.sortable" class="sort-icon">
                {{ getSortIcon(column.field) }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="visibleColumns.length" class="loading-cell">
              <div class="loading-spinner"></div>
              <span>加载中...</span>
            </td>
          </tr>
          <tr v-else-if="!tableData || tableData.length === 0">
            <td :colspan="visibleColumns.length" class="empty-cell">
              暂无数据
            </td>
          </tr>
          <tr
            v-else
            v-for="(row, index) in sortedData"
            :key="index"
            @click="handleRowClick(row, index)"
          >
            <td
              v-for="column in visibleColumns"
              :key="column.field"
              :class="{ editable: column.editable }"
            >
              <template v-if="column.editable && editingCell?.row === index && editingCell?.field === column.field">
                <input
                  v-if="column.type === 'text' || column.type === 'number'"
                  v-model="row[column.field]"
                  :type="column.type === 'number' ? 'number' : 'text'"
                  @blur="handleCellBlur"
                  @keyup.enter="handleCellBlur"
                  class="cell-input"
                />
                <select
                  v-else-if="column.type === 'select'"
                  v-model="row[column.field]"
                  @blur="handleCellBlur"
                  @change="handleCellBlur"
                  class="cell-select"
                >
                  <option
                    v-for="option in column.options"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </template>
              <template v-else>
                <span
                  @dblclick="column.editable && handleCellEdit(index, column.field)"
                  :title="showOverflow ? formatValue(row[column.field], column, row) : ''"
                  :class="{ 'cell-overflow': showOverflow }"
                >
                  {{ formatValue(row[column.field], column, row) }}
                </span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 列配置弹窗 -->
    <div v-if="showColumnDialog" class="column-dialog-overlay" @click="showColumnDialog = false">
      <div class="column-dialog" @click.stop>
        <div class="dialog-header">
          <h3>列配置</h3>
          <button class="close-btn" @click="showColumnDialog = false">×</button>
        </div>
        <div class="dialog-body">
          <div
            v-for="column in allColumns"
            :key="column.field"
            class="column-item"
          >
            <label>
              <input
                type="checkbox"
                :checked="column.visible !== false"
                @change="toggleColumnVisible(column.field)"
              />
              <span>{{ column.title }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ExtendField, DataTableConfig } from '@/types'

export interface Props {
  config: DataTableConfig
  data?: any[]
  showToolbar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showToolbar: true
})

const emit = defineEmits<{
  refresh: []
  rowClick: [row: any, index: number]
  cellEdit: [row: any, field: string, value: any]
}>()

const allColumns = ref<ExtendField[]>([...props.config.columns])
const tableData = ref<any[]>(props.data || props.config.data || [])
const loading = ref(props.config.loading || false)
const showColumnDialog = ref(false)
const sortField = ref<string>('')
const sortOrder = ref<'asc' | 'desc' | ''>('')
const editingCell = ref<{ row: number; field: string } | null>(null)

const stripe = computed(() => props.config.stripe ?? true)
const border = computed(() => props.config.border ?? true)
const showOverflow = computed(() => props.config.showOverflow ?? 'ellipsis')

const visibleColumns = computed(() => {
  return allColumns.value.filter(col => col.visible !== false)
})

const sortedData = computed(() => {
  if (!sortField.value || !sortOrder.value) {
    return tableData.value
  }

  return [...tableData.value].sort((a, b) => {
    const aVal = a[sortField.value]
    const bVal = b[sortField.value]
    
    if (aVal === bVal) return 0
    
    const comparison = aVal > bVal ? 1 : -1
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})

function formatValue(value: any, column: ExtendField, row: any): string {
  if (column.formatter) {
    return column.formatter(value, row)
  }
  return value ?? ''
}

function handleSort(field: string) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : sortOrder.value === 'desc' ? '' : 'asc'
    if (!sortOrder.value) {
      sortField.value = ''
    }
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

function getSortIcon(field: string): string {
  if (sortField.value !== field) return '⇅'
  return sortOrder.value === 'asc' ? '↑' : sortOrder.value === 'desc' ? '↓' : '⇅'
}

function handleRefresh() {
  emit('refresh')
}

function handleColumnConfig() {
  showColumnDialog.value = true
}

function toggleColumnVisible(field: string) {
  const column = allColumns.value.find(col => col.field === field)
  if (column) {
    column.visible = column.visible === false
  }
}

function handleRowClick(row: any, index: number) {
  emit('rowClick', row, index)
}

function handleCellEdit(row: number, field: string) {
  editingCell.value = { row, field }
}

function handleCellBlur() {
  if (editingCell.value) {
    const { row, field } = editingCell.value
    const rowData = tableData.value[row]
    emit('cellEdit', rowData, field, rowData[field])
    editingCell.value = null
  }
}

// 添加扩展字段
function addExtendField(field: ExtendField) {
  allColumns.value.push(field)
}

// 移除扩展字段
function removeExtendField(field: string) {
  const index = allColumns.value.findIndex(col => col.field === field)
  if (index > -1) {
    allColumns.value.splice(index, 1)
  }
}

// 更新扩展字段
function updateExtendField(field: string, updates: Partial<ExtendField>) {
  const column = allColumns.value.find(col => col.field === field)
  if (column) {
    Object.assign(column, updates)
  }
}

watch(() => props.data, (newData) => {
  if (newData) {
    tableData.value = newData
  }
}, { deep: true })

watch(() => props.config.loading, (newLoading) => {
  loading.value = newLoading ?? false
})

defineExpose({
  addExtendField,
  removeExtendField,
  updateExtendField,
  allColumns
})
</script>

<script lang="ts">
export default {
  name: 'DataTable'
}
</script>

<style scoped>
.data-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.table-toolbar {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.table-container {
  flex: 1;
  overflow: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.custom-table thead {
  position: sticky;
  top: 0;
  background: #fafafa;
  z-index: 1;
}

.custom-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
  user-select: none;
}

.custom-table th.sortable {
  cursor: pointer;
}

.custom-table th.sortable:hover {
  background: #f0f0f0;
}

.sort-icon {
  margin-left: 4px;
  font-size: 12px;
  color: #999;
}

.custom-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.table-stripe tbody tr:nth-child(even) {
  background: #fafafa;
}

.table-border th,
.table-border td {
  border: 1px solid #e0e0e0;
}

.custom-table tbody tr:hover {
  background: #f5f5f5;
  cursor: pointer;
}

.loading-cell,
.empty-cell {
  text-align: center;
  padding: 40px;
  color: #999;
}

.loading-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.editable {
  cursor: text;
}

.cell-input,
.cell-select {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
}

.cell-input:focus,
.cell-select:focus {
  border-color: #409eff;
}

.cell-overflow {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 列配置弹窗 */
.column-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.column-dialog {
  background: white;
  border-radius: 8px;
  width: 400px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.dialog-body {
  padding: 20px;
  overflow-y: auto;
}

.column-item {
  padding: 8px 0;
}

.column-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.column-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style>
