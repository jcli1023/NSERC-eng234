<?php
$datasetOption = $_POST['dataset'];
//$resultsCompile = shell_exec("javac -cp weka.jar:libsvm.jar: TestModel.java");
//$results = shell_exec("java -cp weka.jar:libsvm.jar: TestModel ");
$results = shell_exec("java -cp weka.jar:libsvm.jar: TestModel " . $datasetOption);

echo trim($results);
//flush();
?>
