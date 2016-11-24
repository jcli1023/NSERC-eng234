<?php
$to = $POST['email'];
$time = $POST['reportTimeFrame'];
$subject = "Object Missing ". $time;
$txt = "Tracked Object was missing at ". $time;
$headers = "From: webmaster@dsmp.ryerson.ca" . "\r\n" .
mail($to,$subject,$txt,$headers);
echo "email sent to " . $to;
?>
