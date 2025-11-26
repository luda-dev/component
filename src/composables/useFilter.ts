/**
 * 过滤器 Composable
 */

import { ref, computed } from 'vue'
import type { FilterItem, FilterValue } from '@/types'

export function useFilter(initialItems: FilterItem[] = []) {
  const filterItems = ref<FilterItem[]>([...initialItems])
  const filterValues = ref<FilterValue>({})

  /**
   * 添加过滤项
   */
  function addFilterItem(item: FilterItem) {
    filterItems.value.push(item)
  }

  /**
   * 移除过滤项
   */
  function removeFilterItem(field: string) {
    const index = filterItems.value.findIndex(item => item.field === field)
    if (index > -1) {
      filterItems.value.splice(index, 1)
    }
  }

  /**
   * 更新过滤项
   */
  function updateFilterItem(field: string, updates: Partial<FilterItem>) {
    const item = filterItems.value.find(item => item.field === field)
    if (item) {
      Object.assign(item, updates)
    }
  }

  /**
   * 设置过滤值
   */
  function setFilterValue(field: string, value: any) {
    filterValues.value[field] = value
  }

  /**
   * 获取过滤值
   */
  function getFilterValue(field: string): any {
    return filterValues.value[field]
  }

  /**
   * 设置所有过滤值
   */
  function setAllFilterValues(values: FilterValue) {
    filterValues.value = { ...values }
  }

  /**
   * 获取所有过滤值
   */
  function getAllFilterValues(): FilterValue {
    return { ...filterValues.value }
  }

  /**
   * 重置过滤值
   */
  function resetFilterValues() {
    filterValues.value = {}
  }

  /**
   * 获取有效的过滤值（非空值）
   */
  const activeFilters = computed(() => {
    const active: FilterValue = {}
    Object.keys(filterValues.value).forEach(key => {
      const value = filterValues.value[key]
      if (value !== undefined && value !== null && value !== '') {
        active[key] = value
      }
    })
    return active
  })

  return {
    filterItems,
    filterValues,
    activeFilters,
    addFilterItem,
    removeFilterItem,
    updateFilterItem,
    setFilterValue,
    getFilterValue,
    setAllFilterValues,
    getAllFilterValues,
    resetFilterValues
  }
}
