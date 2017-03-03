/**
 * Created by synder on 16/9/23.
 */


/**
 * @desc 获取大于min的最大素数
 * */
const prime = function (min) {

    let isPrime = function (value) {

        if((value & 1) != 1){
            return false;
        }

        if(value > 3 && value % 3 === 0){
            return false;
        }

        for(let i = 2, temp = ~~Math.sqrt(value); i < temp; i++){
            if(value % i === 0){
                return false;
            }
        }

        return true;
    };

    while (true) {
        if(!isPrime(min)){
            min += 1;
        }else{
            break;
        }
    }

    return min;
};


//---HashMap---------------------------------------------------------
const HashMap = function (capacity) {
    this.__FACTOR = 1;
    this.__CAPACITY = 137;

    this.__size = 0;
    this.__threshold = 0;
    this.__table = null;

    this.__init(capacity);
};

HashMap.prototype.__init = function (capacity) {
    if(capacity > 0){
        this.__CAPACITY = prime(~~(capacity / this.__FACTOR));
    }

    this.__threshold = ~~(this.__CAPACITY * this.__FACTOR);

    this.__table = new Array(this.__CAPACITY);
};

HashMap.prototype.__hash = function (value) {

    value = value + '';

    let hash = value.length;

    for (let i = 0; i < value.length; i++){
        hash = (hash << 4) ^ (hash >> 28) ^ value.charCodeAt(i);
    }

    return (hash % this.__table.length);
};

HashMap.prototype.__rehash = function () {

    if(this.__size > this.__threshold){

        let newCap = prime(this.__size);
        let newMap = new HashMap(newCap);

        this.__table.forEach(function (entry) {
            for(let key in entry){
                if(entry.hasOwnProperty(key)){
                    newMap.put(key, entry[key]);
                }
            }
        });

        this.__FACTOR = newMap.__FACTOR;
        this.__CAPACITY = newMap.__CAPACITY;
        this.__size = newMap.__size;
        this.__threshold = newMap.__threshold;
        this.__table = newMap.__table;
    }
};

HashMap.prototype.put = function (key, data) {

    let position = this.__hash(key);

    if(!this.__table[position]){
        this.__table[position] = {};
        this.__table[position][key] = data;
        this.__size += 1;
    }else{
        this.__table[position][key] = data;
        if(this.__table[position][key] !== null){
            this.__size += 1;
        }
    }

    this.__rehash();

    return true;
};

HashMap.prototype.del = function (key) {

    let position = this.__hash(key);

    if(!this.__table[position]){
        return false;
    }

    if(this.__table[position][key] !== null){
        delete this.__table[position][key];
        this.__size -= 1;
    }

    return true;
};

HashMap.prototype.get = function (key) {

    let position = this.__hash(key);

    if(!this.__table[position]){
        return null;
    }

    return this.__table[position][key];
};

HashMap.prototype.size = function () {
    return this.__size;
};

HashMap.prototype.clear = function () {
    this.__init();
};

HashMap.prototype.keys= function () {
    let result = [];
    this.__table.forEach(function (entry) {
        for(let key in entry){
            if(entry.hasOwnProperty(key)){
                result.push(key);
            }
        }
    });
    return result;
};

HashMap.prototype.values = function () {
    let result = [];
    this.__table.forEach(function (entry) {
        for(let key in entry){
            if(entry.hasOwnProperty(key)){
                result.push(entry[key]);
            }
        }
    });
    return result;
};

HashMap.prototype.forEach = function (callback) {
    this.__table.forEach(function (entry) {
        for(let key in entry){
            if(entry.hasOwnProperty(key)){
                callback(key, entry[key]);
            }
        }
    });
};

exports.HashMap = HashMap;

