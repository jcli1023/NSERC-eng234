<?php
session_start();
$max = $_SESSION['maxsize'];
$shmid = shmop_open(864, 'c', 0666, 50);
$content = shmop_read($shmid, 0, 50);
file_put_contents("testingMemoryConfirm.jpg", $content);

$fp2 = fopen("testing2.txt",'w');
fwrite($fp2,$max);
fclose($fp2);

//$fp2 = fopen("testingMemoryConfirm.jpg",'a');
//fwrite($fp2,$content);
//fclose($fp2);
?>
