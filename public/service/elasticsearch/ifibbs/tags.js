/**
 * @author synder on 2017/2/18
 * @copyright
 * @desc
 */

module.exports = {
    index: 'tags',
    body: {
        mappings: {
            tags: {
                _all: {
                    analyzer: 'ik_max_word',
                    search_analyzer: 'ik_max_word',
                    term_vector: 'no',
                    store: 'false',
                },
                properties: {
                    icon: {
                        type: 'text',
                        store: 'yes',
                        index: 'not_analyzed'
                    },
                    title: {
                        type: 'text',
                        store: 'yes',
                        index: 'analyzed',
                        analyzer: 'ik_max_word',
                        search_analyzer: 'ik_max_word',
                        boost: 8
                    },
                    describe: {
                        type: 'text',
                        store: 'yes',
                        index: 'analyzed',
                        analyzer: 'ik_max_word',
                        search_analyzer: 'ik_max_word',
                        boost: 6
                    },
                }
            }
        }
    }
};