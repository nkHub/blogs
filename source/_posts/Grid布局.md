---
title: Grid布局
tags:
  - CSS
categories:
  - 前端
abbrlink: 34263
date: 2023-07-06 17:15:39
---

### 栅格布局

#### 通用

通用的栅格一般分为12或者24个格子, 然后通过margin或者padding控制间隔(flex方式可用通过gap属性)。

```less
  // less
  .loop(@n, @i: 1) when (@i =< @n) {
    &.col-@{i} {
      width: 100%*(1/24)*@i;
    }

    .loop(@n, @i + 1);
  }
  // 行
  .row {
    display: flex;
    flex-wrap: wrap;

    .col {
      box-sizing: border-box;
      .loop(24);
    }
  }
```

#### CSS3

对于宽高的设置，当存在多个连续相同值时可以使用repeat来循环。需要适配时，repeat接受auto-fit来自动适配，minmax接受最小值和最大值；接受多少个值即为多少行或者列。

grid-gap可以拆分为grid-row-gap和grid-column-gap分别设置水平和垂直间隔。

类似表格中的单元格合并，，栅格也存在合并(或者说跨度), 分别为grid-row和grid-column，需要在子项中设置。

```css
  display: grid;
  /* grid-template-columns控制每一列的宽度 */
  /* grid-template-columns: 100px 100px auto; */
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  /* grid-auto-rows */
  grid-auto-rows: 100px;
  /* 每个格子的间隔 */
  grid-gap: 15px; 
```
