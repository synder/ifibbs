/**
 * @author synder on 2017/2/27
 * @copyright
 * @desc
 */

const rabbit = require('../../public/service/rabbit');
const getui = require('../../public/service/getui');

const notificationModel = require('../../public/model/notification');

exports.start = function (callback) {
    rabbit.client.consumeMessage(rabbit.queues.BUSINESS.QUESTION_BEEN_ANSWERED, function (err, ch, message) {
        if(err){
            return callback(err);
        }

        let questionID = message.content.toString();

        ch.ack(message);

        console.log();
    });

    rabbit.client.consumeMessage(rabbit.queues.BUSINESS.QUESTION_BEEN_SHARED, function (err, ch, message) {
        if(err){
            return callback(err);
        }

        let questionID = message.content.toString();

        ch.ack(message);

        console.log();
    });

    rabbit.client.consumeMessage(rabbit.queues.BUSINESS.ANSWER_BEEN_FAVOURED, function (err, ch, message) {
        if(err){
            return callback(err);
        }

        let questionID = message.content.toString();

        ch.ack(message);

        console.log();
    });
};

