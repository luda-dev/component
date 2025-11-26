# 低代码组件库 (Low-Code Component Library)

基于 Vue 3 + UnoCSS + VXE Table 的模块化低代码组件库。

## 特性

- 🚀 **模块化加载** - 支持完整引入、按需引入和路径引入，优化打包体积
- 📦 **Tree-shaking 支持** - 通过模块化路径引入实现更好的代码分割
- 📊 **可扩展数据表** - 支持自定义字段和动态列配置
- 📑 **视图标签页** - 灵活的标签页管理系统
- 🔧 **VXE Table 集成** - 强大的表格功能封装
- 🔍 **通用过滤器** - 可配置的多类型过滤组件
- 🎨 **TypeScript 支持** - 完整的类型定义和智能提示

## 技术栈

- Vue 3.x
- TypeScript
- UnoCSS
- VXE Table
- Vite

## 安装

```bash
npm install @luda-dev/component
```

## 快速开始

### 1. 完整引入

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import ComponentLibrary from '@luda-dev/component'
import '@luda-dev/component/style.css'

const app = createApp(App)
app.use(ComponentLibrary)
app.mount('#app')
```

### 2. 按需引入（推荐）

**选项 A: 从主入口按需引入**

```typescript
import { ModularLoader, DataTable, ViewTabs } from '@luda-dev/component'
import { useDataTable, useFilter } from '@luda-dev/component'
import { deepClone, formatDate } from '@luda-dev/component'
```

**选项 B: 模块化路径引入（更好的 Tree-shaking）**

```typescript
// 单个组件引入
import { ModularLoader } from '@luda-dev/component/modular-loader'
import { DataTable } from '@luda-dev/component/data-table'
import { ViewTabs } from '@luda-dev/component/view-tabs'
import { VxeTableWrapper } from '@luda-dev/component/vxe-table-wrapper'
import { GenericFilter } from '@luda-dev/component/filter'

// Composables 引入
import { useModularLoader, useDataTable, useFilter } from '@luda-dev/component/composables'

// 工具函数引入
import { deepClone, debounce, formatDate } from '@luda-dev/component/utils'

// 类型定义引入
import type { ModuleConfig, DataTableConfig, FilterConfig } from '@luda-dev/component/types'

// 样式引入
import '@luda-dev/component/style.css'
```

## 组件说明

### 1. ModularLoader (模块化加载器)

动态加载和管理组件模块。

**使用示例:**

```vue
<template>
  <ModularLoader 
    :config="moduleConfig" 
    :props="moduleProps"
    @loaded="handleLoaded"
    @error="handleError"
  />
</template>

<script setup>
import { ModularLoader } from '@luda-dev/component'

const moduleConfig = {
  name: 'my-module',
  path: '@/components/MyComponent.vue',
  meta: { /* 自定义元数据 */ }
}
</script>
```

**API:**

- `config`: 模块配置对象
  - `name`: 模块名称
  - `path`: 模块路径
  - `component`: 直接提供的组件（可选）
  - `meta`: 元数据（可选）
- `props`: 传递给加载模块的属性
- 事件:
  - `loaded`: 模块加载成功
  - `error`: 模块加载失败
  - `update`: 模块更新

### 2. DataTable (数据表)

支持扩展字段的数据表组件。

**使用示例:**

```vue
<template>
  <DataTable 
    :config="tableConfig" 
    :data="tableData"
    @refresh="handleRefresh"
    @rowClick="handleRowClick"
    @cellEdit="handleCellEdit"
  />
</template>

<script setup>
import { DataTable } from '@luda-dev/component'

