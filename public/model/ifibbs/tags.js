/**
 * @author synder on 2017/2/19
 * @copyright
 * @desc
 */


const ifibbsMongodb = require('../../service/mongodb/ifibbs').client;
const ifibbsElasticsearch = require('../../service/elasticsearch/ifibbs').client;

const QuestionTag = ifibbsMongodb.model('QuestionTag');


/**
 * @desc 获取推介标签
 * */
exports.getRecommenedQuestionTags = function(count, callback){
    
    let condition = {status: QuestionTag.STATUS.RECOMMEND};
    
    QuestionTag.find(condition)
        .limit(count)
        .exec(callback);
};


/**
 * @desc 搜索标签
 * */
exports.searchQuestionTags = function (content, callback) {
    ifibbsElasticsearch.search({
        index: ifibbsElasticsearch.indices.tags,
        body: {
            query: {
                multi_match: {
                    query: decodeURIComponent(content),
                    fields: ['title', 'describe']
                }
            }
        }
    }, function (err, response) {
        
        if(err){
            return callback(err);
        }

        let total = response.hits.total;
        let hits = response.hits.hits;

        let tags = hits.map(function (hit) {
            return {
                id: hit._id,
                title: hit._source.title,
                describe: hit._source.describe,
                icon: hit._source.icon,
            };
        });
        
        callback(null, {
            count: total,
            tags: tags
        });
    });
    
};


/**
 * @desc 根据IDS获取TAG
 * */
exports.getQuestionTagsByIDS = function (ids, callback) {
    if(!Array.isArray(ids)){
        ids = [];
    }  
    
    QuestionTag.find({_id: {$in: ids}}, callback);
};