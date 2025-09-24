---
title: SpringBoot使用RabbitMQ
createTime: 2024/11/25 15:01:50
tags:
  - RabbitMQ
  - SpringBoot
  - Java
  - 消息队列
---
# SpringBoot使用RabbitMQ

## 1、引入jar包

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

## 2、application.yml配置

```yaml
spring:
  rabbitmq:
    port: 5672
    host: localhost
    username: guest
    password: guest
    #这个配置是保证提供者确保消息推送到交换机中，不管成不成功，都会回调
    publisher-confirm-type: correlated
    #保证交换机能把消息推送到队列中
    publisher-returns: true
    virtual-host: /
    #这个配置是保证消费者会消费消息，手动确认
    listener:
      simple:
        acknowledge-mode: manual
    template:
      mandatory: true
```

## 3、自定义RabbitMQ配置类

```java
//常用的三个配置如下
//1---设置手动应答（acknowledge-mode: manual）
// 2---设置生产者消息发送的确认回调机制 (  #这个配置是保证提供者确保消息推送到交换机中，不管成不成功，都会回调
//    publisher-confirm-type: correlated
//    #保证交换机能把消息推送到队列中
//    publisher-returns: true
//     template:
//      #以下是rabbitmqTemplate配置
//      mandatory: true)
// 3---设置重试
@Configuration
public class RabbitConfig {

    @Autowired
    private ConnectionFactory rabbitConnectionFactory;

    //@Bean  缓存连接池
    //public CachingConnectionFactory rabbitConnectionFactory

    @Autowired
    private RabbitProperties properties;

	//这里因为使用自动配置的connectionFactory，所以把自定义的connectionFactory注解掉
    // 存在此名字的bean 自带的连接工厂会不加载（也就是说yml中rabbitmq下一级不生效），如果想自定义来区分开 需要改变bean 的名称
//    @Bean
//    public ConnectionFactory connectionFactory() throws Exception {
//        //创建工厂类
//        CachingConnectionFactory cachingConnectionFactory=new CachingConnectionFactory();
//        //用户名
//        cachingConnectionFactory.setUsername("gust");
//        //密码
//        cachingConnectionFactory.setPassword("gust");
//        //rabbitMQ地址
//        cachingConnectionFactory.setHost("127.0.0.1");
//        //rabbitMQ端口
//        cachingConnectionFactory.setPort(Integer.parseInt("5672"));
//
//        //设置发布消息后回调
//        cachingConnectionFactory.setPublisherReturns(true);
//        //设置发布后确认类型，此处确认类型为交互
//        cachingConnectionFactory.setPublisherConfirmType(CachingConnectionFactory.ConfirmType.CORRELATED);
//
//        cachingConnectionFactory.setCacheMode(CachingConnectionFactory.CacheMode.CHANNEL);
//        return  cachingConnectionFactory;
//    }


    // 存在此名字的bean 自带的容器工厂会不加载（yml下rabbitmq下的listener下的simple配置），如果想自定义来区分开 需要改变bean 的名称
    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory() {
        SimpleRabbitListenerContainerFactory containerFactory = new SimpleRabbitListenerContainerFactory();
        containerFactory.setConnectionFactory(rabbitConnectionFactory);

        // 并发消费者数量
        containerFactory.setConcurrentConsumers(1);
        containerFactory.setMaxConcurrentConsumers(20);
        // 预加载消息数量 -- QOS
        containerFactory.setPrefetchCount(1);
        // 应答模式（此处设置为手动）
        containerFactory.setAcknowledgeMode(AcknowledgeMode.MANUAL);
        //消息序列化方式
        containerFactory.setMessageConverter(new Jackson2JsonMessageConverter());
        // 设置通知调用链 （这里设置的是重试机制的调用链）
        containerFactory.setAdviceChain(
                RetryInterceptorBuilder
                        .stateless()
                        .recoverer(new RejectAndDontRequeueRecoverer())
                        .retryOperations(rabbitRetryTemplate())
                        .build()
        );
        return containerFactory;
    }

    // 存在此名字的bean 自带的容器工厂会不加载（yml下rabbitmq下的template的配置），如果想自定义来区分开 需要改变bean 的名称
    @Bean
    public RabbitTemplate rabbitTemplate(){
        RabbitTemplate rabbitTemplate=new RabbitTemplate(rabbitConnectionFactory);
        //默认是用jdk序列化
        //数据转换为json存入消息队列，方便可视化界面查看消息数据
        rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
        //设置开启Mandatory,才能触发回调函数,无论消息推送结果怎么样都强制调用回调函数
        rabbitTemplate.setMandatory(true);
        //此处设置重试template后，会再生产者发送消息的时候，调用该template中的调用链
        rabbitTemplate.setRetryTemplate(rabbitRetryTemplate());
        //CorrelationData correlationData, boolean b, String s
        rabbitTemplate.setConfirmCallback(
                (correlationData, b, s) -> {
                    System.out.println("ConfirmCallback     "+"相关数据："+  correlationData);
                    System.out.println("ConfirmCallback     "+"确认情况："+b);
                    System.out.println("ConfirmCallback     "+"原因："+s);
                });
        //Message message, int i, String s, String s1, String s2
        rabbitTemplate.setReturnCallback((message, i, s, s1, s2) -> {
            System.out.println("ReturnCallback：     "+"消息："+message);
            System.out.println("ReturnCallback：     "+"回应码："+i);
            System.out.println("ReturnCallback：     "+"回应消息："+s);
            System.out.println("ReturnCallback：     "+"交换机："+s1);
            System.out.println("ReturnCallback：     "+"路由键："+s2);
        });

        return rabbitTemplate;
    }

    //重试的Template
    @Bean
    public RetryTemplate rabbitRetryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();
        // 设置监听  调用重试处理过程
        retryTemplate.registerListener(new RetryListener() {
            @Override
            public <T, E extends Throwable> boolean open(RetryContext retryContext, RetryCallback<T, E> retryCallback) {
                // 执行之前调用 （返回false时会终止执行）
                return true;
            }

            @Override
            public <T, E extends Throwable> void close(RetryContext retryContext, RetryCallback<T, E> retryCallback, Throwable throwable) {
                // 重试结束的时候调用 （最后一次重试 ）
                System.out.println("---------------最后一次调用");

                return ;
            }
            @Override
            public <T, E extends Throwable> void onError(RetryContext retryContext, RetryCallback<T, E> retryCallback, Throwable throwable) {
                //  异常 都会调用
                System.err.println("-----第{}次调用"+retryContext.getRetryCount());
            }
        });
        retryTemplate.setBackOffPolicy(backOffPolicyByProperties());
        retryTemplate.setRetryPolicy(retryPolicyByProperties());
        return retryTemplate;
    }

    @Bean
    public ExponentialBackOffPolicy backOffPolicyByProperties() {
        ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
        long maxInterval = properties.getListener().getSimple().getRetry().getMaxInterval().getSeconds();
        long initialInterval = properties.getListener().getSimple().getRetry().getInitialInterval().getSeconds();
        double multiplier = properties.getListener().getSimple().getRetry().getMultiplier();
        // 重试间隔
        backOffPolicy.setInitialInterval(initialInterval * 1000);
        // 重试最大间隔
        backOffPolicy.setMaxInterval(maxInterval * 1000);
        // 重试间隔乘法策略
        backOffPolicy.setMultiplier(multiplier);
        return backOffPolicy;
    }

    @Bean
    public SimpleRetryPolicy retryPolicyByProperties() {
        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy();
        int maxAttempts = properties.getListener().getSimple().getRetry().getMaxAttempts();
        retryPolicy.setMaxAttempts(maxAttempts);
        return retryPolicy;
    }
}
```

