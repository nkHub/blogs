---
title: vue3文档记录
abbrlink: 23343
date: 2023-03-14 18:25:23
tags:
  - Vue
  - Vue3
categories:
  - 前端
---

## [vue3 文档](https://cn.vuejs.org/guide/introduction.html)

本文主要是 script setup 写法。

### 1、动态参数

```html
// 默认
<div v-bind:[attrName]="arr" v-on:[eventName]="event"></div>
// 简写
<div :[attrName]="arr" @[eventName]="event"></div>
```

### 2、响应式基础

- reactive

  - 默认为深层响应
  - 只支持对象类型（String、Number 等不支持）
  - 不可整个替换，监听将断开

- ref

  - 默认支持所有类型
  - 顶层和深层响应自动解包

### 3、计算属性

- 计算属性存在缓存，如果计算依赖不更新则永远不会更新
- 可写计算属性
  ```javascript
  const name = ref("test");
  const test = computed({
    get() {
      return name.value + "123";
    },
    set(newVal) {
      name.value = newVal;
    },
  });
  test.value = "name";
  ```

### 4、类和样式绑定

正常的使用，vue 会自动添加浏览器前缀。

```javascript
  const testClass = ['active']
  // const testClass = {
  //    active: true
  // }
  const testStyle = {
    fontSize: '12px'
  }
  <div :class="testClass" :style="testStyle"></div>
```

### 5、条件渲染 v-if、v-show

v-if 相对于 v-show 存在更高的花销。

### 6、列表渲染 v-for

v-if 和 v-for 在同一级时，v-if 的优先级更高无法访问 v-for 内遍历的对象。key 的存在使循环存在更新时更新 DOM 更加的高效。以下数组方法会触发更新。

- `push()`、`pop()`、`shift()`、`unshift()`、`splice()`、`sort()`、`reverse()`

### 7、事件处理

- 方法处理器：foo、test.foo
- 内联处理器：foo()、count ++
- 事件修饰符，顺序会影响执行

  - `.stop`、`.prevent`、`.self`、`.capture`、`.once`、`.passive`

- 按键修饰符

  - `.enter`、`.tab`、`.delete` (捕获“Delete”和“Backspace”两个按键)、`.esc`、`.space`、`.up`、`.down`、`.left`、`.right`

- 系统修饰符

  - `.ctrl`、`.alt`、`.shift`、`.meta`

- 按键限定

  - `.exact`

- 鼠标修饰符

  - `.left`、`.right`、`.middle`

### 8、表单输入

修饰符

- `.lazy` 默认为 input 事件更新，添加后改为 change
- `.number`
- `.trim` 自动去除两端空格

### 9、生命周期

