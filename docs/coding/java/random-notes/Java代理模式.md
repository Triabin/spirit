---
title: Java代理模式
createTime: 2024/11/25 15:01:15
tags:
  - Java
  - 代理
  - 后端
---
# Java代理模式

文章原文：[JavaGuide](https://javaguide.cn/java/basis/proxy.html)

代理模式是一种比较好理解的设计模式。简单来说就是 我们使用代理对象来代替对真实对象(real object)的访问，这样就可以在不修改原目标对象的前提下，提供额外的功能操作，扩展目标对象的功能。代理模式的主要作用是扩展目标对象的功能，比如说在目标对象的某个方法执行前后你可以增加一些自定义的操作。

## 1. 静态代理

静态代理中，对目标对象的每个方法的增强都是手动完成的，非常不灵活，比如接口一旦新增加方法，目标对象和代理对象都要进行修改，而且很麻烦，需要对每个目标类都单独写一个代理类。实际应用场景非常非常少，日常开发几乎看不到使用静态代理的场景。**从JVM层面来说，静态代理在编译时就将接口、实现类、代理类这些都变成了一个个实际的class文件**。

静态代理实现步骤：

* 定义一个接口及其实现类

  ```java
  package com.triabin.ideasy_server.proxy.static_proxy;
  
  /**
   * 类描述：发送接口
   *
   * @author Triabin
   * @date 2024-08-11 13:42:36
   */
  public interface ISmsService {
      String send(String msg);
  }
  ```

  ```java
  package com.triabin.ideasy_server.proxy.static_proxy;
  
  /**
   * 类描述：发送接口实现类
   *
   * @author Triabin
   * @date 2024-08-11 13:43:36
   */
  public class SmsServiceImpl implements ISmsService{
      @Override
      public String send(String msg) {
          System.out.println("Send Message: " + msg);
          return msg;
      }
  }
  ```

* 创建一个代理类同样实现这个接口，将目标对象注入进代理类，然后在代理类的对应方法调用目标类中的对应方法。这样的话，我们就可以通过代理类屏蔽对目标对象的访问，并且可以在目标方法执行前后做一些自己想做的事情。

  ```java
  package com.triabin.ideasy_server.proxy.static_proxy;
  
  /**
   * 类描述：发送接口代理实现类
   *
   * @author Triabin
   * @date 2024-08-11 13:44:43
   */
  public class ProxySmsServiceImpl implements ISmsService{
  
      private final ISmsService smsService;
  
      public ProxySmsServiceImpl(ISmsService smsService) {
          this.smsService = smsService;
      }
  
      @Override
      public String send(String msg) {
          // 调用方法之前添加操作
          System.out.println("Before Method send()");
          String message = smsService.send(msg);
          // 调用方法之后添加操作
          System.out.println("After Method send()");
          return message;
      }
  }
  ```

* 使用

  ```java
  @Test
  public void testProxy() {
      ISmsService smsService = new SmsServiceImpl();
      ISmsService proxySmsService = new ProxySmsServiceImpl(smsService);
      proxySmsService.send("Java");
  }
  ```

  ```powershell
  Before Method send()
  Send Message: Java
  After Method send()
  
  Process finished with exit code 0
  ```


## 2. 动态代理

相比于静态代理来说，动态代理更加灵活。我们不需要针对每个目标类都单独创建一个代理类，并且也不需要我们必须实现接口，我们可以直接代理实现类( *CGLIB 动态代理机制*)。**从JVM角度来说，动态代理是在运行时动态生成类字节码，并加载到JVM中的。**

动态代理在我们日常开发中使用的相对较少，但是在框架中的几乎是必用的一门技术，学会后，对于理解和学习各种框架原理非常有帮助。

在Java中，实现动态代理的方式有很多种，比如JDK动态代理和CGLIB动态代理。

### 2.1 JDK动态代理

**JDK动态代理机制中，`InvocationHandler`接口和`Proxy`类是核心**，`Proxy`类中使用频率最高的时`newProxyInstance()`方法，该方法用以代理对象。

```java
@CallerSensitive
public static Object newProxyInstance(ClassLoader loader,
                                      Class<?>[] interfaces,
                                      InvocationHandler h)
    throws IllegalArgumentException
{
    Objects.requireNonNull(h);

    final Class<?>[] intfs = interfaces.clone();
    final SecurityManager sm = System.getSecurityManager();
    if (sm != null) {
        checkProxyAccess(Reflection.getCallerClass(), loader, intfs);
    }

    /*
         * Look up or generate the designated proxy class.
         */
    Class<?> cl = getProxyClass0(loader, intfs);

    /*
         * Invoke its constructor with the designated invocation handler.
         */
    try {
        if (sm != null) {
            checkNewProxyPermission(Reflection.getCallerClass(), cl);
        }

        final Constructor<?> cons = cl.getConstructor(constructorParams);
        final InvocationHandler ih = h;
        if (!Modifier.isPublic(cl.getModifiers())) {
            AccessController.doPrivileged(new PrivilegedAction<Void>() {
                public Void run() {
                    cons.setAccessible(true);
                    return null;
                }
            });
        }
        return cons.newInstance(new Object[]{h});
    } catch (IllegalAccessException|InstantiationException e) {
        throw new InternalError(e.toString(), e);
    } catch (InvocationTargetException e) {
        Throwable t = e.getCause();
        if (t instanceof RuntimeException) {
            throw (RuntimeException) t;
        } else {
            throw new InternalError(t.toString(), t);
        }
    } catch (NoSuchMethodException e) {
        throw new InternalError(e.toString(), e);
    }
}
```

这个方法共有3个参数：

1. `ClassLoader loader`：被代理对象的类加载器；
2. `Class<?>[] interfaces`：被代理的类实现的一些接口（需要被代理的实现的接口）；
3. `InvocationHandler h`：代理对象自定义的实现了`InvocationHandler`接口的对象。

要实现动态代理的话，还必须需要实现`InvocationHandler` ，在其中注入被代理对象，来自定义处理逻辑。 当我们的动态代理对象调用一个方法时，这个方法的调用就会被转发到实现`InvocationHandler` 接口类的 `invoke` 方法来调用。

```java
package java.lang.reflect;

public interface InvocationHandler {
    public Object invoke(Object proxy, Method method, Object[] args)
        throws Throwable;
}
```

`invoke()`方法有3个参数：

1. `Object proxy`：动态生成的代理类；
2. `Method method`：与代理类对象调用的方法相对应；
3. `Object[] args`：当前method方法的参数。

大概流程是，**通过`Proxy`类的`newProxyInstance()`方法创建的代理对象在调用方法的时候，实际会调用到自定义实现的`InvocationHandler`接口类的`invode()`方法。** 代理添加的处理逻辑可以在`invoke()`方法中定义（增强），例如方法执行前后所需要增加的处理逻辑。

使用步骤：

* 定义并实现接口

  ```java
  package com.triabin.ideasy_server.proxy.dynamic_proxy_jdk;
  
  /**
   * 类描述：发送接口
   *
   * @author Triabin
   * @date 2024-08-11 14:05:20
   */
  public interface ISmsService {
      String send(String msg);
  }
  ```

  ```java
  package com.triabin.ideasy_server.proxy.dynamic_proxy_jdk;
  
  /**
   * 类描述：发送接口实现类
   *
   * @author Triabin
   * @date 2024-08-11 14:06:02
   */
  public class SmsServiceImpl implements ISmsService {
  
      @Override
      public String send(String msg) {
          System.out.println("Send message: " + msg);
          return msg;
      }
  }
  ```

* 定义一个JDK动态代理类（实现`InvocationHandler`接口）

  ```java
  package com.triabin.ideasy_server.proxy.dynamic_proxy_jdk;
  
  import java.lang.reflect.InvocationHandler;
  import java.lang.reflect.InvocationTargetException;
  import java.lang.reflect.Method;
  
  /**
   * 类描述：JDK动态代理类
   *
   * @author Triabin
   * @date 2024-08-11 14:08:06
   */
  public class DebugInvocationHandler implements InvocationHandler {
  
      /**
       * 代理类中的真实对象
       */
      private final Object target;
  
      public DebugInvocationHandler(Object target) {
          this.target = target;
      }
  
      @Override
      public Object invoke(Object proxy, Method method, Object[] args) throws InvocationTargetException, IllegalAccessException {
          // 调用方法之前，添加自己的操作
          System.out.println("Before method: " + method.getName());
          Object result = method.invoke(target, args);
          // 调用方法之后，添加自己的操作
          System.out.println("After method: " + method.getName());
          return result;
      }
  }
  ```

* 实现获取代理对象的工厂类

  ```java
  package com.triabin.ideasy_server.proxy.dynamic_proxy_jdk;
  
  import java.lang.reflect.Proxy;
  
  /**
   * 类描述：JDK动态代理工厂
   *
   * @author Triabin
   * @date 2024-08-11 14:13:13
   */
  public class JdkProxyFactory {
      public static Object getProxy(Object target) {
          return Proxy.newProxyInstance(
                  target.getClass().getClassLoader(), // 要代理的目标类加载器
                  target.getClass().getInterfaces(), // 代理需要实现的接口（数组）
                  new DebugInvocationHandler(target) // 代理对象对应自定义的InvocationHandler
          );
      }
  }
  ```

* 使用

  ```java
  @Test
  public void testDynamicJdkProxy() {
      ISmsService smsService = (ISmsService) JdkProxyFactory.getProxy(new SmsServiceImpl());
      smsService.send("Java");
  }
  ```

  ```powershell
  Before method: send
  Send message: Java
  After method: send
  
  Process finished with exit code 0
  ```

### 2.2 CGLIB动态代理

**JDK 动态代理有一个最致命的问题是其只能代理实现了接口的类。**

[CGLIBopen in new window](https://github.com/cglib/cglib)(*Code Generation Library*)是一个基于[ASMopen in new window](http://www.baeldung.com/java-asm)的字节码生成库，它允许我们在运行时对字节码进行修改和动态生成。**CGLIB 通过继承方式实现代理。**很多知名的开源框架都使用到了[CGLIBopen in new window](https://github.com/cglib/cglib)， 例如 Spring 中的 AOP 模块中：如果目标对象实现了接口，则默认采用 JDK 动态代理，否则采用 CGLIB 动态代理。

**在 CGLIB 动态代理机制中 `MethodInterceptor` 接口和 `Enhancer` 类是核心。**使用过程中，需要自定义`MethodInterceptor`并重写`intercept`方法，`intercept`方法用于拦截被代理的方法并添加处理逻辑（增强）。

```java
package net.sf.cglib.proxy;


public interface MethodInterceptor
extends Callback
{   
    public Object intercept(Object obj, java.lang.reflect.Method method, Object[] args,
                               MethodProxy proxy) throws Throwable;

}

```

* `Object obj`：被代理（增强）的对象；
* `java.lang.reflect.Method method`：被拦截的方法（需要增强的方法）；
* `Object[] args`：被拦截方法的参数；
* `MethodProxy proxy`：用于在`intercept`中调用原始方法。

使用步骤：

* 引入CGLIB依赖库

  ```xml
  <!-- CGLIB -->
  <dependency>
      <groupId>cglib</groupId>
      <artifactId>cglib</artifactId>
      <version>3.3.0</version>
  </dependency>
  ```

* 创建被代理对象的类

  ```java
  package com.triabin.ideasy_server.proxy.dynamic_proxy_cglib;
  
  /**
   * 类描述：CGLIB代理演示类（发送）
   *
   * @author Triabin
   * @date 2024-08-11 15:02:37
   */
  public class CglibSendService {
  
      public String send(String msg) {
          System.out.println("Send message: " + msg);
          return msg;
      }
  }
  ```

* 自定义实现`MethodInterceptor`接口（方法拦截器）

  ```java
  package com.triabin.ideasy_server.proxy.dynamic_proxy_cglib;
  
  import net.sf.cglib.proxy.MethodInterceptor;
  import net.sf.cglib.proxy.MethodProxy;
  
  import java.lang.reflect.Method;
  
  /**
   * 类描述：自定义CGLIB动态代理的方法拦截器
   *
   * @author Triabin
   * @date 2024-08-11 15:05:22
   */
  public class DebugMethodInterceptor implements MethodInterceptor {
      @Override
      public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
          //调用方法之前，我们可以添加自己的操作
          System.out.println("before method " + method.getName());
          Object object = methodProxy.invokeSuper(o, objects);
          //调用方法之后，我们同样可以添加自己的操作
          System.out.println("after method " + method.getName());
          return object;
      }
  }
  ```

* 创建代理类工厂类

  ```java
  package com.triabin.ideasy_server.proxy.dynamic_proxy_cglib;
  
  
  import net.sf.cglib.proxy.Enhancer;
  
  /**
   * 类描述：CGLIB动态代理类工厂
   *
   * @author Triabin
   * @date 2024-08-11 15:09:53
   */
  public class CglibProxyFactory {
  
      public static Object getProxy(Class<?> clazz) {
          // 创建动态代理增强类
          Enhancer enhancer = new Enhancer();
          // 设置类加载器
          enhancer.setClassLoader(clazz.getClassLoader());
          // 设置被代理的类
          enhancer.setSuperclass(clazz);
          // 设置方法拦截器
          enhancer.setCallback(new DebugMethodInterceptor());
          return enhancer.create();
      }
  }
  ```

* 实际使用

  ```java
  @Test
  public void testDynamicCglibProxy() {
      CglibSendService sendService = (CglibSendService) CglibProxyFactory.getProxy(CglibSendService.class);
      sendService.send("Java");
  }
  ```

  ```powershell
  before method send
  Send message: Java
  after method send
  
  Process finished with exit code 0
  ```

### 2.3 JDK动态代理和CGLIB动态代理区别

1. JDK动态代理只能代理实现了接口的类或者直接代理接口，而CGLIB可以代理未实现任何接口的类。另外CGLIB动态代理是通过生成一个呗代理类的子类来拦截被代理类的方法调用，因此不能声明为final类型的类和方法。
2. 效率，大部分情况都是JDK代理更为优秀，随着JDK版本的升级，这个又是更加明显。

## 3. 静态代理和动态代理对比

* 灵活性：动态代理更加灵活，不需要必须实现接口，可以直接代理实现类，并且可以不需要针对每个目标类都创建一个代理类。另外，静态代理中，接口库一旦新增加方法，目标对象和代理对象都要尽心修改，这是非常麻烦的。
* JVM层面：静态代理在编译时就将接口、实现类、代理类这些都变编译成了一个个实际的class文件。而动态代理是在运行时动态生成字节码，并加载到JVM中的。
