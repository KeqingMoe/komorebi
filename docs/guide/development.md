# 开发与贡献

本页面介绍如何在本地运行 komorebi 仓库进行开发和贡献。

komorebi 欢迎任何人提出 Issue 或发起 PR！

## 仓库结构

komorebi 使用 npm workspace 管理多个包：

```:no-line-numbers
komorebi/
├── packages/
│   ├── komorebi-theme/       # 主题核心包
│   └── create-komorebi/      # CLI 脚手架工具
├── examples/
│   └── basic/                # 示例项目
└── docs/                     # 文档站
```

### packages/komorebi-theme

主题的主要代码所在。包含：

- `src/index.ts` — Astro integration 入口
- `src/options.ts` — 配置类型定义与默认值
- `src/config-loader.ts` — 独立配置文件加载器
- `src/unocss.ts` — UnoCSS 集成配置
- `src/routes/` — 主题提供的路由页面
- `src/runtime/` — 运行时组件、布局和样式
- `src/middleware/` — 中间件，例如外链转换
- `src/content/` — 预定义内容集合

### packages/create-komorebi

CLI 脚手架工具。通过 `npm create komorebi` 使用。

### examples/basic

一个完整的示例项目，展示了主题的基本用法。可以作为开发时的测试环境。

## 环境要求

- [Node.js](https://nodejs.org/) `22.12.0` 或更高版本
- npm

## 开发命令

在仓库根目录下执行：

```sh
npm run dev      # 启动开发服务器
npm run build    # 构建
npm run preview  # 预览构建结果
npm run check    # 类型检查
npm run lint     # 代码检查
npm run lint:fix # 自动修复代码风格问题
npm run test     # 运行测试
```

### 文档相关

```sh
npm run docs:dev     # 启动文档站开发服务器
npm run docs:build   # 构建文档站
npm run docs:preview # 预览文档构建结果
```

## 开发流程

1. Fork 本仓库并克隆到本地
2. 确保 Node 版本满足要求（`node -v` 检查）
3. 安装依赖：`npm i`
4. 启动开发服务器：`npm run dev`
5. 在 `examples/basic/` 中测试变更
6. 运行 `npm run check && npm run lint && npm run test` 确保通过
7. 提交 PR

### 依赖安装

komorebi 采用 monorepo 架构，安装依赖时请区分为 workspace 安装还是为某个具体的包安装。

开发 Integration（本项目）与开发网站不同。当你安装开发依赖时，请确定它是否是开发依赖。如果需要将依赖的功能传播到用户侧（例如引入 iconify），请不要将其安装为开发依赖。

## 代码规范

项目使用 [Biome](https://biomejs.dev/) 进行代码检查和格式化。提交前请运行 `npm run lint` 确保没有问题。

## 测试

测试文件位于 `packages/komorebi-theme/src/` 目录下，以 `.test.ts` 结尾。使用 [Vitest](https://vitest.dev/) 作为测试框架。

```sh
npm run test        # 运行一次
npm run test:watch  # 监听模式
```
