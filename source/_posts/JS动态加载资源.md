---
title: JS动态加载资源
tags:
  - JavaScript
categories:
  - 前端
abbrlink: 30755
date: 2023-07-06 16:31:54
---

#### 代码

```javascript
  /**
   * 动态加载资源
   * name 资源包名称
   * resource 资源列表 [{ name, url }] name: window变量名，url:资源地址
   * */
  export default function asyncLoader(name, resource = []){
    // 无匹配资源
    if(!Array.isArray(resource))return Promise.reject('找不到匹配的资源');
    // 单个加载文件
    const getScript = id => document.getElementById(`async-${id}`);
    // 单个加载文件
    const loadSingleRes = (id, name, url) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = `async-${id}`;
        script.type = 'text/javascript';
        script.src = url;
        // 资源加载
        function scriptLoad(){
          resolve.call(null, window[name])
          script.removeEventListener('load', scriptLoad);
          script.removeEventListener('error', scriptLoadError);
        }
        // 资源加载失败
        function scriptLoadError(){
          reject();
          script.removeEventListener('load', scriptLoad);
          script.removeEventListener('error', scriptLoadError);
        }
        script.addEventListener('load', scriptLoad);
        script.addEventListener('error', scriptLoadError);
        document.body.append(script);
      });
    }
    // 脚本查找
    const scripts = resource.map(v => ({
      ...v,
      script: getScript(v.name)
    }));

    // 加载器
    let loader = null;
    // 需要加载的资源列表
    const needLoadRes = scripts.filter(v => v.script === null);
    // 如果没有要加载的资源
    if(needLoadRes.length === 0){
      // 检测加载中的
      const list = scripts.filter(v => !window[v.name]).map(v => {
        // 不存在变量加载中
        return new Promise((resolve, reject) => {
          // 资源加载
          function scriptLoad(){
            resolve.call(null, window[name])
            v.script.removeEventListener('load', scriptLoad);
            v.script.removeEventListener('error', scriptLoadError);
          }
          // 资源加载失败
          function scriptLoadError(){
            reject();
            v.script.removeEventListener('load', scriptLoad);
            v.script.removeEventListener('error', scriptLoadError);
          }
          // onload会存在覆盖从而只触发一次的问题
          v.script.addEventListener('load', scriptLoad);
          v.script.addEventListener('error', scriptLoadError);
        });
      });
      // 如果存在加载中则等待加载中，，否则直接返回
      loader = list.length > 0 ? Promise.all(list) : Promise.resolve();
    }else{
      // 返回处理过的数据
      loader =  Promise.all(needLoadRes.map(v => loadSingleRes(v.name, name, v.url)));
    }
    // 返回加载数据
    return loader.then(() => {
      return Promise.resolve(scripts.map(v => window[v.name]));
    });
  }
```