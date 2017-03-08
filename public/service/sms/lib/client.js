/**
 * @author synder on 2017/3/3
 * @copyright
 * @desc
 */

const request = require('request');

class DefaultSMSClient {
    
    static url(){
        return 'http://114.55.176.84/msg/HttpBatchSendSM'
    };
    
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
    
    send(mobile, msg, callback){

        request.post(DefaultSMSClient.url())
            .timeout(2000)
            .set('Accept', 'application/text')
            .send({
                account: this.username,
                pswd: this.password,
                mobile: mobile,
                msg: msg,
                needstatus: true,
                extno: '',
                product: '验证码专用-发送',
            })
            .end(function (err, res) {
                if(err){
                    return callback(err);
                }

                console.log(res);
            });
    }
}


exports.DefaultSMSClient = DefaultSMSClient;