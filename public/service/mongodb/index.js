/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const mongoose = require('mongoose');

const config = require('../config');

mongoose.Promise = global.Promise;

if(!config && !config.mongodb && config.mongodb.url){
    throw new Error('please provide mongodb config');
}


const option =  {
    user: config.mongodb.user,
    pass: config.mongodb.password
};

const ifibbs = mongoose.createConnection(config.mongodb.url, option);

ifibbs.on('error', function(err){
    console.error(err.stack);
});

//define model===========================================
const activity = require('./schema/activity');
const answer = require('./schema/answer');
const article = require('./schema/article');
const attention = require('./schema/attention');
const captcha = require('./schema/captcha');
const collection = require('./schema/collection');
const device = require('./schema/device');
const favour = require('./schema/favour');
const history = require('./schema/history');
const notification = require('./schema/notification');
const question = require('./schema/question');
const recommend = require('./schema/recommend');
const subject = require('./schema/subject');
const tag = require('./schema/tag');
const user = require('./schema/user');
const dynamic = require('./schema/dynamic');
const share = require('./schema/share');
const complaint = require('./schema/complaint');



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