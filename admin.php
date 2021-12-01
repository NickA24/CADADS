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
	if (strlen($var['name']) > 64 || strlen($var['pass']) > 64) {
		return 'Your username or password is too long';
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
		$query = "INSERT INTO ambulance_info(id, lastupdate) VALUES(:id, NOW())";
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
	if (isset($var['name']) && strlen($var['name']) > 64)
	{
		echo 'Name too long';
		return 'Your new username is too long, please limit it to 128 characters';
	}
	$params = array(":id"=>$var['id'], ":name"=>$var['name'], ":usertype"=>$var['user_type']);
	$sql = "UPDATE users SET name = :name, user_type = :usertype WHERE id = :id";
	$result = $db->query($sql, $params);
	if (isset($var['pass']) && strlen($var['pass']) < 64)
	{
		unset($params);
		$params = array(":id"=>$var['id'], ":pass"=> passmake($var['pass']));
		$sql = "UPDATE users SET hash_pw = :pass WHERE id = :id";
		$result = $db->query($sql, $params);
	} else if (isset($var['pass'])) {
		return 'Your new password is too long, please reduce it to 64 characters max';
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
$pagename = "admin";

include('./inc/header.php');
?>
	<?php msgBox(); ?>
	<div id="searchOptions">
		<h3>Search By:</h3>
			<form id="search" name="search">
			<table style="text-align:left">
				<tr>
					<td>Ticket Activity</td>
					<td>
						<input type="radio" id="activetype1" name="activetype" value="0" checked><label for="activetype1">Active tickets</label><br>
						<input type="radio" id="activetype2" name="activetype" value="1"><label for="activetype2">Inactive tickets</label><br>
						<input type="radio" id="activetype3" name="activetype" value="2"><label for="activetype3">All Tickets</label>
					</td>
				</tr>
				<tr>
					<td>Incident Type</td>
					<td>
						<select id="incident_type" name="incident_type">
							<option value="" disabled selected>Select an Incident</option>
								<?php
									// Showing off php calls to the database in the middle of the HTML
									// and creating the proper format ourselves in the loop
									$sql = "SELECT * FROM incident_tbl ORDER BY id";
									$ack = $db->query($sql);
									foreach ($ack as $row) {
									echo '<option id="incident'. $row['id']. '" value="'. $row['id'] .'">'. $row['ack']. ' - '. $row['description']. '</option>';
									}
								 ?>
						</select>
					</td>
				</tr>
				<tr>
					<td>Priority</td>
					<td>
						<select id="priority" name="priority">
							<option value="" disabled selected>Select a Priority</option>
							<option value="1">1 - High/Emergency</option>
							<option value="2">2 - Medium/Urgent</option>
							<option value="3">3 - Low/Routine</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>Ambulance</td>
					<td>
						<select id="ambulance" name="ambulance">
							<option value="" disabled selected>Select an Ambulance</option>
						<?php
							$params = array();
							$sql = "SELECT id, name FROM users WHERE user_type = 2 ORDER BY id";
							$return = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
							foreach ($return as $r) {
								echo "<option value='".$r['id']."'>".$r['name']."</option>";
							}
						?>
						</select>
					</td>
				</tr>
				<tr>
					<td>Dispatcher</td>
					<td>
						<select id="dispatcher" name="dispatcher">
							<option value="" disabled selected>Select a Dispatcher</option>
						<?php
							$params = array();
							$sql = "SELECT id, name FROM users WHERE user_type = 1 ORDER BY id";
							$return = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
							foreach ($return as $r) {
								echo "<option value='".$r['id']."'>".$r['name']."</option>";
							}
						?>
						</select>
					</td>
				</tr>
				<tr>
					<td>
						Date Created:
					</td>
					<td>
						<input id="dateCreated" name="dateCreated">
					</td>
				</tr>
				<tr>
					<td>
						Date Completed:
					</td>
					<td>
						<input id="dateCompleted" name="dateCompleted">
					</td>
				</tr>
				<tr>
					<td>
						Time Created:
					</td>
					<td>
						<input id="timeCreated" name="timeCreated">
						Range:
						<select id="timeCreatedRange" name="timeCreatedRange">
							<option value="" disabled selected>-</option>
							<option value="0">0</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
							<option value="11">11</option>
							<option value="12">12</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>
						Time Completed:
					</td>
					<td>
						<input id="timeCompleted" name="timeCompleted">
												Range:
						<select id="timeCompletedRange" name="timeCompletedRange">
							<option value="" disabled selected>-</option>
							<option value="0">0</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
							<option value="11">11</option>
							<option value="12">12</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>
						Time to Complete:
					</td>
					<td>
						<select id="TtCStart" name="TtCStart">
							<option value="" disabled selected>-</option>
							<option value="0">0</option>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="15">15</option>
							<option value="20">20</option>
							<option value="25">25</option>
							<option value="30">30</option>
							<option value="35">35</option>
							<option value="40">40</option>
							<option value="45">45</option>
							<option value="50">50</option>
							<option value="55">55</option>
							<option value="60">60</option>
						</select>
						-
						<select id="TtCEnd" name="TtCEnd">
							<option value="" disabled selected>-</option>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="15">15</option>
							<option value="20">20</option>
							<option value="25">25</option>
							<option value="30">30</option>
							<option value="35">35</option>
							<option value="40">40</option>
							<option value="45">45</option>
							<option value="50">50</option>
							<option value="55">55</option>
							<option value="60">60</option>
							<option value="99">>60</option>
						</select>
					</td>
				</tr>
				<tr>
					<td></td>
					<td>
						<input type="submit" value="Search">
					</td>
				</tr>
			</table>
			</form>
	</div>
	<div class="leftContainer">
		<div id="AddUser"><h3>Add a New User</h3>
			<form method="POST" id="addUser">
				<input type="hidden" name="submitType" id="submitType" value="adminAddUser">
				<table>
					<tr>
						<td>
							<label for="name">User Name:</label>
						</td>
						<td>
							<input type="textbox" name="name" id="name" maxlength="64" >
						</td>
					</tr>
					<tr>
						<td>
							<label for="pass">Password:</label>
						</td>
						<td>
							<input type="password" name="pass" id="pass" maxlength="64">
						</td>
						<td>
							<label for="dblchk"></label><input type="password" name="dblchk" id="dblchk" maxlength="64" placeholder="Verify Password" onfocusout="doPassCheck(this)">
						</td>
					</tr>
					<tr>
						<td>
							<label for="userType">User Type:</label>
						</td>
						<td>
							<select id="userType" name="userType">
								<option value="1" selected>Dispatch</option>
								<option value="2">Ambulance</option>
								<option value="3">Admin</option>
							</select>
						</td>
						<td>
							<button type="submit" value="submit" name="addUserSubmit" id="addUserSubmit">Add New User</button>
							<button id="cancel" onclick="closed">Cancel</button>
						</td>
					</tr>
				</table>
			</form>
		</div>
		<div id="ListUsers"><h3>List of users to interact with:</h3>
			<table>
				<tr>
					<td>
			<select name="listedUsers" id="listedUsers">
			<?php
				$params = array(":id"=>$_SESSION['myid']);
				$sql = "SELECT id, name, '' AS pass, user_type FROM users WHERE id != :id ORDER BY id";
				$return = $db->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
				$usrtype = ["Dispatch", "Ambulance", "Admin"];
				foreach ($return as $r) {
					echo "<option value='".$r['id']."'>".$r['name']."-".$usrtype[$r['user_type']-1]."</option>";
				}
			?>
			</select>
					</td>
					<td>
						<button type="button" name="EditUserList" id="EditUserList" onclick="adminEditUser(event);">Edit</button>
					</td>
					<td>
						<button name="DeleteUserList" id="DeleteUserList" onclick="adminDeleteUsers(event);">Delete</button>
						<button id="cancel" onclick="closed">Cancel</button>
					</td>
				</tr>
			</table>
		</div>
		<div id="EditUser"><h3>Edit a User's Name, Password, or Type</h3></div>
	</div>
	<div class="rightContainer">
		<h3 id="tabletoptext">Open Tickets</h3>
		<div id="admintablecontainer"></div></center>
	</div>
</body>
</html>
