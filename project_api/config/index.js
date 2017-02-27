/**
 * @author synder
 * @date 16/1/10
 * @desc
 */

const NODE_ENV = process.env.NODE_ENV;

const nodenv = NODE_ENV ? NODE_ENV.toLowerCase() : null;

if(nodenv != 'dev' && nodenv != 'pre' && nodenv != 'pro'){
    throw new Error('NODE_ENV must be "dev" or "pre" or "pro"');
}

const config = global.config = require('./' + nodenv);

module.exports = config;