<?php
session_start();
$camNum = $_POST['cam'];
$coordinates = $_POST['coordinates'];
if ( !isset($_SESSION['dumbCount']) )
	$_SESSION['dumbCount'] = 0;
else
	$_SESSION['dumbCount'] = $_SESSION['dumbCount']+1;
//$_SESSION['cams']['object'][$camNum] = "Hello World!";
$_SESSION['cams']['object'][$camNum] = $coordinates;
//$data = $_POST['cam'];
echo $coordinates;
?>
