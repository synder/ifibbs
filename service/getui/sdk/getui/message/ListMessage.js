'use strict';

const util = require('util');
const Message = require('./Message');

function ListMessage(options) {
    Message.call(this, options);
}

util.inherits(ListMessage, Message);

module.exports = ListMessage;