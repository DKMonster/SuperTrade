<?php
	include("mysql_connect.php");

	session_start();
	if(isset($_SESSION['id'])){
		$sql = "SELECT user_nickname , user_email , user_picture , user_account_public , user_performance_public , user_follower , user_login_date , user_login_time , user_login_ip FROM user WHERE user_id='".$_SESSION['id']."'";
		$result = mysql_query($sql);
		$row = mysql_fetch_assoc($result);
		$row['msg'] = "success";
		echo json_encode($row);
	}else{
		$row['msg'] = "fail";
		echo json_encode($row);
	}
?>