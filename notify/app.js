
const businessNotificationPush = require('./push/business');
const systemNotificationPush = require('./push/system');

businessNotificationPush.start(function (err) {
    if(err){
        console.error(err.stack);
    }
});

systemNotificationPush.start(function (err) {
    if(err){
        console.error(err.stack);
    }
});