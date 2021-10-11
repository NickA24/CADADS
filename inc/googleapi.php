<?php
include('config.php');
$ret = file_get_contents('https://maps.googleapis.com/maps/api/js?key='.$GoogleAPIKey.'&callback=initMap&v=weekly');
var_dump($ret);
?>
