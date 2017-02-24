/**
 * @author synder on 2017/2/24
 * @copyright
 * @desc
 */

 const mongoose = require('mongoose');
 
 const Schema = mongoose.Schema;
 const ObjectId = Schema.Types.ObjectId;
 
 const UserDeviceSchema = new Schema({
     
     status       : {type: Number, required: true},
     create_time  : {type: Date,   required: true},    //创建时间
     update_time  : {type: Date,   required: true},    //更新时间
 });

UserDeviceSchema.virtual('id', function () {
     return this._id.toString();
 });

UserDeviceSchema.index({status : 1});
 
 exports.UserDeviceSchema = UserDeviceSchema;