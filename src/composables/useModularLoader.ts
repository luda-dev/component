/**
 * 模块加载器 Composable
 */

import { ref } from 'vue'
import type { ModuleConfig } from '@/types'

export function useModularLoader() {
  const modules = ref<Map<string, ModuleConfig>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 注册模块
   */
  function registerModule(config: ModuleConfig) {
    modules.value.set(config.name, config)
  }

  /**
   * 注销模块
   */
  function unregisterModule(name: string) {
    modules.value.delete(name)
  }

  /**
   * 获取模块
   */
  function getModule(name: string): ModuleConfig | undefined {
    return modules.value.get(name)
  }

  /**
   * 获取所有模块
   */
  function getAllModules(): ModuleConfig[] {
    return Array.from(modules.value.values())
  }

  /**
   * 清空所有模块
   */
  function clearModules() {
    modules.value.clear()
  }

  return {
    modules,
    loading,
    error,
    registerModule,
    unregisterModule,
    getModule,
    getAllModules,
    clearModules
  }
}
