<?php
    include_once("login.php");
    if (checklogin() != 1) { return; }
    $needmap = 1;
    include("header.php");

?>


<body onload="loadInit(3);">
  <div id="pick3"></div>
  <div id="map"></div>
</body>
</html>
