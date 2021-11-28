<?php
include_once("login.php");
$usrtype = checklogin();

//Don't let non-logged in people see this page at all
if (!isset($usrtype) || $usrtype != 2)
{
	echo "not logged in";
	return;
}


//A function to add tickets directly to the database.
function enrouteToHospital($db,$var)
{
	if (!isset($var['id']) || !isset($var['hospid']))
	{
		echo 'no valid id or hospital id';
		return 'You need a valid id and hospital id';
	}
	$params = array(":id"=>$var['id'], ":hosp"=>$var['hospid']);
	$sql = "UPDATE ticket SET enroute_to_hospital = :hosp WHERE id = :id";
	$result = $db->query($sql, $params);
	$params = array(":id"=>$_SESSION['myid'], ":hosp"=>$var['hospid']);
	$sql = "UPDATE ambulance_info a, hospitals b SET a.status = 2, a.destination = b.location, a.dstlat = b.lat, a.dstlng = b.lng, a.directions=''  WHERE a.id = :id AND b.id = :hosp";
	$result = $db->query($sql, $params);
	return $result;
}

 //Patient has been picked up and dropped at a hospital, or completed on-site. 
function completeTicket($db,$var)
{
  if (!isset($var['id']))
	{
		echo 'no valid id';
		return 'You need a valid id';
	}
  $params = array(":id"=>$var['id']);
  $sql = "UPDATE ticket SET active = 0, cleared = NOW() WHERE active = 1 AND id = :id";
  $result = $db->query($sql,$params);
  return $result;
}

//Updates ambulance's status. 0=Out of Service, 1=Available, 2=Enroute, 3=Unavailable
function amboStatus($db,$var)
{
	if (!isset($var['id']) || !isset($var['status']))
	{
		echo 'no valid id or status';
		return 'You need a valid id and status';
	}
	$params = array(":id"=>$_SESSION['myid'], ":status"=>$var['status']);
	$ct = "current_ticket = 0, directions = '', distance='', duration='', ";
	if ($var['status'] == 2) {
		$ct = '';
	}
	$sql = "UPDATE ambulance_info SET status = :status, ".$ct."lastupdate=NOW() WHERE id = :id";
	$result = $db->query($sql,$params);
	if ($var['status'] != 2) {
		completeTicket($db, $var);
	} else {
		$params = array(":id"=>$var['id']);
		$sql = "UPDATE ticket SET enroute_to_hospital = 0 WHERE id = :id";
		$result = $db->query($sql, $params);
	}
	return $result;
}

//Update the ambulance's location
function amboUpdate($db,$var)
{
  if (!isset($var['id']) || !isset($var['loc']) || !isset($var['lat']) || !isset($var['lng']))
	{
		echo 'no valid id or location';
		return 'You need a valid id and location';
	}
  $params = array(":id"=>$var['id'], ":loc"=>$var['loc'], ":lat"=>$var['lat'], ":lng"=>$var['lng'], ":dir"=>$var['directions'], ":dis"=>$var['distance'], ":dur"=>$var['duration']);
  $sql = "UPDATE ambulance_info SET location = :loc, loclat=:lat, loclng=:lng, directions=:dir, distance=:dis, duration=:dur, lastupdate=NOW() WHERE id = :id";
  $result = $db->query($sql, $params);
  return $result;
}

//This is the actual code in this module. If data is properly posted from a form, and a user with the proper credentials is requesting, they will be allowed to update ambulance data.
$msg = '';
if (isset($usrtype) && $usrtype == 2 and isset($_POST))
{
	//Simple switch based on the submit type.
	switch($_POST['submitType'])
	{
		case 'en2Hosp':
			enrouteToHospital($db,$_POST); 
			break;
		case 'tktDone':
			completeTicket($db,$_POST);
			break;
		case 'ambostat':
			amboStatus($db,$_POST);
			break;
		case 'amboup':
			amboUpdate($db,$_POST);
			break;
	}
	$msg = "Completed updating";
	updateSessionData($db);
	if (!isset($_POST['returnMessage']) || $_POST['returnMessage'] != 1) { header("Location: ../"); }
} else {
	//For debugging purposes. Something went wrong, and I don't know if it's the post data or the user's credentials.
	//var_dump($_POST);
	//var_dump($usrtype);
	$msg = 'No information submitted';
}
return $msg;
?>