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



exports.route = function (body,completion){
    try {
        var p2p =  P2p.deserializeBinary(body);
        var sub = p2p.getBody()
        logger.info("recieve p2p msg :" + p2p)

        switch(p2p.getType())  {
            case Type.ENUM_P2P_TYPE_CONNECT_REQUEST:
                handleConnectReq(sub,function (res) {
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


function handleConnectReq(body,completion) {
    try {
        var req = P2pconnect_request.deserializeBinary(body);
        var uid = req.getTargetUid();
        var respond = new P2pconnect_response();
        var sock  = global.sockWithUid(uid);
        logger.info("recieve p2p connect req from=" + req.uid + " to=" + uid + " ip=" +  req.ip + " port=" + req.port );
        if(sock){
            
            respond.setIsOnline(true);
            respond.setIsExit(true);
            completion(respond);

            var respond = new P2p_receive_connect_notification();
            respond.setSponsorUid(req.user_id);
            respond.setSponsorIp(req.ip);
            respond.setSponsorPort(req.port);
            var notify = new Notification();
            notify.setType(Noti_type.ENUM_NOTIFICATION_TYPE_P2P_RECEIVE_CONNECT_REQ)
            var tbody  = new Buffer(respond.serializeBinary());
            notify.setTargetUid(uid)
            notify.getBody(tbody)
            app.wridataWithSock(sock,4,notify.serializeBinary());
            logger.info("p2p succuss to sent notification target is " + uid + " "+ sock.remoteAddress +':'+ sock.remotePort)
        }else{
            db.userById(uid,function (rows,err) {
                if(rows && rows.count > 0){
                    respond.setIsOnline(false);
                    respond.setIsExit(true);
                    logger.info("recieve p2p connect req false user is offline");
                }else{
                    respond.setIsOnline(false);
                    respond.setIsExit(false);
                    logger.info("recieve p2p connect req user is not exit");
                }
                completion(respond);
            })
        }
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