<?php
include_once("inc/login.php");
include("inc/header.php");
if (checklogin() != 1) { return; }
?>

<body>
	<?php //Only display the logout link if you're already logged in
	echo logoutbutton(); 
	?>
	<center><h1>Testing dispatcher ticket functions</h1>
	<div id="addticket">
		<?php
		//This is our form to add a new ticket. This should be front and center at all times for dispatcher if possible. 
		?>
		<form class="add-new-ticket" action="/inc/submit.php" method="post">
		<input type="hidden" name="submitType" id="submitType" value="addTicket">
		New Ticket: <label for="name">Name:</label><input type="textbox" id="name" name="name">
			<label for="location">Location:</label><input type="textbox" id="location" name="location">
			<label for="incident">Incident Type:</label><select id="incident_type" name="incident_type">
			<?php 
				// Showing off php calls to the database in the middle of the HTML
				// and creating the proper format ourselves in the loop
				$sql = "SELECT * FROM incident_tbl ORDER BY id";
				$ack = $db->query($sql);
				foreach ($ack as $row) {
				echo '<option id="incident'. $row['id']. '" value="'. $row['id'] .'">'. $row['ack']. ' - '. $row['description']. '</option>';

				}
			 ?>
		</select><label for="priority">Priority:</label><select id="priority" name="priority"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>
		<label for="comments">Comments:</label><input type="textbox" id="comments" name="comments" placeholder="Comments not required">
		<button type="submit" name="submitbtn" id="submitbtn" class="submitbtn">Submit Ticket</button>
		<button type="reset" name="clear" id="clear">Clear</button>
		</form>
	</div><br /><br />
	<?php
	//This is the form to edit a previous ticket. It shouldn't need to be used that often so it doesn't need to be displayed all the time
	//If we can find a way to have it hidden, and then when a person hits the edit button it can pop over the screen that would be great
	//For now having it go here is perfectly fine.
	?>
	<div id="editTicketPopup" name="editTicketPopup" class="editTicketPopup"><form class="edit-ticket" action="/inc/submit.php" method="post">
		<input type="hidden" name="submitType" id="submitType" value="editTicket">
		Edit Ticket:
			<label for="editid">Id:</label><input type="textbox" id="editid" name="editid" readonly>
			<label for="editactive">Active:</label><select id="editactive" name="editactive"><option value="0">0</option><option value="1">1</option></select>
			<label for="editname">Name:</label><input type="textbox" id="editname" name="editname">
			<label for="editlocation">Location:</label><input type="textbox" id="editlocation" name="editlocation">
			<label for="editincident">Incident Type:</label><select id="editincident_type" name="editincident_type">
			<?php 
				// Showing off php calls to the database in the middle of the HTML
				// and creating the proper format ourselves in the loop
				$sql = "SELECT * FROM incident_tbl ORDER BY id";
				$ack = $db->query($sql);
				foreach ($ack as $row) {
				echo '<option id="incident'. $row['id']. '" value="'. $row['id'] .'">'. $row['ack']. ' - '. $row['description']. '</option>';

				}
			 ?>
		</select><label for="editpriority">Priority:</label><select id="editpriority" name="editpriority"><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>
		<label for="editambulance">Assigned Ambulance:</label><select id="editambulance" name="editambulance"><option id="editambulancex" value="0">No Assigned Ambulance</option></select>
		<label for="editcomments">Comments:</label><input type="textbox" id="editcomments" name="editcomments" placeholder="Comments not required">
		<button type="submit" name="editsubmitbtn" id="editsubmitbtn" class="editsubmitbtn">Edit Ticket</button>
		<button type="reset" name="editclose" id="editclose">Close</button>
		</form></div><br><br>
	<?php
	//We are dynamically calling the database with javascript here. It will automatically update when Show Inactive is toggled
	//In the future, it will most likely update both on a timer, as well as when data is pushed from the server telling it to update
	?>
	<div id="showold"><input type="checkbox" id="inactive" name="inactive"><label for="inactive">Show Inactive</label></div>
	<div id="ambulancetableexample"></div></center>
	<script>
		var x = document.getElementById("ambulancetableexample");
		var y = document.querySelector('input[id="inactive"]');
		var inactive = 0;
		//This is the code to get the table to update on click.
		y.addEventListener('click', (event) => {
			if(y.checked) { inactive = 1; } else {inactive = 0;}
			while (x.firstChild) {
				x.removeChild(x.firstChild);
			}
			ticketTable(x, inactive, 1);
		});
		//This is found in json.js, if it needs to be edited.
		ticketTable(x, inactive, 1);
	</script>
</body>
