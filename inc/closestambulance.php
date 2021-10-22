<?php
    include_once("login.php");
    if (checklogin() != 1) { return; }
    $needmap = 1;
    include("header.php");
?>

<body onload="loadInit(3, '<?php echo $_SESSION['preferred_map'], "',", $_GET['id']; ?>);">
    <style>
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
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
  <div id="pick3"></div>
  <div id="map"></div>
</body>
</html>
