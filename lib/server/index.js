/**
 * @desc 封装express创建服务的方法
 * @author sam
 * @version 0.8.3
 * */
const os = require('os');
const util = require('util');
const http = require('http');
const https = require('https');
const events = require('events');
const cluster = require('cluster');
const express = require('express');

const METHODS = http.METHODS;
const EventEmitter = events.EventEmitter;



/**
 * @desc 创建一个http服务程序,包括https和http服务
 * @constructor HttpServer
 * @this {Server}
 * @param {Object} options
 * @example
 *
 *
 *'use strict';
 *
 *var HttpServer = require('epi').HttpServer;
 *
 *var util = require('util');
 *
 * var config = {
 *      host : null,
 *      key : 'string',    //https监听时需要这个key
 *      cert : 'string',   //https监听的时候需要证书
 *      version : '1.0.0'  //api默认的版本信息
 *      port : {
 *          http  : 8000, //如果想要监听http端口，直接写
 *          https : 4433  //如果不想监听https，直接置为null
 *      }
 * }
 *
 * //创建一个httpServer=====================================
 * var httpServer = new HttpServer(config);
 *
 *
 * //设置==================================================
 * httpServer.setting(function (app) {
 *    app.set('trust proxy', true);
 *    app.set('x-powered-by', false);
 * });

 * //导入中间件=============================================
 * var body = require('body-parser');
 * var cookie = require('cookie-parser');
 * var compression = require("compression");
 *
 *  //应用中间件
 * httpServer.middleware(function (app) {
 *    app.use(compression());
 *    app.use(cookie());
 *    app.use(body.json());
 *    app.use(body.urlencoded({
 *        extended: true
 *    }));
 * });
 *
 *
 * //导入路由==============================================
 * var testRouter = require('./router/test');
 *
 * //注册路由
 * httpServer.routing(function(app){
 *      testRouter.map(app);
 * });
 *
 * //testRouter.map(httpServer); //采用新的注册方式
 *
 * //错误处理=============================================
 * httpServer.error(function (err, req, res, next) {
 *    res.status(500).json({
 *        error: err
 *    });
 * });
 * */
const ExpressServer = function (options) {

    /* *
     * {
     *      host : null,
     *      key  : 'string',
     *      cert : 'string',
     *      version : {
     *          defaults : '1.0.0',
     *          headers : {
     *              version : 'accept-version',
     *              channel : 'client-channel'
     *          }
     *      },  //api默认的版本信息
     *      port : {
     *          http  : 8000,
     *          https : 4433
     *      }
     * }
     * */
    options = options || {};

    EventEmitter.call(this);

    this.__host = options.host || null;

    this.__key = options.key;

    this.__cert = options.cert;

    this.__port = {
        http: options.port.http,
        https: options.port.https
    };

    this.__defaultHeaders = {
        version : 'X-Accept-Version',
        channel : 'X-Client-Channel',
        cache   : 'X-Use-Api-Cache'
    };

    this.__server = null;

    /**
     * 如果调用cluster方法启动程序，所有子进程都在这里
     * */
    this.workers = null;

    /**
     * express 创建的app，如果想调用express的相关方法，可以使用这个app
     * */
    this.app = null;

    this.__init();

};

util.inherits(ExpressServer, EventEmitter);

//预定义一些CHANNEL
ExpressServer.CHANNEL = {
    IOS : 1,
    AND : 2,
    PC : 3,
    H5 : 4
};

ExpressServer.prototype.CHANNEL = ExpressServer.CHANNEL;


/**
 * @desc 初始化系统
 * @access private
 * */
ExpressServer.prototype.__init = function () {

    const self = this;

    self.app = express();

    if (self.__port.https) {
        if (!self.__key || !self.__cert) {
            throw new Error('listen https need key and cert');
        }

        self.__server = https.createServer({
            key: self.__key,
            cert: self.__cert
        }, self.app);
    }

    /**
     * 用于解析version和device的中间件
     * 添加一个解析version和device设备类型的中间件
     */
    self.app.use(function (req, res, next) {
        req.incoming = Date.now(); //开始时间
        req.version = req.get(self.__defaultHeaders.version) || req.query.version; //api版本
        req.channel = req.get(self.__defaultHeaders.channel) || req.query.channel; //api通道
        req.version = req.version ? req.version.toLowerCase() : undefined;
        req.channel = req.channel ? req.channel.toLowerCase() : undefined;

        //检测是否要使用缓存
        if(req.get(self.__defaultHeaders.cache)){
            res.cache = function(fn){
                fn(null, null);
            };
        }

        //记录api执行时间
        const send = res.send;
        res.send = function(){
            res.set('X-Execution-Time', String(Date.now() - req.incoming));
            return send.apply(res, arguments);
        };

        next();
    });

    return self.app;
};


/**
 * 挂接方法
 * */
