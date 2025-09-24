import { defineConfig } from 'vitepress';
import sidebar from './config/sidebar';
import nav from './config/nav';

export default defineConfig({
  title: "灵犀Spirit",
  description: "一个人的心有灵犀",
  lastUpdated: true,
  head: [
    ['meta', { name: 'referrer', content: 'no-referrer' }],
    ['link', { rel: 'icon', href: '/icons/favicon.png' }],
  ],
  themeConfig: {
    nav,
    sidebar,
    logo: '/icons/favicon.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Triabin/spirit' }
    ],
    search: {
      provider: 'local'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '页面导航'
    },
    lastUpdated: {
      text: '最后更新于'
    },
    footer: {
      message: '基于 MIT 许可发布',
      copyright: '版权所有 © 2024-至今 Triabin'
    }
  }
})
