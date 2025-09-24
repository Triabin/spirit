---
title: Markdown语法技巧
tags:
  - markdown
  - 语法
---
# Markdown语法技巧

## 1、图片

图片语法：`[alt内容](img_url)`

也可以直接用img标签：`<img src="img_url" alt="提示内容"/>`

### 图片左对齐问题

一种方式是直接给Markdown的图片语法使用加粗语法，但是当图片需要缩放时，就需要使用img标签：`<img src="img_url" style="zoom:图片缩放百分比;" align="left"/>`，align也可以直接在style中使用float: left。

问题描述：当使用zoom进行缩放后，渲染结果中，文字环绕会与图片同行。

解决：在图片后面添加一个标签`<div style="clear: both;"></div>`，即可将文字换行，避免环绕。

## 2、目录

来源：[GitHub Markdown Tutorial](https://github.com/shengcaishizhan/GitHub_Markdown_Tutorial)

1. 基础使用

   标题语法：`# 标题`

   对应的目录语法：`[标题](#标题)`

2. 特殊字符处理

   `[]`中的内容无所谓，但是`()`中的内容需要对特殊字符作处理

   * `()`中，如果标题有空格，需要将空格替换成`-`
   * `()`中，如果有其他特殊字符，需要将那些特殊字符直接删掉



