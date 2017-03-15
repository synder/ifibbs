/**
 * Created by synder on 16/9/20.
 */

const convert = require('../lib/convert');
const judge = require('../lib/judge');

const WordNode = require('./WordNode').WordNode;



const WordTree = function (keywords) {
    this.root = null;

    this.__init(keywords);
};

WordTree.prototype.__init = function (keywords) {

    if(!keywords){
        return;
    }

    var self = this;

    if(!self.root){
        self.root = new WordNode();
    }

    var genTree = function (keyword, weight) {
        var tempNode = self.root;

        for(var i = 0, length = keyword.length; i < length; i++){

            var　charCode　=　convert.lowercase(keyword[i].charCodeAt(0));

            if(judge.isInvisibleChar(charCode)){
                continue;
            }

            if(tempNode.childs === null){
                tempNode.childs = {};
            }

            var nextNode = tempNode.childs[charCode];

            if(nextNode === null){
                var newNode = new WordNode(weight);

                tempNode.childs[charCode] = newNode;

                nextNode = newNode;
            }

            tempNode = nextNode;

            if(i == length - 1){
                tempNode.end = true;
            }
        }
    };


    if(typeof keywords == 'string'){
        keywords　=　[keywords];

        keywords.forEach(function (keyword) {
            genTree(keyword, 1);
        });

    }else if(Array.isArray(keywords)){

        keywords.forEach(function (keyword) {
            genTree(keyword, 1);
        });

    }else {
        for(var key in keywords){
            if(keywords.hasOwnProperty(key)){
                genTree(key, keywords[key]);
            }
        }
    }

};

WordTree.prototype.append = function (keyword) {

    this.__init(keyword);

    return this;
};

WordTree.prototype.keywords = function () {

    var results = [];

    if(!this.root){
        return results;
    }

    if(!this.root.childs){
        return results;
    }

    var walkTree = function (tree, parent) {

        for(var key in tree.childs){

            if(!tree.childs.hasOwnProperty(key)){
                continue;
            }

            var child = tree.childs[key];

            if(child && child.childs && child.end === false){
                walkTree(child, parent + String.fromCharCode(~~key));
            }else{
                var temp = {};
                temp[parent + String.fromCharCode(~~key)] = child.weight;
                results.push(temp);
            }
        }
    };

    walkTree(this.root, '');

    return results;
};

exports.WordTree = WordTree;