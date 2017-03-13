/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const mongoose = require('mongoose');

const config = require('../config');

mongoose.Promise = global.Promise;

if(!config && !config.mongodb && !config.mongodb.ifibbs){
    throw new Error('please provide mongodb config');
}

const IFIBBS_CONFIG = config.mongodb.ifibbs;


const client = mongoose.createConnection(IFIBBS_CONFIG.url, {
    user: IFIBBS_CONFIG.user,
    pass: IFIBBS_CONFIG.password
});

client.on('error', function(err){
    console.error(err.stack);
});


//define ifibbs model===========================================
const activity = require('./ifibbs_schema/activity');
const answer = require('./ifibbs_schema/answer');
const article = require('./ifibbs_schema/article');
const attention = require('./ifibbs_schema/attention');
const captcha = require('./ifibbs_schema/captcha');
const collection = require('./ifibbs_schema/collection');
const device = require('./ifibbs_schema/device');
const favour = require('./ifibbs_schema/favour');
const history = require('./ifibbs_schema/history');
const notification = require('./ifibbs_schema/notification');
const question = require('./ifibbs_schema/question');
const recommend = require('./ifibbs_schema/recommend');
const subject = require('./ifibbs_schema/subject');
const tag = require('./ifibbs_schema/tag');
const user = require('./ifibbs_schema/user');
const dynamic = require('./ifibbs_schema/dynamic');
const share = require('./ifibbs_schema/share');
const complaint = require('./ifibbs_schema/complaint');



client.model('Activity', activity.ActivitySchema, 'activity');
client.model('QuestionAnswer', answer.QuestionAnswerSchema, 'question_answer');
client.model('AnswerComment', answer.AnswerCommentSchema, 'answer_comment');
client.model('Article', article.ArticleSchema, 'article');
client.model('ArticleComment', article.ArticleCommentSchema, 'article_comment');
client.model('AttentionQuestion', attention.AttentionQuestionSchema, 'attention_question');
client.model('AttentionSubject', attention.AttentionSubjectSchema, 'attention_subject');
client.model('AttentionUser', attention.AttentionUserSchema, 'attention_user');
client.model('SecurityCode', captcha.SecurityCodeSchema, 'security_code');
client.model('UserAnswerCollection', collection.UserAnswerCollectionSchema, 'user_answer_collection');
client.model('UserArticleCollection', collection.UserArticleCollectionSchema, 'user_article_collection');
client.model('UserDevice', device.UserDeviceSchema, 'user_device');
client.model('UserFavourAnswer', favour.UserFavourAnswerSchema, 'user_favour_answer');
client.model('UserFavourArticle', favour.UserFavourArticleSchema, 'user_favour_article');
client.model('UserFavourAnswerComment', favour.UserFavourAnswerCommentSchema, 'user_favour_answer_comment');
client.model('UserHistory', history.UserHistorySchema, 'user_history');
client.model('UserNotification', notification.UserNotificationSchema, 'user_notification');
client.model('Question', question.QuestionSchema, 'question');
client.model('Recommend', recommend.RecommendSchema, 'recommend');
client.model('QuestionTag', tag.QuestionTagSchema, 'question_tag');
client.model('Subject', subject.SubjectSchema, 'subject');
client.model('User', user.UserSchema, 'user');
client.model('UserDynamic', dynamic.UserDynamicSchema, 'user_dynamic');
client.model('UserShare', share.UserShareSchema, 'user_share');
client.model('UserComplaint', complaint.UserComplaintSchema, 'user_complaint');


exports.client = client;
exports.mongoose = mongoose;
exports.ObjectId = mongoose.Types.ObjectId;