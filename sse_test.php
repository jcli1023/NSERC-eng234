<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
session_start();

$_SESSION['dumbCount'] = $_SESSION['dumbCount']+1;
$camNum = $_GET['camNum'];

echo "retry: 500\n";
echo "id: ".$_SESSION['dumbCount']."\n";
//echo "data: The server time is: {$time}\n\n";

$arrlength = count($_SESSION['object']['cam']);
$camName = "cam".$camNum;
$obj = json_decode($_SESSION['object']['cam']["$camName"]);

$arrlength = count($obj[1]->segments);
for ($i = 0; $i < $arrlength; $i++)
{
	$obj[1]->segments[$i][0] += 10;
	$obj[1]->segments[$i][1] += 10;
}
	
$obj = json_encode($obj);
$_SESSION['object']['cam']["$camName"] = $obj;
echo "data: ".$obj;
echo "\n\n";

flush();
?>
