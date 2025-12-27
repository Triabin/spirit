import { defineConfig } from 'vitepress';
import sidebar from './config/sidebar';
import nav from './config/nav';
import { resolve } from 'path';
import mathjax3 from 'markdown-it-mathjax3';

// 当前执行node命令时文件夹的地址（工作目录）
const root: string = process.cwd();
// 路径拼接函数，简化代码
const pathResolve = (path: string): string => resolve(root, path);

const customElements = [
  'math',
  'maction',
  'maligngroup',
  'malignmark',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mi',
  'mlongdiv',
  'mmultiscripts',
  'mn',
  'mo',
  'mover',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'ms',
  'mscarries',
  'mscarry',
  'mscarries',
  'msgroup',
  'mstack',
  'mlongdiv',
  'msline',
  'mstack',
  'mspace',
  'msqrt',
  'msrow',
  'mstack',
  'mstack',
  'mstyle',
  'msub',
  'msup',
  'msubsup',
  'mtable',
  'mtd',
  'mtext',
  'mtr',
  'munder',
  'munderover',
  'semantics',
  'math',
  'mi',
  'mn',
  'mo',
  'ms',
  'mspace',
  'mtext',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mpadded',
  'mphantom',
  'mroot',
  'mrow',
  'msqrt',
  'mstyle',
  'mmultiscripts',
  'mover',
  'mprescripts',
  'msub',
  'msubsup',
  'msup',
  'munder',
  'munderover',
  'none',
  'maligngroup',
  'malignmark',
  'mtable',
  'mtd',
  'mtr',
  'mlongdiv',
  'mscarries',
  'mscarry',
  'msgroup',
  'msline',
  'msrow',
  'mstack',
  'maction',
  'semantics',
  'annotation',
  'annotation-xml'
];

export default defineConfig({
  title: "灵犀Spirit",
  description: "一个人的心有灵犀",
  lastUpdated: true,
  head: [
    ['meta', { name: 'referrer', content: 'no-referrer' }],
    ['link', { rel: 'icon', href: '/icons/favicon.png' }],
  ],
  vite: {
    resolve: {
      alias: [
        /** 设置@指向.vitepress目录 */
        { find: '@', replacement: pathResolve('docs/.vitepress') }
      ],
      extensions: ['.vue', '.css', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
  },
  markdown: {
    math: true,
    lineNumbers: true,
    languageAlias: { 'postgresql': 'sql' },
    config: (md) => {
      md.use(mathjax3);
    }
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag)
      }
    }
  },
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
      label: '页面导航',
      level: [2, 4]
    },
    lastUpdated: {
      text: '最后更新于'
    },
    footer: {
      message: '基于 MIT 许可发布',
      copyright: '版权所有 © 2024-至今 Triabin'
    },
    returnToTopLabel: '返回顶部'
  }
})
