---
title: 渡一前端Tips
createTime: 2025/06/04 03:35:46
tags:
  - 前端
  - 渡一
  - css
  - JavaScript
  - html
---

# 渡一前端Tips

来源：见到的所有值得收藏的渡一前端Tips

## 1、封装全屏功能

来源：[https://www.bilibili.com/video/BV1PyJqz2EXD](https://www.bilibili.com/video/BV1PyJqz2EXD)

全屏的API有很多，因此需要考虑兼容性，以下为我根据渡一的原内容扩展的ts版本：

```typescript
// 扩展全局接口解决类型报错
declare global {
  interface HTMLElement {
    mozRequestFullScreen?: (options?: FullscreenOptions) => Promise<void>;
    webkitRequestFullscreen?: (options?: FullscreenOptions) => Promise<void>;
    msRequestFullscreen?: (options?: FullscreenOptions) => Promise<void>;
  }

  interface Document {
    mozCancelFullScreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    mozFullScreenElement?: Element | null;
    webkitFullscreenElement?: Element | null;
    msFullscreenElement?: Element | null;
  }
}

// 安全获取属性名（带类型保护）
function getPropertyName<T extends object>(
  names: (keyof T)[],
  target: T
): keyof T | undefined {
  return names.find(name => name in target);
}

// 单次初始化API名称（解决重复查找问题）
const ENTER_METHOD = getPropertyName([
    'requestFullscreen',
    'mozRequestFullScreen',
    'webkitRequestFullscreen',
    'msRequestFullscreen'
  ] as const, document.documentElement
);

const EXIT_METHOD = getPropertyName([
    'exitFullscreen',
    'mozCancelFullScreen',
    'webkitExitFullscreen',
    'msExitFullscreen'
  ] as const, document
);

const FULLSCREEN_ELEMENT_PROP = getPropertyName([
    'fullscreenElement',
    'mozFullScreenElement',
    'webkitFullscreenElement',
    'msFullscreenElement'
  ] as const, document
);

// 进入全屏
async function enter(ele: HTMLElement): Promise<void> {
  if (!ENTER_METHOD) throw new Error('Fullscreen API not supported');
  const method = ele[ENTER_METHOD] as (() => Promise<void>) | undefined;
  method?.call(ele);
}

// 退出全屏
async function exit(): Promise<void> {
  if (!EXIT_METHOD) throw new Error('ExitFullscreen API not supported');
  const method = document[EXIT_METHOD] as (() => Promise<void>) | undefined;
  method?.call(document);
}

// 获取全屏元素
function getFullscreenElement(): Element | null {
  return FULLSCREEN_ELEMENT_PROP
    ? (document as any)[FULLSCREEN_ELEMENT_PROP]
    : null;
}

// 检查全屏状态
function isFull(): boolean {
  return !!getFullscreenElement();
}

// 切换全屏状态
async function toggle(ele: HTMLElement = document.documentElement): Promise<void> {
  isFull() ? await exit() : await enter(ele);
}

// 导出API
export default {
  enter,
  exit,
  toggle,
  isFull
};
```

::: info 使用工具

如果需要快速实现，其实可以考虑使用成熟的工具，例如[screenfull.js](https://github.com/sindresorhus/screenfull)，可直接解决各种兼容性问题。

```typescript
import screenfull from 'screenfull';

// 进入全屏
function enter(ele: HTMLElement) {
  if (screenfull.isEnabled) screenfull.request(ele);
}

// 退出全屏
function exit() {
  if (screenfull.isFullscreen) screenfull.exit();
}
```

:::

## 2、语义化版本

来源：[https://www.bilibili.com/video/BV1anM7z3Em6/](https://www.bilibili.com/video/BV1anM7z3Em6/)

软件管理领域的一个概念，用一个字符串来表达一个软件的版本（号），例如：1.0.3、2.1.0、3.2.1beta、4.5.6-rc60等。

语义化版本基本格式：`x.y.z[-预发布版本号]`

* 规则：

  ① 版本号只能增加，不能减少，即使代码回退到原来版本，版本号也不能回退；

  ② 高位版本号增加以后，低位版本号需要置0。

* `x`：主版本号，发生截断式更新（breaking updates）时，变更主版本号；

  > 截断式更新：更新后旧版本无法兼容，需要用户重新安装。

* `y`：次版本号，兼容旧版本，主要为新增功能、新模块；

* `z`：修订号，修复bug、优化代码等；

* `预发布版本号`（可选）：`-`（`-`号可选）后面跟着的字母，表示该版本还未稳定，可能存在一些问题，例如：`1.0.3alpha`、`1.0.3-beta`、`1.0.3-rc`、`1.0.3-dev`等。

## 3、图片调色盘

来源：[https://www.bilibili.com/video/BV1BfEkzmEuT](https://www.bilibili.com/video/BV1BfEkzmEuT)

功能：根据图片，获取主要配色，例如primary、secondary、accent等。

原理简述：将图片绘制到canvas上，然后统计计算出现次数较多的像素颜色。

细节问题：有时候，人肉眼看上去的颜色与计算机实际统计结果有较大差异，因为人眼分辨的像素差值没有计算机实际计算的像素点差值精确。这就造成了统计信息与感官信息差异，因此需要将一些相近的颜色聚合，这涉及到了**色彩聚合/近似算法**。

实现：
前端有一个现成的库叫做`colorthief`（颜色小偷），用以直接提取颜色。

```typescript
import ColorThief from 'colorthief';

const colorThief = new ColorThief();
// 传入图片img，指定要获取前count中颜色，最终返回每种颜色的RGB值数组
const colors: Array<Array<number>> = await colorThief.getPalette(img, count);
```

## 4、文字智能匹配背景

来源：[https://www.bilibili.com/video/BV18zoCYsETw/](https://www.bilibili.com/video/BV18zoCYsETw/)

文字颜色与背景颜色混淆导致文字显示不清晰时，可以给文字添加样式：

```css
:root {
  mix-blend-mode: difference;
}
```

本质是添加了一个混合，该操作会对受影响的元素每一个显示的像素点与背景颜色进行混合差值运算，从而得到一个新的颜色。上述案例中就是指定了使用差值算法（difference）进行混合运算，差值算法本质就是将自身RGB值分别与背景RGB值相减，从而得到新的RGB值。

```ts
<blend-mode> = 
  normal       |
  multiply     |
  screen       |
  overlay      |
  darken       |
  lighten      |
  color-dodge  |
  color-burn   |
  hard-light   |
  soft-light   |
  difference   |
  exclusion    |
  hue          |
  saturation   |
  color        |
  luminosity 
```

## 5、在vite中自动生成路由

来源：[https://www.bilibili.com/video/BV12NKRzFEu7/]

有如下路由配置：

```javascript
const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/index.vue'),
    meta: {
      title: '首页',
      menuOrder: 1
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/about/index.vue'),
    meta: {
      title: '关于',
      menuOrder: 10
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/contact/index.vue'),
    meta: {
      title: '联系',
      menuOrder: 20
    }
  }
]
```

路由配置本质上其实是跟目录结构在重复，这种重复的地方，很容易带来维护上的困难，尤其是当路由页面非常非常多的时候，一旦出现变更，维护上较为困难，且这种重复性的东西，能够自动生成是最好的，这样就避免了维护上的困难，例如一处变更，多出修改，单词拼写错误，增减页面只需增删对应页面文件即可等等。

这就是开发中的一种模式，叫做约定大于配置，例如react中的umijs，还有uniapp中也用目录结构代替了路由，但是vite官方和vue-cli中，都没有这些东西，因此只能自己手动实现。

从目录结构来看，目录结构中只缺失了路由对象中的meta字段信息，因此采用微信小程序的解决方案，在每个页面旁边创建一个page.js，在该文件中导出页面相关的一些额外的信息。

首先，要明确，目录结构只存在于编译时，编译打包后的运行时结果中并不存在当前的目录结构，因此要在编译时读取目录结构信息，`import.meta.glob`（vite）或`require.context`（webpack），

```javascript
// 函数需要传入一个参数，改参数为一个pattern，为一个路径匹配规则，读取结果为一个对象，该对象属性名对应匹配文件的路径，属性值对应一个函数，通过调用该函数可以导入该模块
const pages = import.meta.glob('../views/**/page.js', {
  eager: true, // 不需要函数，直接将函数结果（导出的模块）返回
  import: 'default' // 自动获取导出模块中的default导出结果
});

// 获取路由页面对应组件
const components = import.meta.glob('../views/**/index.vue');

// 将该对象转为路由配置
const routes = Object.entries(pages).map(([path, meta]) => {
  const compPath = path.replace('page.js', 'index.vue');
  path = path.replace('../views/', '').replace('/page.js', '') || '/';
  const name = path.split('/').filter(Boolean).join('-') || 'index';
  return {
    path,
    name,
    component: components[compPath], // 注意不能直接使用`import(compPath)`，因为此处获取到的是开发环境里面的路径，生产环境中该路径会丢失，需要在使用import.meta.glob函数获取生产环境的路径
    meta
  };
});
```

如此，这部分代码写完就可以不用再做修改，以后增减页面，只需增删对应页面文件及其配置即可，不用再修改路由配置。

自用改造（子路由生成、排序等）：

```typescript
import { createRouter, createWebHashHistory, type RouteMeta, type RouteRecordRaw } from 'vue-router';

/** 存放路由信息的模型 */
type _GenRouteModel = {
  path: string;
  name?: string;
  component?: () => Promise<unknown>;
  meta?: RouteMeta;
  children?: Map<string, _GenRouteModel>
}

// 存放构建路由所需信息，使用Map方便子路由构建
const modelMap: Map<string, _GenRouteModel> = new Map();
// 1. 获取页面meta信息
const pages: Record<string, RouteMeta> = import.meta.glob('../views/**/_page.ts', {
  eager: true,
  import: 'default'
});
// 2. 获取路由页面对应组件(不能使用pages中的key直接获取，打包后生产环境中的值不一样)
const components = import.meta.glob('../views/**/index.vue');
// 3. 通过文件信息和导出的路由信息，将生成的路由信息存入Map中
Object.entries(pages).forEach(([path, meta]) => {
  const compPath = path.replace('_page.ts', 'index.vue');
  // 获取路径并转为短横线命名
  path = path.replace('../views/', '').replace('/_page.ts', '')
    // 小写字母/数字与大写字母之间用-连接
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    // 所有大写字母之间用-连接
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    // 所有下划线替换为-
    .replace(/_/g, '-')
    // 转为小写
    .toLowerCase();
  const model = getModel(path);
  if (!model) return;
  model.component = components[compPath];
  model.meta = meta;
});

// 4. 将路由信息转为路由对象
const routes: RouteRecordRaw[] = mapToRoutes(modelMap) || [];
// 5. 根目录重定向
routes.push({
  path: '/',
  redirect: '/home'
});
// 6. 排序
sortRoute(routes);
// 7. 构建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
// 8. 导出路由
export default router;
export { routes };

/**
 * 利用Map通过路劲信息获取路由所需信息（不存在则创建）
 * @param paths {string} 文件路劲
 */
function getModel(paths: string): _GenRouteModel | undefined {
  let currModel: _GenRouteModel | undefined;
  paths && paths.split('/').forEach((path, index) => {
    if (index === 0 && !path.startsWith('/')) {
      path = `/${path}`;
    }
    if (index !== 0 && path.startsWith('/')) {
      path = path.slice(1);
    }
    let temp: _GenRouteModel | undefined;
    if (!currModel) {
      temp = modelMap.get(path);
      if (!temp) {
        temp = { path };
        modelMap.set(path, temp);
      }
    } else {
      if (!currModel.children) {
        currModel.children = new Map();
      }
      temp = currModel.children.get(path);
      if (!temp) {
        temp = { path };
        currModel.children.set(path, temp);
      }
    }
    currModel = temp;
  });

  return currModel;
}

/**
 * 将生成的路由数据转为路由
 * @param modelMap {Map<string, _GenRouteModel>} 生成的路由信息
 */
function mapToRoutes(modelMap: Map<string, _GenRouteModel> | undefined): RouteRecordRaw[] | undefined {
  if (!modelMap) return undefined;
  const routes: RouteRecordRaw[] = [];
  modelMap.forEach((model, key) => {
    // @ts-ignore
    const route: RouteRecordRaw = {
      path: key,
      name: model.name,
      component: model.component,
      meta: model.meta,
      children: mapToRoutes(model.children)
    };
    routes.push(route);
  });
  return routes;
}

/**
 * 根据所提供的参数排序
 * @param routes {RouteRecordRaw[]} 路由
 */
function sortRoute(routes: RouteRecordRaw[]) {
  routes.sort((r1, r2): number => {
    const wight1 = r1.meta?.menuOrder;
    const wight2 = r2.meta?.menuOrder;
    if (wight1 === undefined && wight2 === undefined) {
      return 0;
    } else if (wight1 === undefined) {
      return 1;
    } else if (wight2 === undefined) {
      return -1;
    }
    return (wight1 as number) - (wight2 as number);
  });

  routes.forEach(route => {
    if (route.children) {
      sortRoute(route.children);
    }
  });
}
```

## 6、判断稀疏数组

* 概念：即数组中又空槽位，例`const arr = [1,,,2, 3, 4,,,];`，该数组在控制台打印结果为`[ 1, <2 empty items>, 2, 3, 4, <3 empty items> ]`，**<font color='red'>空槽位上的索引读取结果为undefined，但是如果数组索引对应值为undefined，则读取结果也是undefined，但是二者不一样</font>**，即如果对应位置的值为undefined，则数组不是稀疏数组。

> 注意：
>
> 1. 空槽位索引值读取结果为undefined，但是索引上值为undefined时，不是空槽位；
> 2. 不能通过长度判断，`arr.length`不一定就不等于`Object.keys(arr).length`，因为可以给数组对象arr添加任意属性，从而影响``Object.keys()`函数的结果。

* 解决方案：

  ```javascript
  const isSparseArray = (arr) => {
      if (!Array.isArray(arr)) {
          throw new Error('arr must be an Array!');
      }
      for (let i = 0; i < arr.length; i++) {
          if (!arr.hasOwnProperty(i)) { // 不能使用 arr[i] === undefined 进行判断，使用hasOwnProperty函数判断下标是否存在
              return true;
          }
      }
      return false;
  };
  ```

## 7、使用JavaScript实现LRU缓存算法

* 概念：LRU，即Least Recently Used，即最久未使用。LRU缓存算法即为淘汰策略为优先淘汰缓存中最久未使用的数据。

```javascript
class LRUCache {
  #cache;
  constructor(capacity) {
    this.capacity = capacity;
    this.#cache = new Map();
  }
  has(kay){
    return this.#cache.has(kay);
  }
  get(kay){
    if (!this.#cache.has(kay)) {
      return;
    }
    const value = this.#cache.get(kay);
    this.#cache.delete(kay);
    this.#cache.set(kay, value);
    return value;
  }
  put(kay, value){
    if (!this.#cache.has(kay)) {
      this.#cache.delete(kay);
    } else if (this.#cache.size() >= this.capacity) {
      this.#cache.delete(this.#cache.keys().next().value);
    }
    this.#cache.set(kay, value);
  }
}
```

## 8、优化动态规划空间复杂度

**举例1：** 求斐波那契数列指定位置值

| 1    | 1    | 2    | 3    | 5    | 8    |
| ---- | ---- | ---- | ---- | ---- | ---- |

* 常用解法

  ```javascript
  /**
   * 求菲波那切数列第n位
   */
  function fibonacci(n) {
    if (n == 1 || n == 2) {
        return 1;
    }
    const arr = [1, 1];
    for (let i = 2; i < n; i++) {
      arr[i] = arr[i - 1] + arr[i - 2];
    }
    return arr[n - 1];
  }
  ```

* 使用移位指针优化空间复杂度

  ```javascript
  /**
   * 求菲波那切数列第n位
   */
  function fibonacci(n) {
    if (n == 1 || n == 2) {
        return 1;
    }
    let p1 = 1, p2 = 1;
    for (let i = 2; i < n; i++) {
      let temp = p1 + p2;
      p1 = p2;
      p2 = temp;
    }
    return p2;
  }
  ```

  一直需要的都只是两位数而已，因为只要知道前两位就可以求取下一位，因此只需要不断推导累加即可，不需要构建一个长度为n的数组。

**举例2：** 机器人只能向左或是向下移动，求下列机器人到终点的所有路线。

| 机器人 |      |      |      |      |      |      |
| :----: | ---- | ---- | ---- | ---- | ---- | :--: |
|        |      |      |      |      |      |      |
|        |      |      |      |      |      | 终点 |

常规方法为创建一个`m*n`的二维数组，数组每一个元素为机器人走到该点的路径数量，所以空间复杂度为`O(m*n)`。

|  1   |  1   |  1   |  1   |  1   |  1   |  1   |
| :--: | :--: | :--: | :--: | :--: | :--: | :--: |
|  1   |  2   |  3   |  4   |  5   |  6   |  7   |
|  1   |  3   |  6   |  10  |  15  |  21  |  28  |

观察数组发现，整个迭代过程中，除了第一行第一列恒为1，其余的只需要相邻的前两个元素即可，因此可以将二维数组转为一维数组，下一行的值等于上一个元素+自身的值。

```javascript
function uniquePaths(m, n) {
    if (m == 1 || n == 1) {
        return 1;
    }
    let minLen = Math.min(m, n);
    let maxLen = Math.max(m, n);
    let dp = new Array(minLen).fill(1);
    for (let i = 1; i < maxLen; i++) {
        for (let j = 1; j < minLen; j++) {
            dp[j] += dp[j - 1];
        }
    }
    return dp[minLen - 1];
}
```

## 9、可重试的请求

```js
/**
 * 函数描述：发出请求，如果失败则最多重试指定次数，返回Promise
 * @param {string} url 请求地址
 * @param {number} maxCount 最大重试次数
 */
function request(url, maxCount = 5) {
  return fetch(url).catch(error => maxCount <= 0 ? Promise.reject(error) : request(url, maxCount - 1));
}
```

## 10、惰性函数

案例：复制文本函数

函数中第一步，判断是否支持navigator的API，实际上只需要运行一次，所以可以使用惰性函数的思想来优化函数。

```javascript
function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}
```

使用惰性函数优化后：

```javascript
function copyText(text) {
  if (navigator.clipboard) {
    copyText = (text) => navigator.clipboard.writeText(text);
  } else {
    copyText = (text) => {
      const input = document.createElement('input');
      input.setAttribute('value', text);
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    };
  }
  copyText(text);
}
```
用处：用于优化一些运行比较消耗资源的条件判断，例如查询需要有变更必定会刷新页面的后端之类的。

## 11、initial、unset、revert

这是css的通用属性值，适用于所有的css属性。

* `initial`：属性的默认值，大大减少了记忆负担，因为无法保证记住每一个属性的默认值。
* `unset`：声明该属性没有设值（能继承就继承，不能继承就使用默认属性值）。
* `revert`：可以让属性值回归到浏览器的默认样式（注意与不设值区分，浏览器的默认样式不是不设值）。

## 12、ES、Runtime、JS和WebAPI

* ES：EcmaScript，本质上是一篇[文档](https://tc39.es/ecma262/)，其中详细规定了一些语言的规范，即ES规范，主要包含三大块，语法、概念、标准库（Array、Math、Number、Promise等）；
* Runtime：代码的运行环境，例如浏览器将ES中规定的每一个规范都一一实现，则说明浏览器内核支持ES语言，前端支持ES语言的Runtime一般包括浏览器、node、小程序；
* WebAPI：上述的浏览器、node、小程序等环境之间虽然都是基于ES实现，但是相互之间还是有一些差异的，每个环境有一些自己独有的东西，例如浏览器中有DOM、bom、settimeout、console，node中有process（进程对象），node中的settimeout和console是node为了保持与浏览器开发的基本一致弄出来的一些相同API（settimeout在浏览器中返回的是数字，node中返回的是对象），这些环境中唯一必须相同的部分只有ES，其他的或多或少都有一些差异，这些每个环境独有的部分（或者说差异）就叫做环境API，**而在浏览器中独有的这部分差异就叫做[WebAPI](https://developer.mozilla.org/zh-CN/docs/Web/API)**；
* JS，广义的JS就是ES，因为JS就是ES演变而来，一般来说的JS是指`ES + WebAPI`（Nodejs指`ES + NodeAPI`）。

## 13、正则前瞻运算符

将数字字符串`const str = '1000000000'`转换为`1,000,000,000`这样的格式。

```javascript
const str = '1000000000';
// 1,000,000,000
// 可以使用正则匹配前瞻运算符，前瞻运算符可以只匹配位置，然后向前验证前面的内容是否符合正则，前瞻运算符用 ?=[正则] 这样的格式
const s = str.replace(/\B(?=(\d{3})+$)/g, ','); // 加 \B 是为了排除边界那种情况，避免在整个字符串前面添加逗号
console.log(s);
```