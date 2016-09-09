<?php
	echo "I entered PHP";
	$data = $_POST['photo'];
	list($type, $data) = explode(';', $data);
	list(, $data)      = explode(',', $data);
	$data = base64_decode($data);

	mkdir("./photos");
	file_put_contents( "./photos/".time().'.jpg', $data);
	echo "I fini PHP";
	die("Went through PHP");
?>
