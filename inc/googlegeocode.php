<?php
if (strlen(session_id()) < 1) {session_start();}
if (!isset($_SESSION['myusername'])) { return; }
include('config.php');
$address = json_encode($_GET['address']);
echo file_get_contents('https://maps.googleapis.com/maps/api/geocode/json?address='.$address.'&key='.$GoogleAPIKey);
?>
