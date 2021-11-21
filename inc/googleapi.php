<?php
include('config.php');
echo file_get_contents('https://maps.googleapis.com/maps/api/js?key='.$GoogleAPIKey.'&callback=initMap&v=weekly');
return;
?>
