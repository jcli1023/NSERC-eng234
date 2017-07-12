<?php
session_start();

$data = $_POST['frame'];
$camNum = $_POST['cam'];
$time = $_POST['time'];
$camName = "cam".$camNum;
$_SESSION['time']["$camName"] = $time;
$frameDim = $_POST['frameDim'];
$vidDim = $_POST['vidDim'];
$camFolder = "CAMERA-".$camNum;
$_SESSION['frameRatio']["$camName"][0] = $frameDim[0]/$vidDim[0];
$_SESSION['frameRatio']["$camName"][1] = $frameDim[1]/$vidDim[1];
session_write_close();  

echo "_SESSION: ".$_SESSION['frameRatio']["$camName"][0]."x".$_SESSION['frameRatio']["$camName"][0]." ";
list($type, $data) = explode(';', $data);
list(, $data)      = explode(',', $data);
$data = base64_decode($data);

$startTime = microtime(true);
if (!file_exists("./".$camFolder))	
	mkdir("./".$camFolder);
file_put_contents( "./".$camFolder."/".$time.'.jpg', $data);

$endTime = microtime(true);
$write_time = $endTime - $startTime;
file_put_contents("timings.txt","screenshotWrite: ".$write_time."\n",FILE_APPEND);

die("frameDim: ".$frameDim[0]."x".$frameDim[1]." vidDim: ".$vidDim[0]."x".$vidDim[1]." time: ".$time);
?>
