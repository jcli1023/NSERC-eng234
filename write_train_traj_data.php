<?php
session_start();

$traj_data = $_POST['traj_data'];
$movementLabel = $_POST['movementLabel'];

$new_traj_data = "";

if (!file_exists("train_offline_traj_data.txt"))
{
	$fp = fopen('train_offline_traj_data.txt', 'w');
	$new_traj_data = "@relation trajdataTest

@attribute x1 numeric
@attribute y1 numeric
@attribute x2 numeric
@attribute y2 numeric
@attribute x3 numeric
@attribute y3 numeric
@attribute x4 numeric
@attribute y4 numeric
@attribute x5 numeric
@attribute y5 numeric
@attribute x6 numeric
@attribute y6 numeric
@attribute x7 numeric
@attribute y7 numeric
@attribute x8 numeric
@attribute y8 numeric
@attribute x9 numeric
@attribute y9 numeric
@attribute x10 numeric
@attribute y10 numeric
@attribute x11 numeric
@attribute y11 numeric
@attribute x12 numeric
@attribute y12 numeric
@attribute x13 numeric
@attribute y13 numeric
@attribute x14 numeric
@attribute y14 numeric
@attribute x15 numeric
@attribute y15 numeric
@attribute x16 numeric
@attribute y16 numeric
@attribute x17 numeric
@attribute y17 numeric
@attribute x18 numeric
@attribute y18 numeric
@attribute x19 numeric
@attribute y19 numeric
@attribute x20 numeric
@attribute y20 numeric
@attribute x21 numeric
@attribute y21 numeric
@attribute x22 numeric
@attribute y22 numeric
@attribute x23 numeric
@attribute y23 numeric
@attribute x24 numeric
@attribute y24 numeric
@attribute x25 numeric
@attribute y25 numeric
@attribute x26 numeric
@attribute y26 numeric
@attribute x27 numeric
@attribute y27 numeric
@attribute x28 numeric
@attribute y28 numeric
@attribute x29 numeric
@attribute y29 numeric
@attribute x30 numeric
@attribute y30 numeric
@attribute x31 numeric
@attribute y31 numeric
@attribute x32 numeric
@attribute y32 numeric
@attribute x33 numeric
@attribute y33 numeric
@attribute x34 numeric
@attribute y34 numeric
@attribute x35 numeric
@attribute y35 numeric
@attribute x36 numeric
@attribute y36 numeric
@attribute x37 numeric
@attribute y37 numeric
@attribute x38 numeric
@attribute y38 numeric
@attribute x39 numeric
@attribute y39 numeric
@attribute x40 numeric
@attribute y40 numeric
@attribute x41 numeric
@attribute y41 numeric
@attribute x42 numeric
@attribute y42 numeric
@attribute x43 numeric
@attribute y43 numeric
@attribute x44 numeric
@attribute y44 numeric
@attribute x45 numeric
@attribute y45 numeric
@attribute x46 numeric
@attribute y46 numeric
@attribute x47 numeric
@attribute y47 numeric
@attribute x48 numeric
@attribute y48 numeric
@attribute x49 numeric
@attribute y49 numeric
@attribute x50 numeric
@attribute y50 numeric
@attribute x51 numeric
@attribute y51 numeric
@attribute x52 numeric
@attribute y52 numeric
@attribute x53 numeric
@attribute y53 numeric
@attribute x54 numeric
@attribute y54 numeric
@attribute x55 numeric
@attribute y55 numeric
@attribute x56 numeric
@attribute y56 numeric
@attribute x57 numeric
@attribute y57 numeric
@attribute x58 numeric
@attribute y58 numeric
@attribute x59 numeric
@attribute y59 numeric
@attribute x60 numeric
@attribute y60 numeric
@attribute result {Half-Circle, Line, Sine}


@data\n";

}
else
{
	$fp = fopen('train_offline_traj_data.txt', 'a');
}

$traj_data_decoded = json_decode($traj_data);

$arrlength = count($traj_data_decoded);

for ($i = 0; $i < $arrlength; $i++)
{
	$new_traj_data = $new_traj_data . $traj_data_decoded[$i]->x . ",";
	$new_traj_data = $new_traj_data . $traj_data_decoded[$i]->y . ",";
}

$new_traj_data = $new_traj_data . $movementLabel . "\n";


fwrite($fp, $new_traj_data);
fclose($fp);

?>


