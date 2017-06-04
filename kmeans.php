<?php
session_start();

$resultsCompile = shell_exec("javac -cp weka.jar: ClusterWeka.java");
$results = shell_exec("java -cp weka.jar: ClusterWeka 2>&1");

echo $results
?>
