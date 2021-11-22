<?php
    include_once("inc/login.php");
    if (checklogin() != 1) { header("Location: ../"); return; }
    if (isset($_POST) && isset($_POST['chooseambo']) && $_POST['chooseambo'] == 'chooseambo')
    {
		if (!isset($_POST['amboselect']) || $_POST['amboselect'] === null || $_POST['amboselect'] == 'null')
		{
			$_SESSION['msgbox'] = "Error: Tried to set a ticket to an unknown ambulance.";
			header("Location: ../");
			return;
		}
        $params = array(":ambo"=> $_POST['amboselect'], ":id"=> $_POST['ticket']);
        $sql = "UPDATE ticket SET ambulance = :ambo WHERE id = :id";
        $result = $db->query($sql, $params);
        if ($result) {
			$params = array(":ambo"=>$_POST['amboselect'], ":dir"=>$_POST['directions'], ":dis"=>$_POST['distance'], ":dur"=>$_POST['duration']);
			$sql = "UPDATE ambulance_info SET directions=:dir, distance=:dis, duration=:dur WHERE id=:ambo";
			$result = $db->query($sql, $params);
            $_SESSION['msgbox'] = "Ambulance has been notified, Ticket is active";
        } else {
            $_SESSION['msgbox'] = "There may have been a problem assigning your ambulance.";   
        }
        header("Location: ../");
    }
    if (!isset($_GET) || !isset($_GET['id']))
    {
        return;
        header("Location: ../");
    }
	//The ambulance homepage requires the map
	$needmap = 1; 
	//The page name is called ambulance, so let's make sure we grab ambulance-related css and js files in header.
	$pagename="closestambulance"; 
	//Inittype is for one of our mapping functions.
	$initType = 3; 
	//ticket id
	$ticketID = $_GET['id'];
	//Include the header and top navigation page
    include("inc/header.php");

?>

  <div id="pick3">
      <span>Please choose between the closest 3 ambulances for ticket#<?php echo $_GET['id']; ?></span>
	  <?php msgBox(); ?>
      <form id="chooseambulance" class="chooseambulance" action="closestambulance.php" method="post">
          <input type="hidden" id="chooseambo" name="chooseambo" value="chooseambo"></input>
			<input type="hidden" id="directions" name="directions" value="">
			<input type="hidden" id="distance" name="distance" value="">
			<input type="hidden" id="duration" name="duration" value="">
          <input type="hidden" id="ticket" name="ticket" value="<?php echo $_GET['id']; ?>"></input>
          <table>
              <tr class="ambo1" id="ambo0">
                  <td><input type="radio" id="radioambo0" name="amboselect" value="null"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
              </tr>
              <tr class="ambo2" id="ambo1">
                  <td><input type="radio" id="radioambo1" name="amboselect" value="null"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
              </tr>
              <tr class="ambo3" id="ambo2">
                  <td><input type="radio" id="radioambo2" name="amboselect" value="null"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
              </tr>
          </table>
          <button id="submitchooseambo" type="submit" name="submit" value="Submit">Submit</button><button type="button" onclick="location.href='../'">Leave Unassigned</button>
      </form>
  </div>
  <div id="map"></div>
</body>
</html>
