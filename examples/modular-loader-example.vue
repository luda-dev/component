<template>
  <div class="example">
    <h2>模块化加载器示例</h2>
    
    <div class="controls">
      <select v-model="selectedModule" @change="loadModule">
        <option value="">选择模块</option>
        <option value="data-table">数据表</option>
        <option value="view-tabs">视图标签页</option>
        <option value="filter">过滤器</option>
      </select>
    </div>
    
    <div class="demo-area">
      <ModularLoader
        v-if="moduleConfig"
        :config="moduleConfig"
        :props="moduleProps"
        @loaded="handleLoaded"
        @error="handleError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ModularLoader } from '../src/components/modular-loader'
import DataTable from '../src/components/data-table/DataTable.vue'
import ViewTabs from '../src/components/view-tabs/ViewTabs.vue'
import GenericFilter from '../src/components/filter/GenericFilter.vue'

const selectedModule = ref('')
const moduleConfig = ref<any>(null)
const moduleProps = ref<any>({})

function loadModule() {
  switch (selectedModule.value) {
    case 'data-table':
      moduleConfig.value = {
        name: 'data-table',
        path: '@/components/data-table/DataTable.vue',
        component: DataTable
      }
      moduleProps.value = {
        config: {
          columns: [
            { field: 'id', title: 'ID', width: 80 },
            { field: 'name', title: '姓名', width: 120 }
          ]
        },
        data: [
          { id: 1, name: '张三' },
          { id: 2, name: '李四' }
        ]
      }
      break
      
    case 'view-tabs':
      moduleConfig.value = {
        name: 'view-tabs',
        path: '@/components/view-tabs/ViewTabs.vue',
        component: ViewTabs
      }
      moduleProps.value = {
        tabs: [
          { name: 'tab1', label: '标签1' },
          { name: 'tab2', label: '标签2' }
        ]
      }
      break
      
    case 'filter':
      moduleConfig.value = {
        name: 'filter',
        path: '@/components/filter/GenericFilter.vue',
        component: GenericFilter
      }
      moduleProps.value = {
        config: {
          items: [
            { field: 'keyword', label: '关键词', type: 'input' }
          ]
        }
      }
      break
  }
}

function handleLoaded(component: any) {
  console.log('模块加载成功:', component)
}

function handleError(error: Error) {
  console.error('模块加载失败:', error)
}
</script>

<style scoped>
.example {
  padding: 20px;
}

.controls {
  margin-bottom: 20px;
}

select {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
}

.demo-area {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 20px;
  min-height: 200px;
}
</style>
