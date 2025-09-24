---
title: IntelliJ_IDEA插入时间文本
createTime: 2024/08/09 00:56:21
tags:
  - IDEA
  - 时间
---
# IntelliJ IDEA插入时间文本

**需求：** 在使用IDEA编辑一些文本时，需要插入指定格式的当前时间文本，首先想到的是找找有没有相关的IDEA插件，看到确实有别的猿做过相关的插件，但当时找到的文章是需要下载博主提供的离线插件jar包，而且时间格式是否能灵活自定义还未知，且当时刚好灵光一现，有了别的方法，一个不需要安装插件，而且更加灵活自由的方法，所以没有往下细看。

> 1和2的内容有兴趣了解的可以看看，可以跳过，具体操作在3

## 1. 解决思路

利用IDEA的Live Template（不记得中文翻译叫啥了，好像是叫热加载模板还是啥，后面统一叫预设模板）功能来做，这个设置位于`File | Settings | Editor | Live Templates`，Live Template是IDEA的预设代码模板工具，设定的代码内容可以通过复杂的函数实现动态化注入所需要的包、方法、时间、作者等程序员所想所需的内容模版，IDEA其实已经为我们预设了很多模板，最熟悉的莫过于`sout`了，它默认位于Live Template的Java这个Live Template分组下（如下图）。

