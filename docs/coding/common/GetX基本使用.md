---
title: GetX基本使用
createTime: 2025/07/17 18:06:14
tags:
  - Flutter
  - GetX
  - 状态管理
---

# GetX基本使用

教程出处：[B站IT营大地老师：Getx教程_Flutter+Getx系列实战教程](https://www.bilibili.com/video/BV17m4y1a7zJ/)

插件官网：[https://pub.dev/packages/get](https://pub.dev/packages/get)

中文文档：[https://github.com/jonataslaw/getx/blob/master/README.zh-cn.md](https://github.com/jonataslaw/getx/blob/master/README.zh-cn.md)

GetX是Flutter上一个轻量且强大的解决方案，提供了高性能的状态管理、只能依赖注入和便捷路由管理。

* Get有3个基本原则：

  ① 性能：GetX专注于性能和最小资源消耗。GetX打包后的apk占用和大小与运行时的内存占用跟其他状态管理插件不相上下。

  ② 效率：GetX的语法非常简洁，并保持了极高的性能，能极大缩短开发时长。

  ③ 结构：GetX可以将界面、逻依赖和路由完全解耦，用起来更清爽，逻辑更清晰，代码更容易维护。

* GetX虽然功能丰富，但却并不臃肿，相反它很轻量，能做到按需编译。如果你只使用状态管理，只有状态管理模块会被编译，其他没用到的东西都不会被编译到你的代码中。它拥有众多的功能，这些功能都在独立的容器中，只有在使用后才会启动。

* GetX有一个庞大的生态系统，能够在Android、iOS、Web、Mac、Linux、Windows和服务器上用同样的代码运行。通过GetServer可以在后端完全重用前端写得代码。

使用GetX需要构建返回一个`MaterialApp`的根组件：

```dart
@override
Widget build(BuildContext context) {
  return GetMaterialApp(
    title: 'GetX Demo',
    theme: ThemeData(primarySwatch: Colors.blue),
    debugShowCheckedModeBanner: false,
    initialRoute: '/',
    defaultTransition: AppPage.defaultTransition, // 配置所有路由的默认过渡动画
    getPages: AppPage.routes,
    home: Home(),
  );
}
```

## 1、GetX中的Dialog（弹窗）

使用GetX提供的Dialog主要可以与组件的上下文（context）解耦，不再依赖于组件上下文，参数更加灵活。同时，使用GetX也可以很方便的进行主题切换。

* 默认弹窗基本使用

  ```dart
  // 基础使用参数（详细参数参见GetX文档或方法参数列表）
  Get.defaultDialog(title: "弹窗标题", middleText: "提示信息", confirm: Widget, cancel: Widget)
  ```

  基础样式：

  **![image-20250716175528382](/images/image-20250716175528382.png)**
  
* 关闭弹窗获取返回结果

  ```dart
  Get.back(result: T, closeOverlays: false, canPop: true, id: int);
  ```

  所有参数都是非必填，一般使用result携带所需返回数据即可，其余参数见名知意。

* 蛇形横幅弹窗

  ```dart
  // 简单使用
  Get.snackbar("标题", "提示信息", duration: const Duration(seconds: 2), snackPosition: SnackPosition.BOTTOM);
  ```

  标题和提示信息为必填项，其余参数见名知意。其中`SnackPosition`枚举只有`BOTTOM`和`TOP`两个选项。

  基础样式：

  **![image-20250716180616423](/images/image-20250716180616423.png)**

  从配置的方向缓慢滑出，到达持续配置的持续时间（duration）后，原路返回直至消失。

* 底部弹出表格

  ```dart
  // 简单使用
  Get.bottomSheet(Widget)
  ```

  如上，可直接放置一个组件在内即可，其余参数可选且见名知意。

  基础样式：

  **![image-20250716181337109](/images/image-20250716181337109.png)**

  触发时从底部缓慢滑出，运行`Get.back()`后缓慢原路返回。

* 修改主题

  ```dart
  // 修改主题
  Get.changeTheme(ThemeData theme);
  
  // 判断是否为夜间模式
  Get.isDarkMode;
  ```

  通常情况下，`theme`参数可以通过`ThemeData.light()`或`ThemeData.dark()`获取，从而直接修改为夜间/日间模式。

  在某些地方，可以通过`Get.isDarkMode`配合三元表达式，实现昼夜之间的样式自动切换。

GetX弹窗和简单主题切换结合使用样例：

```dart
/// GetX弹窗和主题切换演示
/// 核心设计要求与context解耦
class GetXDialogThemeDemo extends StatelessWidget {
  const GetXDialogThemeDemo({super.key});

  void _alertDialog(context) async {
    var result = await showDialog(
      barrierDismissible: false, // 表示点击灰色背景的时候是否小时弹出框
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("提示信息"),
          content: const Text("您确定要删除吗？"),
          actions: [
            TextButton(
              onPressed: () {
                print("OK");
                Navigator.of(context).pop("确定"); // 点击按钮让AlertDialog消失
              },
              child: const Text("确定"),
            ),
            TextButton(
              onPressed: () {
                print("cancel");
                Navigator.of(context).pop("取消");
              },
              child: const Text("取消"),
            ),
          ],
        );
      },
    );
    print(result);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("GetX弹窗和主题切换演示"),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () => _alertDialog(context),
              child: const Text("Flutter默认的Dialog"),
            ),
            ElevatedButton(
              onPressed: () {
                Get.defaultDialog(
                  title: "弹窗标题",
                  middleText: "提示信息",
                  confirm: ElevatedButton(
                    onPressed: () {
                      print("确定");
                      // Navigator.of(context).pop("OK");
                      Get.back(result: "OK");
                    },
                    child: const Text("确定"),
                  ),
                  cancel: ElevatedButton(
                    onPressed: () {
                      print("取消");
                      Get.back(result: "cancel");
                    },
                    child: const Text("取消"),
                  ),
                );
              },
              child: const Text("GetX default dialog"),
            ),
            ElevatedButton(
              onPressed: () {
                Get.snackbar("注意", "你还没有登录", duration: const Duration(seconds: 2), snackPosition: SnackPosition.BOTTOM);
              },
              child: const Text("GetX snackbar"),
            ),
            ElevatedButton(
              onPressed: () {
                Get.bottomSheet(Container(
                  color: Get.isDarkMode ? Colors.black26 : Colors.white,
                  height: 200,
                  child: Column(
                    children: [
                      ListTile(
                        leading: Icon(
                          Get.isDarkMode ? Icons.wb_sunny_outlined : Icons.wb_sunny,
                          color: Get.isDarkMode ? Colors.white : Colors.black87,
                        ),
                        title: Text("日间模式"),
                        onTap: () {
                          Get.changeTheme(ThemeData.light());
                          Get.back();
                        },
                      ),
                      ListTile(
                        leading: Icon(
                          Get.isDarkMode ? Icons.dark_mode_outlined : Icons.dark_mode,
                          color: Get.isDarkMode ? Colors.white : Colors.black87,
                        ),
                        title: Text("夜间模式"),
                        onTap: () {
                          Get.changeTheme(ThemeData.dark());
                          Get.back();
                        },
                      ),
                    ],
                  ),
                ));
              },
              child: const Text("GetX bottom sheet switch theme"),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 2、GetX路由管理

GetX路由管理的核心设计也是与context解耦。

配置路由：
```dart
GetPage(name: "/路由名称", page: () => const 路由页面Widget(), transition: Transition枚举配置过渡动画, middlewares: [...中间件]);
```
以上只是列举了一些常用的参数，详细参数参见文档，这里的过渡动画优先级高于`GetMaterialApp`中的`defaultTransition`，对于路由的操作，以下是一些常用方法：

* `Get.to()`：实现普通路由的跳转，参数为页面路由名称或页面Widget。

* `Get.toNamed()`：实现命名路由的跳转，参数为路由名称。

* `Get.back()`：返回上一个路由。

* `Get.off()`：关闭当前路由，并跳转到指定页面，参数为页面路由名称或页面Widget。

* `Get.offAll()`：返回根路由。

关于中间件：中间件，即页面跳转前/后要做的一些事情，一般用于判断是否登录，未登录跳转到登录页等场景。GetX路由管理中的中间件通过`GetMiddleware`实现，需要自定义时，只需继承该类并按需重写对应方法即可，其包含了以下方法，分别对应不同的场景。其属性`priority`可根据需求自定义配置中间件优先级。

```dart
class GetMiddleware implements _RouteMiddleware {
  @override
  int? priority = 0;

  GetMiddleware({this.priority});

  @override
  RouteSettings? redirect(String? route) => null;

  @override
  GetPage? onPageCalled(GetPage? page) => page;

  @override
  List<Bindings>? onBindingsStart(List<Bindings>? bindings) => bindings;

  @override
  GetPageBuilder? onPageBuildStart(GetPageBuilder? page) => page;

  @override
  Widget onPageBuilt(Widget page) => page;

  @override
  void onPageDispose() {}

  @override
  Future<GetNavConfig?> redirectDelegate(GetNavConfig route) =>
      SynchronousFuture(route);
}
```

## 3、状态管理

在GetX中，可以通过定义响应式变量来实现状态的更新，当响应式变量只被更新时，依赖该变量的Widget都会重新构建。通过使用GetX的状态管理，你甚至可以不使用`StatefulWidget`，只需要包裹使用响应式变量的Widget即可，大大节约了性能。

定义响应式变量的方式（以定义一个int类型的响应式变量为例）：

```dart
final _counter = 0.obs; // 使用最为广泛
final _counter = RxInt(0);
final _counter = Rx<int>(0);
```

更新变量：

```dart
_counter.value++;
_counter.value = 10;
```

自定义对象响应式使用注意事项：

* 如果只是对象的几个属性需要响应式，直接在定义对象时定义响应式变量即可；

* 如果整个对象需要响应式，新建对象时不要使用new关键字，直接`对象名称(参数列表)`即可，然后修改属性时，修改后需要将整个对象赋值回去（例，`obj.value.xxx=newValue; obj.value = obj.value`），可见，响应式定义的是变量名，而不是对象本身。

使用StatelessWidget实现Flutter项目初始化时默认的计数器Demo：

```dart
class GetXStateManageCounterDemo extends StatelessWidget {
  GetXStateManageCounterDemo({super.key});

  // 1.定义响应式变量
  final _counter = 0.obs;
  // final _counter = RxInt(0);
  // final _counter = Rx<int>(0);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('GetX状态管理演示：响应式变量')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('GetX状态管理自增counter：'),
            // 3.使用Obx包裹响应式变量涉及组件
            Obx(() => Text('$_counter', style: Theme.of(context).textTheme.headlineLarge)),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        // 2. 修改响应式变量的value属性
        onPressed: () => _counter.value++,
        tooltip: '响应式自增',
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

## 4、依赖管理（Controller）

在浏览了很多路由的情况下，需要获取控制器中遗留数据，可以通过GetX直接获取，不需要任何额外的依赖关系，从而实现多个页面之间的状态（数据）共享。

1. 定义控制器：在控制器类中定义好响应式数据以及修改响应式数据的函数；
2. 创建控制器：在页面1中通过`Get.put()`函数创建控制器，并通过该函数返回的控制器使用控制器中的数据；
3. 页面2中通过`Get.find()`函数获取控制器，并使用控制器中的数据。

同样还是Flutter默认创建的计数器项目，要求使用Get重写一个“计数器Plus版”，实现：
* 每次点击都能改变状态
* 在不同页面之间切换
* 在不同页面之间共享
* 将业务逻辑与界面分离

```dart
// 1.定义控制器
class CounterController extends GetxController {

  var count = 0.obs;

  void incr() {
    count++;
    update();
  }
  void decr() {
    count--;
    update();
  }
}

// 2.页面1：创建控制器、使用和更新控制器中的数据
class GetXStateManageCounterPlusDemo extends StatefulWidget {
  const GetXStateManageCounterPlusDemo({super.key});

  @override
  State createState() => _GetXStateManageCounterPlusDemoState();
}

class _GetXStateManageCounterPlusDemoState extends State<GetXStateManageCounterPlusDemo> {
  CounterController counterController = Get.put(CounterController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('GetX状态管理演示：Controller')),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Obx(() => Text('${counterController.count}', style: Theme.of(context).textTheme.headlineLarge)),
          ElevatedButton(onPressed: () => counterController.incr(), child: const Text('数值+1')),
          ElevatedButton(onPressed: () => Get.to(CounterAntherPage()), child: const Text('另一个页面')),
        ],
      ),
    );
  }
}

// 3.页面2：使用和更新数据
class CounterAntherPage extends StatelessWidget {
  CounterAntherPage({super.key});

  final CounterController counterController = Get.find();
  // final counterController = Get.find<CounterController>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('GetX跨页面共享数据counter')),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Obx(() => Text('${counterController.count}', style: Theme.of(context).textTheme.headlineLarge)),
          ElevatedButton(onPressed: () => counterController.decr(), child: const Text('数值-1')),
          ElevatedButton(onPressed: () => Get.back(), child: const Text('返回页面')),
        ],
      ),
    );
  }
}
```

最终效果为在页面1更新数据后，切换到页面2中，页面2的数值也会跟着更新，页面2中更新了数据，页面1中的数值也会跟着更新。

## 5、全局状态管理

再使用GetX状态管理器时，每次都需要手动实例化一个控制器，这样每个页面都需要实例化一次，而`Binding`就是为了解决这个问题。`Binding`可以在项目初始化的时候把所有需要进行状态管理的控制器进行统一初始化。

GetX多种创建控制器的方法：
* `Get.put()`：不使用控制器实例也会被创建；
* `Get.lazyPut()`：懒加载方式创建实例，只有在使用时才创建；
* `Get.putAsync()`：`Get.put()`的异步版本；
* `Get.create()`：每次使用都会创建一个新的实例。

Binding使用步骤：
1. 声明控制器
  ```dart
  import 'package:get/get.dart';

  class BindingHomeController extends GetxController {
    var count - 0.obs;
    void increment() {
      count++;
    }
  }

  class BindingMyController extends GetxController {
    var count = 0.obs;
    void increment() {
      count++;
    }
  }
  ```
  ```dart
  import 'package:get/get.dart';
  
  // 所有控制器绑定
  class AllControllerBinding implements Bindings {
    @override
    void dependencies() {
      Get.lazyPut<BindingHomeController>(() => BindingHomeController());
      Get.lazyPut<BindingMyController>(() => BindingMyController());
    }
  }
  ```
2. 在项目启动时进行初始化绑定
  ```dart
  return GetMaterialApp(
    title: "GetX",
    initialBinding: AllControllerBinding(),
    home: Xxx(),
  );
  ```
3. 在页面中使用状态管理
  ```dart
  Obx(() => Text(
      "计数器的值为${Get.find<BindingMyController>().count}",
      style: Theme.of(context).textTheme.headlineLarge
    )
  ),
  SizedBox(height: 20),
  ElevatedButton(
    onPressed: () => Get.find<BindingMyController>().increment(),
    child: const Text('数值+1'),
  ),
  ```

## 6、GetView介绍

`GetView`是对已注册的`Controller`有一个名为`controller`的getter的`StatelessWidget`，如果只有单个控制器作为以来项，那么就可以使用`GetView`，从而避免了`Get.find()`的使用。

`GetView`的使用方法非常简单，只要将视图层继承自`GetView`并传入需要注册的控制器并`Get.put()`即可：
1. 定义一个`ShopController`（因为只有ShopPage这个页面使用，所以直接命名为ShopController）；
2. 定义一个`GetView`的页面；
  ```dart
  class ShopPage extends GetView<ShopController> {
    const Shop({super.key});
    @override
    Widget build(BuildContext context) {
      // 如果第一次使用，还需要put
      Get.put(ShopController());

      return Scaffold(
        appBar: AppBar(title: const Text('GetView')),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Obx(() => Text('${controller.count}', style: Theme.of(context).textTheme.headlineLarge)),
            ElevatedButton(onPressed: () => controller.increment(), child: const Text('数值+1')),
          ],
        ),
      );
    }
  }
  ```
3. 也可以结合Binding和路由使用，实现自动注入，从而省略`Get.put()`。
```dart
class ShopBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ShopController>(() => ShopController());
  }
}

// 在路由中配置Binding
GetPage(
  name: "/shop",
  page: () => ShopPage(),
  binding: ShopBinding(),
  middlewares: [ /** ... */],
);
```

## 7、GetxController生命周期

`GetxController`中几个常见的生命周期函数：

```dart
@override
void onInit() {
  // TODO: 控制器挂载时触发
  super.onInit();
}
@override
void onReady() {
  // TODO: 控制器页面加载完成后触发
  super.onReady();
}
@override
void onClose() {
  // TODO: 控制器页面销毁时触发
  // 只有绑定到路由上时，路由销毁才会触发，全局控制器不会销毁
  super.onClose();
}
@override
// TODO: implement onDelete
InternalFinalCallback<void> get onDelete => super.onDelete;
@override
// TODO: implement onStart
InternalFinalCallback<void> get onStart => super.onStart;
```

## 8、Getx国际化多语言配置

使用系统自带的MaterialApp来实现国际化配置，需要进行很多配置，而且需要手动去依赖第三方组件，而使用`GetX
`来实现国际化配置，只需要一行代码即可实现切换。

1. 定义一个语言包
  ```dart
  import 'package:get/get.dart';

  class Messages extends Translations {
    @override
    Map<String, Map<String, String>> get keys => {
      'en_US': {
        'hello': 'Hello',
      },
      'zh_CN': {
        'hello': '你好',
      },
    };
  }
  ```
2. 应用程序入口配置
  ```dart
  return GetMaterialApp(
    translations: Messages(), // 国际化配置文件
    locale: const Locale('zh', 'CN'), // 设置默认语言，不设值的话为系统当前语言
    falllbackLocale: const Locale('en', 'US'), // 添加一个回调语言选项，以备上面指定语言的翻译不存在时作为兜底
  );
  ```
3. 调用语言包
    只要将`.tr`追加到指定的键上，就会使用`Get.locale`和`Get.fallbackLocale`的当前值进行翻译。
  ```dart
  Text('hello'.tr);
  ```
4. 改变语言
    调用`Get.updateLocale(locale)`来更新语言环境，然后翻译会自动使用新的locale。
  ```dart
  var locale = Locale('en', 'US');
  Get.updateLocale(locale);
  ```

## 9、GetUtils工具类

`GetUtils`是`GetX`提供的一些常用的工具类库，包括判断值是否为空、是否为数字、是否是视频、图片、音频、PPT、Word、APK、邮箱、手机号码、日期、MD4、SHA1等。以下是它的大部分方法（方法功能见名知意即可）：

**![image-20250717175913335](/images/image-20250717175913335.png)**
