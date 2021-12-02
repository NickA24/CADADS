<?php
	include_once('connect.php');
	if (strlen(session_id()) < 1) {session_start();}
	//This file is to return a direction object using the Google API. 
	//It will take two addresses and make a path between them. Wow.
	if (!isset($_SESSION['myusername']) || $_SESSION['user_type'] <= 0 || $_SESSION['user_type'] >= 3) { return; }
	$params = array(":id"=>$_SESSION['myid']);
	if ($_SESSION['user_type'] == 2)
	{
		$sql = "SELECT loclat, loclng, dstlat, dstlng FROM ambulance_info WHERE ambulance_info.id = :id";
		$latlng = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
		$latlng = $latlng[0];
	}
	if (isset($_GET['o'])) 
	{
		$origin = urlencode($_GET['o']);
	} 
	else
	{
		$origin = urlencode($latlng['loclat'].",".$latlng['loclng']);
	}
	if (isset($_GET['d'])) 
	{
		$destination = urlencode($_GET['d']); 
	} 
	else
	{
		$destination = urlencode($latlng['dstlat'].",".$latlng['dstlng']); 
	}
	
	$url = "https://maps.googleapis.com/maps/api/directions/json?origin=".$origin."&destination=".$destination;
	include_once('config.php');
	$directions = @file_get_contents($url.'&key='.$GoogleAPIKey);
	//If for some reason we want/need to return it as a string for javascript, rather than as a PHP object, call this file with ?returntext=1
	if (isset($_GET['returntext'])) { return; }
	$directions = json_decode($directions,true);
	$_SESSION['location'] = $directions["routes"][0]["legs"][0]["start_address"];
	$var['id'] = $_SESSION['myid'];
	$var['directions'] = $directions["routes"][0]["overview_polyline"]["points"];
	$var['loc'] = $directions["routes"][0]["legs"][0]["start_address"];
	$var['lat'] = $directions["routes"][0]["legs"][0]["start_location"]["lat"];
	$var['lng'] = $directions["routes"][0]["legs"][0]["start_location"]["lng"];
	$var['distance'] = $directions["routes"][0]["legs"][0]["distance"]["text"];
	$var['duration'] = $directions["routes"][0]["legs"][0]["duration"]["text"];
	$params = array(":id"=>$var['id'], ":loc"=>$var['loc'], ":lat"=>$var['lat'], ":lng"=>$var['lng'], ":dir"=>$var['directions'], ":dis"=>$var['distance'], ":dur"=>$var['duration']);
	$sql = "UPDATE ambulance_info SET location = :loc, loclat=:lat, loclng=:lng, directions=:dir, distance=:dis, duration=:dur, lastupdate=NOW() WHERE id = :id";
	$result = $db->query($sql, $params);
	return;
?>
