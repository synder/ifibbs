/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc 用户收藏
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


//文章=======================================================
const UserArticleCollectionSchema = new Schema({
    status    : {type: Number, required: true},   //收藏状态
    create_time : {type: Date, required: true},   //创建时间
    update_time : {type: Date, required: true},   //更新时间
    subject_id  : {type: ObjectId, required: false, ref: 'Article'},         //收藏对象ID
    article_id  : {type: ObjectId, required: true, ref: 'Article'},          //收藏对象ID
    user_id     : {type: ObjectId, required: true, ref: 'User'},             //收藏用户ID
});

UserArticleCollectionSchema.virtual('id', function () {
    return this._id.toString();
});

UserArticleCollectionSchema.index({user_id : 1, article_id: 1});


//点赞状态
UserArticleCollectionSchema.statics.STATUS = {
    COLLECTED : 1,        //已经收藏
    UNCOLLECTED : 0       //未收藏
};

//回答========================================================
const UserAnswerCollectionSchema = new Schema({
    status    : {type: Number, required: true},   //收藏状态
    create_time : {type: Date, required: true},   //创建时间
    update_time : {type: Date, required: true},   //更新时间
    question_id : {type: ObjectId, required: true, ref: 'Question'},         //收藏对象ID
    answer_id   : {type: ObjectId, required: true, ref: 'QuestionAnswer'},   //收藏对象ID
    user_id     : {type: ObjectId, required: true, ref: 'User'},             //收藏用户ID
});

UserAnswerCollectionSchema.virtual('id', function () {
    return this._id.toString();
});

UserAnswerCollectionSchema.index({user_id : 1, answer_id: 1});


//点赞状态
UserAnswerCollectionSchema.statics.STATUS = {
    COLLECTED : 1,        //已经收藏
    UNCOLLECTED : 0       //未收藏
};



exports.UserArticleCollectionSchema = UserArticleCollectionSchema;
exports.UserAnswerCollectionSchema = UserAnswerCollectionSchema;