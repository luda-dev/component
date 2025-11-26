<template>
  <div class="view-tabs">
    <div class="tabs-header">
      <div class="tabs-nav">
        <div
          v-for="tab in tabs"
          :key="tab.name"
          :class="['tab-item', { active: activeTab === tab.name, disabled: tab.disabled }]"
          @click="!tab.disabled && handleTabClick(tab.name)"
        >
          <span v-if="tab.icon" class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
          <span
            v-if="tab.closable !== false && tabs.length > 1"
            class="tab-close"
            @click.stop="handleTabClose(tab.name)"
          >
            ×
          </span>
        </div>
      </div>
      <div class="tabs-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    
    <div class="tabs-content">
      <div
        v-for="tab in tabs"
        :key="tab.name"
        v-show="activeTab === tab.name"
        :class="['tab-pane', { active: activeTab === tab.name }]"
      >
        <component
          v-if="!tab.lazy || loadedTabs.has(tab.name)"
          :is="tab.component"
          v-bind="tab.props"
          @update="(data: any) => handleTabUpdate(tab.name, data)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { TabItem } from '@/types'

export interface Props {
  tabs: TabItem[]
  modelValue?: string
  defaultActive?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultActive: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  tabClick: [name: string, tab: TabItem]
  tabClose: [name: string, tab: TabItem]
  tabUpdate: [name: string, data: any]
}>()

const activeTab = ref<string>(props.modelValue || props.defaultActive || (props.tabs[0]?.name ?? ''))
const loadedTabs = ref<Set<string>>(new Set([activeTab.value]))

function handleTabClick(name: string) {
  if (activeTab.value === name) return
  
  activeTab.value = name
  loadedTabs.value.add(name)
  
  const tab = props.tabs.find(t => t.name === name)
  if (tab) {
    emit('tabClick', name, tab)
    emit('update:modelValue', name)
  }
}

function handleTabClose(name: string) {
  const tab = props.tabs.find(t => t.name === name)
  if (!tab) return
  
  emit('tabClose', name, tab)
  
  // 如果关闭的是当前激活的标签，切换到下一个标签
  if (activeTab.value === name) {
    const currentIndex = props.tabs.findIndex(t => t.name === name)
    const nextTab = props.tabs[currentIndex + 1] || props.tabs[currentIndex - 1]
    if (nextTab) {
      handleTabClick(nextTab.name)
    }
  }
}

function handleTabUpdate(name: string, data: any) {
  emit('tabUpdate', name, data)
}

watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== activeTab.value) {
    handleTabClick(newValue)
  }
})

onMounted(() => {
  // 确保初始标签已加载
  if (activeTab.value) {
    loadedTabs.value.add(activeTab.value)
  }
})

defineExpose({
  activeTab,
  setActiveTab: handleTabClick
})
</script>

<script lang="ts">
export default {
  name: 'ViewTabs'
}
</script>

<style scoped>
.view-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e4e7ed;
  background: #fafafa;
}

.tabs-nav {
  display: flex;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.tabs-nav::-webkit-scrollbar {
  height: 4px;
}

.tabs-nav::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  border-right: 1px solid #e4e7ed;
  transition: all 0.3s;
  position: relative;
  background: transparent;
}

.tab-item:hover {
  color: #409eff;
  background: #ecf5ff;
}

.tab-item.active {
  color: #409eff;
  background: white;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #409eff;
}

.tab-item.disabled {
  color: #c0c4cc;
  cursor: not-allowed;
  opacity: 0.6;
}

.tab-item.disabled:hover {
  color: #c0c4cc;
  background: transparent;
}

.tab-icon {
  font-size: 16px;
}

.tab-label {
  flex: 1;
}

.tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 4px;
  border-radius: 50%;
  font-size: 18px;
  line-height: 1;
  transition: all 0.2s;
}

.tab-close:hover {
  background: #f56c6c;
  color: white;
}

.tabs-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
}

.tabs-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.tab-pane {
  height: 100%;
  width: 100%;
}

.tab-pane:not(.active) {
  display: none;
}
</style>
