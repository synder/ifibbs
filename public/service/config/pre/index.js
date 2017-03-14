/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const path = require('path');

module.exports =  {
    /**
     * redis 配置文件
     * */
    redis: {
        ifibbs: {
            host: '192.168.1.193',
            port: 6379,
            password: null,
            db: 0
        }
    },

    /**
     * mongodb 配置文件
     * */
    mongodb: {
        ifibbs: {
            url: 'mongodb://192.168.1.193:27017/ifibbs',
            password: '',
            db: ''
        },
        //文件服务
        file: {
            url: 'mongodb://192.168.1.193:27017/file',
            password: '',
            db: ''
        }
    },
    
    /**
     * mysql 配置文件
     * */
    mysql: {
        ifibbs: {
            host: '192.168.1.193',
            port: 3306,
            username: 'root',
            password: 'yuwei7496560',
            database: 'ifibbs',
        }
    },

    /**
     * 搜索服务
     * */
    elasticsearch: {
        ifibbs: {
            host: '192.168.1.193',
            port: 9200,
            log: 'error'
        }
    },

    /**
     * 个推服务配置
     * */
    getui: {
        ifibbs: {
            protocol: 'http', //https or http
            appID: 'itskAyu3yF6r70JWl4Usn6',
            appKey: 'cuEwvzQhZc5r2Pp4Tp1hEA',
            masterSecret: 'z9z1MB64ux9QAKuK1XdX01'
        }
    },

    /**
     * rabbitmq消息队列服务
     * */
    amqp: {
        ifibbs: {
            host: '127.0.0.1',
            port: '',
        }
    },

    /**
     * 短消息服务
     * */
    sms: {
        ifibbs: {
            username: 'nx-keluo',
            password: 'KEluo1205'
        }
    },
    
    //文件服务
    file: {
        //ifibbs的文件服务
        ifibbs: {
            image: {
                base: '/var/ifibbs/images/',
                domains: ['avatar', 'question', 'article'] //允许上传的域
            }
        }
    }
};
