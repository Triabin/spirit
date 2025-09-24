# TypeScript学习笔记

```typescript
// 变量定义方式：声明符 变量名: 类型
// 类型推导：声明符 变量名 = 字面量

let a: number;
a = 1;
a = 'Str' //报错

const b = 'hello'; // 类型为string

let c: 'hello';
c = '123' // 报错，这样声明后的变量，其值被固定，一般不用
```

## 1、类型总览

### 1.1 JavaScript中的数据类型

* string
* number
* boolean
* null
* undefined
* bigint
* symbol
* object

> 说明：其中，object包含Array、Function、Date、Error等

### 1.2 TypeScript中的数据类型

#### 1.2.1 上述所有JavaScript类型

#### 1.2.2 六个新类型

* any
* unknown
* never
* void
* tuple
* enum

#### 1.2.3 两个用于自定义类型的方式

* type
* interface

> 注意：在JavaScript中这些内置构造函数：Number、String、Boolean，它们用于创建对应的包装对象，在日常开发时**很少使用**，在TypeScript中也同理，所以在TypeScript中进行类型声明时，通常都是用小写的number、string、boolean。（包装对象支持自动装箱）

## 2、常用类型与语法

### 2.1 any

意味着放弃了对该变量的类型检查，any类型的变量可以赋值给任意类型的变量（切忌谨慎使用）。

### 2.2 unknown

unknown可以理解成类型安全的any，适用于不确定数据类型的情况，unknown不能直接赋值给别的类型，需要ts确保类型不出错以后才能赋值。

```typescript
let a: unknown

// 可以对a任意赋值
a = 100;
a = false;
a = 'hello';

let x: string

// x = a; // 报错：不能将unknown类型变量赋值给string

// ① 类型判断
if (typeof a === 'string') {
  x = a;
}

// ② 断言
x = a as string;
// 或
x = <string>a;
```

> 注意：any类型类似js中的变量，可以随意调用不存在的属性/方法，unknown类型不能调用。

### 2.3 never

never的含义是任何值都不是，简言之就是不能有值，undefined、null、`''`、0都不行，几乎不用它去直接限制变量，因为没有意义，never一般是TypeScript主动推断出来的。

### 2.4 void

void通常用于函数返回值声明，含义：函数不返回任何值，调用者也不应该依赖其返回值进行任何操作。函数中没有写return去指定函数的返回值时，函数会有一个隐式返回值，就是undefined，即函数返回类型为void，但是可以接受undefined的，总结：**undefined是void可以接受的一种“空”**。

```typescript
function demo1(): void {
  console.log('@1');
}
function demo2(): undefined {
  console.log('@2');
}

// let result = demo1();
// console.log(result); // undefined
// if (result) { // 报错：无法测试“void”类型表达式的真实性
//  ...
//}

let result = demo2();
console.log(result); // undefined
if (result) {
  console.log('无报错')
}
```

> 裂解void与undefined
>
> * void是一个广泛的概念，用来表达“空”，而undefined则是表达这种“空”的具体实现之一，因此说undefined是void能接受的“空”状态的一种具体形式，换言之，void包含undefined，但是void表达的语义超越了单纯的undefined，它是一种意图上的约定，而不仅仅是特定值的限制
>
> 总结：若函数返回类型为void，那么：
>
> 1. 从语法上讲，函数可以返回undefined，至于显式还是隐式返回，这无所谓；
> 2. 从语义上讲，函数调用者不应该关心函数的返回值，也不应该依赖返回值进行任何操作，即使返回了undefined值。

### 2.5 object

关于object与Object，实际开发中使用相对较少，因为范围实在太大了。

#### 2.5.1 object

能存储非原始类型，包括对象、数组、函数、类型的实例对象等

#### 2.5.2 Object

能存储可以调用到Object方法的类型（除了undefined、null都可以存，原始类型因为有自动装箱，所以也能存储，实际存储的是对应的包对象）

