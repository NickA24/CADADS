<?php
include('config.php');
if (!isset($_SESSION['myusername'])) { return; }
$address = $_GET['address'];
echo file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?address='.$address.'&key='.$GoogleAPIKey);
?>