![组件生命周期图示](https://cdn.nikai.site/WZIHRAW2ET1UY9XC0MY0G6.png)

### 10、侦听器

watch 惰性指定观察

```javascript
const n = ref(0);
const n2 = ref(0);
// 单个ref
watch(n, (newVal, oldVal) => console.log(newVal, oldVal));
// getter
watch(
  () => n.value,
  (newVal, oldVal) => console.log(newVal, oldVal)
);
// 多个值
watch([n, () => n2.value], (newVal, newVal2) => console.log(newVal, newVal2));
// 对于reactive需要使用getter
const test = reactive({ name: "hello" });
watch(
  () => test.name,
  (newVal, oldVal) => console.log(newVal, oldVal)
);
// 深层监听
watch(test, (newVal, oldVal) => console.log(newVal, oldVal));
```

watchEffect 默认初次触发，副函数自动追踪响应式属性

```javascript
const unwatch = watchEffect(
  async () => {
    const res = await fetch(url.value);
  },
  {
    flush: "post", // DOM更新后
  }
);
// watchPostEffect
// 结束监听
unwatch();
```

触发时机默认都是 DOM 更新之前，通过设置`flush: 'post'`可以设置到 DOM 更新之后。

### 11、模版引用 ref

**v-for 内的 ref，可能顺序不一样**

```html
<template>
  // vue2方式
  <input ref="input" />
  // 类似于react
  <input :ref="e => text = e" />
</template>
<script setup>
  import { ref, onMounted } from "vue";
  const input = ref(null);
  const text = ref(null);
  onMounted(() => {
    console.log(input.value);
  });
  const getAll = () => {
    input, text;
  };
  // 暴露组件方法
  defineExpose({
    getAll,
  });
</script>
```

### 12、组件

组件定义，组件名称和 props 使用 PascalCase(大驼峰命名法)方法。

props 遵循单向数据流，props 更新会更新组件，反之则不会。针对 Boolean，vue 做了特殊处理，如果不设置 default 会存在默认值，可以直接设置 props 属性名等价设置为 true。

```html
<template>
  <h1 @click="handleTap">
    {{name}} // 插槽
    <slot></slot>
  </h1>
</template>
<script setup>
  import { ref } from "vue";
  // props的定义
  const props = defineProps({
    name: {
      type: String,
      required: true,
      default: "hello",
    },
    postTitle: {
      // 外部使用自动转post-title
      type: String,
      default: "hello",
    },
  });
  const n = ref(0);
  // 自定义事件
  // defineEmits(['tap']) 简写
  const emits = defineEmits({
    tap: null,
    // 事件校验
    change(num) {
      return num > 10;
    },
  });
  const handleTap = (e) => {
    n.value++;
    emits("tap", e);
  };
  const getName = () => props.name;
  const handleChange = () => emits("change", n);
  // 导出组件方法
  defineExpose({ getName });
</script>
```

动态组件和 vue2 相同。

```html
// name为组件名称或者组件对象 <components :is="name"></components>
```

#### v-model 的实现

支持多 v-model 和 v-model.lazy 等修饰符的使用

```javascript
<tempalte>
  <input :value="value" @change="handleChange">
</template>
<script setup>
  const props = defineProps(['value'])
  const emits = defineEmits('update:value')
  const handleChange = event => emits('update:value', event.target.value)
</script>

```

#### 属性透传 class、style

```javascript
<template>
  <div v-bind="attrs"></div>
</template>
<script>
// 使用普通的 <script> 来声明选项
export default {
  inheritAttrs: false
}
</script>
<script setup>
 import { useAttrs } from 'vue'
 const attrs = useAttrs()
 // $listeners已合并至atters
</script>
```

#### 插槽

一、具名插槽

```html
<div>
  <slot name="header"></div>
</div>
```

二、作用域插槽

```html
// 父组件
<template>
 <Child>
  <template v-slot:header="{ data }">{{data}}</template>
 </Child>
</template>
// 子组件
<div>
  <slot name="header" data="data"></div>
</div>
```

#### 依赖注入 provide、inject

```html
// 上层
<script setup>
  import { ref, provide, readonly } from "vue";
  const msg = ref("");
  provide("msg", {
    msg,
    updateMsg: (txt) => (msg.value = txt),
  });
  provide("message1", "hello!");
  provide("message2", readonly("world!")); // 只读
</script>
// 下层
<script setup>
  import { inject } from "vue";
  const message = inject("message1", "默认值");
</script>
```

### 13、组件注册

全局注册

```javascript
import { createApp } from "vue";
const app = createApp();
app.components(组件名称, 组件对象);
```

局部注册

```javascript
<template>
  <Test />
</template>
<script setup>
 import Test from 'test'
</script>
```

### 14、异步组件

```javascript
import { defineAsyncComponent } from "vue";
// 简写
const AsyncComp = defineAsyncComponent(() => import("./Foo.vue"));
// 完整
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import("./Foo.vue"),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000,
});
```

### 15、组合函数

该部分与 react hooks 基本相似，mixins 的更新版本。

```javascript
// fetch.js
import { ref } from "vue";

export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err));

  return { data, error };
}

<script setup>
  import {useFetch} from './fetch.js' const {(data, error)} = useFetch('...')
</script>;
```

### 16、自定义指令

v-bind、v-on 其实都是 vue 自带的指令，并且做了简化解析。

```javascript
const app = createApp({});

// 简写
app.directive("test", (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value;
});

// 完整
app.directive("test", {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode, prevVnode) {},
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode, prevVnode) {},
});
```

### 17、插件

```javascript
import { createApp } from 'vue'

const app = createApp({})

app.use(testPlugin, {
  install(app, options){
     // 注册自定义组件指令，修改全局参数等
     app.component('name', component)
     app.directive('name', directive)
     全局参数：app.config.globalProperties
  }
})
```
