<!DOCTYPE html>
<html>
<head>
	<title><?php if (isset($title)) {echo $title;} else { echo "Welcome to the Diamond Team CAD"; }?></title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" href="/css/style.css" />
	<script type="text/javascript" src="/js/json.js"></script>
	<script type="text/javascript" src="/js/forms.js"></script>
	<?php if ($needmap == 1) { ?>
	<script type="text/javascript" src="/js/map.js"></script>
	<?php } ?>
</head>
	
<?php
	function msgBox() {
		echo '<div id="msgBox">';
		if (isset($_SESSION['msgbox'])) {
			echo $_SESSION['msgbox']; 
			unset($_SESSION['msgbox']); 
		}
		echo '</div>';
		echo '<script>  var x = document.getElementById("msgBox");
		setTimeout(function(){ x.className = "show"; setTimeout(function(){x.className = x.className.replace("show", ""); }, 3000);},500);
		</script>';
	}	
?>
