<?php
	session_start();
	if(isset($_SESSION['id'])){
		echo "success";
	}else{
		echo "fail";
	}
?>