<?php
  //This file is to return a Geocode object using the Google API. 
  //It will take an improperly formatted address and convert it to a properly formatted human readable address, latitude, and longitude, among other features.
  if (strlen(session_id()) < 1) {session_start();}
  if (!isset($_SESSION['myusername'])) { return; }
  $address = urlencode($address);
  $url = "https://maps.googleapis.com/maps/api/geocode/json?address=".htmlentities($address);
  include('config.php');
  $Geocodeobj = @file_get_contents($url.'&key='.$GoogleAPIKey);
  //If for some reason we want/need to return it as a string for javascript, rather than as a PHP object, call this file with ?returntext=1
  if (isset($_GET['returntext'])) { echo $Geocodeobj; return; }
  $Geocodeobj = json_decode($Geocodeobj,true);
  return;
?>
