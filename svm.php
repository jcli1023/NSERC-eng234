<?php
session_start();

//$resultsCompile = shell_exec("javac -cp weka.jar:libsvm.jar: TestModel.java");
$results = shell_exec("java -cp weka.jar:libsvm.jar: TestModel");

echo trim($results);
//flush();
?>
