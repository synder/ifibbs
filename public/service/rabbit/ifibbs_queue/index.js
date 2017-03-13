/**
 * @author synder on 2017/2/27
 * @copyright
 * @desc
 */

/**
 * @desc 通知主题
 * 1.问题
 *  1.1 用户发布的问题有了新的回答
 *  1.2 用户发布的问题被他人分享
 *  1.3 关注的问题有了新的回答
 * 2.专题
 *  2.1 用户关注的专题有了新文章
 * 3.用户
 *  3.1 关注的用户发布了新的问题
 * */
exports.notifications = {
    SYSTEM_NOTIFICATION : 'system_notification',    //系统通知
    SYSTEM_ACTIVITY     : 'system_activity',        //系统活动通知

    USER_QUESTION_BEEN_STICKIED   : 'user_question_been_stickied',                //用户发布的问题被管理员加精
    USER_QUESTION_BEEN_DELETED   : 'user_question_been_deleted',                  //用户发布的问题被管理员删除
    USER_QUESTION_BEEN_ANSWERED   : 'user_question_been_answered',                //用户发布的问题被回答
    USER_QUESTION_BEEN_ATTENTION  : 'user_question_been_attention',               //用户发布的问题被关注
    USER_QUESTION_BEEN_SHARED     : 'user_question_been_shared',                  //用户发布的问题被分享

    USER_ANSWER_BEEN_FAVOURED : 'user_answer_been_favoured',   //用户发表的回答被赞
    USER_ANSWER_BEEN_COMMEND  : 'user_answer_been_commend',    //用户发表的回答被评论
    
    SUBJECT_HAS_NEW_ARTICLE   : 'subject_has_new_article',      //专题有了新的文章
    USER_PUBLISH_NEW_QUESTION : 'user_publish_new_question',    //发布了新的问题

    USER_BEEN_ATTENTION : 'user_been_attention',                //用户被关注
};