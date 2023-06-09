---
title: ES6备忘
abbrlink: 35890
date: 2019-09-27 14:10:57
tags:
  - JavaScript
categories:
  - 前端
---

# ES6

##### 1. let

无var的变量提升（声明前使用为undefined），并且作用范围为块作用域内同时不会绑定至window对象上。

##### 2. const

常量定义(引用类型，数据地址不变)，其他与let相同。

##### 3. 解析复构

对应位置赋值

```javascript
  let { a } = { a : 1 }
  console.log(a); // a = 1;
  let [ b, c ] = [ 1, 2 ];
  console.log(b); // b = 1;
```

##### 4. 模板字符串

```javascript
  `字符串/HTML + ${ 变量名 }`
```

##### 5. 箭头函数

函数体内不会绑定prototype原型对象

```javascript
  var 函数名 = (参数 = 默认值) => { 函数体 } ;
```

##### 6. 对象

```javascript
  obj::fnName;  //对象::函数 绑定上下文，类似于 fn().bind(this)
  Object.keys( obj );   //获取对象键数组
  Object.values( obj ); //获取对象值数组
  Object.assign( {}, obj ); //对象合并并返回新的对象（多用于对象浅复制，深复制多使用插件或自定义递归方式函数）
  常见：
  let config = Object.assign( {}, defaultConfig, options ); //配置合并
```

###### Class

不存在变量提升，super继承父级constructor方法(如无需修改则可不使用constructor方法)。

```javascript
 class Test extends Object{
    //执行父级构造函数
    constructor(props){
      super(props);
    }
    //自定义方法
    methods(){

    }
 }
```

##### 7. 数组

Array.from可将类似格式转换为数组。

```javascript
  let value = {
    0: { a : 1 },
    length: 1
  }
  
  常用方法：
  slice，splice，concat，filter，find，findIndex，
  flat，map，reduce，forEach，some，every...
```

##### 8. 拓展运算符

拓展运算符( ... name) 主要用于函数调用,将一个数组，变为参数序列,将name数组元素依次添加到外面

```javascript
  function test(...name){
    console.log(name); //参数列表数组
  }

  let n = [...array]; //数组浅复制
```

##### 9. Promise

```javascript
  //正常处理
  new Promise((resolve,reject){
    resolve(); //异步操作成功
    reject();  //异步操作失败
  });
  
  // 多异步合并后，所有异步完成则执行
  Promise.all(promiseList).then().catch();

  // 多异步合并后，只要有异步完成则执行
  Promise.race(promiseList).then().catch();

  // 多异步串联执行
  PromiseList.reduce((accumulator,next) => accumulator.then(() => next.then()),Promise.resolve());
```

##### 10. Set

Set不含重复的数据结构，包含add,del,has,clear方法, WeakSet与WeakMap类似但只支持key为对象;

```javascript
  [...new Set(array)] 数组去重
```

##### 11. Map

Map与传统“键-值”相对的“值-值”，数据结构;

```javascript
  const test = new Map([
    [1, '测试1'],
    [2, '测试2'],
  ])
  console.log(test.get(1))
```

##### 12. async

函数: 函数体内可使用 await调用Promise函数回调，实现异步函数同步写法，返回Promise对象。

```javascript
  async function(){
    let res = await ajax();
  }
```

##### 13. generator

generator类似于async, await换位yield，返回Promise对象。

```javascript
  function* Test(){
    yield response1;
    yield response2;
    return;
  }
  Test().next();
  Test().next();
```

##### 14. 模块

'编译时加载/静态加载'不同于commonJS的'运行时加载'。

```javascript
  import * as name from 'fs'; //导入所有数据
  import { name } from 'fs'; //导入所有数据

  export default name; //导出
```

相对于require的区别：

1. 即使在任意位置使用，文件执行时import都会自动提升至起始位置加载，require为任意位置使用与加载；
2. 按需加载；