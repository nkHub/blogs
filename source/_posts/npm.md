---
title: npm
tags:
  - npm
categories:
  - 前端
abbrlink: 61573
date: 2019-07-11 14:08:08
---

# npm

查看全局安装包列表

```bash
  npm list –g –depth 0
```


淘宝镜像设置:

```bash
  npm config set registry https://registry.npm.taobao.org
```


npm install 报错：
```bash
  1.NPM Unexpected end of JSON input while parsing near
  2.npm ERR! A complete log of this run can be found in:
  // 解决办法：
  // first: npm install --registry=https://registry.npm.taobao.org --loglevel=silly
  // then: npm cache clean --force
```
