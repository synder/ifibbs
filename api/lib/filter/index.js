

const judge = require('./lib/judge');
const convert = require('./lib/convert');

const WordTree = require('./word/WordTree').WordTree;


const ADVERTISE = require('./resource/advertise');
const CONTRABAND = require('./resource/contraband');
const POLITICS = require('./resource/politics');
const PORN = require('./resource/porn');
const RELIGIOUS = require('./resource/religious');
const SOCIETY = require('./resource/society');


const Filter = function (keywords) {
    this.__tree = new WordTree(keywords);
};

Filter.prototype.append = function (keyword) {
    this.__tree.append(keyword);
};

Filter.prototype.keywords = function () {
    return this.__tree.keywords();
};

Filter.prototype.search = function (text) {

    let result = {
        text:{
            invisible: 0,
            mathed: 0,
        },
        indexs: []
    };

    let rootNode = this.__tree.root;

    if(!rootNode){
        throw new Error('there is no keywords append into the filter');
    }

    let start = 0;

    //the　firts　loop　param
    let firstLoweredCharCodeTemp = -1;

    //the　follow　loop　param
    let　followLoweredCharCodeTemp　=　-1;

    let nextNode　=　null;

    //this first char matched, check the first match char is chinese or alpha
    let isChinese = false;
    let isAlpha = false;

    //the　first　loop
    while (start < text.length){

        let charCode = text[start].charCodeAt(0);

        if(judge.isInvisibleChar(charCode)){
            start++;
            result.text.invisible += 1;
            continue;
        }

        firstLoweredCharCodeTemp　=　convert.lowercase(charCode);

        nextNode = rootNode.childs[firstLoweredCharCodeTemp];

        //the fist char is not match, then continue
        if(!nextNode){
            start++;
            continue;
        }

        //this first char matched, check the first match char is chinese or alpha
        isChinese = false;
        isAlpha = false;

        if(judge.isChineseChar(firstLoweredCharCodeTemp)){
            isChinese = true;
        }else {
            if(judge.isAlphaChar(firstLoweredCharCodeTemp)){
                isAlpha = true;
            }
        }

        //this first char matched, match the next chars
        let offset = 1;

        while ((start + offset) < text.length){

            if(!nextNode.childs){
                break;
            }

            followLoweredCharCodeTemp　=　convert.lowercase(text[start + offset].charCodeAt(0));

            if (judge.isSpecharsChar(followLoweredCharCodeTemp)) {
                offset++;
                continue;
            }

            //filter "法f$轮 le功"
            if(isChinese){
                if(!judge.isChineseChar(followLoweredCharCodeTemp)){
                    offset++;
                    continue;
                }
            }else {
                //filter f$u功ck"
                if(isAlpha){
                    if(!judge.isAlphaChar(followLoweredCharCodeTemp)){
                        offset++;
                        continue;
                    }
                }
            }

            if(!nextNode.childs){
                break;
            }

            nextNode = nextNode.childs[followLoweredCharCodeTemp];

            if(!nextNode){
                break;
            }

            offset++;
        }

        //matched to the last
        if(nextNode && nextNode.end === true) {

            result.indexs.push({
                index: start,
                length: offset,
                weight: nextNode.weight
            });

            result.text.mathed += offset;

            start = start + offset; //skip the word which has been matched

        } else {
            start++;
        }
    }

    return result;
};


module.exports = Filter;

module.exports.KEYWORDS = {
    ADVERTISE: ADVERTISE,
    CONTRABAND: CONTRABAND,
    POLITICS: POLITICS,
    PORN: PORN,
    RELIGIOUS: RELIGIOUS,
    SOCIETY: SOCIETY
};
