---
title: 正则表达式（Java）
createTime: 2024/11/25 15:01:40
tags:
  - Regex
  - 正则
  - Java
---
# 正则表达式（Java）

## 概念

* 正则表达式：regular expression => regex/RegExp/regExp，是对字符串执行模式匹配的技术

## 底层原理

### 匹配规则

* 使用

  ```java
  @Test
  public void test() {
      // TestContent
      String content = "1998年12月8日，第二代Java平台的企业版J2EE发布。1999年6月，Sun公司发布了第二代Java平台（简称为Java2）的3个版本：J2ME（Java2 Micro Edition，Java2平台的微型版），应用于移动、无线及有限资源的环境；J2SE（Java 2 Standard Edition，Java 2平台的标准版），应用于桌面环境；J2EE（Java 2Enterprise Edition，Java 2平台的企业版），应用于基于Java的应用服务器。Java 2平台的发布，是Java发展过程中最重要的一个里程碑，标志着Java的应用开始普及。";
      String regex = "\\d\\d\\d\\d";
      Pattern pattern = Pattern.compile(regex);
      Matcher matcher = pattern.matcher(content);
      while (matcher.find()) {
          System.out.println(matcher.group());
      }
  }
  ```

* 执行过程（原理）

    1. 执行matcher.find()方法时，根据指定正则遍历字符串的Character[]数组，找到（定位）符合规则的字串；
    2. 将匹配到的符合正则的子串索引记录到matcher对象的int[] groups数组，`起始索引`记录到groups[0]，`结束索引+1`记录到groups[1]；
    3. 将oldLast的值同步更新为`结束索引+1`，以便下次执行find()方法时从oldLast开始匹配。

### 分组

