---
title: Java四大引用-强软弱虚
createTime: 2024/11/25 15:01:19
tags:
  - Java
  - 引用
  - 原理
---
# Java四大引用-强软弱虚

文章原文：[稀土掘金](https://juejin.cn/post/6844903665241686029)

Java执行GC判断对象是否存活有两种方式，一种是**引用计数器算法**，另一种是**可达性分析算法**。

> 引用计数：Java堆内存中，每个对象都有一个引用计数属性，引用每增加一次计数加一，引用每释放一次计数减一。

在jdk1.2之前的版本中，如果一个对象不被任何变量引用，那么程序就无法再使用这个对象，也就是说，只有对象处于可达状态（`reachable`）时，程序才能使用它。

从jdk1.2版本开始，对象引用就被划分为4种级别，从而使陈旭能更加灵活地控制**对象的生命周期**。这4中级别由高到低依次分为：强引用、软引用、弱引用、虚引用。

**![java_4reference](https://gitee.com/triabin/img_bed/raw/master/2024/08/12/776fa7195f07158299916f75edb52eea-java_4reference.png)**

## 1. 强引用（StrongReference）

强引用时最普遍的引用（赋值语句），如果一个对象具有强引用，那垃圾回收器绝不会会回收它。

```java
Object strongRef = new Object();
```

当内存空间不足时，JVM“宁愿”抛出OutOfMemoryError错误，使程序异常终止，也不会随意回收有强引用的对象来解决内存不足的问题。当强引用对象不使用（需要回收）时，需要弱化引用状态从而使GC能够回收它（注意是能够回收，不是立刻回收），要弱化引用有两个方法，一种是直接将指向对象的变量直接置空，直接释放引用；另一种是使其超出对象的生命周期范围，例如，在一个方法内部有一个强引用，方法执行时，这个引用（变量）保存在Java的栈内存中，其指向的对象保存在Java堆内存中，当方法运行结束后，就会退出方法栈，此时这个对象的引用数变为0，这个对象就能够被GC回收了。

> 平时编程过程中，如果不是全局便量，几乎不需要去考虑这个问题，但是如果是全局变量（程序运行期间始终存在的变量），则需要考虑释放内存操作，`static`、`final`等需要重点考虑。

减弱引用的一个典型应用：`ArrayList`类的`clear()`方法。

```java
public void clear() {
    modCount++;

    // clear to let GC do its work
    for (int i = 0; i < size; i++)
        elementData[i] = null;

    size = 0;
}
```

`ArrayList`定义了一个数组`elementData`来存放数据，当调用`clear()`清空`ArrayList`时，该方法实际是将`elementData`数组每一个数组元素都直接置空。

> 不直接将`elementData`数组置空的原因：
>
> 1. 即使将其直接置空，也只是切断了`elementData`对数组的引用，数组每个元素对堆内存中对象的引用并未及时释放，强引用仍然存在；
> 2. 将`elementData`置空后，`ArrayList`后调用`add()`方法重新添加元素又需要重新扩容，`ArrayList`的扩容操作比较占用性能。

## 2. 软引用（SoftReference）

软引用与强引用的区别：**当内存空间不足时，软引用的对象会被GC回收**。

> 软引用可以用来实现内存敏感的高速缓存

在Java代码中的使用方式：

```java
Object strongRef = new Object();
// 软引用
SoftReference<Object> softRef = new SoftReference<>(strongRef);
```

软引用可以和引用队列（`ReferenceQueue`）联合使用。创建软引用对象时，声明引用队列，当软引用被GC回收时，JVM会将引用放入队列中，这样通过这个队列可以监控软引用的状态，当软引用对象被GC回收时，以便及时做一些相应的操作（例如释放那个对象持有的文件句柄、数据库连接，打印日志以便追溯，事件通知，及时处理对象持有的敏感信息等等）。

```java
Object strongRef = new Object();
ReferenceQueue<Object> queue = new ReferenceQueue<>();
// 软引用并配合使用引用队列
SoftReference<Object> softRef = new SoftReference<>(strongRef, queue);
```

当内存不足时，JVM会首先将软引用对象置空，然后通知GC进行回收（只是通知，不是立刻回收，相当于`System.gc()`），也就是说，垃圾回收线程会在虚拟机抛出`OutOfMemoryError`之前收回软引用对象，而虚拟机会尽可能优先收回长时间闲置不用的软引用对象，对于那些刚刚构建或使用过的“较新的”软引用对象，虚拟机会尽可能地保留。

## 3. 弱引用（WeakReference）

弱引用于软引用的区别：只具有弱引用的对象拥有更短暂的生命周期，在垃圾回收线程扫描它所管辖的内存区域的过程中，一旦发现了只具有弱引用的对象，**不管当前内存空间充足与否，都会回收它的内存**。不过，由于垃圾回收器是一个优先级很低的线程，因此不一定会很快发现那些只具有弱引用的对象。

弱引用的创建：

```java
String str = "Java Reference";
WeakReference<String> weakReference = new WeakReference<>(str);
```

> 注意：如果一个对象很少使用，并且希望在使用时随时能获取到，但又不想影响此对象的垃圾回收，那么就可以使用弱引用来记住这个对象。

弱引用变强引用：

```java
String str = "Java Reference";
WeakReference<String> weakRef = new WeakReference<>(str);
String strongRef = weakRef.get();
```

> Tips：弱引用同样可以联合引用队列使用，使用方法与软引用类似。

## 4. 虚引用（PhantomReference）

虚引用顾名思义，就是形同虚设。与其他集中引用都不同，虚引用并不会决定对象的生命周期，如果一个对象仅持有虚引用，那么它就和没有任何引用一样，在任何时候都可能会被垃圾回收器回收。

应用场景：虚引用主要用来跟踪对象被垃圾回收器回收的活动，虚引用与软引用和弱引用的区别在于，虚引用必须和引用队列联合使用，当垃圾回收器准备回收一个对象时，如果发现它还有虚引用，就会在回收对象的内存之前，把这个虚引用加入到与之相关联的引用队列中。

```java
String str = "Java Reference";
ReferenceQueue<String> queue = new ReferenceQueue<>();
// 创建虚引用并关联队列
PhantomReference phantomRef = new PhantomReference(str, queue);
```

程序可以通过判断引用队列中是否加入了虚引用来判断被引用对象是否将要进行垃圾回收。如果程序发现某个虚引用那个已经被加入了引用队列，那么就可以在所引用的对象的内存被回收之前采取必要的行动。

## 总结

> Java中4中引用的级别和强度由高到低依次为：强引用 -> 软引用 -> 弱引用 -> 虚引用

当垃圾回收器回收时，某些对象会被回收，某些不会，垃圾回收器会从根对象`Object`来标记存活的对象，然后将某些不可达的对象和一些引用对象进行回收。

| 引用类型 | 被GC回收的时间 | 用途               | 生存时间          |
| -------- | -------------- | ------------------ | ----------------- |
| 强引用   | 从来不会       | 对象的一般状态     | JVM停止运行时终止 |
| 软引用   | 当内存不足时   | 对象缓存           | 内存不足时终止    |
| 弱引用   | 正常垃圾回收时 | 对象缓存           | 垃圾回收后终止    |
| 虚引用   | 正常垃圾回收时 | 跟踪对象的垃圾回收 | 垃圾回收后终止    |

