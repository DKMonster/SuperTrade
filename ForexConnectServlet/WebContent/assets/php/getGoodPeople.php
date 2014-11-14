<?php
	include("mysql_connect.php");

	session_start();
	if(isset($_SESSION['id'])){
		$sql = "SELECT user_id , user_nickname , user_picture , user_login_date 
				FROM user 
				WHERE user_id != ".$_SESSION['id']." and user_id 
				NOT IN (
						SELECT follow_id 
						FROM follower a , user b 
						WHERE a.user_id = ".$_SESSION['id']." and a.follow_id = b.user_id
					)";
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