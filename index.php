<?php 

//This will be our main page. Including test.php for testing and info purposes
include_once("./inc/login.php");
if (checklogin()){
	include('test.php');
} else {
	include('loginform.html');
}

?>