METHODS.forEach(function(method){

    method = method.toLowerCase();

    ExpressServer.prototype[method] = function(path, option, handler){

        const self = this;

        option = option || {};

        let verion = option.v;
        let channel = option.c;
        let ttl = option.t;

        if(ttl){
            if(typeof ttl != 'number'){
                throw new Error('options.t must be a Number instance');
            }
        }

        /***
         * @desc defined handler
         * @param {Object} options example {v : '1.0.0', c : 'pc'}
         * @param {function} handler function(req, res, next){}
         * @param {Number} ttl the cache time In seconds
         * */
        self.app[method](path, function(req, res, next){

            if (verion) {
                if(req.version != verion){
                    return next();
                }
            }

            if (channel) {
                if(req.channel != channel){
                    return next();
                }
            }

            if(!!req.cache && (ttl > 0)){
                //检测是否存在缓存
                res.cache(function(err, result){
                    if(!err && result){
                        //设置头
                        res.set(self.__defaultHeaders.cache, 'YES');
                        res.send(result);
                    }else{
                        handler(req, res, next);
                    }
                });
            }else{
                handler(req, res, next);
            }
        });
    };

});



/**
 * @desc 设置程序属性
 * @param {Function} fn function(app){}
 * @example
 * httpServer.setting(function (app) {
 *   app.set('trust proxy', true);
 *   app.set('x-powered-by', false);
 * });
 * */
ExpressServer.prototype.config = function (fn) {
    fn(this.app);
};



/**
 * @desc 应用中间件
 * @param fn {Function} function(app){}
 * @example
 * httpServer.use(function(app){
 *      app.use(compression());
 *      app.use(timeout('10s'));
 *      app.use(cookie());
 *      app.use(body.json());
 * });
 * */
ExpressServer.prototype.middleware = function (fn) {
    fn(this.app);
};



/**
 * @desc 注册路由
 * @param fn {Function} function(app){}
 * */
ExpressServer.prototype.route = function (fn) {
    fn(this.app);
};


/**
 * @desc 添加错误处理
 * @param fn {Function} function(req, res, next){}
 * */
ExpressServer.prototype.error = function(fn){
    fn(this.app);
};


/**
 * @desc 监听端口
 * @param callback {Function} 监听后返回的消息
 * @example
 * httpServer.listen(8000, function(err, message){
 *      console.log(message);
 * })
 * */
ExpressServer.prototype.listen = function (callback) {
    const self = this;

    if (!self.__port.http && !self.__port.https) {
        throw new Error('port.http or port.https is not set');
    }

    let listenMessage = '';
    let flag = 0;
    let count = 0;

    if (self.__port.http) {
        count++;
    }

    if (self.__port.https) {
        count++;
    }

    if (self.__port.http) {

        self.app.listen(self.__port.http, self.__host, function (err) {

            flag++;

            if (err) {
                listenMessage += err.message;
            }

            let host = self.__host || '127.0.0.1';

            listenMessage += 'server listen on : http://' +
                host +
                ':' +
                self.__port.http +
                ', pid : ' +
                process.pid;

            if (flag >= count) {
                self.emit('listen', self.__port.http);
                callback && callback(listenMessage);
            }
        });

    }

    if (self.__port.https) {

        self.__server.listen(self.__port.https, self.__host, function (err) {

            flag++;

            if (err) {
                listenMessage += err.message;
            }

            let host = self.__host || '127.0.0.1';

            listenMessage += '\nserver listen on : https://' +
                host +
                ':' +
                self.__port.https +
                ', pid : ' +
                process.pid;

            if (flag >= count) {
                self.emit('listen', self.__port.https);
                callback && callback(listenMessage);
            }

        });

    }
};


/**
 * @desc 以集群的方式启动程序
 * @param number {Number} 要启动的监听进程数量，null || 0 启动和 cpu个数 - 1 的进程数量
 * @param callback {Function} 监听后返回的消息
 * @example
 *  //子进程启动事件
 *  httpServer.on('childStart', function(worker){
 *       //记录子进程启动
 *       logger.info(Date.now(), worker.pid);
 *  });
 *
 *
 *  //子进程退出事件
 *  httpServer.on('childStop', function(worker, code, signal){
 *      //记录子进程非正常退出
 *      if(!signal && code !== 0){
 *          logger.fatal(Date.now(), worker.pid, code, signal);
 *      }
 *  });
 *
 *  //子进程退出事件
 *  httpServer.on('childRestart', function(worker){
 *      //记录子进程重启
 *      logger.fatal(Date.now(), worker.pid);
 *  });
 *
 *
 *  //使用集群方式监听=======================================
 *  httpServer.cluster(0, function (message) {
 *      console.log(message);
 *  });
 * */
ExpressServer.prototype.cluster = function (number, callback) {

    const self = this;

    let cpuCount = number || os.cpus().length - 1;

    self.workers = {};

    if (cluster.isMaster) {

        for (let i = 0; i < cpuCount; i++) {

            let workerProcess = cluster.fork();

            self.workers[workerProcess.process.pid] = workerProcess;

            self.emit('childStart', workerProcess);

        }

        cluster.on('exit', function (worker, code, signal) {

            self.emit('childStop', worker, code, signal);

            delete self.workers[worker.process.pid];

            setTimeout(function(){

                let workProcess = cluster.fork();

                self.workers[workProcess.process.pid] = workProcess;

                self.emit('childRestart', workProcess);

            }, 1000);

        });

    } else {
        self.listen(callback);
    }
};


module.exports = ExpressServer;