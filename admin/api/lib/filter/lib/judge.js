/**
 * Created by synder on 16/9/20.
 */

/**
 * @desc judge a char is a Chinese char
 * */
exports.isAlphaChar = function (charCode) {
    if (charCode > 64 && charCode < 91){
        return true;
    } else {
        return charCode > 96 && charCode < 123;
    }
};


/**
 * @desc judge a char is a Chinese char
 * */
exports.isChineseChar = function (charCode) {
    return charCode > 19968 && charCode < 40869;
};


/**
 * @desc judge a char is a special char
 * */
exports.isSpecharsChar = function (charCode) {

    if(charCode < 256){

        if (charCode > 64 && charCode < 91){
            return false;
        } else if (charCode > 96 && charCode < 123){
            return false;
        }

        return true;

    }else {
        return !(charCode > 19968 && charCode < 40869);
    }
};


/**
 * @desc judge a char is a unprintable character
 * */
exports.isInvisibleChar = function (charCode) {
    if(charCode < 33){
        return true;
    } else {
        return charCode == 127 || charCode == 160 || charCode == 173;
    }
};