<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
session_start();

$time = date('r');
//echo "data: The server time is: {$time}\n\n";
//echo "event: stupid\n"
echo "retry: 500\n";
//echo "id: 1\n";
//echo "data: The server time is: {$time}\n\n";
$_SESSION['dumbCount'] = $_SESSION['dumbCount']+1;
echo "data: ".$_SESSION['cams']['object']['1']." ".$_SESSION['dumbCount']."\n\n";
flush();
?>
