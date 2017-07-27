<?php
$TRAINING_DATASET = 0;
$TEST_DATASET = 1;
$datasetChoice = $_POST['datasetChoice'];

if(isset($_FILES['datasetChosen'])){
	$file_tmp = $_FILES['datasetChosen']['tmp_name'];
	if ($datasetChoice == $TRAINING_DATASET)
	{
		move_uploaded_file($file_tmp,"user_train_traj_data.txt");
	}
	else if ($datasetChoice == $TEST_DATASET)
	{
		move_uploaded_file($file_tmp,"user_test_traj_data.txt");
	}
}

print_r($_FILES);
print_r($_POST);

?>
