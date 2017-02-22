/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc 用户收藏
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


//文章=======================================================
const UserCollectionSchema = new Schema({
    status    : {type: Boolean, required: true},  //收藏状态
    type      : {type: Number, required: true},   //收藏类型
    create_time : {type: Date, required: true},   //创建时间
    update_time : {type: Date, required: true},   //更新时间
    question_id : {type: ObjectId, required: false, ref: 'Question'},        //收藏对象ID
    answer_id   : {type: ObjectId, required: false, ref: 'QuestionAnswer'},  //收藏对象ID
    subject_id  : {type: ObjectId, required: false, ref: 'Article'},         //收藏对象ID
    article_id  : {type: ObjectId, required: false, ref: 'Article'},         //收藏对象ID
    user_id     : {type: ObjectId, required: true, ref: 'User'},             //收藏用户ID
});

UserCollectionSchema.virtual('id', function () {
    return this._id.toString();
});

UserCollectionSchema.index({user_id : 1, target_id: 1});

UserCollectionSchema.pre('validate', function (next) {
    if(!this.create_time){
        this.create_time = new Date();
    }

    if(!this.update_time){
        this.update_time = new Date();
    }

    next();
});


//点赞状态
UserCollectionSchema.statics.STATUS = {
    COLLECTED : true,        //已经收藏
    UNCOLLECTED : false      //未收藏
};


//点赞状态
UserCollectionSchema.statics.TYPES = {
    ANSWER : 1,      //收藏回答
    ARTICLE : 2      //收藏文章
};



exports.UserCollectionSchema = UserCollectionSchema;