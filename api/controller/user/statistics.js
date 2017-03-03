/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

/**
 * @desc 获取用户统计数据
 * */
exports.getUserStatisticsData = function (req, res, next) {
    
    
    
    res.json({
        flag: '0000',
        msg: '',
        result: {
            be_favour_count: 1,
            be_attention_count: 1,
            favour_user_count: 10,
        }
    });
};