# Rust学习笔记

## 1、Rust基础知识

### 1.1 安装&&更新

### 1.2 编译器与包管理工具以及开发环境搭建

#### 包管理工具Cargo

Cargo 是 Rust 的包管理工具，它可以帮助你管理 Rust 项目的依赖关系，并提供编译、测试、打包、发布等功能。

Cargo 的主要功能：

- 管理依赖关系：Cargo 可以自动下载、编译、管理依赖项，并在编译时提供给你的项目。
- 构建项目：Cargo 可以编译项目，并提供丰富的命令来控制编译过程。
- 发布项目：Cargo 可以将你的项目打包成可分发的包，供其他 Rust 程序使用。
- 测试项目：Cargo 可以运行项目的测试用例，并提供详细的测试结果。

#### Cargo.toml

Cargo.toml 是 Cargo 项目的配置文件，它包含了项目的元数据和依赖关系。

Cargo.toml 包含以下内容：

- package：包的元数据，包括名称、版本、描述、作者、许可证、分类等。、
    - name：包的名称。
    - version：包的版本号。
    - authors：作者列表。
    - edition：Rust 版本。
    - description：包的描述。
    - license：许可证。
    - homepage：项目主页。
    - repository：项目仓库。
    - readme：项目的 README 文件。
    - keywords：关键字列表。
    - categories：分类列表。
    - default-run：默认运行的可执行文件。
    - workspace：工作区。
- dependencies：依赖关系，Cargo 会自动下载、编译、管理这些依赖项。
- dev-dependencies：开发依赖关系，仅在开发时使用，例如测试框架。（一般用于配置开发测试环境）
- build-dependencies：构建依赖关系，仅在构建时使用，例如构建脚本。（一般用于适配环境，不常用，因为没有那么多特别需要配置的特殊环境）
- profile：编译配置，包括优化级别、链接器、目标平台等。
- [features]：可选功能，可以启用或禁用特定功能。
- [workspace]：工作区，可以包含多个包，并提供统一的构建和测试。

#### Cargo.lock

Cargo.lock 是 Cargo 生成的锁文件，它包含了项目依赖的具体版本号，Cargo 使用锁文件来确保项目的可重复构建。

Cargo.lock 文件不会被纳入版本控制，每次运行 Cargo 命令时都会重新生成。

#### Cargo工作流

Cargo 的工作流包括以下步骤：

1. 编写代码：在项目目录下，编写 Rust 代码。
2. 构建项目：在项目目录下，运行 `cargo build` 命令，Cargo 会编译代码，并生成可执行文件。
3. 测试项目：在项目目录下，运行 `cargo test` 命令，Cargo 会编译代码，并运行测试用例。
4. 运行项目：在项目目录下，运行可执行文件，Cargo 会启动项目。
5. 发布项目：在项目目录下，运行 `cargo publish` 命令，Cargo 会将项目打包成可分发的包，供其他 Rust 程序使用。

### 1.3 获取Rust的库、国内源以及Windows与Linux和Mac的不同

#### Rust库以及库管理

