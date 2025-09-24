---
title: Redis
tags:
  - Redis
  - NoSQL
  - 数据库
---

# Redis

参考：[不要小看一个Redis！马士兵最新Redis从入门到精通全套教程开源：3天带你走向实战，让你掌握Redis面试所有核心知识！](https://www.bilibili.com/video/BV1PKDsYCEh2)

**![](/images/image-20250609174708864.png)**

**![image-20250611170606583](/images/image-20250611170606583.png)**

## 1、安装配置文件常用配置与常用全局命令

Redis版本号：x.x(.x)，其中，第一位为大版本号，第二位为奇数时为非稳定版本，偶数则为稳定版本。

官方文档：[https://redis.io/docs/latest/](https://redis.io/docs/latest/)

中文文档命令查询：[https://redis.net.cn/order](https://redis.net.cn/order)

### 安装

安装过程与普通的Linux程序安装步骤没有多大区别，官网下载二进制文件，正常运行C的构建安装命令即可，Redis一般不使用Windows端，它几乎都是运行在Linux服务器上的，Redis官方并没有提供Windows版本，但是微软自己适配了一个Windows版本，该版本只适合做一些基础的命令验证，不适合大型服务器长期运行。此外，我更推荐使用docker安装，操作更为简单，单独管理自己的Redis配置文件也更为便捷。

::: info 说明

Redis配置文件默认路径为 `/etc/redis/redis.conf`，某些发行版，如通过 yum 安装的Redis，可能默认路径是 `/etc/redis.conf`；Windows系统中，默认情况下，Redis 配置文件通常位于Redis 服务器的安装目录下`安装目录\redis.conf`，Windows 下配置文件名称可能是 `redis.windows.conf`。

可以使用 redis-cli 命令 `config get dir` 查看当前使用的配置文件目录。

使用docker安装时，只需要将对应的配置文件映射到宿主机即可。

Redis总共有16个库（0~15），但是一般情况下，只使用0库即可，因为如果使用集群，那么操作的都是0库，使用其他库没有多大意义。

:::

* Redis配置远程访问：编辑配置文件，设置如下几项值：

  ```shell
  # bind 127.0.0.1 
  bind 0.0.0.0
  daemonize no						# 设置为守护进程方式运行
  protected-mode no				# 关闭保护模式
  requirepass <password>	# 可选
  ```

  如果是docker，一般可以直接在环境变量中设置密码即可。

### 常用全局命令

Bin目录下的可执行文件：

|   可执行文件    |            作用             |
| :-------------: | :-------------------------: |
|  redis-server   |       启动Redis服务端       |
|    redis-cli    |      Redis命令行客户端      |
| redis-benchmark |        基准测试工具         |
| redis-check-aof | AOF持久化文件检测和修复工具 |
| redis-check-rdb | RDB持久化文件检测和修复工具 |
| redis-sentinel  |          启动哨兵           |

* redis-server

  ```shell
  # 默认配置启动
  redis-server
  
  # 指定端口启动
  redis-server --port 端口号
  
  # 配置文件启动
  redis-server 配置文件路径
  
  # 优先级：命令行上指定的参数 > 配置文件
  ```

* redis-cli

  ```shell
  # 连接
  redis-cli -h 主机地址，默认127.0.0.1 -p 端口号，默认6379
  
  # 如果是单次连接，可以直接在上述命令后面跟Redis操作命令，它会在返回执行结果后结束连接
  
  # 如果设置了密码，连接成功后还需要输入密码
  auth 密码
  
  # 退出客户端命令
  exit
  ```

* 关闭服务

  ```shell
  # 避免使用kill -9 [PID]，这会导致内存数据丢失，可以在客户端使用Redis自己的关闭命令
  shutdowm [NOSAVE|SAVE]  # 默认为SAVE，即关闭前会持久化内存中的数据
  ```

* 常用全局命令

  ```shell
  # 列出所有键
  keys pattern
  # 键太多时，最好不要用keys命令，如果只是想知道数量，可以直接放回计数器记录的值
  dbsize
  # 判断键是否存在，返回存在键的数量
  exists key [key...]
  # 删除键，返回删除数量
  del key [key...]
  # 设置key过期时间
  expire key seconds
  # 查看键还有多久过期，返回正数：单位为秒，返回-2：键不存在，返回-1：键没有设置过期时间
  ttl key
  # 设置更精准的过期时间，毫秒
  pexpire key milliseconds
  # 设置指定时间过期，例如设置晚上xx点xx分过期
  expireat key timestamp
  # 查看键对应值的数据类型
  type key
  # 重命名键，如果新键名已存在，则覆盖
  rename key newkey
  # 重命名判断新键名不存在才成功，如果新键名已存在，返回0
  renamenx key newkey
  ```

:::warning 注意

如果设置了过期时间的键在还未过期时就更新了value，那么该键会变成不过期的键（ttl返回-1），所以开发过程中需要注意如果更新有过期时间的键，需要重新设置一遍过期时间：

```shell
set key value [ex seconds | px milliseconds | exat timestamp | pxat ...]
```

过期时间只针对键，对值无效。

:::

:::info Tips

`randomkey` 函数，随机返回当前库中键值。

开发中，键命名技巧：`业务名:对象名:对象标识(:属性)`，其中，分隔符（这里是冒号）可以根据喜好自定义，合适即可，如果存储的时对象中的某个属性，可以再在后面拼接属性名称。

几乎所有操作都可以在后面加上`nx`后缀，从而对本次操作进行前瞻判断，`nx`意为`if Not eXists`，即如果不存在（键）才执行操作，因此经常使用`setnx`命令来实现分布式锁。

```shell
# 不存在则设值
setnx key value
# 另一种写法
set key value nx
# 存在则设值
set key value xx
# 注意：不支持setxx [key] [value]
```

:::

## 2、String

Redis中，字符串是用得最多的一种数据类型。Redis是使用标准的C语言写的，C语言中，String类型是通过char数组实现的，但是Redis没有直接使用C语言的String类型，而是自己去实现了String。

字符串虽然理论上可以很大很大，但是建议不要超过512MB。

### 操作命令

```shell
# 批量设置
mset key1 value1 [key2 value2 ...]
# 批量获取
mget key [key...]
# 自增键，第一次运行为0，每运行一次，自增1
incr key
# 自减同理
decr key
# 自定义步长，定义后每次都自增increment
incrby key increment
# 浮点数自增
incrbyfloat key increment
# 字符串追加，返回追加后字符长度，一个中文占3个长度单位
append key value
# 查看字符串长度
strlen key
# 设置并返回旧值
getset key value
# 修改字符串指定索引开始的字符，返回修改后的字符串长度，如果index超出长度，则中间自动填充空值
setrange key index value
# 截取字符串
getrange key start end
```

命令的时间复杂度：大部分时间复杂度都是`O(1)`。

使用场景：① 分布式服务器中的Session；② 限流……

## 3、Hash

哈希类型，实际为HashMap，即`key -> Map<field, value>`。

### 操作命令

```shell
# 设值
hset key field value [field value ...]
# 删除指定属性
hdel key field [field...]
# 查询属性数量
hlen key
# 批量获取属性值
hmget key field [field...]
# 判断属性名是否存在，1：是，0：否
hexists key field
# 列出所有属性
hkeys key
# 列出所有值
hvals key
# 依次列出所有属性和值（成对出现依次排列，1)属性，2)值，3)属性，4)值……）
hgetall key
# 类型查询结果为hash
type key
# 属性自增
hincrby key field [increment default 1]
```

### String与Hash的使用场景对比

```json
// 示例数据
{
  "id": 1,
  "name": "DawnLee",
  "age": 18,
  "city": "Shanghai"
}
```

* String

  优点：简单直观，每个键对应一个值

  缺点：键数过多，占内存多，用户信息过于分散，不用于生产环境

  示例数据存储过程（键设计为 `表名:数据库行号:属性名`）：

  ```shell
  set user:1:id 1
  set user:1:name DawnLee
  set user:1:age 18
  set user:1:city Shanghai
  ```

* 将对象序列化存入String

  优点：编程简单，若使用序列化合理，内存使用率高，例如只需要存储其中几个属性值时，JSON序列化排除那些属性需要硬编码影响其他地方的序列化

  缺点：序列化与反序列化有一定开销，查询不直观

  示例数据存储过程：将其转为JSON字符串，然后直接存入即可。

* 使用Hash类型

  优点：简单直观，使用合理可减少内存空间消耗

  缺点：老版本注意ziplist与hashtable两种编码转换，Redis3.2后quickList处理

  示例数据存储过程（键设计为 `表名:id值`）：

  ```shell
  hset user:1 name DawnLee age 18 city Shanghai
  ```

## 4、List

数据特性：

* 元素可重复
* 元素有序，可通过索引访问
* 可前插可后插、可后插
* 最大存储元素个数为 $2^{32}-1$ 个

:::info 说明

尽管理论支持近 43 亿元素，但实际容量受服务器可用内存制约。例如，若每个元素占用 1KB，则 10 亿元素需约 1TB 内存。

:::

### 操作命令

``` shell
# 后插（从list右边插入），返回值为插入后当前列表长度
rpush key element [element...]
# 前插（从list左边插入），返回值为插入后当前列表长度
lpush key element [element...]
# 查看列表，start为起始索引，stop为结束索引（-1则为到末尾）
lrange key start stop
# 从左边弹出元素
lpop key [count default 1]
# 从右边弹出元素
rpop key [count default 1]
# 删除指定数量的指定元素（从起始索引开始查找）
lrem [key] [count] [element]
# 截取[start, stop]索引范围的元素，截取后原键对应的list只剩下截取部分（stop如果大于长度，则截取到列表末尾）
ltrim key start stop
# 修改指定索引下的元素
lset key index element
# 查询指定索引下的元素
lindex key index
# 查询列表长度
llen key
```

:::info Tips

根据Redis列表数据结构和功能特性，从而可以很方便的使用它实现栈和队列：

* 栈（确保先进后出）：入值使用`rpush`，取值使用`rpop`；或者入值使用`lpush`，取值使用`lpop`
* 队列（确保先进先出）：入值使用`rpush`，取值使用`lpop`；或者入值使用`lpush`，取值使用`rpop`

:::

### 阻塞命令与实现阻塞队列

阻塞机制：阻塞取值过程中，如果列表值为空，会阻塞指定时间，如果这段时间内列表入值则取出，如果到达阻塞时间列表还是空，则返回空（nil），阻塞时间设置为0表示一直阻塞，键可以设置多个，取出的值会同时显示键名和弹出值

```shell
# 左侧阻塞弹出，timeout即为阻塞时间
blpop key [key...] timeout
# 右侧阻塞弹出同理
```

通过这个阻塞机制，即可实现一个类似MQ的功能（弱）

```shell
# 入队列
lpush mq element [element...]
# 出队列
brpop mq 5
```

## 5、Set

数据特性：

* 无序，无法通过索引下标访问
* 不允许重复
* 最大存储元素个数为 $2^{32}-1$ 个
* 可以做交集、并集、差集

### 操作命令

```shell
# 集合的创建（添加元素），返回值为添加后集合元素数量，如果遇到重复，则只添加成功一个元素
sadd key member [member...]
# 查看集合成员
smembers key
# 删除元素，返回值为成功删除数量
srem key member [member...]
# 查询元素数量
scard key
# 判断是否存在指定元素，1：是，0：否
sismember key member
# 随机返回指定数量数据，大于总数则全部返回
srandmember key [count default 1]
# 弹出元素
spop key
# 求交集，只传一个集合则返回它本身
sinter key [key...]
# 求并集
sunion key [key...]
# 求差集，以第一个集合为基准进行比较，即set1-set2-set3...如此依次计算得出最终差集，因此第一个集合会影响最终结果
sdiff key [key...]
# 以上集合之间运算结果保存（以求交集为例），返回值为存储运算结果的目标集合中成员数量
sinterstore destination key [key...]
```

集合多应用于需要去重的场景，例如标签功能（方便求交集、并集和差集等）、随机数抽奖

## 6、 Zset

### 原理特性分析

数据特性：

* 与set类似，zset中的元素不可重复
* 每个元素关联一个double类型的分数（score）
* 元素默认按从小到大的顺序排列，若score相同，则按字典序列（lexicographical order）排序
* 修改元素的score后，其在集合中的位置会自动更新

底层实现（Zset 的底层结构根据数据规模动态切换，以平衡内存与性能）：

* 压缩列表(ziplist)：元素数量 ≤ `zset-max-ziplist-entries`（默认 128）且所有元素长度 ≤ `zset-max-ziplist-value`（默认 64 字节）时使用，内存紧凑，但修改时需重写整个列表，性能较低。Redis 7.0 后由 **listpack** 替代。

  整体由5部分组成：

  - `zlbytes`（4字节）：列表总字节数
  - `zltail`（4字节）：尾节点偏移量（支持反向遍历）
  - `zllen`（2字节）：节点数量（超过65535需遍历计数）
  - `entries`（变长）：节点列表
  - `zlend`（1字节）：结束标记`0xFF`

  节点列表中的节点又由三部分组成（`prevlen -> encoding -> content`）：

  - `prevlen`：变长编码（1或5字节），记录前驱节点长度以实现反向遍历
  - `encoding`：动态编码数据类型（整数/字符串）及长度
  - `content`：实际数据（整数或字符串）

  特性：

  - 内存高效：通过变长字段避免内存对齐浪费
  - 级联更新风险：节点长度变化（如253→254字节）导致后继节点 `prevlen`扩容，可能引发连锁更新（最坏O(n²)）
  - 操作限制：插入/删除需内存重分配，大数据量时性能骤降

* 紧凑列表（listpack）：为解决级联更新问题设计，Redis 7.0后全面取代ziplist。

  相比于ziplist，简化了头部，仅保留总字节数、元素数量、结束标记，节点的结构也进行了革新（`encoding -> content -> backlen`），backlen为边长存储当前节点总长度，从而彻底消除级联更新。

  关键改进：

  * 双向遍历：通过`backlen`实现反向遍历（ziplist仅支持正向）

  - 内存更紧凑：减少头部开销，提升小数据存储密度
  - 操作更安全：节点修改不影响邻居，插入/删除稳定O(n)

* 跳表 + 字典 (skiplist + dict)：不满足 ziplist 条件时自动切换，调表支持 O(log N) 复杂度的插入、删除、范围查询，而字典存储 `member→score` 映射，实现 O(1) 分数查询，字典与调表共享元素数据，无额外内存开销。

### 操作命令

```shell
# 添加zset基础命令（可选参数后续再做说明）
zadd key [nx|xx] [gt|lt] [ch] [incr] score member [score member...]
# 查询长度
zcard key
# 查询指定成员分数
zscore key member
# 计算指定成员排名（排名从低到高，从0开始）
zrank key member
# 计算指定成员倒序排名
zrevrank key member
# 删除指定成员，返回值为成功删除成员数
zrem key member [member...]
# 修改分数
zincrby key increment member
# 根据排序范围查询，返回指定排名范围内的成员[min, max]，max为-1表示查询整个集合，其余参数见名知意
zrange key min max [byscore|bylex] [rev] [limit offset count] [withscores]
# 根据分数范围查询，返回指定分数范围内的成员[min, max]，其余参数见名知意，如果要查询全部成员，则min=-inf，max=+inf即可
zrangebyscore key min max [limit offset count] [withscores]
# 应用举例：计算交集平均分，numkeys为集合数量，第1个weight对应第1个zset所占权重，第2个weight对应第2个zset。
zinterstore destination numkeys key [key ...] [weights weight] [aggregate sum|min|max]
```

### 典型应用场景

Zset以 $O(logN)$ 的高效操作，解决了唯一元素排序与动态范围查询的需求，是排行榜、任务调度等场景的首选，以下是一些典型应用场景举例：

| 场景         | 实现方式                                                     | 优势                                          |
| ------------ | ------------------------------------------------------------ | --------------------------------------------- |
| 实时排行榜   | 用户ID作member，积分或热度作score，通过zrange获取TopN        | 支持动态更新排名、分压查询及个人排名（zrank） |
| 延时任务队列 | 任务ID作member，执行时间戳作score，定时扫描zrangebyscore获取到期任务 | 精准调度，避免轮训数据库                      |
| 时间轴       | 消息ID作member，发布时间戳作score，按时间范围检索（zrangebyscore） | 高效获取时间区间内消息                        |
| 优先级队列   | 任务作member，优先级作score，用zpopmax获取最高优先级任务     | 确保最高优先级任务优先执行                    |

## 7、Bitmap

Java中，`int[] arr = new int[]{1, 3, 5, 7};`用BitMap表示：

| bit[7] | bit[6] | bit[5] | bit[4] | bit[3] | bit[2] | bit[1] | bit[0] |
| :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: |
|   1    |   0    |   1    |   0    |   1    |   0    |   1    |   0    |

为了提高操作效率和内存使用率，很多编程语言都提供了对位的操作，Redis同样如此，在Redis中，使用bitmap对位进行操作。

### 操作命令

```shell
# 设值，其中offset即为在位图上的偏移量，value的值为0或1
setbit key offset value
# 取值
getbit key offset
# 统计指定偏移量范围内有多少个值
bitcount key start end
# 对位图进行一些操作
bitop operation destkey key [key ...]
```

### 网页UV统计案例

要记录用户对网站的访问，用户ID为0、2、4、6、8，5个用户，可做如下设计：

key设置为访问年份，用户ID作位图偏移量，从而得出记录网页UV的位图：

```shell
setbit uv-2025 0 1
setbit uv-2025 2 1
setbit uv-2025 4 1
setbit uv-2025 6 1
setbit uv-2025 8 1

# 要判断指定时间指定用户是否访问，直接取值即可（1：是，0：否）
getbit uv-2025 8
```

与集合对比bitmap存储优势：假设网站有1亿用户，每天活跃用户有2千万，用户ID为long型（64位）。

* 集合类型：$64\times20000000\div8\div1024\div1024\approx153(MB)$
* BitMap：$1\times20000000\div8\div1024\div1024\approx2(MB)$

以上为每天的数据，存储空间有七八十倍的差距。

## 8、布隆过滤器

1970年，布隆提出了一种布隆过滤算法，用来判断一个元素是否在一个集合中，这种算法由一个二进制数组和一个哈希算法组成：

**![image-20250612172910](/images/image-20250612172910.png)**

由于哈希冲突问题，布隆过滤器判断存在的数据不一定存在，但是判断不存在的数据一定不存在。

### 使用bitmap实现布隆过滤器

场景：一个用户查询接口，当用户注册后，用户存入数据库并更新Redis缓存，后续查询该用户ID时，直接从缓存中返回数据，如果缓存中没有数据则查询数据库并更新缓存。假设黑客获悉了这个接口的缓存机制，并且试探出用户ID为1~999，然后黑客就可以不断请求＞999的ID查询，从而使得服务器每次都请求数据库，造成**缓存击穿**，从而占满数据库服务资源。

**![image-20250612175233619](/images/image-20250612175233619.png)**

为了解决这个问题，可以在每次启动服务时查询数据库用户ID，然后根据ID创建一个布隆过滤器，并写缓存，同时每次用户注册时更新布隆过滤器和缓存，每次请求该接口时先通过布隆过滤器判断用户ID是否存在，如果不存在直接返回响应结果，否则再去查询缓存进而查询数据库。这样即可解决缓存击穿问题，并且由于布隆过滤器运算迅速，占用内存较小，对服务器不会造成比较大的负担。

**![image-20250612175719420](/images/image-20250612175719420.png)**

### Java手写布隆过滤器

需要引入guava的支持：

```xml
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>33.4.8-jre</version>
</dependency>
```

代码实现：

```java
package com.triabin.ideasy_server.service;

import com.google.common.hash.Hashing;
import com.google.common.primitives.Longs;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.data.redis.core.ValueOperations;

import java.nio.charset.StandardCharsets;

/**
 * 类描述：仿谷歌布隆过滤器实现
 *
 * @author Triabin
 * @date 2025-06-12 18:03:08
 */
@RequiredArgsConstructor
public class RedisBloomFilter {

    private static final Logger logger = LogManager.getLogger(RedisBloomFilter.class);

    private final IRedisService redisService;

    public final static String RS_BF_NS = "rbf:";

    /**
     * 预估元素数量
     */
    private int numApproxElements;

    /**
     * 可接受的最大误差
     */
    private double fpp;

    /**
     * 自动计算的哈希函数个数
     */
    private int numHashFunctions;

    /**
     * 自动计算的最优BitMap长度
     */
    private int bitmapLength;

    /**
     * 方法描述：构造布隆过滤器
     *
     * @param numApproxElements 预估元素数量
     * @param fpp               可接受最大误差
     * @return {@link RedisBloomFilter}
     * @date 2025-06-12 18:07:02
     */
    public RedisBloomFilter init(int numApproxElements, double fpp) {
        this.numApproxElements = numApproxElements;
        this.fpp = fpp;
        // 计算位数组长度
        this.bitmapLength = (int) (-numApproxElements * Math.log(fpp) / (Math.log(2) * Math.log(2)));
        // 计算哈希函数个数
        this.numHashFunctions = Math.max(1, (int) Math.round((double) bitmapLength / numApproxElements * Math.log(2)));
        return this;
    }

    /**
     * 方法描述：计算一个元素值哈希映射到BitMap的那些bit上，用两个hash函数来模拟多个hash函数的情况
     *
     * @param element 元素值
     * @return {@link long[]} bit数组下标
     * @date 2025-06-12 22:28:02
     */
    private long[] getBitIndices(String element) {
        long[] indices = new long[numHashFunctions];
        // 将传入的字符串转为一个128位的hash值，并且转化为一个byte数组
        byte[] bytes = Hashing.murmur3_128()
                .hashString(element, StandardCharsets.UTF_8)
                .asBytes();
        long hash1 = Longs.fromBytes(bytes[7], bytes[6], bytes[5], bytes[4], bytes[3], bytes[2], bytes[1], bytes[0]);
        long hash2 = Longs.fromBytes(bytes[15], bytes[14], bytes[13], bytes[12], bytes[11], bytes[10], bytes[9], bytes[8]);

        // 用这两个hash值来模拟多个函数产生的值
        long combinedHash = hash1;
        for (int i = 0; i < numHashFunctions; i++) {
            indices[i] = (combinedHash & Long.MAX_VALUE) % bitmapLength;
            combinedHash = combinedHash + hash2;
        }
        return indices;
    }

    /**
     * 方法描述：插入元素
     *
     * @param key       原始Redis键，回自动拼接前缀
     * @param element   原始值，字符串类型
     * @param expireSec 过期时间（秒）
     * @date 2025-06-12 22:29:04
     */
    public void insert(String key, String element, int expireSec) {
        if (key == null || element == null) {
            throw new RuntimeException("键值均不能为空");
        }
        String actualKey = RS_BF_NS.concat(key);
        try {
            SessionCallback<Boolean> callback = new SessionCallback<>() {
                @Override
                public <K, V> Boolean execute(RedisOperations<K, V> operations) throws DataAccessException {
                    ValueOperations<String, String> valueOperations = (ValueOperations<String, String>) operations.opsForValue();
                    for (long index : getBitIndices(element)) {
                        valueOperations.setBit(actualKey, index, true);
                    }
                    return null;
                }
            };
            redisService.pipeline(callback);
            redisService.expire(actualKey, expireSec);
        } catch (Exception e) {
            logger.error("Redis插入元素值异常", e);
        }
    }

    /**
     * 方法描述：检查元素在集合中是否（可能）存在
     *
     * @param key     原始Redis键，会拼接前缀
     * @param element 元素值，字符串类型
     * @return {@link boolean}
     * @date 2025-06-12 22:42:57
     */
    public boolean mayExist(String key, String element) {
        if (StringUtils.isBlank(key) || StringUtils.isBlank(element)) {
            throw new RuntimeException("键值均不能为空");
        }
        String actualKey = RS_BF_NS.concat(key);
        boolean result = false;
        try {
            SessionCallback<Boolean> callback = new SessionCallback<>() {
                @Override
                public <K, V> Boolean execute(RedisOperations<K, V> operations) throws DataAccessException {
                    ValueOperations<String, String> valueOperations = (ValueOperations<String, String>) operations.opsForValue();
                    for (long index : getBitIndices(element)) {
                        valueOperations.getBit(actualKey, index);
                    }
                    return null;
                }
            };
            result = redisService.pipeline(callback).contains(Boolean.FALSE);
        } catch (Exception e) {
            logger.error("判断【{}】键的【{}】元素是否存在运行异常", key, element, e);
        }
        return result;
    }

    public RedisBloomFilter(IRedisService redisService, int numApproxElements, double fpp, int numHashFunctions, int bitmapLength) {
        this.redisService = redisService;
        this.numApproxElements = numApproxElements;
        this.fpp = fpp;
        this.numHashFunctions = numHashFunctions;
        this.bitmapLength = bitmapLength;
    }

    @Override
    public String toString() {
        return "RedisBloomFilter{" +
                "redisService=" + redisService +
                ", numApproxElements=" + numApproxElements +
                ", fpp=" + fpp +
                ", numHashFunctions=" + numHashFunctions +
                ", bitmapLength=" + bitmapLength +
                '}';
    }
}
```

:::info 说明

在实际项目中，一般使用布隆过滤器时可以直接使用redisson，它直接封装了比较完备的布隆过滤器功能。

```xml
<dependdency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>x.xx.x</version>
</dependdency>
```

```java
// 示例
RedissonClient redisson = Redisson.create(config);
RBloomFilter<String> bloomFilter = redisson.getBloomFilter("phoneList");
// 初始化布隆过滤器，预计元素为100000000L，误差率为3%
bloomFilter.tryInit(100000000L, 0.03);
// 插入号码
bloomilter.add("10086");
// ...
// 判断是否存在
bloomFilter.contains("10086"); // true
```

:::

## 9、命令时间复杂度

|        命令         | 时间复杂度  |
| :-----------------: | :---------: |
|       `zadd`        |   $O(1)$    |
|       `zcard`       |   $O(1)$    |
| `zscore key member` |   $O(1)$    |
|       `zrank`       | $O(log(n))$ |

## 10、HyperLogLog

大型网站每个网页每天的UV数据（独立访客，Unique Visitor），需要占用尽量少的存储空间来进行统计，Redis提供了HyperLogLog数据结构用来解决这种统计问题，HyperLogLog提供不精确的去重计数方案，虽然不精确但是也不是非常不精确，标准误差为**0.81%**，这样的精确度已经可以满足UV统计需求。

为什么不适用集合？以下是百万级用户访问使用集合与HyperLogLog存储统计数据（Long型ID）占用空间对比：

| 处理方式\\存储 | 1天  | 1个月 | 1年  |
| :------------: | :--: | :---: | :--: |
|      集合      | 80MB | 2.4GB | 28GB |
|  HyperLogLog   | 15KB | 450KB | 5MB  |

HyperLogLog提供了3个命令：pfadd、pfcoiunt、pfmerge。

```shell
# 添加数据
pfadd key element [element ...]
# 统计
pfcount key [key ...]
# 合并多个HyperLogLog到指定键
pfmerge destkey sourcekey [sourcekey ...]
```

:::warning 注意

HyperLogLog不属于一种数据结构，本质上只是字符串，只是由于它涉及到各种复杂的数学概念和相应的实现方式，所以单独作为一种结构。

:::

**原理解析：** HyperLogLog基于概率论中**伯努利试验**并结合了**极大似然估算方法**，并且做了**分桶优化**。

* 伯努利试验

  **![image-20250613065046436](/images/image-20250613065046436.png)**

  $n=2^K$

  pfadd命令运行后的存储过程：

  ① 为key创建16384个用于存储伯努利结果的桶；

  ② 将插入的element进行哈希计算得到一个64位的二进制数；

  ③ 将这个二进制数低位的（末尾）14位用来索引到桶（因为用后14位直接索引到桶，所以桶总共有$2^{14}=16384$个）；

  ④ 剩余的50位按照伯努利过程从低到高遇到1为止，将这个长度存储到对应的桶中，由于这个数最大为50（二进制为110010），所以桶中数位数设置为6位，由于高位的50位不存在1的情况为极少数，因此算入误差中；

  ⑤ 同一个桶如果出现了更大的数，则直接覆盖取大值（极大似然估算方法）。

* Redis中的pfcount计算：$DV_{HLL} = const * m * (\frac{m}{\sum_{j=1} ^m \frac{1}{2^{R_j}}})$

  其中，const和m为偏差修正参数，$\frac{m}{\sum_{j=1}^m\frac{1}{2^{R_j}}}$为所有桶估计值的调和平均数，$\frac{1}{2^{R_j}}$为每个桶的估计值。

> 计算HyperLogLog单个数据大小：$16384\text{(桶)}\times6\text{(bit/桶)}\div8\text{(转Byte)}\div1024\text{(转KB)}=12\text{(KB)}$

## 11、GEO

Redis3.2版本提供了GEO（地理信息定位）功能，支持存储地理位置信息用来实现诸如附近位置、摇一摇这类依赖于地理位置信息的功能。

* 地图元素的位置数据使用二维的经纬度表示（经度：longitude，纬度：latitude）
* 经度范围(-180, 180)，维度范围(-90, 90)
* 纬度正负以赤道为界，北正南负
* 经度正负以本初子午线（英国格林尼治天文台）为界，东正西负

项目中比较通用的地理位置距离排序算法是GeoHash算法，Redis也用这个算法。

### 操作命令

```shell

# 添加命令，member一般用作地名
geoadd key [nx|xx] [ch] longitude latitude member [longitude latitude member ...]
# 查询命令
geopos key member [member ...]
# 由于查询结果太长，可以将查询结果转为哈希
geohash key member [member ...]
# 除了这些基本使用，Redis还提供了其他诸如计算两地最短距离之类的一些列命令，不做详细叙述了，使用时再去查询
```

## 12、面试题

1. Redis为什么快？<span id="question1"></span>

   * 纯内存访问

   * 单线程避免上下文切换

   * 渐进式ReHash、缓存时间戳

     为了实现从键到值的快速访问，Redis使用了一个哈希表来保存所有键值对。一个哈希表其实就是一个数组，数组的每个元素称为一个哈希桶，每个哈希桶中保存了键值对数据（当发生哈希冲突时升级为链表）。

     随着键值对的增加，需要对哈希表进行扩容，当每次扩容后，就需要对原来的键值对重新进行哈希运算（ReHash）才能将其存储到扩容后哈希表的正确位置，当数据量较大时，这个ReHash的过程会阻塞IO，为了解决这个问题，Redis采用了渐进式的ReHash：

     ① 首先，Redis默认使用两个全局哈希表（表1、表2）；

     ② 一开始插入数据时候默认使用表1，此时的表2并没有被分配空间；

     ③ 随着数据逐步增多，Redis开始执行ReHash；

     ④ 给表2分配更大的空间，例如是表1大小的两倍，暂时只分配空间，不拷贝数据；

     ⑤ 从这里开始，Redis在处理客户端请求时要加入一个额外处理，将被访问的数据拷贝到表2，如此循环直到将所有数据拷贝完成即可清空表1并与表2角色对调。

     这样就将一次性大量拷贝的开销分摊到了多次处理请求的过程中，避免了耗时操作，保证了数据的快速访问。

     :::warning 注意

     如果Redis中有海量key值的话，这个ReHash过程会很长很长，虽然采用渐进式ReHash，但是在ReHash过程中还是会导致请求有不小的卡顿，并且像一些统计命令也会非常卡顿，例如keys。

     按照Redis的配置，每个实例能存储的最大key的数量为$2^{32}$，即2.5亿，但是需要尽量把key的数量控制在千万以下，这样就可以避免ReHash导致的卡顿问题，如果数量确实比较多，建议采用分区哈希存储。

     :::

     Redis缓存时间戳机制：在编程过程中，平时使用系统时间戳经常使用`System.currentTimeInMillis`或者`time.time()`来获取系统的毫秒时间戳，但是Redis不能这样，对于Redis来说每次一次获取系统时间戳都是一次系统调用，系统调用相对来说是比较费时间的，单线程的Redis承受不起，所以它需要对时间进行缓存，由一个定时任务每毫秒更新一次时间缓存，Redis中的时间都是从缓存中直接获取。

2. Redis适合什么场景？<span id="question2"></span>

   总体来说不仅需要回答用途，最好是给出对应的Redis数据类型即解决方案

   * 缓存：String、Hash等
   * 计数器：`incr key`
   * 分布式会话
   * 排行榜：zset
   * 最新列表
   * 分布式锁
   * 消息队列：list

3. Redis6.0之前为什么一直不使用多线程？<span id="question3"></span>

   ① Redis性能瓶颈主要受制于内存和网络，CPU不是瓶颈（可以使用pipline批量处理）；

   ② 使用单线程一来可以使Redis系统设计更为简单，二来可以避免多线程问题（线程上下文切换、加/解锁、死锁问题等），内部维护成本较低；

   ③ 大部分公司，光单线程的性能已经足够使用（pipline可以达到每秒100w请求）。

4. Redis6.0为什么要引入多线程？<span id="question4"></span>

   为了应对海量数据的场景，在接收请求阶段引入了多线程，以便获得更高的QPS，但是收到请求后，内部具体执行命令还是单线程，多线程只是确保了海量网络请求时客户端不卡顿。

5. Redis有哪些高级功能？<span id="question5"></span>

   * 慢查询：类似MySQL中慢查询日志，Redis也可以通过配置开启类似功能，记录执行时间超过设定阈值的命令；

   * Pipline：管道功能，主要是批量执行命令，减少了RTT（将多次网络IO减少为一次）

   * Pipline与事务区别：Pipline是客户端行为，服务端无法区分普通命令和Pipline命令；事务是服务端功能，用户执行`multi`命令后，服务器会将对应这个用户的客户端对象设置为一个特殊的状态，在这个状态下后续用户执行的命令不会被真的执行，而是被服务器缓存起来，直到用户执行`exec`命令位置，服务器会将这个用户对应的客户端对象中缓存的命令按照提交的顺序依次执行。

     Pipline提升的是服务器的吞吐能力，事务提升的是Redis处理查询请求的能力。

     注意：Redis提供的事务功能较为简单，因为它不支持事务中回滚的特性，同时无法实现命令之间的逻辑关系计算，只保证了原子性；Pipline无法保证原子性。

   * Redis的watch命令：有些应用场景需要在事务之前，确保事务中的key没有被其他客户端修改过，才执行事务，否则不执行（乐观锁）。Redis提供了watch命令来解决这类问题。

   * Lua：Redis中可以直接运行Lua代码

   * 红锁（Redlock）

   * 分布式锁

   * 集群

   * 主从

   * watchdog

   * ……

6. 为什么要使用Redis？<span id="question6"></span>

   * 高性能
   * 高并发
   * 扩容简单

7. Redis与memcached相对有哪些优势？<span id="question7"></span>

   |            | Redis                                                        | Memcached                   |
   | ---------- | ------------------------------------------------------------ | --------------------------- |
   | 整体类型   | ① 支持内存<br />②非关系型数据库                              | ① 支持内存<br />② key-value |
   | 数据类型   | ① String<br />② List<br />③ Set<br />④ Zset<br />⑤ Hash      | ① 文本型<br />② 二进制类型  |
   | 操作类型   | ① 单个操作<br />② 批量操作<br />③ 事务支持（弱事务，结合Lua实现强事务）<br />④ 每个类型不同的curd | curd、少量其他命令          |
   | 附加功能   | ① 发布/订阅<br />② 主从高可用（哨兵、故障转移）<br />③ 序列化支持<br />④ 支持Lua脚本 | 多线程服务支持              |
   | 网络IO模型 | 执行命令--单线程<br />网络操作--多线程                       | 多线程、非阻塞IO模式        |
   | 持久化     | ① RDB<br />② AOF                                             | 不支持                      |

8. 怎么理解Redis中事务？<span id="question8"></span>

   Redis事务功能：

   * multi：事务开始
   * exec：事务结束
   * discard：事务回滚

   Redis事务功能很弱，在事务回滚机制上，Redis只对基本的语法错误进行判断，运行时错误无法判断，也就无法回滚。

   原因：Redis事务实现机制只是缓存了命令，没有缓存命令执行结果，所以遇到运行时异常时，前面的命令已经真正执行完成，所以无法回滚。

9. Redis的过期策略以及内存淘汰机制。<span id="question9"></span>

   * 过期策略

     Redis所有数据结构都可以设置过期时间（TTL），时间一到，就会自动删除，为了避免出现同一时间删除太多key导致出现卡顿，Redis使用了定时扫描和惰性删除两种策略来对key进行过期管理。

     * 定时扫描

       Redis会将每个设置了过期时间的key放入一个独立的字典中，之后会定时遍历这个字典来删除到期的key。Redis默认会每秒进行10次过期扫描，过期扫描不会遍历过期字典中所有key，而是采用了一种简单的贪心策略：

       ① 从过期字典中随机20个key；

       ② 删除这20个key中已过期的key；

       ③ 如果过期的key比率超过 $\frac{1}{4}$ 那就重复步骤①。

       :::warning 注意

       基于以上这种策略，如果一个大型的Redis实例中所有的key在同一时间过期了，这将导致Redis持续扫描过期字典（循环多次），直到过期字典中过期的key变得稀疏，才会停止（循环次数明显下降）。这就会导致线上读写请求出现明显的卡顿现象。导致这种卡顿的另外一种原因就是内存管理器需要频繁回收内存页，这也会产生一定的CPU消耗。所以业务开发人员一定要注意过期时间，如果有大批量的key过期，要给过期时间设置一个随机范围，而不能全部在同一时间过期。

       从库的过期策略（主从架构中）：从库不会定期扫描，从库对过期的处理事被动的。**主库**在key到期时，会在AOF文件里增加一条del指令，同步到所有的从库，从库通过执行这条del指令来删除过期的key。因为指令同步时异步进行的，所以主库过期的key的del指令没有及时同步到从库的话，，会出现主从数据不一致，主库没有的数据在从库里还存在，比如集群环境分布式锁的算法漏洞就是因为这个同步延迟产生的。

       :::

     * 惰性删除

       所谓惰性删除策略就是在客户端访问这个key的时候，Redis对key的过期时间进行检查，如果过期了就立即删除，不会返回任何东西。定期删除的策略特性很可能会导致很多过期key到了时间并没有被删除掉，惰性删除就是对定期删除的一种代偿和兜底机制。

   * 淘汰机制

     当Redis内存超出物理内存限制时，内存的数据会开始和磁盘产生频繁的交换（swap），交换会让Redis的性能急剧下降，对于访问量比较频繁的Redis来说，这样龟速的存取效率基本上等于不可用。

     在生产环境中，一般是不允许Redis出现交换行为的，为了限制最大使用内存，Redis提供了配置参数`maxmemory`来限制内存超出期望大小。当实际内存超出maxmemory时，Redis提供了几种可选策略（maxmemory-policy）来让用户自己决定该如何腾出新的空间以继续提供读写服务。

     ```shell
     # 配置策略的命令
     config set maxmemory-policy 策略名称
     # 查看当前策略
     config get maxmemory-policy
     ```

     * Noeviction（默认）

       该策略不会继续服务的写请求，读和删请求可以继续进行。这样可以保证不会丢失数据，但是会让线上的业务不能持续进行。

     * volatile-lru

       尝试使用LRU算法（Last Recently Use，最近最少使用）淘汰设置了过期时间的键，最少使用的键优先被淘汰。这样可以保证需要持久化的数据不会突然丢失。

       :::info 说明

       Redis使用的不是标准的LRU算法，它使用的是一种近似LRU算法，因为标准的LRU算法需要消耗大量额外内存，需要对现有的数据结构进行较大改造，近似LRU算法则比较简单，在现有的数据结构基础上使用随机采样法来淘汰元素，能达到和LRU算法非常近似的效果。Redis为实现近似LRU算法，它给每个键增加了一个额外小字段，这个字段的长度是24bit，也就是最后一次被访问的时间戳，当Redis执行写操作时，如果发现内存超出maxmemory，就随机取出5（可以配置maxmemory-samples）个键，然后淘汰掉最旧的key，如果淘汰后内存还是超出maxmemory，那就继续随机采样淘汰，直到内存低于maxmemory为止。

       ```shell
       config get maxmemory-samples
       config set maxmemory-samples count
       ```

       :::

     * volatile-ttl

       根据TTL大小优先淘汰TTL小的键。

     * volatile-random

       随机淘汰过期key集合中的键。

     * allkeys-lru

       使用LRU策略淘汰全体键。

     * allkeys-random

       随机淘汰任意键
       
     * allkeys-lfu

       使用LFU（Last Frequently Use），类比LRU，它的考量机制是访问频率。

     :::info 说明
     
     volatile-xxx策略只针对带过期时间的key，allkeys-xxx策略则针对所有的key。如果这是拿Redis做缓存，那因该使用allkeys-xxx，客户端写缓存时不必携带过期时间。如果还需要Redis的持久化功能，那就使用volatile-xxx策略，这样可以保留没有设置过期时间的key。
     
     :::

10. 什么是缓存穿透？如何避免？<span id="question10"></span>

    缓存穿透：接口查询数据时使用缓存，如果查询到不在缓存中的数据时，再去查询数据库（或者别的耗时的IO操作），但是如果有大批量用户/黑客不断查询数据库中不存在的数据，接口每次都执行复杂的IO操作，缓存失效，即为缓存穿透。

    如何避免缓存穿透：利用查询的目标数据关键字创建一个布隆过滤器（可利用Redis的BitMap实现），每次查询先通过布隆过滤器判断数据是否存在，不存在直接返回，存在才去查询缓存（还不存在进而查询数据库），由于布隆过滤器查询迅速，占用极低，对服务器没有多大影响，因此可以很好解决缓存穿透问题。

    :::warning 注意

    ① 布隆过滤器在Redisson已经实现，可以直接使用，如无特殊需求，尽量避免自己手动再去实现；

    ② 布隆过滤器由于哈希冲突等问题，其判判定存在的结果并非百分百准确，但是判断不存在的结果一定准确，其准确率取决于过滤器中数组大小和哈希算法。

    :::

11. 什么是缓存雪崩？如何避免？<span id="question11"></span>

    缓存雪崩：使用Redis缓存数据库中数据时（以数据库为例，也可以是其他需耗时的IO操作），如果Redis服务崩溃、Redis中大量key TTL到期或者其他原因导致Redis不可用致使每次取用数据都从数据库中查询的现象即为缓存雪崩。

    如何避免：① 引入Redis集群，布置好主从节点，确保Redis服务高可用从而避免单一Redis节点服务崩溃导致的缓存雪崩问题；

    ② 可在Redis前面再搭建一层缓存结果（例如EHCache纯内存），分担Redis部分压力；

    ③ 引入限流组件（例如hystrix），将流量限制在安全范围，减小Redis服务压力；

    ④ key的TTL使用随机值，避免大量key同时失效。

12. 使用Redis如何设计分布式锁？<span id="question11"></span>

    什么是锁？

    * 是一种并发控制机制，用于协调多线程（或多进程）对共享资源的访问，防止因同时读写导致的数据不一致、竞态条件（Race Condition）或数据损坏。其核心目标是**确保线程安全**，即在多线程环境下保持程序的正确性和数据的一致性。

    什么是分布式锁？

    * 分布式锁是一种在分布式系统（由多台独立计算机或服务节点组成）中协调多个节点对共享资源进行互斥访问的同步机制。其核心目标是确保在分布式环境下，**同一时刻只有一个节点能够访问或修改共享资源**，从而避免因并发操作导致的数据不一致、竞态条件或资源冲突问题。

    如何设计分布式锁？

    * 分布式锁需要满足以下特性：

      ① 互斥性，任意时刻仅有一个节点持有锁；

      ② 防死锁，锁需要设置超时限制，即使持有节点崩溃，锁也能自动释放；

      ③ 可重入性，同一节点可多次获取同一把锁，避免自我阻塞；

      ④ 高可用性，提供锁的服务需要支持故障转移，避免单点故障（如Redis集群或者zookeeper集群）；

      ⑤ 安全性，锁必须由持有者释放，避免其他节点误删。

    如何使用Redis设计分布式锁？

    * 最简单的Redis分布式锁，可以使用Redis的`SETNX`命令的互斥性，两个（以上）客户端进行同时执行这个命令，只有一个客户端可以执行成功，从而竞争到锁，其余客户端在锁释放前无法执行成功。注意要给该命令设置一个TTL，用以自动释放锁，避免死锁。

    使用Redis设计分布式锁会遇到的问题。

    * 锁过期时间不好评估如何解决？

      ① 在性能要求范围内尽量冗余过期时间，反正只要处理完成锁的持有者会主动释放锁，并且只有在持有锁的进程挂掉的时候才会真的需要等到过期时间才释放锁，这种场景比较少见。但是此方案仍然有一定性能真空风险且无法解决程序运行时间超出锁过期时间的风险。

      ② 看门狗，加锁时先设置一个过期时间，然后开启一个**守护线程**，定时去检测这个锁的失效时间，如果锁快要过期了，操作共享资源还未完成，那么就自动对所进行**续期**，重置过期时间，这个守护线程一般把它叫做**看门狗**线程。守护线程运行在客户端上，当客户端挂掉以后，没有相对应的守护线程去续期，锁就可以自然过期（有看门狗以后，过期时间不需要设置的非常大）。

    :::info 说明

    看门狗为什么使用守护线程？

    ① 防止死锁与资源泄露：若看门狗线程不是守护线程，当获取到锁的主线程（用户线程）崩溃时，JVM不会退出，看门狗线程会继续运行并无限续约锁的过期时间，导致锁永久无法释放形成死锁。

    ② 声明周期与主线程绑定：守护线程的生命周期依赖于用户线程，当所有用户线程结束时，JVM会强制终止守护线程，避免其称为“僵尸线程”。

    ③ 资源自动清理，方便管理：JVM退出时会释放所有资源（包括内存、文件句柄、分布式锁等），守护线程的自动终止确保了资源的及时回收。

    > PS：守护线程需在启动前设置（如 Java 的 `setDaemon(true)`），启动后不可更改。

    :::

13. 怎么使用Redis实现消息队列？<span id="question13"></span>

    ① 基于List的`LPUSH + BRPOP`的实现

    优点：足够简单，消费延迟几乎为0。

    缺点：

    * 空闲连接问题，如果线程一直阻塞在那里，Redis客户端的连接就成了闲置连接，闲置过久，服务器一般会主动断开连接，减少资源占中，这时`blpop`和`brpop`会抛出异常，所以在客户端编写客户消费时需要注意异常处理和重试问题。
    * 做消费者ACK麻烦，不能保证消费者消费消息后是否成功处理的问题（宕机或处理异常等），通常需要维护一个Pending列表，保证消息处理确认；不能做广播模式，如pub/sub，消息发布/订阅模型；不能重复消费，一旦消费就会被删除；不支持分组消费。

    ② 基于`Sorted-Set`的实现

    * 多用来实现延迟队列，当然也可以实现有序地普通的消息队列，但是消费者无法阻塞的获取消息，只能轮询，不允许重复消息。

    ③ `PUB/SUB`，订阅/发布模式

    优点：

    * 典型的广播模式，一个消息可以发布到多个消费者；多信道订阅，消费者可以同时订阅多个信道，从而接受多类消息；消息及时发送，消息不用等待消费者读取，消费者会自动接收到信道发布的消息。

    缺点：

    * 消息一旦发布，不能接收。即如果发布时客户端不在线，则消息丢失，不能寻回；
    * 不能保证每个消费者接受的时间是一致的；
    * 若消费者客户端出现消息积压到一定程度，会被强制断开，导致消息意外丢失，通常发生在消息的生产远大于消费速度时。可见，发布/订阅模式不适合做消息存储，消息积压类业务，而是擅长处理广播，即时通讯，及时反馈的业务。

    ④ 基于`Stream`类型的实现

    基本上已经有了一个消息中间件的雏形，可以考虑在生产过程中使用。

14. 什么是bigkey？会有什么影响？<span id="question14"></span>

    * bigkey：bigkey是指key对应的value所占的内存空间比较大，例如一个字符串类型的value最大可以存到512MB，一个列表类型的value最多可以存储$2^{32}-1$个元素。如果按照数据结构来细分的话，一般分为字符串类型bigkey和非字符串类型的bigkey。字符串类型的bigkey体现在单个value值很大，一般认为超过10KB就是bigkey，但是这个值还和具体的OPS相关；非字符串类型（哈希、列表、集合、有序集合）则体现在元素个数过多。

    * bigkey影响：bigkey无论是空间复杂度还是时间复杂度都不好，其危害主要体现在以下几个方面：

      * 内存空间不均衡，例如在Redis Cluster（Redis集群）中，这会造成集群各个节点的内存空间使用不均衡；
      * 超时阻塞，由于Redis单线程的特性，操作bigkey比较耗时，也就意味着阻塞Redis的可能性比较大；
      * 网络拥堵，每次获取bigkey产生的网络流量比较大。

    * 发现bigkey

      `redis-cli --bigkeys`命令可以统计bigkey的分布。

15. Redis如何解决key冲突？<span id="question15"></span>

    ① 业务隔离

    ② key的设计：`业务模块+分隔符+系统名称+分隔符+关键字`

    ③ 分布式锁：解决多个客户端对同一个key进行修改的情况

16. 怎么提高缓存命中率？<span id="question16"></span>

    ① 提前加载数据到Redis

    ② 增加缓存存储空间，提高缓存的数据量

    ③ 调整缓存的存储数据类型，例如使用Hash代替JSON String

    ④ 提升缓存的更新频次，例如监听MySQL数据库Binlog，当变化时推送消息到MQ，然后写一个MQ的消费者去及时更新缓存

17. Redis持久化方式有哪些？有什么区别？<span id="question17"></span>

    * RDB

      RDB，即Redis DataBase，它的持久化方式是把当前进程数据生成快照，存储到硬盘。其快照范围为Redis全部的内存数据。内存中数据越多，RDB文件就越大，往磁盘上写数据的时间开销就越大。

      Redis提供了两个手动命令来生成RDB文件，分别是`save`和`bgsave`。`save`是在主线程中执行，会导致阻塞，对于内存比较大的实例会造成长时间阻塞，线上环境不建议使用。`bgsave`则会创建一个子进程，专门用于写入RDB文件，避免了主线程的阻塞，这也是Redis RDB文件生成的默认配置。

      Redis中RDB导致的数据丢失问题：RDB操作之间有时间间隔，在这个间隔期间如果内存中的数据被修改并且在下一次快照之前Redis服务宕机，这将会导致被修改的数据丢失。为了解决这一问题，Redis引入了AOF持久化。

    * AOF

      AOF，即Append Only File，其持久化方式为以独立日志的方式记录每次写命令，重启时再重新执行AOF文件中的命令达到恢复数据的目的。AOF主要作用是解决了数据持久化的实时性，目前已经是Redis持久化的主流方式。

      使用AOF功能需要手动启用配置：`appendonly yes`，AOF文件名可以通过`appendfilename "filename.aof"`进行配置，默认为`appendonly.aof`，保存路径与RDB持久化方式一致，都通过`dir path`来指定。

    * RDB-AOF混合持久化

      由于AOF持久化性能没有RDB高，生产上一版使用RDB-AOF混合持久化。可以通过配置`aof-use-rdb-preamble yes`启用，配置启用后，如果执行`bgrewriteaof`命令，则会把当前内存中已有的数据弄成二进制放在aof文件中，这个过程模拟了RDB生成的过程，然后Redis后面有其他命令，在触发下次重写之前，依然采用AOF追加的方式将命令追加到该文件后面。

18. 为什么Redis需要把所有数据放到内存中？<span id="question18"></span>

    程序中各操作时间对比：

    |             操作              | 响应时间 |
    | :---------------------------: | :------: |
    |         打开一个站点          |   几秒   |
    | 数据库查询一条记录（有索引）  | 10毫秒+  |
    |    1.6GHz的CPU执行一条指令    | 0.6纳秒  |
    | 从机械磁盘**顺序读取**1MB数据 | 2-10毫秒 |
    | 从SSD磁盘**顺序读取**1MB数据  | 0.3毫秒  |
    |     从内存连续读取1MB数据     | 250微妙  |
    |        CPU读取一次内存        | 100纳秒  |
    |  1Gb/s网卡，网络传输2Kb数据   |  20微秒  |

    > 单位换算：$1\text{s}=1, 000\text{ms}=1, 000, 000{\micro s}=1, 000, 000, 000\text{ns}$
    >
    > 科学计数：$1\text{s}=10^3\text{ms}=10^6{\micro s}=10^9\text{ns}$

19. 如何保证缓存与数据库双写时的数据一致性？<span id="question19"></span>

    只要使用到缓存，无论是本地缓存还是Redis缓存，都会存在数据同步问题，并且都无法做到100%一致。

    首先明确，一致性问题主要是数据修改场景，如果是新增数据，数据会直接写到数据库中，不用对缓存做任何操作，此时缓存中本身就没有新增数据，而数据库中是最新值，缓存中查询不到数据才会去查询数据库，所以缓存和数据库是一致的。

    以下是几种方案及其特性分析：

    ① 先更新缓存，再更新数据库：这个方案一般不考虑，因为如果缓存更新成功，而数据库更新失败，这将导致缓存数据与数据库完全不一致，且很难察觉，因为缓存中数据一致存在。

    ② 先更新数据库，再更新缓存

    * 这个方案一般也不考虑，原因其实与上一个一样，数据库更新成功了，如果缓存更新失败，同样会出现缓存不一致问题（值修改失败）。
    * 并发问题：A和B都请求更新操作，然后A、B都先后更新了数据库，但是A、B两个请求更新缓存的顺序却不能保证与更新数据库的顺序一直，这就导致了并发问题。

    * 业务场景问题，如果一个写数据较多而读数据较少的场景，采用这种方案就会导致数据还没读取到缓存就被频繁更新，徒耗性能。

    ③ 先删除缓存，后更新数据库

    * 并发问题，A请求更新数据，B请求查询数据，当A请求到达后，会删除缓存，然后去更新数据库，在这期间（A的更新操作还未完成但是缓存已经删除），B请求到达，发现缓存中没有数据，于是去查询数据库，并查到旧值，然后更新缓存，之后A的更新操作完成，至此就导致了缓存与数据库数据不一致。

      解决方案：延迟双删，即先淘汰缓存，然后更新数据库，休眠1s，再次淘汰缓存。这一方案可以将1秒内造成的缓存脏数据再次删除，这个1秒的休眠时间具体根据业务的读数据耗时基础上加上几百毫秒即可。如果遇到读写分离的数据库架构，则将这个休眠时间改为读取时间和同步时间中较大值加上几百毫秒。

      这种方案导致了吞吐量降低解决方案：删除操作另起一个线程，异步删除，这样写入请求就不用等待一段时间后才返回响应。

      深入探讨：第二次删除操作失败如何解决？这就引出了第④种方案，先更新数据库，再删除缓存。

    ④ 先更新数据库，后删除缓存：这种方式被称为Cache Aside Pattern，读的时候，先读缓存，缓存没有再读取数据库，然后取出数据后放入缓存，同时返回响应。更新的时候，先更新数据库，然后再删除缓存。

    ① ②都是更新缓存，③④为删除缓存，到底是选择更新缓存还是淘汰缓存主要取决于更新缓存的复杂度，更新缓存的代价很小则此时更倾向于更新缓存，以保证更高的缓存命中率，如果更新缓存的代价很大，此时更倾向于淘汰缓存。一般在线上系统，都会选择淘汰缓存方案，因为删除/更新缓存的速度比DB操作快，所以一般情况下都会先更新DB，后删除缓存，因为这种情况下缓存不一致的情况只有可能是查询比删除慢导致，这种情况相对来说会少很多很多。同时结合延时双删处理，可以有效避免缓存不一致的情况。

    BTW：没有万金油的最优方案，使用哪个方案还是取决于具体的业务场景，确保最终一致性即可。

20. Redis集群方案应该怎么做？<span id="question20"></span>

    Redis Cluster是Redis的分布式解决方案，在3.0版本推出，有效解决了Redis分布式方面的需求，当遇到单机内存、并发、流量等瓶颈时，就可以考虑采用Cluster架构方案达到负载均衡的目的。Redis Cluster优雅地解决了Redis集群方面的问题（分区、路由、高可用、维护便利等）。

    * 虚拟槽分区

      Redis李永乐虚拟槽分区，是一种虚拟一致性哈希分区的变种，它使用分散度良好的哈希函数把所有数据映射到一个固定范围的整数集合中，整数定义为槽（slot）。这个范围一般远大于节点数，比如RedisCluster槽范围是0~16383.槽是集群内数据管理和迁移的基本单位。采用大范围槽的主要目的是为了方便数据拆分和集群扩展，每个节点会负责一定数量的槽。比如集群有三个节点，则每个节点平均大约负责5460个槽。由于采用高质量的哈希算法，每个槽映射的数据通常比较均匀，将数据平均分到5个节点进行数据分区。Redis Cluster就是采用虚拟槽分区。

      :::info 为什么槽的范围是0~16383？

      Redis作者在GitHub（[issue#2576](https://github.com/redis/redis/issues/2576)）上有对此进行解答：

      > The reason is:
      >
      > 1. Normal heartbeat packets carry the full configuration of a node, that can be replaced in an idempotent way with the old in order to update an old config. This means they contain the slots configuration for a node, in raw form, that uses 2k of space with16k slots, but would use a prohibitive 8k of space using 65k slots.
      > 2. At the same time it is unlikely that Redis Cluster would scale to more than 1000 mater nodes because of other design tradeoffs.
      >
      > So 16k was in the right range to ensure enough slots per master with a max of 1000 maters, but a small enough number to propagate the slot configuration as a raw bitmap easily. Note that in small clusters the bitmap would be hard to compress because when N is small the bitmap would have slots/N bits set that is a large percentage of bits set.

      Redis集群中，在握手成功后，两个节点之间会定期发送ping/pong消息，交换数据信息，集群中节点数量越多，消息体内容越大，比如说10个节点的状态信息约为1KB，同时Redis集群内节点每秒都在发ping消息。例如一个总结点数为200的Redis集群，默认情况下，这是ping/pong消息占用带宽将达到25M。那么如果槽位为65536，发送心跳信息的消息头达到8KB，发送的心跳包过于庞大，非常浪费带宽。其次，Redis的集群主节点数量基本不可能超过1000个，集群节点越多，心跳包的消息体内携带的数据越多。如果节点超过1000个，也会导致网络拥堵，因此Redis作者不建议Redis Cluster节点数量超过1000个。那么对于节点数在1000以内的Redis Cluster，16384个槽位够用了，可以确保每个master有足够的插槽，没有必要扩展到65536个。

      再者，Redis主节点配置信息中，它所负责的哈希槽是通过一张BitMap的形式来保存的，在传输过程中，会对BitMap进行压缩，但是如果BitMap的填充率（$\frac{\text{slots}}{N}$，N表示节点数）很高的话，也就是节点数很少而哈希槽数量很多，BitMap压缩率就很低，也会浪费资源。

      :::

    * 集群功能限制，Redis集群相对单机在功能上存在一些限制，需要开发人员提前了解，在使用时做好规避，限制如下：

      ① key批量操作支持有限。如mset、mget，目前只支持具有相同solt值的key执行批量操作，对于映射为不同solt值的key由于执行mset、mget等操作可能存在于多个节点上，因此不被支持。

      ② key事务操作支持有限。同理，只支持多key在同一节点上的事务操作，当多个key分布在不同的节点上时，无法使用事务功能。

      ③ key作为数据分区的最小粒度，因此不能将一个大的键值对如Hash、List等映射到不同节点。

      ④ 不支持多数据库空间。单机下的Redis可以支持16个数据库，集群模式下智能使用一个数据库空间，即db0。

      ⑤ 复制结构只支持一层，从节点只能复制主节点，不支持嵌套树状复制结构（即从节点下不能再连接子节点，所有从节点都连接主节点）

    * 搭建集群，集群搭建有如下几种方式：

      ① 依照Redis协议手动搭建，使用`cluster meet`、`cluster addslots`、`cluster replicate`命令。

      ② 5.0之前使用有ruby语言编写的redis-trib.rb，在使用前需要安装ruby语言环境。

      ③ 5.0开始，摒弃了redis-trib.rb，将搭建集群的功能合并到了redis-cli。

      前两种一般不用，因此以第三种为例，介绍搭建“三主三从”的Redis集群。集群中至少应该有奇数个节点，所以集群至少有三个节点，官方推荐三主三从的配置方式，以下为搭建一个三主三从Redis集群的操作步骤：

      * 节点配置

        规定，主节点端口为6900、6901、6902，从节点端口为6930、6931、6932。首先需要配置各个节点的conf文件，这个比较统一，所有节点的配置文件都类似，下面以主节点6900为例：

        ```shell
        port 6900
        
        pidfile /var/run/redis_6900.pid # 这个不分是为了在一台服务器上启动多台Redis服务（演示用的），相关的资源要改
        logfile "~/redis/redis/log/6900.log"
        dir "~/redis/redis/data/"
        dbfilename dump-6900.rdb
        
        # 集群配置（Cluster Config）
        daemonize yes
        cluster-enabled yes
        cluster-config-file nodes-6900.conf
        cluster-node-timeout 15000
        appendonly yes
        appendfilename "appendonly-6900.aof"
        ```

      * 创建集群

        ```shell
        redis-cli --cluster create ip:6900 ip:6901 ip:6902 ip:6930 ip:6931 ip:6932 --cluster-replicas 1
        ```

        `--cluster-replicas 1`参数为数字，1表示每个主节点需要1个从节点。

        通过该方式创建的带有从节点的机器不能够自己手动指定主节点，如果需要指定的话，需先创建好主节点后再添加从节点。

      * 指定主从节点

        ```
        # 创建主节点
        redis-cli --cluster create ip:6900 ip:6901 ip:6902
        # 添加从节点
        ```

      * 分配槽

      * 集群扩容：迁移槽和数据

      * 集群缩容：迁移槽和数据

      * 集群通信原理

      * 故障转移

      * 故障恢复

      * 故障转移时的选举流程

      * 集群读写分离（不建议再做，Redis默认从节点只读）

21. Redis集群方案什么情况下会导致整个集群不可用？<span id="question21"></span>

    为了保证集群完整性，默认情况下，当集群16384个槽任何一个没有指派到节点时，整个集群不可用（执行任何健命令返回（error）CLUSTERDOWN Hash slot not served错误）。这是对集群完整性的一种保护措施，保证所有的槽都指派在线的节点。但是当持有槽的节点下线时，从故障发现到自动完成转移期间整个集群都是不可用状态，对于大多数业务而言是无法容忍这种情况的，因此可以将参数`cluster-require-full-coverage`配置为`no`，当主节点故障时只影响它负责槽的相关命令的执行，不会影响其他主节点的可用性。但是从集群的故障转移原理来说，集群会出现不可用，当访问一个主节点和从节点都挂了的时候，`cluster-require-full-coverage=yes`会报槽无法获取；集群主库半数宕机（根据failover原理，fail掉一个主节点需要一半以上主节点都投票通过才可以）。

    另外，当集群主节点数小于3或者集群可用节点数为偶数的时候，基于fail的这种选举机制的自动主从切换过程可能会不能正常工作，一个师标记fail的过程，一个是选举新的主节点的过程，都有可能异常。

22. 说一说Redis哈希槽的概念。<span id="question22"></span>

    * 数据分布理论

      分布式数据库首先要解决把整个数据集按照分区规则映射到多个节点的问题，即把数据集划分到多个节点上，每个节点负责整体数据的一个子集。

      需要重点关注的是数据分区规则，常见的分区规则有哈希分区和顺序分区，哈希分区离散度好，数据分布业务无关，无法顺序访问；顺序分区离散度易倾斜，数据分布业务相关，可顺序访问。

    * 节点取余分区

      使用特定的数据，如Redis的键或用户ID，再根据节点数量N使用公式`hash(key)%n`计算哈希值，用来决定映射到哪一个节点上。这种方案当节点数量变化时，节点映射关系需要重新计算，回导致数据的重新迁移。

      这种方式的突出优点是简单性，常用于数据库的分库分表规则，一般采用预分区的方式，提前根据数据量规划好分区数。扩容时通常采用翻倍扩容，避免数据映射全部被打乱导致全量迁移的情况。

    * 一致性哈希分区

      一致性哈希分区（Distributed Hash Table）实现思路是为系统中每一个节点分配一个token，范围一般在0~$2^{32}-1$，这些token构成一个哈希环，数据读写执行节点查找操作时，现根据key计算哈希值，则顺时针找到第一个大于等于该哈希值的token节点。

      这种方式相比节点取余最大的好处就在于加入和删除节点只影响哈希环中相邻的节点，对其他节点无影响。但一致性哈希也存在一些问题，当节点较少时，节点变化将大范围影响哈希环中数据映射，因此这总方式不适合少量数据节点的分布式方案；增加节点只对下一个相邻节点有比较好的负载分担效果，同理，删除节点将会导致下一个节点负载压力倍增。

    * 虚拟一致性哈希分区

      为了在增删节点的时候，各节点能够保持动态均衡，将每个真实节点虚拟出若干个虚拟节点，再将这些虚拟节点映射到哈希环上。此时每个真实节点不再映射到环上，真实节点只用来存储键值对，它负责接应各自的一组环上的虚拟节点。当键值对进行存取路由时，首先路由到虚拟节点上，再由虚拟节点找到真实节点。如此就可以将局部的压力均衡到不同的节点，虚拟节点越多，分散性越好，理论负载就越趋于均匀。

    * **虚拟槽分区（Redis的哈希槽）**

      Redis就是李永乐虚拟槽分区，可以算是虚拟一致性分区的变种，它使用分散度良好的哈希函数把所有数据映射到一个固定范围的整数集合中（0~16383），整数定义为槽（slot）。

23. Redis集群会有写操作丢失吗？为什么？<span id="question23"></span>

    Redis主从复制原理：

    **![image-20250620070322263.png](/images/image-20250620070322263.png)**

    数据写入时，主节点会直接放回写入结果，对于写入请求来说已经写入完成，但是数据同步到从节点是异步的，此时才开始同步，在这个过程中，如果主节点宕机，则造成数据丢失，但是客户端得到的结果却是写入成功。

24. Redis常见性能问题和解决方案有哪些？<span id="question24"></span>

    ① 持久化性能问题：持久化时不管新老解决方案一定会涉及到磁盘的IO，就更容易出现性能问题。解决方案：采用集群，配置从节点持久化，主节点不要进行持久化操作。如果数据比较重要，则开启AOF持久化，从节点开启AOF，并且定为每秒同步一次。

    ② 主从复制过程中的网络IO开销。解决方案：尽量确保在同一个局域网中，减少网络开销。主库压力很大的情况下，尽量避免增加从库。与主库连接的从库避免使用网状接口，可以考虑使用线性结构，这样主库同步数据时只需要发送一次到从库上即可。

25. 热点数据和冷数据是什么？<span id="question25"></span>

    热数据：访问/修改频次极高的数据，常见的热数据有点赞数、收藏数等。（数据更新之前，至少读取了2次）

    冷数据：访问/修改频率很低的数据。

26. 什么情况下可能会导致Redis阻塞？<span id="question26"></span>

    * 全量查询的命令，`keys *`、`hgetall`、`smembers`等时间复杂度为O(N)的命令。
    * bigkey的删除
    * 清空库（flushdb、flushall）
    * AOF日志同步写
    * 从库加载RDB文件

27. 什么时候选择Redis，什么时候选择Memcached？<span id="question27"></span>

    绝大多数情况下都使用Redis，二者对比[详见上面面试题第7题](#question7)

28. Redis过期策略都有哪些？LRU算法知道吗？<span id="question28"></span>

    Redis过期策略[详见上面面试题第9题](#question9)，LRU算法即Last Recently Use，最近最少使用，是一种根据最近数据使用频率来进行淘汰的算法。

29. 说一下在你项目中的Redis的应用场景。<span id="question29"></span>

    简单消息队列、热点数据缓存、分布式锁、布隆过滤器等。

30. Redis是单线程还是多线程？<span id="question30"></span>

    [见第3题](#question3)

31. Redis存在线程安全的问题么？<span id="question31"></span>

    服务器内部不存在线程安全问题，外部无法保证，业务上需要自行保障

32. 遇到过缓存穿透么？<span id="question32"></span>

    [见第10题](#question10)

33. 遇到过缓存击穿么？<span id="question33"></span>

    缓存击穿：热点key过期（或者没有被缓存的key）突然被大量并发，请求全部打到数据库上

    解决：尽量在业务上避免这种情况，如果业务上不确定是否会出现这种情况，则为查询数据库的请求添加一个锁的机制，即如果多个请求查询数据库就让它们抢锁，未抢到锁的请求休眠等待（或者其他兜底机制，例如响应指定内容等），抢到锁的请求查询数据库并更新Redis缓存，然后其余请求回到查询Redis缓存那一步即可，未查到则重复抢锁机制即可。

34. 如何避免缓存雪崩？<span id="question34"></span>

    [见第11题](#question11)

35. Redis是怎么删除过期key的(缓存时如何回收的)？<span id="question35"></span>

    [见第9题](#question9)

36. 缓存是如何淘汰的？<span id="question36"></span>

    [见第9题](#question9)

37. 如何进行缓存预热？<span id="question37"></span>

38. 数据库与缓存不一致如何解决？<span id="question38"></span>

    [见第19题](#question19)

39. 简述一下主从不一致的问题。<span id="question39"></span>

    在缓存淘汰过程中，从库不会定期扫描，从库对过期的处理事被动的。**主库**在key到期时，会在AOF文件里增加一条del指令，同步到所有的从库，从库通过执行这条del指令来删除过期的key。因为指令同步时异步进行的，所以主库过期的key的del指令没有及时同步到从库的话，，会出现主从数据不一致，主库没有的数据在从库里还存在，比如集群环境分布式锁的算法漏洞就是因为这个同步延迟产生的。

40. 描述一下Redis持久化的方式。<span id="question40"></span>

    [见第17题](#question17)

41. 描述一下持久化原理。<span id="question41"></span>

    [见第17题](#question17)

42. 为什么使用setnx(Redis实现分布式锁的指令)？<span id="question42"></span>

    原生支持互斥，结合命令的expire参数，直接实现自动释放锁机制
