<?php include_once("./inc/login.php"); $needmap = 1; include_once("./inc/header.php"); if (checklogin() != 2) { return; } ?>
<?php echo logoutbutton(); ?>
<style type="text/css">
    body {
        margin: 0;
        font-family: 'Open Sans', sans-serif;
    }
    ul {
        list-style-type: none;
        width: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #333;
        z-index: 1;
    }
    li {
        float: left;
        display: block;
        color: white;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
    }
    li:hover:not(.active) {
        background-color: #111;
    }
    .logoutbutn {
        float: right;
        text-decoration: none;
    }
    .sticky {
        background-color: #ffffff;
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        z-index: 1;
    }
    /* Set the size of the div element that contains the map */
    #map {
        height: 600px;
        width: 100%;
    }
</style>
<body onload="loadInit(1);">
    <nav class="sticky">
        <ul>
          <li style="background-color:black">Diamond Dispatch: <?php echo $_SESSION['myusername'] ?></li>
          <li>Change Status</li>
          <li>Call Dispatch</li>
          <li>Call Caller</li>
          <li class="logoutbutn">
              <a class="active">
                  <?php
                  echo logoutbutton();
                  ?>
              </a>
          </li>
        </ul>
    </nav>
<div id="curCall"></div>
<div id="map"></div>
</body>
</html>