## 4、在程序中创建交换机，队列，并且绑定

DirectRabbitConfig.java（创建**direct**类型的交换机）

```java
@Configuration
public class DirectRabbitConfig {
    //创建一个名为TestDirectQueue的队列
    @Bean
    public Queue TestDirectQueue(){
        // durable:是否持久化,默认是false,持久化队列：会被存储在磁盘上，当消息代理重启时仍然存在，暂存队列：当前连接有效
        // exclusive:默认也是false，只能被当前创建的连接使用，而且当连接关闭后队列即被删除。此参考优先级高于durable
        // autoDelete:是否自动删除，有消息者订阅本队列，然后所有消费者都解除订阅此队列，会自动删除。
        // arguments：队列携带的参数，比如设置队列的死信队列，消息的过期时间等等。
        return new Queue("TestDirectQueue",true);
    }
    //创建一个名为TestDirectExchange的Direct类型的交换机
    @Bean
    DirectExchange TestDirectExchange(){
        // durable:是否持久化,默认是false,持久化交换机。
        // autoDelete:是否自动删除，交换机先有队列或者其他交换机绑定的时候，然后当该交换机没有队列或其他交换机绑定的时候，会自动删除。
        // arguments：交换机设置的参数，比如设置交换机的备用交换机（Alternate Exchange），当消息不能被路由到该交换机绑定的队列上时，会自动路由到备用交换机
        return new DirectExchange("TestDirectExchange",true,false);
    }
    //绑定交换机和队列
    @Bean
    Binding bindingDirect(){
        //bind队列to交换机中with路由key（routing key）
        return BindingBuilder.bind(TestDirectQueue()).to(TestDirectExchange()).with("123");
    }
}
```

