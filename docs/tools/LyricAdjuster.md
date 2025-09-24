---
layout: doc
title: 歌词时间轴调整
author: Triabin
icon: arcticons:lrc-editor
tags:
  - 歌词
  - 工具
---

# LRC歌词时间轴调整工具

<script setup>
import LyricAdjuster from '../.vitepress/components/LyricAdjuster.vue';
</script>

<LyricAdjuster hideTitle="true"></LyricAdjuster>

## 关于`.lrc`文件

参考来源：[维基百科：LRC格式](https://zh.wikipedia.org/wiki/LRC%E6%A0%BC%E5%BC%8F)

**LRC**（LyRiCs的缩写）是一种电脑文件格式，可让歌词与音频档案（如 MP3、Vorbis 或 MIDI）同步。在现代的计算机播放器或数字音频播放器播放歌曲时，会从对应的LRC文件中读取歌词并在适当的时机显示。LRC格式是一种文字格式，与电视和电影的字幕档很相似。

### 简易格式

“简易LRC格式”首先在郭祥祥先生（Djohan）的歌词播放器里采用。它是早期试图模拟卡啦OK的程序。

LRC的时间标签的格式为`[mm:ss.xx]`其中`mm`为分钟数、`ss`为秒数、`xx`为百分之一秒。

一般示例：

```
[mm:ss.xx] 第一行歌词
[mm:ss.xx] 第二行歌词
...
[mm:ss.xx] 最后一行歌词
```
ID标签在歌词前可能出现，不过一些播放器可能会忽略它们。

```
[al:本歌所在的唱片集]
[ar:演出者-歌手]
[au:歌词作者-作曲家]
[by:此LRC文件的创建者]
[offset:+/- 以毫秒为单位加快或延後歌词的播放] 
[re:创建此LRC文件的播放器或编辑器]
[ti:歌词(歌曲)的标题]
[ve:程序的版本]
```

ID标签示例：

```
[ti:Let's Twist Again]
[ar:Chubby Checker oppure  Beatles, The]
[au:Written by Kal Mann / Dave Appell, 1961]
[al:Hits Of The 60's - Vol. 2 – Oldies]

[00:12.00]Naku Penda Piya-Naku Taka Piya-Mpenziwe
[00:15.30]Some more lyrics ...
...
```

### 简易格式的扩展

这个功能仅在Walasoft的Walaoke（一个卡啦OK媒体播放器）上可用。这个功能可以使用以下标签设置歌词的性别：**M: 男性**，**F: 女性**，**D: 合唱**。

例如：

```
[00:12.00]第一行歌词
[00:17.20]F: 第二行歌词
[00:21.10]M: 第三行歌词
[00:24.00]第四行歌词
[00:28.25]D: 第五行歌词
[00:29.02]第六行歌词
```

假设男性为蓝色，女性为红色，合唱为粉色。第一行使用默认色（蓝色），因为没有找到标签。第二行歌词以红色开始，因为找到了F:。第三行歌词以蓝色开始，因为找到了M:。第四行歌词以蓝色开始，因为没有找到标签。第五行歌词以粉色开始，因为找到了D:。第六行歌词与第五行相同，为粉色，因为没有找到标签。

### 增强格式（本页面不支持增强格式歌词文件时间轴调整）

“增强LRC格式”是简单LRC格式的一个扩展，由A2 Media Player所开发。它增加了一个额外的时间标签，格式为：**<mm:ss.xx>**.

增强LRC格式示例：

```
[mm:ss.xx] <mm:ss.xx> 第一行第一个词 <mm:ss.xx> 第一行第二个词 <mm:ss.xx> ... 第一行最后一个词 <mm:ss.xx>
[mm:ss.xx] <mm:ss.xx> 第二行第一个词 <mm:ss.xx> 第二行第二个词 <mm:ss.xx> ... 第二行最后一个词 <mm:ss.xx>
...
[mm:ss.xx] <mm:ss.xx> 最后一行第一个词 <mm:ss.xx> 最后一行第二个词 <mm:ss.xx> ...  最后一行最后一个词 <mm:ss.xx>
```
