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
        throw new Error('config.seconds is null or undefined');
    }

    if (!config.minutes) {
        throw new Error('config.minutes is null or undefined');
    }

    if (!config.hours) {
        throw new Error('config.hours is null or undefined');
    }

    if (!config.months) {
        throw new Error('config.months is null or undefined');
    }

    if (!config.days) {
        throw new Error('config.days is null or undefined');
    }

    if (!config.weeks) {
        throw new Error('config.weeks is null or undefined');
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