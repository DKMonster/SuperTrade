<?php
	//資料庫設定
	//資料庫位置
	$db_server = "localhost";
	//資料庫名稱
	$db_name = "supertrade";
	//資料庫管理者帳號
	$db_user = "supertrade";
	//資料庫管理者密碼
	$db_passwd = "supertrade";
	
	$conndata = mysql_connect($db_server, $db_user, $db_passwd);

	//對資料庫連線
	if(!$conndata){
		//echo 'conn_db: You can\'t connent mysql.';
	}else{
		//echo 'conn_db: You can connent mysql.';
	}
	//資料庫連線採UTF8
	mysql_query("SET NAMES 'utf8'" , $conndata);

	//選擇資料庫
	if(!@mysql_select_db($db_name)){
		//echo 'conn_table: You can\'t use table.';
	}else{
		//echo 'conn_table: You can use table.';
	}
?>