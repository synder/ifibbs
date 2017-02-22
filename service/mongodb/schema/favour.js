/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc 用户点赞
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//文章===================================================
const UserFavourArticleSchema = new Schema({
    status    : {type: Boolean, required: true},    //点赞状态
    create_time : {type: Date, required: true},    //创建时间
    update_time : {type: Date, required: true},    //更新时间
    target_id : {type: ObjectId, required: true, ref: 'Article'}, //点赞对象ID
    user_id   : {type: ObjectId, required: true, ref: 'User'},    //点赞用户ID
});

UserFavourArticleSchema.virtual('id', function () {
    return this._id.toString();
});

UserFavourArticleSchema.index({user_id : 1, target_id: 1});

UserFavourArticleSchema.pre('validate', function (next) {
    if(!this.create_time){
        this.create_time = new Date();
    }

    if(!this.update_time){
        this.update_time = new Date();
    }

    next();
});

//点赞状态
UserFavourArticleSchema.statics.STATUS = {
    UNFAVOUR : false, //取消点赞
    FAVOUR : true     //点赞
};


//回答===================================================
const UserFavourAnswerSchema = new Schema({
    status    : {type: Boolean, required: true},    //点赞状态
    create_time : {type: Date, required: true},    //创建时间
    update_time : {type: Date, required: true},    //更新时间
    target_id : {type: ObjectId, required: true, ref: 'QuestionAnswer'}, //点赞对象ID
    user_id   : {type: ObjectId, required: true, ref: 'User'},    //点赞用户ID
});

UserFavourAnswerSchema.virtual('id', function () {
    return this._id.toString();
});

UserFavourAnswerSchema.index({user_id : 1, target_id: 1});

UserFavourAnswerSchema.pre('validate', function (next) {
    if(!this.create_time){
        this.create_time = new Date();
    }

    if(!this.update_time){
        this.update_time = new Date();
    }

    next();
});

//点赞状态
UserFavourAnswerSchema.statics.STATUS = {
    UNFAVOUR : false, //取消点赞
    FAVOUR : true     //点赞
};


//评论===================================================
const UserFavourAnswerCommentSchema = new Schema({
    status    : {type: Boolean, required: true},    //点赞状态
    create_time : {type: Date, required: true},    //创建时间
    update_time : {type: Date, required: true},    //更新时间
    target_id : {type: ObjectId, required: true, ref: 'AnswerComment'}, //点赞对象ID
    user_id   : {type: ObjectId, required: true, ref: 'User'},    //点赞用户ID
});

UserFavourAnswerCommentSchema.virtual('id', function () {
    return this._id.toString();
});

UserFavourAnswerCommentSchema.index({user_id : 1, target_id: 1});

UserFavourAnswerCommentSchema.pre('validate', function (next) {
    if(!this.create_time){
        this.create_time = new Date();
    }

    if(!this.update_time){
        this.update_time = new Date();
    }

    next();
});

//点赞状态
UserFavourAnswerCommentSchema.statics.STATUS = {
    UNFAVOUR : false, //取消点赞
    FAVOUR : true     //点赞
};

exports.UserFavourArticleSchema = UserFavourArticleSchema;
exports.UserFavourAnswerSchema = UserFavourAnswerSchema;
exports.UserFavourAnswerCommentSchema = UserFavourAnswerCommentSchema;
