---
title: Java四大函数式编程接口
createTime: 2024/11/25 15:01:09
tags:
  - Java
  - 函数式
  - Functional
---
# Java四大函数式编程接口

> Java中的函数式接口：在Java中，函数式接口是一种特殊的接口，它只定义了一个抽象方法，Java函数式接口主要是为了配合Lambda表达式和方法引用而在jdk1.8引入的，它使得在Java中实现函数式编程风格成为可能。
>
> 函数式接口遵循以下规则：
>
> 1. 只包含一个抽象方法，这个抽象方法的签名（参数列表和返回值类型）定义了整个接口；
> 2. 实现函数式接口的实例可隐式地转换为Lambda表达式或方法引用；
> 3. 通过`@FunctionalInterface`注解来声明其为函数式接口。
>
> 函数式接口是Java在向函数式编程范式靠拢过程中引入的关键概念，它极大地简化了编写回调函数或Lambda表达式的流程。

```java
// @FunctionalInterface为jdk1.8引入的注解
package java.lang;

import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface FunctionalInterface {}
```

在jdk1.8之前，就已经有了很多函数式接口

* `java.lang.Runnable`
* `java.util.concurrent.Callable`
* `java.security.PrivilegedAction`
* `java.util.Comparator`
* `java.io.FileFilter`
* `java.nio.file.PathMatcher`
* `java.lang.reflect.InvocationHandler`
* `java.beans.PropertyChangeListener`
* `java.awt.event.ActionListener`
* `javax.swing.event.ChangeListener`

jdk1.8新增了`java.util.function`包下的很多函数式接口，用来支持Java的函数式编程，从而丰富了Lambda表达式的使用场景。本文主要介绍四大核心函数式接口，分别为消费型接口`Consumer<T>`、供给型接口`Supplier<T>`、函数型（转化）接口`Function<T, R>`和断言型接口`Predicate<T>`，四大接口配合Lambda表达式，能够实现优雅的函数式编程。

| 接口                       | 参数类型 | 返回类型 | 用途                                                         |
| -------------------------- | -------- | -------- | ------------------------------------------------------------ |
| 消费型接口`Consumer<T>`    | T        | void     | 定义了`void accept(T t)`方法，对传入的对象进行处理（消费）。（即要处理什么类型的对象就传什么泛型） |
| 供给型接口`Supplier<T>`    | 无       | T        | 定义了`T get()`方法，生成指定类型的对象。（需要提供什么类型的对象就传什么泛型） |
| 函数型接口`Function<T, R>` | T        | R        | 定义了`R apply(T t)`方法，将T转换为R。（先定义传入对象类型泛型，再定义转换目标对象类型泛型） |
| 断言型接口`Predicate<T>`   | T        | boolean  | 定义了`boolean test(T t)`方法，用于判断传入对象是否满足约束。（要判断什么对象就设置什么泛型） |

## 1. 消费型接口`Consumer<T>`

```java
package java.util.function;

import java.util.Objects;

@FunctionalInterface
public interface Consumer<T> {

    void accept(T t);

    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}
```

`java.util.function.Consumer`接口，是一个消费型的接口，消费数据类型由泛型决定。

**抽象方法`void accept(T t)`：** 用于消费指定泛型T的对象的数据。

用例：

```java
@Test
public void test() {
    Consumer<String> consumer = str -> System.out::println;
    consumer.accept("Hello consumer!");
}
```

```shell
Hello consumer!

Process finished with exit code 0
```

**默认方法`default Consumer<T> andThen(Consumer<? super T> after)`：** 用于连接多个consumer，传一个参数后顺次执行accept方法（`consumer1.andThen(consumer2).andThen(consumer3)...`），最后返回一个consumer，使用返回的这个consumer调用它的accept方法，传入的参数会顺序传入每一个consumer的accept方法执行。

用例：

```java
@Test
public void test() {
    Consumer<String> consumer1 = str -> System.out.println(str + "1!");
    Consumer<String> consumer2 = str -> System.out.println(str + "2!");
    Consumer<String> consumer = consumer1.andThen(consumer2);
    consumer.accept("I'm consumer");
}
```

```shell
I'm consumer1!
I'm consumer2!

Process finished with exit code 0
```

## 2. 供给型接口`Supplier<T>`

```java
package java.util.function;

@FunctionalInterface
public interface Supplier<T> {

    T get();
}
```

`java.util.function.Supplier`接口，是一个供给型接口，即：生产型接口。只包含一个无参方法：`T get()`，用来获取一个泛型参数指定类型的数据。

用例：

```java
@Test
public void test() {
    Supplier<String> supplier = () -> "Hello supplier!";
    System.out.println(supplier.get());
}

// Hello supplier!
```

