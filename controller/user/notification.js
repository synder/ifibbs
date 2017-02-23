/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const notificationModel=require('../../model/notification');

/**
 * @desc 获取用户系统通知
 * */
exports.getUserSystemNotification = function(req, res, next){
    let pageIndex = req.query.page_index;
    let pageSize = req.query.page_size;
    let pageSkip=req.query.page_skip;
    let userId=req.session.id;

    notificationModel.getSysNotificationList(userId,pageSkip,pageSize,function (err, results) {
        if(err){
            return next(err);
        }
        let count = results.count;
        let list = [];

        results.list.forEach((l)=>{
            list.push({
            "id":l._id,
            "title": l.title,
            "content": l.content,
            "type": l.type, //1 发布了问题
            "add_on": l.target_id?l.target_id:null
        })
    });
        res.json({
            "flag": "0000",
            "msg": "",
            "result": {
                "count":count,
                "list":list
            }
        })
    });
};


/**
 * @desc 获取用户业务通知
 * */
exports.getUserBusinessNotification = function(req, res, next){
    let pageIndex = req.query.page_index;
    let pageSize = req.query.page_size;
    let pageSkip = req.query.page_skip;
    let userId = req.session.id;

    notificationModel.getBusNotificationList(userId,pageSkip,pageSize,(err,results)=>{
        if(err){
            return next(err);
        }
        let count = results.count;
    let list = [];
    results.list.forEach((l)=>{
        list.push({
            "id":l._id,
            "title": l.title,
            "content": l.content,
            "type": l.type, //1 发布了问题
            "add_on": l.target_id?l.target_id:null
        })
    });
    res.json({
        "flag": "0000",
        "msg": "",
        "result": {
            "count":count,
            "list":list
        }
    })
});
};


/**
 * @desc 标记通知为已读
 * */
exports.changeNotificationToReaded = function (req, res, next) {
    let notificationIDS = req.body.notification_ids;
    let userID = req.session.id;

    notificationModel.changeNotificationToReaded(userID,notificationIDS,(err,success)=>{
        if(err){
            return next(err);
        }
        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: success
            }
        });
    })

};

