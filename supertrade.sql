-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- 主機: 127.0.0.1
-- 產生時間： 2014 年 11 月 22 日 10:45
-- 伺服器版本: 5.5.39
-- PHP 版本： 5.4.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 資料庫： `supertrade`
--

DELIMITER $$
--
-- 函數
--
CREATE DEFINER=`supertrade`@`localhost` FUNCTION `SPLIT_STR`(
  x VARCHAR(255),
  delim VARCHAR(12),
  pos INT
) RETURNS varchar(255) CHARSET utf8
RETURN REPLACE(SUBSTRING(SUBSTRING_INDEX(x, delim, pos),
       LENGTH(SUBSTRING_INDEX(x, delim, pos -1)) + 1),
       delim, '')$$

DELIMITER ;

-- --------------------------------------------------------

--
-- 資料表結構 `follower`
--

CREATE TABLE IF NOT EXISTS `follower` (
`follower_id` int(11) NOT NULL COMMENT '跟隨者編號',
  `user_id` int(11) NOT NULL COMMENT '使用者編號',
  `follow_id` int(11) NOT NULL COMMENT '被跟隨編號'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- 資料表的匯出資料 `follower`
--

INSERT INTO `follower` (`follower_id`, `user_id`, `follow_id`) VALUES
(5, 1, 2);

-- --------------------------------------------------------

--
-- 資料表結構 `message`
--

CREATE TABLE IF NOT EXISTS `message` (
`message_id` int(11) NOT NULL COMMENT '訊息編號',
  `from_user_id` int(11) NOT NULL COMMENT '訊息發送者',
  `to_user_id` int(11) NOT NULL COMMENT '訊息收件者',
  `message_content` text NOT NULL COMMENT '訊息內容',
  `message_date` date NOT NULL COMMENT '訊息日期',
  `message_time` time NOT NULL COMMENT '訊息時間',
  `message_read` int(1) NOT NULL DEFAULT '0' COMMENT '訊息完成讀取'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- 資料表結構 `room`
--

CREATE TABLE IF NOT EXISTS `room` (
`room_id` int(11) NOT NULL COMMENT '主題室編號',
  `room_leader_id` text NOT NULL COMMENT '主題室管理者',
  `room_title` text NOT NULL COMMENT '主題室名稱',
  `room_content` text COMMENT '主題室簡介',
  `room_date` date NOT NULL COMMENT '主題室創建日期',
  `room_time` time NOT NULL COMMENT '主題室創建時間'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- 資料表的匯出資料 `room`
--

INSERT INTO `room` (`room_id`, `room_leader_id`, `room_title`, `room_content`, `room_date`, `room_time`) VALUES
(1, '1', '主題室1', '主題室1簡介', '2014-11-12', '20:59:00'),
(2, '2', '主題室2', '主題室2簡介', '2014-11-12', '21:25:00'),
(3, '3', '主題室3', '主題室3簡介', '2014-11-12', '21:26:00');

-- --------------------------------------------------------

--
-- 資料表結構 `room_member`
--

CREATE TABLE IF NOT EXISTS `room_member` (
`room_member_id` int(11) NOT NULL COMMENT '主題室編號',
  `room_id` int(11) NOT NULL COMMENT '主題室編號',
  `user_id` int(11) NOT NULL COMMENT '主題室成員編號',
  `room_member_join` int(1) DEFAULT '1' COMMENT '是否已加入'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- 資料表的匯出資料 `room_member`
--

INSERT INTO `room_member` (`room_member_id`, `room_id`, `user_id`, `room_member_join`) VALUES
(1, 1, 1, 1),
(2, 1, 2, 1),
(3, 1, 3, 1),
(4, 2, 1, 1),
(5, 2, 2, 1),
(6, 3, 2, 1),
(7, 3, 3, 1);

-- --------------------------------------------------------

--
-- 資料表結構 `room_message`
--

CREATE TABLE IF NOT EXISTS `room_message` (
`room_message_id` int(11) NOT NULL COMMENT '主題室訊息編號',
  `room_id` int(11) NOT NULL COMMENT '主題室編號',
  `user_id` int(11) NOT NULL COMMENT '發送者編號',
  `room_message_content` text NOT NULL COMMENT '主題室訊息內容',
  `room_message_date` date NOT NULL COMMENT '主題室訊息發送日期',
  `room_message_time` time NOT NULL COMMENT '主題室訊息發送時間'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- 資料表的匯出資料 `room_message`
--

INSERT INTO `room_message` (`room_message_id`, `room_id`, `user_id`, `room_message_content`, `room_message_date`, `room_message_time`) VALUES
(1, 1, 1, '「我要你們現在就出去花錢」—《華爾街之狼》教我們的13堂課', '2014-11-13', '19:36:00'),
(2, 2, 1, '交易前決定方向，是買或賣，再決定下單的數量，就可以實際進行了，這時的交易被俗稱為“開倉”（Open trade , Entry order）', '2014-11-13', '06:19:00'),
(3, 1, 1, 'Open the Trade.', '2014-11-13', '21:45:00'),
(4, 1, 2, '你所不知道的ForexConnect', '2014-11-13', '22:20:26'),
(5, 1, 1, '我所知道的FXCM', '2014-11-14', '03:18:55'),
(6, 2, 1, '我只能顆顆的說', '2014-11-14', '03:25:00');

-- --------------------------------------------------------

--
-- 資料表結構 `timeline`
--

CREATE TABLE IF NOT EXISTS `timeline` (
`timeline_id` int(11) NOT NULL COMMENT '動態時報編號',
  `user_id` int(11) NOT NULL COMMENT '動態時報擁有者編號',
  `timeline_content` text NOT NULL COMMENT '動態時報內容',
  `timeline_date` date NOT NULL COMMENT '動態時報發布日期',
  `timeline_time` time NOT NULL COMMENT '動態時報發布時間'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- 資料表的匯出資料 `timeline`
--

INSERT INTO `timeline` (`timeline_id`, `user_id`, `timeline_content`, `timeline_date`, `timeline_time`) VALUES
(1, 1, 'Uber is Taipei''s best way to request a safe, reliable, and affordable ride within minutes. Use Uber on your phone to connect to a driver in Taipei at the touch of a ...', '2014-11-13', '15:38:00'),
(2, 1, '外匯交易方法和股票有一個主要的區別，但和期貨、黃金一樣可以先買，也可以先賣，所以無論是牛市或熊市，賺錢的機會是一樣的，在牛市時先買，在熊市時先賣，只要對趨勢的判斷正確，不管價格升降，都可能賺到同樣多的錢，這種雙向交易的功能就比股市靈活多了。', '2014-11-13', '20:20:00'),
(3, 2, '限價單也有用來開倉的。', '2014-11-13', '18:36:00'),
(4, 1, '外匯交易', '2014-11-14', '03:18:38'),
(5, 1, 'SuperTrade\n', '2014-11-14', '05:37:49'),
(6, 1, 'ST', '2014-11-19', '06:07:58');

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
`user_id` int(11) NOT NULL COMMENT '使用者編號',
  `user_nickname` text NOT NULL COMMENT '使用者暱稱',
  `user_email` text NOT NULL COMMENT '使用者信箱',
  `user_password` text NOT NULL COMMENT '使用者密碼',
  `user_picture` text COMMENT '使用者照片',
  `user_account_public` int(1) NOT NULL DEFAULT '0' COMMENT '使用者帳戶公開',
  `user_performance_public` int(1) NOT NULL DEFAULT '0' COMMENT '使用者交易公開',
  `user_signup_date` date NOT NULL COMMENT '使用者註冊日期',
  `user_signup_time` time NOT NULL COMMENT '使用者註冊時間',
  `user_login_date` date DEFAULT NULL COMMENT '使用者最後登入日期',
  `user_login_time` time DEFAULT NULL COMMENT '使用者最後登入時間',
  `user_login_ip` text COMMENT '使用者最後登入位址'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- 資料表的匯出資料 `user`
--

INSERT INTO `user` (`user_id`, `user_nickname`, `user_email`, `user_password`, `user_picture`, `user_account_public`, `user_performance_public`, `user_signup_date`, `user_signup_time`, `user_login_date`, `user_login_time`, `user_login_ip`) VALUES
(1, 'SuperTrade管理員', 'st-root@supertrade.com', 'st-root', 'david.png', 0, 0, '2014-11-11', '18:06:06', '2014-11-17', '02:49:03', '192.168.1.145'),
(2, 'SuperTrade測試員01', 'st-test01@supertrade.com', 'st-test01', 'mandy.png', 0, 0, '2014-11-13', '13:15:04', NULL, NULL, NULL),
(3, 'SuperTrade測試員02', 'st-test01@supertrade.com', 'st-test02', 'mark.png', 0, 0, '2014-11-13', '15:22:47', NULL, NULL, NULL),
(4, 'SuperTrade測試員03', 'st-test03@supertrade.com', 'st-test03', 'mica.png', 0, 0, '2014-11-13', '21:43:14', NULL, NULL, NULL);

--
-- 已匯出資料表的索引
--

--
-- 資料表索引 `follower`
--
ALTER TABLE `follower`
 ADD PRIMARY KEY (`follower_id`);

--
-- 資料表索引 `message`
--
ALTER TABLE `message`
 ADD PRIMARY KEY (`message_id`);

--
-- 資料表索引 `room`
--
ALTER TABLE `room`
 ADD PRIMARY KEY (`room_id`);

--
-- 資料表索引 `room_member`
--
ALTER TABLE `room_member`
 ADD PRIMARY KEY (`room_member_id`);

--
-- 資料表索引 `room_message`
--
ALTER TABLE `room_message`
 ADD PRIMARY KEY (`room_message_id`);

--
-- 資料表索引 `timeline`
--
ALTER TABLE `timeline`
 ADD PRIMARY KEY (`timeline_id`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
 ADD PRIMARY KEY (`user_id`);

--
-- 在匯出的資料表使用 AUTO_INCREMENT
--

--
-- 使用資料表 AUTO_INCREMENT `follower`
--
ALTER TABLE `follower`
MODIFY `follower_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '跟隨者編號',AUTO_INCREMENT=6;
--
-- 使用資料表 AUTO_INCREMENT `message`
--
ALTER TABLE `message`
MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '訊息編號';
--
-- 使用資料表 AUTO_INCREMENT `room`
--
ALTER TABLE `room`
MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主題室編號',AUTO_INCREMENT=4;
--
-- 使用資料表 AUTO_INCREMENT `room_member`
--
ALTER TABLE `room_member`
MODIFY `room_member_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主題室編號',AUTO_INCREMENT=8;
--
-- 使用資料表 AUTO_INCREMENT `room_message`
--
ALTER TABLE `room_message`
MODIFY `room_message_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主題室訊息編號',AUTO_INCREMENT=7;
--
-- 使用資料表 AUTO_INCREMENT `timeline`
--
ALTER TABLE `timeline`
MODIFY `timeline_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '動態時報編號',AUTO_INCREMENT=7;
--
-- 使用資料表 AUTO_INCREMENT `user`
--
ALTER TABLE `user`
MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '使用者編號',AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
