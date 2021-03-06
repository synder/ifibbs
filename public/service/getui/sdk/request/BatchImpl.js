/**
 * Created by Administrator on 2015/5/13.
 */
const GtReq = require('../getui/GtReq');
const utils = require('../getui/utils');
const GtConfig = require('./GtConfig');

function BatchImpl(appKey, push) {
    this.batchId = utils.uuid();
    this.appKey = appKey;
    this.push = push;
    this.seqId = 0;
    this.innerMsgList = [];
    this.lastPostData = null;
}

BatchImpl.prototype.getBatchId = function () {
    return this.batchId;
};

BatchImpl.prototype.add = function (message, target) {
    if (this.seqId >= 5000) {
        throw new Error("Can not add over 5000 message once! Please call submit() first.");
    } else {
        let json = utils.createPostParams(message, target, null, this.appKey);
        let item = new GtReq.SingleBatchItem({
            'seqId': this.seqId,
            'data': JSON.stringify(json)
        });
        this.innerMsgList.push(item);
        this.seqId += 1;
    }
    return this.seqId;
};

BatchImpl.prototype.submit = function (callback) {
    let requestId = utils.uuid();

    let data = {
        'requestId': requestId,
        'appkey': this.appKey,
        'action': 'pushMessageToSingleBatchAction',
        'serialize': 'pb',
        'async': GtConfig.isPushSingleBatchAsync()
    };

    try {
        let request = new GtReq.SingleBatchRequest({
            'batchId': this.batchId,
            'batchItem': this.innerMsgList
        });
        data.singleDatas = request.toBase64();
        this.push.httpPostJson(this.push._host, data, true, callback);
    } finally {
        this.seqId = 0;
        this.innerMsgList = [];
        this.lastPostData = data;
    }

};

BatchImpl.prototype.retry = function (callback) {
    this.push.httpPostJson(this.push._host, this.lastPostData, true, callback);
};

module.exports = BatchImpl;