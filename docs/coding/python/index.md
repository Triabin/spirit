---
title: Python
description: Python学习笔记与文档
date: 2025-11-07 19:25:50
---

# Python学习笔记与文档

## 1、安装

官网为：https://www.python.org/downloads/

下载对应版本，正常安装即可，常规的配置环境变量即可。

Python包管理工具为pip，所以除了配置python环境变量外，还需要配置pip的环境变量。

一般Linux、macOS都会自带python，如果python命令不生效，可以尝试python3命令，都无效或者对版本有特殊要求再去安装配置指定版本。

::: info Tips
如果在macOS/Linux中，默认命令为python3，可以考虑在shell配置文件中配置别名以便使用python命令，pip3同理。
```shell
alias python=python3
alias pip=pip3
alias py=python3
```

使用这种方式进行配置可以在不破坏系统自带命令版本配置的情况下实现python命令的改动，方便变动以及其他使用。
:::
