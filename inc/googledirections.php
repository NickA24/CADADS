<?php
	include_once('connect.php');
	if (strlen(session_id()) < 1) {session_start();}
	//This file is to return a direction object using the Google API. 
	//It will take two addresses and make a path between them. Wow.
	if (!isset($_SESSION['myusername']) || ($_SESSION['user_type'] != 2 && !isset($_GET['amboid']))) { return; }
	$amboid = $_SESSION['myid'];
	if (isset($_GET['amboid'])) { $amboid = $_GET['amboid']; }
	$params = array(":id"=>$amboid);
	$sql = "SELECT loclat, loclng, dstlat, dstlng FROM ambulance_info WHERE ambulance_info.id = :id";
	$latlng = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
	$latlng = $latlng[0];
	if (isset($_GET['o'])) 
	{
		$origin = urlencode($_GET['o']);
	} 
	else if ($latlng['loclat'] != 0 && $latlng['loclng'] != 0) 
	{
		$origin = urlencode($latlng['loclat'].",".$latlng['loclng']);
	} else { return; }
	if (isset($_GET['d'])) 
	{
		$destination = urlencode($_GET['d']); 
	} 
	else if ($latlng['dstlat'] != 0 && $latlng['dstlng'] != 0) {
		$destination = urlencode($latlng['dstlat'].",".$latlng['dstlng']); 
	} else { 
		$destination = $origin;
	}
	$url = "https://maps.googleapis.com/maps/api/directions/json?origin=".$origin."&destination=".$destination;
	include_once('config.php');
	$directions = @file_get_contents($url.'&key='.$GoogleAPIKey);
	//If for some reason we want/need to return it as a string for javascript, rather than as a PHP object, call this file with ?returntext=1
	if (isset($_GET['returntext'])) { echo $directions; return; }
	$directions = json_decode($directions,true);
	$_SESSION['location'] = $directions["routes"][0]["legs"][0]["start_address"];
	$var['id'] = $amboid;
	$var['directions'] = $directions["routes"][0]["overview_polyline"]["points"];
	$var['loc'] = $directions["routes"][0]["legs"][0]["start_address"];
	$var['lat'] = $directions["routes"][0]["legs"][0]["start_location"]["lat"];
	$var['lng'] = $directions["routes"][0]["legs"][0]["start_location"]["lng"];
	$var['distance'] = $directions["routes"][0]["legs"][0]["distance"]["text"];
	$var['duration'] = $directions["routes"][0]["legs"][0]["duration"]["text"];
	if ($origin == $destination)
	{
		$var['directions'] = NULL;
		$var['disatnce'] = NULL;
		$var['duration'] = NULL;
	}
	$params = array(":id"=>$var['id'], ":loc"=>$var['loc'], ":lat"=>$var['lat'], ":lng"=>$var['lng'], ":dir"=>$var['directions'], ":dis"=>$var['distance'], ":dur"=>$var['duration']);
	$sql = "UPDATE ambulance_info SET location = :loc, loclat=:lat, loclng=:lng, directions=:dir, distance=:dis, duration=:dur, lastupdate=NOW() WHERE id = :id";
	$result = $db->query($sql, $params);
	return;
?>
