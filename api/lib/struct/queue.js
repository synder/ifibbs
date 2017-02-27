/**
 * Created by synder on 16/9/23.
 */


var Queue = function () {
    this.data = [];
};

/**
 * @desc 向队尾添加一个元素
 * */
Queue.prototype.enqueue = function (element) {
    this.data.push(element);
};


Queue.prototype.dequeue = function () {
    return this.data.shift();
};


Queue.prototype.head = function () {
    return this.data[0];
};


Queue.prototype.tail = function () {
    return this.data[this.data.length - 1];
};


Queue.prototype.length = function () {
    return this.data.length;
};

exports.Queue = Queue;