/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const mongoose = require('mongoose');

const config = require('../config');

mongoose.Promise = global.Promise;

if(!config && !config.mongodb && config.mongodb.ifibbs){
    throw new Error('please provide mongodb config');
}

const IFIBBS_CONFIG = config.mongodb.ifibbs;


const ifibbs = mongoose.createConnection(IFIBBS_CONFIG.url, {
    user: IFIBBS_CONFIG.user,
    pass: IFIBBS_CONFIG.password
});

ifibbs.on('error', function(err){
    console.error(err.stack);
});

//define model===========================================
const activity = require('./ifibbs/activity');
const answer = require('./ifibbs/answer');
const article = require('./ifibbs/article');
const attention = require('./ifibbs/attention');
const captcha = require('./ifibbs/captcha');
const collection = require('./ifibbs/collection');
const device = require('./ifibbs/device');
const favour = require('./ifibbs/favour');
const history = require('./ifibbs/history');
const notification = require('./ifibbs/notification');
const question = require('./ifibbs/question');
const recommend = require('./ifibbs/recommend');
const subject = require('./ifibbs/subject');
const tag = require('./ifibbs/tag');
const user = require('./ifibbs/user');
const dynamic = require('./ifibbs/dynamic');
const share = require('./ifibbs/share');
const complaint = require('./ifibbs/complaint');



ifibbs.model('Activity', activity.ActivitySchema, 'activity');
ifibbs.model('QuestionAnswer', answer.QuestionAnswerSchema, 'question_answer');
ifibbs.model('AnswerComment', answer.AnswerCommentSchema, 'answer_comment');
ifibbs.model('Article', article.ArticleSchema, 'article');
ifibbs.model('ArticleComment', article.ArticleCommentSchema, 'article_comment');
ifibbs.model('AttentionQuestion', attention.AttentionQuestionSchema, 'attention_question');
ifibbs.model('AttentionSubject', attention.AttentionSubjectSchema, 'attention_subject');
ifibbs.model('AttentionUser', attention.AttentionUserSchema, 'attention_user');
ifibbs.model('SecurityCode', captcha.SecurityCodeSchema, 'security_code');
ifibbs.model('UserAnswerCollection', collection.UserAnswerCollectionSchema, 'user_answer_collection');
ifibbs.model('UserArticleCollection', collection.UserArticleCollectionSchema, 'user_article_collection');
ifibbs.model('UserDevice', device.UserDeviceSchema, 'user_device');
ifibbs.model('UserFavourAnswer', favour.UserFavourAnswerSchema, 'user_favour_answer');
ifibbs.model('UserFavourArticle', favour.UserFavourArticleSchema, 'user_favour_article');
ifibbs.model('UserFavourAnswerComment', favour.UserFavourAnswerCommentSchema, 'user_favour_answer_comment');
ifibbs.model('UserHistory', history.UserHistorySchema, 'user_history');
ifibbs.model('UserNotification', notification.UserNotificationSchema, 'user_notification');
ifibbs.model('Question', question.QuestionSchema, 'question');
ifibbs.model('Recommend', recommend.RecommendSchema, 'recommend');
ifibbs.model('QuestionTag', tag.QuestionTagSchema, 'question_tag');
ifibbs.model('Subject', subject.SubjectSchema, 'subject');
ifibbs.model('User', user.UserSchema, 'user');
ifibbs.model('UserDynamic', dynamic.UserDynamicSchema, 'user_dynamic');
ifibbs.model('UserShare', share.UserShareSchema, 'user_share');
ifibbs.model('UserComplaint', complaint.UserComplaintSchema, 'user_complaint');


exports.ifibbs = ifibbs;
exports.mongoose = mongoose;
exports.ObjectId = mongoose.Types.ObjectId;