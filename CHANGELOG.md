# 更新日志 (Changelog)

所有重要的项目变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增
- ✨ **模块化加载支持** - 支持三种导入方式，优化打包体积
  - 完整引入：`import ComponentLibrary from '@luda-dev/component'`
  - 主入口按需引入：`import { ModularLoader, useDataTable } from '@luda-dev/component'`
  - 模块化路径引入：`import { ModularLoader } from '@luda-dev/component/modular-loader'`
- 🎯 **独立模块导出路径** - 支持按组件、composables、utils、types 单独引入
  - 组件路径：`@luda-dev/component/[component-name]`
  - Composables 路径：`@luda-dev/component/composables`
  - 工具函数路径：`@luda-dev/component/utils`
  - 类型定义路径：`@luda-dev/component/types`
- 📦 **更好的 Tree-shaking 支持** - 通过模块化路径实现最优的代码分割
- 📚 **详细的模块化加载示例** - 新增 modular-loading-example.vue 演示文件
- 初始化项目结构
- 模块化加载器组件 (ModularLoader)
- 数据表组件，支持扩展字段 (DataTable)
- 视图标签页组件 (ViewTabs)
- VXE Table 封装组件 (VxeTableWrapper)
- 通用过滤器组件 (GenericFilter)
- 组合式函数：useModularLoader, useDataTable, useFilter
- 工具函数集合
- TypeScript 类型定义
- 完整的项目文档

### 改进
- 📝 更新 README 文档，添加详细的模块化导入说明
- 🔧 优化 package.json exports 配置，支持多种导入方式
- 💡 主入口文件现在也导出 composables 和 utils，提供更好的向后兼容性

### 配置
- Vue 3 + Vite 开发环境
- UnoCSS 样式引擎
- TypeScript 支持
- 组件库构建配置

## [1.0.0] - 待发布

初始版本发布计划。
