<?php
	echo "I entered PHP<br>";
	$data = $_POST['photo'];
	list($type, $data) = explode(';', $data);
	list(, $data)      = explode(',', $data);
	$data = base64_decode($data);

	mkdir("./photos");
	file_put_contents( "./photos/".uniqid().'.jpg', $data);
	//file_put_contents( "./photos/".uniqid().'.png', $data);
	echo "I fini PHP\n";
	die("Went through PHP");
?>
