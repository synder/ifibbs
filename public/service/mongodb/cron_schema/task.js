/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ErrorSchema = {
    code    : {type: String},
    msg     : {type: String},
    stack   : {type: String}
};

//图片===================================================
const CronTaskLogSchema = new Schema({
    type            : {type: Number, required: true},   //
    start_at        : {type: Date, required: false},   //启动时间
    stop_at         : {type: Date, required: false},   //停止时间
    job_name        : {type: String, required: true},  //job名称
    errors          : {type: [ErrorSchema]}
});

CronTaskLogSchema.virtual('id', function () {
    return this._id.toString();
});

CronTaskLogSchema.index({file_name : 1, unique: true});


//文件状态
CronTaskLogSchema.statics.TYPES = {
    START : 1,
    STOP  : 2,
    CRASH : 3
};

exports.CronTaskLogSchema = CronTaskLogSchema;
