/**
 * Created by synder on 16/9/22.
 */

/**
 * @desc 冒泡排序 每次比较都将最大的数移到最后面
 * <1>.比较相邻的元素。如果第一个比第二个大，就交换它们两个；
 * <2>.对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对，这样在最后的元素应该会是最大的数；
 * <3>.针对所有的元素重复以上的步骤，除了最后一个；
 * <4>.重复步骤1~3，直到排序完成。
 * */
var bubble = function (array, less) {
    
    if(!less){
        less = function (a, b) {
            return a < b;
        };
    }

    for(var i = 0, len = array.length; i< len; i++){
        for(var j = 0; j < len - i - 1; j++){
            if(less(array[j], array[j + 1]) === true){
                var temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }

    return array;
};

exports.bubble = bubble;

/**
 * @desc 选择排序
 * <1>. 将第一个数作为基准
 * <2>. 后面的数与第一个数依次比较, 找出小于第一个数的数, 并交换位置
 * <3>. 将第二个数作为基准
 * <4>. 后面的数与第一个数依次比较, 找出小于第一个数的数, 并交换位置
 * <5>. 重复上述过程
 * */
var selection = function (array, less) {

    if(!less){
        less = function (a, b) {
            return a < b;
        };
    }

    var index, temp;

    for(var i = 0, len = array.length; i < len; i++){

        index = i;

        for(var j = i + 1; j < len; j++){
            if(less(array[i], array[j]) === false) {
                index = j; //记录下最小的位置
            }
        }

        temp = array[index];
        array[index] = array[i];
        array[i] = temp;

    }

    return array;
};

exports.selection = selection;

/**
 * @desc 插入排序
 * <1>.从第一个元素开始，该元素可以认为已经被排序；
 * <2>.取出下一个元素，在已经排序的元素序列中从后向前扫描；
 * <3>.如果该元素（已排序）大于新元素，将该元素移到下一位置；
 * <4>.重复步骤3，直到找到已排序的元素小于或者等于新元素的位置；
 * <5>.将新元素插入到该位置后；
 * <6>.重复步骤2~5。
 * */
var insertion = function (array, less) {

    if(!less){
        less = function (a, b) {
            return a < b;
        };
    }

    for(var i = 1, len = array.length; i < len;　i++){

        for(var　j　=　i; j > 0; j--){
            if(less(array[j], array[j - 1]) === true){
                var temp = array[j];
                array[j] = array[j - 1];
                array[j - 1] = temp;
            }
        }

    }

    return array;
};

exports.insertion = insertion;

/**
 * @desc 希尔排序
 * */
exports.shell = function () {

};

/**
 * @desc 快速排序
 * */
var quick = function(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    var pindex = Math.floor(arr.length / 2);
    var pvalue = arr.splice(pindex, 1)[0];

    var left = [];
    var right = [];

    for (var i = 0; i < arr.length; i++){
        if (arr[i] < pvalue) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return quick(left).concat([pvalue], quick(right));
};

exports.quick = quick;


/**
 * @desc 归并排序
 * */

var merger = function (left, right) {

    var temp = new Array(left.length + right.length);

    var tindex = 0,
        lindex = 0,
        rindex = 0;

    while (lindex < left.length && rindex < right.length){
        if(left[lindex] < right[rindex]){
            temp[tindex++] = left[lindex];
            lindex++;
        }else if(left[lindex] == right[rindex]){
            temp[tindex++] = left[lindex];
            lindex++;
            temp[tindex++] = right[rindex];
            rindex++;
        }else{
            temp[tindex++] = right[rindex];
            rindex++;
        }
    }

    for(var j = lindex; j < left.length; j++){
        temp[tindex++] = left[j];
    }

    for(var k = rindex; k < right.length; k++){
        temp[tindex++] = right[k];
    }

    return temp;
};

var merge = function (array) {

    var len = array.length;

    if(len < 2){
        return array;
    }

    var middle = Math.floor(len / 2);

    var left = array.slice(0, middle);
    var right = array.slice(middle, len);

    return merger(merge(left), merge(right));
};

exports.merge = merge;


/**
 * @desc 堆排序
 * */
var heap = function () {
    
};

exports.heap = heap;



//线性排序算法

/**
 * @desc 计数排序, 只适应于一定范围内的整数排序
 * <1>. 找出待排序的数组中最大和最小的元素；
 * <2>. 统计数组中每个值为i的元素出现的次数，存入数组C的第i项；
 * <3>. 对所有的计数累加（从C中的第一个元素开始，每一项和前一项相加）；
 * <4>. 反向填充目标数组：将每个元素i放在新数组的第C(i)项，每放一个元素就将C(i)减去1。
 * */
exports.bucket = function (array) {
    var len = array.length,
        min = array[0],
        max = array[0];

    for(var i = 1; i < array.length; i++){

        if(~~array[i] !== array[i]){
            throw new Error('counting sort just can sort integer');
        }

        if(array[i] < 0){
            throw new Error('counting sort just can sort element > 0');
        }

        if(len / array[i] < 0.5 && array[i] > 1000){
            throw new Error('counting sort just can sort element < 1000');
        }

        if(min > array[i]){
            min = array[i];
        }

        if(max < array[i]){
            max = array[i];
        }
    }

    if(max == min){
        return array;
    }

    var　temp = new Array(max);

    for(var j = 0; j < array.length;　j++){
        temp[array[j]] = temp[array[j]] ? temp[array[j]] + 1 : 1;
    }

    var result = [];

    for(var k = 0; k < temp.length; k++){
        if(temp[k]){
            for(var h = 0; h < temp[k]; h++){
                result.push(k);
            }
        }
    }

    return result;
};

/**
 * @desc 基数排序
 * */
exports.radix = function () {
    
};


console.log(exports.counting([2,34,18,24,2,23, 26, 29]));