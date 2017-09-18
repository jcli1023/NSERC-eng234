<?php

$REGULAR_DATASET = 0;
$REGULAR_DELTA_DATASET = 1;
$ORIENTATIONS_DATASET = 2;
$ORIENTATIONS_DELTA_DATASET = 3;
$USER_DATASET = 4;

$traj_data = $_POST['traj_data'];
$movementName = $_POST['movementName'];
$datasetOption = $_POST['datasetOption'];

$new_traj_data = "";

$traj_data_decoded = json_decode($traj_data);

$arrlength = count($traj_data_decoded);

for ($i = 0; $i < $arrlength; $i++)
{
	$new_traj_data = $new_traj_data . $traj_data_decoded[$i]->x . ",";
	$new_traj_data = $new_traj_data . $traj_data_decoded[$i]->y . ",";
}

$new_traj_data = $new_traj_data . $movementName . "\n";

$pathtoTestDataset = "";
$relationName = "";

if ($datasetOption == $REGULAR_DATASET)
{
	$pathToTestDataset = "traj_data_append.txt";
}
else if ($datasetOption == $REGULAR_DELTA_DATASET)
{
	$pathToTestDataset = "traj_data_regular_delta_append.txt";
}
else if ($datasetOption == $ORIENTATIONS_DATASET)
{
	$pathToTestDataset = "traj_data_orientations_append.txt";
}
else if ($datasetOption == $ORIENTATIONS_DELTA_DATASET)
{
	$pathToTestDataset = "traj_data_orientations_delta_append.txt";
}

else if ($datasetOption == $USER_DATASET)
{
	$pathToTestDataset = "traj_data_user_append.txt";
}

if (!file_exists($pathToTestDataset))
{
	$fp2 = fopen($pathToTestDataset, 'w');
}
else
{
	$fp2 = fopen($pathToTestDataset, 'a');
}
$new_traj_data_append = $new_traj_data;

fwrite($fp2, $new_traj_data_append);
fclose($fp2);

?>
