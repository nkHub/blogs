---
title: Vue2弹窗抽屉插件备忘
abbrlink: 34126
date: 2022-11-07 15:01:03
tags:
  - Vue
  - Vue2
categories:
  - 前端
---

## 弹窗和抽屉等组件唯一

```javascript
// 实际内容的导入
import Content from "content";
// 版本号
const version = "1.0.0";
const Modal = {};
// 返回实例
Modal.instance = (Vue, options) => {
  let modelEl = document.querySelector("body>div[type=modal]");
  if (!modelEl) {
    modelEl = document.createElement("div");
    modelEl.setAttribute("type", "modal");
    modelEl.classList.add("modal-wrapper");
    document.body.appendChild(modelEl);
  }
  const mProps = Object.assign({ visible: false }, options);
  const instance = new Vue({
    data() {
      return { ...mProps };
    },
    render() {
      if (!this.visible) return null;
      return <Content {...{ props }} />;
    },
  }).$mount(modelEl);

  function update(config) {
    const { visible } = { ...mProps, ...config };
    instance.$set("visible", visible);
  }
  return { instance, update };
};
// 暴露的api
const api = {
  show() {
    this.instance.update({ visible: true });
  },
  hide() {
    this.instance.update({ visible: false });
  },
};
// 安装函数
const install = (Vue, options) => {
  if (Vue.prototype.$modal) return;
  api.instance = Modal.instance(Vue, options);
  Vue.prototype.$modal = api;
  Vue.component("Modal", Content);
};

export default { version, install };
```
