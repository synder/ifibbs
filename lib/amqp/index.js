/**
 * @author synder on 2017/2/13
 * @copyright
 * @desc
 */


const amqp = require('amqplib/callback_api');

const Connection = function (host, port) {
    this._conn = null;
};

Connection.prototype.send = function (queue, msg, callback) {
    this._conn.createChannel(function (err, ch) {
        if (err != null) {
            return callback(err);
        }
        
        ch.assertQueue(queue);
        
        if(Buffer.isBuffer(msg)){
            ch.sendToQueue(queue, msg);
        }
        
        ch.sendToQueue(queue, new Buffer('something to do'));
    });
};

Connection.prototype.consume = function () {
    
};

exports.Connection = Connection;