const tableConfig = {
  columns: [
    { 
      field: 'id', 
      title: 'ID', 
      width: 80, 
      sortable: true 
    },
    { 
      field: 'name', 
      title: '姓名', 
      editable: true 
    },
    { 
      field: 'status', 
      title: '状态', 
      type: 'select',
      options: [
        { label: '激活', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  ],
  stripe: true,
  border: true
}
</script>
```

**API:**

- `config`: 表格配置
  - `columns`: 列配置数组
  - `stripe`: 是否斑马纹
  - `border`: 是否显示边框
  - `showOverflow`: 溢出显示方式
- `data`: 表格数据
- `showToolbar`: 是否显示工具栏
- 事件:
  - `refresh`: 刷新表格
  - `rowClick`: 行点击
  - `cellEdit`: 单元格编辑

**扩展字段配置:**

```typescript
{
  field: string           // 字段名
  title: string          // 列标题
  type: string           // 字段类型: text | number | date | select | checkbox | custom
  width?: number         // 列宽度
  visible?: boolean      // 是否可见
  editable?: boolean     // 是否可编辑
  sortable?: boolean     // 是否可排序
  options?: Array        // 选项（用于 select 类型）
  formatter?: Function   // 格式化函数
  validator?: Function   // 验证函数
}
```

### 3. ViewTabs (视图标签页)

灵活的标签页管理组件。

**使用示例:**

```vue
<template>
  <ViewTabs 
    :tabs="tabs" 
    v-model="activeTab"
    @tabClick="handleTabClick"
    @tabClose="handleTabClose"
  >
    <template #actions>
      <button>自定义操作</button>
    </template>
  </ViewTabs>
</template>

<script setup>
import { ViewTabs } from '@luda-dev/component'
import { ref } from 'vue'

const activeTab = ref('tab1')
const tabs = [
  { 
    name: 'tab1', 
    label: '基本信息', 
    icon: '📄',
    component: BasicInfo
  },
  { 
    name: 'tab2', 
    label: '详细配置', 
    icon: '⚙️',
    component: DetailConfig,
    lazy: true  // 懒加载
  }
]
</script>
```

**API:**

- `tabs`: 标签页配置数组
- `modelValue`: 当前激活的标签页
- 事件:
  - `tabClick`: 标签点击
  - `tabClose`: 标签关闭
  - `tabUpdate`: 标签更新

### 4. VxeTableWrapper (VXE Table 封装)

对 VXE Table 的高级封装。

**使用示例:**

```vue
<template>
  <VxeTableWrapper
    :columns="columns"
    :data="data"
    show-checkbox
    show-pager
    :total="total"
    @pageChange="handlePageChange"
  >
    <template #actions="{ row }">
      <button @click="edit(row)">编辑</button>
      <button @click="delete(row)">删除</button>
    </template>
  </VxeTableWrapper>
</template>
```

### 5. GenericFilter (通用过滤器)

可配置的多类型过滤组件。

**使用示例:**

```vue
<template>
  <GenericFilter
    :config="filterConfig"
    v-model="filterValues"
    @search="handleSearch"
    @reset="handleReset"
  />
</template>

<script setup>
import { GenericFilter } from '@luda-dev/component'

const filterConfig = {
  items: [
    { 
      field: 'name', 
      label: '姓名', 
      type: 'input' 
    },
    { 
      field: 'age', 
      label: '年龄', 
      type: 'numberrange' 
    },
    { 
      field: 'status', 
      label: '状态', 
      type: 'select',
      options: [
        { label: '全部', value: '' },
        { label: '激活', value: 'active' }
      ]
    }
  ],
  inline: true
}
</script>
```

**支持的过滤器类型:**

- `input`: 文本输入
- `number`: 数字输入
- `numberrange`: 数字范围
- `select`: 下拉选择
- `date`: 日期选择
- `daterange`: 日期范围
- `custom`: 自定义组件

## Composables

提供了一组可组合函数来简化开发：

### useModularLoader

```typescript
import { useModularLoader } from '@luda-dev/component'

const {
  modules,
  registerModule,
  unregisterModule,
  getModule,
  getAllModules
} = useModularLoader()
```

### useDataTable

```typescript
import { useDataTable } from '@luda-dev/component'

const {
  columns,
  data,
  addColumn,
  removeColumn,
  updateColumn,
  setData
} = useDataTable(initialColumns)
```

### useFilter

```typescript
import { useFilter } from '@luda-dev/component'

const {
  filterItems,
  filterValues,
  activeFilters,
  addFilterItem,
  setFilterValue,
  resetFilterValues
} = useFilter(initialItems)
```

## 工具函数

```typescript
import { 
  deepClone,
  debounce,
  throttle,
  formatDate,
  generateId,
  isEmpty,
  getValueByPath,
  setValueByPath
} from '@luda-dev/component'
```

## 构建系统说明

本组件库采用现代化的构建方式：

- **主入口**：提供打包后的 ES 和 UMD 格式文件
- **模块化路径**：直接导出源文件（TypeScript/Vue），由消费者的构建工具处理
  - 适用于 Vite、Webpack 5+ 等现代构建工具
  - 支持更好的 Tree-shaking 和开发体验
  - 需要构建工具支持 TypeScript 和 Vue 文件处理

如果你的项目使用现代构建工具（Vite、Webpack 5+），推荐使用模块化路径引入以获得最佳性能。

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check
```

## 项目结构

```
component/
├── src/
│   ├── components/          # 组件目录
│   │   ├── modular-loader/ # 模块化加载器
│   │   ├── data-table/     # 数据表
│   │   ├── view-tabs/      # 视图标签页
│   │   ├── vxe-table-wrapper/ # VXE Table 封装
│   │   └── filter/         # 通用过滤器
│   ├── composables/        # 组合式函数
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   ├── styles/             # 全局样式
│   └── index.ts            # 入口文件
├── vite.config.ts          # Vite 配置
├── uno.config.ts           # UnoCSS 配置
├── tsconfig.json           # TypeScript 配置
└── package.json
```

## 分支开发建议

为了避免合并冲突，建议按以下方式组织分支开发：

1. **feature/modular-loader** - 模块化加载器功能开发
2. **feature/data-table** - 数据表扩展功能开发
3. **feature/view-tabs** - 视图标签页功能开发
4. **feature/vxe-table** - VXE Table 集成开发
5. **feature/filter** - 通用过滤器开发

所有共享依赖和配置已在主分支中准备好。

## License

MIT
