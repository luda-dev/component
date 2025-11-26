# 快速开始指南

## 🚀 立即开始开发

### 1️⃣ 克隆项目
```bash
git clone https://github.com/luda-dev/component.git
cd component
```

### 2️⃣ 安装依赖
```bash
npm install
```

### 3️⃣ 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173 查看示例

### 4️⃣ 创建你的功能分支
```bash
# 选择对应的功能分支
git checkout -b feature/modular-loader     # 模块化加载器
git checkout -b feature/data-table         # 数据表
git checkout -b feature/view-tabs          # 视图标签页
git checkout -b feature/vxe-table          # VXE Table
git checkout -b feature/filter             # 通用过滤器
```

## 📁 项目结构速查

```
component/
├── src/
│   ├── components/           👈 在这里开发组件
│   │   ├── modular-loader/
│   │   ├── data-table/
│   │   ├── view-tabs/
│   │   ├── vxe-table-wrapper/
│   │   └── filter/
│   ├── composables/          👈 组合式函数
│   ├── types/                👈 类型定义
│   ├── utils/                👈 工具函数
│   └── styles/               👈 全局样式
├── examples/                 👈 使用示例
└── docs/                     👈 文档
```

## 🎯 开发你的功能

### 如果你负责 ModularLoader
```bash
cd src/components/modular-loader/
# 修改 ModularLoader.vue
# 更新 index.ts 导出
```

### 如果你负责 DataTable
```bash
cd src/components/data-table/
# 修改 DataTable.vue
# 在 src/composables/useDataTable.ts 添加新功能
```

### 如果你负责 ViewTabs
```bash
cd src/components/view-tabs/
# 修改 ViewTabs.vue
# 添加新特性
```

### 如果你负责 VxeTableWrapper
```bash
cd src/components/vxe-table-wrapper/
# 修改 VxeTableWrapper.vue
# 集成更多 VXE Table 功能
```

### 如果你负责 GenericFilter
```bash
cd src/components/filter/
# 修改 GenericFilter.vue
# 在 src/composables/useFilter.ts 添加新功能
```

## 📝 常用命令

```bash
# 开发
npm run dev                    # 启动开发服务器

# 构建
npm run build                  # 构建组件库

# 检查
npm run type-check             # TypeScript 类型检查

# 预览
npm run preview                # 预览构建结果
```

## 🔥 快速测试你的组件

在 `src/App.vue` 中快速测试：

```vue
<template>
  <div>
    <!-- 测试你的组件 -->
    <YourComponent />
  </div>
</template>

<script setup>
import YourComponent from './components/your-component/YourComponent.vue'
</script>
```

或者在 `examples/` 目录创建新的示例文件。

## 💡 使用现有组件

```vue
<script setup>
// 导入组件
import { DataTable, ViewTabs, GenericFilter } from './index'

// 导入类型
import type { DataTableConfig, TabItem, FilterConfig } from './types'

// 使用 composables
import { useDataTable, useFilter } from './composables'
</script>
```

## 🎨 样式开发

使用 UnoCSS 快捷类：

```vue
<template>
  <div class="flex items-center justify-between">
    <button class="btn">主要按钮</button>
    <button class="btn-secondary">次要按钮</button>
  </div>
</template>
```

或使用 scoped 样式：

```vue
<style scoped>
.my-component {
  /* 你的样式 */
}
</style>
```

## 🤝 提交代码

```bash
# 1. 添加更改
git add .

# 2. 提交（使用语义化提交信息）
git commit -m "feat: add new feature"
git commit -m "fix: fix bug"
git commit -m "docs: update docs"

# 3. 推送到远程
git push origin feature/your-feature-name

# 4. 创建 Pull Request
```

## 📚 更多文档

- [README.md](README.md) - 完整项目文档
- [DEVELOPMENT.md](docs/DEVELOPMENT.md) - 开发指南
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - 项目总结
- [CHANGELOG.md](CHANGELOG.md) - 更新日志

## ⚠️ 注意事项

### 避免合并冲突

1. **只修改你负责的组件目录**
2. **添加新类型到 `src/types/index.ts`** 时放在文件末尾
3. **添加新依赖** 时记录在你的 PR 中
4. **频繁同步主分支**: `git pull origin main`

### 共享文件要小心

这些文件被多人共享，修改时特别注意：
- `package.json` - 添加依赖
- `src/index.ts` - 添加导出
- `src/types/index.ts` - 添加类型
- `vite.config.ts` - 通常不需要改
- `uno.config.ts` - 添加新的快捷类

## 🎉 开始开发吧！

选择一个功能分支，开始你的工作。祝编码愉快！

有问题？查看文档或在 Issues 中提问。
