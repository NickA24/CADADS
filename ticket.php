<?php 
//Login function, which also does connect and config
include_once("./inc/login.php"); 

//If you're not logged in, or more specifically, if you're not an ambulance, return a blank page.
if (!checklogin()) { 
	http_response_code(401);
	$_SERVER['REDIRECT_STATUS'] = 401;
	header('Location: ./inc/error.php');
	return; 
}

//The page name is called ticket, so let's make sure we grab ticket-related css and js files in header.
$pagename="ticket"; 
//Include the header and top navigation page

if (!isset($_GET['id'])) {
	header('Location: ../index.php');
	return;
}
include_once("./inc/header.php"); 
$where = "WHERE ticket.id = :id ";
$params = array(":id" => $_GET['id']);
$sql = "SELECT ticket.id, IF(active=1, 'Yes', 'No') AS active, ticket.name, location, lat, lng, incident_tbl.description AS incident_type, IF(priority=1, '1 - High/Emergency', IF(priority=2, '2 - Medium/Urgent', '3 - Low/Routine')) AS priority, IF(ticket.ambulance>0,a.name,'None') AS ambulance, IF(ticket.dispatcher>0,b.name,'None') AS dispatcher, time, comments FROM ticket LEFT JOIN incident_tbl ON ticket.incident_type = incident_tbl.id LEFT JOIN users a ON a.id=ticket.ambulance LEFT JOIN users b ON b.id=ticket.dispatcher ".$where." LIMIT 1";
$return = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
$return = $return[0];
?>
<h1>Ticket Information <a href="..">Return</a></h1>
<table>
<tbody>
<?php 
foreach($return as $key => $value) {
	echo '<tr><td>', $key, ':</td><td>', $value, '</td></tr>';
}
?>
</tbody>
</table>
</body>
</html>
