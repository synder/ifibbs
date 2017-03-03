/**
 * @author synder on 2017/3/2
 * @copyright
 * @desc
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const RecommendQuestionSchema = {
    question_id: {type: ObjectId, required: false, ref: 'Question'},
    answer_id: {type: ObjectId, required: false, ref: 'QuestionAnswer'},
    answer_user_id: {type: ObjectId, required: false, ref: 'User'},
};

const RecommendActivitySchema = {
    activity_id: {type: ObjectId, required: false, ref: 'Activity'},
};

const RecommendArticleSchema = {
    article_id: {type: ObjectId, required: false, ref: 'Article'},
};


//问题===================================================
const RecommendSchema = new Schema({
    status      : {type: Number, required: true},   //状态
    order       : {type: Number, required: true},   //排序方式
    type        : {type: Number, required: true},   //排序方式
    create_time : {type: Date, required: true},     //排序方式
    update_time : {type: Date, required: true},     //排序方式
    question    : RecommendQuestionSchema,          //推荐问题
    activity    : RecommendActivitySchema,          //推荐活动
    article     : RecommendArticleSchema,           //推荐文章
});


RecommendSchema.virtual('id').get(function () {
    return this._id.toString();
});

RecommendSchema.index({order: -1, create_time : -1});

//推荐状态
RecommendSchema.statics.STATUS = {
    LOCK : -1,
    REMOVED: 0,
    NORMAL : 1
};

//推荐类型
RecommendSchema.statics.TYPE = {
    QUESTION : 1, //问题
    ACTIVITY : 2,  //活动
    ARTICLE : 3,  //文章
    SUBJECT : 4,  //专题
};

exports.RecommendSchema = RecommendSchema;