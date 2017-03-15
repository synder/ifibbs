
const push = require('./push');

push.start(function (err, channel, message) {
    if(err){
        console.error(err.stack);
    }
    
    if(channel && message){
        try{
            channel.ack(message);
        }catch(ex){
            console.error(err);
        }
        
    }
});