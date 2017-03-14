/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const async = require('async');
const userModel = require('../../../public/model/ifibbs/user');

/**
 * @desc 获取用户统计数据
 * */
exports.getUserStatisticsData = function (req, res, next) {
    
    let userID = req.query.user_id;

    async.parallel({
        
        userAttentionUserCount: function(cb) {
            userModel.getUserAttentionOtherUserCount(userID, cb);
        },
        
        userBeenAttentionCount: function(cb) { 
            userModel.getUserBeenAttentionUserCount(userID, cb);
        },
        
        userBeenFavouredCount: function(cb) {
            userModel.getUserBeenFavouredCount(userID, cb)
        },
    }, function (err, results) {
    
        if(err){
             return next(err);
        }
        
        let userAttentionUserCount = results.userAttentionUserCount;
        let userBeenAttentionCount = results.userBeenAttentionCount;
        let userBeenFavouredCount = results.userBeenFavouredCount;

        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: true,
                failed_message: null,
                success_message: null,
                be_favour_count: userBeenFavouredCount,
                be_attention_count: userBeenAttentionCount,
                favour_user_count: userAttentionUserCount,
            }
        });
        
    });
    
};