#### 2.5.3 声明对象类型

1、实际开发中，限制一般队形，通常使用以下形式

```ts
//限制person1对象必须有name属性，age为可选属性
let person1: { name: string, age?: number }

// 含义同上，也能用分号做分隔
let person2: { name: string; age?: number }

// 含义同上，也能用换行做分隔
let person3: {
  name: string
  age?: number
}
```

2、索引签名：允许定义对象可以具有任意数量的属性，这些属性的键和类型是可变的，常用于描述类型不确定的属性（具有动态属性的对象）。

```typescript
let person: {
  name: string,
  age?: number,
  [key: string]: any // 除了已声明的两个以外，还可以追加任意key为string类型，值为任意类型的键（属性），PS：“key”可以任意命名，用“qwe”也行，但是一般用“key”
}
```

#### 2.5.4 声明函数类型

```typescript
let count: (_a: number, _b: number) => number = function (a, b) {
  return a + b;
}
// 后面函数参数列表和返回值类型的限定声明省略；
// 注意区分前面类型声明中的=>与箭头函数区别。
```

函数的类型声明还可以用接口、自定义类型等方式

#### 2.5.5 声明数组类型

```typescript
let arr1: string[];
let arr2: Array<string>; // 泛型
```

### 2.6 tuple

元组（Tuple）是一种特殊的数组类型，可以存储固定的元素，并且每个元素的类型是已知的且可以不同。元组用于精确描述一组值的类型，`?`标识可选元素。

```typescript
// 第一个元素必须是string类型，第二个元素必须是number类型
let arr1: [string, number]
// 第一个元素必须是number类型，第二个元素是可选的，如果存在，必须是boolean类型
let arr2: [number, boolean?]
// 第一个元素必须是number类型，后面的元素可以是任意数量的string类型
let arr3: [number, ...string[]] // 恶心写法
```

### 2.7 enum

枚举（enum）可以定义一组命名常量，它能增强代码可读性，也让代码更好维护。

#### 2.7.1 数字枚举

数字枚举是一种常见的枚举类型，其成员的值会自动递增，且数字枚举还具备反向映射的特点。

```typescript
// 定义一个标识方向的枚举
enum Direction {
  Up, // 0
  Right, // 1
  Down = 3, // 3
  Left // 4
}
console.log(Direction.Up) // 0
console.log(Direction[3]) // Down
```

#### 2.7.2 字符串枚举

枚举成员边来个是字符串，相对数字枚举，丢失了反向映射

```typescript
enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}
```

#### 2.7.3 常量枚举

官方描述：敞亮枚举是一种特殊枚举类型，它使用const关键字定义，在编译时会被内联，避免生成一些额外的代码。

编译时内联：内联即TypeScript在编译时，会将枚举成员引用替换为它们的实际值，而不是生成额外的枚举对象。这可以减少生成的JavaScript代码量，并提高运行时性能。

使用普通枚举的TypeScript代码如下：

```typescript
enum Direction {
  Up,
  Right,
  Down,
  Left
}
let x = Direction.Up;
```

编译后生成的js代码：

```javascript
"use strict";
var Directions;
(function (Directions) {
  Directions[Directions["Up"] = 0] = "Up";
  Directions[Directions["Right"] = 1] = "Right";
  Directions[Directions["Down"] = 2] = "Down";
  Directions[Directions["Left"] = 3] = "Left";
})(Directions || (Directions = {}));

let x = Directions.Up;
```

使用常量枚举的TypeScript代码如下：

```typescript
const enum Direction {
  Up,
  Right,
  Down,
  Left
}
let x = Direction.Up;
```

编译后生成的JavaScript代码量较小：

```javascript
"use strict";
let x = 0 /* Directions.Up */ ;
```

### 2.8 type

type能为任意类型创建别名，让代码更简洁、可读性更强，同时能更方便地进行类型复用和扩展。

1、基本用法

类型别名用type关键字定义，type后跟类型名称：

