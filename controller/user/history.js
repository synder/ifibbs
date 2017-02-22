/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const historyModel = require('../../model/history');

/**
 * @desc 用户浏览历史接口
 * */
exports.getUserBrowseHistory = function (req, res, next) {
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    
    let userID = req.session.id;

    historyModel.getUserBrowseHistoryList(userID, pageSkip, pageSize, function (err, result) {
        if(err){
            return next(err);
        }

        let count = result.count;
        let histories = result.histories;

        histories = histories.map(function (history) {
            return {
                id: history._id,
                tags: history.question_id ? history.question_id.tags : [],
                title: history.question_id ? history.question_id.title : null,
                describe: history.question_id ? history.question_id.describe : null,
                user_id: history.user_id ? history.user_id._id : null,
                user_name: history.user_id ? history.user_id.user_name : null,
                user_avatar: history.user_id ? history.user_id.user_avatar : null,
                collect_count: history.collect_count,
                type: history.type
            }
        });
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                count : count,
                list: histories
            }
        });
    });
};