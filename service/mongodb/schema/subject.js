/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc 专题
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//用户===================================================
const SubjectSchema = new Schema({
    title          : {type: String, required: true},   //专题名称
    describe       : {type: String, required: true},   //专题描述
    icon           : {type: String, required: true},   //专题图标URL
    cover          : {type: String, required: true},   //专题封面图URL
    status         : {type: Number, required: true},   //专题状态
    display_order  : {type: Number, required: true},   //专题显示顺序
    create_time    : {type: Date, required: true},     //创建时间
    update_time    : {type: Date, required: true},     //更新时间
});

SubjectSchema.virtual('id').get(function () {
    return this._id.toString();
});

SubjectSchema.index({create_time : 1});

SubjectSchema.pre('validate', function (next) {
    if(!this.create_time){
        this.create_time = new Date();
    }

    if(!this.update_time){
        this.update_time = new Date();
    }

    next();
});

//回答状态
SubjectSchema.statics.STATUS = {
    ENABLE : 1,   //正常显示
    DISABLE : 0   //隐藏
};

exports.SubjectSchema = SubjectSchema;