<?php
	$data = $_POST['frame'];
	$camNum = $_POST['cam'];
	$time = $_POST['time'];
	$frameDim = $_POST['frameDim'];
	$vidDim = $_POST['vidDim'];
	$camFolder = "CAMERA-".$camNum;
	list($type, $data) = explode(';', $data);
	list(, $data)      = explode(',', $data);
	$data = base64_decode($data);

	if (!file_exists("./".$camFolder))	
		mkdir("./".$camFolder);
	file_put_contents( "./".$camFolder."/".$time.'.jpg', $data);
	die("frameDim: ".$frameDim[0]."x".$frameDim[1]." vidDim: ".$vidDim[0]."x".$vidDim[1]);
?>
