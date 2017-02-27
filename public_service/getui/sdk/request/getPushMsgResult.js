'use strict';

const utils = require('../getui/utils');
const httpManager = require('./httpManager');

//填写mastersecret
const MASTERSECRET = "TBokfpttQJ6aHIhBE9y867";
//填写appkey
const APPKEY = "tpDVam96sY8pxhwBupJ462";
//填写taskId
const TASKID = "OSA-0317_P27U10hFHD95qKFxvfoKN5";
const HOST = "http://sdk.open.api.igexin.com/apiex.htm";
getPushMsgResult(HOST, APPKEY, MASTERSECRET, TASKID, function (err, data) {
    console.log(data);
});

function getPushMsgResult(url, Appkey, masterSecret, taskId, callback) {
    let str = masterSecret + 'action' + 'getPushMsgResult' + 'appkey' + Appkey + 'taskId' + taskId;
    let sign = utils.md5(str);
    let postData = {
        action: 'getPushMsgResult',
        appkey: Appkey,
        taskId: taskId,
        sign: sign
    };
    httpManager.post(url, postData, function (err, data) {  //返回一个JSON格式的数据
        callback && callback(err, data);
    });
}

