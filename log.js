/**
 * Created by jztech-weichaocai on 2018/4/1.
 */


var log4js = require('log4js');

log4js.configure({
    appenders: {
        out: { type: 'stdout' },//设置是否在控制台打印日志
        info: { type: 'file', filename: './logs/info.log' }
    },
    categories: {
        default: { appenders: [ 'out', 'info' ], level: 'info' }//去掉'out'。控制台不打印日志
    }
});



module.exports.logger = function(name){
    var logger = log4js.getLogger(name);
    return logger;
}

