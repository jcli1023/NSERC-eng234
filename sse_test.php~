<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
session_start();

$_SESSION['dumbCount'] = $_SESSION['dumbCount']+1;
$camNum = $_GET['camNum'];
$camName = "cam".$camNum;
/*$frameDim = array($_GET['frameX'],$_GET['frameY']);
$vidDim = array($_GET['vidX'],$_GET['vidY']);
$ratioDim = array($frameDim[0]/$vidDim[0],$frameDim[1]/$vidDim[1]);
*/
$ratioDim = $_SESSION['frameRatio']["$camName"];
$time = $_SESSION['time']["$camName"];

echo "retry: 66\n";
echo "id: ".$_SESSION['dumbCount']."\n";
//echo "data: The server time is: {$time}\n\n";
//echo "data: ratioDim[0] ".$ratioDim[0]." ratioDim[1] ".$ratioDim[1]."\n";

//$arrlength = count($_SESSION['object']['cam']);

//$obj = json_decode($_SESSION['object']['cam']["$camName"]);

$input = addslashes($_SESSION['object']['cam']['cam1']);
//$input = $_SESSION['object']['cam']['cam1'];

$fp = fopen('sessionVar2.json', 'w');
fwrite($fp, $input);
fclose($fp);

$results = shell_exec("java -jar CheckThreshold.jar ".$camNum." ".$time." ".$ratioDim[0]." ".$ratioDim[1]." ".$input);

$_SESSION['object']['cam']["$camName"] = $results;


$fp = fopen('sessionVar3.json', 'w');
fwrite($fp, $results);
fclose($fp);
/*$arrlength = count($obj[1]->segments);
for ($i = 0; $i < $arrlength; $i++)
{
	$obj[1]->segments[$i][0] += 10;
	$obj[1]->segments[$i][1] += 10;
}
	
$obj = json_encode($obj);
$_SESSION['object']['cam']["$camName"] = $obj;
*
echo "data: ".$obj;*/
echo "data: ".$results;
echo "\n\n";

flush();
?>
