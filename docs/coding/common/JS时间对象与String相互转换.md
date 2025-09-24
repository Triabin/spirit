---
title: JS时间对象与String相互转换
author: Triabin
createTime: 2024/07/26 21:16:45
tags:
  - 前端
  - JavaScript
  - 格式化
  - Date
---
# JS时间对象与String相互转换

## 1、Date => String

### 1.1 代码

```javascript
/**
 * 函数描述：时间格式化工具
 * @param format {String} 格式（y-年，M-月，d-日，H-时[24]，h-时[12]，m-分，s-秒，S-毫秒(3位数)，q-季度，ap，午前am/午后pm）
 * @returns {String}
 */
Date.prototype.format = function (format) {
    var o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'H+': this.getHours(), // 时（24小时制）
        'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 时（12小时制）
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        'S': this.getMilliseconds(), // 毫秒
        'ap': this.getHours() > 12 ? 'am' : 'pm'
    };
    var week = ['日', '一', '二', '三', '四', '五', '六'];
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(format)) {
        format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[this.getDay()]);
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return format;
};
```

### 1.2 使用

```javascript
let date = new Date();
let format1 = 'yyyy年MM月dd日 HH:mm:ss.S EEE 第q季度';
let format2 = 'yyyy年M月d日 h:m:s.S ap EE 第q季度';
let format3 = 'yyyy-MM-dd HH:mm:ss.S ap E';
console.log(format1 + " =>", date.format(format1));
console.log(format2 + " =>", date.format(format2));
console.log(format3 + " =>", date.format(format3));
```

**运行结果：**

> D:\DevEnvironment\NodeJs\node.exe D:\MyProjects\coding-study\src\main\resources\static\utils.js
> format1 => 2022年09月23日 23:24:39.836 星期五 第3季度
> format2 => 2022年9月23日 11:24:39.836 am 周五 第3季度
> format3 => 2022-09-23 23:24:39.836 am 五
> Process finished with exit code 0

### 1.3 在vue3项目中使用

* 第一步，先在plugins路径下，新建一个js文件用以创建插件，然后在这个插件内给Date对象添加这个函数

  **![image-20240807172113689](https://gitee.com/triabin/img_bed/raw/master/2024/08/07/43a5921a9a3348eccf25b4dde296667e-image-20240807172113689.png)**

  插件内容：

  ```javascript
  // src/plugins/custom-func.js
  export default {
    install(app) {
      /**
       * 函数描述：时间格式化工具
       * @param format {String} 格式（y-年，M-月，d-日，H-时[24]，h-时[12]，m-分，s-秒，S-毫秒(3位数)，q-季度，ap，午前am/午后pm）
       * @returns {String}
       */
      Date.prototype.format = function(format = 'yyyy-MM-dd HH:mm:ss') {
        // ...
      };
    }
  };
  ```

* 第二步，在main.js中使用插件

  ```javascript
  import { createApp } from 'vue'
  import App from './App.vue'
  import router from './router'
  import ElementPlus from 'element-plus'
  import * as ElementPlusIconsVue from '@element-plus/icons-vue';
  import components from '@/components/index.js';
  import 'element-plus/dist/index.css';
  import CustomFunc from "@/plugins/custom-func.js";
  
  const app = createApp(App);
  app.use(router) // 配置路由
    .use(ElementPlus) // 配置element-plus
    .use(components) // 注册全局组件
    .use(CustomFunc) // 注册自定义各个js对象的函数
    .mount('#app');
  ```

> Tips：其他方法一样可以在这个插件里面自定义

## 2、String => Date

### 2.1 代码

```javascript
/**
 * @desc 时间工具对象
 */
const DateUtils = {

    format1: 'yyyy-MM-dd HH:mm:ss',

    format2: 'yyyy年MM月dd日 HH时mm分ss秒',

    /**
     * 方法描述：将字符串转为时间对象
     * @param time {String} 时间字符串
     * @param format {String} 时间格式
     * @returns {Date}
     */
    convert(time, format) {
        if (time instanceof Date) {
            return time;
        }
        if (time && typeof time === 'string') {
            let getValue = function (regex) {
                let str = regex ? time.substr(regex.index, regex[0].length) : '';
                return str ? parseInt(str) : undefined;
            }
            // 各个时间的值，未获取到则取最小值
            let times = [
                getValue(/y+/.exec(format)) || 0, // 年
                getValue(/M+/.exec(format)) || 0, // 月
                getValue(/d+/.exec(format)) || 1, // 日
                /H+/.test(format) ? getValue(/H+/.exec(format)) : ((/h+/.test(format) && /pm/i.test(format)) ? getValue(/h+/.exec(format)) + 12 : getValue(/h+/.exec(format))) || 0, // 时
                getValue(/m+/.exec(format)) || 0, // 分
                getValue(/s+/.exec(format)) || 0, // 秒
                function () {
                    let reg, regArr;
                    reg = new RegExp(/(\d{1,3}).*/, 'g'); reg.lastIndex = format.indexOf("S");
                    return reg.lastIndex > -1 ? (regArr = reg.exec(time)) && parseInt(regArr[1]) : undefined;
                } () || 0// 毫秒
            ];
            times[1] && (times[1] -= 1);
            return new Date(...times);
        }
    }
}
```

### 2.2 使用

```javascript
let date = new Date();
let dateStr1 = date.format(DateUtils.format1);
let dateStr2 = date.format(DateUtils.format2);
console.log(dateStr1 + ' =>', DateUtils.convert(dateStr1, DateUtils.format1));
console.log(dateStr2 + ' =>', DateUtils.convert(dateStr2, DateUtils.format2));
```

**运行结果：**

> D:\DevEnvironment\NodeJs\node.exe D:\MyProjects\coding-study\src\main\resources\static\utils.js
> 2022-09-23 23:38:08 => 2022-09-23T15:38:08.000Z
> 2022年09月23日 23时38分08秒 => 2022-09-23T15:38:08.000Z
> Process finished with exit code 0

