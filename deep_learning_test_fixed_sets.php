<?php
$datasetOption = $_POST['dataset'];
$results = shell_exec("python3 sepideh_nn_fixed_sets.py");

#$results = system('python3 sepideh_nn.py hidden ' . $datasetOption, $retval);

echo trim($results);
//flush();
?>
