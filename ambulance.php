<?php	include_once("./inc/login.php"); include_once("./inc/header.php"); if (checklogin() != 2) { return; } ?>
<body>
<?php if (checklogin()) { ?><div style="float:right;"><a href="inc/logout.php">Log out</a></div><?php } ?>
<h1>Ambulance <?php echo $_SESSION['myusername'] ?>:</h1>
<div id="curCall"></div>
<script>
	document.addEventListener("load", function () {
    var ele = document.getElementById("curCall");
    getJSON("inc/getjson.php?tbl=curAmbo", function(err, data) {
    if (err !== null) {
			ele.innerHTML = "Oops, error:" + err;
		} else {
	alert(data);
      ele.innerHTML = data;
    }
  });
});
</body>
</html>
