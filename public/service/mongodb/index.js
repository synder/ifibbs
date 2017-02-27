/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const mongoose = require('mongoose');

const config = require('../config');

mongoose.Promise = global.Promise;

if(!config && !config.mongodb && config.mongodb.url){
    throw new Error('please provice mongodb config');
}


const option =  {
    user: config.mongodb.user,
    pass: config.mongodb.password
};

const db = mongoose.createConnection(config.mongodb.url, option);

db.on('error', function(err){
    console.error(err.stack);
});

//define model===========================================
const activity = require('./schema/activity');
const answer = require('./schema/answer');
const article = require('./schema/article');
const attention = require('./schema/attention');
const collection = require('./schema/collection');
const comment = require('./schema/comment');
const device = require('./schema/device');
const favour = require('./schema/favour');
const history = require('./schema/history');
const notification = require('./schema/notification');
const getui = require('./schema/getui');
const question = require('./schema/question');
const subject = require('./schema/subject');
const tag = require('./schema/tag');
const user = require('./schema/user');



db.model('Activity', activity.ActivitySchema, 'activity');
db.model('QuestionAnswer', answer.QuestionAnswerSchema, 'question_answer');
db.model('Article', article.ArticleSchema, 'article');
db.model('AttentionQuestion', attention.AttentionQuestionSchema, 'attention_question');
db.model('AttentionSubject', attention.AttentionSubjectSchema, 'attention_subject');
db.model('AttentionUser', attention.AttentionUserSchema, 'attention_user');
db.model('UserCollection', collection.UserCollectionSchema, 'user_collection');
db.model('AnswerComment', comment.AnswerCommentSchema, 'answer_comment');
db.model('UserDevice', device.UserDeviceSchema, 'user_device');
db.model('UserFavourAnswer', favour.UserFavourAnswerSchema, 'user_favour_answer');
db.model('UserFavourArticle', favour.UserFavourArticleSchema, 'user_favour_article');
db.model('UserFavourAnswerComment', favour.UserFavourAnswerCommentSchema, 'user_favour_answer_comment');
db.model('UserHistory', history.UserHistorySchema, 'user_history');
db.model('UserNotification', notification.UserNotificationSchema, 'user_notification');
db.model('UserGeTuiMapping', getui.UserGeTuiMappingSchema, 'user_getui_mapping');
db.model('Question', question.QuestionSchema, 'question');
db.model('QuestionTag', tag.QuestionTagSchema, 'question_tag');
db.model('Subject', subject.SubjectSchema, 'subject');
db.model('User', user.UserSchema, 'user');


exports.db = db;
exports.mongoose = mongoose;
exports.ObjectId = mongoose.Types.ObjectId;