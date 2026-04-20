# 配置选项

komorebi 的配置通过 `komorebi.config.ts` 文件（推荐）或内联传入 `komorebi()` 进行。

```ts
import { defineConfig } from 'komorebi-theme';

export default defineConfig({
  title: '木漏れ日',
  tagline: '轻盈排版、安静阅读与持续写作。',
  repositoryUrl: 'https://github.com/user/repo',
  locale: 'zh-CN',
  pagination: { pageSize: 10 },
  home: {
    eyebrow: '欢迎来到这里',
    title: 'Hi~',
    description: '欢迎来到我的博客。',
  },
  nav: navLinks(),
  friends: [],
  externalLinks: {
    autoTarget: true,
    indicator: 'mdi:launch',
  },
  customCss: ['./src/styles/custom.css'],
  labels: {},
});
```

## `title`

`string` — 站点标题。

显示在浏览器标签页、页头、RSS feed 的 `<title>` 中。

- 默认值：`'木漏れ日'`

```ts
export default defineConfig({
  title: '我的博客',
});
```

## `tagline`

`string` — 站点副标题。

显示在页头标题旁边，用作简短说明。

- 默认值：`''`（空字符串）

```ts
export default defineConfig({
  tagline: '轻盈排版、安静阅读与持续写作。',
});
```

## `repositoryUrl`

`string | undefined` — 仓库地址。

这是一个卫星配置，暂时没有功能使用到它。

- 默认值：`undefined`

```ts
export default defineConfig({
  repositoryUrl: 'https://github.com/user/repo',
});
```

## `locale`

`string` — 语言代码。

用于 `<html lang="...">` 属性和日期格式化。

- 默认值：`'zh-CN'`

```ts
export default defineConfig({
  locale: 'en',
});
```

## `pagination`

`{ pageSize?: number }` — 分页配置。

控制博客文章列表每页显示的文章数量。

### `pagination.pageSize`

- 类型：`number`
- 默认值：`10`

```ts
export default defineConfig({
  pagination: { pageSize: 15 },
});
```

## `home`

`object` — 首页首屏配置。

控制首页 hero 区域显示的文本。

| 字段 | 类型 | 默认值 | 说明 |
| - | - | - | - |
| `eyebrow` | `string` | `'欢迎来到这里'` | hero 区域小标题 |
| `title` | `string` | `'Hi~'` | hero 区域大标题 |
| `description` | `string` | `'欢迎来到我的博客，希望你能在这里读到一些值得停留下来的内容。'` | hero 区域描述文字 |

```ts
export default defineConfig({
  home: {
    eyebrow: '独立开发者',
    title: 'Hello World',
    description: '记录技术探索与日常思考。',
  },
});
```

## `nav`

`KomorebiNavLink[]` — 导航栏链接列表。

不设置时默认包含所有内置页面链接。详见[导航配置](./navigation.md)。

```ts
import { navLinks } from 'komorebi-theme';

export default defineConfig({
  nav: navLinks(),
});
```

## `friends`

`KomorebiFriend[]` — 友链数据。

每项显示为友链页面上的一张卡片。

| 字段 | 类型 | 必填 | 说明 |
| - | - | - | - |
| `name` | `string` | 是 | 朋友的昵称或网站名称 |
| `url` | `string` | 是 | 网站链接 |
| `avatar` | `string` | 是 | 头像 URL |
| `description` | `string` | 是 | 简短描述 |

```ts
export default defineConfig({
  friends: [
    {
      name: '時雨てる',
      url: 'https://keqing.moe',
      avatar: 'https://keqing.moe/favicon.svg',
      description: '木漏れ日作者',
    },
  ],
});
```

## `externalLinks`

控制外部链接的行为。从 v0.5.0 开始，外链默认显示指示器图标并在新标签页打开。

可以设置为 `false` 来完全禁用外链处理：

```ts
export default defineConfig({
  externalLinks: false,
});
```

也可以精细配置各项行为：

```ts
export default defineConfig({
  externalLinks: {
    autoTarget: true,
    indicator: 'mdi:launch',
  },
});
```

### `externalLinks.autoTarget`

- 类型：`boolean`
- 默认值：`true`

是否自动为外链添加 `target="_blank"`（在新标签页打开）。

### `externalLinks.indicator`

- 类型：`string | { html: string } | false`
- 默认值：`'mdi:launch'`

外链旁显示的指示器图标。

