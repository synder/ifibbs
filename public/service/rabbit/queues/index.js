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
    USER_QUESTION_BEEN_ANSWERED: 'user_question_been_answer',                      //问题被回答
    USER_QUESTION_BEEN_SHARED: 'user_question_been_shared',                        //问题被分享
    ATTENTION_QUESTION_BEEN_ANSWERED: 'attention_question_been_answered',          //问题被关注
    ATTENTION_SUBJECT_HAS_NEW_ARTICLE: 'attention_subject_has_new_article',        //专题有新文章
    ATTENTION_USER_PUBLISH_NEW_QUESTION: 'attention_user_publish_new_question',    //问题被关注
};