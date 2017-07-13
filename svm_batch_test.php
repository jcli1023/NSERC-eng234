<?php
session_start();

//$resultsCompile = shell_exec("javac -cp weka.jar:libsvm.jar: SVMBatch.java");
$results = shell_exec("java -cp weka.jar:libsvm.jar: SVMBatchTest");

echo trim($results);
//flush();
?>
