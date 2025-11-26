/**
 * 数据表 Composable
 */

import { ref, computed } from 'vue'
import type { ExtendField } from '@/types'

export function useDataTable(initialColumns: ExtendField[] = []) {
  const columns = ref<ExtendField[]>([...initialColumns])
  const data = ref<any[]>([])
  const loading = ref(false)
  const selectedRows = ref<any[]>([])

  /**
   * 添加扩展字段
   */
  function addColumn(column: ExtendField) {
    columns.value.push(column)
  }

  /**
   * 移除字段
   */
  function removeColumn(field: string) {
    const index = columns.value.findIndex(col => col.field === field)
    if (index > -1) {
      columns.value.splice(index, 1)
    }
  }

  /**
   * 更新字段配置
   */
  function updateColumn(field: string, updates: Partial<ExtendField>) {
    const column = columns.value.find(col => col.field === field)
    if (column) {
      Object.assign(column, updates)
    }
  }

  /**
   * 获取字段配置
   */
  function getColumn(field: string): ExtendField | undefined {
    return columns.value.find(col => col.field === field)
  }

  /**
   * 设置数据
   */
  function setData(newData: any[]) {
    data.value = newData
  }

  /**
   * 添加行
   */
  function addRow(row: any) {
    data.value.push(row)
  }

  /**
   * 删除行
   */
  function removeRow(index: number) {
    data.value.splice(index, 1)
  }

  /**
   * 更新行
   */
  function updateRow(index: number, row: any) {
    data.value[index] = { ...data.value[index], ...row }
  }

  /**
   * 清空数据
   */
  function clearData() {
    data.value = []
  }

  /**
   * 获取可见列
   */
  const visibleColumns = computed(() => {
    return columns.value.filter(col => col.visible !== false)
  })

  return {
    columns,
    data,
    loading,
    selectedRows,
    visibleColumns,
    addColumn,
    removeColumn,
    updateColumn,
    getColumn,
    setData,
    addRow,
    removeRow,
    updateRow,
    clearData
  }
}
