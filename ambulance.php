<?php include_once("./inc/login.php"); $needmap = 1; include_once("./inc/header.php"); if (checklogin() != 2) { return; } ?>
<body onload="loadInit();">
<?php echo logoutbutton(); ?>
    <style type="text/css">
    /* Set the size of the div element that contains the map */
    #map {
      height: 600px;
      width: 100%;
    }
  </style>
<h1>Ambulance <?php echo $_SESSION['myusername'] ?>:</h1>
<div id="curCall"></div>
<div id="map"></div>
<script type="text/javascript" src="/inc/googleapi.php" async></script>
</body>
</html>
