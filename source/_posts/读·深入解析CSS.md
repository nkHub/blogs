---
title: 读·深入解析CSS
abbrlink: 22580
date: 2023-03-15 17:18:21
tags:
  - CSS
  - 阅读
categories:
  - 前端
---

# 深入解析CSS

### 一 、层叠、优先级和继承

* **层叠值：除了继承的值，选择器依赖优先级等最终生效的值；**
* **优先级：!important > 内联 > id > class > 标签；**
* **继承：子元素可以继承父类元素的文本样式和一部分其他属性；**
* **特殊值：**
  1. **inherit：继承父元素属性值**
  2. **initial：重置属性为默认值(display的默认值为inline)**
* **简写：顺序上右下左；如**
  ```css
  padding: 1px 2px 3px 4px;
  ```

### 二、单位

* **px(像素)、pt(点)：不严格等于屏幕物理像素(缩放)；**
* **em：font-size: 继承字号的大小，其他依赖当前元素的字号；**
* **rem：html根元素字号；**
* **vw、vh、vmin、vmax：相对于可视窗口；**
* **calc：计算属性，运算符号前后需要空格；**
* **css变量：**
  1. **声明"--变量名：值"，使用"var(--变量名，备用值)"，会被子元素继承；**
     ```css
     --white-color: #ffffff;
     color: var(--white-color);
     ```
  2. **js操作：style.getPropertyValue、style.setProperty**

### 三、盒模型

* **等高列：display: table/flex；**
* **内容垂直居中：绝对定位、上下padding、flexbox、行高、vertical-align(行内元素和table-cell)**
* **负外边距：折叠(两个上下负外边距重叠，取最大值)；**

### 四、浮动

* **浮动：float；clear: both;**
* **BFC(Block Format Context)：块级格式化上下文，将内部元素与外界元素隔离。**
  1. **创建方式**
     * **float：非none**
     * **overflow：非visible**
     * **display：inline-block、flex、inline-flex、grid、inline-grid、table-cell、table-caption；**
     * **position：非relative**
* **栅格系统：栅格布局(12/24)，column加padding，row向内负边距；**

### 五、FlexBox

* **Flex布局：**
  ```css
  display: flex;
  justify-content: space-around / space-between / center;
  align-items: center;
  flex-direction: column、row； // 排列方式
  flex-wrap: wrap;  // 是否换行
  ```

### 六、网格布局

* **Grid网格布局：**
  ```css
  @support(display: grid){ // 兼容写法
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); // 设置列数
    grid-auto-rows: 100px; // 隐式设置行高度
    grid-gap: 10px 15px; // 网格间距
    grid-column-start: 1; // 设置合并
    grid-areas: "test"; // 网格命名
    grid-area: span; // 合并简写
  }
  ```

### 七、定位和层叠

* **定位**
  1. **相对：relative，相对于自身**
  2. **绝对：absolute，相对父级存在定位的元素或者初始包含块**
  3. **固定：fixed，相对于视口**
  4. **粘性：sticky，到达特定位置时相对于视口固定**
  5. **层级：z-index，创建层叠上下文**

### 八、响应式

* **设计原则：**
  1. **移动优先：优先构建移动端界面**
     1. **禁止缩放**
        ```html
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ```
  2. **@media：媒体查询，根据不同设备视口构建不同样式。**
     1. **多条件**
        ```css
        @media (条件1) and (条件2){}
        ```
     2. **媒体类型**
        ```css
        @media screen and print{}
        ```
     3. **width：宽度，min-width、max-width**
     4. **orienttation：方向，landscape、portrait**
     5. **resolution：分辨率，2dppx**
     6. **断点：不同设备样式切换临界点**
  3. **流式布局：依赖视口宽度缩放**
     1. **响应式图片**
        1. **css @media、background: image-set(url(图片地址))**
        2. **img标签srcset(url 宽度(w, x),)、picture标签(source)**

### 九、模块化CSS、CSS方法论

