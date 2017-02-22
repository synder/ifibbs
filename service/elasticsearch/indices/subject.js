/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */

module.exports = {
    index: 'subject',
    body: {
        mappings: {
            subject: {
                _all: {
                    analyzer: 'ik_max_word',
                    search_analyzer: 'ik_max_word',
                    term_vector: 'no',
                    store: 'false',
                },
                properties: {
                    icon: {
                        type: 'string',
                        index: 'not_analyzed'
                    },
                    cover: {
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