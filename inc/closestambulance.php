<?php
    include_once("login.php");
    if (checklogin() != 1) { return; }
    $needmap = 1;
    include("header.php");

?>

<body onload="loadInit(3);">
    <style>
    #map {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 10%;
    }
</style>
  <div id="pick3"></div>
  <div id="map"></div>
</body>
</html>
