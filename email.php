<?php
$to = $_POST['email'];
$camNum = $_POST['camNum'];
$time = $_POST['time'];
$subject = "Camera-".$camNum." Object Missing ". $time;
$txt = "Camera-".$camNum." Tracked Object was missing at ". $time;
$headers = "From: webmaster@dsmp.ryerson.ca" . "\r\n";
mail($to,$subject,$txt,$headers);
echo "Email sent to " . $to;
?>
