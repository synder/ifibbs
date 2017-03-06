/**
 * @author synder on 2017/3/3
 * @copyright
 * @desc
 */



class DefaultSMSClient {
    
    constructor(options){
        this.protocol = options.protocol;
        this.hostname = options.host;
        this.port = options.port;
        this.pathname = options.pathname;
    }
    
    send(msg, callback){
        let x = this.hostname;
        //todo 发送验证码
        callback(null, true);
    }
}


exports.DefaultSMSClient = DefaultSMSClient;