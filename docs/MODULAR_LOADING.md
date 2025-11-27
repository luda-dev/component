# 模块化加载指南 (Modular Loading Guide)

本指南详细介绍如何使用组件库的模块化加载功能，以优化应用的打包体积。

## 🔧 构建工具要求

**模块化路径引入**需要现代构建工具支持：
- ✅ Vite 2+ (推荐)
- ✅ Webpack 5+ with TypeScript loader
- ✅ Rollup with appropriate plugins
- ⚠️ 需要构建工具支持处理 `.vue` 和 `.ts` 文件

**主入口引入**适用于所有构建工具，因为它使用预构建的 ES/UMD 文件。

> 💡 **提示**：如果你的项目使用 Vite 或其他现代构建工具，强烈推荐使用模块化路径引入以获得最佳性能。

## 📦 导入方式对比

### 1. 完整引入 (Full Import)

适用于使用多个组件的场景。

```typescript
import { createApp } from 'vue'
import ComponentLibrary from '@luda-dev/component'
import '@luda-dev/component/style.css'

const app = createApp(App)
app.use(ComponentLibrary)
app.mount('#app')
```

**优点：**
- ✅ 简单快捷，全局注册所有组件
- ✅ 适合原型开发和快速迭代

**缺点：**
- ❌ 打包体积最大（ES: ~31KB，UMD: ~24KB）
- ❌ 无法进行 Tree-shaking

### 2. 主入口按需引入 (Named Imports from Main Entry)

从主入口按需导入所需的组件和功能。

```typescript
// 组件
import { ModularLoader, DataTable, ViewTabs } from '@luda-dev/component'

// Composables
import { useDataTable, useFilter } from '@luda-dev/component'

// 工具函数
import { deepClone, formatDate } from '@luda-dev/component'

// 类型
import type { ModuleConfig, DataTableConfig } from '@luda-dev/component'

// 样式
import '@luda-dev/component/style.css'
```

**优点：**
- ✅ 代码简洁，从单一入口导入
- ✅ 支持 IDE 自动完成
- ✅ 相对较好的 Tree-shaking（取决于构建工具）

**缺点：**
- ⚠️ Tree-shaking 效果依赖构建工具配置

### 3. 模块化路径引入 (Modular Path Imports) ⭐ **推荐**

通过具体的模块路径导入，获得最佳的 Tree-shaking 效果。

```typescript
// 按组件路径引入
import { ModularLoader } from '@luda-dev/component/modular-loader'
import { DataTable } from '@luda-dev/component/data-table'
import { ViewTabs } from '@luda-dev/component/view-tabs'
import { VxeTableWrapper } from '@luda-dev/component/vxe-table-wrapper'
import { GenericFilter } from '@luda-dev/component/filter'

// 按功能模块引入
import { useModularLoader, useDataTable, useFilter } from '@luda-dev/component/composables'
import { deepClone, debounce, formatDate } from '@luda-dev/component/utils'
import type { ModuleConfig, DataTableConfig } from '@luda-dev/component/types'

// 样式
import '@luda-dev/component/style.css'
```

**优点：**
- ✅ 最佳 Tree-shaking 效果
- ✅ 打包体积最小
- ✅ 明确的依赖关系
- ✅ 更好的代码分割

**缺点：**
- ⚠️ 导入路径稍长

## 🎯 可用的模块路径

### 组件模块

| 组件 | 导入路径 | 说明 |
|------|---------|------|
| ModularLoader | `@luda-dev/component/modular-loader` | 模块化加载器 |
| DataTable | `@luda-dev/component/data-table` | 数据表组件 |
| ViewTabs | `@luda-dev/component/view-tabs` | 视图标签页 |
| VxeTableWrapper | `@luda-dev/component/vxe-table-wrapper` | VXE Table 封装 |
| GenericFilter | `@luda-dev/component/filter` | 通用过滤器 |

### 功能模块

| 模块 | 导入路径 | 说明 |
|------|---------|------|
| Composables | `@luda-dev/component/composables` | 组合式函数 |
| Utils | `@luda-dev/component/utils` | 工具函数 |
| Types | `@luda-dev/component/types` | TypeScript 类型 |

### 样式

| 类型 | 导入路径 | 说明 |
|------|---------|------|
| CSS | `@luda-dev/component/style.css` | 组件样式 |

## 💡 实际应用示例

### 示例 1: 只使用数据表

如果你只需要使用数据表功能，可以这样引入：

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import '@luda-dev/component/style.css'

