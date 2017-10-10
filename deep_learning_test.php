<?php
$datasetOption = $_POST['dataset'];
$results = shell_exec("python3 sepideh_nn.py hidden " . $datasetOption);

#$results = system('python3 sepideh_nn.py hidden ' . $datasetOption, $retval);

echo trim($results);
//flush();
?>
