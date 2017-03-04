/**
 * @author synder on 2017/3/4
 * @copyright
 * @desc
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//用户动态
const UserDynamicSchema = new Schema({
    status: {type: Number, required: true},
    type: {type: Number, required: true},
    user_id: {type: ObjectId, required: true, ref: 'User'},
    question: {type: ObjectId, required: false, ref: 'Question'},
    answer: {type: ObjectId, required: false, ref: 'QuestionAnswer'},
    subject: {type: ObjectId, required: false, ref: 'Subject'},
    article:  {type: ObjectId, required: false, ref: 'Article'},
    create_time: {type: Date, required: true},
    update_time: {type: Date, required: true},
});

UserDynamicSchema.index({user_id: 1});

UserDynamicSchema.statics.STATUS = {
    ENABLE: 1,
    DISABLE: 0
};

UserDynamicSchema.statics.TYPE = {
    PUBLISH_QUESTION: 100,      //发布问题
    ANSWER_QUESTION: 101,       //回答了问题
    COMMENT_ANSWER: 102,        //评论了回答
    ATTENTION_QUESTION: 200, //关注了问题
    ATTENTION_SUBJECT: 201,  //关注了专题
    ATTENTION_USER: 202,     //关注了用户
    FAVOUR_ANSWER: 300,        //赞了回答
    FAVOUR_COMMENT: 301,       //赞了评论
    FAVOUR_ARTICLE: 302,       //赞了文章
    SHARE_QUESTION: 400,    //分享了问题
    SHARE_ARTICLE: 401,     //分享了文章
};

exports.UserDynamicSchema = UserDynamicSchema;