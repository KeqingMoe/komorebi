# Changelog（更新日志）

本文档记录本项目的所有重要变更。格式部分遵循 Keep a Changelog 规范，版本号遵循语义化版本号规范。

## [0.4.0] - 2026-04-12

- **feat**: 升级到 Astro 6，仅支持 Astro 6
- **feat**: 运行环境要求提升到 Node 22.12+
- **feat**: create-komorebi 默认生成 Astro 6 项目
- **chore**: 示例、模板、CI 与文档同步到 Astro 6 / Node 22.12+

## [0.3.0] - 2026-03-30

- **feat**: 自定义 CSS 支持：通过 `customCss` 配置项注入自定义样式
- **feat**: 移动端 Footer 样式优化：PC 和移动端样式统一
- **feat**: 文章元信息自动换行
- **fix**: RSS 路由丢失问题修复
- **BREAKING**: 路由配置选项移除

## [0.2.0] - 2026-03-30

- **feat**: 友链页面 (friends page)
- **feat**: 自定义导航链接功能
- **feat**: 移除默认 tagline
- **feat**: Footer 使用主题名称和 URL
- **refactor**: 导航配置统一处理
- **refactor**: RSS 从导航中移除
- **chore**: create-komorebi 中无用的文件移除

## [0.1.0] - 2026-03-???

- **feat**: 初始版本发布
- **feat**: 基础博客功能（首页、博客列表、文章详情页）
- **feat**: 关于页面
- **feat**: 归档页面
- **feat**: RSS feed
- **feat**: 友链页面
- **feat**: UnoCSS 排版支持
- **feat**: CLI 脚手架工具

---

## Upgrade Guide

### 0.2.x → 0.3.x

路由配置选项已移除。如有自定义路由需求，请直接使用 Astro 路由。

```diff
- import { defineConfig } from 'komorebi-theme'
-
- export default defineConfig({
-   routes: {
-     blog: '/blog',
-     archive: '/archive'
-   }
- })
```

### 0.1.x → 0.2.x

导航配置已统一。之前的 `navItems` 数组改为 `navLinks` 函数组合：

```diff
- import { defineConfig, navItems } from 'komorebi-theme'
+ import { defineConfig, homeLink, blogLink, archiveLink, aboutLink, friendsLink } from 'komorebi-theme'

export default defineConfig({
-  nav: navItems(['blog', 'archive', 'about'])
+  nav: [homeLink(), blogLink(), archiveLink(), aboutLink(), friendsLink()]
})
```
