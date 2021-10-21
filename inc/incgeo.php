<?php
  //This file is to return a Geocode object using the Google API. 
  //It will take an improperly formatted address and convert it to a properly formatted human readable address, latitude, and longitude, among other features.
  if (strlen(session_id()) < 1) {session_start();}
  if (!isset($_SESSION['myusername'])) { return; }
  $address = urlencode($address);
  $url = "https://maps.googleapis.com/maps/api/geocode/json?address=".htmlentities($address);
  include('config.php');
  $Geocodeobj = json_decode(@file_get_contents($url.'&key='.$GoogleAPIKey),true);
?>
