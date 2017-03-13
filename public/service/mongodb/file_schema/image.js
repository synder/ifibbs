/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//图片===================================================
const ImageFileSchema = new Schema({
    status          : {type: Number, required: true},   //图片状态
    belong_app      : {type: Number, required: true},   //所属APP
    file_size       : {type: Number, required: true},   //图片大小
    file_path       : {type: String, required: true},   //回答内容
    file_name       : {type: String, required: true},   //图片名称
    create_time     : {type: Date,   required: true},   //创建时间
    update_time     : {type: Date,   required: true},   //更新时间
});

ImageFileSchema.virtual('id', function () {
    return this._id.toString();
});

ImageFileSchema.index({file_name : 1, unique: true});


//文件状态
ImageFileSchema.statics.STATUS = {
    ENABLE : 1,
    DISABLE : 0,
};

exports.ImageFileSchema = ImageFileSchema;
