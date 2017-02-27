/**
 * Created by synder on 16/9/20.
 */


exports.simplified = function () {
    
};


exports.lowercase = function (charCode) {
    if(charCode > 64 && charCode < 91){
        return　charCode　|　32;
    }
    return　charCode;
};