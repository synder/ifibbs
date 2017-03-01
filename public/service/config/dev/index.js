/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

module.exports =  {
    /**
     * redis 配置文件
     * */
    redis: {
        host: '127.0.0.1',
        port: 6379,
        password: null,
        db: 0
    },

    /**
     * mongodb 配置文件
     * */
    mongodb: {
        url: 'mongodb://192.168.1.193:27017/ifibbs',
        password: '',
        db: ''
    },

    /**
     * 搜索服务
     * */
    elasticsearch: {
        host: '127.0.0.1',
        port: 9200,
        log: 'error'
    },

    /**
     * 个推服务配置
     * */
    getui: {
        protocol: 'http', //https or http
        appID: 'itskAyu3yF6r70JWl4Usn6',
        appKey: 'cuEwvzQhZc5r2Pp4Tp1hEA',
        masterSecret: 'z9z1MB64ux9QAKuK1XdX01'
    },

    /**
     * rabbitmq消息队列服务
     * */
    amqp: {
        host: '127.0.0.1',
        port: '',
    }
};
