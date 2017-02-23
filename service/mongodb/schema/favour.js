/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc 用户点赞
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const STATUS = {
    UNFAVOUR : 0,  //取消点赞
    FAVOUR : 1     //点赞
};

//文章===================================================
const UserFavourArticleSchema = new Schema({
    status      : {type: Number, required: true},    //点赞状态
    create_time : {type: Date, required: true, default: Date.now},    //创建时间
    update_time : {type: Date, required: true, default: Date.now},    //更新时间
    article_id  : {type: ObjectId, required: true,  ref: 'Article'},    //点赞对象ID
    subject_id  : {type: ObjectId, required: false, ref: 'Subject'},    //点赞对象ID
    user_id     : {type: ObjectId, required: true,  ref: 'User'},       //点赞用户ID
});

UserFavourArticleSchema.virtual('id', function () {
    return this._id.toString();
});

UserFavourArticleSchema.index({user_id : 1, target_id: 1});


//点赞状态
UserFavourArticleSchema.statics.STATUS = STATUS;


//回答===================================================
const UserFavourAnswerSchema = new Schema({
    status    : {type: Number, required: true},    //点赞状态
    create_time : {type: Date, required: true},    //创建时间
    update_time : {type: Date, required: true},    //更新时间
    answer_id   : {type: ObjectId, required: true, ref: 'QuestionAnswer'},  //点赞对象ID
    qestion_id  : {type: ObjectId, required: true, ref: 'Question'}, //点赞对象ID
    user_id     : {type: ObjectId, required: true, ref: 'User'},    //点赞用户ID
});

UserFavourAnswerSchema.virtual('id', function () {
    return this._id.toString();
});

UserFavourAnswerSchema.index({user_id : 1, answer_id: 1});

//点赞状态
UserFavourAnswerSchema.statics.STATUS = STATUS;


//评论===================================================
const UserFavourAnswerCommentSchema = new Schema({
    status      : {type: Number, required: true},    //点赞状态
    create_time : {type: Date,   required: true},    //创建时间
    update_time : {type: Date,   required: true},    //更新时间
    comment_id  : {type: ObjectId, required: true, ref: 'AnswerComment'}, //点赞对象ID
    answer_id   : {type: ObjectId, required: true, ref: 'QuestionAnswer'}, //点赞对象ID
    user_id     : {type: ObjectId, required: true, ref: 'User'},    //点赞用户ID
});

UserFavourAnswerCommentSchema.virtual('id', function () {
    return this._id.toString();
});

UserFavourAnswerCommentSchema.index({user_id : 1, target_id: 1});

//点赞状态
UserFavourAnswerCommentSchema.statics.STATUS = STATUS;

exports.UserFavourArticleSchema = UserFavourArticleSchema;
exports.UserFavourAnswerSchema = UserFavourAnswerSchema;
exports.UserFavourAnswerCommentSchema = UserFavourAnswerCommentSchema;
