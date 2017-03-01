/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const subjectModel = require('../../../public/model/subject');
const attentionModel = require('../../../public/model/attention');

/**
 * @desc 获取专题列表
 * */
exports.getSubjectList = function(req, res, next){
    
    let pageSkip = req.query.page_skip;
    let pageSize = req.query.page_size;
    

    subjectModel.getSubjectList(function (err, results) {
        
        if(err){
            return next(err);
        }
        
        let count = results.count;
        let subjects = results.subjects;

        subjects = subjects.map(function (subject) {
            return {
                id : subject._id,
                title : subject.title,
                describe : subject.describe,
                icon : subject.icon,
                cover : subject.cover,
            };
        });
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                count : count,
                list: subjects
            }
        });
        
    });
};


/**
 * @desc 获取专题详情
 * */
exports.getSubjectDetail = function(req, res, next){

    let subjectID = req.query.subject_id;
    let userID = req.session.id;

    if(!subjectID){
        return next(new BadRequestError('subject_id is needed'));
    }
    
    subjectModel.getSubjectDetail(subjectID, function (err, subject) {

        if(err){
            return next(err);
        }
        
        if(!subject){
            return res.json({
                flag: '0000',
                msg: '',
                result: null
            });
        }
        
        let result = {
            id : subject._id,
            title : subject.title,
            describe : subject.describe,
            icon : subject.icon,
            cover : subject.cover,
            is_attention: false //是否关注
        };
        
        if(!userID){
            return res.json({
                flag: '0000',
                msg: '',
                result: result
            });
        }
        
        attentionModel.findUserAttentionBySubjectID(userID, subjectID, function (err, attention) {
            if(err){
                return next(err);
            }

            result.is_attention = !!attention;

            res.json({
                flag: '0000',
                msg: '',
                result: result
            });
        });
    });
};