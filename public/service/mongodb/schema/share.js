/**
 * @author synder on 2017/3/4
 * @copyright
 * @desc
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//用户动态
const UserShareSchema = new Schema({
    status: {type: Number, required: true},
    type: {type: Number, required: true},
    user_id: {type: ObjectId, required: true, ref: 'User'},
    question: {type: ObjectId, required: false, ref: 'Question'},
    article:  {type: ObjectId, required: false, ref: 'Article'},
    create_time: {type: Date, required: true},
    update_time: {type: Date, required: true},
});

UserShareSchema.index({user_id: 1});

UserShareSchema.statics.STATUS = {
    ENABLE: 1,
    DISABLE: 0
};

UserShareSchema.statics.TYPES = {
    SHARE_QUESTION: 1,    //分享了问题
    SHARE_ARTICLE: 2,     //分享了文章
};

exports.UserShareSchema = UserShareSchema;