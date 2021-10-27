<?php
	include_once('./inc/login.php');
	$result = $db->query("SELECT COUNT(*) FROM users", null);
	$result = $result->fetch(PDO::FETCH_NUM)[0];
	if ($result == 0) {
		$un = strtolower("Dispatch1");
		$pw = "dispatch";
		$params = array(":name" => $un, ":pw" => passmake($pw), ":ut" => 1);
		$query = "INSERT INTO users(name, hash_pw, user_type) VALUES(:name, :pw, :ut)";
		$result = $db->query($query, $params);
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
			$query = "INSERT INTO ambulance_info(id, status, lastupdate) VALUES(:id, 0, NOW())";
			$result = $db->query($query, $params);
		}
		$un = strtolower("Admin1");
		$pw = "admin";
		$params = array(":name" => $un, ":pw" => passmake($pw), ":ut" => 3);
		$query = "INSERT INTO users(name, hash_pw, user_type) VALUES(:name, :pw, :ut)";
		$result = $db->query($query, $params);
	}
	header("Location: ../");
?>