- `string` — 使用 [Iconify](https://iconify.design/) 图标名称，例如 `'mdi:launch'`、`'ri:external-link-line'`。需要安装对应的 Iconify 图标集包。可以在[这里](https://icones.js.org/)查看所有可用图标。
- `{ html: string }` — 自定义 HTML，例如 `{ html: '<svg>...</svg>' }`。如果有类名，会自动提取到 UnoCSS 的 safelist 中。
- `false` — 不显示指示器图标。

例如：

::: code-group

```ts [使用 Iconify 图标]
export default defineConfig({
  externalLinks: {
    indicator: 'ri:external-link-line',
  },
});
```

```ts [使用自定义 SVG]
export default defineConfig({
  externalLinks: {
    indicator: {
      html: '<svg class="my-icon" viewBox="0 0 24 24"><path d="..."/></svg>',
    },
  },
});
```

```ts [不显示指示器]
export default defineConfig({
  externalLinks: {
    indicator: false,
  },
});
```

:::

## `customCss`

`string[]` — 自定义 CSS 文件列表。

支持项目内的相对路径和 npm 包名。CSS 会被 Vite 处理并注入到所有页面中。

- 默认值：`[]`

例如：

```ts
export default defineConfig({
  customCss: [
    './src/styles/custom.css',      // 相对于项目根目录
    '@fontsource/noto-sans-sc',     // npm 包
    'katex/dist/katex.min.css',     // 包内的文件
  ],
});
```

相对路径会相对于项目根目录解析。这允许你覆盖主题的任何样式，而无需修改主题源码。

## `comments`

`false | GiscusOptions` — 评论区配置。

通过 [giscus](https://giscus.app/zh-CN) 将 GitHub Discussions 作为评论系统。默认关闭。

- 默认值：`false`

```ts
export default defineConfig({
  comments: false,
});
```

### `GiscusOptions` 字段

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| - | - | - | - | - |
| `repo` | `` `${string}/${string}` `` | 是 | — | GitHub 仓库，格式 `owner/repo` |
| `repoId` | `string` | 是 | — | 仓库 ID（从 giscus.app 获取） |
| `category` | `string` | 否 | — | Discussion 分类名称 |
| `categoryId` | `string` | 否 | — | 分类 ID（从 giscus.app 获取） |
| `mapping` | `string` | 否 | `'pathname'` | 页面与 Discussion 的映射方式 |
| `term` | `string` | 否 | — | 搜索关键词（`mapping` 为 `specific` 时使用） |
| `strict` | `boolean` | 否 | — | 是否启用严格标题匹配 |
| `reactionsEnabled` | `boolean` | 否 | — | 是否启用主帖表情回应 |
| `emitMetadata` | `boolean` | 否 | — | 是否定期发送 discussion 元数据 |
| `inputPosition` | `'top' \| 'bottom'` | 否 | — | 评论框位置 |
| `lang` | `string` | 否 | — | 界面语言，如 `'zh-CN'` |
| `theme` | `string \| { preset: Theme }` | 否 | 内置主题 | 评论区主题，详见下文 |

`mapping` 支持的值：

| 值 | 说明 |
| - | - |
| `'pathname'` | 按页面路径匹配（推荐） |
| `'url'` | 按完整 URL 匹配 |
| `'title'` | 按页面标题匹配 |
| `'og:title'` | 按 Open Graph 标题匹配 |
| `'specific'` | 按 `term` 指定的关键词匹配 |
| `'number'` | 按 Discussion 编号匹配 |

### 主题配置

`theme` 控制评论区的外观。

**使用预设主题：**

传入 `{ preset }` 对象，值为 giscus 内置主题名：

```ts
export default defineConfig({
  comments: {
    repo: 'user/repo',
    repoId: 'R_kgDOXXXXXX',
    theme: { preset: 'preferred_color_scheme' },
  },
});
```

可用的预设主题：`light`、`light_high_contrast`、`light_protanopia`、`light_tritanopia`、`dark`、`dark_high_contrast`、`dark_protanopia`、`dark_tritanopia`、`dark_dimmed`、`preferred_color_scheme`、`transparent_dark`、`noborder_light`、`noborder_dark`、`noborder_gray`、`cobalt`、`purple_dark`、`gruvbox`、`gruvbox_dark`、`gruvbox_light`、`catppuccin_latte`、`catppuccin_frappe`、`catppuccin_macchiato`、`catppuccin_mocha` 等，或填入具体 URL。

**使用自定义 CSS：**

传入 CSS 文本字符串，主题会自动将其作为 `/giscus.css` 路由提供给 giscus 加载：

```ts
export default defineConfig({
  comments: {
    repo: 'user/repo',
    repoId: 'R_kgDOXXXXXX',
    theme: `
      main {
        --color-canvas-default: transparent;
        --color-fg-default: #18181b;
        --color-accent-fg: #f43f5e;
      }
    `,
  },
});
```

CSS 通过 giscus 的 CSS 变量控制评论区内部样式。完整的变量列表可参考 [giscus 主题源码](https://github.com/giscus/giscus/tree/main/styles/themes)。

**不指定主题：**

不设置 `theme` 时，使用主题内置的默认样式（与 komorebi 暖色调设计一致）。

```ts
export default defineConfig({
  comments: {
    repo: 'user/repo',
    repoId: 'R_kgDOXXXXXX',
    // 不设置 theme，使用内置默认样式
  },
});
```

### 完整示例

```ts
export default defineConfig({
  comments: {
    repo: 'user/repo',
    repoId: 'R_kgDOXXXXXX',
    category: 'Announcements',
    categoryId: 'DIC_kwDOXXXXXX',
    mapping: 'pathname',
    reactionsEnabled: true,
    emitMetadata: true,
    inputPosition: 'top',
    theme: { preset: 'preferred_color_scheme' },
    lang: 'zh-CN',
  },
});
```

## `labels`

`Partial<KomorebiThemeLabels>` — 覆盖界面文案。

可以覆盖主题中显示的各种文本标签。未覆盖的字段使用默认值。

| 字段 | 默认值 | 说明 |
| - | - | - |
| `latestPostsHeading` | `'最近写了什么'` | 首页最新文章区域的标题 |
| `latestPostsMore` | `'查看全部 →'` | 查看更多文章的链接文字 |
| `latestPostsEmptyPrefix` | `'暂时还没有公开文章，先去'` | 没有文章时的提示前缀 |
| `latestPostsEmptyLink` | `'关于页面'` | 没有文章时链接的文字 |
| `latestPostsEmptySuffix` | `'看看吧。'` | 没有文章时的提示后缀 |
| `footerRss` | `'订阅 RSS'` | 页脚 RSS 链接的文字 |

例如：

```ts
export default defineConfig({
  labels: {
    latestPostsHeading: 'Recent Posts',
    latestPostsMore: 'View all →',
    footerRss: 'Subscribe RSS',
  },
});
```
