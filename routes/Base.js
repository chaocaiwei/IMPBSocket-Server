/**
 * Created by weichaocai on 2018/4/8.
 */


var base = require("../impb/base_pb");
var User = base.UserInfo;
var IP   = base.IpInfo;

// 从数据库拿到的user  转化为PB的user结构
module.exports.builderFromUser = function (user) {
    var userMsg = new User();
    userMsg.setUid(user.user_id);
    userMsg.setNickName(user.user_name);
    // userMsg.setPwd(user.pwd);
    userMsg.setIsOnline(user.online);
    userMsg.setToken(user.token);
    var ip_info = ipInfoWith(user.ip,user.port,user.sock_ip,user.sock_port);
    userMsg.setIpInfo(ip_info);
    return userMsg;
}


function ipInfoWith(ip,port,sock_ip,sock_port) {
    var info = new IP();
    info.setIp(ip);
    info.setPort(port);
    info.setSockIP(sock_ip);
    info.setSockPort(sock_port);
    return info;
}


module.exports.buildIpInfo  = ipInfoWith;
