<?php
$TRAINING_DATASET = 0;
$TEST_DATASET = 1;
$datasetChoice = $_POST['datasetChoice'];

if(isset($_FILES['datasetChosen'])){
	$file_tmp = $_FILES['datasetChosen']['tmp_name'];
	move_uploaded_file($file_tmp,"test/test_file.txt");
}

echo "upload_dataset.php";
#if ($datasetChoice == TRAINING_DATASET)
#else if ($datasetChoice == TEST_DATASET)
?>
