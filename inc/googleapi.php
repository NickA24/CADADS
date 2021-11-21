<?php
include('config.php');
$filename = "apijs.cache";
$cache_life = '604800';
if (!file_exists($filename) or (time() - filemtime($filename) >= $cache_life))
{
	$q = file_get_contents('https://maps.googleapis.com/maps/api/js?key='.$GoogleAPIKey.'&callback=initMap&v=weekly');
	file_put_contents($filename, $q);
	echo $q;
} else {
	echo file_get_contents($filename);
}

?>
