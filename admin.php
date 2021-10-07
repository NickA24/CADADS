<?php include_once('./inc/login.php'); if (checklogin() != 3) { return; } ?>
<html>
<head>
	<title>Admin panel</title>
	<script type="text/javascript" src="/js/json.js"></script>
</head>
<body>
	<div>Admin main functions are to Add User, Change Password, Delete user, and see ticket data.</div>
	<br><br>
	<div id="AddUser"><h3>Add a New User</h3></div>
	<div id="EditPassword"><h3>Edit a User's Name or Password</h3></div>
	<div id="DeleteUser"><h3>Delete User (Not to be used</h3></div>
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
