/**
 * 共享类型定义
 */

/**
 * 模块配置接口
 */
export interface ModuleConfig {
  name: string
  path: string
  component?: any
  meta?: Record<string, any>
}

/**
 * 扩展字段配置
 */
export interface ExtendField {
  field: string
  title: string
  type?: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'custom'
  width?: number
  visible?: boolean
  editable?: boolean
  sortable?: boolean
  options?: Array<{ label: string; value: any }>
  formatter?: (value: any, row: any) => string
  validator?: (value: any) => boolean | string
  [key: string]: any
}

/**
 * 数据表配置
 */
export interface DataTableConfig {
  columns: ExtendField[]
  data?: any[]
  loading?: boolean
  height?: number | string
  stripe?: boolean
  border?: boolean
  showOverflow?: boolean | 'title' | 'tooltip' | 'ellipsis'
}

/**
 * Tab项配置
 */
export interface TabItem {
  name: string
  label: string
  icon?: string
  closable?: boolean
  disabled?: boolean
  lazy?: boolean
  component?: any
  props?: Record<string, any>
}

/**
 * 过滤项配置
 */
export interface FilterItem {
  field: string
  label: string
  type: 'input' | 'select' | 'date' | 'daterange' | 'number' | 'numberrange' | 'custom'
  value?: any
  placeholder?: string
  options?: Array<{ label: string; value: any }>
  component?: any
  props?: Record<string, any>
  [key: string]: any
}

/**
 * 过滤配置
 */
export interface FilterConfig {
  items: FilterItem[]
  inline?: boolean
  labelWidth?: string
  showReset?: boolean
  showSearch?: boolean
}

/**
 * 过滤值
 */
export type FilterValue = Record<string, any>
