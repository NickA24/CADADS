<?php
//includes the database 
include_once('connect.php');

//creates a new session if there is no previous session
if (strlen(session_id()) < 1) {session_start();}

//Function to check if the inserted password matches the one stored in the database
function passcheck($a, $b) {
	if (password_verify($a, $b)) { return true; } else { return false; }
}

//Function to create a hashed password to store in the database
function passmake($a) {
	return password_hash($a, PASSWORD_BCRYPT);
}

//Function to check if a user is properly logged in. If not, return false. If so, return what type of user it is.
function checklogin() {
	if (!isset($_SESSION['myusername'])) {return false;}
	$myusername = $_SESSION['myusername'];
	if ($myusername && $_SESSION['mypassword'] == 1) { return $_SESSION['user_type']; } else { return false; }
	return false;
}

//Only need to do this part if we have any post data at all, otherwise skip the cycles
if (isset($_POST)) {
	//If we receive user data, check if it's valid and if it's submitted by an admin, and insert into the db
	if (isset($_POST['addnew'])) {
		if (checklogin() == 3)
		{
			$un = strtolower($_POST['name']);
			$pw = $_POST['pwd'];
			$params = array(":name" => $un, ":pw" => passmake($pw), ":ut" => $_POST['user_type']);
			$query = "INSERT INTO users(name, hash_pw, user_type) VALUES(:name, :pw, :ut)";
			$result = $db->query($query, $params);
			//If this is an ambulance, create a new entry in the ambo info at that id#
			if ($_POST['user_type'] == 2) 
			{
				$newid = $db->lastInsertId();
				$params = array(":id"=>$newid);
				$query = "INSERT INTO ambulance_info(id, status, location, lastupdate) VALUES(:id, 0, 0, NOW())";
				$result = $db->query($query, $params);
			}
		} else {
			echo "You are not allowed to enter users";
			return;
		}
	}

	//If we receive a username and password, check if they match the db and log in the user, otherwise reject it.
	if (isset($_POST['userLogin']) && $_POST['userLogin'] == "login") {
		$myusername=strtolower($_POST['name']);
		$mypassword=$_POST['pwd'];
		$params = array(":name" => $myusername);
		$query = 'SELECT * FROM users WHERE name = :name';
		$result = $db->query($query, $params);
		$result = $result->fetch();
		if (!$result) {echo "Bad Username or Password!"; return;}
		if (passcheck($mypassword, $result['hash_pw'])) {
			echo "Success!";
			session_regenerate_id(true);
			$_SESSION['myid'] = $result['id'];
			$_SESSION['myusername'] = $myusername;
			$_SESSION['mypassword'] = 1;
			$_SESSION['user_type'] = $result['user_type'];
			$_SESSION['status'] = 0;
			$_SESSION['location'] = 0;
			$_SESSION['lastupdate'] = 0;
			if ($_SESSION['user_type'] == 2)
			{
				$query = 'SELECT * FROM ambulance_info WHERE id = :id';
				$params = array(':id'=>$_SESSION['myid']);
				$result = $db->query($query, $params);
				$result = $result->fetch();
				$_SESSION['status'] = $result['status'];
				$_SESSION['location'] = $result['location'];
				$_SESSION['lastupdate'] = $result['lastupdate'];
			}
			header("Location: ../index.php");
		} else {
			echo "Bad Username or Password";
		}
		return;
	}
}
?>
