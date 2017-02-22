#开发规范
- 所有接口必须经过测试通过才能交付上线
- 程序变量一律使用英文驼峰方式命名，禁止出现汉语拼音和错误的英语单词
- 接口变量命名使用下划线("_")进行单词分割，禁止出现汉语拼音和错误的英语单词
- 除非特殊需要，代码中一律不能保留console.log或者其他debug信息
- Tab占用4个空格
- 代码行末尾一律添加分号(;)
- 变量使用 let 声明，禁止再使用var声明
- 包引用和常量一律使用 const 声明，禁止再使用var声明

#所使用的主要技术
- express.js API框架
- mock.js 模拟数据
- mocha.js 运行测试
- chai.js 测试断言
- gulp.js 流任务封装
- supertest.js 执行接口测试
- mongoose.js Mongodb在node.js下的ORM框架
- elasticsearch.js Elasticsearch在node.js下的客户端

#项目结构
- bin 程序的启动入口
- config 配置文件存放地
- controller 控制器
- lib 所有自定义模块
- middlware 全局中间件
- model 业务模型层
- resource 资源存放地
- router 路由映射
- service 底层服务
- test 测试文件

#接口测试
#####在开发环境运行测试
> gulp test
> NODE_ENV=dev gulp test

#####在预发布环境运行测试
> NODE_ENV=pre gulp test

#程序启动

####NODE_ENV环境变量，控制加载配置
#####参数说明
- NODE_ENV存在三种值，"dev"/"pre"/"pro"
- dev 表示加载开发环境配置，对应的文件是 /config/dev/index.js 
- pre 表示加载预发布环境配置，对应的文件是 /config/pre/index.js
- pro 表示加载生产环境配置，对应的文件是 /config/pro/index.js

#####使用方式
> NODE_ENV=dev node ./bin/www.js

> NODE_ENV=dev pm2 start ./bin/www.js


####INIT_ELASTIC环境变量，控制初始化elasticsearch搜索引擎
#####参数说明
- INIT_ELASTIC=yes 表示要初始化elasticsearch搜索引擎，这时系统会在elasticsearch中创建所需的索引

#####使用方式
> NODE_ENV=dev INIT_ELASTIC=yes node ./bin/www.js

#####注意事项
> 该参数只能在需要初始化elasticsearch搜索引擎时使用，一旦初始化完毕，需要退出程序，再按照正常的方式启动