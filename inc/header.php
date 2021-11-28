<?php
	//Function calls:
	//Create a message box that will give us information between pages or show us popup info.
	function msgBox() {
		echo '<div id="msgBoxPopup">';
		if (isset($_SESSION['msgbox'])) {
			echo $_SESSION['msgbox']; 
			unset($_SESSION['msgbox']); 
		}
		echo '</div>';
		//Javascript for this div is contained in the msgbox.js file
	}
	$ambostatuses = ['Out of Service', 'Available', 'Enroute', 'Unavailable'];
	
	//If there is no needmap variable, create one and set it to 0.
	if (!isset($needmap)) {$needmap = 0;} 
?>
<!DOCTYPE html>
<html lang="en-US" <?php 
//Put some variables into the html tag, to make them easily accessible from javascript later.
if (isset($_SESSION['myusername'])) { echo 'data-username="'.$_SESSION['myusername'].'" '; }
if (isset($initType)) { echo 'data-initType="'.$initType.'" '; } 
if (isset($_SESSION['preferred_map'])) { echo 'data-preferred-map="'.htmlspecialchars($_SESSION['preferred_map']).'"'; }
if (isset($ticketID)) { echo 'data-ticketID="'.$ticketID.'" '; }
?>>
<head>
	<title><?php if (isset($title)) {echo $title;} else { echo "Welcome to the Diamond Team CAD"; }?></title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="stylesheet" defer href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" defer type="text/css" href="/css/style.css" />
	<?php 
	//If we have a pagename variable set, return the unique CSS and JS for those pages.
	if (isset($pagename)) { ?>
<link rel="stylesheet" defer type="text/css" href="/css/<?php echo $pagename; ?>.css" />
	<script type="text/javascript" src="/js/<?php echo $pagename; ?>.js"></script>
	<script type="text/javascript" src="/js/json.js"></script>
	<?php if (isset($pagename) && $pagename != 'loginform') { ?>
	<script type="text/javascript" src="/js/stickymenu.js"></script>
	<script defer type="text/javascript" src="/js/msgbox.js"></script>
	<script type="text/javascript" src="/js/forms.js"></script>
	<?php } }
		//Only if we need the google map stuff should we include it, as it's a lot of extra code pulled from google's server.
		if ($needmap == 1) { ?>
<script type="text/javascript" src="/js/map.js"></script>
	<?php } 
	
		//flatpickr found at https://github.com/flatpickr/flatpickr by chmln
		if (checklogin() == 3) { ?>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
	<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
	
		<?php } ?>
</head>
<body>
<?php 
//Only show the top bar on pages you have to be logged in to see
if (checklogin()) { ?>
<nav class="sticky">
	<ul>
		<li><a href="..">Diamond Dispatch: <?php echo $_SESSION['myusername']; if (checklogin() == 2) { echo " - ", $ambostatuses[$_SESSION['status']]; } ?></a></li>
		<?php 
		//If this is an ambulance, do ambulance things
		if (checklogin() == 3) { ?>
		<li class="dropbtnAdmin" id="dropbtnAdminList">User Menu <i class="fa fa-caret-down dropbtnAdmin"></i>
			<div class="dropdownAdmin-content" id="myDropdownAdmin">
				<a id="adminAdd" class="adminFn" data-x="0" src="#">Add User</a>
				<a id="adminEdit" class="adminFn" data-x="1" src="#">Edit User</a>
				<a id="adminDelete" class="adminFn" data-x="2" src="#">Delete user</a>
			</div>
		</li>
		<li><a href="#" class="search fa fa-search" id="searchlink"> Search</a></li>
		<?php
		}
		if (checklogin() == 2) { ?>
<li class="dropbtn" id="dropbtnList">Change Status <i class="fa fa-caret-down dropbtn"></i>
			<div class="dropdown-content" id="myDropdown">
				<a id="status1" class="service" data="0" src="#">Out of Service</a>
				<a id="status1" class="service" data="1" src="#">Available</a>
				<a id="status2" class="service" data="2" src="#">Enroute to Call</a>
				<a id="status3" class="service" data="3" src="#">Unavailable</a>
				<?php
				$result = $db->query("SELECT id, name FROM hospitals ORDER BY id")->fetchAll();
				foreach($result as $r) {
						echo '<a id="statusH'.$r['id'].'" class="service" data="'.($r['id']+3).'" src="#">Enroute to '.$r['name']."</a>\n";
						if ($result[count($result)-1]['id'] != $r['id']) { echo "\t\t\t\t"; }
				}
			?>
			</div>
		</li>
		<?php }
		if (checklogin() != 3) {
		?>
<li class="dropbtnMap" id="dropbtnMapList">Map Style <i class="fa fa-caret-down dropbtnMap"></i>
			<div class="dropdownMap-content" id="myDropdownMap">
				<?php
				$result = $db->query("SELECT id, name, style FROM map_styles ORDER BY id")->fetchAll();
				foreach($result as $r) {
					echo '<a id="mapStyle'.$r['id'].'" class="mapStyle';
					if ($r['style'] == $_SESSION['preferred_map']) { echo " selected"; }
					echo '" data="'.$r['id'].'" src="#">'.$r['name']."</a>\n";
					if ($result[count($result)-1]['id'] != $r['id']) { echo "\t\t\t\t"; }
				}
				?>
			</div>
		</li>
		<?php } ?>
		<li class="logoutbutn">
			<a class="active">
			<?php
			echo "\t", logoutbutton();
			?>
			
			</a>
		</li>
	</ul>
</nav>
<?php } ?>

