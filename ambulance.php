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
        .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
    }

    .dropdown-content a {
      float: none;
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      text-align: left;
    }

    .dropdown-content a:hover {
      background-color: #ddd;
    }

    .show {
      display: block;
    }
    h3 {
        display: inline;
        padding-left: 5px;
    }
    .h3 {
        text-align: center;
    }
    /* Set the size of the div element that contains the map */
    #map {
        height: 600px;
        width: 100%;
    }
</style>
<body onload="loadInit(1, '<?php echo $_SESSION['preferred_map']; ?>');">
    <nav class="sticky">
        <ul>
          <li style="background-color:black">Diamond Dispatch: <?php echo $_SESSION['myusername'] ?></li>
          <li class="dropbtn" onclick="dropdown()">Change Status <i class="fa fa-caret-down"></i>
                <div class="dropdown-content" id="myDropdown">
                    <a href="#">Out of Service</a>
                    <a href="#">Availible</a>
                    <a href="#">Enroute</a>
                    <a href="#">Unavailable</a>
                  </div>
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
