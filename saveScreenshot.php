<?php

session_start();

$data = $_POST['frame'];
$camNum = $_POST['cam'];
$time = $_POST['time'];
$camName = "cam".$camNum;
$_SESSION['time']["$camName"] = $time;
$frameDim = $_POST['frameDim'];
$vidDim = $_POST['vidDim'];
$camFolder = "CAMERA-".$camNum;
$_SESSION['frameRatio']["$camName"][0] = $frameDim[0]/$vidDim[0];
$_SESSION['frameRatio']["$camName"][1] = $frameDim[1]/$vidDim[1];


 
echo "_SESSION: ".$_SESSION['frameRatio']["$camName"][0]."x".$_SESSION['frameRatio']["$camName"][0]." ";
list($type, $data) = explode(';', $data);
list(, $data)      = explode(',', $data);
//$start_memory = memory_get_usage();

$data = base64_decode($data);

//$max = memory_get_usage() - $start_memory;
//$max = sizeof($data);

$max = strlen($data);

$_SESSION['maxsize']= $max;

session_write_close();

require('Block.php');



/**
 * Creating new block, with a random ID
 */
$memory = new Block;
$memory->write('Sample');
echo $memory->read();

/**
 * Creating new block, with an specified ID
 */
$new = new Block(897);
$new->write('Sample');
echo $new->read();

/**
 * Reading an existing block, with the ID of 42
 */
$existing = new Block(42);
echo $existing->read();

$startTime = microtime(true);
if (!file_exists("./".$camFolder))	
	mkdir("./".$camFolder);
file_put_contents( "./".$camFolder."/".$time.'.jpg', $data);

$endTime = microtime(true);
$write_time = $endTime - $startTime;
file_put_contents("timings.txt","screenshotWrite: ".$write_time."\n",FILE_APPEND);

#$shm_key = ftok(__FILE__, 't');
#$shmid = shmop_open($shm_key, "c", 0644, strlen($data));

#//$shmid = shmop_open(1234, 'c', 0666, 50);

#shmop_write($shmid, "$data", 0);
#$content = shmop_read($shmid, 0, strlen($data));
#$size =  shmop_size ( $shmid );
#//shmop_close($shmid);

$fp2 = fopen("testing.txt",'w');
#fwrite($fp2,$size." ".$content);
fwrite($fp2,$memory->read()." ".$new->read()." ".$existing->read());
fclose($fp2);

#$fp2 = fopen("testingMemoryConfirm.txt",'a');
#fwrite($fp2,$content);
#fclose($fp2);




die("frameDim: ".$frameDim[0]."x".$frameDim[1]." vidDim: ".$vidDim[0]."x".$vidDim[1]." time: ".$time);
?>
