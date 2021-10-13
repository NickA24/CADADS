<?php
	
	//Calls connect.php to interface with the database.
	include_once("login.php");
	if (!checklogin()) { return; }
	$sql = "SELECT * FROM incident_tbl ORDER BY id";
	$nojson = 0;
	//Create an SQL statement to be called based on any GET data passed to this page.
	if (!empty($_GET))
	{
		switch($_GET["tbl"])
		{
			case 'usr':
				$uid = '';
				$lim = '';
				if ($_GET['usrid'])
				{
					$uid = "WHERE id = :id ";
					$lim = " LIMIT 1";
					$params = array(":id"=>$_GET['usrid']);
				}
				$sql = "SELECT id, name, '' AS pass, user_type FROM users ".$uid."ORDER BY id".$lim;
				break;
			case 'editTicket':
				if ($_GET['returnAmbo'] == "1")
				{
					$sql = "SELECT ambulance_info.id, users.name, IF(current_ticket=:cid,1,0) as assigned FROM `ambulance_info` LEFT JOIN users ON ambulance_info.id=users.id WHERE current_ticket=:id OR (current_ticket=0 AND status=1) ORDER BY FIELD(current_ticket, :2id, 0)";
					$params = array(":cid"=>$_GET['id'],":id"=>$_GET['id'], ":2id"=>$_GET['id']);
					$ambulances = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
				}
				$sql = "SELECT ticket.id, active, ticket.name, location, incident_type, priority, ambulance, time, comments FROM ticket LEFT JOIN users ON users.id=ticket.ambulance WHERE ticket.id = :id LIMIT 1";
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
			case 'curAmbo':
				$params = array(":id"=>$_SESSION['myid']);
				$sql = "SELECT ambulance_info.id as id, ambulance_status.name as status, ambulance_info.location as ambulance_location, active, ticket.name, ticket.location as ticket_location, CONCAT(CONCAT(ack, ' - '), description) as incident_type, priority, time, comments FROM ambulance_info LEFT JOIN ticket ON ambulance_info.current_ticket = ticket.id LEFT JOIN incident_tbl ON incident_type = incident_tbl.id LEFT JOIN ambulance_status ON status = ambulance_status.id WHERE ambulance_info.id = :id LIMIT 1";
				break;
		}
	}
	
	/*This one line handles a lot:
		-Query the database with the SQL statement
		-convert the data to a FETCH_ASSOC format that is easy to use with JSON
		-encode it to JSON using the php function built in_array
		-"echo" it, which is a simple and unformatted way of printing data output_add_rewrite_var
	This is perfect for using an AJAX call in javascript to return a premade object ready to be iterated through. */
	$return = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
	if ($ambulances){ $return[0]['ambulance'] = $ambulances;}
	echo  json_encode($return);
?>
