<?php

$REGULAR_DATASET = 0;
$REGULAR_DELTA_DATASET = 1;
$ORIENTATIONS_DATASET = 2;
$ORIENTATIONS_DELTA_DATASET = 3;
$USER_DATASET = 4;

$datasetOption = $_POST['datasetOption'];

$pathToTrainingDataset = "";
$pathToAppendData = "";

if ($datasetOption == $REGULAR_DATASET)
{
	$pathToTrainingDataset = "train_traj_data_backup.txt";
	$pathToAppendData = "traj_data_append.txt";
}
else if ($datasetOption == $REGULAR_DELTA_DATASET)
{
	$pathToTrainingDataset = "deltaRegular-Train.txt";
	$pathToAppendData = "traj_data_regular_delta_append.txt";
}
else if ($datasetOption == $ORIENTATIONS_DATASET)
{
	$pathToTrainingDataset = "trainDiffOrientations.txt";
	$pathToAppendData = "traj_data_orientations_append.txt";
}
else if ($datasetOption == $ORIENTATIONS_DELTA_DATASET)
{
	$pathToTrainingDataset = "deltaTrainDifferentOrientation.txt";
	$pathToAppendData = "traj_data_orientations_delta_append.txt";
}

else if ($datasetOption == $USER_DATASET)
{
	$pathToTrainingDataset = "user_train_traj_data.txt";
	$pathToAppendData = "traj_data_user_append.txt";
}

$fp = fopen($pathToTrainingDataset, 'a+');
$appendFile = file_get_contents($pathToAppendData);
fwrite($fp, $appendFile);
fclose($fp);

?>
