## Lilishop B2B2C Mall System

##### Official Official Account & Open source is not easy, if you have any help, please click Star
![image-20210511171611793](https://pickmall.cn/assets/imgs/h5-qrcode.png)

[![star](https://gitee.com/beijing_hongye_huicheng/lilishop/badge/star.svg?theme=dark)](https://gitee.com/beijing_hongye_huicheng/lilishop/stargazers)


### Introduction
**Official website**: https://pickmall.cn

Lilishop is a Java development, a B2B2C multi-user mall developed based on SpringBoot. The front-end is developed using Vue and uniapp. **All codes of the system are open source**

The front and back ends of the product are separated, and distributed deployment is supported.

The mall display terminal includes PC, H5, WeChat applet, and APP.

The mall contains membership module, **third-party login module**, **third-party payment module**, **floor decoration module**, order module, distribution module, article module, system setting module, traffic analysis module

The system includes various middleware, search engines, multi-level caches, distributed transactions, distributed task scheduling, etc. It supports Docker and k8s. It is a high-performance mall system that supports high concurrency.

Out of the box, simple configuration can deploy a set of your own system.

### Documentation

**Product Documentation** (Requirements, Architecture, Use, Deployment, Development): https://docs.pickmall.cn


### Project link (gitee)

**Java background**: https://gitee.com/beijing_hongye_huicheng/lilishop.git

**Vue backend front end**: https://gitee.com/beijing_hongye_huicheng/lilishop-ui.git

**Uni-app**: https://gitee.com/beijing_hongye_huicheng/lilishop-uniapp.git

**Docker one-click deployment**: https://gitee.com/beijing_hongye_huicheng/docker.git

### Project link (github)

**Java background**: https://github.com/hongyehuicheng/lilishop.git

**Vue backend front end**: https://github.com/hongyehuicheng/lilishop-ui.git

**Uni-app**: https://github.com/hongyehuicheng/lilishop-uniapp.git

**Docker one-click deployment**: https://github.com/hongyehuicheng/docker.git

### Demo address

**Operation background**: https://admin-b2b2c.pickmall.cn Account: admin/123456

**Store background**: https://store-b2b2c.pickmall.cn Account number: 13011111111/111111

**User front desk**: https://pc-b2b2c.pickmall.cn

**Mobile terminal**: https://m-b2b2c.pickmall.cn

![image-20210511171611793](https://pickmall.cn/assets/imgs/h5-qrcode.png)

### 3 lines of commands to build a local environment

Reminder: Due to the large number of services, if the notebook environment does not have 32g of startup memory, it may not be able to start successfully (macbookpro 2020 16g memory cannot start successfully), and the desktop computer runs successfully on the 16g memory, AMD 3700x ubuntu system.

##### Download the docker script
`git clone https://gitee.com/beijing_hongye_huicheng/docker.git `
##### Deploy the basic environment
`docker-compose up -d`

##### Deploy the application
`docker-compose -f docker-compose-application.yml up -d`



PS: If deployed separately, the database file can be accessed here: https://gitee.com/beijing_hongye_huicheng/docker/tree/master/init/mysql

##### Individual addresses

| API | Address |
| -------------- | --------------- |
| Buyer API | http://127.0.0.1:8888 |
| Merchant API | http://127.0.0.1:8889 |
| Management API | http://127.0.0.1:8887 |
| General API | http://127.0.0.1:8890 |

| Front-end demo | Address |
| -------------- | --------------- |
| PC | http://127.0.0.1:10000 |
| WAP | http://127.0.0.1:10001 |
| Merchant | http://127.0.0.1:10002 |
| Management side | http://127.0.0.1:10003 |





### function list



#### Platform Function

![Platform Features](https://pickmall.cn/assets/imgs/other/managerList.jpg)



#### Merchant function

![Merchant function](https://pickmall.cn/assets/imgs/other/storeList.jpg)





### function display



#### Mobile

<img src="https://pickmall.cn/assets/imgs/other/app.gif" alt="Management function display" style="zoom:50%;" />

<img src="https://pickmall.cn/assets/imgs/other/app.gif" alt="Mobile terminal function display" style="zoom:50%;" />



#### Management

![Manager function display](https://pickmall.cn/assets/imgs/other/manager.gif)


### Technical Selection

#### Architecture diagram

![Architecture](https://lili-system.oss-cn-beijing.aliyuncs.com/docs/%E6%9E%B6%E6%9E%84.png)

##### Java background

| Description | Frame | Description | |
| -------------- | --------------- | -------------- | --- ---------- |
| Basic Framework | Spring Boot | MVC Framework | Spring MVC |
| Persistent Framework | Mybatis-Plus | Program Construction | Maven |
| Relational Database | MySQL | Message Middleware AMQP | RocketMQ |
| Cache | Redis +MongoDB | Search Engine | Elasticsearch |
| Security Framework | Spring Security | Database Connection Pool | Druid |
| Database sub-database sub-table | sharding | Timed task | xxl-job |
| Load Balancing | Nginx | ​​Static Resources | Alibaba Cloud OSS |
| SMS | Alibaba Cloud SMS | Authentication | JWT |
| Log Processing | Log4j | Interface Specification | RESTful |

##### Front-end-operation back-end, store back-end

| Description | Frame | Description | Frame |
| ---------- | ---------- | ---------- | ------- |
| Build tools | webpack | JS version | ES6 |
| Basic JS Framework | Vue.js | Video Player | Dplayer |
| Routing Management | Vue Router | State Management | Vuex |
| Basic UI library | iView | UI interface based on | iView |
| Network request | axios | | |

##### Frontend-Mobile

| Description       | Architecture | Description     | Architecture |
| ------------------| ------------ | ----------------| ------------ |
| Basic UI library  | uViewui      | Basic framework | uni-app      |
| CSS preprocessing | scss         | map engine      | amap         |

### Upgrade plan

#### Plan to release a version every month, the specific time may differ

Time: June 15, 2021

```
new features:
1. WeChat mini program live broadcast
2. Coupon campaign
3. Newcomer coupons
4. Accurately issue coupons
5. User level
6. Data export
7. Order batch
8. APP version upgrade detection
9. Points Mall

Function optimization:
1. Coupon validity period increase type: valid within * after setting and receiving.
2. The spike activity is set to start every day, and the spike activity start time needs to be set.
3. Store delivery template, if the delivery area is selected province, the city-level address below will not be displayed.
4. Store distribution template support, store free shipping.
5. The general merchandise setting removes the seller's freight.

```

Time: July 15, 2021

```
new features:
1. Member rights
2. Support users to upgrade membership
3. Supply and demand list
4. IM: Tencent Cloud Smart Service
5. Service goods
6. The store supports order verification
7. Store pick up point
Function optimization:
1. Users can earn points and experience points by sharing the mall, paying attention to the store, and inviting new users.
```

Time: August 16, 2021

```
new features:
1. Micro Amoy function
2. Store mobile terminal
3. Store Invoice
```

Time: September 15, 2021

```
new features:
Add supplier functions
```

### version upgrade

```
Follow-up will continue to upgrade the version, fix bugs, improve functions, and cover more business scenarios o2o/b2b/s2b2b2c/cross-border e-commerce

In the future, we will consider launching enterprise-level versions such as microservices/middle-stage
```

### Technical Highlights


    1. The back-end framework is based on Springboot, the construction is based on maven, and the persistence layer uses MyBatisPlus. Use various intermediate keys such as elasticsearch, redis, mongodb, rocketmq, etc. They are all mainstream architectures and can easily cope with various environments.
    
    2. Support clustering, distributed, easy deployment of docker, and solve various complex scenarios!
    
    3. The code module is clear, mainly divided into three-end api (buyer, seller, management), each end API is isolated from each other, authenticates itself, and operates its own business.
    
    4. Use Ali's open source RocketMQ to solve various concurrency scenarios based on mq, solve transaction consistency, and solve the problem of concurrency delay scenarios.
    
    5. The project uses multi-level caching to apply different scenarios, redis caching business data, mongodb caching relational many-to-many relationship issues, nginx caching high-frequency access to low-frequency modified pages.
    
    6. Support various joint logins, support various client payment issues, flexible configuration and flexible opening.
    
    7. Built-in perfect floor decoration mechanism, various drag and drop, maintenance jump page or external network, even an operation that does not understand anything can be easily mastered.
    
    8. Built-in Ali SMS interface, you can apply for SMS template online. The built-in Ali oss system can perform various operations on files. The oss merchant resources are isolated from each other.
    
    10. Powerful statistical reports, statistical effects, can realize various scenarios, including online number, historical online number, active number and other information.
    
    11. Standard Api interface, provide swagger document, quickly open two.
    
    12. Distributed scheduling task center, to solve the problem of multiple execution of distributed timing tasks.
    
    13. The code comments are perfect and get started quickly.
    
    14. The non-mobile terminal adopts the IView framework, and various custom plug-ins and selectors are implemented. The mobile terminal adopts uniapp, write once, use all terminals
    
    15. It has been docked with various third-party plug-ins, supporting various complex scenarios such as joint login and joint payment.


### Open source instructions
1. Only allowed for personal study and research use.

2. It is forbidden to sell the open source code and resources in any form or name.

3. Restrict commercial use, please contact us if you need commercial use. QQ3409056806.

### Exchange group

**QQ Group**: 961316482

