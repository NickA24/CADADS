<?php
//This file is for storing specific API keys and other things we might not want to share publicly, but that we need on the server to function.

//PDOKey is for connecting to our local MySQL server. This isn't as critical of a password because it only functions as user root on the localhost
$PDOKey = "Your MySQL password here";

//GoogleAPIKey is for connecting to any google API.
$GoogleAPIKey = "Your API Key Here";

$DispatchCenter = array('lat'=>34.182175, 'lng'=>-117.318794); //The central location of your dispatch area. 
$DispatchMaxTime = 3600; //How far away an ambulance is allowed to go. In seconds. Default 3600 => 1 hour.
return;
?>