```typescript
type num = number;
let price: num
price = 100;
```

2、联合类型

联合类型是一种高级类型，它标识一个值可以是几种不同类型之一，用管道符`|`隔开

```typescript
type Status = number | string
type Gender = '男' | '女'
```

3、交叉类型

交叉类型（Intersection Types）允许多个类型合并为一个类型。合并后的类型将拥有所有被合并类型的成员。交叉类型通常用于对象类型。

```typescript
// 宽
type Area = {
  height: number; // 高
  width: number; // 宽
}

// 地址
type Address = {
  num: number; // 楼号
  cell: number; // 单元号
  room: string; // 房间号
}

type House = Area & Address;

const house: House = {
  height: 180,
  width: 75,
  num: 6,
  cell: 3,
  room: '702'
}
```

### 2.9 特殊情况

```typescript
// 代码段1（正常）：在函数定义时，限制函数的返回值为void，那么函数的返回值就必须是空
function demo(): void {
  // 返回undefined合法
  return undefined;

  // 以下返回均不合法
  // return [];
  // return false;
  // return null;
  // return 100;
}
demo();

// 代码段2（特殊）：使用类型声明限制函数返回值为void时，TypeScript并不会严格要求函数返回空
type LogFunc = () => void

const f1: LogFunc = () => {
  return 100; // 允许返回非空值
}

const f2: LogFunc = () => 200; // 允许返回非空值

const f3: LogFunc = function () {
  return 300; // 允许返回非空值
}

```

官网解释原因：

为了确保如下代码成立，`Array.prototype.push`的返回是一个数字，而`Array.prototype.forEach`方法期望其回调的返回类型是void

```typescript
const src = [1, 2, 3];
const dst = [0];

src.forEach((el) => dst.push(el));
```

总结：为了兼容js或者说lambda表达式做出的妥协。

### 2.10 类型相关知识

|  修饰符   |   含义   |                具体规则                |
| :-------: | :------: | :------------------------------------: |
|  public   |  公开的  |        内部类、子类、类外部访问        |
| protected | 受保护的 |            类内部、子类访问            |
|  private  |  私有的  |               类内部访问               |
| readonly  |   只读   | 属性无法修改，可以和其他修饰符配合使用 |

① 大部分与Java一样，子类重写父类的函数时，在函数名称前加`override`关键字，类成员变量默认修饰符为`public`，成员修饰符多一个`readonly`（含义见名知意）。

② 构造函数差异：

```typescript
class Person {
  public name: string
  public age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
}

// 可以简写成：
class Person {
  constructor(public name: string, public age: number) {}
}
```

③ 抽象类构造函数和Java相比需要包含`{}`

### 2.11 interface（接口）

Interface是一种定义结构的方式，主要作用是为类、对象、函数等规定一种七月，这样可以确保代码的一致性和类型安全，但要注意interface只能定义格式，不能包含任何实现。

接口命名规范：`I+要限制的类名` 或 `要限制的类名+Interface`

```typescript
// PersonInterface接口
interface PersonInterface {
  name: string
  age: number
  speak(n: number): void
}

class Person implements PersonInterface {
  age: number;
  name: string;

  speak(n: number): void {
    for (let i = 0; i < n; i++) {
      console.log(`我叫${this.name}，今年${this.age}岁`)
    }
  }
}

// 作为类型使用
interface UserInterface {
  name: string
  readonly gender: string
  age?: number
  run: (n: number) => void
}
const user: UserInterface = {
  name: '张三',
  gender: '男',
  age: 18,
  run(n) {
    console.log(`奔跑了${n}米`)
  }
}

// 定义函数
interface CountInterface {
  (a: number, b: number): number;
}
const count: CountInterface = (x, y) => x + y;

// 接口之间也能正常继承
interface StudentInterface extends PersonInterface {
  grade: string // 年级
}

const stu: StudentInterface = {
  name: '张三',
  age: 18,
  grade: '高二',
  
  speak(n: number): void {
    for (let i = 0; i < n; i++) {
      console.log(`我叫${this.name}，今年${this.age}岁，长在上${this.grade}`)
    }
  }
}

// 接口的自动合并（可重复定义）
interface DemoInterface {
  name: string
  age: number
}
interface DemoInterface {
  gender: string
}
const demo: DemoInterface = {
  name: '张三',
  age: 18,
  gender: '男'
}
```

