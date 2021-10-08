<?php	include_once("./inc/login.php"); include_once("./inc/header.php"); if (checklogin() != 2) { return; } ?>
<body onload="var ele = document.getElementById('curCall'); amboInfo(ele); this.onkeydown = amboShortcuts;">
<?php echo logoutbutton(); ?>
<h1>Ambulance <?php echo $_SESSION['myusername'] ?>:</h1>
<div id="curCall"></div>
<script>
var amboShortcuts = function(e) {
  var str = "You have pressed a button. Press info: "+e.code+" alt:"+e.altKey+" shift:"+e.shiftKey+" ctrl:"+e.ctrlKey+" meta:"+e.metaKey+" repeat:"+e.repeat;
  
 console.log(str) 
}
</script>
</body>
</html>
