/**
 * @author synder on 2017/2/21
 * @copyright
 * @desc
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;



//标签===================================================
const QuestionTagSchema = new Schema({
    status     : {type: Number, required: true},   //状态
    title      : {type: String,  required: true},  //标签名称
    icon       : {type: String, required: true},   //标签图标
    describe   : {type: String, required: true},   //问题描述
    create_time   : {type: Date, required: true},  //创建时间
    update_time   : {type: Date, required: true},  //更新时间
});


QuestionTagSchema.virtual('id').get(function () {
    return this._id;
});

QuestionTagSchema.index({status : 1});

//标签状态
QuestionTagSchema.statics.STATUS = {
    DISABLE : 0,   //不可用
    ENABLE : 1,    //可用
    RECOMMEND: 2   //推荐
};

exports.QuestionTagSchema = QuestionTagSchema;