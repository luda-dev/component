<template>
  <div class="vxe-table-wrapper">
    <vxe-table
      ref="xTable"
      v-bind="tableProps"
      :data="tableData"
      :loading="loading"
      @cell-click="handleCellClick"
      @cell-dblclick="handleCellDblClick"
      @checkbox-change="handleCheckboxChange"
      @checkbox-all="handleCheckboxAll"
    >
      <vxe-column
        v-if="showCheckbox"
        type="checkbox"
        width="60"
        fixed="left"
      />
      
      <vxe-column
        v-if="showSeq"
        type="seq"
        width="60"
        title="序号"
      />
      
      <vxe-column
        v-for="column in columns"
        :key="column.field"
        :field="column.field"
        :title="column.title"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :sortable="column.sortable"
        :filters="column.filters"
        :formatter="column.formatter"
        :edit-render="column.editRender"
      >
        <template v-if="column.slots?.default" #default="{ row }">
          <slot :name="`column-${column.field}`" :row="row" :column="column"></slot>
        </template>
        
        <template v-if="column.slots?.header" #header="{ column: col }">
          <slot :name="`header-${column.field}`" :column="col"></slot>
        </template>
        
        <template v-if="column.slots?.edit" #edit="{ row }">
          <slot :name="`edit-${column.field}`" :row="row" :column="column"></slot>
        </template>
      </vxe-column>
      
      <vxe-column
        v-if="showActions"
        title="操作"
        :width="actionsWidth"
        fixed="right"
      >
        <template #default="{ row, rowIndex }">
          <slot name="actions" :row="row" :rowIndex="rowIndex">
            <button class="action-btn" @click="handleEdit(row)">编辑</button>
            <button class="action-btn danger" @click="handleDelete(row)">删除</button>
          </slot>
        </template>
      </vxe-column>
    </vxe-table>
    
    <div v-if="showPager" class="table-pager">
      <div class="pager-info">
        共 {{ total }} 条记录，每页 {{ pageSize }} 条
      </div>
      <div class="pager-controls">
        <button 
          class="pager-btn" 
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          上一页
        </button>
        <span class="pager-current">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button 
          class="pager-btn" 
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { VxeTableInstance, VxeTableProps } from 'vxe-table'

export interface ColumnConfig {
  field: string
  title: string
  width?: number
  minWidth?: number
  fixed?: 'left' | 'right'
  sortable?: boolean
  filters?: any[]
  formatter?: any
  editRender?: any
  slots?: {
    default?: boolean
    header?: boolean
    edit?: boolean
  }
}

export interface Props {
  data?: any[]
  columns: ColumnConfig[]
  loading?: boolean
  showCheckbox?: boolean
  showSeq?: boolean
  showActions?: boolean
  actionsWidth?: number
  showPager?: boolean
  currentPage?: number
  pageSize?: number
  total?: number
  tableProps?: Partial<VxeTableProps>
  pagerProps?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  loading: false,
  showCheckbox: false,
  showSeq: false,
  showActions: true,
  actionsWidth: 180,
  showPager: true,
  currentPage: 1,
  pageSize: 20,
  total: 0,
  tableProps: () => ({}),
  pagerProps: () => ({})
})

const emit = defineEmits<{
  cellClick: [params: any]
  cellDblClick: [params: any]
  checkboxChange: [params: any]
  checkboxAll: [params: any]
  edit: [row: any]
  delete: [row: any]
  pageChange: [params: { currentPage: number; pageSize: number }]
}>()

const xTable = ref<VxeTableInstance>()
const tableData = ref(props.data)

const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize)
})

function handleCellClick(params: any) {
  emit('cellClick', params)
}

function handleCellDblClick(params: any) {
  emit('cellDblClick', params)
}

function handleCheckboxChange(params: any) {
  emit('checkboxChange', params)
}

function handleCheckboxAll(params: any) {
  emit('checkboxAll', params)
}

function handleEdit(row: any) {
  emit('edit', row)
}

function handleDelete(row: any) {
  emit('delete', row)
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  emit('pageChange', {
    currentPage: page,
    pageSize: props.pageSize
  })
}

// 暴露表格实例方法
function getTableInstance() {
  return xTable.value
}

function getCheckboxRecords() {
  return xTable.value?.getCheckboxRecords()
}

function clearCheckboxRow() {
  xTable.value?.clearCheckboxRow()
}

function setCheckboxRow(rows: any[], checked: boolean) {
  xTable.value?.setCheckboxRow(rows, checked)
}

function reloadData(data: any[]) {
  tableData.value = data
}

defineExpose({
  getTableInstance,
  getCheckboxRecords,
  clearCheckboxRow,
  setCheckboxRow,
  reloadData
})
</script>

<script lang="ts">
export default {
  name: 'VxeTableWrapper'
}
</script>

<style scoped>
.vxe-table-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.table-pager {
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e4e7ed;
  background: #fafafa;
}

.pager-info {
  font-size: 14px;
  color: #606266;
}

.pager-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pager-btn {
  padding: 6px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.pager-btn:hover:not(:disabled) {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}

.pager-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pager-current {
  font-size: 14px;
  color: #606266;
}

.action-btn {
  padding: 4px 12px;
  margin: 0 4px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
  color: #606266;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}

.action-btn.danger:hover {
  color: #f56c6c;
  border-color: #fbc4c4;
  background: #fef0f0;
}
</style>
