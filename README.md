<img src="/static/mmflow.png" width=90%>

# MMFlow
business contract workflow

后端: Django, Django REST framework  
前端: React  
数据库: MySQL  
部署: Docker, Gunicorn, Nginx  

### 参考资料  
<https://exceptionnotfound.net/designing-a-workflow-engine-database-part-1-introduction-and-purpose/>  

### 业务场景和逻辑  

公司与其他公司的业务往来，涉及到合同的签署， 整个工作流程如下:  
![](https://ws3.sinaimg.cn/large/006tNbRwly1fvcdtn6pklj30at0fj75g.jpg)  
这是简单的场景，审核都会打回到初始阶段，打回上上一级之后再扩展  

这只是企业中的其中一个场景, 企业内的很多事务都设计到工作流程和审批, 例如财务结算,行政申购等等  
我们以法律合同事务来做例子

### 流程设计  
以下以单个法律业务来做说明
#### 1. 超级管理员  
在django里可以用superuser， saas服务中可以是注册者  
超级管理员可以创建用户和用户组， 来分配权限

创建以下几个组：  
| 组名                    | 权限                                         |
| ----------------------- | -------------------------------------------- |
| 法律业务管理员admin     | 可配置通用审批流程模板，修改单个业务审批流程 |
| 法律业务起草者requester | 可提交合同协议                               |

用户与组多对多, 一个用户可以是多个业务的管理员

#### 2. 业务管理员配置审批流程模板  
- 选择一个业务类型  
    每个业务类型的流程和相关人员可能不一样  
    例如选择法律相关事务  
- 选择业务发起者  
    哪些人可能起草法律协议， 并只有这个人能修改  
    > 一个协议可能是有多个人完成， 比如一个人起草框架， 一个人填写财务相关数据， 一个人填写运营线管数据  
    > 这里只考虑一个人来操作， 多人操作的情况可以管理员添加协作者，或者起草人添加写作者， 以后再扩展  

- 创建流程  
    创建两个流程， 每个流程可以选择多人， 并可选择是or还是and, 
    or和and只约束审核通过的状态, or指一个人审核通过则通过, and是全部需要审核通过才算通过, 但是审核不通过都是一个人审核不通过就算不通过  
    创建流程数据示例如下:
    | 流程名称 | 操作人 | or还是and |
    | -------- | ------ | --------- |
    | 签署盖章 | A, B   | or        |
    | 扫描归档 | C, D   | and       |
    > 之后可扩展每个流程结束后的动作, 比如通知哪些人  

#### 3. 业务起草人requeter创建协议  
起草时根据业务类型自动根据上一步的模板创建同样的的审批流程, 一个request对应一个审批流程, 这个审批流程可以修改, 但是只能是业务管理员修改, 不影响模板  
> 可扩展添加协作人, 每个字段记录填写者
> #### 4. A或者B审核协议内容并签署盖章  
> 只有有一人审核不通过, 则返回到第一步起草协议, requester重新修改协议
> #### 5. C and D扫描归档, 并且都审核文件通过  
> 同上一步, 只有有一人审核不通过, 则返回到第一步起草协议, requester重新修改协议
>
> #### 6. 整个流程完成  

#### 7. 说明  
整个流程涉及的文字, 表单, 数据, 文档, 都是在第一步操作, 或者说都是在第一步的界面操作. 之后的流程只涉及到审核, 或者说在页面上只有一个审核通过和不通过, 以及备注, 如果流程中涉及到文档数据, 可以在页面上添加附加, 例如扫描的文档上传等等, 但是编辑的操作应该是在第一步做, 第一步requester添加协作者(可能是签署盖章或者扫描归档里的人), 协作者去第一步的页面填写数据, 上传扫描文档, 而不是混合在这个流程里  

### 数据表设计  
我们还是按业务流程来说, 到哪一步应该在哪些表创建数据
#### 1. 超级管理员管理用户权限  
超级管理员可以是项目的后台管理员, 也可以是saas服务的企业注册者(这必然是一个toB的项目)
超级管理员可以对某个用户设置业务组和角色, 业务组表存各个业务名称, 例如法律事务, 行政事务, 运营事务, 角色表存admin, requester等等, 这两个表都与user表多对多, 意味着一个用户可以是多个业务的管理员
此处可优化, 暂不做详细描述  
假设指定了用户admin为法律合同业务的管理员  
#### 2. admin创建合同业务的审批模板  
可以分为两个模块  
第一个模块设置起草者, 指定哪些用户可以起草业务, 用户与组表里的requester关联  
第二个模块设置审批流程, 可以任意添加流程, 指定流程名称, 和指定审批人, 并选择or和and, 存入WorkflowTemplate表  
- WorkflowTemplate  
    存各个业务的默认流程模板  
    | field         | DataType     | description      |
    | ------------- | ------------ | ---------------- |
    | id            | Integer      |                  |
    | name          | string       | 模板名称         |
    | business      | SmallInteger | 业务类型id       |
    | requester     | Foreignkey   | 与User关联       |
    | workflow_data | json         | 存流程配置的数据 |
    数据示例  
    | id   | business | requester | workflow_data                                                |
    | ---- | -------- | --------- | ------------------------------------------------------------ |
    | 1    | 1        | 1         | [{'name': '签署盖章', 'OrOrAnd': 'or', 'approver': [2, 3]}, {'name': '扫描归档', 'OrOrAnd': 'and', 'approver': [4, 5]}] |
    business 1代表法律业务, requester是外键关联用户id为1的用户  
#### 3. requester创建法律协议  
创建页面可以是表单, 可以是编辑器, 根据不同业务来确定, 本文档举的例子是requester起草协议, 然后将协议的电子文档可以在此页面中上传(这样实现起来最简单, 之后复杂的协同编辑以后再扩展)    
先创建一个主表request, 之后的业务数据,审批数据都与此关联  
- Request  
    | field          | DataType    | description                       |
    | -------------- | ----------- | --------------------------------- |
    | id             | Integer     |                                   |
    | title          | Varchar(20) |                                   |
    | created_time   | Datetime    | 创建时间                          |
    | user_id        | Integer     | 创建人id                          |
    | currentStateId | Integer     | 此时的状态(在下面的State表里详述) |
    数据示例:  
    | id   | title          | created_time        | user_id | currentStateId |
    | ---- | -------------- | ------------------- | ------- | -------------- |
    | 1    | 商业授权申请书 | 2018-09-17 11:09:01 | 1       | 1              |
- StateType  
    写死的固定值, 状态类型, 标识一个request的状态, 数据表设计如下:  
    | field | DataType    | description |
    | ----- | ----------- | ----------- |
    | id    | Integer     |             |
    | name  | VarChar(20) |             |
    示例如下:  
    | id   | status    | 说明                                               |
    | ---- | --------- | -------------------------------------------------- |
    | 1    | start     | 开始, 创建request保存但是不提交到下一步            |
    | 2    | normal    | 在审批过程中, 例如流转到示例中创建的两个审批步骤里 |
    | 3    | complete  | 审批完成                                           |
    | 4    | cancelled | 撤销, requester可以撤销                            |
    保存request后根据业务类型匹配默认的模板数据`[{'name': '签署盖章', 'OrOrAnd': 'or', 'approver': [2, 3]}, {'name': '扫描归档', 'OrOrAnd': 'and', 'approver': [4, 5]}`, 根据此数据生成对应的状态数据State
- State  
    具体的状态流程, 一个state对应一个request, 设计如下:
    | field      | DataType     | description |
    | ---------- | ------------ | ----------- |
    | id         | Integer      |             |
    | request_id | foreignkey   |             |
    | name       | VarChar(20)  | 状态名称    |
    | StatusType | Integer      | 状态类型    |
    | User_id    | ForeighKey   | 与用户关联  |
    | or or and  | SmallInteger |             |
    示例数据如下:  
    | id   | request_id | name     | StatusType | user_id | or or and |
    | ---- | ---------- | -------- | ---------- | ------- | --------- |
    | 1    | 1          | 开始     | 1          | []      | or        |
    | 2    | 1          | 签署盖章 | 2          | [2, 3]  | or        |
    | 3    | 1          | 扫描归档 | 2          | [4, 5]  | and       |
    | 4    | 1          | 完成     | 3          | []      | or        |
    | 5    | 1          | 取消     | 4          | []      | or        |
    还要生成对应的流转路径Transition  
    先介绍ActionType表, 代表审批的动作类型  
- ActionType  
    数据表设计:
    | field | DataType    | description |
    | ----- | ----------- | ----------- |
    | id    | Integer     |             |
    | name  | Varchar(20) | 类型名称    |
    数据示例如下:  
    | id   | name    | description                            |
    | ---- | ------- | -------------------------------------- |
    | 1    | approve | 通过, 到下一个流程                     |
    | 2    | deny    | 拒绝, 到上一个流程(暂时不用)           |
    | 3    | restart | 拒绝, 到开始阶段, 默认打回都是这个操作 |
    | 4    | resolve | 直接通过完成(暂时不用)                 |
    | 5    | cancel  | requester取消                          |
- Transition
    设计如下:  
    | field          | DataType | description                  |
    | -------------- | -------- | ---------------------------- |
    | id             | Integer  |                              |
    | request_id     | Integer  |                              |
    | currentStateId | Integer  |                              |
    | nextStateId    | Integer  |                              |
    | actionType     | Integer  | 动作类型(下表ActionType详述) |
    示例数据:  
    | id   | request_id | currentStateId | nextStateId | actionType |
    | ---- | ---------- | -------------- | ----------- | ---------- |
    | 1    | 1          | 1              | 2           | 1          |
    | 2    | 1          | 1              | 5           | 5          |
    | 3    | 1          | 2              | 3           | 1          |
    | 4    | 1          | 2              | 1           | 3          |
    | 5    | 1          | 3              | 4           | 1          |
    | 6    | 1          | 3              | 1           | 3          |
    requester填写数据后, 可以只保存, 则只执行上面的数据生成, 如果是提交到下一步签署盖章, 则会将操作写入Action表, 下面来叙述
- Action
    | field          | DataType   | description |
    | -------------- | ---------- | ----------- |
    | id             | Integer    |             |
    | ActionTypeId   | Integer    |             |
    | request_id     | Integer    |             |
    | user_id        | Integer    |             |
    | description    | Text       |             |
    | transition _id | Foreignkey |             |
    通过request_id, current_state和action_type来获取transition_id
    那么requester提交到签署盖章会往Action写入
    | id   | ActionTypeId | request_id | user_id | description | transition_id |
    | ---- | ------------ | ---------- | ------- | ----------- | ------------- |
    | 1    | 1            | 1          | 1       | '提交'      | 1             |
    写入之后检查是否满足request更新状态的条件, 根据request id, current state和此action的action type查到id为1的transition, 根据request id和current state查到state, 此state的用户为空, or和and为空, 所以transition生效, 将request的state id更新成2  
#### 4. 签署盖章  
requester创建之后提交, 到达签署盖章环节, 签署盖章有两个人A和B来做, 首先需要再用户的首页显示待处理的request  
我们可以根据用户id查到state, 再根据state查到request, 如果request的state id与state的id相等, 则需要当前用户处理  

这一环节的处理人的实际工作, 需要下载协议电子文档, 审核协议内容, 与第三方公司协商达成一致, 邮寄盖章, 然后这个环节才算结束, 这些工作都是线下进行, 如果审核内容不通过, 则打回到第一步, 如果审核通过, 完成线下工作之后, 点击通过到下一步扫描归档环节  

所以这一步可能有4个action发生, A打回, B打回, A通过, B通过  
- A打回会发生什么呢?  
    Action里面会写入  
    | ActionTypeId | request_id | user_id | description | transition_id |
    | ------------ | ---------- | ------- | ----------- | ------------- |
    | 3            | 1          | 2       | '内容不对'  | 4             |
    写入之后检查是否满足request更新状态的条件, 根据request id, current state和此action的action type能查到id为4的transition, 因为actionType为restart, 所以直接将request的state id更新成1 
- B打回和Ada会是一样的
- A通过
    Action里面会写入  
    | ActionTypeId | request_id | user_id | description | transition_id |
    | ------------ | ---------- | ------- | ----------- | ------------- |
    | 1            | 1          | 2       | '通过'      | 3             |
    写入之后检查是否满足request更新状态的条件, 根据request id, current state和此action的action type能查到id为3的transition, 根据request id和current state查到state, 此state的用户为[2,3], or和and为or, 只需要一个人同即可, 所以transition生效, 将request的state id更新成3
- B通过和A通过是一样的  
#### 5. 扫描归档
根据上一步同样的规则, 这一步的C和D看到这个request到了扫描归档环节,需要处理

C和D在线下拿到签署的协议, 审核文件, 如果审核内容不通过, 则打回到第一步, 如果审核通过, 点击通过到下一步扫描归档环节  
> 打回到上一步的功能可以再扩展

所以这一步可能有4个action发生, C打回, D打回, C通过, D通过  
- A打回会发生什么呢?  
    Action里面会写入  
    | ActionTypeId | request_id | user_id | description | transition_id |
    | ------------ | ---------- | ------- | ----------- | ------------- |
    | 3            | 1          | 3       | '文件不全'  | 6             |
    写入之后检查是否满足request更新状态的条件, 根据request id, current state和此action的action type能查到id为6的transition, 根据request id和current state查到state, 此state的用户为[3,4], or和and为and, 需要用户C和D都通过才能到下一步, 我们通过太ransition查到这有C通过了, 所以transition不生效, state还是扫描归档
- B打回和Ada会是一样的
- A通过
    Action里面会写入  
    | ActionTypeId | request_id | user_id | description | transition_id |
    | ------------ | ---------- | ------- | ----------- | ------------- |
    | 1            | 1          | 2       | '通过'      | 3             |
    写入之后检查是否满足request更新状态的条件, 根据request id, current state和此action的action type能查到id为6的transition, 根据request id和current state查到state, 此state的用户为[3,4], or和and为and, 需要用户C和D都通过才能到下一步, 我们通过太ransition查到C和D都通过了, 所以transition生效, 所以transition生效, state到达下一步state完成