Rust语言的库（crate）的官方网站：[https://crates.io/](https://crates.io/)，可以在网站上查找自己需要的库，然后通过修改Cargo.toml文件来添加依赖关系。

推荐安装Cargo插件`cargo-edit`来管理库：

- 安装：`cargo install cargo-edit`
- 添加库
    - 添加依赖库：`cargo add <dependency_name>`
    - 安装指定版本：`cargo add dependency_name@x.y.z`
    - 添加开发时用的依赖： `cargo add --dev <dependency_name>`
    - 添加构建时用的依赖： `cargo add --build <dependency_name>`
- 删除库：`cargo rm <dependency_name>`

#### 国内源

推按使用[rsproxy.cn](rsproxy.cn)

- 文件`~/.cargo/config`

  ```
  [source.crates-io]
  replace-with = 'rsproxy-aparse'
  [source.rsproxy]
  registry = "https://rsproxy.cn/crates.io-index"
  [source.rsproxy-sparse]
  registry = "sparse+https://rsproxy.cn/index"
  [registries.rsproxy]
  index = "https://rsproxy.cn/crates.io-index"
  [net]
  git-fetch-with-cli = true
  ```

#### Windows的不同

- 安装方式不同
- Windows可选Rust的目标平台标识有`x86_64-px-windows-msvc`和`x86_64-pc-windows-gpu`（不推荐）
- `rustup component`某些组件可能不同
- 设置国内源的文件路径不同：`C:\Users\<用户名>\.cargo\config`或者环境变量`CARGO_HOME`所指定的目录下的`config`（如果设置了该环境变量）

## 2、变量与常见数据类型

### 2.1 变量与不可变性

代码演示：

```rust
pub fn variables() {
    // 不可变与命名
    let _nice_count = 1000; // 自动推到i32
    let _nice_number: i64 = 54; // 显式声明类型
    // nice_count = 2000; // error: reassignment of immutable variable `nice_count`

    // 声明变量可变
    let mut _count = 3;
    _count = 4; // 变量可变，可以重新赋值
    println!("count: {}", _count);

    // Shadowing
    let x = 5;
    {
        // 命名空间
        let x = 10;
        println!("x in inner scope: {}", x);
    }
    println!("x in outer scope: {x}");
    let x = "hello"; // 改变类型
    println!("新的x: {x}");
    let mut x = 0; // 改变类型
    println!("改变可变性后的x：{}", {
        x += 1;
        x
    });
}
```

> warning: `D:\DevEnvironment\Rust\cargo1.84.1\.cargo\config` is deprecated in favor of `config.toml`
>
> note: if you need to support cargo 1.38 or earlier, you can symlink `config` to `config.toml`
>
> Compiling main_prj v0.1.0 (D:\Projects\studies\rust_s\main_prj)
>
>     Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.39s
>
>      Running `target\debug\main_prj.exe`
>
> count: 4
>
> x in inner scope: 10
>
> x in outer scope: 5
>
> 新的x: hello
>
> 改变可变性后的x：1
>

#### 变量

1. 在Rust中，使用let关键字声明变量

2. Rust支持类型推到，但也可以显式指定变量类型

   `let x: i32 = 5;`即为显式指定x的类型为i32

3. 变量使用蛇形命名法（Snake Case，即小写字母和下划线隔开），枚举和结构体使用帕斯卡明明法（Pascal
   Case，即大驼峰命名法）。如果变量没有用到可以前置下划线消除警告。

4. 强制类型转换（Casting a Value to a Different Type）

   `let a = 3.1; let b = a as i32;`

5. 打印变量（`{}`与`{:?}`需要实现特质之后的章节介绍，基础类型默认实现）

    ```rust
    println!("val: {}", x);
    println!("val: {x}");
    ```

#### 变量不可变性

- Rust中的变量默认是不可变的

  不可变性是Rust实现其可靠性和安全性目标的关键，它迫使程序员更深入地思考程序状态的变化，并明确哪些部分的程序状态可能会发生变化。

  不可变性有助于防止一类常见的错误，例如数据竞争和并发问题。

- 使用`mut`关键字进行可变性声明

  需要使用可变性（mut）来声明。

  ```rust
  let mut x = 5; //声明可变变量
  x = 6; //合法修改变量
  ```

- Shadowing Variables并不是重新赋值

Rust允许你隐藏一个变量，这意味着你可以声明一个与现有变量同名的新变量，从而有效地隐藏前一个变量。（相当于可以改变变量的值、类型和可变性）

**Shadowing其实总结下来就是包括变量定义在内的就近原则**，这个思路与其他编程语言很不一样。

### 2.2 常量const与静态变量static

演示代码：

```rust
static MONTH_YEAR: i32 = 12; // 静态变量，全局可见，可变
static mut _DAY_YEAR: i32 = 365; // 定义可变的static静态变量

pub fn const_static() {
    // const
    const SECOND_HOUR: usize = 3_600; // 确定的类型、值
    const SECOND_DAY: usize = 24 * SECOND_HOUR; // 表达式，编译时计算
    println!("一小时有：{SECOND_HOUR} 秒");
    println!("一天有：{SECOND_DAY} 秒");

    {
        const SE: usize = 1_000;
        println!("1秒等于：{SE} 毫秒");
    }
    // println!("1秒等于：{SE} 毫秒"); // 会计作用域，在代码块外无法访问
    println!("static全局变量MONTH_YEAR：{MONTH_YEAR}");

    unsafe {
        _DAY_YEAR = 366; // 可以在unsafe中修改
        // println!("只能在unsafe中修改并且打印可变的static全局变量DAY_YEAR：{DAY_YEAR}");
    }
}
```

#### const常量

- 常量的值必须是在编译时已知的常量表达式，必须指定类型与值
- 与C语言的宏定义（宏替换）不同，Rust的const常量的值被直接嵌入到生成的底层机器代码中，而不是进行简单的字符替换
- 常量名宇静态变量命名规范：全部大写，单词之间加入下划线
- 常量的作用域是块级作用域，它们只在声明它们的作用域内可见

#### static静态变量

- 与const常量不同，static变量实在运行时分配内存的
- 并不是不可变的，可以使用`unsafe`修改
- 静态变量的生命周期为整个程序的运行时间

### 2.3 Rust基础数据类型

- Integer types 默认推断为`i32`（下面的i代表有符号，u代表无符号）
    - `i8`、`i16`、`i32`、`i64`、`i128`
- Unsigned integer types
    - `u8`、`u16`、`u32`、`u64`、`u128`
- Platform-Specific Integer Type（由平台决定）
    - `isize`
    - `usize`
- Float Types
    - `f32`、`f64`
    - 尽量用`f64`，除非你清楚边界所需空间
- Boolean Type
    - `true`、`false`
- Character Type
    - Rust支持Unicode字符
    - 表示char类型使用单引号

代码演示：

```rust
pub fn data_type() {
    // 进制字面量
    let a1 = 255; // 十进制
    let a2 = 0b11111111; // 二进制
    let a3 = 0o377; // 八进制
    let a4 = 0xff; // 十六进制
    println!("a1 = {}, a2 = {}, a3 = {}, a4 = {}", a1, a2, a3, a4);

    // 最大最小值
    println!("i32最大值：{}", i32::MAX);
    println!("i32最小值：{}", i32::MIN);
    println!("u32最大值：{}", u32::MAX);
    println!("u32最小值：{}", u32::MIN);
    println!("平台无符号最大值：{}", usize::MAX);
    println!("usize占用{}个字节", std::mem::size_of::<usize>());
    println!("isize占用{}个字节", std::mem::size_of::<isize>());
    println!("u64占用{}个字节", std::mem::size_of::<u64>());
    println!("i64占用{}个字节", std::mem::size_of::<i64>());
    println!("u32占用{}个字节", std::mem::size_of::<u32>());
    println!("i32占用{}个字节", std::mem::size_of::<i32>());

    // 浮点数
    let f1 = 3.1415926;
    let f2: f32 = 1.6666667;
    println!("f1 = {:.2}, f2 = {:.2}", f1, f2); // {:.2}为保留两位小数

    // 布尔类型
    let is_ok = true; // 自动推断
    let is_not_ok: bool = false; // 手动指定
    println!("is_ok = {}, is_not_ok = {}", is_ok, is_not_ok);
    println!("is_ok or is_not_ok = {}", is_ok || is_not_ok);
    println!("is_ok and is_not_ok = {}", is_ok && is_not_ok);
    println!("!is_ok = {}", !is_ok);

    // 字符类型
    let char_c = 'C';
    let char_emo: char = '😄';
    println!("You get {}, you feel {}", char_c, char_emo);
}
```

> warning: `D:\DevEnvironment\Rust\cargo1.84.1\.cargo\config` is deprecated in favor of `config.toml`
>
> note: if you need to support cargo 1.38 or earlier, you can symlink `config` to `config.toml`
>
> Compiling main_prj v0.1.0 (D:\Projects\studies\rust_s\main_prj)
>
> Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.68s
>
> Running `target\debug\main_prj.exe`
>
> a1 = 255, a2 = 255, a3 = 255, a4 = 255
>
> i32最大值：2147483647
>
> i32最小值：-2147483648
>
> u32最大值：4294967295
>
> u32最小值：0
>
> 平台无符号最大值：18446744073709551615
>
> usize占用8个字节
>
> isize占用8个字节
>
> u64占用8个字节
>
> i64占用8个字节
>
> u32占用4个字节
>
> i32占用4个字节
>
> f1 = 3.14, f2 = 1.67
>
> is_ok = true, is_not_ok = false
>
> is_ok or is_not_ok = true
>
> is_ok and is_not_ok = false
>
> !is_ok = false
>
> You get C, you feel 😄
>

### 2.4 元组与数组

- 相同点
    - 元组和数组都是组合类型（Compound Type），而Vec和Map都是集合类型（Collection Type）
    - 元组和数组长度都是固定的
    - 元组和数组都可以设置为可变
- Tuples元素可以是不同类型的数据类型
- Arrays元素只能是同一类型的数据类型

数组是固定长度的同构集合

- 创建方式：
    - `[a, b, c]`
    - `[value; size]`
- 获取元素：`arr[index]`
- 获取长度：`arr.len()`

元组是固定长度的异构集合

- 函数的默认返回值：`Empty Tuple ()`，空元组不占用任何东西
- 创建方式：`(e1, e2, e3, ...)`
- 获取元素：`tuple.index`
- 元组没有`tuple.len()`方法，无法获取长度

```rust
pub fn tuple_array() {
    // 元组
    let tup = (1, "hello", true);
    println!("元素元素：{}, {}, {}", tup.0, tup.1, tup.2); // 如果访问超出边界，例如tup.3，直接编译报错
    let mut tup = (1, "hi", true); // 设置可变
    tup.0 = 2; // 修改第一个元素的值，注意只能改变值，不能改变数据类型
    println!("修改后的元组元素： {}, {}, {}", tup.0, tup.1, tup.2);
    let tup = ();
    println!("空元组：{:?}", tup); // 空元组，没有元素，不能直接打印，只能打印结构

    // 数组
    let mut arr = [11, 22, 33, 44];
    arr[1] = 999;
    for e in arr {
        print!("{}, ", e);
    }
    println!();
    let arr = [233; 4];
    for item in arr {
        print!("{}, ", item);
    }
    println!();

    // 初识所有权（Ownership）
    let mut tup_item = (2, "ff");
    let mut arr_item = [1, 2, 3];
    println!("tup_item：{:?}", tup_item);
    println!("arr_item：{:?}", arr_item);
    let tup_ownership = tup_item;
    let arr_ownership = arr_item;
    tup_item.0 = 3;
    arr_item[0] = 4;
    println!("tup_ownership：{:?}", tup_ownership);
    println!("arr_ownership：{:?}", arr_ownership);
    // 可以看到这里虽然通过变量名称直接复制给新的变量，修改了旧的变量元素新变量元素并没有改变
    // Rust默认的赋值方式使用copy，即复制所有元素，而不是传递引用，所以这里的修改不会影响到原变量的值
    // 如果使用move，则可以改变onwership，对于struct和string以及一些复杂的数据类型的赋值，则会默认使用move
    let str_item = String::from("aa");
    let str_ownership = str_item;
    // println!("str_item：{:?}", str_item); // 此时str_item所有权已经移交给str_ownership，自己被drop，不能再使用，直接报错：value borrowed here after move
    println!("str_ownership：{:?}", str_ownership);
}
```

> warning: `D:\DevEnvironment\Rust\cargo1.84.1\.cargo\config` is deprecated in favor of `config.toml`
>
> note: if you need to support cargo 1.38 or earlier, you can symlink `config` to `config.toml`
>
> Compiling main_prj v0.1.0 (D:\Projects\studies\rust_s\main_prj)
>
>     Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.53s
>
>      Running `target\debug\main_prj.exe`
>
> 元素元素：1, hello, true
>
> 修改后的元组元素： 2, hi, true
>
> 空元组：()
>
> 11, 999, 33, 44,
>
> 233, 233, 233, 233,
>
> tup_item：(2, "ff")
>
> arr_item：[1, 2, 3]
>
> tup_ownership：(2, "ff")
>
> arr_ownership：[1, 2, 3]
>
> str_ownership："aa"
>
> \* Terminal will be reused by tasks, press any key to close it.
>

## 3、Ownership与结构体、枚举

### 3.1 Rust的内存管理模型

内存管理模型列举：

1. C/C++：手动的，写错了是你菜，`new + delete` | `reference counting`
2. Python、C#、Java：交给GC了，龟派弟子突出一个猥琐，安全但`stop the world`对性能伤害巨大
   “Stop the world”是与垃圾回收（Garbage Collection）相关的术语，它指的是在进行垃圾回收时，系统暂停程序的运行。
   这个术语主要用于描述一种全局性的暂停，即所有应用线程都被停止，以便垃圾回收器能够安全地进行工作。这种全局性的停止会导致一些潜在的问题，特别对于需要低延迟和高性能的应用程序。
   需要注意的是，并非所有的垃圾回收算法都需要“stop the world”，有一些现代的垃圾回收器采用了一些技术来减小全局停顿的影响，比如并发垃圾回收和增量垃圾回收。
3. Rust：`The Rust Compiler`最特殊的一个，`Ownership rules & semantics`、`Borrow Checker`、`Lifetime`
   Rust编译器在编译阶段，通过所有权机制对内存进行一系列的限制和检查，将内存管理的复杂度从运行时移到编译时，将可能得错误扼杀在程序运行前，从而保证内存安全和可靠性。

C/C++内存错误大全：

1. 内存泄漏（Memory Leak）

    ```c++
    int* ptr = new int;
    // 忘记释放内存
    // delete ptr;
    ```

2. 悬空指针（Dangling Pointer）

    ```c++
    int* ptr = new int;
    delete ptr;
    // 继续使用ptr
    ```

3. 重复释放（Double Free）

    ```c++
    int* ptr = new int;
    delete ptr;
    delete ptr; // 释放了两次
    ```

4. 数组越界（Array Out of Bounds）

    ```c++
    int arr[10];
    arr[11] = 1; // 数组越界
    ```

5. 野指针（Raw Pointer）

    ```c++
    int* ptr;
    *ptr = 1; // 野指针
    ```

6. 使用已释放的内存（Use After Free）

    ```c++
    int* ptr = new int;
    delete ptr;
    *ptr = 10; // 已释放的内存
    ```

7. 堆栈溢出（Stack Overflow）：递归堆栈溢出

8. 不匹配的`new/delete`或`malloc/free`

Rust的内存管理模型：

- 所有权系统（Ownership System）

- 借用（Borrowing）
    - 不可变引（借）用
    - 可变引（借）用

- 生命周期（Lifetime）

- 引用计数（Reference Counting）

代码演示：

```rust
pub fn memory_manage() {
    // copy move
    let c1 = 1;
    let c2 = c1; // 基本数据类型，复制
    println!("{}", c1);
    let s1 = String::from("value");
    let s2 = s1; // 字符串类型，转移，s1将所有权转移给s2后
    // println!("{}", s1); // 所有权转移后，s1已销毁，报错：value borrowed here after move
    // 如果要不报错，需要手动调用clone函数
    let s3 = s2.clone();
    println!("s2: {}, s3: {}", s2, s3);
    print_string(s3); // s3传入函数后，s3的所有权转移给函数，函数结束后，s3被销毁
    // println!("{s3}"); // s3被销毁，因此报错：value borrowed here after move

    let first_word = first_word("hello world");
    println!("“Hello World”的第一个单词是：{}", first_word);
    let first_word = crate::demo::eg_3_1_memory_manage::first_word("we are the world");
    println!("“we are the world”的第一个单词是：{}", first_word);
}

fn print_string(s: String) {
    println!("{}", s);
}

// 因为这样的内存管理方式，函数不能返回引用
// fn dangle() -> &str {
//     "hello"
// }
// 改成
fn dangle() -> String {
    "hello".to_owned()
}

// 函数不能返回引用
// fn dangle_ref() -> &str {
// }
// 但是可以返回静态生命周期的引用，但是强烈不推荐这样做，这回造成命名空间污染
fn dangle_static() -> &'static str {
    "hello"
}
// 但是如果只传入一个引用并且只返回一个引用，则可以这么做，核心就是保证所有权机制的完整性
// 案例：返回字符串第一个单词
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}
```

> warning: `D:\DevEnvironment\Rust\cargo1.84.1\.cargo\config` is deprecated in favor of `config.toml`
>
> note: if you need to support cargo 1.38 or earlier, you can symlink `config` to `config.toml`
>
> Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.02s
>
>
> Running `target\debug\main_prj.exe`
>
> 1
>
> s2: value, s3: value
>
> value
>
> “Hello World”的第一个单词是：hello
>
> “we are the world”的第一个单词是：we
>

### 3.2 String与&str

- `String`是一个堆分配的可变字符串类型
  ```rust
  // 源码：
  pub struct String {
      vec: Vec<u8>,
  }
  ```
- `&str`是指字符串切片引用，实在栈上分配的
    - 不可变引用，只想存储在其他地方的`UTF-8`编码的字符串数据
    - 由指针和长度构成

`String`与`&str`如何选择？

> 注意：`String`具有所有权，而`&str`没有

- `Struct`中属性使用`String`
    - 如果不使用显示生命生命周期无法使用`&str`
    - 不止是麻烦，还有更多的隐患
- 函数参数推荐使用`&str`（如果不想交出所有权）
    - `&str`为参数，可以传递`&str`和`&String`
    - `&String`为参数，只能传递`&String`，不能传递`&str`

代码演示：

```rust
struct Person<'a> {
    // name: String,
    name: &'a str, // 如果使用&str，则需要标注生命周期
    color: String,
    age: i32,
}

// 参数可以传&String和&str
fn print(data: &str) {
    println!("{}", data);
}
// 参数只能传&String
fn print_string_borrow(data: &String) {
    println!("{}", data);
}

pub fn string_ref() {
    // 1、String与&str之间的转换
    let str1 = String::from("Value C++"); // 获取String
    let course = "Rust".to_string();
    let course = "Rust".to_owned(); // 字面量&str转换为String，两种方式：to_owned()和to_string()
    let str2 = str1.replace("C++", "CPP");
    println!("str1: {}, course: {}, str2: {}", str1, course, str2);

    // 2、字面量引用可以直接写编码
    let str3 = "\x52\x75\x73\x74"; // ASCII编码的RUST
    println!("str3: {}", str3);

    // 3、在结构体中
    let name = "John"/*.to_string()*/;
    let color = "green".to_string();
    let person = Person {
        name,
        color,
        age: 89,
    };

    // 4、函数中
    let str4 = "value".to_owned();
    // print(str4); // 传入String直接报错：expected &str, but found String
    // 改为传入&String或者&str
    // print("value");
    print(&str4);
    // print_string_borrow("字面量&str"); // 报错：expected `&String`, but found `&str`
    // 只能传入&String
    print_string_borrow(&str4);
}
```

> warning: `D:\DevEnvironment\Rust\cargo1.84.1\.cargo\config` is deprecated in favor of `config.toml`
>
> note: if you need to support cargo 1.38 or earlier, you can symlink `config` to `config.toml`
>
> Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.02s
>
> Running `target\debug\main_prj.exe`
>
> str1: Value C++, course: Rust, str2: Value CPP
>
> str3: Rust
>
> value
>
> value
>

### 3.3 枚举与匹配模式

枚举：

- 枚举（enums）是一种用户自定义的数据类型，用于标识具有一组离散可能值的变量
    - 每种可能值都称为“variant”（变体）
    - 使用：枚举名::变体名
- 枚举的好处
    - 可以使你的代码更严谨、易读
    - More robust programs
- 枚举支持内嵌类型
    ```rust
    enum Sharp {
        Circle(f64),
        Rectangle(f64, f64),
        Square(f64),
    }
    ```
- 常用枚举类型：`Option`和`Result`
    ```rust
    // 用于处理返回值可能为空的场景
    pub enum Option<T> {
        None,
        Some(T),
    }
  
    // 用于返回一个结果，其中包含成功并携带数据和错误的情况，类似网络请求
    pub enum Result<T, E> {
        Ok(T),
        Err(E),
    }
    ```

匹配模式：

> 枚举往往会配合匹配模式来使用

1. `match`关键字实现
2. 必须覆盖所有可能的枚举变体
3. 可以用`_`、`..=`、三元（if）等来进行匹配

```rust
match number {
    0 => println ! ("zero"),
    1 | 2 => println ! ("one or two"),
    3..=9 => println ! ("From three to nine"),
    n if n % 2 == 0 => println ! ("Even number"),
    _ => println ! ("other"), // 匹配所有其他情况
}
```

代码演示：

```rust
// 创建一个枚举
enum Color { // 一个最普通的枚举，没有任何附加属性
    Red,
    Yellow,
    Blue,
    Black,
}
// 匹配枚举
fn print_match_color(color: Color) {
    match color {
        Color::Red => println!("\x1B[31mRed\x1B[0m"),
        Color::Yellow => println!("\x1B[33mYellow\x1B[0m"),
        Color::Blue => println!("\x1B[34mBlue\x1B[0m"),
        _ => (),
    }
}

enum BuildingLocation {
    Number(i32),
    Name(String), // 不要用&str，否则一旦所有权被转移，Name指将无法访问
    Unknown,
}
impl BuildingLocation {
    fn print_location(&self) {
        match self {
            BuildingLocation::Number(num) => println!("building number: {}", num),
            BuildingLocation::Name(name) => println!("building name: {}", *name),
            BuildingLocation::Unknown => println!("Unknown!"),
        }
    }
}

pub fn enum_match() {
    print_match_color(Color::Red);
    print_match_color(Color::Yellow);
    print_match_color(Color::Blue);
    print_match_color(Color::Black);

    let house = BuildingLocation::Name("丽春院".to_string());
    house.print_location();
    let house = BuildingLocation::Number(33);
    house.print_location();
    let house = BuildingLocation::Unknown;
    house.print_location();
}
```

> D:/DevEnvironment/Rust/cargo1.84.1/.cargo/bin/cargo.exe run --color=always --package main_prj --bin main_prj --profile
> dev
>
> warning: `D:\DevEnvironment\Rust\cargo1.84.1\.cargo\config` is deprecated in favor of `config.toml`
>
> note: if you need to support cargo 1.38 or earlier, you can symlink `config` to `config.toml`
>
> Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.02s
>
> Running `target\debug\main_prj.exe`
>
> <font color="#FF0000">Red</font>
>
> <font color="#FFFF00">Yellow</font>
>
> <font color="#0000FF">Blue</font>
>
> building name: 丽春院
>
> building number: 33
>
> Unknown!
>

### 3.4 结构体、方法、关联函数、关联变量

- 结构体，结构体是一种用户自定义的数据类型，用于创建自定义的数据结构，每条数据称为属性（字段，field），通过点号访问结构体中的属性
    ```rust
    // 例：最常见的一个Point结构体
    struct Point {
        x: f32,
        y: f32,
    }
    ```
- 结构体中的方法是指通过实例调用（&self、&mut self、self）
    ```rust
    // 例：Point结构体的distance函数
    impl Point {
        fn distance(&self, other: &Point) -> f64 {
            let dx = self.x - other.x as f64;
            let dy = self.y - other.y as f64;
            (dx.powi(2) + dy.powi(2)).sqrt()
        }
    }
    ```
- 结构体中的关联函数（associated function）是指与结构体（类型）相关联的函数，调用时为`结构体名::函数名`
    ```rust
    // 例：Point结构体的distance函数
    impl Point {
        fn new(x: f32, y: f32) -> Point {
            Pont { x, y }
        }
    }
    ```
- 结构体中的关联变量（associated variable）是指与结构体（类型）相关联的变量，也可以在特质或枚举中，调用时为`结构体名::变量名`
    ```rust
    // 例：Point结构体的distance函数
    impl Point {
        const PI: f64 = 3.14159265358979323846;
    }
    // 调用：Point::PI
    ```

### 3.5 Ownership与结构体

### 3.6 堆与栈、Copy与Move

## 4、流程控制与函数

### 4.1 if流程控制欲match模式匹配

### 4.2 循环与break、continue以及与迭代的区别

### 4.3 函数基础与Copy值参数传递

### 4.4 函数值参数传递、不可变借用参数传递、可变借用参数传递

### 4.5 函数返回值与所有权机制

### 4.6 高阶函数、函数作为参数与返回值

## 5、Error错误处理

### 5.1 错误处理：Result、Option以及panic!宏

### 5.2 错误处理：unwrap()与'?'

### 5.3 自定义一个Error类型

## 6、Boorowing借用 && Lifetime生命周期

### 6.1 Borrowing && Borrow Checker && Lifetime

### 6.2 Lifetime与函数

### 6.3 Lifetime欲Struct

## 7、泛型

### 7.1 Generic Structures

### 7.2 Generic Function

## 8、特质

### 8.1 Trait特质

### 8.2 Trait Object与Box

### 8.3 Trait Object与泛型

### 8.4 重载操作符（Operator）

### 8.5 Trait与多态和继承

### 8.6 常见的Trait

## 9、迭代器

### 9.1 迭代与循环

### 9.2 IntoIterator、Iterator和Iter之间的关系

### 9.3 获取迭代器的三种方法iter()、iter_mut()和into_iter()

### 9.4 自定义类型实现iter()、iter_mut()和into_iter()

## 10、闭包

### 10.1 闭包基础概念

### 10.2 闭包获取参数by reference与by value

### 10.3 闭包是怎么工作的

### 10.4 闭包类型FnOnce、FnMut和Fn做函数参数的实例
