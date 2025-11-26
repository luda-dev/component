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
          <div class="dialog-section">
            <div class="section-header">
              <h4>现有列</h4>
              <button class="btn-add" @click="showAddFieldForm = true">+ 添加字段</button>
            </div>
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
                <span>{{ column.title }} ({{ column.field }})</span>
              </label>
              <button 
                v-if="!column.required"
                class="btn-remove" 
                @click="confirmRemoveField(column.field)"
                title="删除字段"
              >
                ×
              </button>
            </div>
          </div>

          <!-- 添加字段表单 -->
          <div v-if="showAddFieldForm" class="add-field-form">
            <h4>添加扩展字段</h4>
            <div class="form-group">
              <label>字段名 *</label>
              <input
                v-model="newField.field"
                type="text"
                placeholder="例如: custom_field_1"
                class="form-input"
              />
              <span v-if="fieldNameError" class="error-text">{{ fieldNameError }}</span>
            </div>
            <div class="form-group">
              <label>列标题 *</label>
              <input
                v-model="newField.title"
                type="text"
                placeholder="例如: 自定义字段"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>字段类型</label>
              <select v-model="newField.type" class="form-select">
                <option value="text">文本</option>
                <option value="number">数字</option>
                <option value="date">日期</option>
                <option value="select">下拉选择</option>
                <option value="checkbox">复选框</option>
              </select>
            </div>
            <div class="form-group">
              <label>列宽度 (px)</label>
              <input
                v-model.number="newField.width"
                type="number"
                placeholder="120"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>
                <input type="checkbox" v-model="newField.editable" />
                可编辑
              </label>
              <label>
                <input type="checkbox" v-model="newField.sortable" />
                可排序
              </label>
            </div>
            <div v-if="newField.type === 'select'" class="form-group">
              <label>选项配置 (JSON格式)</label>
              <textarea
                v-model="optionsJson"
                placeholder='[{"label": "选项1", "value": "value1"}]'
                class="form-textarea"
                rows="3"
              ></textarea>
              <span v-if="optionsError" class="error-text">{{ optionsError }}</span>
            </div>
            <div class="form-actions">
              <button class="btn" @click="handleAddField">确认添加</button>
              <button class="btn-secondary" @click="cancelAddField">取消</button>
            </div>
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
const showAddFieldForm = ref(false)
const sortField = ref<string>('')
const sortOrder = ref<'asc' | 'desc' | ''>('')
const editingCell = ref<{ row: number; field: string } | null>(null)

// 新字段表单
const newField = ref<ExtendField>({
  field: '',
  title: '',
  type: 'text',
  width: 120,
  editable: false,
  sortable: false,
  visible: true
})
const optionsJson = ref('')
const fieldNameError = ref('')
const optionsError = ref('')

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

// 验证字段名
function validateFieldName(fieldName: string): boolean {
  fieldNameError.value = ''
  
  if (!fieldName || fieldName.trim() === '') {
    fieldNameError.value = '字段名不能为空'
    return false
  }
  
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(fieldName)) {
    fieldNameError.value = '字段名只能包含字母、数字和下划线，且不能以数字开头'
    return false
  }
  
  if (allColumns.value.some(col => col.field === fieldName)) {
    fieldNameError.value = '字段名已存在'
    return false
  }
  
  return true
}

// 验证选项配置
function validateOptions(): boolean {
  optionsError.value = ''
  
  if (newField.value.type !== 'select' || !optionsJson.value.trim()) {
    return true
  }
  
  try {
    const options = JSON.parse(optionsJson.value)
    if (!Array.isArray(options)) {
      optionsError.value = '选项配置必须是数组格式'
      return false
    }
    
    for (const option of options) {
      if (!option.label || option.value === undefined) {
        optionsError.value = '每个选项必须包含 label 和 value 属性'
        return false
      }
    }
    
    return true
  } catch (e) {
    optionsError.value = 'JSON 格式错误'
    return false
  }
}

// 处理添加字段
function handleAddField() {
  if (!validateFieldName(newField.value.field)) {
    return
  }
  
  if (!newField.value.title || newField.value.title.trim() === '') {
    alert('请输入列标题')
    return
  }
  
  if (!validateOptions()) {
    return
  }
  
  // 构建字段对象
  const fieldToAdd: ExtendField = {
    field: newField.value.field.trim(),
    title: newField.value.title.trim(),
    type: newField.value.type,
    width: newField.value.width || 120,
    editable: newField.value.editable,
    sortable: newField.value.sortable,
    visible: true
  }
  
  // 如果是 select 类型，添加选项
  if (newField.value.type === 'select' && optionsJson.value.trim()) {
    try {
      fieldToAdd.options = JSON.parse(optionsJson.value)
    } catch (e) {
      // 已经在验证时处理过了
    }
  }
  
  addExtendField(fieldToAdd)
  
  // 为现有数据添加默认值
  tableData.value.forEach(row => {
    if (!(fieldToAdd.field in row)) {
      row[fieldToAdd.field] = ''
    }
  })
  
  // 重置表单
  cancelAddField()
}

// 取消添加字段
function cancelAddField() {
  showAddFieldForm.value = false
  newField.value = {
    field: '',
    title: '',
    type: 'text',
    width: 120,
    editable: false,
    sortable: false,
    visible: true
  }
  optionsJson.value = ''
  fieldNameError.value = ''
  optionsError.value = ''
}

// 确认删除字段
function confirmRemoveField(field: string) {
  const column = allColumns.value.find(col => col.field === field)
  if (column && confirm(`确定要删除字段"${column.title}"吗？`)) {
    removeExtendField(field)
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

.dialog-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.btn-add {
  background: #409eff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.3s;
}

.btn-add:hover {
  background: #66b1ff;
}

.btn-remove {
  background: #f56c6c;
  color: white;
  border: none;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 8px;
  transition: background 0.3s;
}

.btn-remove:hover {
  background: #f78989;
}

.column-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 添加字段表单 */
.add-field-form {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
  margin-top: 16px;
}

.add-field-form h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.form-group label input[type="checkbox"] {
  margin-right: 6px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #409eff;
}

.form-textarea {
  resize: vertical;
  font-family: monospace;
}

.error-text {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #f56c6c;
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
}

.btn,
.btn-secondary {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.btn {
  background: #409eff;
  color: white;
}

.btn:hover {
  background: #66b1ff;
}

.btn-secondary {
  background: #f5f5f5;
  color: #606266;
}

.btn-secondary:hover {
  background: #e0e0e0;
}
</style>