## 5、创建生产者进行测试

```java
@RestController
public class TestController {
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    @GetMapping("/sendMessage")
    public String sendDirectMessage(){
        String messageId = UUID.randomUUID().toString();
        String messageData = "test message,hello!";
        String current = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        Map<String,Object> map = new HashMap<>();
        map.put("messageId",messageId);
        map.put("data",messageData);
        map.put("current",current);
        rabbitTemplate.convertAndSend("TestDirectExchange", "123", map, new CorrelationData(UUID.randomUUID().toString()));
        return "ok";
    }
}
```

## 6、访问RabbitMQ后台管理页面

**![image-20240830181004542](https://gitee.com/triabin/img_bed/raw/master/2024/08/30/b15fe2dbd353ade16a6f9b8c460cb8d7-image-20240830181004542.png)**

## 7、创建一个消费者，来消费队列中的消息

```java
@RabbitListener(queues = "TestDirectQueue")
@Component
public class DirectConsumer {

    @RabbitHandler
    public void process(Map map , Channel channel, Message message) throws IOException {
        System.out.println("消费者接受到的消息是："+map.toString());
        //由于配置设置了手动应答，所以这里要进行一个手动应答。注意：如果设置了自动应答，这里又进行手动应答，会出现double ack，那么程序会报错。
        channel.basicAck(message.getMessageProperties().getDeliveryTag(),false);
    }
}
```

PS ：@RabbitListener不仅可以加在类上，还可以加载方法体上。上述消费者，在程序启动后，如果该队列不存在，那么会报org.springframework.amqp.rabbit.listener.BlockingQueueConsumer$DeclarationException: Failed to declare queue(s) 错误。
        所以在消费者端，健壮的写法就是也创建队列和交换机，如果队列和交换机存在，那么就拿来使用，不存在则创建，这样就不会报该错误。
因此@RabbitListener有另一种用法，如下：

```java
@Component
public class DirectConsumer2 {
    @RabbitHandler
    @RabbitListener(bindings = {@QueueBinding(
    		value = @Queue(value = "q5",durable = "true"),//如果不括号中不指定队列名称，那么这时候创建的就是临时队列，当消费者连接断开的时候，该队列就会消失
            exchange = @Exchange(value = "myexchange",durable = "true",type = "direct"),
            key = "123")})
    public void process(Map map , Channel channel, Message message) throws IOException {
        System.out.println("消费者接收到的消息是"+map.toString());
        //由于配置设置了手动应答，所以这里要进行一个手动应答。注意：如果设置了自动应答，这里又进行手动应答，会出现double ack，那么程序会报错。
        channel.basicAck(message.getMessageProperties().getDeliveryTag(),false);
    }
}
```

上述列子在@RabbitListener中声明了队列和交换机，并且指定了routing key，当这一对关系存在时，那么会直接使用，不存在就会创建。

上述消费者和生产者都只是使用了Exchange的Direct模式。下面再介绍Fanout和Topic模式。

## 8、Fanout模式

fanout会忽略routingkey（路由键）的规则，只要绑定到该exchange上的队列都会收到该消息。所以fanout也相当于广播，队列只要订阅绑定了这个Exchange，那么消息都会被转发到这些队列中。

**![image-20240830183449462](https://gitee.com/triabin/img_bed/raw/master/2024/08/30/57e27bccb301c051f841e53a7943fa07-image-20240830183449462.png)**

创建FanoutConfig.java，配置创建Fanout类型的Exchange，再创建三个队列FanoutA、FanoutB、FanoutC。将这三个队列绑定到创建的FanoutExchange中。

```java
@Configuration
public class FanoutConfig {
    //创建FanoutExchange
    @Bean
    FanoutExchange fanoutExchange(){
        return new FanoutExchange("FanoutExchange",true,false);
    }

    //创建队列A
    @Bean
    Queue queueA(){
        return new Queue("FanoutA",true,false,false);
    }

    //创建队列B
    @Bean
    Queue queueB(){
        return new Queue("FanoutB",true,false,false);
    }

    //创建队列C
    @Bean
    Queue queueC(){
        return new Queue("FanoutC",true,false,false);
    }
    
    //将创建的队列绑定到创建的交换机上
    @Bean
    Binding bindingA(){
        return BindingBuilder.bind(queueA()).to(fanoutExchange());
    }
    @Bean
    Binding bindingB(){
        return BindingBuilder.bind(queueB()).to(fanoutExchange());
    }
    @Bean
    Binding bindingC(){
        return BindingBuilder.bind(queueC()).to(fanoutExchange());
    }
}

```

在TestController.java中新加一个请求地址用来发送消息到Fanout交换机中。

```java
@RestController
public class TestController {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    @GetMapping("/sendMessage2")
    public String sendFanoutMessage(){
        String messageId = UUID.randomUUID().toString();
        String messageData = "test message,hello!";
        String current = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        Map<String,Object> map = new HashMap<>();
        map.put("messageId",messageId);
        map.put("data",messageData);
        map.put("current",current);
        rabbitTemplate.convertAndSend("FanoutExchange", "", map, new CorrelationData(UUID.randomUUID().toString()));
        return "ok";
    }
}
```

登录RabbitMQ后台管理页面，查看消息推送情况。

看到一条消息被转发到了这三个队列中。

之后创建一个消费者，消费消息，消费者的创建和上述差不多，只不过换了一些监听的队列而已。
FanoutConsumer.java

```java
@Component
public class FanoutConsumer {
    //这里把两种@RabbitListener的注解都写出来了，这两种写法都要认得，第二种写法比较健壮
    //@RabbitListener(queues = "FanoutA")
    @RabbitListener(bindings = {@QueueBinding(
            value = @Queue(value = "FanoutA",durable = "true"),
            exchange = @Exchange(value = "FanoutExchange",durable = "true",type = "fanout"),
            key = ""
    )})
    @RabbitHandler
    public void processA(Map map, Channel channel, Message message) throws IOException {
        System.out.println("收到的FanoutA队列的消息是："+map.toString());
        channel.basicAck(message.getMessageProperties().getDeliveryTag(),false);
    }


    @RabbitListener(bindings = {@QueueBinding(
            value = @Queue(value = "FanoutB",durable = "true"),
            exchange = @Exchange(value = "FanoutExchange",durable = "true",type = "fanout"),
            key = ""
    )})
    @RabbitHandler
    public void processB(Map map, Channel channel, Message message) throws IOException {
        System.out.println("收到的FanoutB队列的消息是："+map.toString());
        channel.basicAck(message.getMessageProperties().getDeliveryTag(),false);
    }
    
    @RabbitListener(bindings = {@QueueBinding(
            value = @Queue(value = "FanoutC",durable = "true"),
            exchange = @Exchange(value = "FanoutExchange",durable = "true",type = "fanout"),
            key = ""
    )})
    @RabbitHandler
    public void processC(Map map, Channel channel, Message message) throws IOException {
        System.out.println("收到的FanoutC队列的消息是："+map.toString());
        channel.basicAck(message.getMessageProperties().getDeliveryTag(),false);
    }
}
```

## 9、Topic模式

exchange会转发到符合routingkey的消息队列中。也就是说发送消息的routingkey符合队列和exchange绑定的routingkey规则，那么这个消息就会被转发到这些队列中。一个消息有可能被多个队列消费。

**![image-20240830184132289](https://gitee.com/triabin/img_bed/raw/master/2024/08/30/b4590af3df8c2d24f236397f1f6aaa6d-image-20240830184132289.png)**

创建TopicConfig.java，配置创建Topic类型的Exchange，再创建三个队列TopicA、TopicB、TopicC。将这三个队列绑定到创建的TopicExchange中。TopicA绑定的routing key为test.#，TopicB绑定的routing key为test.*，TopicC绑定的routing key为test.topic。

```java
@Configuration
public class TopicConifg {

    @Bean
    TopicExchange topicExchange(){
        return new TopicExchange("TopicExchange",true,false);
    }

    @Bean
    Queue TopicqueueA(){
        return new Queue("TopicA",true,false,false);
    }

    @Bean
    Queue TopicqueueB(){
        return new Queue("TopicB",true,false,false);
    }

    @Bean
    Queue TopicqueueC(){
        return new Queue("TopicC",true,false,false);
    }

    @Bean
    Binding TopicbindingA(){
        return BindingBuilder.bind(TopicqueueA()).to(topicExchange()).with("test.#");
    }
    @Bean
    Binding TopicbindingB(){
        return BindingBuilder.bind(TopicqueueB()).to(topicExchange()).with("test.*");
    }

    @Bean
    Binding TopicbindingC(){
        return BindingBuilder.bind(TopicqueueC()).to(topicExchange()).with("test.topic");
    }
}
```

在TestController.java中新加一个请求地址用来发送消息到Topic交换机中。

```java
@GetMapping("/sendMessage3")
public String sendTopicMessage(){
    String messageId = UUID.randomUUID().toString();
    String messageData = "test message,hello!";
    String current = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    Map<String,Object> map = new HashMap<>();
    map.put("messageId",messageId);
    map.put("data",messageData);
    map.put("current",current);
    rabbitTemplate.convertAndSend("TopicExchange", "test.topic.a", map, new CorrelationData(UUID.randomUUID().toString()));
    return "ok";
}
```

推送消息到TopicExchange中，并且routing key 为test.topic.a。登录RabbitMQ后台管理页面，查看消息转发情况。

可以看到只有队列TopicA接收到消息了。因为在Topic模式下的Exchange，转发消息的routing key规则是：

> **#：匹配一个或者多个词**
> ***：匹配一个或者0个词**
> 比如test.topic.a 只会匹配test.#，test.a会匹配test. * 和test.#，test只会匹配test. *

1、修改发送消息的routing key 为test，会发现只有TopicA接收到消息。
2、修改发送消息的routing key 为test.topic时，会发现三个队列都接收到消息。

## 10、总结

* 在Exchange中，有三种模式：Direct，Fanout，Topic
* Direct模式只会将消息转发到符合绑定routing key的队列中，如果没有符合routing key的队列，那么消息会丢失。而且Direct发送的消息是唯一的，也就是说再-Direct中的一个消息，最后只会发送到一个队列中被消费
* Fanout模式会无视routing key，会把消息转发到所有绑定到该交换机上的队列中。所以Fanout中的一个消息，会转发到所有的队列中，也就是如果绑定了多个队列，那么一个相同的消息会在多个队列中
* Topic模式有一套转发的routing key规则，只会把消息转发到符合routing key 的队列中。所以在Topic中的一个消息有可能也会被转发到多个队列中进行消费
  
