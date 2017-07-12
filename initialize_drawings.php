<?php
session_start();

$camNum = $_POST['cam'];
$coordinates = $_POST['coordinates'];
$timeFrame = $_POST['timeFrame'];
$frameDim = $_POST['frameDim'];
$vidDim = $_POST['vidDim'];

$camName = "cam".$camNum;
$ratioDim = $_SESSION['frameRatio']["$camName"];
$time = $_SESSION['time']["$camName"];
//$ratioDim = array($frameDim[0]/$vidDim[0],$frameDim[1]/$vidDim[1]);


//echo "ratioDim[0]: ".$ratioDim[0]." ratioDim[1]: ".$ratioDim[1];

#$fp = fopen('resultsPaperJs.json', 'w');
#fwrite($fp, $coordinates);
#fclose($fp);

//$obj = json_decode($coordinates);

//if ($camNum == 1){
//	$results = shell_exec("java -jar InitializeObject.jar ".$camNum." ".$time." ".$ratioDim[0]." ".$ratioDim[1]." ".addslashes($coordinates));
//}
//elseif ($camNum == 2){

//$resultsCompile = shell_exec("javac -cp lib/x64/json-simple-1.1.1.jar:lib/x64/opencv-310.jar: InitializeObject.java");
$results = shell_exec("java -cp lib/x64/json-simple-1.1.1.jar:lib/x64/opencv-310.jar: InitializeObject ".$camNum." ".$time." ".$ratioDim[0]." ".$ratioDim[1]." ".addslashes($coordinates));
	//$results = shell_exec("java -jar InitializeObject_old.jar ".$camNum." ".$time." ".$ratioDim[0]." ".$ratioDim[1]." ".addslashes($coordinates));
//}


$json = $results;
//$json = json_encode($obj);

#$fp = fopen('resultsPhp.json', 'w');
#fwrite($fp, $json);
#fclose($fp);


$_SESSION['object']['cam']["$camName"] = $json;
session_write_close();  
//echo "sessionVar: ".$_SESSION['object']['cam']['cam1'];
echo $_SESSION['object']['cam']["$camName"];



#$fp = fopen('sessionVar1.json', 'w');
#fwrite($fp,$_SESSION['object']['cam']['cam1']);
#fclose($fp);

?>


