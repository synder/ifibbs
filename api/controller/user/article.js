/**
 * @author synder on 2017/3/9
 * @copyright
 * @desc
 */


const articleModel = require('../../../public/model/ifibbs/article');

/**
 * @desc 文章新增评论
 * */
exports.addCommentToArticle = function (req, res, next) {
    let userID = req.session.id;
    
    let articleID = req.body.article_id;
    let commentContent = req.body.comment;

    articleModel.createNewComment(userID, articleID, commentContent, function (err, comment) {
        if(err){
            return next(err);
        }
        
        res.json({
            flag: '0000',
            msg: '',
            result: {
                comment_id: comment._id
            }
        });
    });
};