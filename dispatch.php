<?php
    include_once("inc/login.php");
    if (checklogin() != 1) { return; }
    $needmap = 1;
    include("inc/header.php");

?>
<style>
    @media screen and (max-height: 450px) {
      .sidenav {padding-top: 15px;}
      .sidenav a {font-size: 18px;}
    }
    body {
	margin: 0;
        font-family: 'Open Sans', sans-serif;
    }
    ul {
        list-style-type: none;
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
    .btn {
        display: inline-block;
        *display: inline;
        *zoom: 1;
        padding: 4px 10px 4px;
        margin-bottom: 0;
        font-size: 13px;
        line-height: 18px;
        color: #2C4E63;
        text-align: center;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
        vertical-align: middle;
        background-color: #2C4E63;
    }
    .btn:hover {
        text-decoration: none;
        background-color: #3A1F5B;
        background-position: 0 -15px;
    }
    .btn-primary {
        padding: 9px 14px;
        font-size: 15px;
        line-height: normal;
        border-radius: 5px;
        color: #ffffff;
        background-color: #2C4E63;
        border: 1px solid #FFFFFF;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.4);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.5);
    }
    .leftContainer {
        width:40%;
        height: 100%;
        padding-top: 10;
        background-color: lightgray;
    }
    .add {
        width: 90%;
        height: 50px;
	margin-left: 5%;
    }
    .sidenavAdd {
        height: 100%;
        width: 0;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        background-color: white;
        overflow-x: hidden;
        padding-top: 60px;
        border-right: 2px solid black;
        transition: 0.2s;
    }
    .sidenavAdd a:hover {
        color: #f1f1f1;
    }
    .sidenavAdd .closebtn {
        text-decoration: none;
        position: absolute;
        padding-top: 10px;
        top: 0;
        right: 25px;
        font-size: 36px;
        margin-left: 50px;
        color: black;
    }
    .add-new-ticket {
        text-align: left;
        font-family: 'Open Sans', sans-serif;
        padding-left: 6%;
    }
    .sidenavEdit {
        height: 100%;
        width: 0;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        background-color: white;
        overflow-x: hidden;
        padding-top: 60px;
        border-right: 2px solid black;
        transition: 0.2s;
    }
    .sidenavEdit a:hover {
        color: #f1f1f1;
    }
    .sidenavEdit .closebtn {
        text-decoration: none;
        position: absolute;
        top: 0;
        right: 25px;
        font-size: 36px;
        margin-left: 50px;
    }
    .edit-ticket {
        text-align: left;
        font-family: 'Open Sans', sans-serif;
        padding-left: 6%;
    }
    .buttons {
        display: inline-block;
        *display: inline;
        *zoom: 1;
        padding: 4px 10px 4px;
        margin-bottom: 0;
        font-size: 13px;
        line-height: 18px;
        color: #2C4E63;
        text-align: center;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
        vertical-align: middle;
        background-color: #2C4E63;
        width: 45%;
    }
    .buttons:hover {
        text-decoration: none;
        background-color: #3A1F5B;
        background-position: 0 -15px;
    }
    .buttons-primary {
        padding: 9px 14px;
        font-size: 15px;
        line-height: normal;
        border-radius: 5px;
        color: #ffffff;
        background-color: #2C4E63;
        border: 1px solid #FFFFFF;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.4);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.5);
    }
    .rightContainer {
        width:70%;
        height:100%;
    }
    input {
        width: 90%;
        margin-bottom: 10px;
        background: rgba(0,0,0,0.3);
        border: none;
        outline: none;
        padding: 10px;
        font-size: 13px;
        color: #fff;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
        border: 1px solid rgba(0,0,0,0.3);
        border-radius: 4px;
        box-shadow: inset 0 -5px 45px rgba(100,100,100,0.2), 0 1px 1px rgba(255,255,255,0.2);
    }
    #map {
	    position: absolute;
	    top: 54px;
	    right: 0;
	    width: 59%;
	    height: 100%;
    }
    .edButton {
        display: inline-block;
        *display: inline;
        *zoom: 1;
        padding: 4px 10px 4px;
        margin-bottom: 0;
        font-size: 13px;
        line-height: 18px;
        color: #2C4E63;
        text-align: center;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
        vertical-align: middle;
        background-color: #2C4E63;
        width: 70px;
    }
    .edButton:hover {
        text-decoration: none;
        background-color: #3A1F5B;
        background-position: 0 -15px;
    }
    .edButton-primary {
        padding: 9px 14px;
        font-size: 15px;
        line-height: normal;
        border-radius: 5px;
        color: #ffffff;
        background-color: #2C4E63;
        border: 1px solid #FFFFFF;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.4);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.5);
    }
