<?php
	//echo "I entered PHP<br>";
	//data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4
	$data = $_POST['frame'];
	$camNum = $_POST['cam'];
	$time = $_POST['time'];
	$camFolder = "CAMERA ".$camNum;
	list($type, $data) = explode(';', $data);
	list(, $data)      = explode(',', $data);
	$data = base64_decode($data);

	if (!file_exists("./".$camFolder))	
		mkdir("./".$camFolder);
	file_put_contents( "./".$camFolder."/".$time.'.jpg', $data);
	//file_put_contents( "./photos/".uniqid().'.png', $data);
	die();
?>
