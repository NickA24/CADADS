<?php
    include_once("login.php");
    if (checklogin() != 1) { return; }
    $needmap = 1;
    include("header.php");
    if (isset($_POST))
    {
        header("Location: ../index.php");
    }
?>

<body onload="loadInit(3, '<?php echo $_SESSION['preferred_map'], "',", $_GET['id']; ?>);">
    <style>
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        border: 0;
    }
    #pick3 {
        position: fixed;
        height:15%;
        width:100%;
        display:flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: flex-end;
        align-items: center;
    }
    #pick3 form {
        text-align: center;
    }
    #map {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 15%;
        width:100%;
        height:85%;
    }
</style>
  <div id="pick3">
      <span>Please choose between the closest 3 ambulances for ticket#<?php echo $_GET['id']; ?></span>
      <form class="chooseambulance" action="closestambulance.php" method="post">
          <table>
              <tr class="ambo1" id="ambo1">
                  <td><input type="radio" id="radioambo1" name="amboselect" value="1"></td>
                  <td>Ambo1</td>
                  <td>Distance</td>
                  <td>Time</td>
              </tr>
              <tr class="ambo2" id="ambo2">
                  <td><input type="radio" id="radioambo2" name="amboselect" value="2"></td>
                  <td>Ambo2</td>
                  <td>Distance</td>
                  <td>Time</td>
              </tr>
              <tr class="ambo3" id="ambo3">
                  <td><input type="radio" id="radioambo3" name="amboselect" value="3"></td>
                  <td>Ambo3</td>
                  <td>Distance</td>
                  <td>Time</td>
              </tr>
          </table>
          <button type="submit">Submit</button><button type="button">Leave Unassigned</button>
      </form>
  </div>
  <div id="map"></div>
</body>
</html>
