<?php
	include_once("login.php");
	if (!checklogin()) { return; }
	//This file is to return a Geocode object using the Google API. 
	//It will take lat and lng and turn it into a human-readable address.
	include('config.php');
	if (isset($_GET['lat']) && isset($_GET['lng'])) {
		$params = array(":id"=>$_GET['id'], ":lat"=>$_GET['lat'], ":lng"=>$_GET['lng']);
		$sql = "SELECT location FROM ambulance_info WHERE id = :id AND loclat = :lat AND loclng = :lng LIMIT 1";
		$return = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
		if (isset($return['location'])) { echo '{"address":"'.$return['location'].'"}'; return; }
		$url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=".$_GET['lat'].",".$_GET['lng'];

		$Geocodeobj = @file_get_contents($url.'&key='.$GoogleAPIKey);
		//If for some reason we want/need to return it as a string for javascript, rather than as a PHP object, call this file with ?returntext=1
		if (isset($_GET['returntext'])) { echo '{"address":"'.json_decode($Geocodeobj, true)['results'][0]['formatted_address'].'"}'; return; }
		$Geocodeobj = json_decode($Geocodeobj,true);
	} else {
		echo "Not valid lat and lng";
	}
	return;
?>
