# 开发指南 (Development Guide)

## 分支开发策略

本项目采用功能分支开发模式，每个功能模块在独立分支上开发，最后合并到主分支。

### 推荐分支结构

```
main
├── feature/modular-loader      # 模块化加载器功能开发
├── feature/data-table          # 数据表扩展功能开发
├── feature/view-tabs           # 视图标签页功能开发
├── feature/vxe-table           # VXE Table 集成开发
└── feature/filter              # 通用过滤器开发
```

### 开发流程

1. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **开发你的功能**
   - 只修改对应功能目录下的文件
   - 添加必要的测试
   - 更新相关文档

3. **提交变更**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

4. **创建 Pull Request**
   - 确保代码通过所有测试
   - 填写详细的 PR 描述
   - 等待代码审查

## 避免合并冲突

### 共享文件修改原则

以下文件是共享的，修改时需特别注意：

1. **`package.json`** - 如需添加依赖，在自己的分支添加，合并时解决冲突
2. **`src/index.ts`** - 只添加新组件的导出，不修改现有导出
3. **`src/types/index.ts`** - 添加新类型时，避免修改现有类型
4. **`vite.config.ts`** - 通常不需要修改
5. **`uno.config.ts`** - 添加新的快捷类时，避免修改现有类

### 独立开发区域

每个功能分支应该主要在自己的目录内工作：

- `feature/modular-loader` → `src/components/modular-loader/`
- `feature/data-table` → `src/components/data-table/`
- `feature/view-tabs` → `src/components/view-tabs/`
- `feature/vxe-table` → `src/components/vxe-table-wrapper/`
- `feature/filter` → `src/components/filter/`

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建库
npm run build

# 类型检查
npm run type-check

# 预览构建结果
npm run preview
```
