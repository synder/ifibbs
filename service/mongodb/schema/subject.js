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
    create_time    : {type: Date, default: Date.now, required: true},     //创建时间
    update_time    : {type: Date, default: Date.now, required: true},     //更新时间
}, {
    timestamps: {
        createdAt: 'create_time',
        updatedAt: 'update_time',
    }
});

SubjectSchema.virtual('id').get(function () {
    return this._id.toString();
});

SubjectSchema.index({create_time : 1});


//回答状态
SubjectSchema.statics.STATUS = {
    ENABLE : 1,   //正常显示
    DISABLE : 0   //隐藏
};

exports.SubjectSchema = SubjectSchema;