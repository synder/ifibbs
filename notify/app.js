
const push = require('./push');

push.start(function (err, channel, message) {
    if(err){
        console.error(err.stack);
    }
    
    if(channel){
        channel.ack(message);
    }
});