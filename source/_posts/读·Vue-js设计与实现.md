---
title: 读·Vue.js设计与实现
abbrlink: 64155
date: 2023-03-15 17:13:35
tags:
  - Vue3
  - 阅读
categories:
  - 前端
---

# Vue.js 设计与实现

## 一、框架设计概览

### 1. 命令式和声明式

1. **命令式（Jquery 链式调用）**
2. **声明式（关注于结果的命令式封装）**

### 2. 声明式与命令式性能和可维护性

1. **性能：命令式 > 声明式**
2. **可维护性：声明式 > 命令式**

### 3. 虚拟 DOM（如何让声明式的性能损失最小化）

1. **性能消耗组成：创建 javascript 对象 + 差异查找 Diff + 直接修改（依赖数据量）**
2. **innerHTML：全量更新 + 销毁旧节点 + 创建新节点（依赖模版量）**
3. **对比**

   | **innerHTML 模版** | **虚拟 DOM**   | **原生 javascript** |
   | ------------------ | -------------- | ------------------- |
   | **心智负担中**     | **心智负担轻** | **心智负担重**      |
   | **性能差**         | **可维护性强** | **可维护性弱**      |
   |                    | **性能不错**   | **性能高**          |

### 4. 框架设计类型（运行时、运行时 + 编译时、编译时）

1. **运行时：直接运行的代码**
2. **编译时：需要二次编译转换（例如模版的解析、语言的转换）**
3. **示例：**
   1. **运行时 + 编译时：Vue.js**
   2. **编译时：Svelte.js**

## 二、框架设计的核心要素

### 1. 提升用户开发体验

1. **友好的提示（console）**
   > **Vue3 的 Proxy 显示原始值的方法**
   >
   > 1. **target.value**
   > 2. **Chrome 中 console 开启 Enable custom formatters**

### 2. 控制框架的体积

1. **开发版本关闭 console 减少体积**
2. **Tree-shaking**
   1. **无用代码的移除**
   2. **副作用（无意义的函数使用，仅存在字段读取而不会被过滤）的移除**
      ```
      /*#__PURE__*/ fn()
      ```

### 3. 框架构建产物

1. **开发环境：不包含警告信息**
2. **生产环境**
   > **IIFE（Immediately Invoked Function Expression）： 立即调用的函数表达式**
   >
   > **例如：(funciton(){ })()**

### 4. 特性关闭

1. **关闭特性减少打包资源体积(例如 vue3 关闭组件选项 api)**
2. **roll.js 预定义常量定制功能，例：**`__DEV__`、`__VUE_OPTIONS_API__`等

### 5. 错误处理

1. **统一的错误处理函数注册**
2. `app.config.errorHandler = () => {}`

### 6. TypeScript 支持

1. **使用 TS 和对 TS 类型友好支持是两回事儿。**

## 三、Vue.js 3 的设计思路

### 1. 声明式描述 UI

1. **模版描述**
   ```html
   <div>test<div>
   ```
2. **虚拟 DOM 描述（Vue.createElement）**
   ```javascript
   const title = {
     tag: 'h1',
     props: {
       onClick: handler
     },
     children: [
       {
         tag: 'span',
         children: 'test'
       }
     ]
   }
   ```

### 2. 渲染器：虚拟 DOM -> 实际节点

```javascript
function renderer(vnode, container){
  const el = document.createElement(vnode.tag)
  // 绑定事件  
  for(const key in vnode.props){
    if(/^on/.test(key)){
      el.addEventListener(
        key.substr(2).toLowerCase(),
        vnode.props[key]
      )
    }
  }
  // 渲染子节点
  if(typeof vnode.children === 'string'){
    el.appendChild(document.createTextNode(vnode.children))
  }else if(Array.isArray(vnode.children)){
    vnode.children.forEach(child => renderer(child, el))
  }
  // 节点挂载到外部根节点
  container.appendChild(el)
}
// 渲染
renderer(vnode, document.body)
```

### 3. 组件：一组 DOM 元素的封装

```javascript
// 渲染函数
function renderer(vnode, container){
  if(typeof vnode.tag === 'string'){
    mountElement(vnode, container)
  }else if(typeof vnode.tag === 'function'){
    mountComponent(vnode, container)
  }else if(typeof vnode.tag === 'obj'){
    mountObjComponent(vnode, container)
  }
}
// 渲染器内的节点渲染器renderer
function mountElement(){}
// 挂载函数组件
function mountComponent(vnode, container){
  const subtree = vnode.tag()
  renderer(subtree, container)
}
// 挂载对象组件
function mountObjComponent(vnode, container){
  const subtree = vnode.tag.render()
  renderer(subtree, container)
}

```

### 4. 模版的工作原理

1. **编译器：将模板编译为虚拟 DOM 描述**

### 5. Vue.js 是各个模块组成的整体

\*\* \*\*渲染器 + 编译器（模版处理）+ ...

---

## 四、响应系统的作用和实现

### 1. 响应式数据与副作用函数

** 副作用：值的变动会潜在的影响其他依赖此值的变量变动**

### 2. 响应式数据的基本实现

```javascript
const bucket = new Set()
const data = {
  text: 'hello'
}
const obj = new Proxy(data, {
  get(target, key){
    bucket.add(effect)
    return target[key]
  },
  set(target, key, newVal){
    target[key] = newVal
    bucket.forEach(fn => fn())
    return true
  }
})
```

### 3. 设计一个完善的响应系统

**WeakMap 的 key 弱引用不影响垃圾回收**

```javascript
const data = {  text: 'hello' }
const bucket = new WeakMap()
const obj = new Proxy(data, {
  get(target, key){
    track(target, key)
    return target[key]
  },
  set(target, key, newVal){
    target[key] = newVal
    trigger(target, key)
  }
})
// 跟踪函数
function track(target, key){
  if(!activeEffect) return
  let depsMap = bucket.get(target)
  if(!depsMap){
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if(!deps){
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
}
// 变化触发函数
function trigger(target, key){
  const depsMap = bucket.get(target)
  if(!depsMap) return
  const effects = depsMap.get(key)
  effects && effects.forEach(fn => fn())
}

// 副作用函数
let activeEffect
function effect(fn){
  activeEffect = fn
  fn()
}

effect(function(){
  document.body.innerText = obj.text
})
```

### 4. 分支切换与 cleanup

**ok 为 false 时，修改 text 不应该更新副作用函数，每次执行副作用函数前需要清空关联。**

```javascript
'use strict';
const data = { ok: true, text: 'hello' }
const bucket = new WeakMap()
const obj = new Proxy(data, {
  get(target, key) {
    track(target, key)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    trigger(target, key)
    return true
  }
})
// 跟踪函数
function track(target, key) {
  console.log('track get', target, key)
  if (!activeEffect) return
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}
// 变化触发函数
function trigger(target, key) {
  console.log('trigger set', target, key)
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  const effectsRun = new Set(effects)
  effectsRun && effectsRun.forEach(fn => fn())
}

// 副作用函数
let activeEffect
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
  }
  effectFn.deps = []
  effectFn()
}

function cleanup(effectFn){
  for(let i = 0; i < effectFn.deps.length; i++){
    const deps = effectFn.deps[i];
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

effect(function () {
  console.log('effect run')
  document.body.innerText = obj.ok ? obj.text : 'not'
})

setTimeout(function(){
  // 修改
  console.log('修改ok')
  obj.ok = false
  setTimeout(function(){
    obj.text = 'test'
  }, 100)
}, 1000)
```

### 5. 嵌套的 effect 与 effect 栈