> 接口应用场景总结：
>
> 1. 定义对象的格式：描述数据模型、API响应格式、配置对象……是开发中使用最多的场景；
> 2. 类的契约：规定一个类需要实现哪些属性和方法；
> 3. 自动合并：用于扩展第三方库的类型，这种特性在大型项目中可能会用到。

**interface与type区别** ：

* 相同点：interface和type都用于定义对象结构，两者在许多场景中是可以互换的；

* 不同点

  ① interface：更专注于定义对象和类的结构，支持继承、合并

  ② type：可以定义类型别名、联合类型、交叉类型，但不支持继承和自动合并

### 2.12 泛型

使用与Java基本相同

## 3、类型声明文件

类型声明文件是TypeScript中的一种特殊文件，通常以`.d.ts`作为扩展名。它的主要作用是为现有的JavaScript代码提供类型信息，使得TypeScript能够在使用这些JavaScript库或模块的时候进行类型检查和提示。

```javascript
// demo.js
export function add(a, b) {
  return a + b;
}

export function mul(a, b) {
  return a * b;
}
```

```typescript
// demo.d.ts
declare function add(a: number, b: number): number;
declare function mul(a: number, b: number): number;
export { add, mul };
```



## 4、装饰器

* 装饰器（Decorators）本质是一种特殊的函数，它可以对类、属性、方法、参数进行扩展，同时让代码更简洁；
* 截止目前（TypeScript 5.8），装饰器依然是实验性特性，需要开发者手动调整配置，来开启装饰器支持。
* 装饰器有5种
  * 类装饰器
  * 属性装饰器
  * 方法装饰器
  * 访问装饰器
  * 参数装饰器

> 说明：虽然TypeScript5.0中可以直接使用类装饰器，但是为了确保其他装饰器可用，现阶段使用时，仍建议使用`experimentalDecorators`配置来开启装饰器支持，而且不排除在未来的版本中，官方会进一步调整装饰器相关语法。

### 4.1 类装饰器

基本语法：

```typescript
// 定义装饰器
/**
 * Demo函数会在Person类定义的时候去执行
 * @param target {Function} 是被装饰的类，即Person
 * @constructor
 */
function Demo(target: Function) {
  console.log(target)
}

@Demo
class Person {
  constructor(public name: string, public age: number) {}
}
```



应用举例：定义一个装饰器，实现Person实例调用toString时返回JSON.stringify的执行结果。

```typescript
// 使用装饰器重写toString方法 + 封闭其原型对象
function CustomString(target: Function) {
	// 向被装饰类的原型上添加自定义的 toString 方法
	target.prototype.toString = function () {
	return JSON.stringify(this)
	}
	// 封闭其原型对象，禁止随意操作其原型对象
	Object.seal(target.prototype)
}

// 使用 CustomString 装饰器
@CustomString
class Person {
	constructor(public name: string, public age: number) { }
	speak() {
	  console.log('你好呀！')
	}
}

/* 测试代码如下 */
let p1 = new Person('张三', 18)
// 输出：{"name":"张三","age":18}
console.log(p1.toString())
// 禁止随意操作其原型对象
interface Person {
	a: any
}
// Person.prototype.a = 100 // 此行会报错：Cannot add property a, object is not extensible
// console.log(p1.a)
```

关于返回值：

* 类装饰器有返回值：若类装饰器返回一个新的类，那这个新的类将替换掉被装饰的类；
* 类装饰器无返回值：若类装饰器无返回值或返回undefined，那被装饰的类不会被替换。

