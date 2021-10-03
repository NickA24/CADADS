<?php 
//This is an edit to test auto pulling
//This will be our main page. Including test.php for testing and info purposes
include_once("./inc/login.php");
$usrcheck = checklogin();
if ($usrcheck){
	switch($usrcheck) {
		case 1:
			include('dispatch.php');
			break;
		case 2:
			include('ambulance.php');
			break;
		case 3:
			include('test.php');
			break;
	}
} else {
	include('loginform.html');
}

?>
