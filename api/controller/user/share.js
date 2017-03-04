/**
 * @author synder on 2017/3/4
 * @copyright
 * @desc
 */

const async = require('async');

const shareModel = require('../../../public/model/share');

/**
 * @desc 创建分享
 * */
exports.createUserShare = function (req, res, next) {
    let shareType = req.body.share_type;
    let shareID = req.body.share_id;
    
    let userID = req.session.id;
    
    if(!shareType){
        return next(new BadRequestError('share_type is need'));
    }

    if(shareType !== 'article' && shareType !== 'question'){
        return next(new BadRequestError('share_type must in ["article", "question"]'));
    }
    
    if(!shareID){
        return next(new BadRequestError('share_id is need'));
    }
    
    async.waterfall([
        function(cb) {
            if(shareType === 'article'){
                shareModel.createUserShareArticle(userID, shareID, cb);
            }else{
                shareModel.createUserShareQuestion(userID, shareID, cb);
            }
        }
    ], function (err, result) {
        if(err){
            return next(err);
        }

        res.json({
            flag: '0000',
            msg: '',
            result:{
                ok: true
            }
        });
    });
};