## 3. 函数型接口`Function<T, R>`

```java
package java.util.function;

import java.util.Objects;

@FunctionalInterface
public interface Function<T, R> {

    R apply(T t);

    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }

    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
    }

    static <T> Function<T, T> identity() {
        return t -> t;
    }
}
```

`java.util.function.Function`接口，是一个函数型接口，用来根据一个类型的数据得到另外一个类型的数据。

**抽象方法`R apply(T t);`：** 将参数类型T传入的参数转换为R类型的值。

用例：

```java
@Test
public void test() {
    Function<Integer, String> function = num -> {
        System.out.println("转换成字符串前：" + num.getClass().getSimpleName() + ", 值为：" + num);
        num += 1;
        return num.toString();
    };
    String numStr = function.apply(0);
    System.out.println("加1并转换成字符串后：" + numStr.getClass().getSimpleName() + ", 值为：" + numStr);
}
```

```shell
转换成字符串前：Integer, 值为：0
加1并转换成字符串后：String, 值为：1

Process finished with exit code 0
```

**默认方法`default <V> Function<V, R> compose(Function<? super V, ? extends T> before)`：** 用于组合两个Function接口，得到一个新的Function接口。具体来说，如果有两个函数`f(x)`和`g(x)`，如果`f(x)`调用compose函数并传入了`g(x)`作为方法参数组合得到一个新的函数`h(x)`，其效果相当于`h(x)=f(g(x))`。

用例：

```java
@Test
public void test() {
    // 定义两个函数
    Function<Integer, Integer> square = x -> x * x;
    Function<Integer, Integer> increment = x -> x + 1;

    // 使用 compose 方法组合这两个函数
    Function<Integer, Integer> composedFunction = square.compose(increment);

    // 应用组合后的函数
    Integer result = composedFunction.apply(5);
    System.out.println("Result: " + result); // 输出应该是 36，因为先对5加1得到6，再对6平方得到36
}
```

```shell
Result: 36

Process finished with exit code 0
```

**默认方法`default <V> Function<T, V> andThen(Function<? super R, ? extends V> after)`：** 该方法与compose方法的最终效果的函数执行顺序相反，先执行调用方的apply方法，该方法的返回结果作为传入的Function接口apply方法的参数再执行。

**静态方法`static <T> Function<T, T> identity()`：** `identity`方法的用途是创建一个函数，该函数接收一个参数并返回该参数的引用（或原始值）。这个函数在函数式编程中被称为恒等函数或身份函数。恒等函数的定义是对于所有输入x，`f(x) = x`。

`identity`方法是函数式编程中非常有用的一个操作，它允许你轻松地创建恒等函数，而不需要手动实现。恒等函数在各种场景下都有用途，比如当你需要返回一个方法参数的引用（或原始值）时，或者当你需要将一个对象作为函数的返回值时。

## 4. 断言型接口`Predicate<T>`

```java
package java.util.function;

import java.util.Objects;

@FunctionalInterface
public interface Predicate<T> {

    boolean test(T t);

    default Predicate<T> and(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) && other.test(t);
    }

    default Predicate<T> negate() {
        return (t) -> !test(t);
    }

    default Predicate<T> or(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) || other.test(t);
    }

    static <T> Predicate<T> isEqual(Object targetRef) {
        return (null == targetRef)
                ? Objects::isNull
                : object -> targetRef.equals(object);
    }
}
```

`java.util.function.Predicate`接口，是一个断定型接口，用于对指定类型的数据进行判断，从而得到一个判断结果（`boolean`类型的值）。

**抽象方法`boolean test(T t)`：** 抽象方法`boolean test(T t)`，用于定义判定条件。

用例：

```java
@Test
public void test() {
    Predicate<String> predicate = String::isEmpty;
    System.out.println(predicate.test("")); // true
    System.out.println(predicate.test("Hello predicate!")); // false
}
```

**默认方法`default Predicate<T> and(Predicate<? super T> other)`：** 用于创建一个新的`Predicate<T>`接口，新的接口使用`短路与(||)`判断两个条件是否成立。

**默认方法`default Predicate<T> negate()`：** 用于创建一个新的`Predicate<T>`接口，新的接口使用`非(!)`判断原条件，即与原来相反。

**默认方法`default Predicate<T> or(Predicate<? super T> other)`：** 用于创建一个新的`Predicate<T>`接口，新接口使用`短路或(||)`判断两个条件是否成立。

**静态方法`static <T> Predicate<T> isEqual(Object targetRef)`：** 用于创建一个新的`Predicate<T>`接口，新接口用于判断指定对象（isEqual方法接收的参数`targetRef`）与新接口test方法接收的参数是否相等。
