<?php
	include("mysql_connect.php");

	$email = $_POST['email'];
	$pwd = $_POST['pwd'];

	//判斷帳號密碼是否為空值
	//確認密碼輸入的正確性
	if( $email != null && $pwd != null ) {
		
		session_start();

		$sql = "SELECT * FROM user WHERE user_email='".$email."'";
		$result = mysql_query($sql);
		$row = mysql_fetch_assoc($result);

		$pwdstr = md5($row['user_password']);

		if($pwdstr == md5($pwd)){
			// get ip 
			if (!empty($_SERVER['HTTP_CLIENT_IP']))
				$ip=$_SERVER['HTTP_CLIENT_IP'];
			else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
				$ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
			else
				$ip=$_SERVER['REMOTE_ADDR'];
			// get date
			date_default_timezone_set('Asia/Taipei');
			$date= date("Y/m/d");
			// get time
			$time= date("h:i:s");
			// sql
			mysql_query("UPDATE `user` SET user_login_ip='".$ip."' , user_login_date='".$date."' , user_login_time='".$time."'  WHERE user_id='".$row['user_id']."'");
			$_SESSION['id'] = $row['user_id'];
			$_SESSION['nickname'] = $row['user_nickname'];

			echo "success";
		}else{
			echo "fail";
		}
	}else{
		echo '您無權限觀看此頁面!';
	}

?>