<?php
	include("mysql_connect.php");

	session_start();
	if(isset($_SESSION['id'])){
		$sql = "SELECT * FROM room WHERE user_id='".$_SESSION['id']."'";
		$result = mysql_query($sql);
		$row = mysql_fetch_assoc($result);
		$row['msg'] = "success";
		echo json_encode($row);
	}else{
		$row['msg'] = "fail";
		echo json_encode($row);
	}
?>