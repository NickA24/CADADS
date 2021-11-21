<?php 
//Login function, which also does connect and config
include_once("./inc/login.php"); 

//If you're not logged in, or more specifically, if you're not an ambulance, return a blank page.
if (checklogin() != 2) { 
	http_response_code(401);
	$_SERVER['REDIRECT_STATUS'] = 401;
	header('Location: ./inc/error.php');
	return; 
}
//The ambulance homepage requires the map
$needmap = 1; 
//The page name is called ambulance, so let's make sure we grab ambulance-related css and js files in header.
$pagename="ambulance"; 
//Inittype is for one of our mapping functions.
$initType = 1; 
//Include the header and top navigation page
include_once("./inc/header.php"); 
?>

<div id="curCall"></div>
<div id="map"></div>
<?php msgBox(); ?>
<form id="statusSubmit" style="display:none; visibility:hidden;" method="POST" action="/inc/amboupdates.php">
	<input type="hidden" id="id" name="id" value="">
	<input type="hidden" id="loc" name="loc" value="">
	<input type="hidden" id="lat" name="lat" value="">
	<input type="hidden" id="lng" name="lng" value="">
	<input type="hidden" id="submitType" name="submitType" value="">
	<input type="hidden" id="status" name="status" value="">
	<input type="hidden" id="hospid" name="hospid" value="">
</form>
</body>
</html>
