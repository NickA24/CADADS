<?php
  if (strlen(session_id()) < 1) {session_start();}
  if (!isset($_SESSION['myusername'])) { return; }
  $address = urlencode($address);
  $url = "https://maps.googleapis.com/maps/api/geocode/json?address=".htmlentities($address);
  include('config.php');
  $Geocodeobj = json_decode(@file_get_contents($url.'&key='.$GoogleAPIKey),true);
?>