关于构造类型：

在TypeScript中，Function类型所表示的范围十分广泛，包括普通函数、箭头函数、方法等等。但并非Function类型的函数都可以被new关键字实例化，例如箭头函数是不能被实例化的，那么TypeScript中该如何声明一个构造类型呢？有以下两种方式：

① 仅声明构造类型

```typescript
/*
  ○ new     表示：该类型是可以用new操作符调用。
  ○ ...args 表示：构造器可以接受【任意数量】的参数。
  ○ any[]   表示：构造器可以接受【任意类型】的参数。
  ○ {}      表示：返回类型是对象(非null、非undefined的对象)。
*/

// 定义Constructor类型，其含义是构造类型
type Constructor = new (...args: any[]) => {};

function test(fn:Constructor){}
class Person {}
test(Person)
```

② 声明构造类型+指定静态属性

```typescript
// 定义一个构造类型，且包含一个静态属性 wife
type Constructor = {
	new(...args: any[]): {}; // 构造签名
	wife: string; // wife属性
};

function test(fn:Constructor){}
class Person {
	static wife = 'asd'
}
test(Person)
```



替换被装饰的类：

对于高级一些的装饰器，不仅仅是覆盖一个原型上的方法，还要有更多的功能，例如添加新的方法和状态。

> 需求：设计一个`LogTime`装饰器，可以给实例添加一个属性，用于记录实例对象的创建时间，再添加一个方法用于读取创建时间。

```typescript
// User接口
interface User {
  getTime(): Date;
  log(): void;
}

// 自定义构造函数类型
type Constructor = new (...args: any[]) => {};

// 创建一个装饰器，为类添加日志功能和创建时间
function LogTime<T extends  Constructor>(fn: T) {
  return class extends fn {
    createdTime: Date;
    constructor(...args: any[]) {
      super(...args);
      this.createdTime = new Date(); // 记录对象创建时间
    }
    getTime() {
      return `该对象创建时间为：${this.createdTime.toLocaleTimeString()}`;
    }
  };
}

@LogTime
class User {
  constructor(public name: string, public age: number) {}
  speak() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }
}

const user = new User('张三', 18);
user.speak();
console.log(user.getTime());
```

### 4.2 装饰器工厂

装饰器工厂是一个返回装饰器函数的函数，可以为装饰器添加参数，可以更灵活地公职装饰器的行为。

> 需求：定义一个LogInfo类装饰器工厂，实现Person实例可以调用到introduce方法，且introduce中输出内容的次数，由LogInfo接收的参数决定。

```typescript
// 需求：定义一个LogInfo类装饰器工厂，实现Person实例可以调用到introduce方法，且introduce中输出内容的次数，由LogInfo接收的参数决定。
function LogInfoDecoratorsFactory(n: number) {
  // 此时再去返回装饰器
  return function (target: Function) {
    target.prototype.introduce = function () {
      for (let i = 0; i < n; i++) {
        console.log(`我叫${this.name}，今年刚满${this.age}岁~`);
      }
    }
  }
}

@LogInfoDecoratorsFactory(3)
class Person {
  constructor(public name: string, public age: number) {}
  speak() {
    console.log('大家好！');
  }
}

const p1 = new Person('张三', 18);
p1.introduce();
```

解析：`@Decorators`等价于`Decorators(Clazz)`，利用这个特性，包装一层，即可实现装饰器工厂。

### 4.3 装饰器组合

装饰器可以组合使用，执行顺序为先“由上到下”的执行所有的装饰器工厂，一次获取到装饰器，然后再“由下到上”执行所有的装饰器。

### 4.2 属性装饰器

基本语法：

```typescript
/**
 * 属性装饰器demo
 * @param target {object} 对于静态属性来说值是类，对于实例属性来说值是类的原型对象
 * @param propertyKey {string} 属性名
 */
function FieldDecorator(target: object, propertyKey: string) {
  console.log(target, propertyKey);
}

class Person {
  @FieldDecorator name: string;
  @FieldDecorator age: number;
  @FieldDecorator static school: string;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const person = new Person('张三', 18);
```

