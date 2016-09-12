<?php
	//echo "I entered PHP<br>";
	//data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4
	$data = $_POST['frame'];
	echo $data;
	list($type, $data) = explode(';', $data);
	list(, $data)      = explode(',', $data);
	$data = base64_decode($data);

	if (!file_exists("./photos"))	
		mkdir("./photos");
	file_put_contents( "./photos/".uniqid().'.jpg', $data);
	//file_put_contents( "./photos/".uniqid().'.png', $data);
	//echo "I fini PHP\n";
	
	die("Went through PHP");
?>
