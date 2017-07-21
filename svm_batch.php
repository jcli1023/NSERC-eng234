<?php
$datasetOption = $_POST['dataset'];
//$resultsCompile = shell_exec("javac -cp weka.jar:libsvm.jar: SVMBatch.java ");
//$results = shell_exec("java -cp weka.jar:libsvm.jar: SVMBatch ");
$results = shell_exec("java -cp weka.jar:libsvm.jar: SVMBatch " . "5");

echo trim($results);
//flush();
?>
