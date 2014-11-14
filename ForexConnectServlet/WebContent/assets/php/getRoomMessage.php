<?php
	include("mysql_connect.php");

	session_start();

	$roomID = $_GET['roomID'];

	if(isset($_SESSION['id'])){
		$sql = "SELECT b.user_id , user_picture , user_nickname , room_message_content , room_message_date , room_message_time 
				FROM `room_message` a , `user` b 
				WHERE a.room_id = ".$roomID." and a.user_id = b.user_id 
				ORDER BY a.room_message_id";
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