<?php include_once('./inc/login.php'); if (checklogin() != 3) { return; } ?>
<html>
<head><title>Admin panel</title></head>
<body>Creating three legit users
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
