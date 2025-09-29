import { DefaultTheme } from "vitepress";

const nav:  DefaultTheme.NavItem[] = [
  { text: '首页', link: '/' },
  {
    text: '编程',
    items: [
      { text: '编程通用技术', link: '/coding/common/' },
      { text: 'C/C++', link: '/coding/c-cpp/' },
      { text: 'Java', link: '/coding/java/' },
      { text: 'Python', link: '/coding/python/' },
      { text: '仓颉', link: '/coding/cangjie' },
      { text: '前端', link: '/coding/frontend/' },
    ]
  },
  { text: '文章笔记', link: '/articles/', activeMatch: '/articles/*' },
  { text: '工具集', link: '/tools/', activeMatch: '/tools/*' },
  { text: '收藏网页', link: '/favorites/' },
  { component: 'CardClock' },
];

export default nav;
