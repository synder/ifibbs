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
    status    : {type: Number, required: true},   //收藏状态
    type      : {type: Number, required: true},   //收藏类型
    create_time : {type: Date, default: Date.now, required: true},   //创建时间
    update_time : {type: Date, default: Date.now, required: true},   //更新时间
    question_id : {type: ObjectId, required: false, ref: 'Question'},        //收藏对象ID
    answer_id   : {type: ObjectId, required: false, ref: 'QuestionAnswer'},  //收藏对象ID
    subject_id  : {type: ObjectId, required: false, ref: 'Article'},         //收藏对象ID
    article_id  : {type: ObjectId, required: false, ref: 'Article'},         //收藏对象ID
    user_id     : {type: ObjectId, required: true, ref: 'User'},             //收藏用户ID
}, {
    timestamps: {
        createdAt: 'create_time',
        updatedAt: 'update_time',
    }
});

UserCollectionSchema.virtual('id', function () {
    return this._id.toString();
});

UserCollectionSchema.index({user_id : 1, target_id: 1});


//点赞状态
UserCollectionSchema.statics.STATUS = {
    COLLECTED : 1,        //已经收藏
    UNCOLLECTED : 0       //未收藏
};


//点赞状态
UserCollectionSchema.statics.TYPES = {
    ANSWER : 1,      //收藏回答
    ARTICLE : 2      //收藏文章
};



exports.UserCollectionSchema = UserCollectionSchema;