关于属性遮蔽：

```typescript
class Person {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
let value = 120;
Object.defineProperty(Person.prototype, 'age', {
  get() {
    return value;
  },
  set(val) {
    value = val;
  }
});
const person = new Person('张三', 18);
console.log(person); // person实例上没有age属性，原形上有age属性并且值为18
/*
  解析：在person创建之前，使用Object给Person类的原型定义了一个age属性，并且其初始值为120
  后续调用Person类的构造函数创建person对象时，设置age属性过程中，首先去person实例上查找age属性，未找到属性，
  转而到原型上查找，找到后将其值改为18，如此便形成了属性遮蔽
*/
```

应用举例：定义一个State属性装饰器，用来监视属性的修改。

```typescript
/**
 * 定义一个装饰器函数，用于捕获属性的修改
 * @param target {object} 要装饰的对象
 * @param propertyKey {string} 要装饰的属性名
 */
function State(target: object, propertyKey: string) {
  // 存储属性内部值
  let key = `__${propertyKey}`;
  // 使用Object.defineProperty替换类的原始属性
  // 重新定义属性，使其使用自定义的getter和setter
  Object.defineProperty(target, propertyKey, {
    get() {
      return this[key];
    },
    set(newValue) {
      console.log(`属性 ${propertyKey} 被修改为 ${newValue}`);
      this[key] = newValue;
    },
    enumerable: true,
    configurable: true,
    writable: true
  });
}

class Person {
  name: string;
  @State age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const person = new Person('张三', 20);
person.age = 18;
```

### 4.3 方法装饰器

基本语法：

```typescript
/**
 * 方法装饰器Demo
 * @param target {object} 实例对象为被装饰的方法所在实例的原型，静态方法为类本身
 * @param propertyKey {string} 被装饰的方法名
 * @param descriptor {PropertyDescriptor} 对方法的描述，其中，value值是被装饰的方法
 */
function MethodDecorator(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log(target);
  console.log(propertyKey);
  console.log(descriptor);
}

class Person {
  constructor(public name: string, public age: number) {}

  // 装饰实例方法
  @MethodDecorator sepak() {
    console.log(`你好，我是${this.name}，今年刚满${this.age}岁~`);
  }

  // 装饰静态方法
  @MethodDecorator static isAdult(age: number) {
    return age >= 18;
  }
}

const p = new Person('sepak', 25);
Person.isAdult(p.age);
p.sepak();
```

应用举例：

> 1. 定义一个Logger方法装饰器，用于在方法执行前后，均追加一些额外逻辑；
> 2. 定义一个Validate方法装饰器，用于验证数据。

```typescript
function Logger(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
  // 保存原始方法
  const original = descriptor.value;
  // 替换原始方法
  descriptor.value = function (...args: any[]) {
    console.log(`${propertyKey}开始执行……`);
    const result = original.call(this, ...args);
    console.log(`${propertyKey}执行结束……`);
    return result;
  }
}

function Validate(maxValue: number) {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
    // 保存原始方法
    const original = descriptor.value;
    // 替换原始方法
    descriptor.value = function (...args: any[]) {
      // 自定义验证逻辑
      if (args[0] > maxValue) {
        throw new Error(`参数${propertyKey}的值不能大于${maxValue}`);
      }
      // 如果所有参数都符合要求，则调用原始方法
      return original.call(this, ...args);
    }
  }
}

class Person {
  constructor(public name: string, public age: number) {}
  @Logger speak() {
    console.log(`${this.name}说：人家今年刚满${this.age}岁~~`);
  }
  @Validate(150) static isAdult(age: number) {
    return age >= 18;
  }
}

const person = new Person('张三', 20);
person.speak();
Person.isAdult(1000);
```

### 4.4 访问器装饰器

基本语法：

