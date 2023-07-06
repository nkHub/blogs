---
title: Vue.$createElement
tags:
  - null
categories:
  - 前端
abbrlink: 7851
date: 2023-07-06 16:42:20
---

#### 代码

主要在非Vue2组件环境时使用组件。

```javascript
  // demo createElement
  Vue.$createElement('div', {
      class: {},
      style: {},
      attrs: {
          id: 'test'
      },
      props: {},
      domProps: {
          innerHTML: 'test'
      },
      on:{
          click: () => {}
      },
      nativeOn:{},
      directives: [
          {
              name: 'custom',
              value: '2',
              expression: '1 + 1',
              arg: 'foo',
              modifiers: {
                  bar: true
              }
          }
      ],
      scopedSlots: {
          default: h => h('div',{},'test')
      },
      slot: '当前组件为插槽子组件',
      key: '',
      ref: 'test',
      refInFor: true
  })
```