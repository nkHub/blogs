---
title: Anroid初始学习
tags:
  - Android
categories:
  - 前端
abbrlink: 57043
date: 2019-09-26 11:53:50
password: nksite
abstract: 有东西被加密了, 请输入密码查看.
message: 您好, 这里需要密码.
theme: wave
wrong_pass_message: 抱歉, 这个密码看着不太对, 请再试试.
wrong_hash_message: 抱歉, 这个文章不能被校验, 不过您还是能看看解密后的内容.
---

#### Java

##### 1. 数组：

```java
  System.arraycopy( 数据源数组 , 数据源数组起始位置 , 替换数组 , 替换数组起始位置 , 替换个数);
  Arrays.sort(); //数组排序
```

##### 2.字符串：

<p>a ). 字符串1.equals(字符串2),Java内字符串为对象;</p>
<p>b ). 对象池：直接等号赋值的数据则会在对象池中创建,如其他数据与它相同则会直接引用，所以直接赋值的数据使用等号是可以判断的。</p>
<p>c ). 构造方法声明实例化字符串，不会放入对象池中,可使用.intern()入池。不推荐使用构造方法实例化字符串。</p>
<p>d ). 字符串修改会产生大量垃圾数据，不建议修改。</p>

##### 3. this关键字：

<p>a ). this.name调用本函数属性</p>
<p>b ). 构造函数内第一行使用this()调用构造函数</p>
<p>c ). super继承时使用，调用其父类型，同样super()必须在构造函数第一行</p>

##### 4. 多态性：

<p>1 ) 方法的多态性</p>
<p>&nbsp;&nbsp;&nbsp;i. 方法的重载：方法名，相同参数类型与个数返回值不同</p>
<p>&nbsp;&nbsp;&nbsp;ii.方法的覆写：只在继承时使用,方法名相同参数类型与个数返回值都相同 , 修饰符升级<br>&nbsp;&nbsp;&nbsp;private < default(friend) < public</p>

<p>2 ) 对象的多态性</p>
<p>&nbsp;&nbsp;&nbsp;i. 对象的向上转型：强制转换为父类型</p>
<p>&nbsp;&nbsp;&nbsp;ii.对象的向下转型：强制转换为子类型 , 转型前必须向上转型，并且先使用instanceof判断是否是其实例（不推荐）</p>

##### 5. final 与 static：

<p>a ) final常量无法被修改,final类无法被继承</p>
<p>b ) static只能调用static属性与方法，单独存放内存区域，被修改时所有引用都将被修改；在内部类、内部接口和内部抽象类使用static则变成外部类、外部接口和外部抽象类；使用
“new 类.内部类” 方式调用，其他相同。</p>


##### 6. 抽象类abstract：

<p>a ) 抽象类无法实例化对象，除了包含抽象方法，其他与普通类相同</p>

```java
    abstract class 类名 {

    }
```

<p>b ) 抽象子类必须实例化抽象方法</p>
<p>c ) 不包含抽象方法的抽象类也一样无法实例化对象</p>


##### 7. 接口：

<p>a ) 接口包含抽象函数与全局常量，其中抽象方法的 public 与 abstract 可省略(抽象类的抽象方法则不可以，否则默认 default 权限)</p>

```java
    interface 接口名称 {
        public static final 全局常量 = 值;
        void 抽象方法名称();
    }
```

<p>b ) class 普通类 extends 父类 implements 接口1,接口2...</p>
<p>d ) 接口 -> 抽象类 -> 类 -> 对象，其中抽象类是接口与类的过渡</p>


##### 8. Object类：

<p>a ) 所有java类继承于Object类</p>
<p>b ) toString方法:打印对象时默认调用toString方法，并且默认返回对象的编码信息</p>
<p>d ) equals方法:对象比较接受Object对象</p>

##### 9. Exception异常：

<p>a ) public 方法名() throws Exception1, Exception2{} 调用时必须做异常处理（RuntimeException除外可以选择处理）</p>
<p>b ) 三种方式</p>

```java
    try{
        ...
    }catch(Exception e){
        ...
    }

    try{
        ...
    }catch(Exception e){
        ...
    }finally{
        ...
    }

    try{ //不推荐
        ...
    }finally{
        ...
    }
```

<p>c ) 继承Exception可自定义异常</p>


##### 10. 泛型：

<p>a ) 动态定义数据类型</p>

```java
    class 类名称<标识符1,标识符2..>{
        类名称<标识符1,标识符2..> 对象名称 = new 类名称<标识符1,标识符2..>();
    }
```

<p>b ) 接受泛型类的方法，可使用 ? 为动态数据类型</p>

```java
    ? Extends 设置必须为设定类型的子类
    ? Super 设置必须为设定类型的父类
```

<p>d ) 泛型方法 (不推荐使用)</p>

```java
    public static <T> T test(T ... data){
        return data;
    }
```

##### 11. 枚举：

```java
    enum 枚举名称{
        枚举值1,枚举值2,枚举值3...
    }
```

<p>a ) 使用 枚举名称.values()获取对象数组</p>

##### 12. Annotation(注解)：

```java
    @Override         //方法复写
    @Deprecated       //方法过期
    @SuppressWarnings //压制警告
```

#### Activity

##### 1.创建活动

清单文件manifest.xml的Application节点下添加activity节点，创建layout界面

```xml
  //清单文件manifest.xml
  <activity
    Android:name=".module.second.second"
    Android:label="活动"> //toolbar页面标题
    <intent-filter> //意图过滤
      <action Android:name="com.test.activitytest.ACTION_START" /> //action
      <category Android:name="Android.intent.category.DEFAULT" />
    </intent-filter>
  </activity>
```
```java
  ...
  //方式一（常用）
  Intent intent = new Intent(context,class);
  //方式二
  Intent intent = new Intent(action);
  //action来源于manifest.xml清单文件下的activity节点的action参数
  intent.putExtra(key,value);//携带参数，value包含多种类型
  startActivity(intent);
  ...
  //期待返回值
  startActivityForResult(intent,requestCode);
  //上个活动返回值
  protected void onActivityResult(int requestCode,int resultCode,Intent data){
    switch(requestCode){
      case 1:
        if(resultCode == RESULT_OK){
          String returnedData = data.getStringExtra(name);
        }
      break;
      default:
    }
  }

  //关闭活动
  activity.finish();


```

##### 2.生命周期

```java
  public class MainAcivity extends BaseActivity{
    //首次创建
    @Override
    protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      setContentView(resourceId); //设置界面资源
    }
    //活动销毁后重新创建
    @Override
    protected void onRestart() {
      super.onRestart();
    }
    //开始可见
    @Override
    protected void onStart() {
      super.onStart();
    }
    //活动可见
    @Override
    protected void onResume() {
      super.onResume();
    }
    //活动保留不可见
    @Override
    protected void onPause() {
      super.onPause();
    }
    //活动关闭
    @Override
    protected void onStop() {
      super.onStop();
    }
    //活动销毁
    @Override
    protected void onDestroy() {
      super.onDestroy();
    }
  }
```