```typescript
/**
 * 访问器装饰器Demo
 * @param target {object} 对于实例访问器来说是所属类的原型对象，对于静态访问器来说是所属类
 * @param propertyKey {string} 访问器的名称
 * @param descriptor {PropertyDescriptor} 描述对象
 */
function AccessorDecorator(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log(object);
  console.log(propertyKey);
  console.log(descriptor);
}

class Person {
  @AccessorDecorator
  get address() {
    return '北京洪福科技园'
  }

  @AccessorDecorator
  static get country() {
    return '中国'
  }
}
```

应用举例：对Weather类的temp属性的set访问器进行限制，设置的最低温度-273，最高温度120

```typescript
function RangeValidate(min: number, max: numbe) {
  return function(target: object, propertyKey: string, descriptor: PropertyDescriptor) {
    // 保存原始的setter方法，以便后续调用
    const originalSetter = descriptor.set;
    // 重写setter方法，在设置值之前进行校验
    descriptor.set = function(value: number) {
      if (value < min || value > max) {
        throw new Error(`${propertyKey}应该在${min}和${max}之间！`);
      }
      // 如果校验通过，且原始setter方法存在，则调用原始setter方法
      if (originalSetter) {
        originalSetter.call(this, value);
      }
  }
}
}

class Weather {
  private _temp: number;
  constructor(temp: number) {
    this._temp = temp;
  }

  @RangeValidate(-273, 120)
  set temp(value) {
    this._temp = value;
  }
  get temp() {
    return this._temp;
  }
}

const w1 = new Weather(25);
console.log(w1);
w1.temp = 1000;
console.log(w1);
```

### 4.5 参数装饰器

基本语法：

```typescript
/* 
  参数说明：
    ○ target:
      1.如果修饰的是【实例方法】的参数，target 是类的【原型对象】。
      2.如果修饰的是【静态方法】的参数，target 是【类】。
    ○ propertyKey：参数所在的方法的名称。
    ○ parameterIndex: 参数在函数参数列表中的索引，从 0 开始。
*/
function Demo(target: object, propertyKey: string, parameterIndex: number) {
	console.log(target)
	console.log(propertyKey)
	console.log(parameterIndex)
}

// 类定义
class Person {
	constructor(public name: string) { }
	speak(@Demo message1: any, mesage2: any) {
	console.log(`${this.name}想对说：${message1}，${mesage2}`);
	}
}
```

应用举例：定义方法装饰器`Validate`，同时搭配参数装饰器`NotNumber`，来对`speak`方法的参数类型进行限制。

```typescript
function NotNumber(target: any, propertyKey: string, parameterIndex: number) {
	// 初始化或获取当前方法的参数索引列表
	let notNumberArr: number[] = target[`__notNumber_${propertyKey}`] || [];
	// 将当前参数索引添加到列表中
	notNumberArr.push(parameterIndex);
	
	// 将列表存储回目标对象
	target[`__notNumber_${propertyKey}`] = notNumberArr;
}

// 方法装饰器定义
function Validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
	const method = descriptor.value;
	descriptor.value = function (...args: any[]) {
	// 获取被标记为不能为空的参数索引列表
	const notNumberArr: number[] = target[`__notNumber_${propertyKey}`] || [];
	// 检查参数是否为 null 或 undefined
	for (const index of notNumberArr) {
	  if (typeof args[index] === 'number') {
		throw new Error(`方法 ${propertyKey} 中索引为 ${index} 的参数不能是数字！`)
	  }
	}
	// 调用原始方法
	return method.apply(this, args);
	};
	
	return descriptor;
}

// 类定义
class Student {
	name: string;
	constructor(name: string) {
	this.name = name;
	}
	
	@Validate
	speak(@NotNumber message1: any, mesage2: any) {
		console.log(`${this.name}想对说：${message1}，${mesage2}`);
	}
}

// 使用
const s1 = new Student("张三");
s1.speak(100, 200);
```

