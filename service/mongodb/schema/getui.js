/**
 * @author synder on 2017/2/24
 * @copyright
 * @desc
 */


const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserGeTuiMappingSchema = new Schema({
    getui_app_id        : {type: String, required: true},    //所属的APP_ID
    getui_client_id     : {type: String, required: true},    //个推的CID
    device_token        : {type: String, required: true},    //设备TOKEN
    device_platform     : {type: Number, required: true},    //设备平台
    device_version      : {type: String, required: true},    //设备系统版本
    create_time         : {type: Date,   required: true},    //创建时间
    update_time         : {type: Date,   required: true},    //更新时间
    belong_user_id      : {type: ObjectId, required: false, ref: 'User'},
});

UserGeTuiMappingSchema.virtual('id', function () {
    return this._id.toString();
});

UserGeTuiMappingSchema.index({belong_user_id : 1});
UserGeTuiMappingSchema.index({getui_client_id : 1, unique: true});

UserGeTuiMappingSchema.statics.PLATFORM = {
    ANDROID: 1,
    IOS: 2,
};

exports.UserGeTuiMappingSchema = UserGeTuiMappingSchema;