# Markdown 笔记应用

一个简洁、优雅的 Markdown 笔记应用，支持实时预览、标签管理、收藏功能和深色模式。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)

## ✨ 特性

- 📝 **Markdown 编辑** - 支持标准 Markdown 语法，实时预览
- 🏷️ **标签管理** - 为笔记添加标签，快速分类和查找
- ⭐ **收藏功能** - 收藏重要笔记，一键访问
- 🔍 **全文搜索** - 快速搜索笔记内容
- 📊 **统计信息** - 实时显示字数、字符数、行数
- 💾 **自动保存** - 500ms 防抖自动保存
- 🌙 **深色模式** - 护眼深色主题
- 📥 **导出功能** - 导出单个或所有笔记为 Markdown 文件
- ⌨️ **快捷键** - 支持常用快捷键操作
- 💾 **本地存储** - 数据存储在浏览器 LocalStorage

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建后的文件在 `dist` 目录。

## 📖 使用说明

### 基本操作

- **创建笔记** - 点击"+ 新建笔记"按钮或按 `Ctrl+N`
- **编辑笔记** - 在左侧列表点击笔记，在编辑器中输入内容
- **搜索笔记** - 在搜索框输入关键词
- **删除笔记** - 鼠标悬停在笔记上，点击"删除"按钮

### 标签管理

- 在编辑器顶部的标签输入框输入标签名，按 Enter 添加
- 点击标签可以筛选该标签的笔记
- 点击标签旁的 × 可以移除标签

### 收藏功能

- 点击编辑器顶部的 ⭐ 按钮收藏/取消收藏
- 点击侧边栏的"⭐ 收藏"按钮查看所有收藏的笔记

### 导出功能

- 点击编辑器顶部的 📥 按钮导出当前笔记
- 点击侧边栏底部的"📥 导出所有笔记"按钮导出全部笔记

### 快捷键

- `Ctrl+N` - 新建笔记
- `Ctrl+S` - 保存提示（已自动保存）
- `Ctrl+F` - 聚焦搜索框
- `Ctrl+E` - 导出当前笔记

## 🎨 支持的 Markdown 语法

- 标题：`# H1`, `## H2`, `### H3`
- 粗体：`**粗体**`
- 斜体：`*斜体*`
- 链接：`[文本](URL)`
- 图片：`![alt](URL)`
- 代码：`` `代码` ``
- 代码块：` ```代码块``` `
- 列表：`- 项目` 或 `1. 项目`

## 🛠️ 技术栈

- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **LocalStorage** - 浏览器本地存储
- **原生 JavaScript** - 无框架依赖

## 📁 项目结构

```
markdown-notes-app/
├── src/
│   ├── components/      # UI 组件
│   ├── models/          # 数据模型
│   ├── services/        # 业务逻辑
│   ├── utils/           # 工具函数
│   ├── App.ts           # 主应用类
│   └── main.ts          # 入口文件
├── index.html           # HTML 模板
├── styles.css           # 样式文件
└── package.json         # 项目配置
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

灵感来源于 Notion、Bear、Typora 等优秀的笔记应用。

