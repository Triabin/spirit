---
title: Cookie、Session、Token区别
createTime: 2024/11/25 15:00:56
tags:
  - Cookie
  - Session
  - Token
  - JWT
  - 安全
---
# Cookie、Session、Token区别

本质上不是同一种东西，但是都与维持状态信息有关，例如维持登录状态，使用它们都能做。

## 1. Cookie

**Cookie的使用：** 当客户端发起一个登录请求时，需要将用户名和密码传到服务端，服务端进行鉴权（验证），如果账号密码正确，则需要将用户名密码传回客户端，以维持登录状态，后续请求的任何页面都需要带上用户名和密码，这样既不安全又麻烦，于是就使用Cookie来解决这个问题。当服务端通过用户名和密码认证成功后，响应用户名到客户端，客户端将用户名保存到Cookie，之后的所有请求都会带上这个Cookie，这样就维持了登录状态。

使用Cookie维持登录状态的一些问题：

* 安全风险：Cookie存储在客户端，有被客户篡改的风险（即使进行加密，也有被破译加密规则的风险）；
* 容量限制：默认大小为4KB；
* 用户可以通过浏览器禁用Cookie。

因此，不能完全依赖Cookie保存用户的登录状态信息，进而开始使用Session。

## 2. Session

**Session的使用：** 客户端发起登录请求，将用户名和密码传到后端，后端认证成功后，将认证信息存入Session，然后进行响应。响应的时候，在响应头（Response Headers）里面增加一个Set-Session属性，然后将当前Session唯一ID存入这个属性，客户端会自动在Cookie中存入当前SessionID，之后客户端再请求后端时，就会自动在请求头（Request Header）中设置Cookie信息，服务端通过Cookie中的SessionID即可获取本次请求所对应的Session信息，从而获取到当前登陆用户信息，以维持登录状态。Session中甚至可以存入整个User对象，不仅仅限于字符串，且Web服务器例如Tomcat会自动在响应头中存入Set-Cookie(SessionID)属性，整个使用过程已经非常方便，但是Session配合Cookie的使用还是有一些弊端。

使用Session维持登录状态的一些问题：

* 占用服务器资源：由于Session保存在服务端，当并发量上来以后，会对服务端内存资源造成一定压力；
* 扩展性差：当后端为集群部署时，每一次请求不一定都请求到同一台服务器上，无法支持Session；
* 依然需要依赖Cookie；
* 跨域限制：客户端多种多样，容易导致跨域问题，跨域情况下，Cookie默认无法传递，需要在后端设置允许跨域，前端单独设置允许跨域的Cookie传递，操作比较麻烦。

显然，在集群架构和前后端分离的架构下，Session已经不再适用，进而通过Token进行改造。

## 3. Token

**Token的使用：** Token本质上是一个密钥字符串，JWT（JSON Web Token）提供了Token的加密规范，JWT加密规范加密后的字符串由三部分组成，通过“.”分隔，例`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ind3dy5iZWpzb24uY29tIiwic3ViIjoiZGVtbyIsImlhdCI6MTcyMzEwNDAxMiwibmJmIjoxNzIzMTA0MDEyLCJleHAiOjE3MjMxOTA0MTJ9.O9BQLpDmWBt-0HDseL8Ra_CsoaNj5jDAxQMCgOGy8mg`

* 第一部分为Header（头部），包含了算法和Token类型：

  ```json
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9进行base64解码后：
  {
    "alg": "HS256",
    "typ": "JWT"
  }
  ```

* 第二部分为Payload（载荷），即你需要传递的数据

  ```json
  // eyJ1c2VybmFtZSI6Ind3dy5iZWpzb24uY29tIiwic3ViIjoiZGVtbyIsImlhdCI6MTcyMzEwNDAxMiwibmJmIjoxNzIzMTA0MDEyLCJleHAiOjE3MjMxOTA0MTJ9进行base64解码后：
  {
    "username": "www.bejson.com",
    "sub": "demo",
    "iat": 1723104012,
    "nbf": 1723104012,
    "exp": 1723190412
  }
  ```

* 第三部分为Signature（签名），是JWT的安全所在，服务器通过 Payload、Header 和一个密钥(Secret)使用 Header 里面指定的签名算法（默认是 HMAC SHA256）生成。

  签名计算公式：

  ```
  HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
    secret)
  ```

  即上述案例中的`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ind3dy5iZWpzb24uY29tIiwic3ViIjoiZGVtbyIsImlhdCI6MTcyMzEwNDAxMiwibmJmIjoxNzIzMTA0MDEyLCJleHAiOjE3MjMxOTA0MTJ9`使用密钥`bejson`进行HS256加密后，得到`O9BQLpDmWBt-0HDseL8Ra_CsoaNj5jDAxQMCgOGy8mg`

  在实际使用中， 客户端发起登录请求，后端认证成功后，创建JWT字符串，通过Token返回客户端，前端可以通过分隔获和base64解码获取数据。之后的请求，只需要在请求头中设置一个跟后端约定的属性，例如`Authorization: Token`，每次请求后端时通过这个属性携带Token，后端对Token进行解密，检查签名，通过即放行。此种方案，既不需要依赖前端的任何存储，也不需要依赖后端的任何存储，只需要约定好两端的加密方式即可，对于集群和前后端分离的架构来说，使用更为方便。

