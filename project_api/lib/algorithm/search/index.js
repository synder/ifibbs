/**
 * Created by synder on 16/9/23.
 */

/**
 * @desc 线性查找
 * */
var linear = function (array, value, compare) {

    if(!compare){
        compare = function (a, b) {
            return a - b;
        };
    }

    for(var i = 0, len = array.length; i < len; i++){
        if(compare(value, array[i]) === 0){
            return i;
        }
    }

    return -1;
};

exports.linear = linear;


/**
 * @desc 二分查找, 要求数组是升序排过序的
 * */
var binary = function (array, value, low, hight, compare) {

    if(low > hight){
        return -1;
    }

    var middle = ~~((low + hight) / 2);

    if(compare(array[middle], value) === 0){
        return middle;
    }else if(compare(value, array[middle]) < 0){
        hight = middle - 1;
        return binary(array, value, low, hight, compare);
    }else{
        low = middle + 1;
        return binary(array, value, low, hight, compare);
    }

};

exports.binary = function (array, value, compare) {
    if(!compare){
        compare = function (a, b) {
            return a - b;
        };
    }
    return binary(array, value, 0, array.length, compare);
};
