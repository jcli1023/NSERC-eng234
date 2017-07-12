<?php
//$resultsCompile = shell_exec("javac -cp weka.jar: ClusterWeka.java");
$results = shell_exec("java -cp weka.jar: ClusterWeka");

echo $results
//flush();
?>
