---
title: Flutter学习
tags:
  - Flutter
categories:
  - 前端
abbrlink: 52726
date: 2019-09-25 20:03:04
---

#### 环境搭建

-----

##### mac环境变量

```bash
    open ~/.bash_profile    //打开环境变量配置文件
    source ~/.bash_profile  //编译变量配置
    
    //以下为配置数据
    [ -r ~/.bashrc ] && source ~/.bashrc //git 分支显示
    export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin/

    export PATH='flutter路径'/flutter/bin:$PATH
    export Android_HOME="安卓sdk路径"  
    export PATH=${PATH}:${Android_HOME}/tools
    export PATH=${PATH}:${Android_HOME}/platform-tools
    export PUB_HOSTED_URL=https://pub.flutter-io.cn
    export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
```

##### 终端命令

```
    //Flutter下载
    git clone -b master https://github.com/flutter/flutter.git
    ./flutter/bin/flutter --version

    //Flutter sdk为下载目录、Dart sdk目录为flutter -> bin -> cache -> dart-sdk下

    //环境监测、按照提示安装(brew install 会提示不要在根目录安装，在项目目录安装即可)
    flutter doctor

    //brew 最新版安装
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

```

##### VScode插件

* [Flutter](https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter) 
* [Dart](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code)

##### Android Stuido

首选项 => 插件 搜索Flutter与Dart
![flutter-Android-plugins](https://cdn.nikai.site/flutter-android-plugins.jpg?imageslim)

首选项 => 语言与框架 => Flutter或Dart设置sdk路径 
![flutter-Android-set](https://cdn.nikai.site/flutter-android-set.jpg?imageslim)

-----

##### 安装完成
![flutter-success](https://cdn.nikai.site/flutter-success.jpg?imageslim)

#### 运行命令 flutter run

#### mac真机调试iOS

###### xcode设置添加账户
![flutter-run-ios-account](https://cdn.nikai.site/flutter-run-ios-account.jpg?imageslim)

###### 项目设置Bundle identifier、选择添加的账户
![flutter-run-ios-siging](https://cdn.nikai.site/flutter-run-ios-siging.jpg?imageslim)

marked: mac 10.14.6 & xcode 10.3 & Android studio 3.5 (19.09.05)

#### icon

##### pubspec.yaml(引入)
最外层添加fonts文件夹(nkApp/fonts/iconfont.ttf),使用阿里图库的字体图标

```
    fonts:
    - family: iconfont
      fonts:
        - asset: fonts/iconfont.ttf
```

##### 定义

```dart
    import 'package:flutter/cupertino.dart';

    Map weatherIconList = {
        'sun': 0xe603,          // 晴天
        'cloudy': 0xe605,       // 多云
        'cloud': 0xe605,        // 云
        ···
    };

    // 获取天气图标函数
    IconData weatherIcon(String key) => IconData(weatherIconList[key], fontFamily: "iconfont");
```

##### 使用

```dart
    import 'package:*/**/icon.dart';

    ...
    @override
    Widget build(BuildContext context) {
        return Icon(weatherIcon('sun'));
    }
```

#### dio(请求)

##### pubspec.yaml(引入)

```
    dependencies:
        flutter:
            sdk: flutter
        dio: ^3.0.0
```

##### 定义

```dart
    import 'package:dio/dio.dart';

    // 默认配置
    BaseOptions options = new BaseOptions(
        baseUrl,
        connectTimeout: 5000,
        receiveTimeout: 3000,
        contentType: Headers.formUrlEncodedContentType, 
        responseType: ResponseType.json,
    );

    Dio dio = Dio(options)..interceptors.add(LogInterceptor());

```

##### 使用

```dart
    import 'package:dio/dio.dart';
    import 'package:toast/toast.dart';
    import 'package:*/**/dio.dart';
    import 'package:*/**/music_banner.dart';

    ...
    class FindState extends State<Find> {
        List<Banners> banner = [];

        @override
        void initState() {
            super.initState();
            initData();
        }

        // 初始化页面数据
        void initData() async {
            try {
                Response res = await dio.get('/banner');
                setState(() {
                    banner = MusicBanner.fromJson(res.data).banners;
                });
            } catch (e) {
                Toast.show("网络请求失败", context,
                    duration: Toast.LENGTH_SHORT, gravity: Toast.CENTER);
            }
        }
```

#### json_serializable

##### pubspec.yaml

```
    dependencies:
        flutter:
            sdk: flutter
        json_annotation: ^3.0.0

    dev_dependencies:
        flutter_test:
            sdk: flutter
        build_runner: ^1.0.0
        json_serializable: ^3.2.0
```

将返回的数据使用[json2dart](https://caijinglong.github.io/json2dart/index_ch.html)处理，

使用命令构建***.g.dart文件

```bash
    flutter packages pub run build_runner build
```

使用命令自动构建***.g.dart文件

```bash
    flutter packages pub run build_runner watch
```

调用***类的fromJson方法转换为Dart Modal

#### flutter-redux(主题随机切换)

##### ReduxState

```dart
    import 'dart:math';
    import 'package:flutter/rendering.dart';
    import 'package:*/**/themeColor.dart';

    class ReduxState {
        Color theme;
        ReduxState.initTheme() : theme = themeColor[Random().nextInt(themeColor.length)];
    }

```

##### Action

```dart
    //定义action
    enum Action { ThemeChange }

```

##### Reducer

```dart
    import 'dart:math';
    import 'package:*/**/themeColor.dart';
    import 'package:*/**/action.dart';
    import 'package:*/**/ReduxState.dart';

    //定义reducer
    ReduxState reducer(ReduxState state, action) {
        switch (action) {
            case Action.ThemeChange:
            print(Random());
            state.theme = themeColor[Random().nextInt(themeColor.length)];
            break;
        }
        return state;
    }
```

##### 绑定至App

```dart

    import 'package:flutter/material.dart';
    import 'package:flutter_redux/flutter_redux.dart';
    import 'package:redux/redux.dart';
    import "package:*/view/home/detail.dart";
    import 'package:*/**/ReduxState.dart';
    import 'package:*/**/reducer.dart';

    void main(){
        final store = Store<ReduxState>(
            reducer,
            initialState: ReduxState.initTheme()
        );
        runApp(NKApp(store));
    }

    class NkApp extends StatelessWidget {
        final Store<ReduxState> store;
        NkApp(this.store);

        @override
        Widget build(BuildContext context) {
            return StoreProvider(
                store: store,
                child: StoreBuilder<ReduxState>(
                    builder: (BuildContext context, Store<ReduxState> store){
                        return MaterialApp(
                            title: '测试',
                            initialRoute: "init",
                            theme: ThemeData(
                                platform: TargetPlatform.iOS,
                                primarySwatch: store.state.theme, //主题颜色设置
                                splashColor: Colors.transparent, //水波纹样式
                                highlightColor: Colors.transparent //点击高亮颜色
                            ),
                            routes:{
                                "init": (context) => InitPage(),
                                ...
                            }
                        );
                    }
                )
            );
        }
        ...

```

##### Dispatch

```dart
    import 'package:flutter/material.dart';
    import 'package:flutter_redux/flutter_redux.dart';
    import 'package:*/redux/ReduxState.dart';
    import 'package:*/redux/action.dart' as prefix0;
    ...

    floatingActionButton: StoreConnector<ReduxState, VoidCallback>(
        converter: (store) {
          return () => store.dispatch(prefix0.Action.ThemeChange);
        },
        builder: (context, callback) {
          return FloatingActionButton(
            onPressed: callback,
            child: Icon(Icons.add),
          );
        },
    ),
    ...

```