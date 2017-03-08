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

        request.post({url:DefaultSMSClient.url(), form: {
            account: this.username,
            pswd: this.password,
            mobile: mobile,
            msg: msg,
            needstatus: true,
            extno: '',
            product: '',
        }}, function optionalCallback(err, httpResponse, body) {
            if (err) {
                return callback(err);
            }
            
            callback(null, body);
        });
    }
}


exports.DefaultSMSClient = DefaultSMSClient;