/**
 * Created by synder on 16/9/23.
 */


const Dictionary = function () {
    this.__data = [];
};

Dictionary.prototype.set = function (key, value) {
    this.__data[key] = value;
};

Dictionary.prototype.get = function (key) {
    return this.__data[key];
};

Dictionary.prototype.del = function (key) {
    delete this.__data[key];
};


Dictionary.prototype.size = function () {
    return Object.keys(this.__data).length;
};

Dictionary.prototype.clear = function () {
    for(let key in Object.keys(this.__data)) {
        delete this.__data[key];
    }
};


Dictionary.prototype.keys = function () {
    return Object.keys(this.__data);
};

Dictionary.prototype.values = function () {
    let temp = [];

    for(let key in Object.keys(this.__data)) {
        temp.push(this.__data[key]);
    }

    return temp;
};

Dictionary.prototype.entities = function () {
    let temp = {};

    for(let key in Object.keys(this.__data)) {
        temp[key] = this.__data[key];
    }

    return temp;
};

exports.Dictionary = Dictionary;