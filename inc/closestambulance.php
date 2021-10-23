<?php
    include_once("login.php");
    if (checklogin() != 1) { header("Location: ../"); return; }
    if (!isset($_POST))
    {
        var_dump($_POST);
        return;
        header("Location: ../");
    }
    if (!isset($_GET) || !isset($_GET['id']))
    {
        return;
        header("Location: ../");
    }
    $needmap = 1;
    include("header.php");

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
              <tr class="ambo1" id="ambo0">
                  <td><input type="radio" id="radioambo0" name="amboselect" value="1"></td>
                  <td></td>
                  <td>e</td>
                  <td></td>
              </tr>
              <tr class="ambo2" id="ambo1">
                  <td><input type="radio" id="radioambo1" name="amboselect" value="2"></td>
                  <td></td>
                  <td></td>
                  <td></td>
              </tr>
              <tr class="ambo3" id="ambo2">
                  <td><input type="radio" id="radioambo2" name="amboselect" value="3"></td>
                  <td></td>
                  <td></td>
                  <td></td>
              </tr>
          </table>
          <button type="submit">Submit</button><button type="button" onclick="location.href='../'">Leave Unassigned</button>
      </form>
  </div>
  <div id="map"></div>
</body>
</html>
