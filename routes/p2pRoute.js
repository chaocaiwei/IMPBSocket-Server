/**
 * Created by jztech-weichaocai on 2018/4/2.
 */

var app   = require("../app");
var global   = require("../global");
var logger = require('../log').logger('p2p');
var db     = require("../dataBase");
var P2pBuild = require("../impb/p2p_connect_pb"),
    Type  = P2pBuild.enum_p2p_type;
var P2p  = P2pBuild.p2p_connect,
    P2pconnect_response   = P2pBuild.p2pconnect_response,
    P2pconnect_request   = P2pBuild.p2pconnect_request,
    P2p_post_ip_request   = P2pBuild.p2p_post_ip_request,
    P2p_post_ip_response = P2pBuild.p2p_post_ip_response;
var Noti_build = require("../impb/notification_pb"),
    Notification  = Noti_build.Notification_msg,
    Noti_type     = Noti_build.enum_notification_type,
    P2p_receive_connect_notification   = Noti_build.p2p_receive_connect_notification,
    P2p_connect_ready_notification   = Noti_build.p2p_connect_ready_notification;
var Base = require("./Base");


exports.route = function (body,sock,completion){
    try {
        var p2p =  P2p.deserializeBinary(body);
        var sub = p2p.getBody()
        logger.info("recieve p2p msg :" + p2p)

        switch(p2p.getType())  {
            case Type.ENUM_P2P_TYPE_CONNECT_REQUEST:
                handleConnectReq(sub,sock,function (res) {
                    completion(true,res)
                });
                break;
            case Type.ENUM_P2P_TYPE_POST_IP:
                handlePostIp(sub,function (res) {
                    completion(true,res)
                });
                break;
            default:
                break;
        }
    }catch (err){
        logger.error(err)
    }

};


function handleConnectReq(body,sock,completion) {
    try {
        var req = P2pconnect_request.deserializeBinary(body);
        var uid = req.getTargetUid();
        var respond = new P2pconnect_response();
        var target_sock  = global.sockWithUid(uid);
        logger.info("recieve p2p connect req from=" + req.uid + " to=" + uid + " ip=" +  req.ip + " port=" + req.port );
        db.userById(uid,function (rows,err) {
            if(!err){
                var user = rows[0];
                if (target_sock){

                    var sponsor_ip = Base.buildIpInfo(req.ip,req.port,sock.remoteAddress,sock.remotePort);
                    var target_ip  = Base.buildIpInfo(user.ip,user.port,target_sock.remoteAddress,target_sock.remotePort);

                    respond.setIsOnline(true);
                    respond.setIsExit(true);
                    respond.setSponsorIpInfo(sponsor_ip);
                    respond.setTargetIpInfo(target_ip);
                    completion(respond);

                    var rec = new P2p_receive_connect_notification();
                    rec.setSponsorUid(req.user_id);
                    rec.setSponsorIpInfo(sponsor_ip);
                    rec.setTargetIpInfo(target_ip);
                    var notify = new Notification();
                    notify.setType(Noti_type.ENUM_NOTIFICATION_TYPE_P2P_RECEIVE_CONNECT_REQ);
                    var tbody  = new Buffer(rec.serializeBinary());
                    notify.setTargetUid(uid);
                    notify.setBody(tbody);
                    app.wridataWithSock(target_sock,4,notify.serializeBinary());
                    logger.info("p2p success to sent notification target is " + uid + " "+ target_sock.remoteAddress +':'+ target_sock.remotePort)

                }else{
                    respond.setIsOnline(false);
                    respond.setIsExit(true);
                    logger.info("receive p2p connect req false user is offline");
                    completion(respond);
                }
            }else{
                respond.setIsOnline(false);
                respond.setIsExit(false);
                logger.info("receive p2p connect req user is not exit");
                completion(respond);
            }

        })

    }catch (err){
        logger.error(err);
    }
}


function handlePostIp(body,completion){
    try {
        var req =  P2p_post_ip_request.deserializeBinary(body);
        var uid = req.getSponsorUid();
        var sock = global.sockWithUid(uid);
        logger.info("receive p2p connect Receiver Respon from=" + req.uid + " to=" + uid + " ip=" +  req.ip + " port=" + req.port );
        if(sock){
            var ready = new P2p_connect_ready_notification();
            ready.setUid(req.getUid())
            ready.setIp(req.getIp())
            ready.setPort(req.getPort())
            var notify = new Notification();
            notify.setType(Noti_type.ENUM_NOTIFICATION_TYPE_P2P_CONNECT_READY);
            notify.setBody(ready.serializeBinary());
            logger.info("p2p sent ready notification from=" + req.uid + " to=" + uid + " ip=" +  req.ip + " port=" + req.port );
            app.wridataWithSock(sock,4,notify.serializeBinary());
        }
        var  respond = new  P2p_post_ip_response()
        respond.setIssuc(true);
        completion(respond)
    }catch (err){
        logger.error(err)
        //noinspection JSDuplicatedDeclaration
        var  respond = new  P2p_post_ip_response();
        respond.setIssuc(false);
        completion(respond)
    }
}