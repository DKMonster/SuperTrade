<?php
	include("mysql_connect.php");

	session_start();

	if(isset($_SESSION['id'])){

		$roomID = $_GET['roomID'];
		$user_id = $_SESSION['id'];
		$message_content = $_GET['message_content'];
		// get date
		date_default_timezone_set('Asia/Taipei');
		$date= date("Y/m/d");
		// get time
		$time= date("h:i:s");
		// check timeline or otherRoom
		if($roomID == "0"){
			$sql = "INSERT INTO timeline (user_id , timeline_content , timeline_date , timeline_time) VALUES ('".$user_id."' , '".$message_content."' , '".$date."' , '".$time."')";
			$result = mysql_query($sql);
			// $row = mysql_fetch_assoc($result);
			$row['msg'] = "success";
			echo json_encode($row);
		}else{
			$sql = "INSERT INTO room_message (user_id , room_id , room_message_content , room_message_date , room_message_time) VALUES ('".$user_id."' , '".$roomID."' , '".$message_content."' , '".$date."' , '".$time."')";
			$result = mysql_query($sql);
			// $row = mysql_fetch_assoc($result);
			$row['msg'] = "success";
			echo json_encode($row);
		}
	}else{
		$row['msg'] = "fail";
		echo json_encode($row);
	}
?>