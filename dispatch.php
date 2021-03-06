<?php
    include_once("inc/login.php");
    if (checklogin() != 1) { return; }
    $needmap = 1;
	$pagename="dispatch"; 
	$initType = 2; 
	include_once("inc/header.php"); 

?>
    <div class="leftContainer">
	<div class="headerDiv sticky2">
	    <h1 class="activeTicketsHeader">Tickets: <span id="tix#">0</span>  Ambos: <span id="ambo#">0</span></h1>
            <button onclick="openNavAdd()" class="add btn btn-primary sticky3">Create New</button>
	    <div class="buttonIn">
        	<input class="searchBar" type="text" id="enter" onkeyup="searchTable()" placeholder="Search...">
        	<button class="clearButton" id="clear">clear</button>
    </div>
	</div>
        <div id="mySidenav" class="sidenavAdd">
            <div id="addticket">
                <?php
                //This is our form to add a new ticket. This should be front and center at all times for dispatcher if possible.
                ?>
                <a href="javascript:void(0)" class="closebtn" onclick="closeNavAddForce()">&times;</a>
                <form class="add-new-ticket" action="/inc/submit.php" method="post">
                    <input type="hidden" name="submitType" id="submitType" value="addTicket">
                    <center><h2 class="activeTicketsHeader">New Ticket</h2></center>
					<table id="addform">
						<tr>
							<td>
								<label for="name">Name:</label>
							</td>
						</tr>
						<tr>
							<td>
								<input type="textbox" id="name" name="name" maxlength="64" required>
							</td>
						</tr>
						<tr>
							<td>
								<label for="location">Location:</label>
							</td>
						</tr>
						<tr>
							<td>
								<input type="textbox" id="location" name="location" required>
							</td>
						</tr>
						<tr>
							<td>
								<label for="incident">Incident Type:</label>
							</td>
						</tr>
						<tr>
							<td>
								<select id="incident_type" name="incident_type" required>
			    <option value="" disabled selected>Select an Incident</option>
                            <?php
                                // Showing off php calls to the database in the middle of the HTML
                                // and creating the proper format ourselves in the loop
                                $sql = "SELECT * FROM incident_tbl ORDER BY id";
                                $ack = $db->query($sql);
                                foreach ($ack as $row) {
                                echo '<option id="incident'. $row['id']. '" value="'. $row['id'] .'">'. $row['ack']. ' - '. $row['description']. '</option>';
                                }
                             ?>
                        </select>
							</td>
						</tr>
						<tr>
							<td>
								<label for="priority">Priority:</label>
							</td>
						</tr>
						<tr>
							<td>
								<select id="priority" name="priority" required>
									<option value="" disabled selected>Select a Priority</option>
									<option value="1">1 - High/Emergency</option>
									<option value="2">2 - Medium/Urgent</option>
									<option value="3">3 - Low/Routine</option>
								</select>
							</td>
						</tr>
						<tr>
							<td>
								<label for="comments">Comments:</label>
							</td>
						</tr>
						<tr>
							<td>
								<textarea class="commentArea" id="comments" name="comments" placeholder="Comments not required" rows="8" cols="50"></textarea>
							</td>
						</tr>
						<tr>
							<td>
								<button type="submit" name="submitbtn" id="submitbtn" class="submitbtn buttons buttons-primary" onclick="closeNavAdd()">Submit Ticket</button>
								<button type="reset" name="clear" id="clear" class="buttons buttons-primary">Clear</button>
							</td>
						</tr>
					</table>
                </form>
            </div><br /><br />
		</div>
        <?php
        //This is the form to edit a previous ticket. It shouldn't need to be used that often so it doesn't need to be displayed all the time
        //If we can find a way to have it hidden, and then when a person hits the edit button it can pop over the screen that would be great
        //For now having it go here is perfectly fine.
        ?>
        <div id="mySidenavEdit" class="sidenavEdit">
            <div id="editTicketPopup" name="editTicketPopup" class="editTicketPopup">
                <a href="javascript:void(0)" class="closebtn" onclick="closeNavEdit()">&times;</a>
                <form class="edit-ticket" action="/inc/submit.php" method="post">
					<input type="hidden" name="submitType" id="submitType" value="editTicket">
					<center><h2 class="activeTicketsHeader">Edit Ticket</h2></center>
					<input type="hidden" id="editid" name="editid" readonly>
					<table id="editform">
						<tr>
							<td>
								<label for="editid" id="editidlabel">Id:</label>
							</td>
						</tr>
						<tr>
							<td>
								<label for="editactive">Active:</label>
							</td>
						</tr>
						<tr>
							<td>
								<select id="editactive" name="editactive">
									<option value="0">No</option>
									<option value="1">Yes</option>
								</select>
							</td>
						</tr>
						<tr>
							<td><label for="editname">Name:</label></td>
						</tr>
						<tr><td><input type="textbox" id="editname" name="editname" maxlength="64"></td></tr>
						<tr><td><label for="editlocation">Location:</label></td></tr>
						<tr><td><input type="textbox" id="editlocation" name="editlocation"></td></tr>
						<tr><td><label for="editincident">Incident Type:</label></td></tr>
						<tr><td><select id="editincident_type" name="editincident_type">
							<?php
								// Showing off php calls to the database in the middle of the HTML
								// and creating the proper format ourselves in the loop
								$sql = "SELECT * FROM incident_tbl ORDER BY id";
								$ack = $db->query($sql);
								foreach ($ack as $row) {
								echo '<option id="incident'. $row['id']. '" value="'. $row['id'] .'">'. $row['ack']. ' - '. $row['description']. '</option>';

								}
							 ?>
						</select></td></tr>
						<tr><td><label for="editpriority">Priority:</label></td></tr>
						<tr><td><select id="editpriority" name="editpriority">
								<option value="1">1 - High/Emergency</option>
								<option value="2">2 - Medium/Urgent</option>
								<option value="3">3 - Low/Routine</option>
							</select></td></tr>
						<tr><td><label for="editambulance">Assigned Ambulance:</label></td></tr>
						<tr><td><select id="editambulance" name="editambulance">
								<option id="editambulancex" value="0">No Assigned Ambulance</option>
							</select></td></tr>
						<tr><td><label for="editcomments">Comments:</label></td></tr>
						<tr><td><textarea class="commentArea" id="editcomments" name="editcomments" placeholder="Comments not required" rows="8" cols="50"></textarea></td></tr>
						<tr>
							<td>
								<button type="submit" name="editsubmitbtn" id="editsubmitbtn" class="editsubmitbtn buttons buttons-primary" onclick="closeNavEdit()">Edit Ticket</button>
								<button type="reset" name="editclose" id="editclose" class="buttons buttons-primary" onclick="closeNavEdit()">Close</button>
							</td>
						</tr>
					</table>
                </form>
            </div>
        </div>
            <br><br>
        <?php
        //We are dynamically calling the database with javascript here.
        //In the future, it will most likely update both on a timer, as well as when data is pushed from the server telling it to update
        ?>
        
        <div id="tickets"></div>
    </div>
<?php msgBox(); ?> 
<div id="map"></div>
</body>
</html>
