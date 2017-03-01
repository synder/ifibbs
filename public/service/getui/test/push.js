/**
 * @author synder on 2017/2/28
 * @copyright
 * @desc
 */


const getui = require('../index');

const DEMO_CLIENT_ID = '6a26da2ef9fd51a84d548be0336b1f5d';

// getui.notifyClientToOpenApp(false, '测试数据' + Math.random(), function (err, res) {
//     console.log(err, res);
// });


// getui.notifyClientToOpenUrl(false, DEMO_CLIENT_ID, '标题', '描述', 'http://www.baidu.com', function (err, res) {
//     console.log(err, res);
// });


// getui.notifyClientToDownload(false, DEMO_CLIENT_ID, '标题', '描述', 'http://img.wdjimg.com/mms/icon/v1/9/9c/92bda251e8b6fb80d2e7da3d75ad39c9_68_68.png', 'http://a.wdjcdn.com/release/files/phoenix/5.51.20.13150/wandoujia-wandoujia-web_direct_binded_5.51.20.13150.apk?remove=2&append=%8A%00eyJhcHBEb3dubG9hZCI6eyJkb3dubG9hZFR5cGUiOiJkb3dubG9hZF9ieV9wYWNrYWdlX25hbWUiLCJwYWNrYWdlTmFtZSI6ImNvbS5kaWFucGluZy52MSJ9fQWdj01B00007a6286', function (err, res) {
//     console.log(err, res);
// });


// getui.notifyTransmissionMsg(false, DEMO_CLIENT_ID, '测试数据', function (err, res) {
//     console.log(err, res);
// });


getui.broadcastClientsToOpenApp(false, '测试数据' + Math.random(), 'summary', 'detail', function (err, res) {
    console.log(err, res);
});

