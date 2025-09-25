---
layout: page
title: 收藏网页
items:
  - title: 本项目框架
    icon: https://vitepress.dev/vitepress-logo-mini.svg
    url: https://vitepress.dev/zh/
    description: 由 Vite 和 Vue 驱动的静态站点生成器。将 Markdown 变成优雅的文档，只需几分钟。

  - title: LaTeX入门
    icon: /spirit/icons/file-icons--latex.png
    url: /favorites/LaTeX入门/
    description: LaTeX（读作/ˈlɑːtɛx/或/ˈleɪtɛx/）是一个让你的文档看起来更专业的排版系统，它尤其适合处理篇幅较长、结构严谨的文档，并且十分擅长处理公式表达。

  - title: BrowserLeaks
    icon: https://browserleaks.com/favicon.ico
    url: https://browserleaks.com/
    description: 假设世界上不存在两个浏览器环境（包括浏览器版本、操作系统、硬件环境）完全相同，那么可以通过这些差异唯一确定一个环境，从而用来作为浏览器指纹标识一个人。这个网站介绍了浏览器指纹技术！

  - title: JavaGuide
    icon: https://javaguide.cn/logo.png
    url: https://javaguide.cn/
    description: Java学习 + 面试指南」涵盖 Java 程序员需要掌握的核心知识。

  - title: hello-algo
    icon: https://www.hello-algo.com/assets/images/favicon.png
    url: https://github.com/krahets/hello-algo
    description: GitHub仓库，一本对新手学习数据结构与算法非常友好的书籍。

  - title: deprecated-version
    icon: https://roadmap.sh/manifest/favicon.ico
    url: https://github.com/roadmapsh/deprecated-version
    description: GitHub仓库，编程语言学习路线图，每个阶段的学习内容，以及对应的学习资源（不过指向的学习视频都是国外视频平台的）。
  - title: 力扣LeetCode
    icon: https://leetcode.cn/favicon.ico
    url: https://leetcode.cn/
    description: 程序员就不用说这个网站了吧。

  - title: 来自菜鸟教程的http教程
    icon: https://www.runoob.com/favicon.ico
    url: https://www.runoob.com/http/http-tutorial.html
    description: 先放这儿，免得忘了，有空看看。
    
  - title: Z-Library
    icon: /spirit/icons/z-lib.svg
    url: https://www.tboxn.com/sites/320.html
    description: 啥书都有，尤其是课本、技术相关书籍、完结小说等……但是域名不固定，只能通过导航站进入了。
---

<FavoritesPage :items="$frontmatter.items"/>
