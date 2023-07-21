---
title: Flex基础
abbrlink: 34127
date: 2023-02-17 11:41:44
tags:
  - CSS
categories:
  - 前端
---

### flex常用

横轴: justify-content
纵轴: align-items

```css
  display: flex;
  justify-content: center; // flex-start/flex-end/space-around/space-between
  align-items: center;     // flex-start/flex-end
  gap: 10px;
```

### flex的剩余空间分配

剩余空间：所有项宽度无法占满容器时剩余的空间。

flex-grow：剩余空间为正，会按照当前值的比例分配剩余空间，没有设置flex-basis即默认宽度时会获取项的基础宽度，然后按照比例分配剩下的空间。

flex-shrink：剩余宽度为负，即所有项的宽度大于容器宽度，会按照当前值的比例缩放每一项的大小，基础值为flex-basis或者没有设置flex-shrink时的宽度计算。

```css
  flex: 1;        // flex-grow
  flex: 0 0 auto; // flex-grow flex-shrink flex-basis
```