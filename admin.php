<?php include_once('./inc/login.php'); if (checklogin() != 3) { return; } 

$usrtype = checklogin();

//Don't let non-logged in people see this page at all
if (!isset($usrtype) || $usrtype <= 2)
{
	echo "not logged in";
	return;
}

//A function to add users.
function adminAddUser($db,$var)
{
	if (!isset($var['name']) || !isset($var['pass']) || !isset($var['userType']))
	{
		echo 'no valid name/pass/type';
		return 'You need a valid name, password, and usertype';
	}
	$un = $var['name'];
	$pw = $var['pass'];
	$ut = $var['userType'];
	$params = array(":name" => $un, ":pw" => passmake($pw), ":ut" => $ut);
	$query = "INSERT INTO users(name, hash_pw, user_type) VALUES(:name, :pw, :ut)";
	$result = $db->query($query, $params);
	//If this is an ambulance, create a new entry in the ambo info at that id#
	if ($ut == 2) 
	{
		$newid = $db->lastInsertId();
		$params = array(":id"=>$newid);
		$query = "INSERT INTO ambulance_info(id, status, location, lastupdate) VALUES(:id, 0, 0, NOW())";
		$result = $db->query($query, $params);
	}
	return $result;
}
/*
//A function to edit already added tickets. Note these are submitted with a prefix of "edit" because of the code written for testing. This can be changed if you feel like it, but make sure you change the html/js as well.
//Note: You're not allowed to change ambulances using the edit feature. This is by design. If you want to change ambulances, that's a separate thing. (this may change in the future)
function editTicket($db,$var)
{
	if (!isset($var['editid']) || !isset($var['editlocation']))
	{
		echo "no valid name or location";
		return 'You need a valid name and location to edit';
	}
	$params = array(":active"=>$var['editactive'], ":name"=>$var['editname'], ":location"=>$var['editlocation'], ":incident"=>$var['editincident_type'], ":priority"=>$var['editpriority'], ":comments"=>$var['editcomments'], ":id"=>$var['editid']);
	$sql = "UPDATE ticket SET active=:active, name=:name, location=:location, incident_type=:incident,priority=:priority,comments=:comments WHERE id = :id";
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
*/
//This is the actual code in this module. If data is properly posted from a form, and a user with the proper credentials is requesting, they will be allowed to add/edit/delete tickets.
if (isset($usrtype) && $usrtype == 3 and isset($_POST))
{
	//Simple switch based on the submit type.
	switch($_POST['submitType'])
	{
		case 'adminAddUser':
			echo adminAddUser($db,$_POST); 
			break;
		case 'adminEditUser':
			//editTicket($db,$_POST);
			break;
		case 'adminDeleteUser':
			//deleteTicket($db,$_POST);
			break;
	}
	//After the code above has been handled, return the person to the previous page. This way they never hang out on a blank white page.
	//(No longer needing this since we're using asynchronous stuff
	//if(isset($_REQUEST["destination"])){
	//	header("Location: {$_REQUEST['destination']}");
	//} else if(isset($_SERVER["HTTP_REFERER"])){
	//	header("Location: {$_SERVER['HTTP_REFERER']}");
	//}else{
	//	/* some fallback, maybe redirect to index.php */
	//}
	return;
}
?>



$title = "Diamond Dispatch Admin Panel";
include('./inc/header.php');
?>

<body>
	<?php if (checklogin()) { ?><div style="float:right;"><a href="inc/logout.php">Log out</a></div><?php } ?>
	<div>Admin main functions are to Add User, Change Password, Delete user, and see ticket data.</div>
	<br><br>
	<div id="msgBox"></div>
	<div id="AddUser"><h3>Add a New User</h3>
		<form method="POST" id="addUser">
			<input type="hidden" name="submitType" id="submitType" value="adminAddUser">
			<label for="name">User Name:</label><input type="textbox" name="name" id="name">
			<label for="pass">Password:</label><input type="textbox" name="pass" id="pass">
			<label for="userType">User Type:</label><select id="userType" name="userType">
			<option value="1" selected>Dispatch</option>
			<option value="2">Ambulance</option>
			<option value="3">Admin</option></select>
			<button type="submit" value="submit" name="addUserSubmit" id="addUserSubmit">Add New User</button>
		</form>
		  <script>document.getElementById("addUser").addEventListener('submit', adminAddUser, false);</script>
	</div>
	<div id="EditPassword"><h3>Edit a User's Name or Password</h3></div>
	<div id="DeleteUser"><h3>Delete User (Not to be used)</h3></div>
	<div id="showold"><input type="checkbox" id="inactive" name="inactive"><label for="inactive">Show Inactive</label></div>
	<div id="ambulancetableexample"></div></center>
	<script>
		var x = document.getElementById("ambulancetableexample");
		var y = document.querySelector('input[id="inactive"]');
		var inactive = 0;
		//This is the code to get the table to update on click.
		y.addEventListener('click', (event) => {
			if(y.checked) { inactive = 1; } else {inactive = 0;}
			while (x.firstChild) {
				x.removeChild(x.firstChild);
			}
			ticketTable(x, inactive);
		});
		//This is found in json.js, if it needs to be edited.
		ticketTable(x, inactive);
	</script>

<?php
//Used this code to automatically generate user files. Making the UI to create/edit/delete users and psaswords will go here.
/*		$un = strtolower("Dispatch1");
		$pw = "dispatch";
		$params = array(":name" => $un, ":pw" => passmake($pw), ":ut" => 1);
		$query = "INSERT INTO users(name, hash_pw, user_type) VALUES(:name, :pw, :ut)";
		$result = $db->query($query, $params);
		//If this is an ambulance, create a new entry in the ambo info at that id#
		if (1  == 2) 
		{
			$newid = $db->lastInsertId();
			$params = array(":id"=>$newid);
			$query = "INSERT INTO ambulance_info(id, status, location, lastupdate) VALUES(:id, 0, 0, NOW())";
			$result = $db->query($query, $params);
		}
		$un = strtolower("Ambo1");
		$pw = "ambulance";
		$params = array(":name" => $un, ":pw" => passmake($pw), ":ut" => 2);
		$query = "INSERT INTO users(name, hash_pw, user_type) VALUES(:name, :pw, :ut)";
		$result = $db->query($query, $params);
		//If this is an ambulance, create a new entry in the ambo info at that id#
		if (2 == 2) 
		{
			$newid = $db->lastInsertId();
			$params = array(":id"=>$newid);
			$query = "INSERT INTO ambulance_info(id, status, location, lastupdate) VALUES(:id, 0, 0, NOW())";
			$result = $db->query($query, $params);
		}
		$un = strtolower("Admin1");
		$pw = "admin";
		$params = array(":name" => $un, ":pw" => passmake($pw), ":ut" => 3);
		$query = "INSERT INTO users(name, hash_pw, user_type) VALUES(:name, :pw, :ut)";
		$result = $db->query($query, $params);
		//If this is an ambulance, create a new entry in the ambo info at that id#
		if (3 == 2) 
		{
			$newid = $db->lastInsertId();
			$params = array(":id"=>$newid);
			$query = "INSERT INTO ambulance_info(id, status, location, lastupdate) VALUES(:id, 0, 0, NOW())";
			$result = $db->query($query, $params);
		}
*/		
?>
</body>
</html>
