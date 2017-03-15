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
            host: '127.0.0.1',
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
            url: 'mongodb://127.0.0.1:27017/ifibbs',
            password: '',
            db: ''
        },
        //文件服务
        file: {
            url: 'mongodb://127.0.0.1:27017/file',
            password: '',
            db: ''
        },
        //job服务日志
        cron: {
            url: 'mongodb://127.0.0.1:27017/cron',
            password: '',
            db: ''
        }
    },
    
    /**
     * mysql 配置文件
     * */
    mysql: {
        ifibbs: {
            host: '127.0.0.1',
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
            host: '127.0.0.1',
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
            appID: 'QkiX2QV47s539A3qwKMY9A',
            appKey: 'RqmLRqDNxd6hHKKLn8gRk6',
            masterSecret: 'ZtrRSyKzY06h2N7gvWBOW7'
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
