<template>
  <div class="modular-loader">
    <component
      v-if="loadedComponent"
      :is="loadedComponent"
      v-bind="componentProps"
      @update="handleUpdate"
    />
    <div v-else-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>
    <div v-else-if="error" class="error-state">
      <span class="error-icon">⚠</span>
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, type Component } from 'vue'
import type { ModuleConfig } from '@/types'

export interface Props {
  config: ModuleConfig
  props?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  props: () => ({})
})

const emit = defineEmits<{
  update: [data: any]
  loaded: [component: Component]
  error: [error: Error]
}>()

const loadedComponent = ref<Component | null>(null)
const loading = ref(false)
const error = ref<string>('')

const componentProps = computed(() => props.props)

async function loadModule() {
  if (!props.config) {
    error.value = '模块配置不能为空'
    return
  }

  loading.value = true
  error.value = ''
  loadedComponent.value = null

  try {
    let component: Component

    // 如果已经提供了组件，直接使用
    if (props.config.component) {
      component = props.config.component
    } else if (props.config.path) {
      // 否则动态加载组件
      const modules = import.meta.glob('@/components/**/*.vue')
      const moduleLoader = modules[props.config.path]
      
      if (!moduleLoader) {
        throw new Error(`找不到模块: ${props.config.path}`)
      }

      const module = await moduleLoader()
      component = (module as any).default
    } else {
      throw new Error('模块配置必须包含 component 或 path')
    }

    loadedComponent.value = component
    emit('loaded', component)
  } catch (err) {
    const message = err instanceof Error ? err.message : '模块加载失败'
    error.value = message
    emit('error', err as Error)
    console.error('模块加载错误:', err)
  } finally {
    loading.value = false
  }
}

function handleUpdate(data: any) {
  emit('update', data)
}

watch(() => props.config, loadModule, { deep: true })

onMounted(() => {
  loadModule()
})
</script>

<script lang="ts">
import { computed } from 'vue'
export default {
  name: 'ModularLoader'
}
</script>

<style scoped>
.modular-loader {
  width: 100%;
  height: 100%;
}

.loading-state,
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  text-align: center;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  color: #f56c6c;
}

.error-icon {
  font-size: 20px;
}
</style>
