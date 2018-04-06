/**
 * Created by jztech-weichaocai on 2018/4/1.
 */


const log4js = require('log4js');

// NOTE: for PM2 support to work you'll need to install the pm2-intercom module
// `pm2 install pm2-intercom`
log4js.configure({
    appenders: {
        out: { type: 'stdout' },//设置是否在控制台打印日志
        info: { type: 'file', filename: './logs/info.log' }
    },
    categories: {
        default: { appenders: [ 'out', 'info' ], level: 'info' }
    },
    pm2: true,
    pm2InstanceVar: 'INSTANCE_ID'
});



module.exports.logger = function(name){
    var logger = log4js.getLogger(name);
    setTimeout(function(){
        logger.info("I'm forever blowing bubbles");
    }, 1000);
    return logger;
}

