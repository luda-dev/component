/**
 * 工具函数
 */

/**
 * 深度克隆对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any
  }

  if (obj instanceof Object) {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }

  return obj
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args)
      timeoutId = null
    }, delay)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let lastCall = 0

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()

    if (now - lastCall >= delay) {
      lastCall = now
      fn.apply(this, args)
    }
  }
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string | number, format: string = 'YYYY-MM-DD'): string {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) {
    return ''
  }

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 生成唯一ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 判断是否为空值
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true
  }

  if (Array.isArray(value) && value.length === 0) {
    return true
  }

  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true
  }

  return false
}

/**
 * 获取对象属性值（支持点号路径）
 */
export function getValueByPath(obj: any, path: string): any {
  if (!path) return undefined
  
  const keys = path.split('.')
  let result = obj

  for (const key of keys) {
    if (result === null || result === undefined) {
      return undefined
    }
    result = result[key]
  }

  return result
}

/**
 * 设置对象属性值（支持点号路径）
 */
export function setValueByPath(obj: any, path: string, value: any): void {
  if (!path) return
  
  const keys = path.split('.')
  const lastKey = keys.pop()!
  let target = obj

  for (const key of keys) {
    if (!(key in target)) {
      target[key] = {}
    }
    target = target[key]
  }

  target[lastKey] = value
}
