# 快速开始

创建一个全新的 komorebi 博客项目。

## 前置要求

- [Node.js](https://nodejs.org/) `22.12.0` 或更高版本
- npm（随 Node.js 附带）

## 创建项目

在终端中执行：

```sh
npm create komorebi
```

脚手架会启动一个交互式向导，依次询问以下信息：

| 提问 | 说明 |
| - | - |
| 项目目录 | 初始化站点的位置，若不存在则创建一个新的目录 |
| 博客标题 | 站点 `<title>` 和页头显示的标题 |
| 站点地址 | 生成 RSS 和 `sitemap.xml` 时使用的基础 URL |
| 是否立即安装依赖 | 选择 `Yes` 可以一步到位，无需之后手动 `npm i` |

向导结束后，进入项目目录：

```sh
cd 项目目录
```

如果创建时跳过了自动安装，先执行：

```sh
npm i
```

## 启动开发服务器

```sh
npm run dev
```

终端会显示本地访问地址（通常为 `http://localhost:4321`）。在浏览器中打开即可看到博客首页。

## 项目结构

脚手架生成的项目结构如下：

```:no-line-numbers
项目目录/
├── astro.config.ts            # Astro 配置，注册 komorebi 主题
├── komorebi.config.ts         # 主题配置（标题、导航等）
├── package.json
└── src/
    ├── content.config.ts      # Astro 内容集合定义
    └── content/
        ├── about.md           # 关于页面
        └── blog/
            └── hello-world.md # 示例文章
```

你可以立即开始编辑 Astro 或 Komorebi 的配置和 `src/` 下的文件，开发服务器会实时热更新。

## 下一步

- [手动安装](./installation) — 如果已有 Astro 项目，了解如何手动集成主题
- [写文章](./writing) — 了解文章 frontmatter 的完整格式
- [配置选项](/reference/configuration) — 查看所有可配置项
- [定制与扩展](./customization) — 自定义页面、复用组件、配置 Markdown 扩展
