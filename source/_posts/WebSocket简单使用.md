---
title: WebSocket简单使用
tags:
  - WebSocket
categories:
  - 前端
abbrlink: 478
date: 2023-07-06 14:55:19
---

## WebSocket

### 简单封装类

```javascript
  // 默认配置
  const defaultOptions = {
      url: '',      // websocket地址
      heart: 5,     // 重连心跳, 单位s
      limit: -1,    // 重连次数, 默认不限制重连次数
      auto: true   // 默认自动连接
  }
  export default class Socket {
    constructor(options){
      this.options = Object.assign({}, defaultOptions, options)
      this.status = 'init'
      this.emitter = new Emitter()
      this.ws = null
      this.timer = null // 重连定时器
      this.count = 0    // 已重连次数
    }
    // 初始化
    init(){
      // 自动连接
      if(this.options.auto) this.connect()
    }
    // 连接
    async connect(){
      const { options, emitter } = this
      if(this.ws && this.status === 'open') throw("连接已存在！")
      const { url } = options
      // 开始创建
      this.ws = this.create(url)
    }
    // 重连
    async reconnect(){
      // 销毁关联
      this.destory()
      // 开始链接
      await this.connect()
    }
    // 断开连接
    disconnect(){
      if(this.ws && this.status === 'open'){
        this.ws.close()
      }else{
        throw('当前不存在连接, 或者链接状态不正确！')
      }
    }
    // 事件监听
    on(event, fun){
      this.emitter.on(event, fun)
    }
    // 断开事件监听
    off(event, fun){
      this.emitter.off(event, fun)
    }
    // 发送消息
    send(data){
      if(this.ws && this.status === 'open'){
        this.ws.send(data)
      }else{
        throw('当前不存在连接, 或者链接状态不正确！')
      }
    }
    // 创建链接
    create(url){
      const { onConnecting, onOpen, onMessage, onClosing, onClose } = this
      const ws = new WebSocket(url)
      ws.addEventListener('connecting', onConnecting)
      ws.addEventListener('open', onOpen)
      ws.addEventListener('message', onMessage)
      ws.addEventListener('closing', onClosing)
      ws.addEventListener('close', onClose)
      return ws
    }
    // 各个流程的回调函数
    onConnecting(evt){
      this.emitter.trigger('connecting', evt)
      this.status = 'connecting'
    }
    onOpen(evt){
      this.emitter.trigger('open', evt)
      this.status = 'open'
      this.count = 0
    }
    onMessage(evt){
      this.emitter.trigger('message', evt)
    }
    onClosing(evt){
      this.emitter.trigger('closing', evt)
      this.status = 'closing'
    }
    onClose(evt){
      this.emitter.trigger('close', evt)
      this.status = 'close'
      // 心跳重连
      this.heartConnect()
    }
    heartConnect(){
      const that = this
      const { options, timer, count } = this
      const { heart, limit } = options
      // 存在定时器
      if(timer) return
      // 超过次数结束重连
      if(limit > 0 && count > limit){
        this.count = 0
        return
      }
      // 定时器
      this.timer = setTimeout(function(){
        that.count ++
        that.reconnect().catch(e => {
          clearInterval(that.timer)
          that.timer = null
        })
      },heart * 1000)
    }
    // 销毁
    destroy(){
      const { ws, status, onConnecting, onOpen, onMessage, onClosing, onClose } = this
      if(ws){
        // 断开连接
        if(status === 'open') this.disconnect()
        // 解绑事件
        ws.removeEventListener('connecting', onConnecting)
        ws.removeEventListener('open', onOpen)
        ws.removeEventListener('message', onMessage)
        ws.removeEventListener('closing', onClosing)
        ws.removeEventListener('close', onClose)
      }
      this.status = 'init'
      this.ws = null
    }
  }
```


### 错误状态

```javascript
  /**
   * 错误状态映射
   * */
  const CodeMap = new Map([
      [1000, '正常关闭'],
      [1001, '终端离开, 可能因为服务端错误, 也可能因为浏览器正从打开连接的页面跳转离开'],
      [1002, '由于协议错误而中断连接'],
      [1003, '由于接收到不允许的数据类型而断开连接'],
      [1005, '表示没有收到预期的状态码'],
      [1006, '收到状态码时连接非正常关闭'],
      [1007, '由于收到了格式不符的数据而断开连接'],
      [1008, '由于收到不符合约定的数据而断开连接. 这是一个通用状态码, 用于不适合使用 1003 和 1009 状态码的场景'],
      [1009, '由于收到过大的数据帧而断开连接'],
      [1010, '客户端期望服务器商定一个或多个拓展, 但服务器没有处理, 因此客户端断开连接'],
      [1011, '客户端由于遇到没有预料的情况阻止其完成请求, 因此服务端断开连接'],
      [1012, '服务器由于重启而断开连接'],
      [1013, '服务器由于临时原因断开连接, 如服务器过载因此断开一部分客户端连接'],
      [1014, '服务器充当网关或代理，并收到来自服务器的无效响应'],
      [1015, '由于无法完成 TLS 握手而关闭']
  ])
```

### 前后台切换

```javascript
  document.addEventListener("visibilitychange",function(){
    const hide = document.visibilityState === "hidden"
    console.log('是否隐藏', hide)
  })
```

