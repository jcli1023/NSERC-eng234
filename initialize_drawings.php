<?php
session_start();
$camNum = $_POST['cam'];
$_SESSION['dumbCount'] = 0;
$_SESSION['cams']['object']['1'] = "Hello World!";
$data = $_POST['camNum'];
echo $data;
?>
