/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */

module.exports = {
    index: 'answer',
    body: {
        mappings: {
            answer: {
                _all: {
                    analyzer: 'ik_max_word',
                    search_analyzer: 'ik_max_word',
                    term_vector: 'no',
                    store: 'false',
                },
                properties: {
                    create_user_id: {
                        type: 'string',
                        index: 'not_analyzed'
                    },
                    question_id: {
                        type: 'string',
                        index: 'not_analyzed'
                    },
                    question_title: {
                        type: 'text',
                        index: 'analyzed',
                        analyzer: 'ik_max_word',
                        search_analyzer: 'ik_max_word',
                        boost: 6
                    },
                    question_describe: {
                        type: 'text',
                        index: 'analyzed',
                        analyzer: 'ik_max_word',
                        search_analyzer: 'ik_max_word',
                        boost: 7
                    },
                    answer_content: {
                        type: 'text',
                        index: 'analyzed',
                        analyzer: 'ik_max_word',
                        search_analyzer: 'ik_max_word',
                        boost: 8
                    },
                    create_time: {
                        type: 'date',
                        index: 'not_analyzed'
                    },
                    update_time: {
                        type: 'date',
                        index: 'not_analyzed'
                    },
                }
            }
        }
    }
};