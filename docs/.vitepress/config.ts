import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Komorebi Docs',
  description: '木漏れ日主题文档',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
      { text: '参考', link: '/reference/configuration' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '手动安装', link: '/guide/installation' },
            { text: '写文章', link: '/guide/writing' },
            { text: '定制与扩展', link: '/guide/customization' },
            { text: '开发与贡献', link: '/guide/development' },
          ],
        },
      ],
      '/reference/': [
        {
          text: '参考',
          items: [
            { text: '配置选项', link: '/reference/configuration' },
            { text: '导航配置', link: '/reference/navigation' },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/KeqingMoe/komorebi',
      },
    ],
    outline: {
      label: '页面导航',
      level: 'deep',
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    lastUpdated: {
      text: '最后更新于',
    },
  },
  cleanUrls: true,
  markdown: {
    lineNumbers: true,
  },
});
