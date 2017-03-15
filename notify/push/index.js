/**
 * @author synder on 2017/3/8
 * @copyright
 * @desc
 */


const notificationModel = require('../../public/model/ifibbs/notification');

exports.start = function (callback) {
    notificationModel.consumeForQuestionBeenAnsweredMQS(callback);
    notificationModel.consumeForQuestionBeenAttentionMQS(callback);
    notificationModel.consumeForQuestionBeenDeletedMQS(callback);
    notificationModel.consumeForQuestionBeenSharedMQS(callback);
    notificationModel.consumeForQuestionBeenStickiedMQS(callback);

    notificationModel.consumeForAnswerBeenCommendedMQS(callback);
    notificationModel.consumeForAnswerBeenFavouredMQS(callback);

    notificationModel.consumeForUserBeenAttentionMQS(callback);
    notificationModel.consumeForUserPublishNewQuestionMQS(callback);

    notificationModel.consumeForSubjectHasNewArticleMQS(callback);
};