**![image-20240809011521923](https://gitee.com/triabin/img_bed/raw/master/2024/08/09/53c843caefef525fad229d5c60c0acaf-image-20240809011521923.png)**

**<font color="red">所以解决思路是：使用IDEA自带的预设模板来定义一些关键字，并在该关键字触发的预设内容中获取当前时间并格式化。</font>**

## 2. 前置知识

**![image-20240809013722512](https://gitee.com/triabin/img_bed/raw/master/2024/08/09/9f8ef784947306a454764b4213f7175b-image-20240809013722512.png)**

还是使用`sout`举例，如上图，我将预设模板的编辑分为7个部分：

* ① 触发关键字，即图中的Abbreviation（缩写）；

* ② 模板注释，每次使用时会在旁边显示；

  **![image-20240809012953552](https://gitee.com/triabin/img_bed/raw/master/2024/08/09/91d4e351d9dae9ada8ed719d24909ee7-image-20240809012953552.png)**

* ③ 模板文本内容；

* ④ 模板文本内容中包含的变量，使用两个`$`符号包裹，中间为变量名，变量是预设模板的核心，它是能动态生成代码内容的主要依仗，变量要插入的内容可以通过一些表达式进行编辑（IDEA一些预设的变量除外，例如图中的`$END$`，它表示模板触发后，光标所处位置）；

* ⑤ 变量编辑模块（找了一个可编辑的变量，如下图），模板变量可编辑的项包括名称，表达式，默认值（当表达式返回为空时的值）以及“如果已定义则跳过”复选框，其中核心项为表达式，这个表达式可以通过IDEA提供的一些函数来返回特定的值，这些函数清单可访问IntelliJ官网查看（[函数清单](https://www.jetbrains.com/help/idea/2024.2/edit-template-variables-dialog.html#predefined_functions)），至于最后一项`Skip if defined`复选框，我目前的英语水平理解的是如果前面的表达式和默认值运行的最终结果不为空，则光标不在这个变量处停留（PS：如果只定义了变量不定义表达式，则光标会在变量处依次停留，这个过程中，预设模板每触发一次，跳到下一个变量处），直接跳到下一个变量处，这几项配置的具体释义可查看[官网](https://www.jetbrains.com/help/idea/2024.2/edit-template-variables-dialog.html#controls)自行翻译；

  **![image-20240809014108508](https://gitee.com/triabin/img_bed/raw/master/2024/08/09/6ee0fbeba0db745f5e0092b0d2bbe49f-image-20240809014108508.png)**

* ⑥ 触发这个预设模板的按键，默认为回车键，由图可知，还可以配置制表符键和空格键（None配置成这个目前还不知道有啥意义，配置成这个就只能用鼠标点击触发了）；

* ⑦ 配置这个模板生效的语言代码区域，可以为各种语言单独配置

  **![image-20240809015622825](https://gitee.com/triabin/img_bed/raw/master/2024/08/09/404dcdd6ebb45e6c7e7de82386cb06b2-image-20240809015622825.png)**

## 3. 实操

本次主要用到2个IDEA提供的函数，`date([format])`和`time([format])`：

| 函数             | 功能介绍                                                     |
| ---------------- | ------------------------------------------------------------ |
| `time([format])` | Returns the current system time.<br/>By default, without a parameter, it returns the time in the current system format. To use a different format, provide a parameter according to the [SimpleDateFormat](https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html) specification. For example, the `time("H:m z")` returns the time formatted as `13:10 UTC`. |
| `date([format])` | Returns the current system date.<br/>By default, without a parameter, it returns the date in the current system format. To use a different format, provide a parameter according to the [SimpleDateFormat](https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html) specification. For example, the `date("Y-MM-d, E, H:m")` returns the date formatted as `2020-02-27, Thu, 16:11`. |

① 进入IDEA`File | Settings | Editor | Live Templates`，点击左上角`+`号，选择创建Template Group（模板组），命名为`InertTime`（看个人喜好）

**![image-20240809020011760](https://gitee.com/triabin/img_bed/raw/master/2024/08/09/6a21dee3d4f182910aa53f93a0f2b0f1-image-20240809020011760.png)**

② 选中新建的模板组，点击左上角`+`号，选择创建Live Template（预设模板），触发关键字为`curt`（current time，看个人喜好😀），注释为`当前时间：yyyy-MM-dd HH:mm:ss`，输入模板内容为`$datetime$`，编辑变量，表达式设置为`date("yyyy-MM-dd HH:mm:ss")`，设置其应用范围为Everywhere，打开IDEA任意文件，验证。

**![PixPin_2024-08-09_02-16-24](https://gitee.com/triabin/img_bed/raw/master/2024/08/09/889390a62db1c5d613dbb85eab4d63af-PixPin_2024-08-09_02-16-24.gif)**

③ 流程基本相同，我又根据目前我遇到的能穷举的需求，创建了如下模板：

| 关键字 | 注释                                       | 模板内容      | 变量表达式                           |
| ------ | ------------------------------------------ | ------------- | ------------------------------------ |
| curdt1 | `当前日期时间：yyyy-MM-dd HH:mm:ss`        | `$datetime1$` | `date("yyyy-MM-dd HH:mm:ss")`        |
| curdt2 | `当前日期时间：yyyy-M-d H:m:s`             | `$datetime2$` | `date("yyyy-M-d H:m:s")`             |
| curdt3 | `当前日期时间：yyyy年MM月dd日HH时mm分ss秒` | `$datetime3$` | `date("yyyy年MM月dd日HH时mm分ss秒")` |
| curdt4 | `当前日期时间：yyyy年M月d日H时m分s秒`      | `$datetime4$` | `date("yyyy年M月d日H时m分s秒")`      |
| curdt5 | `当前日期时间：yyyy/MM/dd HH:mm`           | `$datetime5$` | `date("yyyy/MM/dd HH:mm")`           |
| curdt6 | `当前日期时间：yyyy/M/d H:m`               | `$datetime6$` | `date("yyyy/M/d H:m")`               |
| currd1 | `当前日期：yyyy-MM-dd`                     | `$date1$`     | `date("yyyy-MM-dd")`                 |
| currd2 | `当前日期：yyyy-M-d`                       | `$date2$`     | `date("yyyy-M-d")`                   |
| currd3 | `当前日期：yyyy/MM/dd`                     | `$date3$`     | `date("yyyy/MM/dd")`                 |
| currd4 | `当前日期：yyyy/M/d`                       | `$date4$`     | `date("yyyy/M/d")`                   |
| currt1 | `当前时间：HH:mm:ss`                       | `$time1$`     | `time("HH:mm:ss")`                   |
| currt2 | `当前时间：H:m:s`                          | `$time2$`     | `time("H:m:s")`                      |

> <font color="red">说明：</font>
>
> 1. `yyyy-MM-dd HH:mm:ss`与`yy-M-d H:m:s`区别。
>
>    yyyy与yy的区别：yy格式化后只保留年份后两位；
>
>    月、日、时、分、秒区别：只有一个字母的格式当数字小于10时，数字只有1位数，两个字母则会用0补齐两位数。
>
>    具体格式化规则参见：[SimpleDateFormat](https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html)。
>
> 2. 表中均为24小时制，如果要使用12小时制，可以将`H`改为小写的`h`。
>
> 3. 如果要插入毫秒，则在时间格式化表达式中加入大写的`S`，即可格式化为毫秒（btw：加入小写的`z`可以格式化为时区，加入大写的`E`可插入英文简写的星期）。

最后：以上为我目前的需求所能用到的时间格式，若还需要其他格式，可以根据规则再行添加。

## 4. 扩展：使用搜狗输入法实现

几乎所有的输入法都有一个自定义短语的功能，例如在中文时，打出`alpha`，候选词中一般会出现`α`，打出`pi`，会出现`π`，这些都是官方在提供输入法时内置的一些短语，这些候选词都可以通过自定义短语进行增删。

这个自定义短语功能的短语内容中支持许多函数，这些函数包含了获取当前时间的函数，搜狗输入法原配置文件中的说明如下（版本号：14.8.0.9942）：

**![image-20250103131631007](https://gitee.com/triabin/img_bed/raw/master/2025/01/03/64d433957b8655b7d69406e2c04302cc-image-20250103131631007.png)**

**实现步骤：** 右键单击搜狗输入法指示器，依次进入`更多设置 | 属性设置 | 高级 | 候选扩展 | 自定义短语(打开) | 自定义短语设置 | 直接编辑配置文件`，打开文件后，在文件末尾追加如下内容：

```
crudt,1=#$year-$month_mm-$day_dd $fullhour_hh:$minute:$second
```

