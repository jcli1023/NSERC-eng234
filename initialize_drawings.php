<?php
session_start();

$camNum = $_POST['cam'];
$coordinates = $_POST['coordinates'];
$timeFrame = $_POST['timeFrame'];
$frameDim = $_POST['frameDim'];
$vidDim = $_POST['vidDim'];

$camName = "cam".$camNum;
$ratioDim = $_SESSION['frameRatio']["$camName"];
//$ratioDim = array($frameDim[0]/$vidDim[0],$frameDim[1]/$vidDim[1]);


//echo "ratioDim[0]: ".$ratioDim[0]." ratioDim[1]: ".$ratioDim[1];

$fp = fopen('resultsPaperJs.json', 'w');
fwrite($fp, $coordinates);
fclose($fp);

//$obj = json_decode($coordinates);

//var_dump($obj);
/*echo $obj[0]."\n";
echo $obj[1]->applyMatrix."\n";

$arrlength = count($obj[1]->segments);
echo $arrlength."\n";
for ($i = 0; $i < $arrlength; $i++)
{
	$obj[1]->segments[$i][0] += 10;
	$obj[1]->segments[$i][1] += 10;
}

$obj[1]->strokeColor[0] = 0;	
$obj[1]->strokeColor[1] = 0;
$obj[1]->strokeColor[2] = 1;

foreach($obj[1]->strokeColor as $values) {
	
	echo $values." ";
}

$new = "hello";

array_push($obj,$new);
*/
//$text = addslashes($coordinates);
//echo "text: ".$text;
//$results = shell_exec("java -jar testJSONjar.jar ".$text);
$results = shell_exec("java -jar testJSONjar.jar ".$ratioDim[0]." ".$ratioDim[1]." ".addslashes($coordinates));


$json = $results;
//$json = json_encode($obj);

$fp = fopen('resultsPhp.json', 'w');
fwrite($fp, $json);
fclose($fp);

/*["Path",{"name":"currentPathObject",
"applyMatrix":true,
"segments":[[126,19],[123,17],[123,17],[119,15],[114,13],[104,9],[100,7],[94,6],[90,5],[85,5],[80,4],[76,3],[73,4],[69,3],[67,5],[64,5],[62,5],[59,6],[55,8],[49,9],[48,10],[42,13],[38,17],[33,21],[30,25],[28,33],[25,39],[21,46],[18,50],[17,56],[15,59],[12,64],[10,69],[9,75],[7,78],[6,86],[3,92],[2,99],[2,105],[3,111],[5,119],[6,127],[6,137],[8,142],[10,149],[13,152],[15,157],[19,163],[22,167],[23,167],[27,171],[34,174],[40,177],[47,178],[52,179],[57,179],[62,179],[69,177],[75,174],[83,172],[85,170],[95,166],[102,162],[113,157],[122,154],[128,149],[133,145],[137,142],[142,136],[143,132],[145,128],[148,123],[152,114],[154,107],[156,104],[160,95],[163,89],[165,81],[166,76],[167,71],[167,63],[168,60],[168,54],[169,49],[169,45],[169,44],[167,41],[166,39],[166,37],[167,36],[166,35],[166,29],[165,27],[164,26],[163,26],[162,25],[162,24],[161,24],[160,24],[159,24],[158,24],[157,23],[155,23],[154,21],[150,20],[148,19],[146,18],[143,16],[139,15],[137,16],[136,16],[136,15],[134,15],[133,15],[131,15],[129,14],[127,14],[126,14],[124,14],[123,13],[121,14],[120,14],[119,14],[118,15],[117,15],[114,15],[113,15],[112,15],[111,15],[110,16],[109,16],[108,16]],
"strokeColor":[1,0.75294,0.79608]}]



Then use foreach($obj->response->docs as $doc) to iterate over the "docs".

You can then access the fields using $doc->student_id and $doc->student_name[0].
*/
	
/*if ( !isset($_SESSION['cams']) )
	$_SESSION['cams'] = array($camNum);
else
	array_push($_SESSION['cams'],$camNum);
*/
//if ( !isset($_SESSION['dumbCount']) )
	$_SESSION['dumbCount'] = 0;
//else

$_SESSION['object']['cam']["$camName"] = $json;
//echo "sessionVar: ".$_SESSION['object']['cam']['cam1'];
echo $_SESSION['object']['cam']["$camName"];



$fp = fopen('sessionVar1.json', 'w');
fwrite($fp,$_SESSION['object']['cam']['cam1']);
fclose($fp);

?>


