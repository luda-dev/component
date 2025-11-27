<template>
  <div class="example">
    <h2>视图标签页示例 - ViewTabs 演示</h2>
    
    <div class="controls">
      <button class="btn" @click="addNewTab">添加标签</button>
      <button class="btn-secondary" @click="toggleLazy">切换懒加载</button>
      <span class="status">当前激活: {{ activeTab }}</span>
    </div>
    
    <ViewTabs
      ref="tabsRef"
      v-model="activeTab"
      :tabs="tabs"
      @tabClick="handleTabClick"
      @tabClose="handleTabClose"
      @tabUpdate="handleTabUpdate"
    >
      <template #actions>
        <button class="action-btn" @click="refreshCurrentTab">
          🔄 刷新
        </button>
      </template>
    </ViewTabs>

    <div class="info">
      <h3>事件日志:</h3>
      <div class="logs">
        <div v-for="(log, index) in logs" :key="index" class="log-item">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineComponent, h } from 'vue'
import { ViewTabs } from '../src/components/view-tabs'
import type { TabItem } from '../src/types'

const tabsRef = ref()
const activeTab = ref('info')
const logs = ref<string[]>([])
let tabCounter = 3

// 定义示例内容组件
const BasicInfoContent = defineComponent({
  name: 'BasicInfoContent',
  setup() {
    return () => h('div', { class: 'tab-content' }, [
      h('h3', '基本信息'),
      h('p', '这是基本信息标签页的内容。'),
      h('ul', [
        h('li', '支持图标显示'),
        h('li', '支持关闭功能'),
        h('li', '支持懒加载'),
        h('li', '支持自定义内容'),
      ]),
      h('div', { class: 'demo-box' }, [
        h('strong', '演示区域'),
        h('p', '标签页可以包含任意复杂的内容，包括表单、表格、图表等。'),
      ])
    ])
  }
})

const ConfigContent = defineComponent({
  name: 'ConfigContent',
  setup() {
    const formData = ref({
      name: '',
      email: '',
      status: 'active'
    })

    return () => h('div', { class: 'tab-content' }, [
      h('h3', '详细配置'),
      h('p', '这个标签页展示表单配置示例。'),
      h('div', { class: 'form' }, [
        h('div', { class: 'form-item' }, [
          h('label', '名称:'),
          h('input', {
            type: 'text',
            value: formData.value.name,
            onInput: (e: Event) => {
              formData.value.name = (e.target as HTMLInputElement).value
            },
            placeholder: '请输入名称'
          })
        ]),
        h('div', { class: 'form-item' }, [
          h('label', '邮箱:'),
          h('input', {
            type: 'email',
            value: formData.value.email,
            onInput: (e: Event) => {
              formData.value.email = (e.target as HTMLInputElement).value
            },
            placeholder: '请输入邮箱'
          })
        ]),
        h('div', { class: 'form-item' }, [
          h('label', '状态:'),
          h('select', {
            value: formData.value.status,
            onChange: (e: Event) => {
              formData.value.status = (e.target as HTMLSelectElement).value
            }
          }, [
            h('option', { value: 'active' }, '激活'),
            h('option', { value: 'inactive' }, '禁用'),
          ])
        ]),
      ])
    ])
  }
})

const AdvancedContent = defineComponent({
  name: 'AdvancedContent',
  setup() {
    const items = ref([
      { id: 1, name: '选项 A', enabled: true },
      { id: 2, name: '选项 B', enabled: false },
      { id: 3, name: '选项 C', enabled: true },
    ])

    return () => h('div', { class: 'tab-content' }, [
      h('h3', '高级选项'),
      h('p', '这个标签页使用了懒加载，只有在第一次点击时才会加载内容。'),
      h('div', { class: 'options-list' }, [
        h('h4', '配置项列表:'),
        ...items.value.map(item => 
          h('div', { key: item.id, class: 'option-item' }, [
            h('input', {
              type: 'checkbox',
              checked: item.enabled,
              onChange: (e: Event) => {
                item.enabled = (e.target as HTMLInputElement).checked
              }
            }),
            h('span', item.name),
            h('span', { class: item.enabled ? 'status-on' : 'status-off' }, 
              item.enabled ? '✓ 启用' : '✗ 禁用'
            )
          ])
        )
      ])
    ])
  }
})

// 初始标签页配置
const tabs = ref<TabItem[]>([
  {
    name: 'info',
    label: '基本信息',
    icon: '📄',
    component: BasicInfoContent,
    closable: false, // 第一个标签不可关闭
  },
  {
    name: 'config',
    label: '详细配置',
    icon: '⚙️',
    component: ConfigContent,
  },
  {
    name: 'advanced',
    label: '高级选项',
    icon: '🔧',
    component: AdvancedContent,
    lazy: true, // 懒加载
  },
])

