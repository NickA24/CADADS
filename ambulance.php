<?php	include_once("./inc/login.php"); include_once("./inc/header.php"); if (checklogin() != 2) { return; } ?>
<body>
<?php if (checklogin()) { ?><div style="float:right;"><a href="inc/logout.php">Log out</a></div><?php } ?>
<h1>Ambulance <?php echo $_SESSION['username'] ?>:</h1>
<div id="curCall">
  <?php
  $contents = file_get_contents("/inc/getjson.php?tbl=curAmbo");
  if ($contents !== false) {
    echo $contents;
  }
  ?>
  </div>
</body>
</html>
