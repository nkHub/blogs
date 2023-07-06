---
title: JS事件订阅
tags:
  - JavaScript
categories:
  - 前端
abbrlink: 59452
date: 2023-07-06 14:52:29
---

### 事件订阅与监听器

```javascript
  export default class Emitter {
      constructor() {
          this._queue = {};
          this._queue_once = {};
      }

      // 注册事件
      on(key, fn) {
          if (!this._queue[key]) this._queue[key] = [];
          (this._queue[key].indexOf(fn) == -1) && this._queue[key].push(fn);
      }

      //注销指定事件
      off(key, fn) {
          this._queue[key].splice(this._queue[key].indexOf(fn), 1);
      }

      // 注册触发一次的事件
      once(key, fn) {
          if (!this._queue_once[key]) this._queue_once[key] = [];
          this._queue_once[key].push(fn);
      }

      // 手动触发事件
      trigger(key, ...args) {
          this._queue[key] && this._queue[key].forEach(fn => fn(...args));
          this._queue_once[key] && this._queue_once[key].forEach(fn => fn(...args));
          this._queue_once[key] = [];
      }

      // 注销所有事件
      offall() {
          this._queue = {};
          this._queue_once = {};
      }
  }
```