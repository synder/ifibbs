/**
 * @author synder on 2017/2/13
 * @copyright
 * @desc
 */

const url = require('url');
const EventEmitter = require('events').EventEmitter;
const amqp = require('amqplib/callback_api');

/**
 * Creates Connection.
 * @class Connection
 */
class Connection extends EventEmitter{

    constructor(host, port) {
        
        const self = this;
       
        this._channel = null;
        this._connection = null;
        
        this.__CONN_STR = url.format({
            protocol: 'amqp',
            host: host,
            port: port
        });
        
        this.__connect(function (err, conn) {
            if(err){
                self.emit('error', err)
            }
            
            
        });
        
        process.once('exit', function () {
            if(self._connection){
                self._connection.close();
            }
        });
    }
    
    __connect(callback){
        const self = this;
        amqp.connect(self.__CONN_STR, function (err, conn) {
            if(err){
                return callback(err);
            }

            self._connection = conn;

            self._connection.on('error', function (err) {
                self.emit('error', err)
            });

            self._connection.on('close', function (err) {
                self._connection = null;
                self.emit('close', err)
            });
        });
    };
    

    /**
     * @desc 生产消息
     * */
    produceMessage(queue, message, callback){
        
    };

    /**
     * @desc 发布消息
     * */
    consumeMessage(queue, callback){
        
    };
}

exports.Connection = Connection;