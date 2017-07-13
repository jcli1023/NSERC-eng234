<?php
$shmid = shmop_open(864, 'c', 0755, 1024);
$content = shmop_read($shmid, 0, 11);

$fp2 = fopen("testingMemoryConfirm.txt",'a');
fwrite($fp2,$content);
fclose($fp2);
?>
