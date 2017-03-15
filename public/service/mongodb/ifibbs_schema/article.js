/**
 * @author synder on 2017/2/17
 * @copyright
 * @desc
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

//用户===================================================
const ArticleSchema = new Schema({
    status          : {type: Number,  required: true},    //文章状态
    top             : {type: Boolean, required: true},    //是否置顶
    order           : {type: Number, required: true},     //显示顺序
    recommend       : {type: Boolean, required: true},    //是否推荐
    title           : {type: String,  required: true},    //文章标题
    summary         : {type: String,  required: true},    //文章摘要
    icon            : {type: String,  required: true},    //文章图标
    cover           : {type: String,  required: true},    //封面图片
    tags            : {type: Array,   required: true},    //文章标签
    content         : {type: String,  required: true},    //文章内容
    browse_count    : {type: Number,  required: true},    //浏览次数
    favour_count    : {type: Number,  required: true},    //被赞次数
    comment_count   : {type: Number,  required: true},    //被评论次数
    collect_count   : {type: Number,  required: true},    //被收藏次数
    create_time     : {type: Date,    required: true},    //创建时间
    update_time     : {type: Date,    required: true},    //更新时间
    subject_id      : {type: ObjectId, required: true, ref: 'Subject'},  //文章所属主题
    create_user_id  : {type: ObjectId, required: false, ref: 'User'}      //创建人
});

ArticleSchema.virtual('id', function () {
    return this._id.toString();
});

ArticleSchema.index({create_time : 1});
ArticleSchema.index({status : 1});

//文章状态
ArticleSchema.statics.STATUS = {
    UNPUBLISHED : -1,   //未发布
    PUBLISHED : 1,      //已发布
    DELETED: 0,         //已删除
};


//文章评论
const ArticleCommentSchema = new Schema({
    status          : {type: Number,  required: true},    //文章状态
    content         : {type: String,  required: true},    //评论内容
    favour_count    : {type: Number,  required: true},    //评论点赞数
    create_time     : {type: Date,    required: true},    //创建时间
    update_time     : {type: Date,    required: true},    //更新时间
    article_id      : {type: ObjectId, required: false, ref: 'Article'},  //文章ID
    create_user_id  : {type: ObjectId, required: false, ref: 'User'}      //创建人
});

ArticleCommentSchema.virtual('id', function () {
    return this._id.toString();
});

ArticleCommentSchema.index({create_time : 1});
ArticleCommentSchema.index({create_user_id : 1});
ArticleCommentSchema.index({article_id : 1});

//文章状态
ArticleCommentSchema.statics.STATUS = {
    DISABLE : 0,     //不可用
    ENABLE : 1,      //可用
};



exports.ArticleSchema = ArticleSchema;
exports.ArticleCommentSchema = ArticleCommentSchema;

