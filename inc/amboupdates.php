<?php
include_once("login.php");
$usrtype = checklogin();

//Don't let non-logged in people see this page at all
if (!isset($usrtype) || $usrtype <= 0)
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
  $sql = "UPDATE ambulance_info SET status = 2, location = hospitals.location LEFT JOIN hospitals ON id = :hosp WHERE id = :id";
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
  $sql = "UPDATE ticket SET active = 0, cleared = NOW() WHERE id = :id";
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
  $params = array(":id"=>$var['id'], ":status"=>$var['status']);
  $sql = "UPDATE ambulance_info SET status = :status, lastupdate=NOW() WHERE id = :id";
  $result = $db->query($sql,$params);
  return $result;
}

//Update the ambulance's location
function amboUpdate($db,$var)
{
  if (!isset($var['id']) || !isset($var['loc']))
	{
		echo 'no valid id or location';
		return 'You need a valid id and location';
	}
  $params = array(":id"=>$var['id'], ":loc"=>$var['loc']);
  $sql = "UPDATE ambulance_info SET location = :loc, lastupdate=NOW() WHERE id = :id";
  $result = $db->query($sql, $params);
  return $result;
}

//This is the actual code in this module. If data is properly posted from a form, and a user with the proper credentials is requesting, they will be allowed to spoof an ambulance
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
	//After the code above has been handled, return the person to the previous page. This way they never hang out on a blank white page.
	if(isset($_REQUEST["destination"])){
		header("Location: {$_REQUEST['destination']}");
	} else if(isset($_SERVER["HTTP_REFERER"])){
		header("Location: {$_SERVER['HTTP_REFERER']}");
	}else{
		/* some fallback, maybe redirect to index.php */
	}
} else {
	//For debugging purposes. Something went wrong, and I don't know if it's the post data or the user's credentials.
	//var_dump($_POST);
	//var_dump($usrtype);
	return;
}
?>

?>