function addLog(message: string) {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.unshift(`[${timestamp}] ${message}`)
  if (logs.value.length > 10) {
    logs.value.pop()
  }
}

function handleTabClick(name: string, tab: TabItem) {
  addLog(`点击标签: ${tab.label} (${name})`)
}

function handleTabClose(name: string, tab: TabItem) {
  addLog(`关闭标签: ${tab.label} (${name})`)
  
  // 从数组中移除标签
  const index = tabs.value.findIndex(t => t.name === name)
  if (index > -1) {
    tabs.value.splice(index, 1)
  }
}

function handleTabUpdate(name: string, data: any) {
  addLog(`标签更新: ${name}, 数据: ${JSON.stringify(data)}`)
}

function addNewTab() {
  tabCounter++
  const newTab: TabItem = {
    name: `tab${tabCounter}`,
    label: `动态标签 ${tabCounter}`,
    icon: '✨',
    component: defineComponent({
      setup() {
        return () => h('div', { class: 'tab-content' }, [
          h('h3', `动态标签 ${tabCounter}`),
          h('p', `这是在运行时动态添加的标签页。`),
          h('p', `创建时间: ${new Date().toLocaleString()}`),
        ])
      }
    }),
  }
  
  tabs.value.push(newTab)
  activeTab.value = newTab.name
  addLog(`添加新标签: ${newTab.label}`)
}

function toggleLazy() {
  const tab = tabs.value.find(t => t.name === 'advanced')
  if (tab) {
    tab.lazy = !tab.lazy
    addLog(`切换懒加载: ${tab.lazy ? '启用' : '禁用'}`)
  }
}

function refreshCurrentTab() {
  const currentTab = tabs.value.find(t => t.name === activeTab.value)
  if (currentTab) {
    addLog(`刷新标签: ${currentTab.label}`)
  }
}
</script>

<style scoped>
.example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 20px;
  color: #303133;
}

.controls {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.btn {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn:hover {
  background: #66b1ff;
}

.btn-secondary {
  padding: 8px 16px;
  background: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #85ce61;
}

.status {
  margin-left: auto;
  padding: 6px 12px;
  background: white;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
}

.action-btn {
  padding: 6px 12px;
  background: #909399;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #a6a9ad;
}

.info {
  margin-top: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
}

.info h3 {
  margin-bottom: 12px;
  font-size: 16px;
  color: #303133;
}

.logs {
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border-radius: 4px;
  padding: 8px;
}

.log-item {
  padding: 4px 8px;
  font-size: 12px;
  color: #606266;
  font-family: monospace;
  border-bottom: 1px solid #ebeef5;
}

.log-item:last-child {
  border-bottom: none;
}

/* Tab content styles */
:deep(.tab-content) {
  padding: 20px;
}

:deep(.tab-content h3) {
  margin-bottom: 16px;
  color: #303133;
  font-size: 18px;
}

:deep(.tab-content p) {
  margin-bottom: 12px;
  color: #606266;
  line-height: 1.6;
}

:deep(.tab-content ul) {
  margin: 16px 0;
  padding-left: 24px;
}

:deep(.tab-content li) {
  margin: 8px 0;
  color: #606266;
}

:deep(.demo-box) {
  margin-top: 20px;
  padding: 16px;
  background: #ecf5ff;
  border-left: 4px solid #409eff;
  border-radius: 4px;
}

:deep(.form) {
  max-width: 500px;
}

:deep(.form-item) {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

:deep(.form-item label) {
  width: 80px;
  color: #606266;
  font-size: 14px;
}

:deep(.form-item input),
:deep(.form-item select) {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

:deep(.form-item input:focus),
:deep(.form-item select:focus) {
  outline: none;
  border-color: #409eff;
}

:deep(.options-list) {
  margin-top: 16px;
}

:deep(.options-list h4) {
  margin-bottom: 12px;
  color: #303133;
  font-size: 16px;
}

:deep(.option-item) {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  transition: all 0.3s;
}

:deep(.option-item:hover) {
  border-color: #409eff;
  background: #ecf5ff;
}

:deep(.option-item input[type="checkbox"]) {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

:deep(.option-item > span:first-of-type) {
  flex: 1;
  color: #303133;
  font-size: 14px;
}

:deep(.status-on) {
  color: #67c23a;
  font-size: 12px;
  font-weight: 600;
}

:deep(.status-off) {
  color: #909399;
  font-size: 12px;
  font-weight: 600;
}
</style>
