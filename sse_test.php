<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
session_start();

$_SESSION['dumbCount'] = $_SESSION['dumbCount']+1;

//$time = date('r');
//echo "data: The server time is: {$time}\n\n";
//echo "event: stupid\n"
echo "retry: 500\n";
echo "id: ".$_SESSION['dumbCount']."\n";
//echo "data: The server time is: {$time}\n\n";

$arrlength = count($_SESSION['cams']);
for($i = 0; $i < $arrlength; $i++){
	echo "data: ".$_SESSION['cams']['object'][1]."\n";
}
echo "\n\n";
//	echo "data: ".$_SESSION['cams']['object'][1]."\n\n";
flush();
?>
