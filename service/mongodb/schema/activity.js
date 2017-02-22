/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//用户===================================================
const ActivitySchema = new Schema({
    status          : {type: Number, required: true},   //回答状态
    title           : {type: String, required: true},   //回答内容
    cover           : {type: String, required: true},   //封面图片URL
    describle       : {type: String, required: true},   //封面图片URL
    url             : {type: String, required: false},  //活动地址URL
    favour_count    : {type: Number, required: true},   //点赞数量
    comment_count   : {type: Number, required: true},   //评论数量
    collect_count   : {type: Number, required: true},   //收藏数量
    create_time     : {type: Date, default: Date.now, required: true},     //创建时间
    update_time     : {type: Date, default: Date.now, required: true},     //更新时间
},{
    timestamps: {
        createdAt: 'create_time',
        updatedAt: 'update_time',
    }
});

ActivitySchema.virtual('id', function () {
    return this._id.toString();
});

ActivitySchema.index({create_time : 1});


//回答状态
ActivitySchema.statics.STATUS = {
    DELETED : 0,
    DISPLAY : 1,
    HIDDEN  : -1,
};

exports.ActivitySchema = ActivitySchema;
