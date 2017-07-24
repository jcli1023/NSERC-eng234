<?php
$datasetOption = $_POST['dataset'];
//$resultsCompile = shell_exec("javac -cp weka.jar:libsvm.jar: TrainModel.java");
//$results = shell_exec("java -cp weka.jar:libsvm.jar: TrainModel ");
$results = shell_exec("java -cp weka.jar:libsvm.jar: TrainModel " . $datasetOption);

echo $results
//flush();

?>
