/**
 * @author synder on 2017/2/27
 * @copyright
 * @desc
 */

const notificationModel = require('../../public/model/notification');

exports.start = function (callback) {
    notificationModel.consumeForQuestionBeenAnsweredMQS(callback);
    notificationModel.consumeForQuestionBeenStickiedMQS(callback);
    
    notificationModel.consumeForAttentionSubjectHasNewArticleMQS(callback);
    notificationModel.consumeForUserPublishNewQuestionMQS(callback);
};

