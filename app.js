
var logger = require('./log').logger('app');
var net = require('net');
var global = require("./global")
// var ProtoBuf = require("protobufjs");
var commonRoute = require("./routes/commonRoute"),
    messageRoute = require("./routes/messageRoute"),
    notificationRoute = require("./routes/notificationRoute")

var dgram = require('dgram');
var serverSocket = dgram.createSocket('udp4');
serverSocket.bind(25668);
serverSocket.on('message', function(msg, rinfo){
    logger.info('recv %s(%d bytes) from client %s:%d\n', msg, msg.length, rinfo.address, rinfo.port);
    serverSocket.send(msg, 0, msg.length, rinfo.port, rinfo.address);
});
serverSocket.on('error', function(err){
    logger.info('error, msg - %s, stack - %s\n', err.message, err.stack);
});

serverSocket.on('listening', function(){
    logger.info("echo server is listening on port 2566.");
});


var HOST = '0.0.0.0';
var PORT = 6969;
var server = net.createServer();
server.listen(PORT, HOST);
logger.info("server listen on "  + HOST + ":" + PORT);
server.on('connection', function(sock) {
    logger.info('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    sock.on('data', function(data) {

        var tempData = new Buffer(data)
        while (tempData.length){
            var header = data.slice(0,8)
            var margic = header.readUInt8(0)
            var seq    = header.readUInt32BE(1)
            var type   = header.readUInt8(5)
            var lenth  = header.readUInt16BE(6)
            var body =   tempData.slice(8,lenth+8)
            var lest = tempData.length - ( lenth + 8 )
            logger.info("Receive data :" + "margic=" + margic + " seq=" + seq + " type=" + type + " legth=" + lenth )
            var bodyData  = new  Uint8Array(body)
            routeWithReiceData(type,header,bodyData)
            if (lest.length > 0){
                logger.info("Has one more data packetge");
                tempData = data.slice(lenth+8,lest)
            }else {
                tempData = lest;
                break
            }
        }

        // type 1心跳包 2普通数据请求 3聊天消息 4推送
        function routeWithReiceData(type,header,body) {
            switch (type){
                case 1:
                    // 收到心跳包原样返回 客户端控制发送频率 必要时断开重连
                    sock.write(data)
                    break;
                case 2:
                    commonRoute.route(header,body,sock)
                    break;
                case 3:
                    messageRoute.route(body,function (uids) {
                        for (var i = 0;i < uids.length;i++ ){
                            var uid = uids[i]
                            var tsock = global.sockWithUid(uid)
                            if(tsock){
                                logger.info("Forwarded message to uid=" + uid)
                                tsock.write(data)
                            }else{
                                // 离线消息处理
                                logger.info("receive offline messsage to uid=" + uid)
                            }
                        }
                    })
                    break;
                case 4: // 收到推送的回执
                    notificationRoute.route(body,function () {
                        sock.write(data)
                    })
                    break;
            }
        }

        // function sentWith(header,response) {
        //     var resData = response.toBuffer()
        //     // 去掉length并替换
        //     header.writeUInt16BE(resData.length,6)
        //     var result = Buffer.concat([header,resData])
        //     sock.write(result)
        // }




    });


    // 为这个socket实例添加一个"close"事件处理函数
    sock.on('close', function(data) {
        global.offlineWithSock(sock)
        logger.info('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });


});

// type 1心跳包 2普通数据请求 3聊天消息 4推送
module.exports.wridataWithSock  = function (sock,type,body) {
    var margic = 129
    var seq    = GetRandomNum(0,0xffffffff)
    var lenth  = body.length
    var header = new Buffer(8)
    header.writeUInt8(margic)
    header.writeUInt32BE(seq,1)
    header.writeInt8(type,5)
    header.writeInt16BE(lenth,6)
    var buf = Buffer(body)
    var result = Buffer.concat([header,buf])
    sock.write(result)
}


function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}
