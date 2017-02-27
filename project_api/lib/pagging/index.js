/**
 * Created by synder on 16/9/19.
 */


//< 1 [2] 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 . 100 >
//< [1] 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 . 100 >
//< 1 2 3 4 5 6 7 8 [9] 10 11 12 13 14 15 16 17 18 . 100 >
//< 1 2 3 4 5 6 7 8 9 10 [11] 12 13 14 15 16 17 18 . 100 >
//< 1 . 3 4 5 6 7 8 9 10 11 [12] 13 14 15 16 17 18 19 . 100 >
//< 1 . 4 5 6 7 8 9 10 11 12 [13] 14 15 16 17 18 19 20 . 100 >
//< 1 . 20 21 22 23 24 25 26 [27] 28 29 30 31 32 33 34 35 . 100 >
//< 1 . 12 13 14 15 16 17 18 [19] 20 21 22 23 24 25 26 27 . 100 >
//< 1 . 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 [99] 100 >
//< 1 . 83 84 85 86 87 88 89 90 91 92 93 94 95 96 97 98 99 [100] >


//一共有t个数据
//每行显示n个, 第一个和最后一个总会显示 -> 还有 n - 2 空间可以显示
//当前数字c,c尽量排在中间
//当 c < 1 + (n - 2) / 2  显示第一个到 n - 3 个 + . + 最后一个
//当 c > t - (n - 2) / 2  显示字一个 + . + m - (n - 2) 到 m
//其他 显示第一个 + . 和 c - (n - 4) / 2 到 c + (n - 4) / 2 之间的数据 和 . + 最后一个


var paging = function (limit, total, current) {
    var result = [];
    var apostrophe = '.';

    if(limit >= total){
        for(var h = 0; h < total; h++){
            result.push({
                text: h + 1,
                index: h
            });
        }

        return result;
    }

    if(current < Math.round(limit / 2)){
        for(var i = 0; i < limit - 2; i++){
            result.push({
                text: i + 1,
                index: i
            });
        }
        result.push({
            text: apostrophe,
            index: total - 2
        });
        result.push({
            text: total,
            index: total - 1
        });
    }else if(current > Math.round(total - (limit - 2) / 2)){
        result.push({
            text:  '1',
            index: 0
        });
        result.push({
            text:  apostrophe,
            index: 1
        });
        for(var j = total - (limit - 2); j < total; j++){
            result.push({
                text: j + 1,
                index: j
            });
        }
    }else{
        result.push({
            text:  '1',
            index: 0
        });
        result.push({
            text:  apostrophe,
            index: 1
        });
        for(var k = current - Math.round((limit - 4) / 2); k < current + Math.round((limit - 4) / 2); k++){
            result.push({
                text: k + 1,
                index: k
            });
        }
        result.push({
            text: apostrophe,
            index: total - 2
        });
        result.push({
            text: total,
            index: total - 1
        });
    }

    return result;
};


module.exports = paging;