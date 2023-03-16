---
title: React基础
tags:
  - React
categories:
  - 前端
abbrlink: 35233
date: 2019-09-25 20:34:38
---

## [React简介](https://reactjs.org/docs/hello-world.html)

### 1. npm项目创建：

```bash
  npm install –g create-react-App
  create-react-App 项目名称
  cd 项目名称
  npm start
  npm run dev   //开发本地测试
  npm run build //打包运行
```

### 2. 组件样式导入：

[默认ES6方式导入](/view/web/ES6.md?id=_14-模块)。

```javascript
  import { Component } from 'react';
  import 'style.css';
```

### 3. 渲染：

```javascript
  import ReactDom from 'react-dom';
  ReactDom.render(
    组件,
    Element,
    回调函数           //可省略
  );
```

### 4. 组件：

PureComponent组件相对于Component，已完成props与state的浅对比，优化性能，复杂数据不建议使用，易出错,同时子组件须使用PureComponent。

**组件使用时，组件名称可使用变量动态替换，但不支持表达式方式使用。**

推荐使用以下ES6方式书写组件，此外还包含无状态组件以及高级组件等。

```javascript
  class 组件名(首字母必须大写) extends Component{
    //构造函数
    contructor(props){
      super(props);          // 执行父类的构造函数，将父类的props绑定到this
      this.state = {};
    }

    //内置函数
    this.setState({          //设置state
       参数名：参数值
    });
    this.forceUpdate()       //强制更新props或state

    //生命周期(常用)
    componentWillMount()                        //组件将要挂载
    componentDidMount()                         //组件已加载
    shouldComponentUpdate(nextProps, nextState) //是否应该更新（多用于性能优化）返回true时更新界面
    componentDidUpdate()                        //已更新界面
    componentWillUnmount()                      //组件将要卸载

    //渲染函数
    render(){
      return (HTML元素或组件);
    }
  }
```

**[标签要求:](https://facebook.github.io/react/docs/dom-elements.html)**

1). 任意元素必须闭合

2). 属性class和for使用className和htmlFor代替

3). 最外层只含有一个标签

4). 属性dangerouslySetInnerHTML对innerHTML的替代

```html
  <div dangerouslySetInnerHTML={{__html: html字符串}}></div>
```

### 4. 事件：


```jsx
  render(){
    return (
      <div>
        //默认所有事件驼峰写法
        <div onClick={ 函数名 }></div>
        //携带任意个数参数
        <div onClick={(参数名例如event) => this.函数名(参数名1,参数名2...) }></div>
        //绑定函数到当前对象
        <div onClick={() => this.函数名().bind(this) }></div>
      </div>
    )
  }
```

### 5. props：

```html
  <组件名 参数名={参数} />  //组件可从this.props中获取传递的参数
```


[props类型检测](https://facebook.github.io/react/docs/typechecking-with-proptypes.html)

```javascript
  import ProTypes from “prop-types”;  //不推荐使用React.ProTypes
  组件名.propTypes={
    参数名: PropType.string…(.isRequired)
    //可选值string、bool、array、number、object、func、element、node…
  }
```

### 6. ref：

```jsx
  ...
  render(){
    return(
        <input ref={(input)=>{ this.inputEle = input }} />
        //新写法获取元素;将元素绑定到组件对象上
    )
  }
  ...
```


## react-router

外部配置

```javascript
  import { HashRouter , Switch , Route } from 'react-router-dom';

  //路由方式 1.history import BrowserRouter
  //路由方式 2.hash  import HashRouter

  //DOM渲染
  ReactDOM.render((
    <Provider store={store}>
      <HashRouter>
          <Switch>
            <Route path="/" component={Index} exact/>
            <Route path="/detail/:id" component={Detail} />
          </Switch>
      </HashRouter>
    </Provider>
  ), document.getElementById('root'));
```

页面使用redirect组件或props.history...手动跳转路由。

```html
  <NavLink to="/detail/1">详情页面</NavLink>
```

## react-redux

### 1. 简介：

状态从一个初始状态开始，被一系列动作序列改变

### 2. 数据层绑定：

```javascript
  import { Provider } from 'react-redux';
  import configureStore from './redux/store';

  const store = configureStore();
  //react-redux store监听
  store.subscribe(()=>{
    console.log('store监听：');
    console.log(store.getState());
  });

  export default class App extends Component{
    render(){
      return(
        <Provider store={store}>
            <Home/>
        </Provider>
      );
    }
  }
```

### 3. UI层绑定：

```javascript
  import { connect } from 'react-redux';

  const mapStateToProps = (state)=>{
    return {
        test: state.test
    };
  }
  const mapDispatchToProps = (dispatch)=>{
    return {
        testClick: () => dispatch({
            type: 'test',
            payload: true
        })
    };
  }

  connect(
    mapStateToProps,    //将state映射到props中,参数为state，props  必须返回对象
    mapDispatchToProps  //发送action,参数为dispatch,props  必须返回对象
  )(component);
```

### 4. 内部结构：

#### 1. store：

store由createStore创建，可使用combineReducers() 合并多个reducer，ApplyMiddleware(thunk, promise, logger)中间件拓展 如异步、日志等。

React-thunk 使dispatch可接受函数（原来只接受对象）,可拓展多步操作（可包含多个dispatch）;

i. 状态存储中心，store.js代码：

```javascript
  //通用const store = ApplyMiddleware(...middlewares)(createStore)(reducer, initialState);

  //实例
  'use strict';
  import { createStore, ApplyMiddleware } from 'redux';
  import thunkMiddleware from 'redux-thunk';
  import rootReducer from './reducer';
  //此处设置中间件thunk的方法
  const createStoreWithMiddleware = ApplyMiddleware(thunkMiddleware)(createStore);
  const configureStore = (initialState) => {
    return createStoreWithMiddleware(rootReducer, initialState);
  };
  export default configureStore;
```
#### 2. reducer：

i. 模块操作合并，reducer.js代码如下

```javascript
  'use strict';
  import { combineReducers } from 'redux';
  //页面模块部分
  import Common from './module/common';
  import Home from './module/home';

  const rootReducer = combineReducers({
    Common: Common,
    Home: Home,
    ...
  });
  export default rootReducer;
```

ii. 单个页面模块部分，接受action返回新State;

**不要修改原 state**

特点:
*  一、不改写参数
*  二、不调用系统I/O的API
*  三、不调用时间或随机数等不纯的方法

推荐使用: Object.assign({},state,需要修改的参数);生成新的State

```javascript
  const initialState = {};
  export default (state = initialState, action)=>{
    switch(action.type){
        case 'test':
            return { ...state, test: action.payload}
            break;
        default:
            return state;
    }
    // return new_state;
  }
```


#### 3. state：

时点数据集合，一个State对应一个View，获取：store.getState();

#### 4. action：

```javascript
  let action = {
    type: type,
    preload: preload,
    ...
  }
  store.dispatch(action);
```

## antd-design引入

引入ant，按需加载

命令 npm run eject 暴露配置，修改config的webpack配置文件

npm @next最新包

```javascript
  // Process JS with Babel.
  {
    test: /\.(js|jsx|mjs)$/,
    include: paths.AppSrc,
    loader: require.resolve('babel-loader'),
    options: {
      cacheDirectory: true,
      plugins: [
        'transform-runtime',["import", {
            libraryName: "antd-mobile",
             style: "css"
         }] // `style: true` 会加载 less 文件
      ]
    },
  }
```