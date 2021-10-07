<?php 
//This is my last edit to test auto pulling. i hope.
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
			include('admin.php');
			break;
	}
} else {
	include('loginform.html');
}

?>
