# Changelog（更新日志）

本文档记录本项目的所有重要变更。格式部分遵循 Keep a Changelog 规范，版本号遵循语义化版本号规范。

## [0.6.2] - 2026-04-20

- **fix**: 调换 Giscus 与相邻文章导航链接的位置
- **fix**: 移除 Giscus Web Component 以正常使用评论功能

## [0.6.0] - 2026-04-20

- **feat**: Giscus 评论系统支持：新增 `giscus` 配置项，支持通过 GitHub Discussions 为文章添加评论功能
- **fix**: 添加 `env.d.ts` 以解决 LSP 类型提示问题
- **docs**: 新增 VitePress 文档站点，精简包内 README
- **chore**: 修复 npm audit 安全问题

## [0.5.2] - 2026-04-17

- **fix**: 修复外链图标不显示的 bug

## [0.5.0] - 2026-04-16

- **feat**: 外部链接转换：可以为外链配置指示器图标和是否要在新标签页打开
- **feat**: 独立配置文件支持：新增 `defineConfig` 辅助函数，支持自动加载 `komorebi.config.ts`，支持开发时热重载（HMR）
- **fix**: 锁定 vite ^7，修复 Astro 兼容性问题
- **BREAKING**: 外链默认显示指示器图标且在新标签页打开，如需恢复旧行为请设置 `externalLinks: false`

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

## [0.1.0] - 2026-03-29

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

### 0.4.x → 0.5.x

外链默认显示指示器图标。如需恢复旧行为（不显示图标），在配置中设置：

```ts
export default defineConfig({
  externalLinks: false,
});
```

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
