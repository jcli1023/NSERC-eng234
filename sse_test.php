<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
session_start();

$_SESSION['dumbCount'] = $_SESSION['dumbCount']+1;

//$time = date('r');
//echo "data: The server time is: {$time}\n\n";
//echo "event: stupid\n"
echo "retry: 500\n";
echo "id: ".$_SESSION['dumbCount']."\n";
//echo "data: The server time is: {$time}\n\n";

$arrlength = count($_SESSION['object']['cam']);
for($i = 1; $i <= $arrlength; $i++){	
	$camName = "cam".$i;
	//echo "data: camName: ".$camName."\n";
	$obj = json_decode($_SESSION['object']['cam']["$camName"]);
	/*foreach($obj[1]->segments as &$points) {
		//echo $points[0].",".$points[1]."\n";
		$points[0] = $points[0] + 10;
		$points[1] = $points[1] + 10;
	
	}*/
	$arrlength = count($obj[1]->segments);
	for ($i = 0; $i < $arrlength; $i++)
	{
		$obj[1]->segments[$i][0] += 10;
		$obj[1]->segments[$i][1] += 10;
	}
	
	$obj = json_encode($obj);
	$_SESSION['object']['cam']["$camName"] = $obj;
	echo "data: ".$obj;
}
echo "\n\n";
//	echo "data: ".$_SESSION['cams']['object'][1]."\n\n";
flush();
?>
