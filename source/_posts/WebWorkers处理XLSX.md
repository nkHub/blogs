---
title: Vue2中WebWorkers处理XLSX
tags:
  - webworkers
  - xlsx
categories:
  - 前端
abbrlink: 61310
date: 2023-07-06 14:48:20
---


### vue.config.js配置

```javascript
  const vueConfig = {
    chainWebpack(){
      // xlsx web-worker优化
      config.module.rule('worker')
        .test(/\.worker\.js$/)
        .use('worker-loader')
        .loader('worker-loader')
        .options({ inline: 'fallback' })

      config.output.globalObject('this')
    }
  }
```

### XLSX.workers.js

```javascript
  import isUTF8 from 'isUTF8.js'

  // 加载xlsx
  importScripts('https://****/xlsx.full.min.js')

  // 错误部分
  const ERROR = (msg = "error") => {
    // 发送错误消息
    self.postMessage({ message: msg, data: [] })
    self.close()
  }

  // 监听报错
  self.addEventListener('error', (event) => {
    ERROR()
    // 输出错误信息
    console.log('ERROR: Line ', event.lineno, ' in ', event.filename, ': ', event.message)
  })

  // 接收消息
  self.addEventListener('message', (event) => {
    const { fun, options } = event.data;
    // 函数列表
    const funs = {
      covertXlsxJSON,
      json2XLSXFile
    }
    // 执行对应的函数
    if(typeof funs[fun] === 'function'){
      funs[fun](options);
    }else{
      ERROR('找不到对应的函数');
    }
  }, false)


  // 解析文件转数据
  function covertXlsxJSON(options){
    const { file } = options;
    console.log('开始加载XLSX...')
    const isCSV = file.name.split('.').reverse()[0] === 'csv';
    let buf = null;
    console.log('开始加载文件...')
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function(e){
      const data = e.target.result;
      console.log('开始解析文件...');
      if(isCSV && !isUTF8(data)){
        buf = XLSX.read(data, { type: 'binary', codepage: 936 });
      }else{
        buf = XLSX.read(data, { type: 'binary' });
      }
      const res = XLSX.utils.sheet_to_json(buf.Sheets[buf.SheetNames[0]]);
      self.postMessage({ message: '解析成功', data: res });
      self.close();
    }
    reader.onerror = function(e){
      console.log('文件加载失败', e);
      ERROR();
    }
  }

  // json转文件
  function json2XLSXFile(options){
    const { data, filename, type } = options;
    const wopts = {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary'
    }, workBook = {
      SheetNames: ['Sheet1'],
      Sheets: {},
      Props: {}
    }
    console.log('开始json转XLSX文件...')
    workBook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data);
    const blob = new Blob([changeData(XLSX.write(workBook, wopts))], { type: 'application/octet-stream' });
    const file =  new File([blob], filename, {type: `application/${type}`, lastModified: Date.now()});
    console.log('json转XLSX成功')
    self.postMessage({ message: '解析成功', data: file });
    self.close();
  }


  function changeData(s){
    //如果存在ArrayBuffer对象(es6) 最好采用该对象
    if (typeof ArrayBuffer !== 'undefined') {
      //1、创建一个字节长度为s.length的内存区域
      var buf = new ArrayBuffer(s.length);
      //2、创建一个指向buf的Unit8视图，开始于字节0，直到缓冲区的末尾
      var view = new Uint8Array(buf);
      //3、返回指定位置的字符的Unicode编码
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }else{
      var buf = new Array(s.length);
      for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
  }
```