---
title: Java基础（下）
order: 2
---

# Java基础（下）

## 11、集合

数组的弊端：

* 长度一旦确定，不管索引位置上是否需要存放数据都需要占用内存空间，并且长度一旦固定就不可变；
* 只能使用连续的内存区域，对于那些离散的、分布在物理内存各个位置的空间无法很充分的使用；
* 一个数组只能存放一种数据类型（当然，这应该算优点）。

集合与数组区别：

* 数组可以存基本数据类型和引用数据类型，集合只能存储引用数据类型；
* 数组长度固定，集合长度可变

### 11.1 Java中集合的体系结构

![image-20260115173710728](https://gitee.com/triabin/img_bed/raw/master/2026/01/15/df5e93e64ebfc88cf64daa79bcd782ed-image-20260115173710728.png)

<div style="clear: both;"></div>

Java中有很多种集合，但是总体上可以分为两类，以`java.util.Collection`接口为首的单列集合和以`java.util.Map`接口为首的双列集合。

单列集合：每次添加元素只有一个元素，或者说加入的数据只有“一列”

双列集合：每次添加元素都是一个键值对，加入的数据有“两列”

### 11.2 Collection系列集合

以下为`java.util.Collection`接口在JDK中的实际继承关系图：

<img src="https://yanglukuan.github.io/images/arrayList/Collections.png" alt="Java集合框架"/>

<div style="clear: both;"></div>

但是我们暂时需要学的只有两大类，一个是`java.util.List`接口下的，一个是`java.util.Set`接口下的：

![image-20260115184028417](https://gitee.com/triabin/img_bed/raw/master/2026/01/15/52aa605442605e7ad204fb998b2f5480-image-20260115184028417.png)

<div style="clear: both;"></div>

`List`系列集合：添加的元素有序、可重复、有索引，当然这里的有序指的是存放顺序，其中`Vector`基本已经弃用。

`Set`系列集合：添加的元素无序、不可重复、没有索引。

`Collection`是单列集合的祖宗接口，它的功能是全部单列集合都可以继承使用的。常见方法：

|            方法名            |               说明               |
| :--------------------------: | :------------------------------: |
|  `public boolean add(E e)`   |   把指定的对象添加到当前集合中   |
|    `public void clear()`     |       清空集合中所有的元素       |
| `public boolean remove(E e)` |   把给定的对象在当前集合中删除   |
| `public boolean contains()`  | 判断当前集合中是否包含给定的对象 |
|  `public boolean isEmpty()`  |       判断当前集合是否为空       |
|     `public int size()`      | 返回集合中元素的个数/集合的长度  |

使用说明：

* `public boolean add(E e)`，在`List`集合中，这个方法始终返回`true`，因为它是允许重复的，如果是`Set`集合，当重复添加时，因为不允许重复，会导致添加元素失败。
* `public boolean remove(E e)`，因为是`Collection`中定义的通用方法，而`Set`集合中没有索引，所以只能通过元素进行删除，返回一个`boolean`类型的值，不存在的时候会删除失败。
* `public boolean contains()`，底层依赖`equals()`方法进行比较，如果是自定义的对象，注意重写`equals`方法。

`Collection`的遍历方式：从`Collection`继承关系中可以看到，它实现了`Iterable`接口，因此它可以通过迭代器遍历，此外还有增强for循环、Lambda表达式等遍历方式。（普通for循环只有`List`系列集合能使用，`Set`系列集合没有索引无法使用）

* 迭代器遍历：迭代器在Java中的类是`java.util.Iterator`，迭代器是集合专用的遍历方式，它不依赖索引。由于`Collection`继承了`Iterable`接口，因此它的所有实现类都必须重写`Iterator<T> iterator();`方法，调用该方法即可返回`Iterator`对象，默认指向当前集合的0索引。`Iterator`中常用的方法：

  |          方法名称          |                             说明                             |
  | :------------------------: | :----------------------------------------------------------: |
  | `public boolean hasNext()` | 判断当前位置是否有元素，有元素返回`true`，没有元素返回`false` |
  |     `public E next()`      |       获取当前位置的元素，并将迭代器对象移向下一个位置       |
  |   `public void remove()`   |        利用迭代器，删除集合中当前迭代器指针指向的元素        |

  使用说明：`Iterator`接口的实现类中，使用字段`cursor`记录迭代器当前指向的索引，`lastRet`记录上次取值的索引，每当调用`next()`方法的时候，将`cursor`对应的索引值取出，`cursor`的值赋值给`lastRet`，再将`cursor`加1，有了这些逻辑，当调用`hasNext()`方法的时候，直接判断`cursor`是否等于集合的长度即可，如果相等则代表已经没有下一位了，不能再调用`next`，不相等则还有下一位元素，可以直接调用`next`方法返回该索引的值。

  注意事项：

  * 当指针到达末尾，再调用`next`方法，则报`NoSuchElementException`异常
  * 迭代器遍历完毕，指针不会复位，如果想再次遍历，只能使用集合对象再次调用`iterator`方法创建一个新的迭代器对象
  * 迭代器遍历时，不能调用集合自身的`remove`方法删除元素，但是可以调用迭代器对象的`remove`方法删除元素，该方法会去修改结合对象中的参数，避免报`ConcurrentModificationException`异常，当然，也不能添加元素。
  * 在循环中，最好调用一次`next`方法，不然遇到边界就会触发`NoSuchElementException`异常
  * 关于`modCount`，该字段主要用来记录集合变化次数（相当于版本号），在集合中，每`add/remove`一次，这个变量的值都会自增。在迭代器中，创建迭代器对象时，会传入并记录这个值，每次`next`都会检查一遍当前集合中的`modCount`与传入时的值是否相等，不等就抛出并发修改异常，这也是不能再迭代过程中调用集合自身的增删方法的原因

* 增强for循环：底层其实就是一个迭代器，增强for循环其实就是为了简化迭代器书写的（JDK5新增），所有的单列集合和数组都能使用增强for循环来遍历，格式为`for (元素数据类型 变量名 : 数组/集合对象) { ... }`

  注意事项：

  * 与迭代器一样，也不能在遍历期间调用集合自身`remove`方法对其进行修改或者添加元素
  * 增强for循环中的变量名只是一个形参，给形参重新赋值不影响集合中的元素，当然，如果是修改形参指向的对象中的属性肯定有效

  > IDEA快速生成for循环代码模板：
  >
  > ① `fori + 回车（在弹窗出来的时候回车）`，快速进入`for (int i = 占位; i < 占位; i++) {}`的代码模板，占位位置填完后回车即可进入下一个占位位置，不填写则是有默认值就使用默认值，没有默认值就空着（关于IDEA代码模板的编写，以后有空再详述）；
  >
  > ② `数组/单列集合对象.for + 回车`，快速进入增强for循环代码模板。

* Lambda表达式：JDK8引入Lambda表达式时，提供的一种更简洁直接的遍历方式，主要依托于`Iterable`接口中新增的`default void forEach(Consumer<? super T> action)`方法，该方法通过一个`Consumer`接口，接收一个用于处理可迭代对象中每一个元素的方法即可完成遍历。

三种遍历方式演示：

```java
public class CollectionDemo {
    public static void main(String[] args) {
        Collection<Integer> list = new ArrayList<>(Arrays.asList(18, 2, 8, 50, 30, 22, 41, 44, 17, 12));

        // 1. 迭代器遍历
        System.out.print("迭代器遍历：");
        Iterator<Integer> iterator = list.iterator();
        while (iterator.hasNext()) {
            Integer item = iterator.next();
            System.out.print(item + " ");
        }
        System.out.println();

        // 2. 增强for循环遍历
        System.out.print("增强for循环遍历：");
        for (Integer item : list) {
            System.out.print(item + " ");
        }
        System.out.println();

        // 3. Lambda表达式遍历
        System.out.print("Lambda表达式遍历：");
        list.forEach(item -> System.out.print(item + " "));
        System.out.println();
    }
}
```

### 11.3 List系列集合

List集合特有的方法：由于`List`有索引，因此除了`Collection`中继承而来的方法外，它还多了许多索引相关的特有方法。

|                方法名称                 |                  说明                  |
| :-------------------------------------: | :------------------------------------: |
| `public void add(int index, E element)` |   在此集合中的指定位置插入指定的元素   |
|      `public E remove(int index)`       |       删除指定索引处的元素并返回       |
|  `public E set(int index, E element)`   | 修改指定索引处的元素，返回被修改的元素 |
|        `public E get(int index)`        |          返回指定索引处的元素          |

使用说明：

* `public void add(int index, E element)`，将元素插入指定位置，原来元素依次后移一位索引。
* `public E remove(int index)`，如果是`Integer`类型的集合，调用`remove`方法时如果调用的是`Collection`中的`remove`方法，需要注意需要手动装箱。（调用方法的时候，如果出现了重载现象，优先调用实参跟形参类型一致的那个方法）

List集合的遍历方法：除了`Collection`中的三种遍历方法，`List`集合还有另外两种遍历方式，普通for循环和列表迭代器。

* 普通for循环主要依托于`List`的`get(int index)`方法和`size()`方法。
* 列表迭代器`java.util.ListIterator`，继承`Iterator`，相比普通迭代器，它多出了获取索引和向前移动指针的以及修改元素的方法。

List相关的数据结构：在学习List系列集合的具体实现之前需要先了解和其相关的几种数据结构，主要是线性数据结构栈、队列、数组和链表。关于数据结构的学习其实只需要知道数据结构“长什么样子”、如何添加和删除数据即可。

* 栈`stack`：后进先出，先进后出，先存入其中的数据最后被取出来，JVM内存中的栈空间使用的就是这种结构。
  * 数据进入栈模型过程称为压/进栈
  * 数据离开栈模型过程成为弹/出栈
  * 最顶部元素称为栈顶元素
  * 最底部元素称为栈底元素
* 队列`queue`：先进先出，后进后出，存入顺序与取出顺序相同
  * 存入数据：入队列
  * 取出数据：出队列
* 数组`array`：相同类型的元素存储在连续的内存空间中，通过索引（实际上是数组对象地址的偏移量）访问元素
  * 查询速度快，查询数据通过地址值和索引定位，查询任意数据耗时相同（移位极快）
  * 删除效率低：要将原始数据删除，同时后面每个数据前移
* 链表`linked list `：每个元素都是一个节点，节点之间通过“引用”相连接，引用记录了下一个节点的内存地址（迭代器对象其实本质就是一个链表）
  * 第一个节点叫做头结点，最后节点叫做尾节点
  * 与数组相反，由于其数据结构特性，链表查询效率低（需要遍历），增删效率高（修改节点指向即可）
  * 特殊的链表：双向链表、环形链表（首尾相连）
  * 相较于数组，链表不需要连续的内存区间，可以将内存中离散的内存区域使用起来

#### ArrayList

结合JDK API文档中关于这个类的构造方法和类方法列表，可以初步了解该类的使用：

| 构造方法和方法描述                                           |
| ------------------------------------------------------------ |
| `ArrayList()`  构造一个初始容量为十的空列表。                |
| `ArrayList(Collection<? extends E> c)`  构造一个包含指定集合的元素的列表，按照它们由集合的迭代器返回的顺序。 |
| `ArrayList(int initialCapacity)`  构造具有指定初始容量的空列表。 |

> 泛型：可以限定集合中要存储的数据类型，格式为在类名后面使用`<E>`，尖括号中的`E`就是要存储的数据类型，并且这个泛型只能是引用数据类型，基本数据类型只能用它们的包装类型。

```java
public class CollectionDemo {
    public static void main(String[] args) {
        // ArrayList<String> list = new ArrayList<String>(); // JDK7以前
        ArrayList<String> list = new ArrayList<>(); // JDK7以后
        
        System.out.println(list); // []
        // 由于这个类底层已经做了一些处理（实现了toString()方法），打印对象不是地址值，而是集合中存储的数据内容，并且在展示时会使用中括号包裹。
    }
}
```

成员方法：

| 返回值类型        | 方法名和方法描述                                             |
| ----------------- | ------------------------------------------------------------ |
| `boolean`         | `add(E e)`  将指定的元素追加到此列表的末尾。                 |
| `void`            | `add(int index, E element)`  在此列表中的指定位置插入指定的元素。 |
| `boolean`         | `addAll(Collection<? extends E> c)`  按指定集合的Iterator返回的顺序将指定集合中的所有元素追加到此列表的末尾。 |
| `boolean`         | `addAll(int index,  Collection<? extends E> c)`  将指定集合中的所有元素插入到此列表中，从指定的位置开始。 |
| `void`            | `clear()`  从列表中删除所有元素。                            |
| `Object`          | `clone()`  返回此 `ArrayList`实例的浅拷贝。                  |
| `boolean`         | `contains(Object o)`  如果此列表包含指定的元素，则返回 `true` 。 |
| `void`            | `ensureCapacity(int minCapacity)`  如果需要，增加此 `ArrayList`实例的容量，以确保它可以至少保存最小容量参数指定的元素数。 |
| `void`            | `forEach(Consumer<? super E> action)`  对 `Iterable`的每个元素执行给定的操作，直到所有元素都被处理或动作引发异常。 |
| `E`               | `get(int index)`  返回此列表中指定位置的元素。               |
| `int`             | `indexOf(Object o)`  返回此列表中指定元素的第一次出现的索引，如果此列表不包含元素，则返回-1。 |
| `boolean`         | `isEmpty()`  如果此列表不包含元素，则返回 `true` 。          |
| `Iterator<E>`     | `iterator()`  以正确的顺序返回该列表中的元素的迭代器。       |
| `int`             | `lastIndexOf(Object o)`  返回此列表中指定元素的最后一次出现的索引，如果此列表不包含元素，则返回-1。 |
| `ListIterator<E>` | `listIterator()`  返回列表中的列表迭代器（按适当的顺序）。   |
| `ListIterator<E>` | `listIterator(int index)`  从列表中的指定位置开始，返回列表中的元素（按正确顺序）的列表迭代器。 |
| `E`               | `remove(int index)`  删除该列表中指定位置的元素。            |
| `boolean`         | `remove(Object o)`  从列表中删除指定元素的第一个出现（如果存在）。 |
| `boolean`         | `removeAll(Collection<?> c)`  从此列表中删除指定集合中包含的所有元素。 |
| `boolean`         | `removeIf(Predicate<? super E> filter)`  删除满足给定谓词的此集合的所有元素。 |
| `protected void`  | `removeRange(int fromIndex,  int toIndex)`  从这个列表中删除所有索引在 `fromIndex` （含）和  `toIndex`之间的元素。 |
| `void`            | `replaceAll(UnaryOperator<E> operator)`  将该列表的每个元素替换为将该运算符应用于该元素的结果。 |
| `boolean`         | `retainAll(Collection<?> c)`  仅保留此列表中包含在指定集合中的元素。 |
| `E`               | `set(int index, E element)`  用指定的元素替换此列表中指定位置的元素。 |
| `int`             | `size()`  返回此列表中的元素数。                             |
| `void`            | `sort(Comparator<? super E> c)`  使用提供的 `Comparator`对此列表进行排序以比较元素。 |
| `Spliterator<E>`  | `spliterator()`  在此列表中的元素上创建late-binding和故障快速Spliterator。 |
| `List<E>`         | `subList(int fromIndex,  int toIndex)`  返回此列表中指定的 `fromIndex` （包括）和  `toIndex`之间的独占视图。 |
| `Object[]`        | `toArray()`  以正确的顺序（从第一个到最后一个元素）返回一个包含此列表中所有元素的数组。 |
| `<T> T[]`         | `toArray(T[] a)`  以正确的顺序返回一个包含此列表中所有元素的数组（从第一个到最后一个元素）;  返回的数组的运行时类型是指定数组的运行时类型。 |
| `void`            | `trimToSize()`  修改这个 `ArrayList`实例的容量是列表的当前大小。 |

可以看到，`ArrayList`的成员方法非常多，但是总的来说，（对于这些用于存储多条数据的数据结构）其成员方法可以归咎与四类，分别是增、删、改、查，将这四类方法学会使用后，其余方法可以在使用到的时候再去查看方法注释即可（并且，这类方法连名字都大同小异）。

演示说明代码：

```java
/*
     boolean add(E e)       增
     
     boolean remove(E e)    删
     E remove(int index)
     
     E set(int index, E e)  改
     
     E get(int index)       查
     int size()             获取长度
 */
public class CollectionDemo {
    public static void main(String[] args) {
        // 1、创建一个集合
        ArrayList<String> list = new ArrayList<>();
        
        // 2、添加元素
        boolean addRes = list.add("aaa");
        System.out.println(addRes); // true，这个返回值一般不使用
        System.out.println(list);
        list.add("ccc");
        list.add("aaa");
        list.add("bbb");
        
        // 3、删除元素
        boolean delRes = list.remove("aaa");
        System.out.println(delRes);
        System.out.println(list); // 第一个“"aaa"”元素被删除
        System.out.println(list.remove("ddd")); // false，元素不存在，删除失败
        // ArrayList是有索引的，与数组一样，索引也是从0开始
        String delEle = list.remove(0);
        System.out.println(delEle); // ccc
        System.out.println(list);
        
        // 4、修改元素
        String setRes = list.set(1, "BBB");
        System.out.println(setRes); // bbb，它会将被覆盖的值返回
        System.out.println(list);
        
        // 5、查询
        String getRes = list.get(0);
        System.out.println(getRes); // aaa
        // 遍历
        for (int i = 0; i < list.size(); i++) {
            System.out.println(list.get(i));
        }
    }
}
```

> 一旦访问到`ArrayList`中不存在的索引，也会报索引越界异常`java.lang.IndexOutOfBoundsException`。

`ArrayList`底层原理：

* 利用空参构造创建集合，会在底层创建一个默认长度为0的数组`elementData`，初始化成员变量`size`为0。
* 添加第一个元素时，底层会创建一个新的长度为10的数组，并在数组的`size++`位置存入第一个元素（`size`既表示下一个元素在数组中的索引，也表示集合长度）。
* 存满时，数组将扩容1.5倍（创建新数组，拷贝旧数据）。
* 如果一次添加多个元素并且1.5倍还放不下，则新建的数组长度以实际为准。
* 如果利用有参构造方法`public ArrayList(int initialCapacity)`创建集合，则是直接先创建长度为`initialCapacity`数组，可以有效避免中间的扩容操作，节约性能。
* 如果利用有参构造方法`public ArrayList(Collection<? extends E> c)`创建集合，则是将传入的集合`c`转为数组，再赋给`elementData`。

扩容源码分析：

* 调用空参`grow()`，空参中调用有参`grow(size + 1)`；

* `size + 1`作为最小需要扩容的空间，如果老容量不满足条件`oldCapacity > 0 || elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA`，则表示第一次扩容，直接扩容为`new Object[Math.max(DEFAULT_CAPACITY, minCapacity)]`即可，其中`DEFAULTCAPACITY_EMPTY_ELEMENTDATA`表示空参构造创建时初始化的默认空数组；

* 如果满足条件`oldCapacity > 0 || elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA`，则调用`int newCapacity = ArraysSupport.newLength(oldCapacity, minCapacity - oldCapacity, oldCapacity >> 1);`，然后利用`Arrays.copyOf(elementData, newCapacity)`复制老数据。其中`newLength`方法体为：

  ```java
  public static int newLength(int oldLength, int minGrowth, int prefGrowth) {
      // preconditions not checked because of inlining
      // assert oldLength >= 0
      // assert minGrowth > 0
  
      int prefLength = oldLength + Math.max(minGrowth, prefGrowth); // might overflow
      if (0 < prefLength && prefLength <= SOFT_MAX_ARRAY_LENGTH) {
          return prefLength;
      } else {
          // put code cold in a separate method
          return hugeLength(oldLength, minGrowth);
      }
  }
  ```

  其中，`int prefLength = oldLength + Math.max(minGrowth, prefGrowth);`表示扩容量为最小需要扩容容量和默认扩容容量中的较大值。而传参中的`oldCapacity >> 1`表示`oldCapacity`的一半，这也是默认扩容1.5倍的原因。

#### LinkedList

`java.util.LinkedList`底层是一个双向链表，查询慢，增删快，但是如果操作的是首尾元素，速度也是极快的，因此`LinkedList`本身多了很多直接操作首尾元素的特有API：

|          特有方法           |               说明               |
| :-------------------------: | :------------------------------: |
| `public void addFirst(E e)` |    在该列表开头插入指定的元素    |
| `public void addLast(E e)`  |  将指定的元素追加到此列表的末尾  |
|    `public E getFirst()`    |     返回此列表中的第一个元素     |
|    `public E getLast()`     |    返回此列表中的最后一个元素    |
|  `public E removeFirst()`   |  从此列表中删除并返回第一个元素  |
|   `public E removeLast()`   | 从此列表中删除并返回最后一个元素 |

当然，这些API了解即可，用得较少，有`Collection`和`List`中的那些API已经基本够用了。

由于`LinkedList`是一个双向链表，因此它的每个节点主要有三个部分，即节点自身数据`E item`、下一个节点的地址`Node<E> next`和前一个节点的地址`Node<E> prev`。

底层原理：

* 维护了三个成员变量，`transient int size = 0;`、`transient Node<E> first;`、`transient Node<E> last;`用来存储链表大小、头结点和尾节点。（`transient`关键字修饰的成员变量不会被序列化，既不会随着网络传输，包括数据库的IO。`Node`为`LinkedList`私有化内部类）
* 调用`add`方法时，底层调用了`linkLast`方法，直接操作尾节点的`next`指向要添加的元素以及将要添加元素创建节点的`prev`指向尾节点`final Node<E> newNode = new Node(last, e, null);`，然后修改尾节点为新创建的节点`last = newNode;`。
* 此外，底层也有相应的`linkBefore`方法来操作头结点。

### 11.4 泛型

泛型：是JDK5引入的特性，可以在编译阶段约束操作的数据类型，并进行检查，格式为`<数据类型>`。

注意：泛型只支持引用数据类型。

在引入泛型之前，集合中可以加入任意类型数据，导致了在使用集合时还需要强转数据，否则无法使用存入的实际数据类型的特有方法，只能使用`Object`中的方法。但是每次强转既麻烦又不安全。

泛型的好处：

* 统一数据类型
* 把运行时的问题提前到编译时，避免了强制类型转换可能出现的异常

扩展知识点：Java中泛型是伪泛型，前面提到的集合底层原理时，其中的`elementData`数组实际上就是`Ojbect`数组，只不过在取的时候进行了强转`return (E) elementData[index];`，之所以这样设计，最初也是为了向上兼容，因为当时已经有很多Java项目在运行，所以需要兼容旧的代码。

泛型使用细节：

* 泛型中不能写基本数据类型
* 指定泛型的具体类型后，传递数据时，可以传入该类型或者其子类型
* 如果不写泛型，类型默认是Object

泛型的的使用：泛型可以在很多地方进行定义，它可以定义在类后面（泛型类）、方法上面（泛型方法）和接口后面（泛型接口）。

#### 泛型类

使用场景：当一个类中，有变量的数据类型不确定时，就可以定义带有泛型的类，格式为`修饰符 class 类名<类型1, 类型2, ...> {}`，例如前文中的`ArrayList`其源码为`public class ArrayList<E> extends AbstractList<E> implements List<E>, RandomAccess, Cloneable, java.io.Serializable {`，当创建`ArrayList`对象的时候，`E`代表的类型才被确定，这里的`E`可以理解为一个变量或者说占位符，但是这个变量不是用来记录数据的，而是用来记录类型的。

类后面声明的泛型，在整个类中都可使用。

> 常用泛型变量：
>
> * `T`：Type，无意义的泛型类型最常用
> * `E`：Element，一般用来表示元素类型
> * `K`：key，一般用来表示键值对中的键
> * `V`：value，一般用来表示值

应用举例：定义一个网络响应的类。

```java
package com.triabin.ideasy_server.common.dto;

import lombok.Getter;

/**
 * 类描述：前后端交互响应类
 * @author Triabin
 * @date 2021-07-14 13:46:20
 */
@Getter
public class Response<T> {

    /**
     * 响应码，说明：响应码最好使用Integer，因为null和0的含义不一样
     */
    private Integer code;

    /**
     * 提示信息
     */
    private String msg;

    /**
     * 响应携带数据
     */
    private T data;

    public Response(Integer code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    public static <T> Response<T> success() {
        return new Response<>(200, "success", null);
    }

    public static <T> Response<T> success(T data) {
        return new Response<>(200, "success", data);
    }

    public static <T> Response<T> success(String msg, T data) {
        return new Response<>(200, msg, data);
    }

    public static <T> Response<T> fail() {
        return new Response<>(400, "fail", null);
    }

    public static <T> Response<T> fail(String msg) {
        return new Response<>(400, msg, null);
    }

    public static <T> Response<T> error() {
        return new Response<>(500, "error", null);
    }

    public static <T> Response<T> error(String msg) {
        return new Response<>(500, msg, null);
    }

    public Integer getCode() {
        return code;
    }

    public Response<T> setCode(Integer code) {
        this.code = code;
        return this;
    }

    public String getMsg() {
        return msg;
    }

    public Response<T> setMsg(String msg) {
        this.msg = msg;
        return this;
    }

    public T getData() {
        return data;
    }

    public Response<T> setData(T data) {
        this.data = data;
        return this;
    }
}
```

#### 泛型方法

方法中，参数列表中如果有参数的数据类型不确定，如果在泛型类中并且不确定的类型恰好是类上的泛型，则可以直接使用泛型类的泛型，如果不在泛型类的类型列表中，则可以在方法上声明泛型，格式为`修饰符 <类型1，类型2, ...> 返回值类型 方法名(类型, 变量名) { ... }`。

方法上面声明的泛型，只在方法中可以使用。

定义一个静态方法`getList`，用来通过数组直接获取`ArrayList`对象。

```java
import java.util.ArrayList;
import java.util.Arrays;

public class ListUtils {
    private ListUtils() {}
    
    @SafeVarargs
    public static <E> ArrayList<E> getList(E... elements) {
        return new ArrayList<>(Arrays.asList(elements));
    }
}
```

```java
// 使用：
public class GenericsDemo {
    public static void main(String[] args) {
        List<Integer> list = ListUtils.getList(1, 2, 3, 4, 5, 6, 7, 8);
        System.out.println(list); // [1, 2, 3, 4, 5, 6, 7, 8]
    }
}
```

> `(E… elements)`：表示可变参数，即只要是`E`类型的参数，你写多少个都行，最终数据都存入指定的变量`elements`中，数据类型为数组。

#### 泛型接口

接口中有不确定的类型时，就可以使用泛型接口，格式为`修饰符 interface 接口名<类型1, 类型2, ...> {}`。对于泛型接口的声明其实与泛型类的声明相差不大，对于泛型接口更重要的是如何去使用一个带泛型的接口：

* 实现类给出具体类型：`public class Clazz implements GenericsInterface<具体类型> {...}`，实现类中就直接使用具体类型，不再使用泛型。
* 实现类延续泛型，创建对象时再确定：`public class Clazz<泛型列表> implements GenericsInterface<泛型列表> {...}`，就和普通泛型类使用一样了。

#### 泛型的继承和通配符

泛型不具备继承性，但是数据具备继承性。

当一个方法`public static void method(List<Perent> list) `，参数列表中存在参数`List<Perent> list`，如果想要传入其子类集合`List<Son> list`，方法是不允许的，但是如果利用泛型将方法定义为`public static <E> void method(List<E> list)`，方法则变成了可以传入任意类型的集合，而不是**只传入自身以及和自身有继承关系的类**，于是就引入了泛型的通配符来`?`，`?`表示不确定的类型，它可以对类型进行限定：

* `? extends E`，表示可以传递`E`或者`E`所有的子孙类；
* `? super E`，表示可以传递`E`或者`E`所有的父类类型。

例如上述`public static void method(List<Perent> list)`方法的问题可利用通配符和限定符解决：`public static void method(List<? extends Perent> list)`。

> 注意：限定符`extends`和`super`不仅是通配符`?`可以用，普通的泛型也可以用。

### 11.5 Set系列集合

Set系列集合特性：

* 无序：存取顺序不一致
* 不重复：可以去重
* 无索引：没有带索引的方法，所以不能使用普通for循环遍历，也不能通过索引获取元素

Set序列集合实现类及特点：

* HashSet：无序、不重复、无索引
* LinkedHashSet：有序、不重复、无索引
* TreeSet：可排序、不重复、无索引

> Set接口中的方法基本上与Collection的API一致，所以基本上没有特有方法。

#### 相关数据结构

在学习`Set`系列集合之前，需要先了解`Set`系列集合涉及到的非线性数据结构——树，包括二叉树、二叉查找树、平衡二叉树和红黑树的概念。

**二叉树**`binary tree`：是一种非线性数据结构，代表“祖先”与“后代”之间的派生关系，体现了“一分为二”的分治逻辑。与链表类似，二叉树的基本单元是节点，每个节点包含值、左子节点引用和右子节点引用。

![image-20260120162950349](https://gitee.com/triabin/img_bed/raw/master/2026/01/20/6695e84fc4959976b0cc230e8b47603c-image-20260120162950349.png)

<div style="clear: both;"></div>

二叉树节点内部结构：父节点地址、值、左子节点地址、右子节点地址。

二叉树常见术语：

* 根节点`root node`：位于二叉树顶层的节点，没有父节点
* 叶节点`leaf node`：，没有子节点的节点，其两个指针均指向`null`
* 边`edge`：连接两个节点的线段，即节点引用（指针）
* （节点所在的）层`level`：从顶至底递增，根节点所在层为1
* 度`degree`：节点的子节点数量，二叉树中，度的取值范围为0、1、2
* 二叉树的高度`height`：从根节点到最远叶节点所经过的边的数量
* 节点的深度`depth`：从根节点到该节点所经过的边的数量
* 节点的高度`height`：从距离该节点最远的叶节点到该节点所经过的边的数量

二叉树的遍历（代码实现略）：

* 前序遍历：从根节点开始，按照当前节点，左子结点，右子节点的顺序遍历
* 中序遍历：从最左边的子节点开始，然后按照左子结点，当前节点，右子节点的顺序遍历（最常用）
* 后序遍历：从最左边的子节点开始，然后按照左子结点，右子节点，当前节点的顺序遍历
* 层序遍历：从根节点开始，一层一层的遍历

> 说明
>
> ① 关于前中后序遍历，只需要记住当前节点位置即可记住特性，即当前节点在前面就是前序遍历，在中间就是中序遍历，在后面就是后序遍历，不存在从右往左这种反人类遍历。
>
> ② 中序遍历最常用，在二叉查找树中，按照中序遍历的顺序遍历出来的数据刚好从小到大。

二叉树的弊端：内部数据没有要求，没有任何规律可言，不利于查找。

**二叉查找树:** 又称二叉排序树、二叉搜索树，满足任意节点左子节点小于当前节点，右子节点大于当前节点的二叉树就是二叉查找树。

* 添加数据规则：小的存左边，大的存右边，一样的不存。添加过程为从根节点比较，没有根节点就将自己作为根节点，比当前节点小就存入左子结点，比当前节点大就存入右子节点，如果左（右）子节点上已经有元素，就继续比较，直到存储成功为止。
* 查找规则：根据添加数据的规则查找即可。
* 弊端：如果遇到特殊数据，二叉查找树有退化成链表的可能，例如如果按顺序添加从小到大排列的数字，那么到最后就变成了只有右子树的二叉搜索树，即完全退化成了链表。

**二叉平衡树:** 任意节点左右子树高度差不超过1的二叉搜索树。

平衡二叉树保持平衡的方式——旋转机制：

* 触发时机：当添加一个节点后，该树不再是一颗平衡二叉树。

* 确定支点：从添加节点开始，不断往父节点找不平衡的节点（不满足平衡二叉树条件的点）。

* 左旋：以不平衡的点作为支点，将原来的右子节点晋升到支点所在位置，把支点左旋降级，变成晋升节点的左子结点；如果支点右子节点有自己的左子结点，那么旋转后，要将原右子节点的左子结点转给降级到左子结点的支点作为其右子节点（这个被转让的左子结点原先在支点右侧，一定比它大，所以作为右子节点刚好合适也不会占用其左子结点位置）。

  案例：

  ![image-20260122134906508](https://gitee.com/triabin/img_bed/raw/master/2026/01/22/5b07d2acda93cef2b6e22aa3b064e662-image-20260122134906508.png)

  <div style="clear: both;"></div>

  如上图案例（左）：当添加节点`12`后，向上逐级检查，到节点`10`，发现该节点左侧高度为0，右侧高度为2，不再符合平衡二叉树条件，对其以`10`为支点进行左旋，将其右节点`11`晋升到支点位置，支点左旋降级为晋升节点`11`的左节点。

  特殊情况（上图案例右）：当添加节点`12`后，向上逐级检查，发现根节点`7`不再满足平衡二叉树条件，于是以`7`为支点进行左旋，将右节点`10`晋升到`7`的位置，支点`7`左旋降级为`10`的左节点，但是`10`原先是有左子结点的，于是将`10`原先左子结点转给降级后的`7`作为右子节点。

* 右旋：和左旋相反即可。

平衡二叉树触发旋转的四种情况：

* 左左：当根节点左子树的左子树有节点插入，导致二叉树不平衡。`一次右旋解决`

  <img src="https://gitee.com/triabin/img_bed/raw/master/2026/01/22/8e4dbed4c28c8466f05d944d4200dfa9-image-20260122140055782.png" alt="image-20260122140055782" align="left" />

  <div style="clear: both;"></div>

* 左右：当根节点左子树的右子树有节点插入，导致二叉树不平衡。`先局部左旋，再整体右旋`

  <img src="https://gitee.com/triabin/img_bed/raw/master/2026/01/22/f59193a59b04c4a07f8102455bfb09b7-image-20260122140223496.png" alt="image-20260122140223496" align="left" />

  <div style="clear: both;"></div>

* 右右：当根节点右子树的右子树有节点插入，导致二叉树不平衡。`一次左旋解决`

  <img src="https://gitee.com/triabin/img_bed/raw/master/2026/01/22/b0c5dfe7fa8220e3bf069818017ddb00-image-20260122140912639.png" align="left"/>

  <div style="clear: both;"></div>

* 右左：当根节点右子树的左子树有节点插入，导致二叉树不平衡。`先局部右旋，再整体左旋`

  <img src="https://gitee.com/triabin/img_bed/raw/master/2026/01/22/51f2688ab07a19fb6221c3c645ae9295-image-20260122141140511.png" alt="image-20260122141140511" align="left" />

  <div style="clear: both;"></div>

**红黑树:** 红黑树是一种自平衡的二叉查找树，刚出现时称为“平衡二叉B树”，后改为红黑树。是一种特殊的二叉查找树，红黑树的每一个节点上都有存储位表示节点的颜色，每一个节点可以是红或黑，红黑树不是高度平衡的，它的平衡是通过“红黑规则”进行实现的。

![image-20260122141734283](https://gitee.com/triabin/img_bed/raw/master/2026/01/22/00348b157d3cf4494200157c6ff784d0-image-20260122141734283.png)

<div style="clear: both;"></div>

平衡二叉树弊端：当左右子树高度差超过1时就进行旋转，旋转操作过于频繁，性能消耗大。

红黑树改进：是一个二叉查找树，但不是高度平衡的二叉查找树，需要触发特有的**红黑规则**才会触发旋转。

红黑规则：

* 每一个节点都是红色或者黑色（相较于二叉树节点，红黑树节点多一个颜色属性）
* 根节点必须是黑色
* 如果一个节点没有子节点或父节点，则该节点相应的子/父节点指针属性值为`Nil`，这些`Nil`视为叶节点，每个叶节点（`Nil`）是黑色的
* 如果某一个节点是红色，那么它的子节点必须是黑色，不能出现两个红色节点相连的情况
* 对每一个节点，从该节点到其所有后代节点的简单路径上，均包含相同数目的黑色节点

<span id="red-black-rule">红黑树添加节点的规则（节点颜色默认为红，效率高，因为能有效减少颜色调整次数）</span>：

![image-20260122143858822](https://gitee.com/triabin/img_bed/raw/master/2026/01/22/eab426cc58c19419033820382de4583a-image-20260122143858822.png)

<div style="clear: both;"></div>

这套处理方案的使用，使得红黑树的增删改查性能都很好，因为其跟多的是修改节点颜色（修改属性值而已），旋转操作相对平衡二叉树少得多。

#### HashSet

`java.util.HashSet`，由于它没有特有的API，所以只需要了解学习其底层原理即可：`HashSet`集合底层采用哈希表存储数据，哈希表是一种对于增删改查数据性能都较好的结构。

哈希表的组成：

* JDK8之前：数组+链表
* JDK8开始：数组+链表+红黑树

哈希表`hash table`：又称散列表，是通过哈希函数计算出对象的哈希值（单向），将对象与一个唯一确定的数值建立对应关系并存储的一种数据结构。举例：如果将存入集合对象计算出哈希值后利用哈希值作为数组索引，然后直接将对象存入数组，这样就相当于给对象创建了一个哈希表。

哈希值：对象的整数表现形式。

* 根据`hashCode`方法算出来的`int`类型的整数
* 该方法定义在`java.lang.Object`类中，所有对象都可以调用，默认使用地址值进行计算
* 一般情况下，会重写`hashCode`方法，利用对象内部的属性值计算哈希值

对象的哈希值特点：

* 如果没有重写`hashCode`方法，不同对象计算出的哈希值是不同的
* 如果已经重写`hashCode`方法，不同的对象只要属性相同，计算出的哈希值就是一样的
* 在小部分情况下，不同的属性值或者不同的地址值计算出来的哈希值也有可能是一样的（哈希碰撞）

基于哈希表的特性，在实际的使用中（例如Java中`java.util.HashSet`类的设计），需要考虑哈希算法（计算哈希值的函数）、哈希表容量`capacity`、触发扩容的负载因子`loadThres`以及扩容倍数等属性的设计。（关于哈希表的系统学习，还是建议移步[krahets/hello-algo](https://github.com/krahets/hello-algo)的第六章 哈希表）

`HashSet`底层原理：

* 创建一个默认长度为16，默认加载因子为0.75的数组，数组名为`table`
* 根据元素的哈希值和数组长度，计算出应存入的数组索引位置`int index = (数组长度 - 1) & 哈希值;`
* 判断对应索引位置是否为空， 如果为空直接存入
* 如果不为空（发生哈希冲突），则表示有元素，此时调用存入对象的`equals`方法比较属性值
* 如果属性值也相同，则不存入数组
* 如果属性值不同，则存入数组，形成链表。JDK8以前，新元素存入数组，老元素挂在新元素下面；JDK8以后，新元素直接挂在老元素下面
* 如果该位置本来就已经是链表，则挨个调用`equals`进行比较，都返回`false`才会添加
* 如果添加后`table`中的元素达到`16 x 0.75 = 12`的时候，数组就会扩容2倍
* 当链表长度大于8且数组长度大于等于64，当前链表就转为红黑树（JDK8 later）

注意：

* JDK8以后，当链表长度**超过8**，而且数组长度**大于等于64**时，自动转为红黑树
* 如果集合中存储的是自定义对象，必须要重写`equals`和`hashCode`方法（这也是前文说自定义对象几乎都要重写这两个方法的原因），这两个方法是去重的核心

基于上面这一套机制，所以`HashSet`才有无序、无索引、不可重复等特点。

#### LinkedHashSet

`java.util.LinkedHashSet`，是`HashSet`子类，与`HashSet`的区别就是它的存取是有序的，这里的有序指的是存储和取出元素的顺序一致。

原理：底层数据结构依然是哈希表，只是每个元素又额外多了一个双链表的机制记录存储的顺序。

#### TreeSet

`java.util.TreeSet`，与普通Set集合相比，它是可排序的，一般按照元素的默认规则从小到大排序，也可以通过构造方法传入排序所需的`java.util.Comparator`接口实现排序。

之所以默认是从小到大，是因为`TreeSet`集合底层是基于红黑树的数据结构实现排序的，增删改查性能都比较好。

`TreeSet`集合默认的排序规则：

* 对于数值类型：`Integer`、`Double`，默认按照从小到大的顺序排序
* 对于字符、字符串类型，按照字符在ASCII码表中的数字升序排序，如果是字符，直接比较即可，如果是字符串，则每个字符逐一比较，直到比出大小为止（后面不管有什么能容都不再比较）

`TreeSet`的两种比较方式：

* `java.util.Comparable`接口的使用（默认/自然排序）：可以将要比较的类直接实现该接口，重写其`compareTo()`方法，然后直接存入`TreeSet`中即可自然排序。

  ```java
  public class Student implements Comparable<Student> {
      private String name;
      private int age;
  
      public Student() {
      }
  
      public Student(String name, int age) {
          this.name = name;
          this.age = age;
      }
  
      public String getName() {
          return name;
      }
  
      public Student setName(String name) {
          this.name = name;
          return this;
      }
  
      public int getAge() {
          return age;
      }
  
      public Student setAge(int age) {
          this.age = age;
          return this;
      }
  
      @Override
      public int compareTo(Student o) {
          // 按照年龄升序排序
          return this.getAge() - o.getAge();
      }
  }
  ```

  将该类存入`TreeSet`中时，运行`compareTo`方法进行比较，其中，`this`表示当前要添加的元素，`o`表示已经在红黑树中存在的元素。对于返回值，如果是负数，就认为要添加的元素是小的，存入节点左边；如果是正数，认为要添加的元素是大的，存入节点右边；如果是0，认为要添加的元素已经存在，直接舍弃不存。

* `java.util.Comparator`接口的使用（比较器排序）：可以在创建`TreeSet`对象的时候，传入比较器`Compartor`指定比较规则。（这样对于要比较的对象没有侵入性且更加灵活）

  ```java
  import java.util.Comparator;
  import java.util.Set;
  import java.util.TreeSet;
  
  public class TreeSetDemo {
      public static void main(String[] args) {
          Set<Student> set = new TreeSet<>(Comparator.comparing(Student::getAge));
      }
  }
  ```

  这样也能达到和上面实现`Comparable`接口同样的效果，`comparing`方法会返回一个指定比较方法的`Comparator`接口。

> `HashSet`底层其实是创建了一个`HashMap`，只不过所有的`key`都指向同一个`value`，对于`HashMap`的见后续双列集合内容。

### 11.6 双列集合

双列集合的特点：

* 双列集合一次需要存一对数据，分别为键和值
* 键不能重复，值可以重复
* 键和值是一一对应的，每一个键只能找到自己对应的值
* `键+值`这个整体称之为“键值对”或者“键值对对象”，在Java中叫做“Entry对象”

Java中双列集合的体系结构：

![image-20260122220409237](https://gitee.com/triabin/img_bed/raw/master/2026/01/22/a953d0367be3d7af941f81160ec85bd1-image-20260122220409237.png)

<div style="clear: both;"></div>

#### Map接口

`java.util.Map`是双列集合的顶层接口，它的功能是全部双列集合都可以继承使用的。

以下为`Map`接口最常见的几个API：

|               方法名称                |                 说明                 |
| :-----------------------------------: | :----------------------------------: |
|        `V put(K key, V value)`        |               添加元素               |
|        `V remove(Object key)`         |         根据键删除键值对元素         |
|            `void clear()`             |         移除所有的键值对元素         |
|   `boolean containsKey(Object key)`   |       判断集合是否包含指定的键       |
| `boolean containsValue(Object value)` |       判断集合是否包含指定的值       |
|          `boolean isEmpty()`          |           判断集合是否为空           |
|             `int size()`              | 集合的长度，也就是集合中键值对的个数 |

使用说明：

* `V put(K key, V value)`，添加/覆盖元素，如果键不存在，那么直接把键值对添加到Map集合中，方法返回`null`；如果键存在，则会把原有对象覆盖，然后返回被覆盖的值。
* `V remove(Object key)`，返回被删除的键值对中的值，不存在的键则返回`null`

> 说明：这几个方法都是以后在双列集合中使用最频繁的方法。

**`Map`遍历方式:** 键找值，键值对，Lambda表达式。Lambda底层其实用的也是键值对遍历。

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

public class MapDemo {
    public static void main(String[] args) {
        Map<String, String> map = new HashMap<>();
        map.put("key1", "value1");
        map.put("key2", "value2");
        map.put("key3", "value3");
        map.put("key4", "value4");
        System.out.println("原生打印：" + map);

        // 键找值遍历
        Set<String> keys = map.keySet();
        List<String> kvList = new ArrayList<>(map.size());
        for (String key : keys) {
            kvList.add(key + "=" + map.get(key));
        }
        System.out.printf("键找值遍历：{%s}%n", String.join(", ", kvList));

        // 键值对遍历
        Set<Entry<String,String>> entries = map.entrySet();
        List<String> entryList = new ArrayList<>(entries.size());
        for (Entry<String, String> entry : entries) {
            entryList.add(entry.getKey() + "=" + entry.getValue());
        }
        System.out.printf("键值对遍历：{%s}%n", String.join(", ", entryList));

        // Lambda表达式遍历
        List<String> lambdaList = new ArrayList<>(map.size());
        map.forEach((key, value) -> lambdaList.add(key + "=" + value));
        System.out.printf("Lambda遍历：{%s}%n", String.join(", ", lambdaList));
    }
}
```

#### HashMap

`java.util.HashMap`是`Map`的一个实现类，没有额外需要学习的特有方法，直接使用`Map`里面的方法就可以了，特点是有键决定的（无序、不重复、无索引），`HashMap`跟`HashSet`底层原理是一模一样的，都是哈希表结构。

`HashMap`底层与`HashSet`一样，也是首先创建长度为16的数组，负载因子也是0.75（`HashSet`底层其实是创建一个`HashMap`，只不过所有键都指向同一个值）。但是在`HashMap`中，存入数组中的是`java.util.Map.Entry`对象，并且计算哈希值的时候只用键来计算，跟值无关。另外，关于哈希冲突时的处理（包括调用键的`equals`方法结果也是`true`的情况），如果键相同，则覆盖值，而不是像`HashSet`一样不添加。

::: warning 注意

基于哈希表在Java中的底层这种运用原理，如果要使用引用类型作为`HashMap`的键（虽然实际项目中我从来没见过这么干，但是我见过这样的面试题），那么一定一定要重写定好对应类型的`equals`和`hashCode`方法。

:::

**源码解析:** （`java.util.HashMap`类）

> 源码解析前置语法知识
>
> ① 对于类似语句`(tab = table) == null`这样的写法，回显运行括号中的语句，对于赋值语句的返回值可以直接视为被赋值的变量值，所以该语句可以拆解为`tab = table; tab == null;`，这样的写法是被允许的，当然这种写法基本只在源码中使用，项目中使用容易被同事打😓（可读性太差）。
>
> ② 对于本来就在类中的成员变量为什么方法体中总要再创建一个局部变量来存放成员变量的值，这是因为成员变量是存放在堆空间中的，而这些方法在运行时方法体存放在栈空间中，为了讲究效率，就在栈空间中定义了一个局部变量来存储这些成员变量对应的地址值，避免从堆空间获取。这点时间与性能的节省对于企业中的大部分项目来说不算什么，但是这个是JDK的源码设计，应用过于广泛，积少成多影响还是不小，所以Java源码中经常这么做，但是项目中却很少见。

* 要了解`HashMap`类的基本原理，需要了解其为了数据的增删改查以及存储定义的部分变量和内部类：

  ① 存储数据的`Entry`接口实现类`static class Node<K,V> implements Map.Entry<K,V>`

  ```java
  static class Node<K,V> implements Map.Entry<K,V> {
      /** 键的哈希值 */
      final int hash;
      /** 键 */
      final K key;
      /** 值 */
      V value;
      /** 如果是链表，这是下一个节点的地址 */
      Node<K,V> next;
  }
  ```

  ② 当链表转为红黑树时，红黑树的存储节点类`static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V>`，它是`HashMap.Node`的子孙类，相比`HashMap.Node`，它多了以下变量：

  ```java
  static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V> {
      /** 父节点地址 */
      TreeNode<K,V> parent;  // red-black tree links
      /** 左子结点地址 */
      TreeNode<K,V> left;
      /** 右子节点地址 */
      TreeNode<K,V> right;
      /** 暂不关注 */
      TreeNode<K,V> prev;    // needed to unlink next upon deletion
      /** 节点颜色（是否为红色） */
      boolean red;
  }
  ```

  ③ 存储数据的数组`Node<K, V>[] table`，默认大小由常量`static final int DEFAULT_INITIAL_CAPACITY = 1 << 4;`决定，即16。

  ④ 负载因子`float loadFactor`，当`table`存入数据占用达到自身长度的这个比例之后触发扩容，默认值为常量`static final float DEFAULT_LOAD_FACTOR = 0.75f;`。

  ⑤ 集合当前大小`int size`。

  ⑥ 阈值`int threshold`，通过负载因子和当前存储数据的数组长度计算出的下次出发扩容时的容量。

  ⑦ 其他常量：集合最大容量`static final int MAXIMUM_CAPACITY = 1 << 30;`（$2^{64}$），链表转为红黑树的链表长度阈值`static final int TREEIFY_THRESHOLD = 8;`，红黑树转为链表的阈值`static final int UNTREEIFY_THRESHOLD = 6;`，链表转为红黑树的最小容量要求`static final int MIN_TREEIFY_CAPACITY = 64;`，记录集合操作次数的变量`transient int modCount;`。

* 空参构造方法创建`HashMap`，此时只会给负载因子赋默认值，不执行其他操作（有参构造容后再议），注意直到此时，`table`仍然为`null`。

* 之后执行`put`方法，添加元素。执行`put`方法，该方法体只有一行`return putVal(hash(key), key, value, false, true);`，其中`static final int hash(Object key)`方法作用是通过`key`计算哈希值，原理涉及到数学上的原理运算。以下为`putVale`方法源码：

  ```java
  // putVal方法源码：
  final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                     boolean evict) {
      Node<K,V>[] tab; Node<K,V> p; int n, i;
      if ((tab = table) == null || (n = tab.length) == 0)
          n = (tab = resize()).length;
      if ((p = tab[i = (n - 1) & hash]) == null)
          tab[i] = newNode(hash, key, value, null);
      else {
          Node<K,V> e; K k;
          if (p.hash == hash &&
              ((k = p.key) == key || (key != null && key.equals(k))))
              e = p;
          else if (p instanceof TreeNode)
              e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
          else {
              for (int binCount = 0; ; ++binCount) {
                  if ((e = p.next) == null) {
                      p.next = newNode(hash, key, value, null);
                      if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                          treeifyBin(tab, hash);
                      break;
                  }
                  if (e.hash == hash &&
                      ((k = e.key) == key || (key != null && key.equals(k))))
                      break;
                  p = e;
              }
          }
          if (e != null) { // existing mapping for key
              V oldValue = e.value;
              if (!onlyIfAbsent || oldValue == null)
                  e.value = value;
              afterNodeAccess(e);
              return oldValue;
          }
      }
      ++modCount;
      if (++size > threshold)
          resize();
      afterNodeInsertion(evict);
      return null;
  }
  ```

  `final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict)`方法参数解析：

  ​	`hash` - 哈希值

  ​	`key` - 传入的键

  ​	`value` - 传入的值

  ​	`onlyIfAbsent` - （如果键重复）是否覆盖值，`only if absent`意为“仅在（键对应的值）缺失的”情况下才覆盖，`put`方法中默认给传了`false`

  ​	`evict` - 略（这里用不上）

  由源码课件条件众多，但是总的来说主要为三种情况，即`table`未创建或长度为0、键重复、键不重复。

  ① `table == null`

  * 第一个判断条件`(tab = table) == null || (n = tab.length) == 0`满足，所以进入`resize()`方法
  * 在`resize()`方法中，由于当前`table`尚未初始化，从其中逻辑可以看出最终会将其初始化为一个长度为`DEFAULT_INITIAL_CAPACITY`的数组，并给`threshold`赋值为`DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY`
  * 这个方法执行完后，第二个条件`if ((p = tab[i = (n - 1) & hash]) == null)`也肯定满足了，因为此时数组中任意位置都是`null`，所以此时`table`数组在通过哈希值计算出来的索引位置的值被直接赋值
  * 因为此次添加数据没有发生覆盖操作，所以直接返回`null`

  ② `table != null && 键重复`，元素覆盖

  * `putVal`方法前两个条件都不满足，直接进入`else`（尽管条件不满足，但是`p = tab[i = (n - 1) & hash]`是一定会被执行的）
  * 因为键重复，所以`else`中的第一个`if`条件肯定满足，所以需要覆盖原来的值，所以后面的内容都是为了能否覆盖原来键对应得值（`e = p`）
  * `if (e != null)`中的内容概括下来就是覆盖原先`Node`对象中的值并返回那个被覆盖的值`oldValue`（全程不涉及到`resize`）

  ③ `table != null && 键不重复`，此时挂在下面形成链表或者红黑树

  * 直接进入最外层流程控制语句的`else`中，这次第一个`if`的条件也不满足
  * 如果获取到的`p`是红黑树的对象`TreeNode`，那么就走红黑树的`put`逻辑（调用`putTreeVal`方法）
  * 否则走链表的逻辑，利用`for (int binCount = 0; ; ++binCount)`这个死循环遍历链表
  * 如果数据插入链表末尾后链表长度超出`TREEIFY_THRESHOLD - 1`（`if (binCount >= TREEIFY_THRESHOLD - 1)`），那么就需要将链表转为红黑树（调用`treeifyBin`方法）
  * 添加完成后，判断是否需要扩容`if (++size > threshold)`

* 有参构造，在了解了以上原理之后，有参构造基本都可以见文知意了。分别可以传入初始化容量、负载因子以及通过现有的`Map`接口的其他实现类直接创建。其中，可以传入初始容量的好处跟之前的`HashSet`以及`ArrayList`等一致，也是能避免不必要的扩容，节省性能，这个在项目中也还算常用。至于负载因子，一般来说越大越能充分利用空间，但是会增加哈希冲突发生的可能性；越小越能避免哈希冲突，但是又会占用更多的内存空间，JDK的开发大佬们通过各种运算已经计算出了0.75这个较为合适的值，基本上在项目中是不会去修改这个参数的（至少我从来没见过）。

#### LinkedHashMap

`java.util.LinkedHashMap`是`HashMap`的子类，类似`LinkedHashSet`，它的特点也是有序（由键决定）、不重复、无索引。这里的有序指的是保证存储和取出的元素顺序一致，从类名可以看出，其底层数据结构依然是哈希表，这是每个键值对元素又额外的多了一个双向链表的机制记录存储的顺序。

#### TreeMap

`java.util.TreeMap`跟`TreeSet`底层原理一样，都是红黑树结构，特点是不可重复、无索引、（键）可排序，默认按照键的从小到大顺序排列，也可以自己规定键的排序规则。

排序规则：

* 实现`Comparable`接口，指定比较规则
* 创建集合时传入`Comparator`比较器对象，指定比较规则

**源码解析:** （`java.util.TreeMap`类）

* 为了数据的增删改查以及存储定义的部分变量和内部类：

  ① `TreeMap`存储数据的基本类`static final class Entry<K,V> implements Map.Entry<K,V>`（是一个内部类）

  ```java
  static final class Entry<K,V> implements Map.Entry<K,V> {
      /** 键 */
      K key;
      /** 值 */
      V value;
      /** 左子结点地址 */
      Entry<K,V> left;
      /** 右子节点 */
      Entry<K,V> right;
      /** 父节点 */
      Entry<K,V> parent;
      /** 红黑树节点颜色 */
      boolean color = BLACK;
  }
  ```

  >  关于节点颜色，这里之所以默认为黑色，是因为当`put`的时候还会调整其颜色，所以没有使用红黑树默认的红色。

  ② 成员变量：排序用的比较器`private final Comparator<? super K> comparator;`（如果创建`TreeMap`的时候未指定，那么就为空，排序使用存入键的默认排序方式自然排序），红黑树根节点`private transient Entry<K,V> root;`，存储键值对数量`private transient int size = 0;`

* 对于`TreeMap`对象的创建，如果使用空参构造，则`comparator`值为`null`，如果传入`Comparator`接口实现类则直接赋值给`comparator`变量，其余构造方法略

* 之后执行`put`方法，添加元素，该方法方法体也只有一行`return put(key, value, true);`，同样另外定义了一个私有的`put`方法来入值，以下为其源码：

  ```java
  private V put(K key, V value, boolean replaceOld) {
      Entry<K,V> t = root;
      if (t == null) {
          addEntryToEmptyMap(key, value);
          return null;
      }
      int cmp;
      Entry<K,V> parent;
      // split comparator and comparable paths
      Comparator<? super K> cpr = comparator;
      if (cpr != null) {
          do {
              parent = t;
              cmp = cpr.compare(key, t.key);
              if (cmp < 0)
                  t = t.left;
              else if (cmp > 0)
                  t = t.right;
              else {
                  V oldValue = t.value;
                  if (replaceOld || oldValue == null) {
                      t.value = value;
                  }
                  return oldValue;
              }
          } while (t != null);
      } else {
          Objects.requireNonNull(key);
          @SuppressWarnings("unchecked")
          Comparable<? super K> k = (Comparable<? super K>) key;
          do {
              parent = t;
              cmp = k.compareTo(t.key);
              if (cmp < 0)
                  t = t.left;
              else if (cmp > 0)
                  t = t.right;
              else {
                  V oldValue = t.value;
                  if (replaceOld || oldValue == null) {
                      t.value = value;
                  }
                  return oldValue;
              }
          } while (t != null);
      }
      addEntry(key, value, parent, cmp < 0);
      return null;
  }
  ```

  `private V put(K key, V value, boolean replaceOld)`方法参数列表解析：

  ​	`key` - 键

  ​	`value` - 值

  ​	`replaceOld` - （如果键重复）是否替换旧值（注意与`onlyIfAbsent`区分，二者意思相反，所以`HashMap`才默认传入`false`，这里在相同目的的情况下默认需要传入`true`）

  `TreeMap`主要源码相对于`HashMap`来说，较为简单，主要明晰以下几个点即可：

  ① 首先是第一次添加元素时调用`addEntryToEmptyMap`方法时比较大小是本次添加的元素的键自己跟自己比；

  ② `comparator`主要为了获取`comparTo`的结果，如果没有传入`Comparator`实现类对象，那么就需要存入的键自身实现`Comparable`接口，否则在`else`中执行强转` Comparable<? super K> k = (Comparable<? super K>) key;`的时候就会包报错；

  ③ 对于`if`和`else`中的代码，其实逻辑都一样，主要就是为了确定本次添加的`key`的父节点以及是添加在左还是右，当然如果发现键冲突（`comparTo`结果为0），那么会直接覆盖并返回被覆盖的旧值结束方法；

  ④ 对于最终调用的`addEntry`方法，添加玩节点后会调用`fixAfterInsertion`方法，该方法会按照之前的[红黑树添加节点规则](#red-black-rule)调整各个节点颜色，`fixAfterInsertion`方法中的第一行就是将颜色设置为红色。

  ```java
  private void fixAfterInsertion(Entry<K,V> x) {
      // 首先将红黑树节点颜色设置为红色（符合红黑树默认颜色规则）
      x.color = RED;
  
      // 按照红黑树规则进行调整
  
      // parentOf：获取父节点，所以parentOf(parentOf(x))为获取组父节点
      // leftOf：获取左子结点
      while (x != null && x != root && x.parent.color == RED) {
          // 判断当前节点的父节点是组父节点的左子结点还是右子节点
          // 目的：为了获取当前节点的叔叔节点
          if (parentOf(x) == leftOf(parentOf(parentOf(x)))) {
              // 符合条件，则表示当前节点的父节点是组父节点的左子结点，那么rightOf获取到的就是当前节点的叔叔节点
              Entry<K,V> y = rightOf(parentOf(parentOf(x)));
              if (colorOf(y) == RED) {
                  // 叔叔节点为红色处理方案：
  
                  // 把父节点设置为黑色
                  setColor(parentOf(x), BLACK);
                  // 把叔叔节点设置为褐色
                  setColor(y, BLACK);
                  // 把祖父节点设置为红色
                  setColor(parentOf(parentOf(x)), RED);
                  // 把爷爷节点设置为当前节点，继续判断
                  x = parentOf(parentOf(x));
              } else {
                  // 叔叔节点为黑色处理方案：
  
                  // 表示判断当前节点是否为父节点的右子节点
                  if (x == rightOf(parentOf(x))) {
                      // 将父节点当做当前节点
                      x = parentOf(x);
                      // 然后左旋，之后再继续判断
                      rotateLeft(x);
                  }
                  // 由于左旋之后就会满足当前节点是父节点的左子结点这一条件，可以继续该条件的操作
  
                  // 将父节点设置为黑色
                  setColor(parentOf(x), BLACK);
                  // 将祖父节点设置为红色
                  setColor(parentOf(parentOf(x)), RED);
                  // 再以组父节点为支点右旋
                  rotateRight(parentOf(parentOf(x)));
              }
          } else {
              // 不符合条件，则表示当前节点的父节点是组父节点的右子结点，那么lefttOf获取到的就是当前节点的叔叔节点
              Entry<K,V> y = leftOf(parentOf(parentOf(x)));
              if (colorOf(y) == RED) {
                  setColor(parentOf(x), BLACK);
                  setColor(y, BLACK);
                  setColor(parentOf(parentOf(x)), RED);
                  x = parentOf(parentOf(x));
              } else {
                  if (x == leftOf(parentOf(x))) {
                      x = parentOf(x);
                      rotateRight(x);
                  }
                  setColor(parentOf(x), BLACK);
                  setColor(parentOf(parentOf(x)), RED);
                  rotateLeft(parentOf(parentOf(x)));
              }
          }
      }
      // 最终无论如何确保根节点为黑色
      root.color = BLACK;
  }
  ```

#### Properties

配置文件：是一种代码数据或者配置参数持久化存储的方式，一般都是手动控制的一些参数，代码中常见的配置文件有很多种，包括XML、ini、YAML和properties等。

`properties`配置文件：后缀名为`.properties`，文件中数据以键值对的形式存储，一行一条数据，左边为键，右边为值，中间用`=`号隔开，处于格式要求，一般等号前后会有一个空格。

Java为了方便从`properties`配置文件中读取或者写出数据，专门设计了一个类`java.util.Properties`（继承关系见章节开头），`Properties`是一个双列集合，拥有`Map`所有的特点。它还设计了一些特有的方法，可以把集合中的数据，按照键值对的形式写到配置文件中，也可以把配置文件中的数据读取到集合中来。

说明：`Properties`没有设计泛型，所以可以往其中添加任意类型数据，但是一般只会往里面添加字符串类型的数据（因为要往文件中读写并且需要人眼能看懂）。

基本使用演示：

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Properties;

public class PropertiesDemo {
    public static void main(String[] args) {
        try (FileOutputStream fos = new FileOutputStream("config.properties");
             FileInputStream fis = new FileInputStream("config.properties")) {
            // 1. 创建Properties集合，读取配置文件数据
            Properties props = new Properties();
            props.load(fis);

            // 2. 添加/修改数据
            props.setProperty("prop1", "value1");
            props.setProperty("prop2", "value2");
            props.setProperty("prop3", "value3");

            // 3. 将集合中的数据以键值对的形式写入到本地文件中
            props.store(fos, "Properties配置文件读写演示"); // 第二个参数为注释内容，会以单行注释的形式写入到文件首行
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

最终`config.properties`文件效果：

<img src="https://gitee.com/triabin/img_bed/raw/master/2026/03/13/829e7c844f711e6068c87d3118e7474f-image-20260313174937879.png" alt="image-20260313174937879" align="left"/>

<div style="clear: both;"></div>

说明：关于`try-with-resources`语句的使用以及文件输入输出流相关知识，见后续章节[15、IO流](# 15、IO流)，这里只需要知道它们分别用来安全读取和写出配置文件内容即可。

### 11.7 集合工具类Collections

`java.util.Collections`是集合的工具类，主要提供一些集合相关的静态方法。

`Collections`中常用的API：

|                           方法名称                           |              说明               |
| :----------------------------------------------------------: | :-----------------------------: |
| `public static <T> boolean addAll(Collection<T> c, T... elements)` |          批量添加元素           |
|          `public static void shuffle(List<?> list)`          |    打乱`List`集合元素的顺序     |
|         `public static <T> void sort(List<T> list)`          |              排序               |
| `public static <T> void sort(list<T> list, Compartor<T> c)`  |     根据指定的规则进行排序      |
|  `public static <T> int binarySearch(List<T> list, T key)`   |        以二分法查找元素         |
|   `public static <T> void copy(List<T> dest, List<T> src)`   |        拷贝集合中的元素         |
|      `public static <T> int fill(List<T> list, T obj)`       |     使用指定的元素填充集合      |
|     `public static <T> void max/min(Collection<T> coll)`     | 根据默认的自然排序获取最大/小值 |
|    `public static void swap(List<?> list, int i, int j)`     |    交换集合中指定位置的元素     |

### 11.8 不可变集合

不可变集合：即不可修改元素的集合（主要指增删以及修改元素指向的地址，不包括元素自身的属性修改），例如前文提到过的`Arrays.asList`方法返回的`List`就是不可变的。

使用场景：

* 如果某个数据不能被修改，把它防御性的拷贝到不可变集合中是一种对数据很好的保护方式。
* 当集合被不可用的库调用时，不可变形式是安全的。

创建不可变的集合：在`List`、`Set`、`Map`接口中，都存在静态的`of`方法，可以获取一个不可变的集合。

|                  方法名称                   |                 说明                 |
| :-----------------------------------------: | :----------------------------------: |
|   `static <E> List<E> of(E... elements)`    | 创建一个具有指定元素的`List`集合对象 |
|    `static <E> Set<E> of(E... elements)`    | 创建一个具有指定元素的`Set`集合对象  |
| `static <K, V> Map<K, V> of(E... elements)` | 创建一个具有指定元素的`Map`集合对象  |

注意：这个集合不能添加、删除或是修改元素。

使用说明：

* 创建的集合并不是不能调用增删改方法，而是调用后会报错`UnsupportedOperationException`。
* `static <E> Set<E> of(E... elements)`的参数必须保证唯一性，否则也会报错。
* `static <K, V> Map<K, V> of(E... elements)`的参数为成对出现，并且由于无法定义可变参数，所以最多可以输入10个键值对，并且也要确保键不能重复。

`Map`不可变集合如果键值对超过10个，的解决方案：

```java
public class CollDemo {
    public static void main(String[] args) {
        // 创建一个普通的Map集合并存入超过10组键值对
        Map<String, String> map = new HashMap<>();
        map.put("a", "1");
        map.put("b", "2");
        map.put("c", "3");
        map.put("d", "4");
        map.put("e", "5");
        map.put("f", "6");
        map.put("g", "7");
        map.put("h", "8");
        map.put("i", "9");
        map.put("j", "10");
        map.put("k", "11");
        map.put("l", "12");

        // 获取Entry对象
        // Set<Map.Entry<String, String>> entries = map.entrySet();
        // 将其转为一个数组
        // 说明：toArray方法在底层会比较集合的长度跟数组长度
        // 如果集合长度＞数组长度，则根据实际数据个数重新创建数组
        // 如果集合长度≤数组长度，则直接使用，数组超出部分为默认初始化值
        // Map.Entry[] entriesArr = entries.toArray(new Map.Entry[0]);
        // 获取不可变集合
        // Map immutableMap = Map.ofEntries(entriesArr);
        // 以上步骤简写为
        Map<Object, Object> immutableMap = Map.ofEntries(map.entrySet().toArray(new Map.Entry[0]));
        
        // 等到了JDK10，将以上步骤收录进了copyOf方法，并且确保了泛型不丢失
        Map<String, String> immuMap = Map.copyOf(map);
    }
}
```

## 12、Stream流

需求：创建集合添加元素（张无忌、周芷若、赵敏、张强、张三丰），把所有以“张”开头的元素存储到新集合中，把“张”开头且长度为3的元素再存储到新集合中，遍历打印最终结果。

```java
import java.util.ArrayList;
import java.util.List;

public calss StreamDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();

        list.add("张无忌");
        list.add("周芷若");
        list.add("赵敏");
        list.add("张强");
        list.add("张三丰");

        // for循环写法
        List<String> list1 = new ArrayList<>(list.size());
        for (String name : list) {
            if (name.startsWith("张")) {
                list1.add(name);
            }
        }
        List<String> list2 = new ArrayList<>(list1.size());
        for (String name : list1) {
            if (name.length() == 3) {
                list2.add(name);
            }
        }
        for (String name : list2) {
            System.out.println(name);
        }
        
        // Stream流写法：
        list.stream().filter(name -> name.startsWith("张"))
                .filter(name -> name.length() == 3)
                .forEach(System.out::println);
    }
}
```

以上就是流的一种基本用法。

流的思想：这里的流可以理解为“流水线（Pipline）”，例如开头的案例中，就是通过集合的`stream()`方法获取到一个流对象之后，对这条“流水线”上的产品（元素）进行一系列过滤、打印等操作。

`java.util.stream.Stream`接口规定了流的思想在Java中的应用实现（JDK8加入）。

流的作用：结合Lambda表达式、方法引用等，简化集合和数组的操作。

`Stream`流的使用步骤：

* 先得到一条`Stream`流（流水线），并把数据放上去
* 使用中间方法对流水线上的数据进行操作，例如过滤、转换等。中间方法：方法调用完毕之后还可以调用其他方法（调用的方法返回流，可以链式调用）
* 使用终结方法对流水线上的数据进行操作。终结方法：最后一步，调用完毕后不能调用其他方法（流水线上的数据被消费/收集）

### 12.1 获取流水线：

| 获取方式     | 方法名                                          | 说明                       |
| ------------ | ----------------------------------------------- | -------------------------- |
| 单列集合     | `default Stream<E> stream()`                    | `Collection`中的默认方法   |
| 双列集合     | 无                                              | 无法直接使用`stream`流     |
| 数组         | `public static <T> Stream<T> stream(T[] array)` | `Arrays`工具类中的静态方法 |
| 一堆零散数据 | `public static<T> Stream<T> of(T... values)`    | `Stream`接口中的静态方法   |

使用说明：

* 双列集合，一般使用`entrySet()`方法先获取`Entry`的集合，再直接获取`Stream`流。
* `public static<T> Stream<T> of(T... values)`，从可变参数的特性来看，数组的流也可以使用这个方法获取，但是如果数组是基本数据类型，它不会给数组所有元素整体装箱，而是将数组对象本身作为可变参数的一个参数，导致流中只有一个元素，这个元素的值为数组的地址。所以保险起见，数组流的获取一律使用`Arrays`中的`stream()`方法。

### 12.2 常见中间方法：

|                        名称                        |                  说明                  |
| :------------------------------------------------: | :------------------------------------: |
| `Stream<T> filter(Predicate<? super T> predicate)` |                  过滤                  |
|          `Stream<T> limit(long maxSize)`           |             获取前几个元素             |
|              `Stream<T> skip(long n)`              |            跳过前`n`个元素             |
|               `Stream<T> distinct()`               | 元素去重，依赖`hashCode`和`equals`方法 |
| `static <T> Stream<T> concat(Stream a, Stream b)`  |           合并`a`和`b`两个流           |
|       `Stream<R> map(Function<T, R mapper)`        |           转换流中的数据类型           |

使用说明：

* `Stream<T> filter(Predicate<? super T> predicate)`，断言接口中的`test`方法返回`true`的值留下。
* `Stream<T> distinct()`，底层使用`HashSet`去重，所以需要注意`hashCode`和`equals`方法的重写。
* `static <T> Stream<T> concat(Stream a, Stream b)`，返回结果中的泛型`T`最好是`a`和`b`的共同父类或者三者是同一个类型。

注意：

* 中间方法返回的`Stream`流，原来的`Stream`只能使用一次，重复使用将报错。所以建议使用链式编程，并且不需要用变量接收流对象，如果最终有返回数据，只需要接收最终返回数据即可。
* 修改`Stream`流中的数据，不会影响原来集合或者数组中的数据。

### 12.3 常见终结方法

|              名称               |            说明            |
| :-----------------------------: | :------------------------: |
| `void forEach(Comsumer action)` |            遍历            |
|         `long count()`          |            统计            |
|           `toArray()`           | 收集流中的数据，放到数组中 |
| `collect(Collector collector)`  | 收集流中的数据，放到集合中 |

使用说明：

* `toArray()`，空参则返回一个`Object`类型数组，如果需要返回指定数据类型的数组，则需要传入一个创建指定类型数组的`IntFunction`接口，通过其源码得知传入参数`value`作为数组长度，所以可以直接使用Lambda表达式固定写法（以`String`数组为例）`String[] arr = list.stream().toArray(value -> new String[value])`，使用方法引用进一步简化：`String[] arr = list.stream().toArray(String[]::new)`。

* `collect(Collector collector)`，基本使用如下：

  ```java
  public class CollectorDemo {
      public static void main(String[] args) {
          List<String> list = new ArrayList<>();
          Collections.addAll(list,
                  "张无忌-男-15", "周芷若-女-14", "赵敏-女-13", "张强-男-20", "张三丰-男-100", "张翠山-男-40",
                  "张良-男-35", "王二麻子-男-37", "谢广坤-男-41");
  
          // 需求1：将所有男性收集到List集合中
          List<String> maleList = list.stream()
                  .filter(str -> "男".equals(str.split("-")[1]))
                  .collect(Collectors.toList());
          System.out.println(maleList);
  
          // 需求2：将所有男性收集到Set集合中
          Set<String> maleSet = list.stream()
                  .filter(str -> "男".equals(str.split("-")[1]))
                  .collect(Collectors.toSet());
          System.out.println(maleSet);
  
          // 需求3：以名字为键，原字符串为值将所有男性收集到Map集合中
          Map<String, String> maleMap = list.stream()
                  .filter(str -> "男".equals(str.split("-")[1]))
                  .collect(Collectors.toMap(
                          str -> str.split("-")[0], // 键的生成规则，传入流水线中的元素
                          str -> str) // 值的生成规则，传入流水线中的元素
                  );
          System.out.println(maleMap);
      }
  }
  ```

  注意：对于`toMap`的使用，键不能重复，一旦重复就会报错。当然，如果就是会出现键重复的状况，也有对应的重载方法去处理这种情况，你可以使用第三个参数去规定重复键数据的合并规则，这种情况使用较少，一般真正需要用到的时候再去了解即可。

## 13、异常

异常，就是代表程序出现的问题，其实前面的章节中已经多次出现了异常这个概念，常见的空指针异常`NullPointerException`、内存溢出异常`OOM => OutputOfMemoryException`等。

### 13.1 异常的体系结构

程序运行过程中出现异常是很正常的事，例如你无法保证你的代码一定运行在内存充足的机器上，也无法确保你的代码读取的文件一定存在。所以对于异常的学习是为了学习当异常出现的时候如何处理异常，而不是让程序不出现异常，那不现实。

JDK中已经定义很多很多异常，这些异常组成了异常的继承体系，Java中定义的异常主要就是`RuntimeException`的子类：

![image-20260125234808423](https://gitee.com/triabin/img_bed/raw/master/2026/01/25/b6c2e1d643e7351dccc62ddc2c70bf90-image-20260125234808423.png)

<div style="clear: both;"></div>

区别：

* `Error`：代表系统级别的错误，属于严重问题，系统一旦出现问题，sun公司会把这些错误封装成`Error`对象。`Error`是给sun公司自己用的，不是给程序员用的，因此不需要去管它。
* `Exception`：叫做异常（口语环境中也叫做“报错”），代表程序可能出现的问题，程序通常会用`Exception`以及它的子类来封装程序出现的问题。
  * `RuntimeException`：它和它的子类都叫运行时异常，编译阶段不会出现异常提醒，只有在代码运行的时候才会出现异常，例如数组索引越界`ArrayIndexOutOfBoundsException`。
  * 编译时异常：编译阶段就会出现的异常。（没有继承于`RuntimeException`，直接继承于`Exception`）

### 13.2 编译时异常与运行时异常

编译时异常在编译阶段就必须手动处理，否则代码报错，而运行时异常在编译阶段不需要处理，是代码运行时出现的异常。

编译时异常举例：之前学习时间格式化时`SimpleDateFormat`类中的`parse`方法抛出的就是编译时异常。

在编译阶段，JVM不会运行代码，只会检查是否有语法错误或者做一些性能优化，例如数组索引越界异常，只有代码真正运行到那一行才能确定数组的长度以及访问数组额索引是否越界。JDK之所以设定编译时异常主要作用是用来提醒程序员检查本地信息。

从JDK的API文档中可以看到JDK定义的所有编译时异常（所有已知的除了`RuntimeException`之外的直接子类）：

AclNotFoundException，ActivationException，AlreadyBoundException，ApplicationException，AWTException，BackingStoreException，BadAttributeValueExpException，BadBinaryOpValueExpException，BadLocationException，BadStringOperationException，BrokenBarrierException，CertificateException，CloneNotSupportedException，DataFormatException，DatatypeConfigurationException，DestroyFailedException，ExecutionException，ExpandVetoException，FontFormatException，GeneralSecurityException，GSSException，IllegalClassFormatException，InterruptedException，IntrospectionException，InvalidApplicationException，InvalidMidiDataException，InvalidPreferencesFormatException，InvalidTargetObjectTypeException，IOException，JAXBException，JMException，KeySelectorException，LambdaConversionException，LastOwnerException，LineUnavailableException，MarshalException，MidiUnavailableException，MimeTypeParseException，MimeTypeParseException，NamingException，NoninvertibleTransformException，NotBoundException，NotOwnerException，ParseException，ParserConfigurationException，PrinterException，PrintException，PrivilegedActionException，PropertyVetoException，ReflectiveOperationException，RefreshFailedException，RemarshalException，SAXException，ScriptException，ServerNotActiveException，SOAPException，SQLException，TimeoutException，TooManyListenersException，TransformerException，TransformException，UnmodifiableClassException，UnsupportedAudioFileException，UnsupportedCallbackException，UnsupportedFlavorException，UnsupportedLookAndFeelException，URIReferenceException，URISyntaxException，UserException，XAException，XMLParseException，XMLSignatureException，XMLStreamException，XPathException。

运行时异常（`RuntimeException`直接子类）：

AnnotationTypeMismatchException，ArithmeticException，ArrayStoreException，BufferOverflowException，BufferUnderflowException，CannotRedoException，CannotUndoException，ClassCastException，CMMException，CompletionException，ConcurrentModificationException，DataBindingException，DateTimeException，DOMException，EmptyStackException，EnumConstantNotPresentException，EventException，FileSystemAlreadyExistsException，FileSystemNotFoundException，IllegalArgumentException，IllegalMonitorStateException，IllegalPathStateException，IllegalStateException，IllformedLocaleException，ImagingOpException，IncompleteAnnotationException，IndexOutOfBoundsException，JMRuntimeException，LSException，MalformedParameterizedTypeException，MalformedParametersException，MirroredTypesException，MissingResourceException，NegativeArraySizeException，NoSuchElementException，NoSuchMechanismException，NullPointerException，ProfileDataException，ProviderException，ProviderNotFoundException，RasterFormatException，RejectedExecutionException，SecurityException，SystemException，TypeConstraintException，TypeNotPresentException，UncheckedIOException，UndeclaredThrowableException，UnknownEntityException，UnmodifiableSetException，UnsupportedOperationException，WebServiceException，WrongMethodTypeException。

异常的作用：

* 异常是用来查询BUG的关键参考信息

  运行以下代码：

  ```java
  package com.triabin.ideasy_server;
  
  public class ExceptionDemo {
      public static void main(Strig[] args) {
          String[] arr = new String[3];
          String str = arr[0].substring(1);
          System.out.println(str);
      }
  }
  ```

  出现报错：

  ```shell
  Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.substring(int)" because "arr[0]" is null
    at com.triabin.ideasy_server.IdeasyServerApplicationTest.main(IdeasyServerApplicationTest.java:6)
  ```

  报错信息详解：

  * 第一行：名字为`main`的线程中出现空指针异常，异常信息为无法运行方法`String.substring(int)`，因为`args[0]`为空。
  * 第二行：出现异常的地方在`com.triabin.ideasy_server.IdeasyServerApplicationTest`类的`main`方法中，具体位置为`IdeasyServerApplicationTest.java`文件的第6行。

  > 在IDEA中，点击`IdeasyServerApplicationTest.java:6`就会直接跳转到该Java文件中的第6行。

* 异常可以作为方法内部的一种特殊返回值，以便通知调用者底层的执行情况

  前面章节中举例的，如何给`Student`类的年龄属性进行范围限制的解决方案中没有具体实施方案，其实为了避免“给了错误数据却正常运行下去”这种情况发生，可以在`setter`方法中抛出一个异常即可阻断代码的运行：

  ```java
  public void setAge(int age) {
      if (age < 18 || age > 40) {
          throw new IllegalArgumentException("Age must between 18 and 40, but " + age + "not in this range.");
      }
      this.age = age;
  }
  ```

  如上，在方法体中，可以使用`throw`关键字抛出一个异常，异常本身也是一个类，所以需要使用`new`关键字新建，每个异常类一般都至少会有一个类似`message`属性，用来存放异常信息，该属性可以调用有参构造传入，也可以使用默认的。（`IllegalArgumentException`是`RuntimeException`的一个直接子类）

  如果调用的方法抛出了一场，对于这个抛出的异常可以自己捕获处理（如何捕获看后续），也可以将它打印到控制台上。（注意：如果抛出的异常不处理，那么当前线程将直接终止）

### 13.3 异常的处理方式

`Threable`的成员方法：

|            方法名称             |               说明                |
| :-----------------------------: | :-------------------------------: |
|  `public String getMessage()`   | 返回此`Throwable`的详细消息字符串 |
|   `public String toString()`    |      返回此可抛出的简短描述       |
| `public void printStackTrace()` |   把异常的错误信息输出在控制台    |

使用说明：

* `public String getMessage()`，获取的一般是报错信息，例如前文`new IllegalArgumentException("Age must between 18 and 40, but " + age + "not in this range.");`中构造方法传入的参数，还有`Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.substring(int)" because "arr[0]" is null`冒号后面的内容。
* `public String toString()`，返回值包含了错误类型和错误提示信息，例如`Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.substring(int)" because "arr[0]" is null`。
* `public void printStackTrace()`，打印的结果和JVM默认处理时打印的内容一致（见下文），但是不会结束程序。

Java中处理异常的方式主要分为三种，即JVM默认处理方式、自己处理（捕获异常）和抛出异常（交给调用者处理）。

**JVM默认处理方式:** 把异常的名称，异常原因及异常出现的位置等信息输出在控制台（红色字体），程序执行停止，下面的代码不会再执行。

**自己处理（捕获异常）:** 格式如下：

```java
try {
    可能出现异常的代码;
} catch (异常类名 变量名) {
    异常的处理代码;
}
```

异常捕获的目的是为了让程序在出现异常时按照设想的方式执行下去。

使用说明：

* `catch`语句可以有多条，当`try{}`中的代码出现异常时，会将出现的这个异常与`catch`中的异常从上到下逐条比较，如果`catch`括号中的异常类型可以接收，就表示该异常被捕获，执行对应`catch`中的代码。但是需要注意前面的`catch`语句中捕获的异常类型必须小于后面的`cahtch`语句中的异常类型，否则就会出现死码（直接编译时报错），即逻辑上后面的`catch`永远无法捕获到异常，因为会被前面的`catch`“拦截”。
* 当`catch`中的代码执行完毕，会继续执行`try...catch`体系下面的其他代码。
* 如果`try`中没有遇到问题，代码将正常运行，`catch`中的代码不会执行。
* 如果`try`中可能会遇到多个问题，那么`try`中的代码会执行到第一次实际遇到问题地方跳出开始执行捕获到异常的`catch`中的代码，这里就需要注意确保后面的`catch`能捕获到所有的异常，如果遇到不同的异常有不通的处理方式，那么就需要多个`catch`，并且如果异常类型之间有继承关系，需要确保按照从小到大的顺序放置`catch`语句。如果有多重异常的处理方案相同，可以使用`|`将多个异常类型连接起来（JDK7新增），例如`catch (ArrayIndexOutOfBoundsException | ArithmeticException e) { ... }`。一般如果想要捕获所有异常，会直接使用`catch (Exception e) { ... }`，我见过捕获得最大的是在一个不愿意停止的线程中，直接使用`catch (Throwable t) { ... }`。
* 如果`try`中抛出的异常没有被捕获（后面的`catch`中的异常类型无法接受抛出的异常），那么程序就跟没有`try...catch`语句时一样，异常按照JVM的默认处理方式进行处理。
* 如果`try`中遇到了问题，那么`try`中遇到问题以下的代码都不会再执行。

**抛出异常（交给调用者处理）:** 主要涉及到两个关键字，`throws`和`throw`。

* `throws`写在方法处，表示声明一个异常，告诉调用者，使用本方法可能会有哪些异常，格式为`public void method() throws 异常类名1, 异常类名2...`，抛出的如果是编译时异常，必须要写，如果是运行时异常则可以不写。
* `throw`写在方法体中，用于手动抛出异常，结束方法。手动抛出异常对象，交给调用者，后续代码不再执行，例`throw new NullPointerException()`。

### 13.4 自定义异常

当遇到Java中给出的异常类无法很好的描述遇到的问题时，或者在某些需要全局捕获特殊异常的需求，就可以考虑自定义异常。

从JDK的默认异常类来看，定义异常需要以下几步：

* 定义异常类，需要见名知意，命名规范为`异常描述+Exception结尾`
* 写继承关系，如果是运行异常，就继承`java.lang.RuntimeException`，如果是编译时异常，就继承`java.lang.Exception`
* 空参构造，设置默认`message`
* 带参构造，手动传入`message`

意义：为了让控制台的报错信息更加见名知意。

## 14、File

在开发过程中，将内存中的数据保存到文件中，或者将文件中的数据读取到内存中是非常常见的需求，读取或写入文件时传输数据的方式叫做IO流。在JDK中，设计了一个`java.io.File`类来实现文件相关的功能。

### 14.1 路径

文件路径是计算机中用来定位文件或文件夹位置的字符串，可以理解为文件的“地址”，可以分为绝对路径和相对路径。

* 绝对路径：从文件系统根目录开始的完整路径（例如Windows的`C:\`和Unix的`/`），它是**唯一且固定的**，不会随着当前位置改变。
* 相对路径：相对于当前工作目录的路径，利用符号`.`表示当前目录，`..`表示上一级目录，**相对路径的结果不固定**，会随着当前位置变化。

`File`类对象就表示一个路径，可以文件路径，也可以是文件夹路径。甚至这个路径可以是存在的，也可以是不存在的。

> 注意：Java中，文件路径分隔符`\`需要因为是特殊字符，所以需要用`\`转义，所以在Java字符串中的文件分隔符一般写成`\\`。

### 14.2 `File`类的使用

#### 构造方法

|                  方法名称                  |                         说明                         |
| :----------------------------------------: | :--------------------------------------------------: |
|       `public File(String pathname)`       |               根据文件路径创建文件对象               |
| `public File(String parent, String child)` |  根据父路径名字字符串和子路径名字字符串创建文件对象  |
|  `public File(File parent, String child)`  | 根据父路径对应文件对象和子路径名字字符串创建文件对象 |

父路径：全称为父级路径，当前文件（夹）的上一级路径。

子路径：当前文件夹的下一级文件路径。

#### 常见成员方法

**判断、获取方法**：

|             方法名称              |                         说明                          |
| :-------------------------------: | :---------------------------------------------------: |
|  `public boolean isDirectory()`   |         判断此路径名表示的`File`是否为文件夹          |
|     `public boolean isFile()`     |          判断此路径名表示的`File`是否为文件           |
|     `public boolean exists()`     |           判断此路径名表示的`File`是否存在            |
|      `public long length()`       |          返回文件的大小（单位：字节`Byte`）           |
| `public String getAbsolutePath()` |                  返回文件的绝对路径                   |
|     `public String getPath()`     | 返回定义文件时使用的路径（与`getAbsolutePath()`区分） |
|     `public String getName()`     |                返回文件的名称，带后缀                 |
|   `public long lastModified()`    |           返回文件的最后修改时间戳（毫秒）            |

**创建、删除方法**：

|             方法名称             |        说明        |
| :------------------------------: | :----------------: |
| `public boolean createNewFile()` | 创建一个新的空文件 |
|     `public boolean mkdir()`     |   创建单极文件夹   |
|    `public boolean mkdirs()`     |   创建多级文件夹   |
|    `public boolean delete()`     | 删除文件、空文件夹 |

使用说明：

* `public boolean createNewFile()`，创建一个新的空文件，如果当前路径表示的文件是不存在的，则创建成功后返回`true`，如果存在，则创建失败，返回`false`。如果父级路径不存在，那么方法返回`IOException`。

  > 说明
  >
  > ① 注意区分无后缀文件和文件夹区别，文件的后缀名只是文件打开方式的一种引导，与文件内容无关。
  >
  > ② 由于该方法的特性，所以一般会配合`exists()`方法先判断其父路径以及自身是否存在再决定是否运行该方法。

* `public boolean mkdir()`，`mkdir` => make directory，需要注意文件路径在操作系统中一般都是唯一的，如果在路径中已经创建了名为`xxx`的文件，那么在当前路径下无法再创建名为`xxx`的文件夹。只能创建单级文件夹，不能创建多级文件夹，路径中，如果有一个父路径不存在，将创建失败。

* `public boolean mkdirs()`，创建多级文件夹（包括单级），底层会调用单级，所以以后创建单级文件夹的方法基本不用。

* `public boolean delete()`，该方法默认只能删除文件和空文件夹，并且需要注意，调用该方法删除文件（夹）会直接删除，不会触发底层系统的诸如回收站之类的系统功能。

**获取遍历方法**：

|                     方法名称                     |                       说明                       |
| :----------------------------------------------: | :----------------------------------------------: |
|           `public File[] listFiles()`            | 获取当前路径下所有子文件（路径）对应的`File`对象 |
|        `public static File[] listRoots()`        |   列出可用的文件系统根目录（例如`C:\`、`D:\`）   |
|             `public String[] list()`             |       获取当前路径下所有文件（夹）绝对路径       |
|  `public String[] list(FilenameFilter filter)`   |   利用文件名过滤器获取当前路径下文件（夹）路径   |
|   `public File[] listFiles(FileFilter filter)`   |    利用文件名过滤器就获取当前路径下文件（夹）    |
| `public File[] listFiles(FilenameFilter filter)` |     利用文件名过滤器获取当前路径下文件（夹）     |

使用说明：

* `public File[] listFiles()`，当调用者路径不存在或者路径是文件或者路径需要权限才能访问时，返回`null`；当调用者路径是一个空文件夹时，返回长度为0的数组；返回的文件列表中包含隐藏文件。（需要掌握，其余方法了解即可）
* `public String[] list(FilenameFilter filter)`，`FilenameFilter`也是一个断言接口，接收两个参数，第一个参数为父级路劲`File`，第二个参数为子级路径`String`。
* `public File[] listFiles(FileFilter filter)`，`FileFilter`也是一个断言接口，接收一个参数，为文件对象。

## 15、IO流

IO流：`I: Input，输入；O: Output，输出`，存储和读取数据的解决方案，可以读写文件或网络中的数据。

涉及到IO流，就必须要说明一下内存的特性了，程序运行时所需的数据都是存在内存里面的（栈内存、堆内存……），但是内存有一个特点，就是它的数据当内存被释放或者断电，内存中的数据都会直接丢失，所以要想将内存中的数据存储下来，就需要用到IO流将内存中的数据写入到文件中，这种将内存中的数据存储到文件中的过程被称为——持久化。

**IO流的分类：**按流的方向可以分为输入流（读取），输出流（写出）；按操作文件类型可以分为字节流（可以操作所有文件，包括文本、图片、音频、视频）和字符流（只能操作文本）。

### 15.1 IO流体系

![image-20260128143543186](https://gitee.com/triabin/img_bed/raw/master/2026/01/28/32fc579e2488d87083ec4e5e939edddf-image-20260128143543186.png)

<div style="clear: both;"></div>

以上结构中的`java.io.InputStream`、`java.io.OutputStream`等都只是接口，具体的使用在它们的实现类中，关于字节流实现类的命名一般都是`作用对象 + 实现接口`的格式，例如对象字节输入流`ObjectInputStream`、带有缓冲区的字节输入流`BufferedInputStream`，输出流同理。

![image-20260128151234806](https://gitee.com/triabin/img_bed/raw/master/2026/01/28/434037edc5bc90d38e866733c84bb0ca-image-20260128151234806.png)

<div style="clear: both;"></div>

### 15.2 字节流

#### 字节输出流的基本使用（以`FileOutputStream`为例）

`java.io.FileOutputStream`文件字节输出流可以把程序中的数据写入到本地文件中，使用步骤：

* 创建字节输出流对象：`OutputStream os = new FileOutputStream("/Users/dawnlee/Desktop/demo.txt");`

  ① 参数是字符串表示的路径或者`File`对象都可以。

  ② 如果文件不存在会创建一个新文件，但是要保证父级路径存在。

  ③ 如果文件已存在且内容不为空，则会清空文件内容再写入，除非调用构造方法的时候传入第二个参数`boolean append`为`true`（意为追加，默认`false`）。

* 写数据：`os.write(97);`

  `write()`方法的参数是整数，但是实际上写到本地文件中的是整数在ASCII上对应的字符。

* 释放资源：`os.close();`

  每次使用完流之后都要释放资源，主要是解除资源的占用，如果不解除，则其他文件无法修改文件。

最终结果：`demo.txt`中写入了字母`a`（ASCII为97）。

`FileOutputStream`关于以上三个步骤的原理解析：创建输出流对象实际上就是在程序（内存）和文件之间建立了一个单向的通道（内存到文件），这个过程也可以叫做程序获取了文件的句柄。写入则是程序将数据从内存写入到文件的过程。最终的释放资源则是销毁之前建立的通道的过程（不销毁的话，别的程序无法建立输出流，输入流不影响，也就是不影响读取，但是影响修改）。

`FileOutputStream`写数据的三种方式：

|                   方法名称                   |             说明             |
| :------------------------------------------: | :--------------------------: |
|             `void write(int b)`              |      一次写一个字节数据      |
|          `void write(byte[] bytes)`          |    一次写一个字节数组数据    |
| `void write(byte[] bytes, int off, int len)` | 一次洗衣歌字节数组的部分数据 |

* `void write(byte[] bytes, int off, int len)`，`off`为数组起始索引，`len`为从起始索引开始的长度。

**换行和追加**：

* 换行

  ```java
  import java.io.FileOutputStream;
  import java.io.OutputStream;
  import java.io.IOException;
  
  public class IODemo {
      public static void main(String[] args) throws IOException {
          OutputStream os = new FileOutputStream("/Users/dawnlee/Desktop/demo.txt");
          os.write("first line".getBytes());
          os.write("\r\n".getBytes());
          os.write("second line".getBytes());
          os.close();
      }
  }
  ```

  关于换行符，在不同操作系统中是不一样的：

  ​	Windows：`\r\n`，起源于上古DOS系统，换行为先回车（到达行首），然后再一定到下一行行首

  ​	Linux：`\n`

  ​	Mac：`\r`

  在Windows系统中，Java对回车换行进行了优化，虽然完整换行是`\r\n`，但是只要写其中一个`\r`或`\n`，Java也可以实现换行，Java底层会对它进行补全，但是不建议省略。

* 追加：每次重新创建输出流都会清空文件内容，但是如果是想要续写（追加到文件后面），则可以传入`FileOutputStream`构造方法的第二参数，`append`为`true`即可。

#### `try..catch`语句扩展

事实上，`try...catch`最完整的写法应该是`try(closeable-resource){}catch(异常){}fainally{}`，其中，`closeable-resource`、`catch`和`finally`都是可以省略的，但是不能同时省略，且`finally`必须在`catch`之后。

**finally:** 意为“最终的”，就是无论`try`和`catch`中的代码是否运行，它都一定会执行（除非JVM退出），主要用来关闭资源（例如文件输入输出流、释放锁等）。

程序在运行过程中，在已经占用某个资源的情况下如果发生异常，后续代码都不会再继续执行（例如上一节换行代码中的`write`处如果抛出异常，此时文件输出流尚未释放），那么它占有的资源始终得不到释放，这将会极大的影响资源的后续使用，所以设计了`finally`这一机制来处理这种情况。

上一节**换行写入**代码可利用`finally`优化为：

```java
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.IOException;

public class IODemo {
    public static void main(String[] args) {
        OutputStream os = null;
        try {
            os = new FileOutputStream("/Users/dawnlee/Desktop/demo.txt");
            os.write("first line".getBytes());
            os.write("\r\n".getBytes());
            os.write("second line".getBytes());
        } catch(IOException e) {
            e.printStackTrace();
        } finally {
            if (os != null) {
                try {
                    os.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

关于`finally`的执行时间问题（与`return`语句相比）：

① `try`代码块中带有`return`

```java
public class FinallyDemo {
    public static void main(String[] args) {
        System.out.println(show()); // 执行finally模块	returnTry
    }
    private static String show() {
        try {
            return "returnTry";
        } finally {
            System.out.print("执行finally模块\t");
        }
    }
}
```

② `try`和`catch`中都带有`return`

```java
public class FinallyDemo {
    public static void main(String[] args) {
        System.out.println(show()); // 执行finally模块	returnCatch
    }
    private static String show() {
        try {
            int a = 8 / 0;
            return "returnTry";
        } catch (Exception e) {
            return "returnCatch";
        } finally {
            System.out.print("执行finally模块\t");
        }
    }
}
```

③ `finally`中带有`return`

```java
public class FinallyDemo {
    public static void main(String[] args) {
        System.out.println(show()); // 执行finally模块	returnFinally
    }
    private static String show() {
        try {
            int a = 8 / 0;
            return "returnTry";
        } catch (Exception e) {
            return "returnCatch";
        } finally {
            System.out.print("执行finally模块\t");
            return "returnFinally";
        }
    }
}
```

④ `finally`改变返回值

```java
public class FinallyDemo {
    public static void main(String[] args) {
        System.out.println("返回后的对象：" + show());
        // 返回前的对象：{ mAddr: Demo@1768305536, code: 0, desc: 名 }
        // 返回后的对象：{ mAddr: Demo@1768305536, code: 1, desc: 名 }
        // 可以看到，对象属性变了，但是内存地址始终没变
    }

    private static Demo show() {
        Demo demo = new Demo(0, "名");
        try {
            return demo;
        } finally {
            System.out.println("返回前的对象：" + demo);
            demo.code = 1;
        }
    }

    static class Demo {
        int code;
        String desc;

        public Demo(int code, String desc) {
            this.code = code;
            this.desc = desc;
        }

        @Override
        public String toString() {
            String addr = this.getClass().getSimpleName() + "@" + super.hashCode();
            return String.format("{ mAddr: %s, code: %d, desc: %s }", addr, this.code, this.desc);
        }
    }
}
```

总结：

* 当`try`代码块和`catch`代码块中有`return`语句时，`finally`仍然会被执行。
* 执行`try`代码块或`catch`代码块中的`return`语句之前，都会先执行`finally`语句。
* 无论在`finally`代码块中是否修改返回值，返回值都不会改变，仍然是执行`finally`代码块之前的值（引用自改除外，这里指的是局部变量的值）。
* `finally`代码块中的`return`语句一定会执行。

**`try(closeable-resource)`**：JDK7新增，正式名称为`try-with-resources`，作用是自动关闭资源，使用方式为将实现了`java.lang.AutoCloseable`接口（`java.io.Closeable`接口继承了`AutoCloseable`接口）的资源放在其中进行定义（多个资源之间用`;`分隔，最后一个`;`可以省略），那么资源在使用完成后就会自动关闭，效果与将关闭资源的代码写在`finally`中相同。

利用`try-with-resources`可以将**换行写入**代码进一步简化：

```java
import java.io.FileOutputStream;
import java.io.OutputStream;

public class IODemo {
    public static void main(String[] args) {
        try (OutputStream os = new FileOutputStream("/Users/dawnlee/Desktop/demo.txt")) {
            os.write("first line".getBytes());
            os.write("\r\n".getBytes());
            os.write("second line".getBytes());
        } catch(IOException e) {
            e.printStackTrace();
        }
    }
}
```

由于创建资源对象的语句如果写在括号里，会影响代码的阅读性，JDK9又改为可以在外面获取资源，括号中只需要放变量即可。

#### 字节输入流的使用（以`FileInputStream`为例）

`java.io.FileInputStream`可把本地文件中的数据读取到程序（内存）中来，使用步骤：

* 创建字节输入流对象，`InputStream is = new FileInputStream("/Users/dawnlee/Desktop/demo.txt")`

  如果文件不存在，直接报错。

* 读取数据，`int read = is.read();`

  ① 每调用一次只会读取一个字节，读出来的是数据在ASCII上对应的数字。

  ② 读取到文件末尾，再运行此方法则返回`-1`。

* 释放资源，`is.close();`

```java
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

public class IODemo {
    public static void main(String[] args) {
        // 其中，demo.txt文件中的内容为之前写入的“first line\r\nsecond line”
        try (InputStream is = new FileInputStream("/Users/dawnlee/Desktop/demo.txt")) {
            int read = is.read();
            System.out.println(new String(new byte[] { (byte) read })); // f
        } catch(IOException e) {
            e.printStackTrace();
        }
    }
}
```

**FileInputStream循环读取:** 根据`read()`方法特性，可以将上述代码优化为读取全部内容的方法。

```java
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

public class IODemo {
    public static void main(String[] args) {
        try (InputStream is = new FileInputStream("/Users/dawnlee/Desktop/demo.txt")) {
            int read;
            while ((read = is.read()) != -1) {
                System.out.print(new String(new byte[] { (byte) read }));
            }
            System.out.println();
        } catch(IOException e) {
            e.printStackTrace();
        }
    }
}
```

注意事项：千万不要在循环体中再次调用`read`方法，这会使指针多次后移致使读取到错误数据。

> 练习题：文件拷贝，在`MyFileUtils`类中，编写一个方法`cpoy(String srcPath, String targetPath)`用来复制文件。
>
> ```java
> public class MyFileUtils {
>     public static boolean copy(String srcPath, String targetPath) {
>         if (srcPath == null || targetPath == null || srcPath.isEmpty() || targetPath.isEmpty()) {
>             throw new IllegalArgumentException("路径参数不能为空");
>         }
>         long startTime = System.currentTimeMillis();
>         InputStream is = new FileInputStream(srcPath);
>         OutputStream os = new FileOutputStream(targetPath);
>         try (is; os) {
>             int b;
>             while ((b = is.read()) != -1) {
>                 os.write(b);
>             }
>         }
>         System.out.printf("拷贝文件[%s]到[%s]耗时：%d毫秒%n", srcPath, targetPath, (System.currentTimeMillis() - startTime));
>         return true;
>     }
> }
> ```
>
> 关于占用多个资源的情况下，如果是手动关闭资源，需要遵循**先开的流后关闭**的原则。

**文件拷贝弊端:** 以上练习题解决方案最终表现效果非常差，一个3MB左右的文件拷贝居然花了近10秒，更大的文件简直无法接受。

原因分析：代码逻辑中，每次只读取一个字节，并且没读取一个自己就立刻写入文件，那么一个3MB的文件，就需要循环`3 * 1024 * 1024`次，这就是拷贝缓慢的元婴。

解决：一次读取多个字节再写入多个字节，涉及到`public int read(byte[] buffer)`方法，该每次读取都会读取一个字节数组的数据，并且每次读取都会尽可能地把数组装满，返回值为本次读取到的字节数，当没有读取到字节的时候返回`-1`。

注意事项：如果读取到最后一组，并且最后一组的数据没有将数组装满，那么超出部分的数组元素不会被新的元素覆盖，这会导致数据错误，为了解决这个问题，就需要利用方法返回的读取到的字节数`len`来取每次读取的字节数组的前`len`位出来使用，避免错误数据。

有了这些技术知识储备后，再来改写`copy`方法：

```java
public class MyFileUtils {
    public static boolean copy(String srcPath, String targetPath) throws IOException {
        if (srcPath == null || targetPath == null || srcPath.isEmpty() || targetPath.isEmpty()) {
            throw new IllegalArgumentException("路径参数不能为空");
        }
        long startTime = System.currentTimeMillis();
        InputStream is = new FileInputStream(srcPath);
        OutputStream os = new FileOutputStream(targetPath);
        try (is; os) {
            int len;
            byte[] bytes = new byte[5 * 1024 * 1024]; // 一次拷贝5MB
            while ((len = is.read(bytes)) != -1) {
                os.write(bytes, 0, len);
            }
        }
        System.out.printf("拷贝文件[%s]到[%s]耗时：%d毫秒%n", srcPath, targetPath, (System.currentTimeMillis() - startTime));
        return true;
    }
}
```

改进后改方法拷贝一个3MB左右的文件只需要40毫秒左右。

以上方法只能拷贝单个文件，如果需要拷贝文件夹，需要对方法进行一些修改：

```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class MyFileUtils {
    /**
     * 方法描述：复制文件
     * @param src {@link File} 要复制的文件
     * @param dest {@link File} 复制目标位置
     * @throws IOException 文件操作异常
     */
    public static void copy(File src, File dest) throws IOException {
        File parentFile = dest.getParentFile();
        if (dest.exists()) {
            // 如果目标文件已存在，则放弃拷贝
            throw new IOException("File already exists: " + dest);
        } else {
            // 确保目标路径父路径存在
            if (!parentFile.exists() && !parentFile.mkdirs()) {
                throw new IOException("Could not create directory: " + parentFile);
            }
        }
        if (src.isFile()) {
            // 如果是文件，则直接将文件内容写入目标路径
            try (FileInputStream is = new FileInputStream(src);
                 FileOutputStream os = new FileOutputStream(dest)) {
                byte[] buffer = new byte[5 * 1024 * 1024]; // 缓冲区，设定为5MB
                int len;
                while ((len = is.read(buffer)) != -1) {
                    os.write(buffer, 0, len);
                }
            }
        } else  {
            if (!dest.exists() && !dest.mkdirs()) {
                throw new IOException("Could not create directory: " + dest);
            }
            if (!dest.isDirectory()) {
                throw new IOException("Not a directory: " + dest);
            }
            File[] files = src.listFiles();
            if (files == null || files.length == 0) {
                return;
            }
            for (File file : files) {
                copy(file, new File(dest, file.getName()));
            }
        }
    }
}
```

### 15.3 字符集

在[计算机中的数据存储](../common/计算机中的数据存储)中提到过，计算机中所有数据都是以二进制的形式存储的。在计算机的基础存储单元中，一个比特位能表示0和1两种状态，但是单独的一个比特位能表示的内容有限，所以一般来说，会将8个比特位作为一个存储单元，为1字节，8个比特位不同的状态排列组合即可表示丰富的内容，字节是计算机最小的存储单元。

上一章节中，关于文件的读写内容都只涉及到英文字符的读写，因为英文字符在ASCII码表中都有唯一对应的数字，因此英文字符的存储实际上只需要一个字节就够了，而汉字一类的字符在ASCII码表中找不到对应的数字，并且非英文字符又有不同的编码标准，不同的编码标准导致存储字符耗费的字节数不同，因此如果按照读取英文字节的方式去读取非英文字符得到单个字节后，又将这些单个字节按照英文字符的方式去创建字符串（`new String(byte[] bytes)`未指定编码方式，就会默认编码方式去解码字节），这样解码出来的结果肯定与原文对不上。

将**字符集**中查询到的字符对应的数字按照一定的规则进行计算转为真实的实际能存储在计算机中二进制数据的过程称为编码，将计算机中存储的二进制数据按照一定的规则转为**字符集**中存在的字符对应的数字的过程叫做解码，这个规则由**字符集**决定，要编/解码为哪一个字符集，就按照哪一个字符集的规则进行编/解码。

#### ASCII

目前最简单的字符集就是[ASCII码表](https://www.asciitable.com/)，它规定了西欧国家包括大写字母、小写字母、数字、特殊字符在内的所有字符共计128个（`0~127`），每个数字都对应了一个字符，而一个字节能表示的范围为`-128~127`，这也是英文字符一个字节就能表示的原因。

ASCII的编码规则很简单，查询到字符对应的数字后，将其转为补码（因为全都是正数，所以这一步省略），然后从前面补0，补足8位即可，解码规则反过来即可，直接转为十进制。

####  字符集的发展

**GB2312**：1981年5月1日发布的中华人民共和国国家标准信息交换用汉字编码字符集，收录了7445个图形字符，其中包括6763个汉字，都是简体字。（`GB => 国标`）

**BIG5**：台湾地区繁体中文标准字符集，共收录13053个中文字，1984年实施。

**GBK**：2000年3月17日发布，收录21003个汉字，包含国家标准GB13000-1中全部中日韩汉字和BIG5编码中的所有汉字。（`GBK => 国标扩`）

Windows系统语言为简体中文时默认使用的就是GBK字符集，但是系统显示的是ANSI，但是由于即使是GBK标准，也有多个版本，包括中文的GB2312和BIG5、韩文的EUC-KR、日文Shift-JS，于是微软给这些字符集统一命名为ANSI。

**Unicode**：随着世界各地各个国家的发展，计算机普及全球，以上这些字符集仍不能满足需求，于是美国国家标准协会又推出了Unicode字符集，致力于将全世界各种语言的每个字符定义一个唯一的编码，以满足跨平台、跨语言的文本信息转换，称之为国际标准字符集，外号“万国码”。

#### GBK

ASCII字符存储规则：GBK字符集完全兼容ASCII，所以ASCII中的字符在GBK字符集中对应的数字与ASCII中的一致，只需要使用一个字节就可以存储。

非ASCII字符存储规则：汉字如果只用一个字节存储，只能存储$2^8=256$个汉字，远远不够，所以在GBK编码中，非英文字符使用两个字符存储，前8位为高位字节，后面8位为低位字节，高位字节二进制一定以1开头，转成十进制后是一个负数。

之所以非英文字符高位以1开头，主要是为了与ASCII码表中的字符区分，ASCII码表中的字符都是应为取值范围为`0~127`，全是正数，所以不会有负数，如此就能与非英文字符区分开来。

解码过程：读取过程，如果遇到负数，则取两个字节再解码，否则就一个字节一个字节地解码。

#### Unicode

> 名字含义：Unicode，即统一编码
>
> 研发方：统一码联盟（也叫Unicode组织）
>
> 总部位置：美国加州
>
> 研发时间：1990年
>
> 发布时间：1994年发布1.0版本，期间不断添加新的文字，目前已经发布了10多个版本（截止2025年）
>
> 联盟组成：世界各地主要的电脑制造商、软件开发商、数据库开发商、政府部门、研究机构、国际机构以及个人

编码规则演变：字符集同样兼容ASCII，在字符集中查到字符对应的数字后，一开始是打算使用UTF-16编码方式进行编码（`UTF => Unicode Transfor Format`，即Unicode转码格式），即不管什么字符，都转为使用16个比特位表示，甚至还提出过用UTF-32，这样使得ASCII中的字符明明只要一个字节就可以表示，但是同样需要花费2个字节甚至4个字节，多次磋商后，最终觉使用变长的编码方式UTF-8，该编码方式占用1~4个字节。

UTF-8字节占用标准：

* 1个字节：ASCII
* 2个字节：拉丁文、希腊文、西里尔字母、亚美尼亚语、希伯来文、阿拉伯文、叙利亚文
* 3个字节：中日韩文字、东南亚文字、中东文字
* 4个字节：其他语言

UTF-8编码规则：

* 1个字节字符，直接前面补0补齐8位即可
* 2个字节字符，第一个字节以`110`开头，第二个字节以`10`开头
* 3个字节字符：第一个字节以`1110`开头，其余字节都以`10`开头
* 4个字节字符：第一个字节以`11110`开头，其余字节以`10`开头

举例：“汉”字编码为Unicode字符集：

* 在Unicode字符集中的找到字符`汉`对应的数字标识为27721
* 将27721转为二进制得到 01101100 01001001
* 汉字是3个字节，将得到的二进制依次填入`1110xxxx 10xxxxxx 10xxxxxx`中的`x`处即可的到编码结果为`11100110 10110001 10001001`

乱码产生的原因：

* 读取数据时，单个字符未读取到完整的编码字节，例如前文中的`is.read()`方法，一次只读取一个字节，而不同字符集中的字符不一定都用一个字节表示。
* 编解码方式不统一，常见编解码不统一谬误如下：
  |  名称  |            示例            |                         特点                         |                         产生原因                          |
  | :----: | :------------------------: | :--------------------------------------------------: | :-------------------------------------------------------: |
  | 古文码 |    涓崕浜烘皯鍏卞拰鍥�    |           大都为不认识的古文，并夹杂日韩文           |              以GBK的方式读取UTF-8编码的中文               |
  | 口字码 |         �л����񹲺͹�          |                  大部分字符为小方块                  |              以UTF-8的方式读取GBK编码的中文               |
  | 符号码 |       ä¸­åäººæ°å±åå½       |                 大部分字符为各种符号                 |            以ISO8859-1方式读取UTF-8编码的中文             |
  | 拼音码 |       ÖÐ»ªÈËÃñ¹²ºÍ¹ú       |      大部分字符为头顶带有各种类似声调符号的字幕      |             以ISO8859-1方式读取GBK编码的中文              |
  | 问句码 |      中华人民共和��?       | 字符长度为偶数时正确，长度为奇数时最后的字符变为问号 | 以GBK方式读取UTF-8编码的中文，然后又用UTF-8的格式再次读取 |
  | 锟拷码 | 锟叫伙拷锟斤拷锟今共和癸拷 |     全中文字符，且大部分字符为“锟斤拷”这几个字符     |  以UTF-8方式读取GBK编码的中文，然后又用GBK的格式再次读取  |

避免产生乱码：

* 不要用字节流读取文本文件
* 编解码时使用同一个字符集

#### Java中的编解码代码实现

Java中的编码方法：

|              `String`类中的方法              |          说明          |
| :------------------------------------------: | :--------------------: |
|          `public byte[] getBytes()`          | 使用默认字符集进行编码 |
| `public byte[] getBytes(String charsetName)` | 使用指定字符集进行编码 |

使用说明：`public byte[] getBytes()`，IDEA使用UTF-8编码，Eclipse使用GBK编码。

Java中的解码方法：

|            `String`类中的方法             |          说明          |
| :---------------------------------------: | :--------------------: |
|          `String(byte[] bytes)`           | 使用默认字符集进行编码 |
| `String(bytes bytes, String charsetName)` | 使用指定字符集进行编码 |

### 15.4 字符流

前文提到过，产生乱码的主要原因是编解码方式不统一和未读取到完整编码字节，前者主要是在编解码的时候人为控制确保使用同一种字符集即可，而后者的解决方案则是避免使用字节流读取文本文件，那么就需要另一种用方式来读取文本文件内容，于是便设计了字符流。

字符流其实本质就是带着字符集的规则来读取字节，所以其底层原理还是字节流的读取。`字符流 = 字节流 + 字符集`

特点：

* 输入流：读取时默认一次只读取一个字节，如果遇到多个字节才能表示的字符（通过字符集查询），则一次读取多个字节。
* 输出流：与字节流一样，底层会将数据按照指定的字符集编码，转为字节再写到文件中。

**使用场景:** 对**纯文本**文件进行读写操作。

![image-20260301174949768](https://gitee.com/triabin/img_bed/raw/master/2026/03/01/a13590ac4ee93e72ddb35c61ad0f0b7a-image-20260301174949768.png)

<div style="clear: both;"></div>

命名规则与字节流相同，最后一个单词不变，根据字符流的作用对象不同改变前面的单词即可，例如文件输入字符流`FileReader`、缓冲区输入字符流`BufferedReader`、带有行号的字符输入流`LineNumberReader`等。

#### 字符输入流的使用（以`FileReader`为例）

字符输入流的使用同样分为三个步骤，分别是创建字符输入流对象、读取数据和释放资源。

* 创建字符输入流对象

  |               构造方法               |            说明            |
  | :----------------------------------: | :------------------------: |
  |    `public FileReader(File file)`    | 创建字符输入流关联本地文件 |
  | `public FileReader(String pathname)` | 创建字符输入流关联本地文件 |

  使用说明：

  * 读取文件不存在，直接报错。
  * 如果传入的是路径字符串，底层同样是创建`File`对象然后再调用通过文件对象创建字符输入流的构造函数。

* 读取数据

  |             成员方法             |              说明              |
  | :------------------------------: | :----------------------------: |
  |       `public int read()`        |   读取数据，读到末尾，返回-1   |
  | `public int read(char[] buffer)` | 读取多个数据，读到末尾，返回-1 |

  使用说明：

  * `public int read()`：按字节进行读取，遇到多字节的字符，一次读取多个字节，读取后解码，这里的解码是一个获取字节在字符集上的数字的过程，获取到该数字后将其转为十进制并返回。
  * `public int read(char[] buffer)`：与字节流中一样，返回值也是表示当前读到了几个数据，如果读到文件末尾了，返回-1。并且由于要将数据存入`char`数组，所以它还需要将解码后得到的十进制数强转为`char`。

* 释放资源

  |       成员方法       |       说明       |
  | :------------------: | :--------------: |
  | `public int close()` | 释放资源（关流） |

代码演示：

```java
import java.io.FileReader;
import java.io.Reader;

public class ReaderDemo {
    public static void main(String[] args) {
        // 1. 创建字符输入流对象
        try (Reader reader = new FileReader("demo.txt")) {
            // 2. 读取数据 read()，字符流底层也是字节流，默认也是一个字节一个字节的读取
            // 如果遇到中文，GBK编码一次读取2个字节，UTF-8一次读取3个字节
            int ch;
            while ((ch = reader.read()) != -1) {
                // 由于read()方法返回的是字符在指定编码上的十进制数字，所以要想看到具体的字符内容，还需要将其强转为char类型
                System.out.print((char) ch);
            }
            // 3. 释放资源，由于使用了try-with-resources语句，这步省略
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

`read(char[] buffer)`演示：

```java
import java.io.FileReader;
import java.io.Reader;

public class ReaderDemo {
    public static void main(String[] args) {
        // 1. 创建字符输入流对象
        try (Reader reader = new FileReader("demo.txt")) {
            // 2. 读取数据
            char[] buffer = new char[2];
            int len;
            while ((len = reader.read(buffer)) != -1) {
                // 把数组中的数据变成字符串再打印
                System.out.print(new String(buffer, 0, len));
            }
            // 3. 释放资源，由于使用了try-with-resources语句，这步省略
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 字符输出流的使用（以`FileWriter`为例）

字符输出流的使用分为三步，创建字符输出流对象、写数据和释放资源。

* 创建字符输出流对象

  |                       构造方法                       |                     说明                     |
  | :--------------------------------------------------: | :------------------------------------------: |
  |           `public FilterWriter(File file)`           |          创建字符输出流关联本地文件          |
  |         `public FileWriter(String pathname)`         |          创建字符输出流关联本地文件          |
  |    `public FileWriter(File file, boolean append)`    | 创建字符输出流关联本地文件，追加模式（可选） |
  | `public FileWriter(String pathname, boolean append)` | 创建字符输出流关联本地文件，追加模式（可选） |

  使用说明：

  * 参数是字符串表示的路径或者`File`对象都可以。
  * 如果文件不存在会创建一个新的文件，但是要保证父级路径是存在的。
  * 如果文件已经存在，则会清空文件再写入，如果不想清空则使用追加模式。

* 写数据

  |                  成员方法                   |           说明           |
  | :-----------------------------------------: | :----------------------: |
  |             `void write(int c)`             |       写出一个字符       |
  |          `void write(String str)`           |      写出一个字符串      |
  | `void write(String str, int off, int len)`  | 写出一个字符串的指定部分 |
  |          `void write(char[] cbuf)`          |     写出一个字符数组     |
  | `void write(char[] cbuf, int off, int len)` |  写出字符数组的指定部分  |
  
  使用说明：`write`方法的参数是整数的时候，实际上写到本地文件中的是整数在字符集上对应的字符。
  
* 关闭资源

#### 字符流原理解析*

**字符输入流:** 与字节输入流一样，创建字符输入流对象的过程相当于是在文件（或其他资源）与内存之间创建了一个流向内存的单向通道，但是与字节输入流不同的是，字符输入流还会创建一个长度为8192的字节数组（即8KB）作为缓冲区。当读取数据的时候，会先去缓冲区中读取，如果缓冲区中没有数据，就通过流对象获取数据装到缓冲区中，每次都尽可能装满缓冲区，如果文件中也没有数据了，则直接返回-1；如果缓冲区中有数据，则直接从缓冲区中读取数据，每次读取多少个字节取决于编码字符集。

![image-20260302105731071](https://gitee.com/triabin/img_bed/raw/master/2026/03/02/f0c7da29d6b3e1ebfedbd63c678b2de3-image-20260302105731071.png)

<div style="clear: both;"></div>

假设创建的字符输入流对象为`fr`，则上图中代码执行解析如下：

* 第一行，定义临时存放读取结果的变量`ch`；
* 第二行，读取字符流中的数据，此时会先去缓冲区的数组中查找要读取的数据，发现缓冲区数组为空，然后会尽可能的将缓冲区中长度为8192的字节数组装满，因为只有UTF-8编码的两个字符“a”和“我”，分别占用1个字节和3个字节，全部的4个字节都会被读取并存储到缓冲区中，然后读取到第一个字节的值，将其解码后转为十进制（a，对应97）赋值给变量`ch`；
* 第三行，将97强转为字符（`a`）并打印到控制台；
* 第四行，再次运行`read()`方法，还是直接去缓冲区中查看数据，发现缓冲区中有数据，由于第二个字符是中文，根据UTF-8编码规则，于是这次直接读取3个字符，将其解码后转为十进制赋值给`ch`；
* 第五行，将此时的`ch`强转为字符（`我`）并打印到控制台；
* 第六行，再次运行`read()`方法，此时缓冲区中的数据已经全部被读取，于是重新去文件中读取数据以期尽可能填满缓冲区，发现文件中的数据也已经全部被读取过，代表已经没有数据了，于是直接返回-1赋值给`ch`；
* 第七行，将此时的`ch`强转为字符并打印到控制台。

说明：如果数据超出了缓冲区，则重新读入缓冲区的时候，从数组开头开始一个字节一个字节的覆盖过去。

**字符输出流:** 同理，字符输出流也只是多出了一个缓冲区的概念。写入数据时所有的数据都是写入到缓冲区中，缓冲区的长度同样也是8192，当**缓冲区被装满**、**执行`flush()`方法进行刷新操作**或者**释放资源**的时候，缓冲区中的数据会被真正写入到流的目的地中。

|       成员方法        |                说明                |
| :-------------------: | :--------------------------------: |
| `public void flush()` | 将缓冲区中的数据刷新到流的目的地中 |
| `public void close()` |          释放资源（关流）          |

使用说明：运行`flush()`方法刷新后，流还没有关闭，还可以继续写出数据，而`close()`方法则不行。

![image-20260302113330157](https://gitee.com/triabin/img_bed/raw/master/2026/03/02/301f53379c3bf07bcba61821eb681ecd-image-20260302113330157.png)

<div style="clear: both;"></div>

### 15.5 高级流

从流的继承结构中可知，字节流和字符流的应用都是根据需求来实现四个基本接口（字节流的`InputStream`和`OutputStream`，字符流的`Reader`和`Writer`），根据流的作用在接口名前面添加对应名词即可。这些直接实现这四个接口从而实现对应功能的流被称为基本流（`FileInputStream`、`FileOutputStream`、`Reader`、`Writer`等），而为了使基本流更加好用从而对基本流进一步封装的流则称为高级流，高级流增加的特性名称放在基本流的前面，例如为了提高文件流的读写效率而增加缓冲区的高级流“缓冲流”命名为`BufferedFileInputStream`、`BufferedFileOutputStream`、`BufferedFileReader`、`BufferedFileWriter`。（说明：由于字符流的基本流本身就有缓冲区的机制，因此对应的缓冲流对其效率提升有限，但是封装的高级流中有其他好用的方法）

![image-20260302115613143](https://gitee.com/triabin/img_bed/raw/master/2026/03/02/480b67963656f18fde972f0b335873df-image-20260302115613143.png)

<div style="clear: both;"></div>

高级流除了上面提到的缓冲流外，还有许多其他的高级流，例如转换流、序列化流、打印流和压缩流等。

#### 缓冲流

![image-20260302115842680](https://gitee.com/triabin/img_bed/raw/master/2026/03/02/d2426c0ce5bd597ec09cb40b787e3fdc-image-20260302115842680.png)

<div style="clear: both;"></div>

**字节缓冲流:** 底层自带了长度为8192的缓冲区提高性能。

|                    构造方法                    |                       说明                       |
| :--------------------------------------------: | :----------------------------------------------: |
|  `public BufferedInputStream(InputStream is)`  | 把基本输入流包装成高级输入流，提高读取数据的性能 |
| `public BufferedOutputStream(OutputStream os)` | 把基本输出流包装成高级输出流，提高写出数据的性能 |

使用说明：

* 构造函数除了必须得输入/输出流对象意外，还可以传入一个数字来控制缓冲区的大小，不过不常用，Java默认设计的这个缓冲区大小已经相对很合理了。
* 对于传入缓冲流对象中的基本流，当调用缓冲流的`close`方法的时候，它会将传入的基本流一起关闭（相对比较反直觉，但是这么设计的目的可能是为了帮你做更多的事情吧）。

应用1：一次读写一个字节

```java
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

public class BufferedStreamDemo {
    public static void main(String[] args) {
        // 1. 创建缓冲流对象
        try (InputStream is = new BufferedInputStream(new FileInputStream("demo.txt"));
             OutputStream os = new BufferedOutputStream(new FileOutputStream("copy.txt"))) {
            // 2. 循环读取并写到目的地（一次读写一个字节）
            int b;
            while ((b = is.read()) != -1) {
                os.write(b);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 3. 释放资源（try-with-resources自动关闭）
    }
}
```

应用2：一次读写一个字节数组

```java
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

public class BufferedStreamDemo {
    public static void main(String[] args) {
        // 1. 创建缓冲流对象
        try (InputStream is = new BufferedInputStream(new FileInputStream("demo.txt"));
             OutputStream os = new BufferedOutputStream(new FileOutputStream("copy.txt"))) {
            // 2. 循环读取并写到目的地（一次读写一个字节数组）
            byte[] buffer = new byte[1024];
            int len;
            while ((len = is.read(buffer)) != -1) {
                os.write(buffer, 0, len);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 3. 释放资源（try-with-resources自动关闭）
    }
}
```

字节缓冲流提高效率的原理（以文件相关流为例）：原理基本与字符流的缓冲原理相同，缓冲输入流利用基本输入流去读取数据存入到自身的缓冲区中，尽可能存满缓冲区，后续在内存中使用数据时优先去缓冲区中寻找，找不到才会再次利用基本输入流去读取数据。缓冲输出流亦然，写出的数据也是先存入自身缓冲区中，当缓冲区满或者调用`flush()`方法亦或者调用`close()`方法时才会将缓冲区中数据真正写入到文件中。大致结构如下图。

![image-20260303105955429](https://gitee.com/triabin/img_bed/raw/master/2026/03/03/9dd61fbe4828af9e2bb7c81e9f0beb76-image-20260303105955429.png)

<div style="clear: both;"></div>

**字符缓冲流:** 底层自带了长度为8192的缓冲区提高性能。因为字符的基本流已经自带了同样长度的缓冲区，所以提高的性能有限。

|             构造方法              |        说明        |
| :-------------------------------: | :----------------: |
| `public BufferedReader(Reader r)` | 把基本流变成高级流 |
| `public BufferedWriter(Writer w)` | 把基本流变成高级流 |

字符缓冲流特有方法（这也是及时缓冲区性能提升不明显但是字符缓冲流也更加常用的原因）：

|     字符输入流特有方法     |                     说明                     |
| :------------------------: | :------------------------------------------: |
| `public String readLine()` | 读取一行数据，如果没有数据可读，则返回`null` |
|     字符输出流特有方法     |                     说明                     |
|  `public void newLine()`   |                 跨平台的换行                 |

使用说明：

* `public String readLine()`，该方法在读取的时候一次读取一整行，遇到回车换行即结束，因此它不会将回车换行符读取到内存中。

* `public void newLine()`，由于字符串中的换行在不同平台的差异（Mac`\r`、Linux`\n`、Windows`\r\n`），编写代码的时候不好写出过于复杂的代码去适配（实际开发中要么直接使用`\n`，要么使用`\r\n`），所以正好可以使用这一方法让Java底层自己去适配。

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;

public class BufferedStreamDemo {
    public static void main(String[] args) {
        // 1. 创建缓冲流对象
        try (BufferedReader reader = new BufferedReader(new FileReader("demo.txt"));
             BufferedWriter writer = new BufferedWriter(new FileWriter("copy.txt"))) {
            // 2.按行读取数据并写出到字符输出流，换行使用newLine方法
            String line;
            while ((line = reader.readLine()) != null) {
                writer.write(line);
                writer.newLine();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 3. 关闭资源（try-with-resources自动关闭）
    }
}
```

#### 转换流

![image-20260303134155762](https://gitee.com/triabin/img_bed/raw/master/2026/03/03/ce3a80357b0ec707d5da1fe1225b8a3a-image-20260303134155762.png)

<div style="clear: both;"></div>

转换流属于字符流的高级流，它是字符流和字节流之间的桥梁，用来转换字节流和字符流。用它，可以指定字符集对数据进行读写（JDK11淘汰），此外，字节流可以通过使用字符流中的方法。

![image-20260303134519469](https://gitee.com/triabin/img_bed/raw/master/2026/03/03/570bef32e30a19e19e598807a8b7c0a0-image-20260303134519469.png)

<div style="clear: both;"></div>

通过案例演示其应用：

```java
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.Charset;

public static CvtStreamDemo {
    /**
     * 利用转换流按照指定字符编码读取（了解）
     */
    public static void main(String[] args) {
        // 1. 创建转换流并指定字符编码
        // try (InputStreamReader isr = new InputStreamReader(new FileInputStream("gbk_demo.txt"), "GBK")) {
        //     // 2. 读取数据
        //     int ch;
        //     while ((ch = isr.read()) != -1) {
        //         System.out.print((char) ch);
        //     }
        // } catch (Exception e) {
        //     e.printStackTrace();
        // }
        // 3. 释放资源（try-with-resources自动关闭）

        /* 以上方案在JDK11已被淘汰，以下是替代方案 */
        try (Reader reader = new FileReader("gbk_demo.txt", Charset.forName("GBK"))) {
            int ch;
            while ((ch = reader.read()) != -1) {
                System.out.print((char) ch);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

```java
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.FileWriter;
import java.io.Writer;
import java.nio.charset.Charset;

public static CvtStreamDemo {
    /**
     * 利用转换流按照指定字符编码写出（了解）
     */
    public static void main(String[] args) {
        // 1. 创建转换输出流对象并指定字符集编码
        // try (OutputStreamWriter osw = new OutputStreamWriter(new FileOutputStream("demo.txt"), "GBK")) {
        //     // 2. 写出数据
        //     osw.write("转换输出流指定字符集编码输出演示demo文件内容");
        // } catch (Exception e) {
        //     e.printStackTrace();
        // }
        // 3. 释放资源，使用了try-with-resources语句，这一步省略

        /* 以上方案在JDK11已被淘汰，以下是替代方案 */
        try (Writer writer = new FileWriter("demo.txt", Charset.forName("GBK"))) {
            writer.write("转换输出流指定字符集编码输出演示demo文件内容");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.FileInputStream;
import java.io.InputStream;

public class CvtStreamDemo {
    /**
     * 需求：利用字节流读取文件中的数据，每次读取一整行，而且不能出现乱码
     */
    public static void main(String[] args) {
        try (InputStream is = new FileInputStream("demo.txt");
             InputStreamReader isr = new InputStreamReader(is, StandardCharsets.UTF_8); // 解决字节流读取多字节编码字符容易出现乱码问题
             BufferedReader br = new BufferedReader(isr)) { // 解决无法使用字符流的读取整行方法问题
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### 序列化流

![image-20260306145448906](https://gitee.com/triabin/img_bed/raw/master/2026/03/06/e0a223d8323b524bbd3ccf8ddc312238-image-20260306145448906.png)

<div style="clear: both;"></div>

**序列化流**属于字节流的高级流，也叫做**对象操作输出流**，作用是将Java中的对象写入到本地文件中，由于是字节流，并非的内容也主要是内存数据，因此文件内容是看不懂的，因此也就无法手动修改（注意与JSON序列化区分）。

|                   构造方法                    |         说明         |
| :-------------------------------------------: | :------------------: |
| `public ObjectOutputStream(OutputStream out)` | 把基本流包装成高级流 |

|                  成员方法                   |              说明              |
| :-----------------------------------------: | :----------------------------: |
| `public final void writeObject(Object obj)` | 把对象序列化（写出）到文件中去 |

使用说明：直接使用对象输出流将普通对象保存到文件时会出现`NotSerializableException`异常，必须要实现了`java.io.Serializable`接口的对象才能被序列化和反序列化。`Serializable`接口和前面的`Clonable`接口一样，是一个标记型接口，没有需要被实现的抽象接口，只是标记一下这是一个可被序列化的接口。

**反序列化流**与序列化流作用相反，作用是将序列化流写入文件的对象读取到内存中，也叫**对象操作输入流**。

|                  构造方法                   |        说明        |
| :-----------------------------------------: | :----------------: |
| `public ObjectInputStream(InputStream out)` | 把基本流变成高级流 |

|           成员方法           |                    说明                    |
| :--------------------------: | :----------------------------------------: |
| `public Object readObject()` | 把序列化到本地文件中的对象，读取到程序中来 |

使用说明：注意，读取方法返回的类型为`Object`类型，如果需要原来类型，需要进行强转。

注意事项：

* 序列号问题，如果数据被序列化后，在反序列化之前，对象对应的类成员变量有修改，那么反序列化的时候将会报错`xxx.xxx.Xxx; local class incompatible: stream classdesc serialVersionUID = xxxx, local class serialVersionUID = xxx`。这里会展示这个类在序列化时候的序列化版本号和当前序列化版本号。

  **原因**：当一个类实现了`Serializable`接口的时候，JVM会根据这个类的所有内容进行计算得到一个`long`类型的序列号，当序列化的时候会将这个序列号一并序列化，反序列化的时候会对比这个序列号，如果不一致就会报错。

  **解决**：固定版本号，在定义可序列化的类的时候，手动指定序列号。格式：`private static final long serialVersionUID = 序列化版本号L;`，对于序列号具体的值，可以手动指定，但是开发过程中不会使用这种方式，一般都是代码编辑器来生成。IDEA生成`serialVersionUID`设置，进入`设置`，直接在设置中搜索`serialVersionUID`，然后勾选两个选项`Transient field is not initialized on deserialization`和`Serializable class without 'serialVersionUID'`，勾选这两个选项后，如果一个类实现了`Serializable`接口并且类中没有定义序列化版本号，那么编辑器将会告警，此时将鼠标悬浮到类名上或者光标移动到类名上后按下`Alt + Enter`，都会出现创建`serialVersionUID`的选项，直接点击即可。

  **说明**：如果在序列化后新增了字段，反序列化的时候该字段将使用对应数据类型的默认值或者指定的默认值。在实际开发过程中，几乎所有的实现了`Serializable`接口的类都要定义`serialVersionUID`。

* 对于不想序列化的字段，可以只使用前文中提到过的`transient`关键字修饰（瞬态关键字）。

* 序列化后的文件不能被修改（肉眼也看不懂），一旦修改，反序列化必定失败。

> **说明**
>
> 实际使用中，遇到无法及时处理的数据时，序列化数据就是其中一种缓解数据的处理方案，例如，在提供接口服务的项目中，如果接口遇到流量高峰，瞬间接收了很多数据，这时候一般是利用消息队列/Redis等现将数据接收避免接口拥堵，确保接口的负载能力，当消息队列/Redis对应的服务器到达容量上限的时候，可能会考虑本地内存中存储这部分数据（直接在Java项目中使用Java的队列或者其他合适的数据结构存储这些数据），然后另一边程序端重消息队列/Redis或者本地内存中取出数据进行处理。但是，服务器处理（消费）这些数据的速度总有比不上消息传入速度的时候，上述这些存储数据的方式利用的都是内存，空间总是有限，因此一般还会再加一层保险措施，那就是本地序列化，当消息队列/Redis以及本地内存都存满的时候，会开始将数据进行本地序列化，存储数据的硬件从内存改为硬盘，存储空间大得多（一般来说）。当过了流量高峰，服务器压力下来以后再将本地存储的对象文件反序列化成内存中的对象，继续处理，当然这中间注意处理完成后删除序列化文件。
>
> 如此，引入序列化和反序列化之后，自然增加了文件IO，牺牲了速度对象数据传输的速度，但是至少尽可能确保了消息的完整性和接口性能，并且兼容了没有消息队列/Redis服务器的客户。
>
> （以上只是我在工作过程中遇到的序列化与反序列化流的具体使用，另外，具体使用的时候因为一般都是一次写入多个对象，因此在编写工具方法的时候会直接在文件中写入`ArrayList`类对象，避免读取对象的时候不知道要执行多少次`readObject()`方法）

```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Collection;

public class MyFileUtils {
    
    public static void main(String[] args) {
        // 应用举例：
        
        // 序列化文件路径：序列化文件一般用“.ser”结尾，此外，为了避免名字冲突，会在文件名中加入时间戳
        String path = String.format("%s%s_%d.ser", "/Users/dawnlee/Desktop/", Student.class.getSimpleName(), System.currentTimeMillis());
        // 要序列化的数据，Student类就学号和姓名两个字段
        List<Student> students = new ArrayList<>(3);
        students.add(new Student("001", "张三"));
        students.add(new Student("002", "李言"));
        students.add(new Student("003", "张嫣"));
        // 序列化
        try {
            MyFileUtils.serialize(students, path);
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 反序列化
        try  {
            // 关于这里的类型转换，利用ArrayList是无法带着泛型的，利用List<Student>接收会出现告警，但是不影响使用
            List<Student> res = MyFileUtils.deserialize(path, ArrayList.class);
            System.out.println(res); // [Student{id='001', name='张三'}, Student{id='002', name='李言'}, Student{id='003', name='张嫣'}]
            // 成功反序列化并且反序列化后删除了序列化文件
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    /**
     * 方法描述：将要序列化的对象序列化到指定文件中
     * @param objs {@link Collection} 要序列化的对象集合
     * @param path {@link String} 序列化文件路径
     * @return {@code boolean} 序列化结果
     * @throws IOException 文件操作异常
     */
    public static <T> boolean serialize(Collection<T> objs, String path) throws IOException {
        File file = new File(path);
        if (!file.exists()) {
            // 不存在则创建文件
            File parentFile = file.getParentFile();
            if (!parentFile.exists() && !parentFile.mkdirs()) {
                throw new IOException("Cannot create directory: " + parentFile.getAbsolutePath());
            }
        } else if (file.isDirectory()) {
            throw new IOException("File '" + path + "' exists but is a directory");
        }
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(file));
        oos.writeObject(objs);
        oos.close();
        return true;
    }

    /**
     * 方法描述：返序列化对象到内存中并删除序列化文件
     * @param path {@link String} 序列化文件路径
     * @param clazz {@link Class} 反序列化后的对象类型，例`ArrayList.class`
     * @return {@link T} 反序列化类型
     * @throws IOException 文件操作异常
     * @throws ClassNotFoundException 类型转化异常
     */
    public static <T> T deserialize(String path, Class<T> clazz) throws IOException, ClassNotFoundException {
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream(path));
        Object o = ois.readObject();
        ois.close();
        try {
            File file = new File(path);
            file.delete();
        } catch (Exception e) {
            System.err.printf("序列化文件【%s】删除失败，错误信息：%s%n", path, e.getMessage());
        }
        return clazz.cast(o);
    }
}
```

#### 打印流

![image-20260309162427961](https://gitee.com/triabin/img_bed/raw/master/2026/03/09/2399341b0801c3815aae82df11079fc7-image-20260309162427961.png)

<div style="clear: both;"></div>

**打印流**只有输出流，没有输入流，一般是指`java.io.PrintStream`和`java.io.PrintWriter`两个类，分别表示字节打印流和字符打印流。

* 打印流只操作文件目的地，不操作数据源（只能写不能读的原因）
* 特有的写出方法可以实现数据的**原样**写出，例如打印的是`97`或`true`，那么文件中也是`97`或`true`
* 特有的写出方法，可以实现自动刷新、自动换行（`打印一次数据 = 写出 + 换行 + 刷新`）

**字节打印流**：

|                           构造方法                           |             说明             |
| :----------------------------------------------------------: | :--------------------------: |
|        `public PrintStream(OutputStream/File/String)`        | 关联字节输出流/文件/文件路径 |
|    `public PrintStream(String fileName, Charset charset)`    |         指定字符编码         |
|  `public PrintStream(OutputStream out, boolean autoFlush)`   |           自动刷新           |
| `public PrintStream(OutputStream out, boolean autoFlush, String coding)` |    指定字符编码且自动刷新    |

使用说明：字节打印流底层没有缓冲区，因此不管开不开自动刷新，每次都是直接写到文件目的地。

|                      成员方法                       |                    说明                    |
| :-------------------------------------------------: | :----------------------------------------: |
|             `public void write(int b)`              | 常规方法：规则与之前一样，将制定的字节写出 |
|            `public void println(Xxx xx)`            | 特有方法：打印任意数据，自动刷新，自动换行 |
|             `public void print(Xxx xx)`             |       特有方法：打印任意数据，不换行       |
| `public void printf(String format, Object... args)` |   特有方法：带有占位符的打印语句，不换行   |

使用说明：关于`public void printf(String format, Object... args)`中的`format`，见前文[8.5 字符串格式化](#8.5 字符串格式化)，与`System.out.printf`也一样。

字节打印流使用样例：

```java
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;

public class PrintStreamDemo {
    public static void main(String[] args) {
        // 1. 创建字节打印流对象
        try (PrintStream ps = new PrintStream(new FileOutputStream("demo.txt"), true, StandardCharsets.UTF_8)) {
            // 2. 写出数据
            ps.println(97); // 文件中写出 97，而不是之前的字母a，并且换行（写出 + 自动刷新 + 自动换行）
            ps.print(true); // 文件中写出 true，并且自动刷新，不换行
            ps.println(); // 文件中换行并且自动刷新
            ps.printf("%s爱上了%s", "阿珍", "阿强"); // 文件中写出格式化字符串结果并刷新
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 3. 释放资源，由于使用了try-with-resources语句，可以省略ps.close()
    }
}
```

**字符打印流:** 字符打印流于字节打印流类似，只不过字符打印流底层多了一个缓冲区，因此其自动刷新的参数有了作用。

|                           构造方法                           |             说明             |
| :----------------------------------------------------------: | :--------------------------: |
|           `public PrintWriter(Writer/File/String)`           | 关联字符输出流/文件/文件路径 |
|    `public PrintWriter(String fileName, Charset charset)`    |         指定字符编码         |
|      `public PrintWriter(Writer w, boolean autoFlush)`       |           自动刷新           |
| `public PrintWriter(OutputStream out, boolean autoFlush, Charset charset)` |    指定字符编码且自动刷新    |

|                      成员方法                       |                    说明                    |
| :-------------------------------------------------: | :----------------------------------------: |
|             `public void write(int b)`              | 常规方法：规则与之前一样，将制定的字节写出 |
|            `public void println(Xxx xx)`            | 特有方法：打印任意数据，自动刷新，自动换行 |
|             `public void print(Xxx xx)`             |       特有方法：打印任意数据，不换行       |
| `public void printf(String format, Object... args)` |   特有方法：带有占位符的打印语句，不换行   |

使用说明：可以看得出来，字符打印流的构造方法和成员方法基本一致，因此没有什么需要特别说明的，唯一的区别就是如果字符打印流需要手动开启自动刷新，因此自动刷新的参数有效。

字符打印流使用样例：

```java
public class PrintWriterDemo {
    public static void main(String[] args) {
        // 1. 创建字符打印流对象
        try (PrintWriter pw = new PrintWriter(new FileWriter("demo.txt", StandardCharsets.UTF_8), true)) {
            // 2. 写出数据，是否自动刷新看pw是否指定了autoFlush
            pw.println(97); // 文件中写出 97，自动换行
            pw.print(true); // 文件中写出 true
            pw.println(); // 文件中换行
            pw.printf("%s爱上了%s", "阿珍", "阿强"); // 文件中写出格式化字符串结果
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 3. 释放资源，由于使用了try-with-resources语句，可以省略ps.close()
    }
}
```

> 打印流应用场景：系统中的标准输出流，`System.out`，这个`out`就是`PrintStream`对象，这个打印流在JVM启动的时候创建，默认指向控制台，在Java中称为系统标准输出流。这个流在JVM中是唯一的，JVM启动期间不能关闭（不要手欠调用`System.out.close()`）。

#### 解压缩流/压缩流

![image-20260311175406562](https://gitee.com/triabin/img_bed/raw/master/2026/03/11/0d6b101f5bf2d28fb5b88a279783406f-image-20260311175406562.png)

<div style="clear: both;"></div>

解压过程本质上是将文件中的数据读取到内存中的过程，因此解压缩流是输入流，而压缩过程本质又是将内存中的数据写出到文件中，因此压缩流式输出流。

解压过程（以`.zip`为例）：压缩包中的每一个文件都是一个`ZipEntry`对象，加压过程就是将每一个`ZipEntry`内容按照层级拷贝到本地另一个文件夹中的过程。

> 说明：Java只支持`zip`格式的压缩包，对于`rar`、`7z`等格式，需要使用第三方实现的库（例如`Apache Commons Compress`），`.jar`文件本质是一种特殊的`zip`格式，可以使用`ZIP API`处理，JDK8增加了对`ZIP64`的支持。

解压文件样例：

```java
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class MyFileUtils {
    /**
     * 方法描述：解压zip压缩包到指定路径
     * @param zipFile {@link File} 压缩包文件
     * @param destDir {@link File} 解压目标路径
     * @throws IOException 文件操作异常
     */
    public static void unzip(File zipFile, File destDir) throws IOException {
        long startTime = System.currentTimeMillis();
        System.out.printf("开始将【%s】解压到【%s】%n",
                          zipFile.getAbsolutePath(),
                          destDir.getAbsolutePath());
        if (!destDir.exists() && !destDir.mkdirs()) {
            throw new IOException("Cannot create directory: " + destDir.getAbsolutePath());
        }
        try  (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                File dest = new File(destDir, entry.toString());
                if (entry.isDirectory() && !dest.exists()) {
                    // 文件夹的处理方案：直接按照层级创建文件夹即可
                    dest.mkdirs();
                } else {
                    // 文件的处理方案：将文件写入到目标路径
                    try (OutputStream os = new FileOutputStream(dest)) {
                        byte[] buffer = new byte[2 * 1024 * 1024]; // 2MB缓冲区
                        int len;
                        while ((len = zis.read(buffer)) != -1) {
                            os.write(buffer, 0, len);
                        }
                    } finally {
                        // 关闭当前entry，表示压缩包中的一个文件处理结束
                        zis.closeEntry();
                    }
                }
            }
        }
        System.out.printf("【%s】解压到【%s】完成，耗时：%d毫秒%n",
                          zipFile.getAbsolutePath(),
                          destDir.getAbsolutePath(),
                          System.currentTimeMillis() - startTime);
    }
}
```

压缩过程（以`.zip`为例）：压缩的本质就是把每一个文件（或文件夹）看成是一个`ZipEntry`对象放到压缩包中。

压缩文件样例：

```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class MyFileUtils {
    /**
     * 方法描述：将文件（夹）压缩到指定文件
     *
     * @param file    {@link File} 要压缩的文件
     * @param zipFile {@link File} 压缩到的文件
     * @throws IOException 文件操作异常
     */
    public static void zip(File file, File zipFile) throws IOException {
        long startTime = System.currentTimeMillis();
        System.out.printf("开始将【%s】压缩到【%s】%n",
                          file.getAbsolutePath(),
                          zipFile.getAbsolutePath());
        if (!file.exists()) {
            throw new IllegalArgumentException("Not exists: " + file.getAbsolutePath());
        }
        try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFile))) {
            toZip(file, zos, file.getName());
        }
        System.out.printf("【%s】压缩到【%s】完成，耗时：%d毫秒%n",
                          file.getAbsolutePath(),
                          zipFile.getAbsolutePath(),
                          System.currentTimeMillis() - startTime);
    }

    /**
     * 方法描述：将文件（夹）压缩到同级文件夹下
     *
     * @param file {@link File} 要压缩的文件
     * @throws IOException 文件操作异常
     */
    public static void zip(File file) throws IOException {
        String name = file.getName();
        String zipName = file.isDirectory() ? name : name.substring(0, name.lastIndexOf('.'));
        zip(file, new File(file.getParentFile(), zipName + ".zip"));
    }

    /**
     * 方法描述：获取文件（夹）下的每一个文件，将其变成ZipEntry对象，放入压缩包中
     *
     * @param file {@link File} 要压缩的文件（夹）
     * @param zos  {@link ZipOutputStream} 压缩文件输出流
     * @param name {@link String} 压缩包内部的父级路径
     */
    private static void toZip(File file, ZipOutputStream zos, String name) throws IOException {
        if (file.isFile()) {
            fileToZipEntry(file, zos, name);
            return;
        }
        File[] files = file.listFiles();
        for (File f : files) {
            if (f.isFile()) {
                // 如果是文件，将其变成ZipEntry对象，放入压缩包中
                fileToZipEntry(f, zos, name + File.separator + f.getName());
            } else {
                // 如果是文件夹则修改压缩包内部父级路径后递归
                toZip(f, zos, name + File.separator + f.getName());
            }
        }
    }

    /**
     * 方法描述：工具方法，将指定文件中的数据写入到{@link ZipEntry}中
     *
     * @param file      {@link File} 要写入的文件
     * @param zos       {@link ZipOutputStream} 压缩包文件输出流
     * @param entryName {@link String} ZipEntry的名字
     * @throws IOException 文件操作异常
     */
    private static void fileToZipEntry(File file, ZipOutputStream zos, String entryName) throws IOException {
        ZipEntry entry = new ZipEntry(entryName);
        zos.putNextEntry(entry);
        try (FileInputStream fis = new FileInputStream(file)) {
            byte[] buffer = new byte[2 * 1024 * 1024];
            int len;
            while ((len = fis.read(buffer)) != -1) {
                zos.write(buffer, 0, len);
            }
        }
        zos.closeEntry();
    }
}
```

#### commons-io

`commons-io`，Apache Commons IO，是一个apache开源基金组织提供的一组有关IO操作的开源工具包，旨在提高项目中IO流的开发效率。

> Apache开源基金组织：专门为支持开源项目而办的一个非营利性组织，成立于1999年，总部在美国马里兰州。这个组织有非常非常多的项目广泛应用于世界各地各行各业。例如Java的web应用服务器Tomcat、Java项目管理工具Maven、Java安全框架Shiro、分布式框架Dubbo、消息中间件ActiveMQ和RocketMQ、大数据中间件Kafka、分布式作为配置中心的Zookeeper、大数据分析平台Apache Pig、大数据开发的三大框架（Hadoop、Spark、Flink）、分布式搜索Lucene（已被es替代，Elasticsearch）、Commons工具包等（本节commons-io就来自这个工具包集）。
>
> Commons中有非常多类型的工具包，`StringUtils`字符串工具类、`NumberUtils`数字工具类、`ArrayUtils`数组工具类、`DateUtils`日期工具类、`StopWatch`秒表工具类、`ClassUtils`反射工具类、`SystemUtils`系统工具类、`MapUtils`集合工具类、`Beanutils`Bean工具类等。

**在项目中使用第三方代码步骤（未使用Maven的情况下）**：首先需要明确，第三方代码会被打包成一个`.jar`后缀的文件，称之为“jar包”。以后使用Maven管理包后，直接配置好后它会自动下载并管理，不用手动去复制，以下为手动引用第三方包地步骤。

* 在项目中创建一个文件夹`lib`
* 将jar包复制到`lib`文件夹
* 右键点击jar包，选择`Add as Library`，然后确认
* 之后就可以在类中直接导包使用了

> `commons-io`的jar包官网下载地址：[https://commons.apache.org/proper/commons-io/download_io.cgi](https://commons.apache.org/proper/commons-io/download_io.cgi)，注意下载`Binaries`下的已打包文件，`Source`下为源码。下载后解压，选取其中的`commons-io-版本号.jar`复制到项目中即可。

**`commons-io`常见方法**: 这些方法大多较为常见，并且基本上都算得上是见名知意，通过前几章的学习，也基本大概能想象到底层代码如何编写，它的目的主要就是为了免去这些极为繁琐代码的反复书写。

|               `FileUtils`类（文件/文件夹相关）               |           说明           |
| :----------------------------------------------------------: | :----------------------: |
|  `public static void copyFile(File srcFile, File destFile)`  |         复制文件         |
| `public static void copyDirectory(File srcDir, File destDir)` |        复制文件夹        |
| `public static void copyDirectoryToDirectory(File srcDir, File destDir)` |        复制文件夹        |
|     `public static void deleteDirectory(File directory)`     |        删除文件夹        |
|     `public static void cleanDirectory(File directory)`      |        清空文件夹        |
| `public static String readFileToString(File file, Charset encoding)` | 读取文件中的数据为字符串 |
| `public static void write(File file, CharSequence data, String encoding)` |         写出数据         |

|                    `IOUtils`类（流相关）                     |    说明    |
| :----------------------------------------------------------: | :--------: |
| `public static int copy(InputStream input, OutputStream output)` |  复制文件  |
| `public static int copyLarge(Reader reader, Writer writer)`  | 复制大文件 |
|       `public static String readLines(Reader reader)`        |  读取数据  |
| `public static void write(String data, OutputStream output)` |  写出数据  |

#### hutool

`hutool`是国内的程序员写的一个综合工具包，应用十分广泛。`hu`是作者致敬前公司名，`tool`则是工具，外号“糊涂包”。它包含了`DateUtils`日期时间工具类、`TimeInterval`计时器工具类、`StrUtil`字符串工具类、`HexUtil`十六进制工具类、`HashUtil`哈希算法类、`ObjectUtil`对象工具类、`ReflectUtil`反射工具类、`TypeUtil`泛型类型工具类、`PageUtil`分页工具类、`NumberUtil`数字工具类、`IO`IO工具类等。

以下为IO相关工具类例举说明：

|       相关类        |              说明               |
| :-----------------: | :-----------------------------: |
|      `IoUtil`       |          流操作工具类           |
|     `FileUtil`      |     文件读写和操作的工具类      |
|   `FileTypeUtil`    |       文件类型判断工具类        |
|   `WatchMonitor`    |         目录、文件监听          |
| `ClassPathResource` | 针对`ClassPath`中资源的访问封装 |
|    `FileReader`     |          封装文件读取           |
|    `FileWriter`     |          封装文件写入           |

官网：[https://hutool.cn](https://hutool.cn/)，在上面可以方便查看文档，如果不是在Maven项目或者Gradle项目中使用，需要手动引入的情况，可以去其下载地址选取对应所需版本下载：[https://repo1.maven.org/maven2/cn/hutool/hutool-all](https://repo1.maven.org/maven2/cn/hutool/hutool-all/)。

> `commons-io`也好，`hutool`也罢，它们的方法都是及其海量的，全部记住不现实，所以需要在想到相关功能的时候可以考虑先去里面找找对应的类和方法即可，需要学会查询文档。

## 16、多线程&JUC

### 16.1 多线程

#### 基础概念

线程：线程是操作系统能够进行运算调度的最小单位。它被包含在进程之中，是进程中的实际运作单位。

> 程序与进程、线程之间的关系：一个应用启动后可能会开启多个进程，一般来说一个进程只做一件事，要做成这件事，可能需要调度电脑的各种资源，具体去调度这些资源的路径就是在线程中进行的。

多线程：单线程中，对于资源的调度是串行的，在一件事情做完之前，只能等着。多线程就是多个单线程同时执行代码进行资源调度。

应用场景：

* 当程序做一件事情需要耗费大量时间的时候，等待时间较长（例如读取/加载资源或者网络传输时的大量IO），这个等待的时间不想浪费就可以考虑另外开一个线程去做别的事情。
* 对于一些数据的处理，为了加快处理效率，充分利用电脑CPU的多核性能，就可以使用多线程同时处理。应用举例：一个后端服务中，接口接收到了大量的数据，将其存入系统的数据存储服务中（MinIO、Redis和消息队列等），此时可以在处理这些数据的服务中开启多线程，多个线程同时去读取数据存储中的数据，分别处理。

并发和并行：并发指在同一时刻，有多个指令在单个CPU上**交替**执行；并行指在同一时刻，有多个指令在多个CPU上**同时**执行。

#### 实现方式

① 继承`java.lang.Thread`类的方式实现

* 定义一个类继承`Thread`类
* 重写`run()`方法，确定线程要做的事情并在方法体中实现代码
* 创建该类对象，调用`start()`方法调用线程

```java
// 1、自己定义一个类实现Thread
public class ThreadDemo extends Thread {
    // 2、重写run方法，方法体为线程中要运行的代码
    @Override
    public void run() {
        // 线程中要做的事情
        System.out.println(Thread.currentThread().getName() + " - 办事儿中……");
    }

    public ThreadDemo() {}
    public ThreadDemo(String name) {
        super(name);
    }
}

// 调用
public class Demo {
    public static void main(String[] args) {
        ThreadDemo t1 = new ThreadDemo("线程1");
        ThreadDemo t2 = new ThreadDemo("线程2");

        // 3、调用线程（必须调用start方法，不能调用run方法）
        t1.start();
        t2.start();
    }
}
```

运行结果：(线程中代码的执行顺序和调用顺序无关，主要看线程切换时机)

> 线程2 - 办事儿中……
> 线程1 - 办事儿中……

② 实现`java.lang.Runnable`接口的方式实现

* 定义一个类实现`Runnable`接口
* 重写里面的`run`方法
* 创建该实现类对象
* 利用该实现类对象作为构造函数的参数传入创建一个`Thread`类对象
* 调用`start()`方法启动线程

```java
// 创建一个类实现Runnalbe接口
public class ThreadDemo implements Runnable {
    // 重写实现run方法
    @Override
    public void run() {
        // 线程中要做的事情
        System.out.println(Thread.currentThread().getName() + " - 办事儿中……");
    }
}

// 调用
public class Demo {
    public static void main(String[] args) {
        ThreadDemo td = new ThreadDemo();
        Thread t1 = new Thread(td);
        t1.setName("线程1");
        Thread t2 = new Thread(td);
        t2.setName("线程2");
        // 调用
        t1.start();
        t2.start();
        
        // 匿名调用
        Thread t3 = new Thread(() -> System.out.println(Thread.currentThread().getName() + " - 办事儿中……"));
        t3.setName("线程3");
        t3.start();
    }
}
```

> 上述样例中的`td`其实就可以理解为线程中要执行的**任务**（任务这个概念很重要，尤其是对后续`Future`和`Callable`两个接口以及线程池相关的理解）

③ 利用`java.util.concurrent.Callable`接口和`java.util.concurrent.Future`接口实现

```java
import java.util.concurrent.Callable;

public class ThreadDemo implements Callable<String> {
    @Override
    public String call() {
        return String.format("线程【%s】返回的内容", Thread.currentThread().getName());
    }
}
```



## 17、网络编程

## 18、反射

## 19、动态代理
