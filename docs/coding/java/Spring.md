---
title: Spring
order: 5
---

---
title: Spring
createTime: 2024/11/25 15:02:04
tags:
- Spring
- Java
---

# Spring

文章来源：[2024版Spring源码全套视频，这绝对是spring源码教程天花板！](https://www.bilibili.com/video/BV1GjsJecEGs)

## 1、Spring容器启动（加载）流程

**Spring容器**：管理Bean对象，通过依赖注入组织bean之间的关系，从而降低业务对象之间的耦合性。（IoC的思想，因此Spring容器又叫做IoC容器）

* `Spring容器启动 = new ApplicationContext()`

  `ApplicationContext`：体现了Spring容器，管理对象、通过依赖注入组织bean之间的关系，通过`getBean(String name)`获取bean对象。

* 创建：

    1. 首先要去读取配置

       读取Java配置类：`AnnotationConfigApplicationContext ctx = new AnnotationConfigApplication(XxxConfig.class);`

       读取xml配置文件：`ClassPathXmlApplicationContext ctx = new AnnotationConfigApplication("spring.xml");`

       不管读取配置方式为何，读取完配置后续的操作都是一样的，他们都使用统一的一个存储对象——`BeanDefinition`，如下图，`BeanDefinition`为一个接口，其中定义了用于操作各个可配置属性的方法规范实现它的类。

       **![image-20240914170935729](https://gitee.com/triabin/img_bed/raw/master/2024/09/14/15f0c7c06c46b0c9fae474bf74a5fdbb-image-20240914170935729.png)**

    2. 根据读取到的配置信息进行扫描

       根据读取到的配置信息，根据读取到的`@ComponentScan`扫描，扫描到`@Component`或者`@Bean`的类，就会根据该类的信息构建`BeanDefinition`对象。`BeanDefinition`对象使用一个Map存储，这个Map为自定义实现的`BeanDefinitionMap<beanName, BeanDefinition>`。

       `XxxService xxxService = (XxxService) ctx.getBean("xxxService");`的执行流程：获取bean  -> 未获取到 -> 创建 -> 拿到BeanDefinition

       BeanDefinition封装了所有bean的定义信息，后续创建bean需要根据这些定义信息来创建，想要创建bean需要先注册BeanDefinition。本质上来说，创建bean其实也是新建了一个对象，只不过不同的是，bean的创建还需要解决bean之间的依赖和注入等问题。

    3. **bean实例化过程**

       一、循环`BeanDefinitionMap<String beanName, BeanDefinition definition>`，然后做一些判断：① 是否为懒加载`@Lazy`，如果是懒加载，则不创建；② 是否为多例bean`@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)`，如果是多例，也不创建（因为多例bean每次调用都要新建一个bean）。如果都不是上述两种请款，则调用`BeanFactory.getBean`方法。

       二、调用`BeanFactory.getBean`方法的过程中，首先会先去判断工厂类是否已经生产了这个bean，工厂类存储已创建的Bean使用的也是一个Map，这个Map叫做`singletonObjects<beanName, Object>`，如果获取到直接返回，未获取到则实例化bean。

       实例化bean的过程，首先先通过beanName从BeanDefinitionMap中获取到BeanDefinition，然后获取BeanDefinition中的类信息，通过反射创建相应的实例（`clazz = beanDefinition.getClass(); clazz.getConstractor().newInstance();`），这个对象目前还只是临时bean，或者说纯净的bean，因为这个bean中注入的其他bean还未实例化。

       三、属性注入：`@Autowired`、`@Value`等注解属性的实例化问题，它会再去调用`BeanFactory.getBean`来获取注入的内容（PS：如果此时去获取的bean还未创建且它的创建需要注入当前bean，则会形成循环依赖，这个后续再说）。

       初始化：属性注入完成后会去进行初始化，这个初始化不是实例化，而是Spring底层为我们提供的一系列扩展接口，例如bean的初始化回调方法，会在bean完成初始化之后执行，它有三种方法进行指定，第一种是实现`InitializingBean`接口，然后重写`public void afterPropertiesSet()`方法，第二种是通过`@PostConstruct`注解或者配置类中的`@Bean(init-method=methodname)`注解，第三种是通过xml配置配置它的init-method属性，`<bean class="com.triabin.service.XxxService" id="xxxService" scope="prototype" lazy-init="true" init-method="method-name" />`。其他扩展接口如下图所示，在初始化过程中它们会按照从上到下顺序执行。

       **![image-20240914182549268](https://gitee.com/triabin/img_bed/raw/master/2024/09/14/dd13c2233a6d5fa872657b690bee56d3-image-20240914182549268.png)**

       大致分为这么几个部分：

       ① xxxAware<br/>② BeanPostProcessor为bean后置处理器，它定义了两个方法，`postProcessBeforeInitialization`方法在初始化回调方法之前调用，`postProcessAfterInitialization`在初始化回调方法之后调用，实际上，在整个bean的生命周期中，后置回调方法会调用9次，分别是在创建bean之前、实例化之时、实例化之后调用2次、属性注入前后、初始化前后，最后再在销毁之后调用一次<br/>③ 初始化回调方法定义

       > BeanFactory：它本身是一个接口，里面定义了各种各样的getBean方法，主要负责生产/获取bean，是Spring容器的底层体现。
       >
       > PS：ApplicationContext类中的getBean方法本质上，内部也是调用的BeanFactory.getBean方法。

* bean的生命周期

  **实例化** -> **属性注入** -> **初始化** -> **销毁**

  > 销毁一般需要调用`ctx.close()`方法，销毁时和初始化一样，也有对应的回调方法，且回调方法的实现方式也有三种，分别与初始化回调方法的实现方式一一对应。

## 2、Spring容器加载主流程源码

Spring底层源码大量使用了设计模式，通过学习Spring底层源码，可以很好将设计模式应用到以后得编码过程中，也方便以后的调试，同时也方便基于框架进行二次开发，框架的二次开发需要基于Spring提供的扩展接口进行。

### 2.1 Spring IoC之Bean创建过程底层原理详解

> Bean：被Spring管理的那些对象

**![image-20240927153133743](https://gitee.com/triabin/img_bed/raw/master/2024/09/27/b3e87467cb91ea13a2ff6798c4d76b08-image-20240927153133743.png)**

1. 概念态：使用xml配置文件的标签（`<bean>`标签）或者通过Java配置类（`@Component`、`@Bean`等）定义好的Bean；
2. 定义态：将概念态中定义的Bean配置读取后创建`BeanDefinition`类并存入`BeanDefinitionMap`中；
3. 纯净态：根据`BeanDefinitionMap`中的内容刚刚创建了Bean对象，还未解决Bean内部的依赖注入时候的状态；
4. 成熟态：Bean进行依赖注入、初始化并存入`singletonObjects`后的状态。

> 如果遇到重名的bean，Spring和Springboot处理方式不一样。
>
> Spring会在读取配置存入`BeanDefinitionMap`这一步将后读取的值覆盖掉前面一个值，Springboot会直接报错，但是Springboot中也可以通过配置使得其处理方式与Spring一致。

**源码：**

XxxConfig.class/xml配置 → new ApplicaitonContext() → `org.springframework.context.support.AbstractApplicationContext#refresh` → `invokeBeanFactoryPostProcessors(beanFactory)` → finishBeanFactoryInitialization → doGetBean → Bean是否已创建完成 → doCreateBean → 实例化 → 属性注入（`doGetBean("orderService")`） → 初始化 → 存入`singletonObjects`中

### 2.2 Spring IoC之Bean生命周期过程底层原理详解

### 2.3 ApplicationContext和BeanFactory的区别

### 2.4 Spring IoC之实例化如何推断构造函数

### 2.5 Spring IoC之依赖注入中Bean循环依赖底层原理

### 2.6 Spring IoC之初始化前、初始化、初始化后详解

### 2.7 Spring IoC之加载流程源码深度剖析

### 2.8 Spring AOP底层原理及常见面试题详解

> AOP：Aspect Oriented Programming，面向切面编程，底层使用动态代理实现，而在Java中，动态代理主要使用两种实现，一个是JDK自带的，还有一种是CGLIB。
>
> AOP使用场景：用于在不改动业务基础上，实现增强（一些和业务无关的公共功能，比如公共日志之类的）

JDK动态代理使用案例：

```java
Proxy.newProxyInstance(
    userService.getClass().getClassLoader(),
    userService.getClass().getInterfaces(),
    (proxy, method, args) -> {
        System.out.println("before");
        Object invoke = null;
        try {
            invoke = method.invoke(userService, args);
        } catch (Exception e) {
            logger.error("获取{}代理方法异常", userService.getClass().getName(), e);
        }
        System.out.println("after");
        return invoke;
    }
);
```

本质上，动态代理是使用初始化过程中的`org.springframework.beans.factory.config.BeanPostProcessor#postProcessAfterInitialization`实现的

### 2.9 JDK动态代理和CGLIB动态代理区别详解

### 2.10 Spring事务底层原理及常见面试题详解

事务本质上是使用动态代理（AOP）现的，在Spring内部自己实现的切面。
