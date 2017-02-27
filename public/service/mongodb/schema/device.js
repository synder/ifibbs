/**
 * @author synder on 2017/2/24
 * @copyright
 * @desc
 */

 const mongoose = require('mongoose');
 
 const Schema = mongoose.Schema;
 const ObjectId = Schema.Types.ObjectId;
 
 const UserDeviceSchema = new Schema({
     device_token        : {type: String, required: true},    //设备的TOKEN
     device_platform     : {type: Number, required: true},    //设备平台
     device_resolution   : {type: Array,  required: true},    //设备分辨率
     device_brand        : {type: String, required: true},    //品牌名称
     device_version      : {type: String, required: true},    //系统版本
     create_time         : {type: Date,   required: true},    //创建时间
     update_time         : {type: Date,   required: true},    //更新时间
     belong_user_id      : {type: ObjectId, required: false, ref: 'User'}, //有可能不绑定个人信息
 });

UserDeviceSchema.virtual('id', function () {
     return this._id.toString();
 });

UserDeviceSchema.index({belong_user_id : 1});
UserDeviceSchema.index({device_token : 1, unique: true});

UserDeviceSchema.statics.PLATFORM = {
    ANDROID: 1,
    IOS: 2,
};
 
 exports.UserDeviceSchema = UserDeviceSchema;