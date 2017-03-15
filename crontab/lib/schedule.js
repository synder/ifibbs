/**
 * @author synder on 2017/3/15
 * @copyright
 * @desc
 */

/**
 * 生成job执行计划
 * */
module.exports = function (config) {
    
    if (!config.seconds) {
        config.seconds = 0;
    }

    if (!config.minutes) {
        config.minutes = 0;
    }

    if (!config.hours) {
        config.hours = '*';
    }

    if (!config.months) {
        config.months = '*';
    }

    if (!config.days) {
        config.days = '*';
    }

    if (!config.weeks) {
        config.weeks = '*';
    }

    return [
        config.seconds,
        config.minutes,
        config.hours,
        config.days,
        config.months,
        config.weeks
    ].join(' ');
};