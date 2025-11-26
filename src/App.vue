<template>
  <div id="app">
    <h1>低代码组件库示例</h1>
    
    <section class="section">
      <h2>1. 模块化加载器 (ModularLoader)</h2>
      <ModularLoader :config="moduleConfig" />
    </section>

    <section class="section">
      <h2>2. 数据表 (DataTable)</h2>
      <DataTable
        :config="tableConfig"
        :data="tableData"
        @refresh="handleRefresh"
        @rowClick="handleRowClick"
      />
    </section>

    <section class="section">
      <h2>3. 视图标签页 (ViewTabs)</h2>
      <ViewTabs
        :tabs="tabs"
        @tabClick="handleTabClick"
      />
    </section>

    <section class="section">
      <h2>4. VXE Table 封装 (VxeTableWrapper)</h2>
      <VxeTableWrapper
        :columns="vxeColumns"
        :data="vxeData"
        show-checkbox
        show-seq
        show-pager
        :total="vxeTotal"
        @pageChange="handlePageChange"
      >
        <template #actions="{ row }">
          <button class="action-btn" @click="handleVxeEdit(row)">编辑</button>
          <button class="action-btn danger" @click="handleVxeDelete(row)">删除</button>
        </template>
      </VxeTableWrapper>
    </section>

    <section class="section">
      <h2>5. 通用过滤器 (GenericFilter)</h2>
      <GenericFilter
        :config="filterConfig"
        @search="handleSearch"
        @reset="handleReset"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ModularLoader, DataTable, ViewTabs, VxeTableWrapper, GenericFilter } from './index'
import type { ModuleConfig, DataTableConfig, TabItem, FilterConfig } from './types'
import type { ColumnConfig } from './components/vxe-table-wrapper/VxeTableWrapper.vue'

// 模块配置
const moduleConfig = ref<ModuleConfig>({
  name: 'example-module',
  path: '@/components/data-table/DataTable.vue',
})

// 表格配置
const tableConfig = ref<DataTableConfig>({
  columns: [
    { field: 'id', title: 'ID', width: 80, sortable: true },
    { field: 'name', title: '姓名', width: 120, editable: true },
    { field: 'age', title: '年龄', width: 80, type: 'number', editable: true },
    { field: 'email', title: '邮箱', width: 200 },
    { field: 'status', title: '状态', width: 100, type: 'select', 
      options: [
        { label: '激活', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ],
      editable: true
    },
  ],
  stripe: true,
  border: true,
})

const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', status: 'active' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', status: 'active' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', status: 'inactive' },
])

// 标签页配置
const tabs = ref<TabItem[]>([
  { name: 'tab1', label: '基本信息', icon: '📄' },
  { name: 'tab2', label: '详细配置', icon: '⚙️' },
  { name: 'tab3', label: '高级选项', icon: '🔧', lazy: true },
])

// VXE Table 配置
const vxeColumns = ref<ColumnConfig[]>([
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: '姓名', width: 120 },
  { field: 'role', title: '角色', width: 120 },
  { field: 'department', title: '部门', minWidth: 150 },
  { field: 'email', title: '邮箱', minWidth: 200 },
  { field: 'status', title: '状态', width: 100 },
])

const vxeData = ref([
  { id: 1, name: '张三', role: '开发工程师', department: '技术部', email: 'zhangsan@example.com', status: '在职' },
  { id: 2, name: '李四', role: '产品经理', department: '产品部', email: 'lisi@example.com', status: '在职' },
  { id: 3, name: '王五', role: '设计师', department: '设计部', email: 'wangwu@example.com', status: '在职' },
  { id: 4, name: '赵六', role: '测试工程师', department: '技术部', email: 'zhaoliu@example.com', status: '离职' },
  { id: 5, name: '钱七', role: '运维工程师', department: '技术部', email: 'qianqi@example.com', status: '在职' },
])

const vxeTotal = ref(5)

// 过滤器配置
const filterConfig = ref<FilterConfig>({
  items: [
    { field: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' },
    { field: 'age', label: '年龄', type: 'numberrange' },
    { field: 'status', label: '状态', type: 'select', 
      options: [
        { label: '激活', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
    { field: 'date', label: '日期', type: 'daterange' },
  ],
  inline: true,
  showSearch: true,
  showReset: true,
})

function handleRefresh() {
  console.log('刷新表格')
}

function handleRowClick(row: any, index: number) {
  console.log('点击行:', row, index)
}

function handleTabClick(name: string) {
  console.log('切换标签:', name)
}

function handleSearch(values: any) {
  console.log('搜索:', values)
}

function handleReset() {
  console.log('重置过滤')
}

function handlePageChange(params: { currentPage: number; pageSize: number }) {
  console.log('页码变化:', params)
}

function handleVxeEdit(row: any) {
  console.log('编辑:', row)
}

function handleVxeDelete(row: any) {
  console.log('删除:', row)
}
</script>

<style scoped>
#app {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  color: #303133;
}

.section {
  margin-bottom: 40px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #606266;
  border-bottom: 2px solid #e4e7ed;
  padding-bottom: 10px;
}
</style>
