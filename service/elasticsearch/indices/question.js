/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */


module.exports = {
    index: 'question',
    body: {
        mappings: {
            question: {
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
                    title: {
                        type: 'text',
                        index: 'analyzed',
                        analyzer: 'ik_max_word',
                        search_analyzer: 'ik_max_word',
                        boost: 8
                    },
                    describe: {
                        type: 'text',
                        index: 'analyzed',
                        analyzer: 'ik_max_word',
                        search_analyzer: 'ik_max_word',
                        boost: 6
                    },
                    tags: {
                        type: 'text'
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