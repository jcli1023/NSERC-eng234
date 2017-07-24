<?php
$datasetOption = $_POST['dataset'];
//$resultsCompile = shell_exec("javac -cp weka.jar: ClusterWeka.java");
//$results = shell_exec("java -cp weka.jar: ClusterWeka ");
$results = shell_exec("java -cp weka.jar: ClusterWeka " . $datasetOption);

echo $results
//flush();
?>
