
const push = require('./push');

push.start(function (err) {
    if(err){
        console.error(err.stack);
    }
});