</style>
<body onload="loadInit(2);">
    <nav class="sticky">
        <ul>
          <li style="background-color:black">Diamond Dispatch</li>
          <li>Add Ticket</li>
          <li>Edit Ticket</li>
          <li class="logoutbutn">
              <a class="active">
                  <?php
                  echo logoutbutton();
                  ?>
              </a>
          </li>
        </ul>
    </nav>
    <div class="leftContainer">
        <center><h1>Active Tickets</h1></center>
        <button onclick="openNavAdd()" class="add btn btn-primary">Create New</button>
        <div id="mySidenav" class="sidenavAdd">
            <div id="addticket">
                <?php
                //This is our form to add a new ticket. This should be front and center at all times for dispatcher if possible.
                ?>
                <a href="javascript:void(0)" class="closebtn" onclick="closeNavAdd()">&times;</a>
                <form class="add-new-ticket" action="/inc/submit.php" method="post">
                    <input type="hidden" name="submitType" id="submitType" value="addTicket">
                    <center><h2>New Ticket</h2></center>
                    <br>
                    <label for="name">Name:</label>
                        <input type="textbox" id="name" name="name">
                    <br>
                    <label for="location">Location:</label>
                        <input type="textbox" id="location" name="location">
                    <br>
                    <label for="incident">Incident Type:</label>
                        <select id="incident_type" name="incident_type">
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
                    <br>
                    <label for="priority">Priority:</label>
                        <select id="priority" name="priority">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    <br>
                    <label for="comments">Comments:</label>
                        <input type="textbox" id="comments" name="comments" placeholder="Comments not required">
                    <button type="submit" name="submitbtn" id="submitbtn" class="submitbtn buttons buttons-primary" onclick="closeNavAdd()">Submit Ticket</button>
                    <button type="reset" name="clear" id="clear" class="buttons buttons-primary">Clear</button>
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
                    <center><h2>Edit Ticket</h2></center>
                    <label for="editid">Id:</label>
                        <br>
                        <input type="textbox" id="editid" name="editid" readonly>
                    <label for="editactive">Active:</label>
                        <select id="editactive" name="editactive">
                            <option value="0">No</option>
                            <option value="1">Yes</option>
                        </select>
                        <br>
                    <label for="editname">Name:</label>
                        <input type="textbox" id="editname" name="editname">
                    <label for="editlocation">Location:</label>
                        <input type="textbox" id="editlocation" name="editlocation">
                    <label for="editincident">Incident Type:</label>
                    <select id="editincident_type" name="editincident_type">
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
                    <br>
                    <label for="editpriority">Priority:</label>
                        <select id="editpriority" name="editpriority">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    <br>
                    <label for="editambulance">Assigned Ambulance:</label>
                        <select id="editambulance" name="editambulance">
                            <option id="editambulancex" value="0">No Assigned Ambulance</option>
                        </select>
                    <br>
                    <label for="editcomments">Comments:</label>
                        <input type="textbox" id="editcomments" name="editcomments" placeholder="Comments not required">
                    <button type="submit" name="editsubmitbtn" id="editsubmitbtn" class="editsubmitbtn buttons buttons-primary" onclick="closeNavEdit()">Edit Ticket</button>
                    <button type="reset" name="editclose" id="editclose" class="buttons buttons-primary" onclick="closeNavEdit()">Close</button>
                </form>
            </div>
        </div>
            <br><br>
        <?php
        //We are dynamically calling the database with javascript here. It will automatically update when Show Inactive is toggled
        //In the future, it will most likely update both on a timer, as well as when data is pushed from the server telling it to update
        ?>
        <div id="showold">
            <input type="checkbox" id="inactive" name="inactive">
                <label for="inactive">Show Inactive</label>
            </input>
        </div>
        <div id="ambulancetableexample"></div></center>
    </div>
<div id="map"></div>
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
		
	function areYouSure() {
	  confirm("Are you sure you want to delete?");
	}
        
        function openNavAdd() {
          document.getElementById("mySidenav").style.width = "31%";
        }
        /* Set the width of the side navigation to 0 */
        function closeNavAdd() {
          document.getElementById("mySidenav").style.width = "0";
        }
        
        function openNavEdit() {
          document.getElementById("mySidenavEdit").style.width = "31%";
        }
        /* Set the width of the side navigation to 0 */
        function closeNavEdit() {
          document.getElementById("mySidenavEdit").style.width = "0";
        }
	</script>
</body>
