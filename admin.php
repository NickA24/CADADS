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
	switch($ut)
	{
		case 1:
			$utname = "Dispatch";
			break;
		case 2:
			$utname = "Ambulance";
			break;
		case 3:
			$utname = "Admin";
	}
	return "Success! added ".$un." to database as ".$utname."!";
}

//A function to delete users
function adminDeleteUser($db,$var)
{
	if (!isset($var['id']))
	{
		return 'You need a valid user id';
	}
	if ($var['id'] == $_SESSION['myid'])
	{
		return 'You cannot delete the user you are logged in as.';	
	}
	$params = array(":id"=>$var['id']);
	$sql = "DELETE FROM ambulance_info WHERE id = :id";
	$result = $db->query($sql, $params);
	$sql = "DELETE FROM users WHERE id = :id";
	$result = $db->query($sql, $params);
	return "Success! deleted user id ".$var['id']." from database!";
}
//A function to edit users. 
//Note it keeps the same password unless a new password is entered.
function adminEditUser($db,$var)
{
	if (!isset($var['id']))
	{
		echo "no valid user id";
		return 'You need a valid user id to edit';
	}
	$params = array(":id"=>$var['id'], ":name"=>$var['name'], ":usertype"=>$var['user_type']);
	$sql = "UPDATE users SET name = :name, user_type = :usertype WHERE id = :id";
	$result = $db->query($sql, $params);
	if (isset($var['pass']))
	{
		unset($params);
		$params = array(":id"=>$var['id'], ":pass"=> passmake($var['pass']));
		$sql = "UPDATE users SET hash_pw = :pass WHERE id = :id";
		$result = $db->query($sql, $params);
	}
	return "Updated user id ".$var['id'];
}

//This is the actual code in this module. If data is properly posted from a form, and a user with the proper credentials is requesting, they will be allowed to add/edit/delete tickets.
if (isset($usrtype) && $usrtype == 3 && isset($_POST) && isset($_POST['submitType']))
{
	//Simple switch based on the submit type.
	switch($_POST['submitType'])
	{
		case 'adminAddUser':
			$_SESSION['msgbox'] = adminAddUser($db,$_POST); 
			break;
		case 'adminEditUser':
			$_SESSION['msgbox'] = adminEditUser($db,$_POST);
			break;
		case 'adminDeleteUser':
			echo adminDeleteUser($db, $_POST);
			return;
			break;
	}
	//After the code above has been handled, return the person to the previous page. This way they never hang out on a blank white page.
	//(No longer needing this since we're using asynchronous stuff
	if(isset($_REQUEST["destination"])){
		header("Location: {$_REQUEST['destination']}");
	} else if(isset($_SERVER["HTTP_REFERER"])){
		header("Location: {$_SERVER['HTTP_REFERER']}");
	}else{
		header("Location: index.php");
	}
	return;
}
$title = "Diamond Dispatch Admin Panel";
include('./inc/header.php');
?>

<body>
	<?php echo logoutbutton(); ?>
	<div>Admin main functions are to Add User, Change Password, Delete user, and see ticket data.</div>
	<br><br>
	<div id="msgBox"><?php if (isset($_SESSION['msgbox'])) {echo $_SESSION['msgbox']; unset($_SESSION['msgbox']); } ?></div>
	<div id="AddUser"><h3>Add a New User</h3>
		<form method="POST" id="addUser">
			<input type="hidden" name="submitType" id="submitType" value="adminAddUser">
			<label for="name">User Name:</label><input type="textbox" name="name" id="name">
			<label for="pass">Password:</label><input type="password" name="pass" id="pass">
			<label for="dblchk"></label><input type="password" name="dblchk" id="dblchk" placeholder="Verify Password" onblur="if (this.value != document.getElementById('pass').value){this.setCustomValidity('Passwords must match!');}else{this.setCustomValidity('');}}">
			<label for="userType">User Type:</label><select id="userType" name="userType">
			<option value="1" selected>Dispatch</option>
			<option value="2">Ambulance</option>
			<option value="3">Admin</option></select>
			<button type="submit" value="submit" name="addUserSubmit" id="addUserSubmit">Add New User</button>
		</form>
	</div>
	<div id="ListUsers"><h3>List users to interact with:<button type="button" name="listUsers" id="listUsers" onclick="adminListUsers(event);">List</button></h3>
		<select name="listedUsers" id="listedUsers"></select><button type="button" name="EditUserList" id="EditUserList" onclick="adminEditUser(event);">Edit</button>
		<button name="DeleteUserList" id="DeleteUserList" onclick="adminDeleteUsers(event);">Delete</button>
	</div>
	<div id="EditUser"><h3>Edit a User's Name, Password, or Type</h3></div>
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
</body>
</html>
