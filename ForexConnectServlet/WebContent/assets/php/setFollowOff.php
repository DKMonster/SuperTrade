<?php
	include("mysql_connect.php");

	session_start();

	if(isset($_SESSION['id'])){

		$user_id = $_SESSION['id'];
		$follow_id = $_GET['follow_id'];
		// check timeline or otherRoom
			$sql = "DELETE FROM follower 
					WHERE user_id = ".$user_id." and follow_id = ".$follow_id."";
			$result = mysql_query($sql);
			// $row = mysql_fetch_assoc($result);
			$row['msg'] = "success";
			echo json_encode($row);
	}else{
		$row['msg'] = "fail";
		echo json_encode($row);
	}
?>