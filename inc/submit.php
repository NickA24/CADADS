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
function addTicket($db,$var)
{
	include_once("config.php");
	if (!isset($var['name']) || !isset($var['location']))
	{
		echo 'no valid name or location';
		return 'You need a valid name and location';
	}
	$address = $var['location'];
	include('googlegeocode.php');
	$var['location'] = $Geocodeobj["results"][0]["formatted_address"];
	$var['lat'] = strval($Geocodeobj["results"][0]["geometry"]["location"]["lat"]);
	$var['lng'] = strval($Geocodeobj["results"][0]["geometry"]["location"]["lng"]);
	if ($var['location'] == NULL || $var['lat'] == '' || $var['lng'] == '') {
		echo 'Invalid address passed';
		return 'There was a problem with your submission: Not a valid street address';
	}
	$_GET['d'] = $var['lat'].",".$var['lng'];
	$_GET['o'] = $DispatchCenter['lat'].",".$DispatchCenter['lng'];
	if ($DispatchMaxTime && $DispatchMaxTime != -1)
	{
		include('googledistancecheck.php');
		if (!$directions || ($directions && $directions["routes"][0]["legs"][0]["duration"]['value'] > $DispatchMaxTime))
		{
			echo "No route or route exceeded MaxTime";
			return "This call is not within your designated service area. Please transfer the call to the closest Dispatch Center";
		}
	}
	$priority = (isset($var['priority'])) ? $var['priority'] : 1;
    $params = array(":active"=>"1", ":name"=>$var['name'], ":location"=>$var['location'], ":lat"=>$var['lat'], ":lng"=>$var['lng'], ":incident"=>$var['incident_type'], ":priority"=>$priority, ":dispatcher"=>$_SESSION['myid'], ":comment"=>$var['comments']);
    $sql = "INSERT INTO ticket(active, name, location, lat, lng, incident_type, priority, dispatcher, time, comments) VALUES(:active, :name, :location, :lat, :lng, :incident, :priority, :dispatcher, NOW(), :comment)";
    $result = $db->query($sql, $params);
	return "";
}

//A function to edit already added tickets. Note these are submitted with a prefix of "edit" because of the code written for testing. This can be changed if you feel like it, but make sure you change the html/js as well.
//Note: If you edit an ambulance value in the ticket table, it will automatically update the relevant data in the ambulance_info table as well!
//This is done by a database trigger.
function editTicket($db,$v)
{
	if (!isset($v['editid']) || !isset($v['editlocation']))
	{
		echo "no valid name or location";
		return 'You need a valid name and location to edit';
	}
	if (!isset($v['editambulance'])) { $v['editambulance'] = 0; }
	$address = $v['editlocation'];
        include('googlegeocode.php');
	return var_dump_ret($Geocodeobj);
        $v['editlocation'] = $Geocodeobj["results"][0]["formatted_address"];
        $v['editlat'] = $Geocodeobj["results"][0]["geometry"]["location"]["lat"];
        $v['editlng'] = $Geocodeobj["results"][0]["geometry"]["location"]["lng"];
	if ($v['editlocation'] == NULL || $v['editlat'] == '' || $v['editlng'] == '') {
		echo 'Invalid address passed';
		return 'There was a problem with your submission: Not a valid street address:';
	}
	$params = array(":active"=>$v['editactive'], ":name"=>$v['editname'], ":location"=>$v['editlocation'], ":lat"=>$v['editlat'], ":lng"=>$v['editlng'], ":incident"=>$v['editincident_type'], ":priority"=>$v['editpriority'], ":ambulance"=>$v['editambulance'], ":comments"=>$v['editcomments'], ":id"=>$v['editid']);
	$sql = "UPDATE ticket SET active=:active, name=:name, location=:location, lat=:lat, lng=:lng, incident_type=:incident,priority=:priority,ambulance=:ambulance,comments=:comments WHERE id = :id";
	$result = $db->query($sql, $params);

	if ($v['editambulance'] > 0)
	{
		$_GET['amboid'] = $v['editambulance'];
		include('googledirections.php');
	}
	return "Ticket edited successfully! - ".$v['ambulance'];
}

//This deletes an entry from the database. Dispatchers shouldn't be deleting valid tickets, whether they were completed or called off, but it's here in case there was a mistake.
function deleteTicket($db,$var)
{
	if (!isset($var['deleteid']))
	{
		echo 'no valid delete id';
		return 'You need a valid id to delete';
	}
	$params = array(":id"=>$var['deleteid']);
	$sql = "DELETE FROM ticket WHERE id = :id";
	$result = $db->query($sql, $params);
	return "Ticket deleted successfully!";
}

//This is the actual code in this module. If data is properly posted from a form, and a user with the proper credentials is requesting, they will be allowed to add/edit/delete tickets.
if (isset($usrtype) && $usrtype > 0 and isset($_POST))
{
	//Simple switch based on the submit type.
	switch($_POST['submitType'])
	{
		case 'addTicket':
			$_SESSION['msgbox'] = addTicket($db,$_POST);
			//Do not go to the previous page! let's choose a valid ambulance instead.
			if ($_SESSION['msgbox'] == "")
			{
				header("Location: ../closestambulance.php?id=".$db->lastInsertId());
				return;
			}
			break;
		case 'editTicket':
			$_SESSION['msgbox'] = editTicket($db,$_POST);
			break;
		case 'deleteTicket':
			$_SESSION['msgbox'] = deleteTicket($db,$_POST);
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
