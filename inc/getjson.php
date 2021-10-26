<?php
	
	//Calls connect.php to interface with the database.
	include_once("login.php");
	if (!checklogin()) { return; }
	$sql = "SELECT * FROM incident_tbl ORDER BY id";
	$params = array();
	$ambulances = false;
	$nojson = 0;
	//Create an SQL statement to be called based on any GET data passed to this page.
	if (!empty($_GET))
	{
		switch($_GET["tbl"])
		{
			case 'usr':
				$uid = '';
				$lim = '';
				if (isset($_GET['usrid']))
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
				$sql = "SELECT ticket.id, active, ticket.name, location, lat, lng, incident_tbl.description AS incident_type, priority, IF(ticket.ambulance>0,users.name,'None') AS ambulance, time, comments FROM ticket LEFT JOIN incident_tbl ON ticket.incident_type = incident_tbl.id LEFT JOIN users ON users.id=ticket.ambulance ".$where."ORDER BY active, time";
				break;
			case 'amb':
				$sql = "SELECT users.id, users.name, status, location, loclat, loclng, destination, dstlat, dstlng, lastupdate FROM users LEFT JOIN ambulance_info ON users.id = ambulance_info.id WHERE users.user_type = 2 ORDER BY status, lastupdate";
				break;
			case 'hosp':
				$sql = "SELECT * FROM hospitals";
				if (!empty($_GET['hospid']))
				{
					$params = array(":id"=>$_GET['hospid']);
					$sql .= " WHERE id = :id LIMIT 1";
				}
				break;
			case 'curAmbo':
				$time = 0;
				if (isset($_GET['lastupdate'])) { $time = $_GET['lastupdate']; }
				$params = array(":id"=>$_SESSION['myid'], ":time"=>$time);
				$sql = "SELECT ambulance_info.id as id, ambulance_status.name as status, ambulance_info.location as ambulance_location, loclat, loclng, ambulance_info.destination as destination, dstlat, dstlng, active, ticket.name, CONCAT(CONCAT(ack, ' - '), description) as incident_type, priority, time, lastupdate, comments FROM ambulance_info LEFT JOIN ticket ON ambulance_info.current_ticket = ticket.id LEFT JOIN incident_tbl ON incident_type = incident_tbl.id LEFT JOIN ambulance_status ON status = ambulance_status.id WHERE ambulance_info.id = :id AND UNIX_TIMESTAMP(lastupdate) > :time LIMIT 1";
				break;
			case 'dispatchMap':
				$sql = "SELECT users.id AS id, users.name AS name, status, location, loclat, loclng, destination, dstlat, dstlng, 1 as source, current_ticket as isFree, 'ambulance' as type FROM ambulance_info LEFT JOIN users ON users.id=ambulance_info.id WHERE status > 0 UNION SELECT ticket.id, name, incident_tbl.description AS status, location, lat as loclat, lng as loclng, NULL as destination, NULL as dstlat, NULL as dstlng, 0 as source, ambulance as isFree, 'ticket' as type FROM ticket LEFT JOIN incident_tbl ON incident_tbl.id=ticket.incident_type WHERE Active = 1";
				break;
			case 'closest':
				$params = array(":id"=>$_GET['ticketid']);
        			$sql = "SELECT a.id, c.name, a.status, b.id as current_ticket, a.location, a.loclat, a.loclng, b.location as destination, b.lat as dstlat, b.lng as dstlng, ABS(ABS(a.loclat-b.lat)+ABS(a.loclng-b.lng)) as distance FROM ambulance_info a, ticket b, users c WHERE a.id = c.id and b.id = :id and a.status = 1 ORDER BY distance ASC LIMIT 3";
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
	if (!empty($return)) {
		echo  json_encode($return);
	}
?>
