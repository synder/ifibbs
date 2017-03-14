/**
 * @author synder on 2017/3/7
 * @copyright
 * @desc 用户举报
 */

const complaintModel = require('../../../public/model/ifibbs/complaint');

/**
 * @desc 用户举报
 * type == 1 //举报问题
 * type == 2 //举报回答
 * type == 3 //举报回答评论
 * type == 4 //举报用户
 * */
exports.userComplaint = function (req, res, next) {
    
    let userID = req.session.id;
    
    let type = req.body.type;
    let reason = req.body.reason; //举报原因
    let complaintID = req.body.complaint_id; //举报原因
    
    if(type != 1 && type != 2 && type != 3 && type != 4){
        return next(new BadRequestError('type should be in [1,2,3,4]'));
    }
    
    if(!reason){
        return next(new BadRequestError('reason is need'));
    }

    if(!complaintID){
        return next(new BadRequestError('complaint_id is need'));
    }

    complaintModel.createNewComplaint(userID, type, reason, complaintID, function (err, complaint) {
        if(err){
            return next(err);
        }
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                ok: !!complaint._id,
                failed_message: !!complaint._id ? null : '举报失败',
                success_message: !!complaint._id ? '举报成功' : null,
                complaint_id: complaint._id
            }
        });
    });
};