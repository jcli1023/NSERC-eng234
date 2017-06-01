<?php
session_start();

$resultsCompile = shell_exec("javac -cp weka.jar:libsvm.jar: WekaTest1.java");
$results = shell_exec("java -cp weka.jar:libsvm.jar: WekaTest1 2>&1");
//$resultsTest = shell_exec("ls 2>&1");

//echo $resultsTest
echo $results
?>
