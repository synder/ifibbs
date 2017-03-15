/**
 * Created by synder on 16/9/20.
 */


exports.WordNode = function (weight) {
    this.childs = null;
    this.end = false;
    this.weight = weight || 1;
};