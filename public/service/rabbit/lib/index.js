/**
 * @author synder on 2017/2/13
 * @copyright
 * @desc
 */

const url = require('url');
const util = require('util');
const amqp = require('amqplib/callback_api');


/**
 * Creates Connection.
 * @class Connection
 */
class Connection {

    constructor(host, port) {

        this._consumeConn = null;
        this._consumeChan = null;

        this._produceConn = null;
        this._produceChan = null;

        this.__CONN_STR = url.format({
            protocol: 'amqp',
            host: host,
            port: port
        });
        
        this.__connect(true, function (err) {
            if(err){
                console.error(err.stack);
            }
        });
    }

    //链接服务器，并创建channel
    __connect(produce, callback) {

        const self = this;

        if (produce === true) {
            if (self._produceChan && self._produceConn) {
                return callback(null, self._produceChan);
            }

            if (self._produceConn) {
                return self._produceConn.createChannel(function (err, ch) {
                    if (err) {
                        return callback(err);
                    }

                    self._produceChan = ch;

                    callback(null, self._produceChan);
                });
            }

            amqp.connect(self.__CONN_STR, function (err, conn) {
                if (err) {
                    return callback && callback(err);
                }

                conn.on('error', function (err) {
                    self._produceChan = null;
                    self._produceConn = null;
                });

                conn.on('close', function () {
                    self._produceChan = null;
                    self._produceConn = null;
                });

                conn.createChannel(function (err, ch) {
                    if (err) {
                        return callback(err);
                    }

                    self._produceConn = conn;
                    self._produceChan = ch;

                    return callback(null, self._produceChan);
                });
            });
        } else {
            if (self._consumeConn && self._consumeChan) {
                return callback(null, self._consumeChan);
            }

            if (self._consumeConn) {
                return self._consumeConn.createChannel(function (err, ch) {
                    if (err) {
                        return callback(err);
                    }

                    self._consumeChan = ch;

                    return callback(null, self._consumeChan);
                });
            }

            amqp.connect(self.__CONN_STR, function (err, conn) {
                if (err) {
                    return callback && callback(err);
                }

                conn.on('error', function (err) {
                    self._consumeChan = null;
                    self._consumeConn = null;
                });

                conn.on('close', function () {
                    self._consumeChan = null;
                    self._consumeConn = null;
                });

                conn.createChannel(function (err, ch) {
                    if (err) {
                        return callback(err);
                    }

                    self._consumeChan = ch;
                    self._consumeConn = conn;

                    return callback(null, self._consumeChan);
                });
            });
        }

    };


    /**
     * @desc 生产消息
     * */
    produceMessage(queue, message, callback) {
        const self = this;
        let sendMsg;

        if (typeof message === 'string') {
            sendMsg = new Buffer(message);
        } else if (Buffer.isBuffer(message)) {
            sendMsg = message;
        } else {
            sendMsg = new Buffer(message.toString ? message.toString() : JSON.stringify(message));
        }

        self.__connect(true, function (err, ch) {

            if (err) {
                return callback(err);
            }

            if (!ch) {
                return callback(new Error('can not create produce channel'));
            }


            ch.assertQueue(queue);
            ch.sendToQueue(queue, sendMsg);

            callback(null, ch);
        });
    };

    /**
     * @desc 发布消息
     * */
    consumeMessage(queue, callback) {

        const self = this;

        self.__connect(false, function (err, ch) {

            if (err) {
                return callback(err);
            }

            if (!ch) {
                return callback(new Error('can not create consume channel'));
            }

            ch.assertQueue(queue);

            ch.consume(queue, function (msg) {
                callback(null, ch, msg);
            });
        });
    };
}

exports.Connection = Connection;