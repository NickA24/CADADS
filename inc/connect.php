<?php

//This is our database class
class cadDB {
  //Hiding the username/pass so it's not so easy to hack if people wanted to.
  //Remember to find out what these values are before you push this to the server.
	private $dbname = <hidden for security>;
	private $username = <hidden for security>;
	private $password = <hidden for security>;
	private $db;
	private $config;
	public function __construct() {
		$this->createDB();
	}
	
	//This is what creates the object when we call new cadDB at the end of this file. does the handshaking with our database name, username, and password. All automatic.
	//Change the private variables above if you need to use a new database, username, or password.
	private function createDB() {
		try {
			$this->db = new PDO("mysql:host=localhost;dbname=".$this->dbname.";charset=utf8mb4",$this->username,$this->password);
			$this->db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
			$this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		} catch (PDOException $e) {
			exit("Unable to connect to the database server. Please notify <a href='mailto:$_SERVER[SERVER_ADMIN]'>$_SERVER[SERVER_ADMIN]</a>.<br><br>ERROR:" . $e->getMessage());
		}
	}
	
	//This handles all SQL queries. 
	//$query is the actual SQL statement, such as "SELECT * FROM tbl_name"
	//If a parameter is passed, it will pass data to the database, assuming the SQL query is something that adds or updates new information
	public function query($query, $param = null)
	{
		if ($param) {
			$result = $this->db->prepare($query);
		} else {
			$result = $this->db->query($query);
		}		
		$result->execute($param);
		return $result;
	}
	
	//Not used, but commented out for later in case we want to have a configuration file unique to this database.
	/*public function serverConfig()
	{
		if ($this->config) { return $this->config; }
		$result = $this->db->query("SELECT * FROM config");
		$this->config = array();
		foreach ($result as $r)
		{
			$this->config[$r['k']] = $r['val'];
		}
		return $this->config;
	}*/
}

$db = new cadDB();
?>