createApp(App).mount('#app')
```

```vue
<!-- DataTablePage.vue -->
<script setup lang="ts">
import { DataTable } from '@luda-dev/component/data-table'
import { useDataTable } from '@luda-dev/component/composables'
import type { DataTableConfig } from '@luda-dev/component/types'

const tableConfig: DataTableConfig = {
  columns: [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: '姓名', editable: true }
  ]
}

const { data, addColumn } = useDataTable(tableConfig.columns)
</script>

<template>
  <DataTable :config="tableConfig" :data="data" />
</template>
```

**打包结果：** 只包含 DataTable 组件及其依赖，体积最小。

### 示例 2: 使用多个组件

```vue
<script setup lang="ts">
// 导入需要的组件
import { DataTable } from '@luda-dev/component/data-table'
import { ViewTabs } from '@luda-dev/component/view-tabs'
import { GenericFilter } from '@luda-dev/component/filter'

// 导入需要的工具函数
import { formatDate, deepClone } from '@luda-dev/component/utils'

// 导入类型
import type { 
  DataTableConfig, 
  TabItem, 
  FilterConfig 
} from '@luda-dev/component/types'

// 组件逻辑...
</script>
```

### 示例 3: 只使用工具函数

如果你只需要工具函数，不需要任何 UI 组件：

```typescript
// utils/helpers.ts
import { deepClone, debounce, formatDate } from '@luda-dev/component/utils'

export function cloneObject(obj: any) {
  return deepClone(obj)
}

export const debouncedSearch = debounce((keyword: string) => {
  // 搜索逻辑
}, 300)

export function formatTimestamp(timestamp: number) {
  return formatDate(timestamp, 'YYYY-MM-DD HH:mm:ss')
}
```

**打包结果：** 只包含工具函数，不包含任何组件代码。

## 📊 打包体积对比

| 导入方式 | 相对体积 | Tree-shaking | 推荐场景 |
|---------|---------|-------------|---------|
| 完整引入 | 100% (~8 KB gzipped) | ❌ | 使用多个组件，快速开发 |
| 主入口按需 | 60-80% | ⚠️ | 代码简洁性优先 |
| 模块化路径 | 20-60% | ✅ | 生产环境，体积优化 |

> 注：具体体积取决于实际使用的组件数量。使用模块化路径引入单个组件时体积最小。

## 🔧 TypeScript 支持

所有导入方式都完全支持 TypeScript，提供完整的类型定义和 IDE 智能提示。

```typescript
// 自动类型推导
import { DataTable } from '@luda-dev/component/data-table'
// DataTable 的 props 类型会自动推导

// 显式类型导入
import type { DataTableConfig, ExtendField } from '@luda-dev/component/types'

const config: DataTableConfig = {
  columns: [] // 会有完整的类型检查
}
```

## 🚀 最佳实践

1. **生产环境使用模块化路径引入**
   - 获得最小的打包体积
   - 更好的代码分割效果

2. **开发环境可以使用主入口按需引入**
   - 代码更简洁
   - 开发体验更好

3. **按需引入样式**
   ```typescript
   import '@luda-dev/component/style.css'
   ```

4. **使用 IDE 自动导入**
   - 配置 IDE 使用模块化路径进行自动导入
   - 提高开发效率

5. **组织导入语句**
   ```typescript
   // 组件
   import { DataTable } from '@luda-dev/component/data-table'
   
   // Composables
   import { useDataTable } from '@luda-dev/component/composables'
   
   // Utils
   import { formatDate } from '@luda-dev/component/utils'
   
   // Types
   import type { DataTableConfig } from '@luda-dev/component/types'
   
   // Styles
   import '@luda-dev/component/style.css'
   ```

## 🔍 常见问题

### Q: 为什么推荐使用模块化路径引入？

A: 模块化路径引入让构建工具（如 Vite、Webpack）能够更精确地识别使用的代码，从而实现更好的 Tree-shaking，减少最终打包体积。

### Q: 可以混用不同的导入方式吗？

A: 可以，但不推荐。建议在项目中统一使用一种导入方式以保持代码一致性。

### Q: 模块化引入是否影响运行时性能？

A: 不会。模块化引入只影响构建时的代码组织，运行时性能完全相同。

### Q: 如何验证 Tree-shaking 是否生效？

A: 查看构建输出的 bundle 大小，或使用 webpack-bundle-analyzer 等工具分析打包结果。

## 📚 相关文档

- [快速开始](../README.md#快速开始)
- [组件文档](../README.md#组件说明)
- [API 参考](../README.md)

## 🤝 贡献

如果你有任何改进建议或发现问题，欢迎提交 Issue 或 Pull Request。
