---
title: Java
description: Java学习笔记与文档
---

## 学习路线图

## 配置Java运行环境

### 安装前准备

*[不需要知道这些，直接开始操作](#安装包下载)*

#### 版本选取与说明

* 大版本上，现在绝大部分公司内部使用的都是jdk8的版本，少部分改造成本过高或者没有改造必要的老项目亦或者对使用的JDK版本做了一些修改的项目使用jdk6，其他版本暂时没听说，这主要原因是因为jdk8是目前使用最广泛，所需功能也较为齐全并且还未商用的版本。

* 小版本上，一向奉行的原则是用单不用双，因为双数结尾的版本中一般包含了未经推出的新特性，这些新特性经过双数版本一段时间的使用后一般会在下一个版本中放出稳定版本，所以商用最好使用双数结尾的版本。

* 然后是注意 **<font color="red">jdk8免费版本只到`jdk-8u202`，从`jdk-8u211`版本开始商用的，如果要避免版权问题，需要注意这个界限</font>** 。详见[Oracle官网](https://www.oracle.com/java/technologies/javase/javase8u211-later-archive-downloads.html)：

  **![image-20250103164056026](https://gitee.com/triabin/img_bed/raw/master/2025/01/03/075d8ee7f9da0817589c06ee173f17e2-image-20250103164056026.png)**

* 关于OpenJDK和OracleJDK区别，2006年，SUN公司将Java开源，因此有了[OpenJDK](https://github.com/openjdk/jdk)，到2009年，Oracle收购了SUN公司，此时JDK版本发展到1.6，Oracle刚接手JDK，没有直接将其变为收费版本（那可能会引起开发者和客户反感从而丧失市场），于是Oracle没有动OpenJDK，而是在其基础上搞了一个OracleJDK，这个版本的JDK会比OpenJDK多一些小工具，OracleJDK是不开源的但是继续免费使用，为以后的收费做准备。我们在各种教程中也好，平时开发也好，一般所使用的版本就是OracleJDK，Oracle接手后发布的第一个版本是jdk7，此时的OracleJDK7和OpenJDK7差别不大。在许多Linux系统中（例如Ubuntu、银河麒麟等），默认JDK版本都是OpenJDK，这与开发时所使用的OracleJDK有一定区别，**<font color="red">我曾在国内某银行的POC过程中遇到过因为OpenJDK与OracleJDK差异导致的接口性能下降和报错问题，致使POC差点失败，因此如果作为乙方开发者，一定要事先与甲方约定明确生产环境。</font>**


#### 安装包下载

[官网地址，点击跳转](https://www.oracle.com/java/technologies/downloads/archive/)，或者到[Java版本变更表](#java版本变更表)中点击对应版本直接跳转（jdk1的找不到）。也可直接下载我的版本jdk，版本为`jdk-8u201`，如无特殊需求，之后我所有教程中所使用的jdk版本均为此版本（商用前最后一个小版本号为奇数的版本）：

* 百度网盘

  [点击跳转百度网盘](https://pan.baidu.com/s/1M-xBlwxpg3BSzjGb9eYIyg?pwd=kkfm)，或复制链接及提取码：https://pan.baidu.com/s/1M-xBlwxpg3BSzjGb9eYIyg?pwd=kkfm 提取码: kkfm

* 123网盘

  [点击下载](https://www.123684.com/s/VBJ0Td-Zwwt?提取码:gIa9)或复制链接及提取码：https://www.123684.com/s/VBJ0Td-Zwwt?提取码:gIa9

> 我提供的安装包中包含了Windows x64版本（包括.exe和原文件压缩包），Linux x64压缩包版以及Mac OS X x64的.dmg版本。
>
> 官网的下载页面除了JDK（Java SE Development Kit，即Java标准版开发工具包）的下载，还包含了JRE（Java SE Runtime Environment，即Java标准版运行时环境）的下载，只需下载JDK即可，关于JDK和JRE的区别，容后详禀，总之JRE包含在JDK里面，所以无需再去下载。
>
> 注意进入官网后不要切为中文，切为中文后，一些安装包不一定能正常显示。

::: warning Oracle账号问题

在Oracle官网下载时会要求登录官网，如果自己注册，又需要填写个人及公司各种信息，这时候就需要万能的网友了。

用前声明，此方法仅限于个人使用，公司中请直接找公司内部要相应版本，下载内容仅限个人学习使用，请于24小时后删除（狗头保命🙃

直接上网搜索“Oracle账号”，然后依次点击搜索框下的`工具 | 时间 | 过去1年内`（百度类似），逐个查看搜索结果，一般都有网友分享的公益账号，礼貌使用，用后及时注销。

**![image-20250103184500905](https://gitee.com/triabin/img_bed/raw/master/2025/01/03/8aa92cf1a5dbb13b2c58a552b61e7641-image-20250103184500905.png)**

:::

### Linux系统安装（以Ubuntu为例）

1、解压压缩包

```shell
# 将文件解压到/usr/lib/jvm目录（如果只为当前用户安装，也可解压到~/jdk或~/.local/jdk）
tar -xzf jdk-8u201-linux-x64.tar.gz -C /usr/lib/jvm
```

> 如果`/usr/lib/jvm`目录不存在，则先创建目录。

2、配置环境变量：

* 只为当前用户配置环境变量

  在文件`~/.bashrc`文件中追加或修改以下内容：

  ```bash
  # 设置 JAVA_HOME
  export JAVA_HOME="/usr/lib/jvm/jdk1.8.0_201"
  export PATH="$JAVA_HOME/bin:$PATH"
  ```

  保存并退出，然后重新登录当前用户或者运行`source ~/.profile`命令，使配置生效。

  > `~/.bashrc`中的每一行命令会在当前用户登录后执行

* 为本系统中所有用户配置环境变量

  ① 通过`/etc/environment`文件配置（不太推荐）

  编辑`/etc/environment`，对文件作如下修改：

  ```bash
  PATH="/usr/lib/jvm/jdk1.8.0_201/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
  ```
  
  保存并退出，运行`source /etc/environment`命令，使配置生效。
  
  ::: warning 警告
  
  不太推荐这种方式，这种方式一旦设置失败，会导致整个系统环境变量设置失败，届时所有常规命令都会失效无法使用，比较麻烦，不好修改。
  
  ```shell
  # Tips：当整个系统的环境变量设置失败导致几乎所有命令都无法使用时，可运行以下命令临时恢复编辑等命令修改配置文件
  export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
  ```
  
  :::
  
  ② 通过`/etc/profile.d/`进行配置（推荐）
  
  在`/etc/profile.d/`目录下创建一个脚本文件（命名为`setup_env.sh`或者`setup_jdk.sh`，名称无所谓），文件中添加以下内容：
  
  ```bash
  # 设置 JAVA_HOME
  export JAVA_HOME="/usr/lib/jvm/jdk1.8.0_201"
  export PATH="$JAVA_HOME/bin:$PATH"
  ```
  
  保存后给文件赋予可执行权限：
  
  ```bash
  chmod +x 脚本文件名
  ```
  
  重启 Shell 或系统，使配置生效。
  
  > Linux系统每次启动都会执行一遍`/etc/profile.d`目录下的所有脚本。

3、验证

验证环境变量：

```bash
echo $JAVA_HOME
echo $PATH
# 两条命令分别可以看到设置的两个环境变量是否生效。
```

验证Java命令：

```bash
java -version
javac -version
# 验证Java和Java编译器版本是否生效
```

样例：

**![image-20250105120822830](https://gitee.com/triabin/img_bed/raw/master/2025/01/05/b5e113b8dfadeaa396807267d43a0eb2-image-20250105120822830.png)**

### Windows系统安装（以Win11为例）

1、使用.exe程序安装，下载好后，直接双击`jdk-8u201-windows-x64.exe`文件，选择好安装位置，按照正常程序安装即可。

2、使用压缩包安装

* 将下载好的压缩包解压到合适位置（这里我解压到`D:\DevEnvironment\JDK\jdk1.8.0_201`），然后按`Win+S`呼出搜索框，搜索“编辑系统环境变量”，点击后在打开的窗口中点击环境变量进行编辑。

  **![image-20250105122019984](https://gitee.com/triabin/img_bed/raw/master/2025/01/05/5187f9bedfac8e429fccbdfda4d73f3c-image-20250105122019984.png)**

  * 同理，如果只为当前用户配置环境变量，就在“xxx的用户变量”那一栏配置即可，如果是为这个系统中的所有人配置环境变量，就在“系统变量”一栏配置。先新建变量，命名为`JAVA_HOME`，变量值为上一步骤中的jdk压缩包解压位置，然后在变量中找到Path，双击进入后，点击新建，添加两个路径，分别为`%JAVA_HOME%\bin`和`JAVA_HOME\jre\bin`。再在变量`CLASSPATH`中添加`.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar`，注意前面的`.`代表当前目录，表示`java`命令会在当前目录下寻找class文件。

  **![image-20250105122710536](https://gitee.com/triabin/img_bed/raw/master/2025/01/05/6f6e4aa9ea64566c7a2756276622dd6c-image-20250105122710536.png)**

  

3、验证

`Win+R`，然后输入cmd（或者直接搜索命令提示符也行），回车打开命令行输入窗口，分别验证变量配置结果和Java环境配置结果：

```bash
# 验证变量配置结果
echo %JAVA_HOME%

# 验证Java和Java编译器
java -version
javac -version
```

示例：

**![image-20250105123619594](https://gitee.com/triabin/img_bed/raw/master/2025/01/05/6ab97fcd49847c3727eb371dfc5a66d9-image-20250105123619594.png)**

> 其实无论是使用.exe文件还是压缩包自己配置，两种方式背后所做的事情都差不多，但是 **如果电脑中有多个jdk版本，那么为了方便管理，推荐使用压缩包解压，然后自己手动配置环境变量**，按照上述压缩包安装的方式进行配置的方式，如果需要更换jdk版本时，只需要修改环境变量`JAVA_HOME`的值即可。

::: info 小Tip

Windows和Linux系统命令行窗口中输入命令时，它首先会在当前目录下寻找`输入的命令.exe`，如果找不到，则会到`Path`中配置的路径下一个一个的找，直到找到为止，所以如果是常用的命令，可以适当将其在Path中的位置往前挪动。

:::

### 第一个Java程序

Java运行环境安装完成后，按照编程语言学习的惯例，需要跑一遍“Hello World”代码用以验证环境配置结果。

首先创建一个名为`HelloWorld.java`的文件，在文件中输入以下内容：

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello Java!");
    }
}
```

::: danger 注意

Windows系统中，可能需要打开文件扩展名显示（如果没开），避免出错，打开方式：打开资源管理器，依次点击`查看 | 显示 | 勾选文件扩展名`。

这项设置不打开的本意是避免不懂扩展名作用的人误操作修改了文件扩展名，导致文件打不开，但是都学习编程了，这项设置就别想着关闭了🙃。

:::

然后打开命令行，使用`javac`命令对`HelloWorld.java`文件进行编译，编译后得到字节码文件`HelloWorld.class`

```bash
javac HelloWorld.java
```

之后再使用`java`命令运行编译得到的`HelloWorld.class`文件

```bash
java HelloWorld # .class可以省略
```

运行后再控制台上打印“Hello Java!”即证明环境配置成功。

**![image-20250105131503648](https://gitee.com/triabin/img_bed/raw/master/2025/01/05/bb9d5d56fbccfcd7cd4cdd4eade6fc61-image-20250105131503648.png)**

## Java几个基础命令使用与讲解（重要）

说明：命令行示例中，使用`[]`括起来的部分意为非必填，没有括起来则意为必填。

### javac命令详解

`javac [ options ] [ sourcefiles ] [ @files ]`

作用：用于将.java文件编译为JVM可识别的字节码文件（.class）。

参数顺序可任意排列

* `options`：命令行选项，可以指定输出目标目录、字符集等
* `sourcefiles`：一个或多个要编译的源文件（.java文件），支持多个文件（用空格分隔或者使用“*”号模糊匹配）
* `@files`：一个或多个对源文件进行列表的文件，文件中存放的是要编译的java文件路径，文件之间使用换行符分隔（每行一个）

一般用法：

```bash
javac Xxx.java # 直接编译，编译后的.class文件放到源文件所在目录下

javac Xxx.java -d 编译后文件输出路径 # 编译源文件，并将.class文件放到“-d”参数后面指定的目标路径中

javac Xxx.java -encoding 字符集名称 # 编译源文件，并指定编码格式

javac @xxx.txt # 编译xxx.txt文件中列出的.java文件所有，每行一个文件
```

### java命令详解

`java [options] class [args...]`

作用：运行Java应用程序。

参数顺序可任意排列

* `options`：Java命令提供了多个选项来控制Java虚拟机和应用程序的行为，可以使用`java -help`查看所有选项即说明，以下是一些常见的选项：

  ① `-classpath path`：指定Java虚拟机应该搜索类文件的路径，与`javac`编译选项的`-cp`相同

  ② `-Xmx size`：指定堆内存大小的最大值，以字节为单位，例如，`xXmx1024m`表示堆内存大小最大值为1024MB

  ③ `-Xms size`：指定初始堆内存大小，以字节为单位

  ④ `-version`：查看Java版本信息

  ⑤ `-jar file`：执行指定的.jar文件

  ⑥ `-Dproperty=value`：设置系统属性，`property`为属性名，`value`为属性值

* `class`：要运行的Java类名（`.class`可以省略）

* `args`：传递给主方法的参数，这些参数将作为字符串数组传递给`main()`方法，参数间使用空格分隔

### jps命令详解

`jps [options]`

作用：查看当前系统中正在运行的Java程序，并获取它们的进程ID，是查询Java进程非常简单实用的一个命令。

* `options`：jps提供了多个选项来控制输出的内容和格式（可使用`jps -help`查看所有选项），以下是一些常见选项：

  ① `-q`：只显示进程ID，不显示JVM名称

  ② `-m`：显示启动时传递给主类的参数

  ③ `-l`：显示主类的全类名以及传递给主类的参数

  ④ `-v`：显示JVM启动时的命令行信息

  ⑤ `-V`：显示jps版本信息

### jconsole命令详解

`jconsole [optionally, hostname:port or service:jmx:rmi:///…]`

作用：jconsole是JDK自带的图形化监视工具，它提供了一个友好的用户界面，用于可视化地监控和管理Java应用程序，可以实时显示Java应用程序的性能指标、内存使用情况、线程状态等信息，还可以远程监控。

**![image-20250213005419396](https://gitee.com/triabin/img_bed/raw/master/2025/02/13/624855acb832f3823c6cf71930d0b619-image-20250213005419396.png)**

* `optionally, hostname:port or service:jmx:rmi:///…`：可选参数，用于连接到要监控的Java进程。如果忽略此参数，则会打开一个对话框，允许您选择要监视的进程。

使用jconsole命令可以启动Java虚拟机（JVM），并以图形化的方式监视JVM的运行状况。图形界面中提供了各种监视面板，展示当前JVM的CPU使用率、内存使用情况、GC状态等，同时可以查看线程、类、MBean等信息。除此之外，jconsole还提供了常规操作管理Java应用程序的功能，例如观察垃圾回收、查看堆内存使用情况、分析线程的执行情况等。此外，如要添加可扩展性，则可使用MBean控制进一步管理应用程序。jconsole是一种功能齐全、简单易用的监控工具，能够帮助开发团队及时发现并解决Java应用程序中的性能问题。

### jstack命令详解

`jstack [options] pid`

作用：jstack命令用于查看Java应用程序的线程信息和调用栈信息。它通常用于分析Java进程出现卡死、死锁等问题时定位问题原因。（能看到线程当前状态`NEW | RUNNABLE | BLOCKED | WAITING | TIMED_WAITING | TERMINATED`）

* `options`：选项，以下是一些常用选项：

  ① `-F`：当普通输出方式已经失效时，强制输出线程堆栈信息

  ② `-l`：风险较高，除了统计信息外，还会打印关于每个线程的锁和监视器

  ③ `-m`：会显示每个线程占用的内存情况

  ④ `-h`：显示命令帮助

  ⑤ `-J`：直接传递给JVM参数

## 附录

### Java版本变更表

| JDK版本                                                      | 名称                 | 发布时间   | 新特性                                                       |
| :----------------------------------------------------------- | -------------------- | ---------- | ------------------------------------------------------------ |
| 1                                                            | Oka（橡树）          | 1996/1/23  |                                                              |
| [1.1](https://www.oracle.com/java/technologies/java-archive-downloads-javase11-downloads.html) |                      | 1997/2/19  |                                                              |
| [1.2](https://www.oracle.com/java/technologies/java-archive-javase-v12-downloads.html) | Playground（运动场） | 1998/12/4  |                                                              |
| [1.3](https://www.oracle.com/java/technologies/java-archive-javase-v13-downloads.html) | Kestrel（美洲红隼）  | 2000/5/8   |                                                              |
| [1.4.0](https://www.oracle.com/java/technologies/java-archive-javase-v14-downloads.html) | Merlin（灰背隼）     | 2002/2/13  | 1、正则表达式<br />2、异常链<br />3、NIO<br />4、日志类<br />5、XML解析器<br />6、XLST转换器 |
| [Java SE 5.0 / 1.5](https://www.oracle.com/java/technologies/java-archive-javase5-downloads.html) | Tiger（老虎）        | 2004/9/30  | 1、自动装箱<br />2、泛型<br />3、动态注解<br />4、枚举<br />5、可变长参数<br />6、遍历循环 |
| [Java SE 6.0 / 1.6](https://www.oracle.com/java/technologies/javase-java-archive-javase6-downloads.html) | Mustang（野马）      | 2006/4     | 1、提供动态语言支持<br />2、提供编译API和卫星HTTP服务器API<br />3、改进JVM的锁，同步垃圾回收，类加载 |
| [Java SE 7.0 / 1.7](https://www.oracle.com/java/technologies/javase/javase7-archive-downloads.html) | Dolphin（海豚）      | 2011/7/28  | 1、提供GI收集器<br />2、加强对非Java语言的调用支持<br />3、升级类加载架构 |
| [Java SE 8.0（8u202 and earlier）](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html) | Spider（蜘蛛）       | 2014/3/18  | 1、Lambda 表达式<br />2、方法引用、默认方法、新工具<br />3、Stream API、Date Time API 、Optional 类<br />4、Nashorn, JavaScript 引擎 |
| [Java SE 8.0（8u211 and later）LTS](https://www.oracle.com/java/technologies/javase/javase8u211-later-archive-downloads.html) | Spider（蜘蛛）       | -          |                                                              |
| [Java SE 9.0](https://www.oracle.com/java/technologies/javase/javase9-archive-downloads.html) |                      | 2017/9/21  | 1、集合加强、I/O流加强<br />2、私有接口方法<br />3、垃圾收集机制<br />4、JShell工具 |
| [Java SE 10.0](https://www.oracle.com/java/technologies/java-archive-javase10-downloads.html) |                      | 2018/3/21  | 1、局部变量类型推断<br />2、线程本地握手<br />3、GC改进和内存管理 |
| [Java SE 11.0 LTS](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html) |                      | 2018/9/25  | 1、字符串加强<br />2、HttClient Api<br />3、用于 Lambda 参数的局部变量语法<br />4、ZGC |
| [Java SE 12.0](https://www.oracle.com/java/technologies/javase/jdk12-archive-downloads.html) |                      | 2019/2/7   | 1、Switch Expressions<br />2、Shenandoah GC                  |
| [Java SE 13.0](https://www.oracle.com/java/technologies/javase/jdk13-archive-downloads.html) |                      | 2019/9/26  | 1、switch优化更新<br />2、文本块升级<br />3、重新实现旧版套接字API<br />4、核心库/java.util中：I18N<br />5、取消使用未使用的内存 |
| [Java SE 14.0](https://www.oracle.com/java/technologies/javase/jdk14-archive-downloads.html) |                      | 2020/3/17  | 1、switch优化变更为最终版<br />2、垃圾回收相关<br />3、instanceof的模式匹配（预览版）<br />4、删除了安全库java.security.acl API<br />5、货币格式（优化） |
| [Java SE 15.0](https://www.oracle.com/java/technologies/javase/jdk15-archive-downloads.html) |                      | 2020/9/15  | 1、EdDSA 数字签名算法<br />2、Sealed Classes（封闭类，预览）<br />3、Hidden Classes（隐藏类）<br />4、移除 Nashorn JavaScript引擎<br />5、改进`java.net.DatagramSocket`和`java.net.MulticastSocket`底层实现 |
| [Java SE 16.0](https://www.oracle.com/java/technologies/javase/jdk16-archive-downloads.html) |                      | 2021/3/16  | 1、允许在JDK C++源代码中使用C++ 14功能<br />2、ZGC性能优化，去掉ZGC线程堆栈处理从安全点到并发阶段<br/>3、增加Unix域套接字通道弹性元空间能力<br/>4、提供用于打包独立Java应用程序的jpackage工具 |
| [Java SE 17.0 LTS](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) |                      | 2021/9/14  | 1、Oracle JDK 可以免费用于生产环境<br />2、JDK 17 将取代 JDK 11 成为下一个长期支持版本<br />3、Spring 6 和 Spring Boot 3需要JDK17<br />4、移除实验性的 AOT 和 JIT 编译器<br />5、恢复始终执行严格模式 (Always-Strict) 的浮点定义<br />6、正式引入密封类sealed class，限制抽象类的实现<br />7、统一日志异步刷新，先将日志写入缓存，然后再异步刷新 |
| [Java SE 18.0](https://www.oracle.com/java/technologies/javase/jdk18-archive-downloads.html) |                      | 2022/4/19  | 1、指定 UTF-8 作为标准 Java API 的默认字符集<br />2、引入一个简单的 Web 服务器<br />3、支持在 Java API 文档中加入代码片段<br />4、用方法句柄重新实现核心反射<br />5、Vector API(第三孵化器)<br />6、互联网地址解析 SPI<br />7、外部函数和内存 API(第二孵化器)<br />8、switch 模式匹配表达式<br />9、弃用 Finalization 功能 |
| [Java SE 19.0](https://www.oracle.com/java/technologies/javase/jdk19-archive-downloads.html) |                      | 2022/10/18 | 1、结构化并发<br />2、记录模式，这一功能目前也处于预览版，主要是用来解构记录值<br />3、外部函数和内存 API 的预览版<br />4、虚拟线程的预览版<br />5、对 switch 表达式和语句的模式匹配进行了第三次预览<br />6、Vector API 的第四次孵化<br />7、通过 Linux/RISC-V 移植，目前这一功能已正式可用 |
| [Java SE 20.0](https://www.oracle.com/java/technologies/javase/jdk20-archive-downloads.html) |                      | 2023/3/21  | 1、作用域值（孵化器）<br/>2、Record 模式匹配（第二次预览）<br/>3、switch 的模式匹配（第四次预览）<br/>4、外部函数和内存 API（第二个预览版）<br/>5、虚拟线程（第二个预览版）<br/>6、结构化并发（第二孵化器）<br/>7、Vector API（第五孵化器） |
| [Java SE 21.0 LTS](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html) |                      | 2023/9/19  | 1、引入序列集合<br />2、分代 ZGC<br />3、记录模式<br />4、switch 模式匹配<br />5、虚拟线程<br />6、弃用Windows 32位x86移植，并打算在将来的版本中将其删除<br />7、准备禁止动态加载代理<br />8、密钥封装机制 API<br />9、字符串模板（预览）<br />10、外部函数和内存 API（第三次预览）<br />11、未命名模式和变量（预览）<br />12、未命名类和实例主方法（预览）<br />13、作用域值（预览）<br />14、结构化并发（预览）<br />15、Vector API（孵化器第六阶段） |
| [Java SE 22.0](https://www.oracle.com/java/technologies/javase/jdk22-archive-downloads.html) |                      | 2024/3/19  | 1、G1 垃圾收集器区域固定<br />2、外部函数和内存 API<br />3、未命名模式和变量<br />4、启动多文件源代码程序 |
| [Java SE 23.0](https://www.oracle.com/java/technologies/javase/jdk23-archive-downloads.html) |                      | 2024/9/17  | 1、模式中的原始类型、instanceof 和 switch（预览）<br />2、类文件 API（第二次预览）<br />3、Markdown 文档注释<br />4、向量 API（第八次孵化）<br />5、流收集器（第二次预览）<br />6、弃用`sun.misc.Unsafe`中的内存访问方法<br />7、ZGC：默认的分代模式<br />8、模块导入声明 (预览)<br />9、未命名类和实例 main 方法 （第三次预览）<br />10、结构化并发 （第三次预览）<br />11、作用域值 （第三次预览）<br />12、灵活的构造函数体（第二次预览） |
