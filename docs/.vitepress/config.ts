import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Komorebi Docs',
  description: 'Komorebi 主题文档',
  themeConfig: {
    nav: [{ text: '首页', link: '/' }],
    sidebar: [],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/KeqingMoe/komorebi',
      },
    ],
  },
});
