<?php

$traj_data = $_POST['traj_data'];
$response = $_POST['response'];
$predicted = $_POST['predicted'];

$new_traj_data = "";



$traj_data_decoded = json_decode($traj_data);

$arrlength = count($traj_data_decoded);

for ($i = 0; $i < $arrlength; $i++)
{
	$new_traj_data = $new_traj_data . $traj_data_decoded[$i]->x . ",";
	$new_traj_data = $new_traj_data . $traj_data_decoded[$i]->y . ",";
}

$text = $response . " " . trim($predicted) . " " . trim($new_traj_data) . "\n";

$startTime = microtime(true);

$fp = fopen('responses_train_offline.txt', 'a');
fwrite($fp, $text);
fclose($fp);

$endTime = microtime(true);
$write_time = $endTime - $startTime;
file_put_contents("timings.txt","response_train_offlineWrite: ".$write_time."\n",FILE_APPEND);
?>


