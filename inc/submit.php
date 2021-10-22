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
	return var_dump($var);
        $priority = (isset($var['priority'])) ? $var['priority'] : 1;
        $params = array(":active"=>"1", ":name"=>$var['name'], ":location"=>$var['location'], ":lat"=>$var['lat'], ":lng"=>$var['lng'], ":incident"=>$var['incident_type'], ":priority"=>$priority, ":dispatcher"=>$_SESSION['myid'], ":comment"=>$var['comments']);
        $sql = "INSERT INTO ticket(active, name, location, lat, lng, incident_type, priority, dispatcher, time, comments) VALUES(:active, :name, :location, :lat, :lng, :incident, :priority, :dispatcher, NOW(), :comment)";
        $result = $db->query($sql, $params);
	return $result;
}

//A function to edit already added tickets. Note these are submitted with a prefix of "edit" because of the code written for testing. This can be changed if you feel like it, but make sure you change the html/js as well.
//Note: If you edit an ambulance value in the ticket table, it will automatically update the relevant data in the ambulance_info table as well!
//This is done by a database trigger.
function editTicket($db,$var)
{
	if (!isset($var['editid']) || !isset($var['editlocation']))
	{
		echo "no valid name or location";
		return 'You need a valid name and location to edit';
	}
	if (!isset($var['ambulance'])) { $var['ambulance'] = 0; }
	$address = $var['editlocation'];
        include('googlegeocode.php');
        $var['editlocation'] = $Geocodeobj["results"][0]["formatted_address"];
        $var['editlat'] = $Geocodeobj["results"][0]["geometry"]["location"]["lat"];
        $var['editlng'] = $Geocodeobj["results"][0]["geometry"]["location"]["lng"];
	$params = array(":active"=>$var['editactive'], ":name"=>$var['editname'], ":location"=>$var['editlocation'], ":lat"=>$var['editlat'], ":lng"=>$var['editlng'], ":incident"=>$var['editincident_type'], ":priority"=>$var['editpriority'], ":ambulance"=>$var['editambulance'], ":comments"=>$var['editcomments'], ":id"=>$var['editid']);
	$sql = "UPDATE ticket SET active=:active, name=:name, location=:location, lat=:lat, lng=:lng, incident_type=:incident,priority=:priority,ambulance=:ambulance,comments=:comments WHERE id = :id";
	$result = $db->query($sql, $params);
	return $result;
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
	return $result;
}

//This is the actual code in this module. If data is properly posted from a form, and a user with the proper credentials is requesting, they will be allowed to add/edit/delete tickets.
if (isset($usrtype) && $usrtype > 0 and isset($_POST))
{
	//Simple switch based on the submit type.
	switch($_POST['submitType'])
	{
		case 'addTicket':
			$_SESSION['msgbox'] = addTicket($db,$_POST); 
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
