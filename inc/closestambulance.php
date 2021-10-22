<?php
    include_once("inc/login.php");
    if (checklogin() != 1) { return; }
    $needmap = 1;
    include("inc/header.php");

?>


<body onload="loadInit(2);">
  <div id="pick3"></div>
  <div id="map"></div>
</body>
</html>
