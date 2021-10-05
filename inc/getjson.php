<?php
	
	//Calls connect.php to interface with the database.
	include_once("connect.php");
	if (!checklogin()) { return; }
	$sql = "SELECT * FROM incident_tbl ORDER BY id";
	$nojson = 0;
	//Create an SQL statement to be called based on any GET data passed to this page.
	if (!empty($_GET))
	{
		switch($_GET["tbl"])
		{
			case 'usr':
				$sql = "SELECT id, name, user_type FROM users ORDER BY id";
				break;
			case 'editTicket':
				$sql = "SELECT ticket.id, active, ticket.name, location, incident_type, priority, IF(ticket.ambulance>0,users.name,'None') AS ambulance, time, comments FROM ticket LEFT JOIN users ON users.id=ticket.ambulance WHERE ticket.id = :id";
				$params = array(":id"=>$_GET['id']);
				break;
			case 'tkt':
				$where = "WHERE active = 1 ";
				if (!empty($_GET["showinactive"]) && $_GET['showinactive'] == 1)
				{
					$where = '';
				}
				$sql = "SELECT ticket.id, active, ticket.name, location, incident_tbl.description AS incident_type, priority, IF(ticket.ambulance>0,users.name,'None') AS ambulance, time, comments FROM ticket LEFT JOIN incident_tbl ON ticket.incident_type = incident_tbl.id LEFT JOIN users ON users.id=ticket.ambulance ".$where."ORDER BY active, time";
				break;
			case 'amb':
				$sql = "SELECT users.id, users.name, status, location, lastupdate FROM users LEFT JOIN ambulance_info ON users.id = ambulance_info.id WHERE users.user_type = 2 ORDER BY status, lastupdate";
				break;
		}
	}
	
	/*This one line handles a lot:
		-Query the database with the SQL statement
		-convert the data to a FETCH_ASSOC format that is easy to use with JSON
		-encode it to JSON using the php function built in_array
		-"echo" it, which is a simple and unformatted way of printing data output_add_rewrite_var
	This is perfect for using an AJAX call in javascript to return a premade object ready to be iterated through. */
	echo  json_encode($db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC));
?>
