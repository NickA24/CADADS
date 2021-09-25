<?php
// connect.php will handle the database connection from the server. It should be connected to every page, whether it's via the header or on its own.
// include_once will ensure that if multiple php files try to load that module, it will be rejected after the first load.
include_once("connect.php");

//This is just showing that you can use php code to start an if statement, then end it and write pure html and it will be considered part of the if block.
//This is how we can display different info based on the person's login credentials and user type.
if (1) {?>
<!DOCTYPE html>
<html>
<head>
	<title>Welcome to the Diamond Team CAD</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" href="/css/style.css" />
	<script type="text/javascript" src="/js/dummy.js"></script>
</head>
<?php } ?>
