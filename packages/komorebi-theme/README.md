# 木漏れ日 / komorebi-theme

一个基于 Astro 的博客主题，注重轻盈排版、安静阅读与持续写作。

要求 Astro 6 和 Node `22.12.0` 或更高版本。

## 快速开始

```sh
npm create komorebi
```

脚手架会通过交互式向导引导你完成初始配置。详见[快速开始](https://komorebi-docs.vercel.app/guide/getting-started)。

## 手动安装

终端执行：

```sh
npm i astro@^6 komorebi-theme
```

`astro.config.ts`:

```ts
import { defineConfig } from 'astro/config';
import komorebi from 'komorebi-theme';

export default defineConfig({
  site: 'https://your-domain.com',
  integrations: [komorebi()],
});
```

`komorebi.config.ts`:

```ts
import { defineConfig } from 'komorebi-theme';

export default defineConfig({
  title: '我的博客',
});
```

`src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { blogConfig, specialConfig } from 'komorebi-theme/collections';

export const collections = {
  blog: defineCollection(blogConfig()),
  special: defineCollection(specialConfig()),
};
```

## 文档

完整文档请访问 [Komorebi Docs](https://komorebi.keqing.moe/)。

## License

MIT
