<?php
	$type = $_POST['type'];

	if( $type != null ) {
		session_start();
		echo $_SESSION["$type"];
	}else{
		echo '您無權限觀看此頁面!';
	}

?>