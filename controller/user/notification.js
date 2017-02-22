/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */


/**
 * @desc 获取用户系统通知
 * */
exports.getUserSystemNotification = function(req, res, next){
    let pageIndex = req.query.page_index;
    let pageSize = req.query.page_size;

    res.json({
        "flag": "0000",
        "msg": "",
        "result": {
            "count": 2,
            "list": [
                {
                    "id": "",
                    "title": "通知标题",
                    "content": "通知内容",
                    "type": 1, //1 发布了问题
                    "add_on": "问题ID",
                },
                {
                    "id": "",
                    "title": "通知标题",
                    "content": "通知内容",
                    "type": 2, //2 问题被管理员加精
                    "add_on": "问题ID",
                },
                {
                    "id": "",
                    "title": "通知标题",
                    "content": "通知内容",
                    "type": 3, //3 问题不管理员删除
                    "add_on": "问题ID",
                },
                {
                    "id": "",
                    "title": "通知标题",
                    "content": "通知内容",
                    "type": 4, //4 活动通知
                    "add_on": "活动url",
                }
            ]
        }
    });
};


/**
 * @desc 获取用户业务通知
 * */
exports.getUserBusinessNotification = function(req, res, next){
    let pageIndex = req.query.page_index;
    let pageSize = req.query.page_size;

    res.json({
        "flag": "0000",
        "msg": "",
        "result": {
            "count": 2,
            "list": [
                {
                    "id": "",
                    "title": "通知标题",
                    "content": "通知内容",
                    "type": 1, //1 问题被评论
                    "add_on": "问题ID",
                },
                {
                    "id": "",
                    "title": "通知标题",
                    "content": "通知内容",
                    "type": 2, //2 回答被赞
                    "add_on": "问题ID",
                },
                {
                    "id": "",
                    "title": "通知标题",
                    "content": "通知内容",
                    "type": 3, //3 问题被分享
                    "add_on": "问题ID",
                },
                {
                    "id": "",
                    "title": "通知标题",
                    "content": "通知内容",
                    "type": 4, //4 回答被分享
                    "add_on": "问题ID",
                },
            ]
        }
    });
};