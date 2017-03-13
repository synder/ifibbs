/**
 * @author synder on 2017/2/20
 * @copyright
 * @desc
 */

const server = require('../app');

server.cluster(0, function(message){
    logger.info(message);
});