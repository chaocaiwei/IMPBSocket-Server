/**
 * Created by jztech-weichaocai on 2018/3/27.
 */

var logger     = require("./log").logger("DataBase")
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '298136',
    database : 'default',
    useConnectionPooling: true
});

exports.latestUserId = function (handle) {
    connection.query('SELECT * FROM `users` WHERE user_id = (SELECT MAX(user_id) FROM `users`);', function (error, results, fields) {
        if (error) {
            logger.error(error);
        } else{
            var id = results[0].user_id;
            console.log('sucess to fine latest user_id=', results[0].user_id);
            handle(id);
        }

    });
}

exports.insertLoginInfo = function (username,pwd,token,completion) {
    var user = {
        "user_name" :username,
        "pwd":pwd,
        "token" : token
    };
    connection.query('INSERT INTO users set ?  ',user, function (error, results, fields) {
        if(error){
            logger.error(error);
            if (completion) {
                completion(error)
            }
        }else{
            logger.info("insert user sucess user=" + user.toString());
            if (completion) {
                completion(undefined)
            }
        }

    });
}


exports.userById   = function (uid,completion) {
    connection.query("SELECT * FROM users WHERE user_id =?",[uid],function (err,rows) {
        if(err){
            logger.error(err)
            completion([],err);
        }else{
            logger.info("fine user sucess id="  + uid +   " users=" + rows[0].toString())
            completion(rows,undefined);
        }

    })
}

exports.userWithName = function (name,completion) {
    connection.query("SELECT * FROM users WHERE user_name = ? ",[name],function (err,rows) {
        if (err){
            logger.error(err)
            if (completion){
                completion([],err);
            }
        }else{
            logger.info("fine user with name=" + name + " users=" + rows.toString());
            if (completion){
                completion(rows,undefined);
            }
        }

    })
}

exports.updateUser = function (user) {
    connection.query("UPDATE users set ? where user_id =?",[user,user.user_id],function (err,rows) {
        if(err){
            logger.error(err)
        }else {
            logger.info("update user sucess user=" + user.toString())
        }
    })
}

exports.connect = function () {
    connection.connect();
}