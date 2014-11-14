<?php
	include("mysql_connect.php");

	session_start();

	$user_id = $_SESSION['id'];

	if(isset($_SESSION['id'])){
		$sql = "SELECT timeline_content , timeline_date , timeline_time , user_nickname , user_picture 
				FROM `timeline`,`user` 
				WHERE timeline.user_id = ".$user_id." and user.user_id = ".$user_id."";
		$result = mysql_query($sql);
		$row = mysql_fetch_assoc($result);

		$i = 1;
		$data = array();

		if( $row ){
			do {
				$data[$i] = $row;
				$i++;
			} while($row=mysql_fetch_assoc($result));
		} 

		$data[0]['msg'] = "success";
		echo json_encode($data);
	}else{
		$row[0]['msg'] = "fail";
		echo json_encode($row);
	}
?>