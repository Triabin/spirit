---
title: SpringBoot接入Log4j2
createTime: 2024/11/25 15:02:00
tags: 
  - Log4j2
  - Java
  - SpringBoot
---
# SpringBoot接入Log4j2

## 1、去除SpringBoot默认的日志依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <exclusions>
        <!-- 引入log4j日志时需去掉默认的logback -->
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

## 2、导入Spring的版本或者导入SpringBoot的版本

Spring版本：

```xml
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-api</artifactId>
    <version>2.11.2</version>
</dependency>

<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.11.2</version>
</dependency>

<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-slf4j-impl</artifactId>
    <version>2.11.2</version>
</dependency>

<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.30</version>
</dependency>
```

Springboot版本：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-log4j2</artifactId>
    <version>2.1.0.RELEASE</version>
</dependency>
```

## 3、在资源目录下创建log4j2.xml文件

**![image-20240804073851088](https://gitee.com/triabin/img_bed/raw/master/2024/08/04/888c51949e787edfb8aa147fa65e086e-image-20240804073851088.png)**

## 4、在配置文件中配置log4j2.xml文件位置

**![image-20240804152726824](https://gitee.com/triabin/img_bed/raw/master/2024/08/04/e117db4fcb776e4eef9d40f7c996bb33-image-20240804152726824.png)**

## 5、在这个文件中配置所有日志相关的内容

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration status="info">
    <!-- 1. 日志基本信息配置 -->
    <Properties>
        <!-- 1.1 声明日志文件存储的路径，classpath:logs/为jar包所在路径的logs目录 -->
        <Property name="LOG_HOME">./logs</Property>
        <!-- 1.2 应用名称，用于给日志文件命名 -->
        <Property name="APP_NAME">ideasy</Property>
        <!-- 1.3 定义日志输出格式，此处定义了包含时间戳、日志级别、线程、类名、行号、日志内容在内的输出格式 -->
        <Property name="LOG_PATTERN"
                  value="%date{yyyy-MM-dd HH:mm:ss.SSS %-5level [%thread][%class{36}:%line] - %msg%n"/>
    </Properties>

    <!-- 2. 定义日志输出位置 -->
    <Appenders>
        <!-- 2.1 日志输出到控制台配置 -->
        <Console name="consoleAppender" target="SYSTEM_OUT">
            <!-- 2.1.1 配置日志输出格式和颜色 -->
            <PatternLayout
                    pattern="%style{%d{ISO8601}}{bright,green} %highlight{%-5level} [%style{%t}{bright,blue}] %style{%C{}}{bright,yellow}: %msg%n%style{%throwable}{red}"
                    disableAnsi="false"
                    noConsoleNoAnsi="false"/>
        </Console>

        <!-- 2.2 ALL级别文件日志配置 -->
        <RollingFile name="allFileAppender"
                     fileName="${LOG_HOME}/all.log"
                     filePattern="${LOG_HOME}/$${date:yyyy-MM}/all-%d{yyyy-MM-dd}-%i.log.gz">
            <!--设置日志格式-->
            <PatternLayout>
                <pattern>%d %p %C{} [%t] %m%n</pattern>
            </PatternLayout>
            <Policies>
                <!-- 设置日志文件切分参数 -->
                <!--<OnStartupTriggeringPolicy/>-->
                <!--设置日志基础文件大小，超过该大小就触发日志文件滚动更新-->
                <SizeBasedTriggeringPolicy size="100 MB"/>
                <!--设置日志文件滚动更新的时间，依赖于文件命名filePattern的设置-->
                <TimeBasedTriggeringPolicy/>
            </Policies>
            <!--设置日志的文件个数上限，不设置默认为7个，超过大小后会被覆盖；依赖于filePattern中的%i-->
            <DefaultRolloverStrategy max="365"/>
        </RollingFile>

        <!-- 2.3 DEBUG级别文件日志配置 -->
        <RollingFile name="debugFileAppender"
                     fileName="${LOG_HOME}/debug.log"
                     filePattern="${LOG_HOME}/$${date:yyyy-MM}/debug-%d{yyyy-MM-dd}-%i.log.gz">
            <Filters>
                <!--过滤掉INFO及更高级别日志-->
                <ThresholdFilter level="info" onMatch="DENY" onMismatch="NEUTRAL"/>
            </Filters>
            <!--设置日志格式-->
            <PatternLayout>
                <pattern>%d %p %C{} [%t] %m%n</pattern>
            </PatternLayout>
            <Policies>
                <!-- 设置日志文件切分参数 -->
                <!--<OnStartupTriggeringPolicy/>-->
                <!--设置日志基础文件大小，超过该大小就触发日志文件滚动更新-->
                <SizeBasedTriggeringPolicy size="100 MB"/>
                <!--设置日志文件滚动更新的时间，依赖于文件命名filePattern的设置-->
                <TimeBasedTriggeringPolicy/>
            </Policies>
            <!--设置日志的文件个数上限，不设置默认为7个，超过大小后会被覆盖；依赖于filePattern中的%i-->
            <DefaultRolloverStrategy max="365"/>
        </RollingFile>

        <!--2.4 INFO级别文件日志配置 -->
        <RollingFile name="infoFileAppender"
                     fileName="${LOG_HOME}/info.log"
                     filePattern="${LOG_HOME}/$${date:yyyy-MM}/info-%d{yyyy-MM-dd}-%i.log.gz">
            <Filters>
                <!--过滤掉warn及更高级别日志-->
                <ThresholdFilter level="warn" onMatch="DENY" onMismatch="NEUTRAL"/>
            </Filters>
            <!--设置日志格式-->
            <PatternLayout>
                <pattern>%d %p %C{} [%t] %m%n</pattern>
            </PatternLayout>
            <Policies>
                <!-- 设置日志文件切分参数 -->
                <!--<OnStartupTriggeringPolicy/>-->
                <!--设置日志基础文件大小，超过该大小就触发日志文件滚动更新-->
                <SizeBasedTriggeringPolicy size="100 MB"/>
                <!--设置日志文件滚动更新的时间，依赖于文件命名filePattern的设置-->
                <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
            </Policies>
            <!--设置日志的文件个数上限，不设置默认为7个，超过大小后会被覆盖；依赖于filePattern中的%i-->
            <DefaultRolloverStrategy max="365"/>
        </RollingFile>

        <!--2.5 WARN级别文件日志配置 -->
        <RollingFile name="warnFileAppender"
                     fileName="${LOG_HOME}/warn.log"
                     filePattern="${LOG_HOME}/$${date:yyyy-MM}/warn-%d{yyyy-MM-dd}-%i.log.gz">
            <Filters>
                <!--过滤掉error及更高级别日志-->
                <ThresholdFilter level="error" onMatch="DENY" onMismatch="NEUTRAL"/>
            </Filters>
            <!--设置日志格式-->
            <PatternLayout>
                <pattern>%d %p %C{} [%t] %m%n</pattern>
            </PatternLayout>
            <Policies>
                <!-- 设置日志文件切分参数 -->
                <!--<OnStartupTriggeringPolicy/>-->
                <!--设置日志基础文件大小，超过该大小就触发日志文件滚动更新-->
                <SizeBasedTriggeringPolicy size="100 MB"/>
                <!--设置日志文件滚动更新的时间，依赖于文件命名filePattern的设置-->
                <TimeBasedTriggeringPolicy/>
            </Policies>
            <!--设置日志的文件个数上限，不设置默认为7个，超过大小后会被覆盖；依赖于filePattern中的%i-->
            <DefaultRolloverStrategy max="365"/>
        </RollingFile>

        <!-- 2.6 ERROR及更高级别文件日志配置 -->
        <RollingFile name="errorFileAppender"
                     fileName="${LOG_HOME}/error.log"
                     filePattern="${LOG_HOME}/$${date:yyyy-MM}/error-%d{yyyy-MM-dd}-%i.log.gz">
            <!--设置日志格式-->
            <PatternLayout>
                <pattern>%d %p %C{} [%t] %m%n</pattern>
            </PatternLayout>
            <Policies>
                <!-- 设置日志文件切分参数 -->
                <!--<OnStartupTriggeringPolicy/>-->
                <!--设置日志基础文件大小，超过该大小就触发日志文件滚动更新-->
                <SizeBasedTriggeringPolicy size="100 MB"/>
                <!--设置日志文件滚动更新的时间，依赖于文件命名filePattern���设置-->
                <TimeBasedTriggeringPolicy/>
            </Policies>
            <!--设置日志的文件个数上限，不设置默认为7个，超过大小后会被覆盖；依赖于filePattern中的%i-->
            <DefaultRolloverStrategy max="356"/>
        </RollingFile>
    </Appenders>

    <!-- 3. 配置日志输出 -->
    <Loggers>
        <!-- 根日志设置 -->
        <Root level="INFO">
            <AppenderRef ref="allFileAppender" level="all"/>
            <AppenderRef ref="consoleAppender" level="debug"/>
            <AppenderRef ref="debugFileAppender" level="debug"/>
            <AppenderRef ref="infoFileAppender" level="info"/>
            <AppenderRef ref="warnFileAppender" level="warn"/>
            <AppenderRef ref="errorFileAppender" level="error"/>
        </Root>
        <!-- Spring日志 -->
        <Logger name="org.springframework" level="debug"/>
        <!-- druid数据源日志 -->
        <Logger name="druid.sql.Statement" level="warn"/>
        <!-- mybatis日志 -->
        <Logger name="com.mybatis" level="warn"/>
        <Logger name="org.hibernate" level="warn"/>
        <Logger name="com.zaxxer.hikari" level="info"/>
        <Logger name="org.quartz" level="info"/>
        <Logger name="com.andya.demo" level="debug"/>
    </Loggers>
</configuration>
```

## 6、在下个目中使用

```java
package com.triabin.ideasy_server;

import org.apache.logging.log4j.LogManager;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.apache.logging.log4j.Logger;

@SpringBootTest
class IdeasyServerApplicationTests {

	private final Logger logger = LogManager.getLogger(IdeasyServerApplicationTests.class);

	@Test
	void contextLoads() {
		logger.info("INFO级别日志{}", "占位符1");
		logger.warn("WARN级别日志{}", "占位符1");
		logger.error("ERROR级别日志", new Exception("异常"));
	}

}
```

