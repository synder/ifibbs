'use strict';

const util = require('util');
const Message = require('./Message');

function SingleMessage(options) {
    Message.call(this, options);
}

util.inherits(SingleMessage, Message);

module.exports = SingleMessage;