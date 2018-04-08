# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.21)
# Database: defult
# Generation Time: 2018-04-08 07:24:10 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table add_friend_req
# ------------------------------------------------------------

DROP TABLE IF EXISTS `add_friend_req`;

CREATE TABLE `add_friend_req` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) unsigned DEFAULT NULL,
  `avarta_url` text,
  `nicname` text,
  `ext_msg` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table friends
# ------------------------------------------------------------

DROP TABLE IF EXISTS `friends`;

CREATE TABLE `friends` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `online` int(1) NOT NULL DEFAULT '0',
  `avarta_url` text,
  `nicname` text,
  `remark` text,
  `relation_state` int(2) unsigned DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table message
# ------------------------------------------------------------

DROP TABLE IF EXISTS `message`;

CREATE TABLE `message` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `from_id` int(11) unsigned NOT NULL DEFAULT '0',
  `to_id` int(11) unsigned NOT NULL DEFAULT '0',
  `msg_type` int(2) unsigned DEFAULT NULL,
  `text_content` text,
  `lat` float DEFAULT NULL,
  `lon` float DEFAULT NULL,
  `img_url` text,
  `voice_url` text,
  `voice_name` text,
  `expression_id` text,
  `expression_name` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_name` varchar(255) CHARACTER SET utf8mb4 NOT NULL DEFAULT '',
  `pwd` text NOT NULL,
  `avarta_url` text,
  `user_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `online` int(2) NOT NULL DEFAULT '0',
  `token` text,
  `socket_ip` text,
  `port` int(11) unsigned DEFAULT NULL,
  `ip` text,
  `sock_port` int(11) unsigned DEFAULT NULL,
  `sock_ip` text,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name` (`user_name`),
  UNIQUE KEY `user_name_2` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`user_name`, `pwd`, `avarta_url`, `user_id`, `online`, `token`, `socket_ip`, `port`, `ip`, `sock_port`, `sock_ip`)
VALUES
	('user','123456',NULL,1,0,'6079633_user','127.0.0.1',56741,'192.168.0.100',54203,NULL),
	('user2','123456',NULL,2,0,'1393112_user2',NULL,NULL,NULL,NULL,NULL),
	('user1','123456',NULL,3,0,'9768120_user1','192.168.0.101',56743,'192.168.0.101',50850,NULL);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
