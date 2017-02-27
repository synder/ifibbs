/**
 * Created by synder on 16/9/23.
 */


var Stack = function (max) {
    this.__store = null;
    this.__top = 0;
    this.__max = null;

    this.__init(max);
};

Stack.prototype.__init = function (max) {
    max = ~~max;

    if(max > 0){
        this.__store = new Array(max);
        this.__max = max;
        return;
    }

    this.__store = [];
};

Stack.prototype.push = function (element) {
    if(this.__max){
        if(this.__top == this.__max){
            return false;
        }else {
            this.__store[this.__top++] = element;
            return true;
        }
    }else{
        this.__store[this.__top++] = element;
    }
};

Stack.prototype.pop = function () {
    if(this.__top === 0){
        return null;
    }else{
        return this.__store[--this.__top];
    }

};

Stack.prototype.peek = function () {
    if(this.__top === 0){
        return null;
    }else{
        return this.__store[this.__top - 1];
    }
};

Stack.prototype.length = function () {
    return this.__top;
};

Stack.prototype.clear = function () {
    this.__top = 0;
};

exports.Stack = Stack;