* **OOCSS：面向对象CSS**
* **BEM：模块_元素--修饰器**
* **SMACSS：可拓展模块化CSS，分层**
  1. **Base：基础重置样式，包含基础组件样式**
  2. **Layout：布局样式**
  3. **Module：模块规则**
  4. **State：状态规则，部分组件的显示等状态**
  5. **Theme：主题规则，基础样式主题颜色等**
* **ITCSS：倒三角型CSS，分层**
  1. **Settings：全局变量**
  2. **Tools：通用工具和函数**
  3. **Generic：基础重置样式**
  4. **Base：type selector**
  5. **Objects：layout各种布局**
  6. **Components：UI组件**
  7. **Trumps：helper各种Component微调**

### 十、模式库

* **待测试**

### 十一、背景、阴影和混合模式

* **背景**
  ```css
  background-color: white;
  background-image: url('link');
  background-position: center top;
  background-repeat: no-repeat;
  background-size: 100%/cover/contain;
  background-attachment: fixed;
  ```
* **渐变**
  ```css
  background: linear-grident(to direction/deg, color, color); // 线性渐变
  background: repeating-linear-grident(to direction/deg, color, color); // 重复线性渐变
  background: radial-grident(color, colore); // 径向渐变
  background: repeating-radial-grident(color, color); // 重复径向渐变
  ```
* **阴影**
  ```css
  box-shadow: inset 1px 1px gray;
  text-shadow: 1px 1px gray;
  ```
* **混合模式**
  ```css
  background-blend-mode：mutiply;
  ```

### 十二、对比、颜色和间距

* **字体**
  ```css
  @font-face{
    font-family: 'Roboto';
    src: local('Roboto'), url('') format('.ttf');
  }
  font-family: 'Roboto', '微软雅黑'; // 设置备用字体
  ```
* **间距**
  ```css
  line-height: 1.42;
  letter-space: 1px; // 文字间距
  ```

### 十三、过渡

```css
transition-property: width; // 过渡属性， display不存在过渡
transition-duration: 2s; // 过渡时间
transition-timing-function: ease/linear/ease-in/ease-out; // 过渡函数
transition-timing-function: steps(2); // 过渡阶跃函数
transition-delay: 1s; // 过渡延迟
transition: width 2s ease 1s; // 过渡简写
```

### 十四、变换

```css
transform-origin: 50% 50%; // 变换基点
perspective: 500px; // 景深，开启3D
transform: translate(x, y, z); // 平移
transform: rotate(deg); // 旋转
transform: scale(size); // 缩放
transform: skew(deg); // 倾斜
will-change: transform; // 绘制层动画优化
```

### 十五、动画

```css
@key-frames test{
  0%{} // 关键帧
  100%{}
}
animation-name: 'test'; // 动画名称
animation-duration: 1s; // 动画过渡时间
animation-timing-function: ease/linear; // 动画过渡函数
animation-delay: 2s; // 动画延迟时间
animation-iteration-count: 1; // 动画执行次数
animation-fill-mode: backwards; // 动画填充模式
animation: 'test' 1s linear 2s 1;
```

### 其他

#### 选择器

* **(>) 子选择器**
* **(+) 相邻兄弟选择器**
* **(~) 通用兄弟选择器**
* **伪元素选择器**
  ```css
  ::after,::before{}
  ```css
* **伪类选择器**
  ```css
  :hover,:checked{}
  ```
* **属性选择器**
  ```css
  [disabled]{}
  [attr=value]{} // 属性全匹配
  [attr^=value]{} // 属性开头
  [attr$=value]{} // 属性结尾
  [attr*=value]{} // 属性包含
  ```

#### 条件注释

```html
  lte：就是Less than or equal to的简写，也就是小于或等于的意思。
  lt ：就是Less than的简写，也就是小于的意思。
  gte：就是Greater than or equal to的简写，也就是大于或等于的意思。
  gt ：就是Greater than的简写，也就是大于的意思。
  ! ：就是不等于的意思，跟javascript里的不等于判断符相同。
  具体用法：<!--[if+logical dialog+browser version]><![endif]-->
  条件注释只能用于IE5以上。
```

#### 黑暗模式

```css
@media(prefers-color-scheme: dark){}
```

```js
window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
```