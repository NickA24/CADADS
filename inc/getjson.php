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
				//This returns user data; If usrid is set, it returns one specific user, otherwise it returns everyone 
				$uid = '';
				$lim = '';
				if (isset($_GET['usrid']))
				{
					$uid = "WHERE id = :id ";
					$lim = " LIMIT 1";
					$params = array(":id"=>$_GET['usrid']);
				} else {
					$uid = "WHERE id != :id ";
					$params = array(":id"=>$_SESSION['myid']);
				}
				$sql = "SELECT id, name, '' AS pass, user_type FROM users ".$uid."ORDER BY id".$lim;
				break;
			case 'admintkt':
				$where = '';
				if (count($_GET) > 1) {
					$where = 'WHERE ';
					$params = array();
					if (isset($_GET['activetype']))
					{
						switch($_GET['activetype'])
						{
							case 0:
								//Get only inactive
								$where .= 'active = 0 AND ';
							case 1:
								//Get both active and inactive
								//That means don't search for active at all
								break;
							case 0:
							default:
								//Only get active
								$where .= 'active = 1 AND ';
						}
					} else {
						$where .= 'active = 1 AND ';	
					}
					if (isset($_GET['incident_type']))
					{
						$params[":it"]=$_GET['incident_type'];
						$where .= 'incident_type = :it AND ';
					}
					if (isset($_GET['priority']))
					{
						$params[':p']=$_GET['priority'];
						$where .= 'priority = :p AND ';
					}
					if (isset($_GET['ambulance']))
					{
						$params[':ambo']=$_GET['ambulance']; 
						$where .= 'ambulance = :ambo AND ';
					}
					if (isset($_GET['dispatcher']))
					{
						$params[":disp"]=$_GET['dispatcher'];
						$where .= 'dispatcher = :disp AND ';
					}
					if (isset($_GET['dateCreated']))
					{
						$createarray = explode(" to ", $_GET['dateCreated']);
						if ($createarray[1] == '') { $createarray[1] = "now()"; }
						$params[":dCreateA"]=$createarray[0]; 
						$params[":dCreateB"]=$createarray[1]; 
						$where .= 'time BETWEEN date(:dCreateA) AND date(:dCreateB) AND ';
					}
					if (isset($_GET['dateCompleted']))
					{
						$completearray = explode(" to ", $_GET['dateCompleted']);
						if ($completearray[1] == '') { $completearray[1] = "now()"; }
						$params[":dCompleteA"]=$completearray[0]; 
						$params[":dCompleteB"]=$completearray[1];
						$where .= 'cleared IS NOT NULL AND cleared BETWEEN date(:dCompleteA) AND date(:dCompleteB) AND ';
					}
					if (isset($_GET['timeCreated']))
					{
						$params[":tCreate"]=$_GET['timeCreated'];
						if ($_GET['timeCreatedRange'] > 0) {
							$params[":tCreateRange"]=$_GET['timeCreatedRange']; 
							$where .= 'time(time) BETWEEN time(:tCreate) AND time(:tCreateRange) AND';
						} else {
							$where .= 'time(time) = time(:tCreate) AND ';
						}
					}
					if (isset($_GET['timeCompleted']))
					{
						$params[":tComplete"]=$_GET['timeCompleted']; 
						if ($_GET['timeCompletedRange'] > 0) {
							$params[":tCompleteRange"]=$_GET['timeCompletedRange'];
							$where .= 'time(cleared) BETWEEN time(:tComplete) AND time(:tCompleteRange) AND';
						} else {
							$where .= 'time(cleared) = time(:tComplete) AND ';
						}
					}
					if (isset($_GET['TtCStart']) && isset($_GET['TtCEnd']))
					{
						if ($_GET['TtCEnd'] > 60) {
							$where .= 'TIMESTAMPDIFF(MINUTE,time,cleared) > 60 AND ';
						} else {
							$params[":tcStart"]=$_GET['TtCStart']; 
							$params[":tcEnd"]=$_GET['TtCEnd'];
							$where .= 'TIMESTAMPDIFF(MINUTE, time, cleared) BETWEEN :tcStart AND :tcEnd AND ';
						}
					}
					if (strlen($where) > 0)
					{
						$where = substr($where, 0, -4);
					}
				}
				$sql = "SELECT ticket.id, active, ticket.name, location, lat, lng, incident_tbl.ack AS incident_type, incident_tbl.description AS incident_description, priority, IF(priority=1, 'High', IF(priority=2, 'Med', 'Low')) AS priorityText, IF(ticket.ambulance>0,a.name,'None') AS ambulance, ticket.ambulance AS ambo_id, IF(ticket.dispatcher>0,b.name,'None') AS dispatcher, time, comments FROM ticket LEFT JOIN incident_tbl ON ticket.incident_type = incident_tbl.id LEFT JOIN users a ON a.id=ticket.ambulance LEFT JOIN users b ON b.id=ticket.dispatcher ".$where." ORDER BY active DESC, ambo_id ASC, time ASC";
				break;
			case 'editTicket':
				//This is used in dispatch.php to get the data for a specific ticket and edit it. if returnAmbo is set, it also returns specific info about the ambulance assigned.
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
				//This returns all active tickets in the system. if showinactive is 1, it will return ALL TICKETS, both active and cleared.
				$sql = "SELECT ticket.id, active, ticket.name, location, lat, lng, incident_tbl.ack AS incident_type, incident_tbl.description AS incident_description, priority, IF(priority=1, 'High', IF(priority=2, 'Med', 'Low')) AS priorityText, IF(ticket.ambulance>0,a.name,'None') AS ambulance, ticket.ambulance AS ambo_id, IF(ticket.dispatcher>0,b.name,'None') AS dispatcher, time, comments FROM ticket LEFT JOIN incident_tbl ON ticket.incident_type = incident_tbl.id LEFT JOIN users a ON a.id=ticket.ambulance LEFT JOIN users b ON b.id=ticket.dispatcher WHERE active = 1 ORDER BY active DESC, ambo_id ASC, time ASC";
				$returna = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
				$sql = "SELECT users.id AS id, users.name AS name, 1 as markertype, status, location, loclat, loclng, destination, dstlat, dstlng, 1 as source, current_ticket as isFree, directions, distance, duration, lastupdate FROM ambulance_info LEFT JOIN users ON users.id=ambulance_info.id UNION SELECT t.id, t.name, 0 as markertype, incident_tbl.description AS status, IF(enroute_to_hospital>0, h.location, t.location) AS location, IF(enroute_to_hospital>0, h.lat, t.lat) as loclat, IF(enroute_to_hospital>0, h.lng, t.lng) as loclng, NULL as destination, NULL as dstlat, NULL as dstlng, 0 as source, ambulance as isFree, null as directions, null as distance, null as duration, time as lastupdate FROM ticket t LEFT JOIN incident_tbl ON incident_tbl.id=t.incident_type LEFT JOIN hospitals h ON enroute_to_hospital = h.id WHERE active = 1";
				$returnb = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
				$returnfull = array("tickets"=>$returna, "dispatchMap"=>$returnb);
				echo json_encode($returnfull);
				return;
				break;
			case 'amb':
				//This returns all ambulance information for every ambulance, ordered by their status and the last time they updated.
				$sql = "SELECT users.id, users.name, status, location, loclat, loclng, destination, dstlat, dstlng, lastupdate FROM users LEFT JOIN ambulance_info ON users.id = ambulance_info.id WHERE users.user_type = 2 ORDER BY status, lastupdate";
				break;
			case 'hosp':
				//This returns all the hospital data.
				$sql = "SELECT * FROM hospitals";
				if (!empty($_GET['hospid']))
				{
					$params = array(":id"=>$_GET['hospid']);
					$sql .= " WHERE id = :id LIMIT 1";
				}
				break;
			case 'curAmbo':
				//This returns all ambulance data about the currently logged in ambulance. Only self-data.
				if ($_SESSION['user_type'] != 2) { echo 'NOT AN AMBULANCE GET OUTTA HERE'; return; }
				$params = array(":id"=>$_SESSION['myid']);
				$sql = "SELECT loclat, loclng, status, current_ticket, directions FROM ambulance_info WHERE id = :id";
				$info = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC)[0];
				if (isset($_GET['lat']) && isset($_GET['lng']) && (round($_GET['lat'],3) != round($info['loclat'],3) || round($_GET['lng'],3) != round($info['loclng'],3)))
				{
					$_GET['o'] = $_GET['lat'].",".$_GET['lng'];
					include('googledirections.php');
				} 
				else if ($info['status'] == 2 && $info['current_ticket'] > 0 && ($info['directions'] == '' || $info['directions'] == NULL))
				{
					include('googledirections.php');
				}
				$time = 0;
				//if (isset($_GET['lastupdate'])) { $time = strtotime($_GET['lastupdate']); }
				$params = array(":id"=>$_SESSION['myid'], ":time"=>$time);
				$sql = "SELECT ambulance_info.id as id, ambulance_status.name as status, ambulance_info.location as location, loclat, loclng, ambulance_info.destination as destination, dstlat, dstlng, active, ticket.name, ticket.id as ticket_id, incident_tbl.ack AS incident_type, incident_tbl.description AS incident_description, priority, IF(priority=1, 'High', IF(priority=2, 'Med', 'Low')) AS priorityText, IF(ticket.dispatcher>0,b.name,'None') AS dispatcher, time, lastupdate, comments FROM ambulance_info LEFT JOIN ticket ON ambulance_info.current_ticket = ticket.id LEFT JOIN incident_tbl ON incident_type = incident_tbl.id LEFT JOIN ambulance_status ON status = ambulance_status.id LEFT JOIN users b ON b.id=ticket.dispatcher WHERE ambulance_info.id = :id AND UNIX_TIMESTAMP(lastupdate) > :time LIMIT 1";
				$returna = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
				$params = array(":id"=>$_SESSION['myid'], ":tid"=>$_SESSION['myid']);
				$sql = "SELECT users.id AS id, users.name AS name, 1 as markertype, status, location, loclat, loclng, destination, dstlat, dstlng, 1 as source, current_ticket as isFree, directions, distance, duration, lastupdate FROM ambulance_info LEFT JOIN users ON users.id=ambulance_info.id WHERE users.id = :id UNION SELECT t.id, t.name, 0 as markertype, incident_tbl.description AS status, IF(enroute_to_hospital>0, h.location, t.location) AS location, IF(enroute_to_hospital>0, h.lat, t.lat) as loclat, IF(enroute_to_hospital>0, h.lng, t.lng) as loclng, NULL as destination, NULL as dstlat, NULL as dstlng, 0 as source, ambulance as isFree, null as directions, null as distance, null as duration, time as lastupdate FROM ticket t LEFT JOIN incident_tbl ON incident_tbl.id=t.incident_type LEFT JOIN hospitals h ON enroute_to_hospital = h.id WHERE Active = 1  AND ambulance = :tid";
				$returnb = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
				$returnfull = array("curAmbo"=>$returna, "dispatchMap"=>$returnb);
				echo  json_encode($returnfull);
				return;
				break;
			case 'dispatchMap':
				//This returns all ambulance and ticket data to be used as data on the maps.
				$uid = " WHERE status > 0 ";
				$tid = "";
				if (isset($_GET['id'])) {
					$params = array(":id"=>$_GET['id'], ":tid"=>$_GET['id']);
					$uid = " WHERE users.id = :id ";
					$tid = " AND ambulance = :tid ";
				}
				$sql = "SELECT users.id AS id, users.name AS name, 1 as markertype, status, location, loclat, loclng, destination, dstlat, dstlng, 1 as source, current_ticket as isFree, directions, distance, duration, lastupdate FROM ambulance_info LEFT JOIN users ON users.id=ambulance_info.id ".$uid." UNION SELECT t.id, t.name, 0 as markertype, incident_tbl.description AS status, IF(enroute_to_hospital>0, h.location, t.location) AS location, IF(enroute_to_hospital>0, h.lat, t.lat) as loclat, IF(enroute_to_hospital>0, h.lng, t.lng) as loclng, NULL as destination, NULL as dstlat, NULL as dstlng, 0 as source, ambulance as isFree, null as directions, null as distance, null as duration, time as lastupdate FROM ticket t LEFT JOIN incident_tbl ON incident_tbl.id=t.incident_type LEFT JOIN hospitals h ON enroute_to_hospital = h.id WHERE Active = 1 ".$tid;
				break;
			case 'closest':
				//This returns the closest 3 ambulances to a specific ticket id.
				if (!isset($_GET['ticketid'])) {
				echo "[{'id':'No ticket id'}]";
				return;
				}
				$params = array(":id"=>$_GET['ticketid'], ":idtwo"=>$_GET['ticketid']);
        			$sql = "SELECT 	a.id, 
		c.name, 
        a.status, 
        b.id as current_ticket, 
        a.location, 
        a.loclat, 
        a.loclng, 
        b.location as destination, 
        1 as markertype, 
        ABS(ABS(a.loclat-b.lat)+ABS(a.loclng-b.lng)) as distance 
        FROM ambulance_info a, ticket b, users c WHERE a.id = c.id and b.id = :id and a.status = 1 
UNION SELECT 
        ticket.id, 
        name, 
        incident_tbl.description as status,
        0 as current_ticket,
		location,
        lat as loclat,
        lng as loclng, 
        NULL as destination,
        0 as markertype, 
        0 as distance FROM ticket LEFT JOIN incident_tbl ON incident_tbl.id=ticket.incident_type WHERE ticket.id = :idtwo ORDER BY distance ASC LIMIT 4;";
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
