<?php
	include("mysql_connect.php");

	session_start();

	$user_id = $_SESSION['id'];

	if(isset($_SESSION['id'])){
		$sql = "SELECT * FROM `room` , `room_member` WHERE room.room_id = room_member.room_id and user_id = ".$user_id."";
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