* 使用：使用小括号

  ```java
  @Test
  public void test() {
      // TestContent
      String content = "1998年12月8日，第二代Java平台的企业版J2EE发布。1999年6月，Sun公司发布了第二代Java平台（简称为Java2）的3个版本：J2ME（Java2 Micro Edition，Java2平台的"
          + "微型版），应用于移动、无线及有限资源的环境；J2SE（Java 2 Standard Edition，Java 2平台的标准版），应用于桌面环境；J2EE（Java 2Enterprise Edition，Java 2平台的"
          + "企业版），应用于基于Java的应用服务器。Java 2平台的发布，是Java发展过程中最重要的一个里程碑，标志着Java的应用开始普及。9889";
      String regex = "(\\d\\d)(\\d\\d)";
      Pattern pattern = Pattern.compile(regex);
      Matcher matcher = pattern.matcher(content);
      while (matcher.find()) {
          System.out.print("匹配到：" + matcher.group()); // 或matcher.group(0)
          System.out.print("，第一组：" + matcher.group(1));
          System.out.println("，第二组：" + matcher.group(2));
      }
  }
  ```

  **![image-20240807114235918](https://gitee.com/triabin/img_bed/raw/master/2024/08/07/c1b602a2914fdd2c9540aa80b242b022-image-20240807114235918.png)**

* 执行过程（原理）

    1. 执行matcher.find()方法时，根据指定正则遍历字符串的Character[]数组，找到（定位）符合规则的字串；

    2. 将匹配到的符合正则的子串索引记录到matcher对象的int[] groups数组，例如示例中的`(\\d\\d)(\\d\\d)`，一个小括号为一个分组

       2.1 groups[0]=`子串起始索引`，groups[1]=`子串结束索引+1`

       2.2 groups[2]=`组1起始索引`，groups[3]=`组1结束索引+1`

       2.3 groups[4]=`组2起始索引`，groups[5]=`组2结束索引+1`

       ……

    3. 将oldLast的值同步更新为`结束索引+1`，以便下次执行find()方法时从oldLast开始匹配。

## 元字符（Matacharacter）

### 转义符

* 转义符（\\\\），使用正则检索某些特殊字符（本身在正则表达式中有特殊含义的字符），需要用转义符进行转义，避免解释为其正则表达式中的特殊含义。

  Tips：其他语言中（非Java），转义符为`\`

* 需要用到转义符的字符：`.*+()$/\?[]^{}`

### 字符匹配符

| 符号  | 含义                                                | 示例               | 解释                                                  |
| ----- | --------------------------------------------------- |------------------| ----------------------------------------------------- |
| \[]    | 可接收的字符列表                                    | [efgh]           | 匹配e，f，g，h中任意一个字符                          |
| \[^]   | 不接受的字符列表                                    | [^abc]           | 除a，b，c意外的任意字符                               |
| -     | 连字符                                              | A-Z              | 任意大写字母                                          |
| .     | 匹配除了\\n以外的任意字符                           | a..b             | 以a开头，b结尾，中间包括两个任意字符的字符串          |
| \\\\d | 匹配单个数字字符，[0-9]                             | `\\\\d{3}(\\\\d)?` | 包含3个或4个数字的字符串                              |
| \\\\D | 匹配单个非数字字符，\[^0-9]                         | `\\\\D(\\\\d)*`    | 以单个非数字字符开头，后接任意个数数字的字符串        |
| \\\\w | 匹配单个字母、数字、下划线，\[a-zA-Z0-9_]              | `\\\\d{3}\\\\w{4}` | 以3个数字开头，后接任意4个字母、数字或下划线的字符串    |
| \\\\W | 匹配单个除字母、数字、下划线以外的字符，\[^a-zA-Z0-9_] | `\\\\W+\\\\d{2} `  | 已至少一个非字母、数字或下划线开头，2个数字字符结尾的字符串 |
| \\\\s | 匹配任意空白字符（空格、制表符等） |                  |  |
| \\\\S | 匹配任意非空白字符 |                  |  |

Java正则表达式默认区分大小写，可以通过`(?i)`实现后面的正则忽略大小写（ignore case）：

* `(?i)abc`表示abc都不区分大小写
* `a(?i)bc`表示bc不区分大小写
* `a((?i)b)c`表示b不区分大小写
* `Pattern pattern = Pattern.compile(regEx, Pattern.CASE_INSENSITIVE);`也表示不区分大小写

### 选择匹配符

| 符号 | 含义                       | 示例   | 解释   |
| ---- | -------------------------- | ------ | ------ |
| \|   | 匹配“\|”之前或之后的表达式 | ab\|bc | ab或bc |

### 限定符

| 符号  | 含义                          | 示例        | 说明                                    |
| ----- | ----------------------------- | ----------- | --------------------------------------- |
| *     | 指定字符重复0次或多次，`{0,} `  | (abc)*      | 包含任意个数abc的字符串                 |
| +     | 指定字符重复1次或多次，`{1,}`   | m+(abc)*    | 至少以1个m开头，后接任意个数abc的字符串 |
| ？    | 指定字符串重复0次或1次，`{0,1}` | m+abc?      | 至少以1个m开头，后接ab或abc的字符串     |
| `{n}`   | 只能输入n个字符               | `[abcd]{3}`   | 由abcd中的字母组成的长度为3的字符串     |
| `{n,}`  | 指定至少n个匹配               | `[abcd]{3,}`  | 由abcd中的字母组成的长度不小于3的字符串 |
| `{n,m}` | 至少n个但不多于m个匹配        | `[abcd]{3,5}` | 由abcd中的字母组成的长度为[3,5]的字符串 |

**注意：** Java正则表达式默认为贪婪匹配，即尽可能匹配多的，所有在“aaaaaa”中匹配`"a{3,4}"`只会返回一次4个a，而不是两次3个a。

### 定位符

* 定位符，规定要匹配的字符串出现的位置，比如在字符串的开始还是结束位置。

| 符号  | 含义                   | 示例             | 说明                                                         | 匹配输入                                                     |
| ----- | ---------------------- | ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ^     | 指定起始字符           | ^[0-9]+[a-z]*    | 以至少1个数字开头，后接任意个数小写字母的字符串              | 123、6aa、555edf                                             |
| $     | 指定结束字符           | ^[0-9]\\-[a-z]+$ | 以1个数字开头，后接连字符“-”，并以至少1个小写字母结尾的字符串 | 1-a                                                          |
| \\\\b | 匹配目标字符串的边界   | han\\\\b         | 这里说的字符串边界是指字串间有空格，或者目标字符串的结束位置 | hanshunpingsp<font color="yellow">han</font> nn<font color="yellow">han</font> |
| \\\\B | 匹配目标字符串的非边界 | han\\\\B         | 和\\\\b相反                                                  | <font color="yellow">han</font>shunpingsphan nnhan           |

## 常用分组

### 捕获分组

| 常用分组构造形式   | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| (pattern)          | 非命名捕获，捕获匹配的字符串，编号为0的第一个捕获由整个正则表达式模式匹配的文本，其他捕获结果则根据左括号的顺序从1开始自动编号。 |
| (?\<name\>pattern) | 命名捕获，将匹配的子字符串捕获到一个组名称或编号名称中，用于name的字符串不能包含任何标点符号，并且不能以数字开头 ，可以使用单引号代替尖括号，例如）(?'name') |

* 命名分组，即可以给分组取名，例如`"(?<组名>\\d\\d)(\\d\\d)"`

  ```java
  @Test
  public void test() {
      // TestContent
      String content = "hanshunping s7789 nn1189han";
      String regex = "(?<g1>\\d\\d)(?<g2>\\d\\d)";
      Pattern pattern = Pattern.compile(regex);
      Matcher matcher = pattern.matcher(content);
      while (matcher.find()) {
          System.out.print("匹配到：" + matcher.group()); // 或matcher.group(0)
          System.out.print("，第一组：" + matcher.group(1));
          System.out.print("，第一组[通过组名]：" + matcher.group("g1"));
          System.out.print("，第二组：" + matcher.group(2));
          System.out.print("，第二组[通过组名]：" + matcher.group("g2"));
          System.out.println();
      }
  }
  ```

### 非捕获分组

| 常用分组构造形式 | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| (?:pattern)      | 匹配pattern，但不捕获该匹配的子表达式，即它是一个非捕获匹配，不存储供以后使用的匹配。这对于用“or”字符(\|)组合模式部件的情况很有用，例如，'industr(?:y\|ies)是比'industry\|insdusties'更经济的表达式 |
| (?=pattern)      | 它是一个非捕获匹配，例如'Windows (?=95\|98\|NT\|2000)'匹配'Windows 2000'中的'Windows'，但不匹配'Windows 3.1'中的'Windows'。 |
| (?!pattern)      | 该表达式匹配不处于匹配pattern的字符串的起始点的搜索字符串。他是一个非捕获匹配。例如，'Windows (?!95\|98\|NT\|2000)'匹配'Windows 3.1'中的'Windows'，但不匹配'Windows 2000'中的'Windows' |

* (?:pattern)，使用后，括号内容不会被分组（非捕获）

  ```java
  @Test
  public void test() {
      // TestContent
      String content = "迪迦奥特曼，迪迦奥特曼戴拿奥特曼，盖亚奥特曼，阿古茹奥特曼";
      String regex = "(?:迪迦|盖亚)奥特曼";
      Pattern pattern = Pattern.compile(regex);
      Matcher matcher = pattern.matcher(content);
      while (matcher.find()) {
          System.out.print("匹配到：" + matcher.group()); // 或matcher.group(0)
          System.out.println();
      }
  }
  ```

* (?=pattern)，括号内容不展示，不分组，不可前置，例如`"（?=迪迦|盖亚）奥特曼"`匹配不到内容

  ```java
  @Test
  public void test() {
      // TestContent
      String content = "西门吹雪拿刀砍死了西门庆，西门大官人";
      String regex = "西门(?=吹雪|庆)";
      Pattern pattern = Pattern.compile(regex);
      Matcher matcher = pattern.matcher(content);
      while (matcher.find()) {
          System.out.print("匹配到：" + matcher.group()); // 或matcher.group(0)
          System.out.println();
      }
  }
  ```

* (?!pattern)，与`（?=pattern）`相反，不匹配符合pattern的内容，不分组，不可前置

  ```java
  @Test
  public void test() {
      // TestContent
      String content = "西门吹雪拿刀砍死了西门庆又名西门大官人";
      String regex = "西门(?!吹雪|庆)";
      Pattern pattern = Pattern.compile(regex);
      Matcher matcher = pattern.matcher(content);
      while (matcher.find()) {
          System.out.print("匹配到：" + matcher.group()); // 或matcher.group(0)
          System.out.println();
      }
  }
  ```

## 正则表达式元字符详细说明

| 字符        | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| \\          | 将下一个字符标记为特殊字符、文本、反向引用或八进制转义符。例如，"n"匹配字符"n"，"\n"匹配换行符，序列"\\\\\\\\"匹配"\\\\"，"\\\\("匹配"("。 |
| ^           | 匹配字符串开始的位置，如果设置了RegExp对象的Multiline属性，^还会与"\\n"或"\\r"之后的位置匹配。 |
| $           | 匹配字符串结尾的位置，如果设置了RegExp对象的Multiline属性，$还会与"\\n"或"\\r"之前的位置匹配。 |
| *           | 0次或多次匹配匹配前面的字符或子表达式。例如，zo*匹配"z"和"zoo"。\*等效于`{0,}`。 |
| +           | 1次或多次匹配匹配前面的字符或子表达式。例如，zo+匹配"zo"和"zoo"，但与"z"不匹配。+等效于`{1,}`。 |
| ?           | 0次或1次匹配匹配前面的字符或子表达式。例如，"do(es)?"匹配"do"或"does"，?等效于`{0,1}`。 |
| `{n}`         | n是非负整数，正好匹配n次。例如，"`o{2}`"与"Bob"中的"o"不匹配，但与"food"匹配。 |
| `{n,}`        | n是非负整数，至少匹配n次。例如，"o{2,}"与"Bob"不匹配，但与"foooood"匹配（所有o），"`o{1,}`"等效于"o+"，"`o{0,}`"等效于"o*"。 |
| `{n,m}`       | m和n是非负整数，其中n<=m，匹配至少n次，最多m次。例如，"`o{1,3}`"匹配"fooooood"中的头三个o，"`o{0,1}`"等效于"o?"。**注意：逗号和数字之间不能有空格。** |
| [限定符]?   | 当此字符紧随在限定符(*、+、?、`{n}`、`{n,}`、`{n,m}`)后时，匹配模式是非贪心的，非贪心匹配模式匹配能搜索到的尽可能短的字符串，默认的贪心匹配模式则匹配能匹配到的尽可能长的字符串。例如，在字符串"oooo"中，"o+?"能匹配到4次单个o，而"o+"只能匹配到1次4个o。 |
| .           | 匹配除"\\r\\n"之外的任何单个字符，若要匹配包含"\\r\\n"在内的任意字符，使用诸如"\[\\s\\S]"之类的模式。 |
| (pattern)   | 匹配pattern并捕获该匹配的子表达式，可以使用$0...$9属性从结果“匹配”集合中检索捕获的匹配，若要匹配括号字符()，可使用转义符。 |
| (?:pattern) | 匹配pattern但不捕获该匹配的子表达式，即他是一个非捕获匹配，不存储供以后使用的匹配，这对于用"or"字符（\|）组合模式部件的情况很有用。例如，"industr(?:y\|ies)"是比"industry\|industies"更经济的表达式（不用比较整个单词，()不用分组存储分组数据）。 |
| (?=pattern) | 执行正向预测先行搜索的子表达式（不可前置），该表达式匹配储与匹配pattern字符串的七十点的字符串，它是一个非捕获匹配，即不能捕获供以后使用的匹配。例如，"Windows (?=95\|98\|NT\|2000)"匹配与括号中pattern连接的字符串中的Windows，不匹配与其他Windows，例如，"Windows 3.1"中的Windows。 |
| (?!pattern) | 执行反向预测先行搜索的子表达式，该表达式匹配不处于匹配pattern的字符串的起始点的搜索字符串，它是一个非捕获匹配，即不能捕获供以后使用的匹配。例如，"Windows (?!95\|98\|NT\|2000)"匹配"Windows 3.1"中的Windows，但不匹配"Windows 2000"中的Windows。预测先行不占用字符，即发生匹配后，下一匹配的搜索紧随上一匹配之后，而不是在组成预测先行的字符串后。 |
| x\|y        | 匹配x或y。例如，"z\|food"匹配"z"或"food"，"(z\|f)ood"匹配"zood"或"food"。 |
| \[xyz]      | 字符集，匹配包含的任意一个字符。例如，"\[abc]"匹配"plain"中的"a"。 |
| \[^xyz]     | 反向字符集，匹配未包含的任何字符。例如，"\[abc]"匹配"plain"中的"p"，"l"，"i"，"n"。 |
| \[a-z]      | 字符范围，匹配指定范围内的任何字符。例如，"\[a-z]"匹配"a"到"z"范围内的任何小写字母。 |
| \[^a-z]     | 反向范围字符，匹配不在指定范围内的任何字符。例如，"\[^a-z]"匹配任何不在"a"到"z"范围内的字符。 |
| \\b         | 匹配一个字边界，即字与空格间的位置。例如，"er\\b"匹配"never"中的"er"，但不匹配"verb"中的"er"。 |
| \\B         | 非字边界匹配。例如"er\\B"匹配"verb"中的"er"，但不匹配"never"中的"er"。 |
| \\cx        | 匹配x指示的控制字符。例如，\\cM匹配Control-M或回车符。**x的值必须在A-Z或a-z之间，否则\\c意为"c"字符本身** |
| \\d         | 数字字符匹配，等效于\[0-9]。                                 |
| \\D         | 非数字字符匹配，等效于\[^0-9]。                              |
| \\f         | 换页符匹配，等效于\\x0c和\\cL。                              |
| \\n         | 换行符匹配，等效于\\x0a和\\cJ。                              |
| \\r         | 匹配一个回车符，等效于\\x0d和\\cM                            |
| \\s         | 匹配任何空白字符，包括空格、制表符、换页符等，与\[\\f\\n\\r\\t\\v]等效。 |
| \\S         | 匹配任何非空白字符，与\[^\\f\\n\\r\\t\\v]等效。              |
| \\t         | 制表符匹配，与\\x09和\\cI匹配。                              |
| \\v         | 垂直制表符匹配，与\\x0b和\cK等效。                           |
| \\w         | 匹配任何字符类字符， 包括下划线， 与"\[A-Za-z0-9_]"等效。    |
| \\W         | 与任何非单词字符匹配，与"\[^A-Za-z0-9_]"等效。               |
| \\xn        | 匹配n，此处的n是一个十六进制转义码， 十六进制转义码必须正好是两位数长。例如，\"\x41"匹配"A"，"\\041"与"\\x04"&"1"等效。允许在正则表达式中使用ASCII码。 |
| \\num       | 匹配num，此处的num是一个正整数，到捕获匹配的反向引用。例如，"(.)\\1"匹配两个连续的相同字符。 |
| \\n         | 标识一个八进制转义码或反向引用，如果\\n前面至少有n个捕获子表达式，那么n是反向引用，否则，如果n是八进制数(0-7)，那么n是八进制转义码。 |
| \\nm        | 标识一个八进制转义码或反向引用，如果\\nm前面至少有nm个捕获表达式，那么nm是反向引用；如果\\nm前面至少有n个捕获，则n是反向引用，后面跟有字符m。如果上述两种情况都不存在，则\\nm是匹配八进制nm，其中n和m是八进制数字(0-7)。 |
| \\nml       | 当n是八进制数(0-3)，m和l是八进制数(0-7)时，匹配八进制转义码nml。 |
| \\un        | 匹配n，其中n时以四位十六进制数表示的Unicode字符。例如，\\u00A9匹配版权符号（©）。 |

### 非贪婪匹配

```java
@Test
public void test() {
    // TestContent
    String content = "hello111111 ok";
    // String regex = "\\d+"; // 默认为贪婪匹配
    String regex = "\\d+?"; // 限定符后加"?"改为非贪婪匹配
    Pattern pattern = Pattern.compile(regex);
    Matcher matcher = pattern.matcher(content);
    while (matcher.find()) {
        System.out.print("匹配到：" + matcher.group()); // 或matcher.group(0)
        System.out.println();
    }
}
```

## 正则表达式三个常用的类

`java.util.regex`包主要包括Pattern、Matcher和PatternSyntaxException三个类：

* Pattern类，Pattern对象是一个正则表达式对象，Pattern类没有公共的构造方法，通过调用其公共静态方法，返回Pattern对象，该方法接收一个正则表达式作为它的第一个参数，比如：`Pattern pattern = Pattern.compile(regex);`
* Matcher类，Matcher对象是对输入字符串进行解释和匹配的引擎，与Pattern类一样，Matcher也没有公共构造方法，通过调用Pattern对象的matcher方法来获取Matcher对象
* PatternSyntaxException类，PatternSyntaxException是一个非强制异常类，它表示一个正则表达式模式中的语法错误

### Pattern

* matchers()方法，整体匹配

  ```java
  @Test
  public void test() {
      // TestContent
      String content1 = "18288888888";
      String content2 = "18288888888打号机13488888888";
      String regex = "^1[3458]\\d{9}$";
      System.out.println("content1是电话号码：" + Pattern.matches(regex, content1));
      System.out.println("content2是电话号码：" + Pattern.matches(regex, content2));
  }
  ```

### Matcher

* 方法一览

  | 方法及说明                                                   |
    | ------------------------------------------------------------ |
  | public int start() 返回前匹配的初始索引                      |
  | public int start(int group) 返回在以前的匹配操作空间，由给定组所捕获的子序列的初始索引 |
  | public int end() 返回最后匹配字符后的偏移量                  |
  | public int end(int group) 返回在以前的匹配操作空间，由给定组所捕获的子序列最后字符之后的偏移量 |
  | public boolean lookingAt() 尝试从区域开头开始的输入序列与该模式匹配 |
  | public boolean find() 尝试查找与该模式匹配的输入序列的下一个子序列 |
  | public boolean find(int start) 重置此匹配器，然后尝试查找匹配该模式、从指定索引开始的输入序列的下一个子序列 |
  | public boolean matchers() 尝试将整个区域与该模式匹配         |

  ```java
  @Test
  public void test1() {
      // TestContent
      String content = "hello edu jack tom hello smith hello";
      String regex = "hello";
      Matcher matcher = Pattern.compile(regex).matcher(content);
      while (matcher.find()) {
          System.out.println(matcher.start()); // 匹配结果起始索引
          System.out.println(matcher.end()); // 匹配结果结束索引+1（偏移量）
          System.out.println();
      }
      System.out.println(Pattern.compile("hello.*").matcher(content).matches()); // 整体匹配，matches()判断是否满足整个规则，true
      System.out.println(matcher.replaceAll("替换后的值")); // 不改变原字符串，返回替换后的字符串
  }
  ```

### PatternSyntaxException

非强制异常

## 反向引用

* 需求

  > 找出一段文本中，所有4个数字连在一起的子串，这些子串需满足第1位于第4为相同，第2位于第3位相同

**1. 分组**

我们可以用圆括号组成一个比较复杂的匹配模式，那么一个圆括号的部分可以看做是一个子表达式/分组。

**2. 捕获**

把正则表达式中子表达式/分组匹配的内容保存到内存中以数字编号或显式命名的组里，方便后面引用，从左到右，以分组的左括号为标志，第一个出现的分组的组号为1，第二个为2，以此类推。组0代表整个正则表达式。

**3. 反向引用**

圆括号的内容被捕获后，可以在这个括号后被引用，从而写出一个比较实用的匹配模式，称为**反向引用**，这种引用既可以是正则表达式内部，也可以是在正则表达式外部，内部反向引用`\\分组号`，外部反向引用`$分组号`。

```java
@Test
public void test1() {
    // TestContent
    String content = "1122111112321-333999111555555688";
    // String regex = "(\\d)\\1"; // 匹配2个连续相同的数字
    // String regex = "(\\d)\\1{4}"; // 匹配5个连续相同的数字
    // String regex = "(\\d)(\\d)\\2\\1"; // 匹配个位与千位相同，十位与百位相同的数字
    String regex = "\\d{5}-(\\d)\\1{2}(\\d)\\2{2}(\\d)\\3{2}"; // 字符串中检索商品编号，形如123321-333999111这样的号码，要求：满足前面是一个5位数，然后一个“-”号，然后是一个9位数，连续的3位相同
    Matcher matcher = Pattern.compile(regex).matcher(content);
    int group = 0;
    while (matcher.find()) {
        System.out.print("第" + ++group + "组：start: " + matcher.start());
        System.out.println(", end: " + matcher.end() + ", value: " + matcher.group());
    }
}
```

### 结巴去重案例

> 把类似“我……我要……学学学学……变成Java！”通过正则表达式修改为“我要学编程Java！”。

```java
@Test
public void test1() {
    // TestContent
    String content = "我……我要……学学学学……编程Java！";
    // 1、去除省略号
    content = content.replaceAll("…", "");
    // 2、去掉重复的字
    String regex = "(.)\\1+"; // 2.1 找到所有连续重复字
    Matcher matcher = Pattern.compile(regex).matcher(content);
    int group = 0;
    while (matcher.find()) {
        System.out.print("第" + ++group + "组：start: " + matcher.start());
        System.out.println(", end: " + matcher.end() + ", value: " + matcher.group());
    }
    // 2.2 将匹配到的值替换为的第一个分组匹配的到的内容（重复字第一个字）
    content = matcher.replaceAll("$1");
    System.out.println(content);
}
```

## String类中使用正则表达式

* public String replaceAll(String regex, String replacement)
* public boolean matches(String regex)
* public String[] split(String regex)
