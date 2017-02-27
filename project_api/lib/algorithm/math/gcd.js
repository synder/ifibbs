/**
 * Created by synder on 16/9/26.
 */


var　gcd = function (a, b) {
    return b > 0　?　gcd(b,　a　%　b)　:　a;
};

exports.gcd　=　gcd;

var　prime　=　function (value) {
    if((value & 1) != 1){
        return false;
    }

    if(value > 3 && value % 3 === 0){
        return false;
    }

    for(var i = 2, temp = ~~Math.sqrt(value); i < temp; i++){
        if(value % i === 0){
            return false;
        }
    }

    return true;
};

exports.prime = prime;