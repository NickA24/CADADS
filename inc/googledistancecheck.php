<?php
	include_once('connect.php');
	if (strlen(session_id()) < 1) {session_start();}
	//This file is to return a direction object using the Google API. 
	//It will take two addresses and make a path between them. Wow.
	if (!isset($_SESSION['myusername']) || $_SESSION['user_type'] <= 0 || $_SESSION['user_type'] >= 3) { return; }
	$params = array(":id"=>$_SESSION['myid']);

	if (isset($_GET['o'])) {$origin = urlencode($_GET['o']);} else { return; }
	if (isset($_GET['d'])) {$destination = urlencode($_GET['d']); } else { return; }

	$url = "https://maps.googleapis.com/maps/api/directions/json?origin=".$origin."&destination=".$destination;
	include_once('config.php');
	$directions = @file_get_contents($url.'&key='.$GoogleAPIKey);
	$directions = json_decode($directions,true);
	return;
?>
