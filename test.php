<?php 
// PHP allows you to include multiple files, using include, require, include_once, and require_once
// header.php handles the head info of the webpage, as well as initializes the database connection
include_once("./inc/header.php");
?>

<body>
	<h1>Welcome to the Diamond Team CAD</h1>
	<div id="main"><span>This is a js generated dropdown, client side using AJAX:</span><select name="JSONAcro" id="JSONAcro"></select></div>
	<div id="Reason"><span>This is a PHP generated dropdown, generated server side:</span>
		<select name="ACRO" id="ACRO">
			<?php 
				// Showing off php calls to the database in the middle of the HTML
				// and creating the proper format ourselves in the loop
				$sql = "SELECT * FROM incident_tbl ORDER BY id";
				$ack = $db->query($sql);
				foreach ($ack as $row) {
				echo '<option id="'. $row['id']. '">'. $row['ack']. ' - '. $row['description']. '</option>';

				}
			 ?>
		</select>
	<script>
		//This is just an example of doing asynchronous calls, or AJAX.
		//We make our own handler function to start with (this would normally be found in a separate js file)
		//We may in the future choose to use prebuilt options like JQuery to automate this stuff
		//Though we should be careful about adding extra overhead that the ambo's have to deal with.
		var getJSON = function(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', url, true);
		xhr.responseType = 'json';
		xhr.onload = function()
			{
				var status = xhr.status;
				if (status == 200) {
					callback(null, xhr.response);
				} else {
					callback(status, xhr.response);
				}
			};
		xhr.send();
		}
		var x = document.getElementById("main");
		//Now we use that function to get the data from another webpage,
		//in this case a php file that grabs data from the DB and returns it in a JSON format
		getJSON('inc/getjson.php', function(err, data) {
			if (err !== null) {
				alert('Something went wrong: ' + err);
			} else {
				var v = document.getElementById("JSONAcro");
				//This is just a simple data dump, foreach row  make a new option object.
				data.forEach(d=> v.add(new Option(d.ack+" - "+d.description, d.id)));
			}
		});
				
		//Hidden until our HTTPS support gets done
		/*function showPos(pos) {
			x.innerHTML = "Your current location is " + pos.coords.latitude + "," + pos.coords.longitude;
		}
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(showPos);
		} else {
			x.innerHTML = "Location data unavailable!";
		}*/
	</script><br/><br/><center>
	<div id="tickettableexample"><div>This is a table generated automatically from php</div>

		<?php 
		//Let's show off a couple other options for what we can do with getjson's data, starting with a ticket table
		$sql = "SELECT ticket.id, active, name, location, CONCAT(incident_tbl.ack, ' - ', incident_tbl.description) as description, priority, time, comments FROM ticket LEFT JOIN incident_tbl ON ticket.incident_type = incident_tbl.id ORDER BY time";
		//We use the database object to query the SQL url, then fetch the data using PDO's FETCH_ASSOC formatting.
		$tbl = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
		//We then make the HTML table by hand. You can do it by echo'ing the data,
		//or you can close the php brackets and write pure html, like this.
		//This is great for hardcoded information, but you might also consider auto-generating the header info
		?>
		<table>
			<thead>
				<tr>
					<th>id></th>
					<th>active</th>
					<th>name</th>
					<th>location</th>
					<th>incident type</th>
					<th>priority</th>
					<th>time</th>
					<th>comments</th>
				</tr>
			</thead>
			<tbody>
		<?php
		//Here we run through each row from the returned table
		foreach ($tbl as $row)
		{
			echo "<tr>";
			//and now, every key in that row
			foreach ($row as $val)
			{
				//and simply return the value
				echo "<td>".$val."</td>";
			}
			echo "</tr>\n";
		}
		echo "</tbody></table>";
		
		?>
	</div></center><br><br>
	<center>
	<div>This next one is another table, generated inline by javascript</div>
	<div id="ambulancetableexample"></div></center>
	<script>
		x = document.getElementById("ambulancetableexample");
		getJSON('inc/getjson.php?tbl=amb', function(err, data) {
			if (err !== null) {
				x.innerHTML = "Oops, error:" + err;
			} else {
				//The majority of this is using createelement to make the html nodes
				//It's kind of monotonous but it's just one way to generate this stuff
				//We auto-generate the header data off the JSON object's keys.
				var headdata = Object.keys(data[0]);
				var table = document.createElement('table');
				var thead = document.createElement('thead');
				var tbody = document.createElement('tbody');
				table.appendChild(thead);
				table.appendChild(tbody);
				x.appendChild(table);
				var tr = document.createElement('tr');
				thead.appendChild(tr);
				for (var i = 0; i < headdata.length; i++) {
					var td = document.createElement("th");
					td.innerHTML = headdata[i];
					tr.appendChild(td);
				}
				data.forEach(function(j) {
					//Here we're iterating through the object itself.
					//Note each one is listed as 0:{array} so we're stripping out the number first
					var tr = document.createElement("tr");
					tbody.appendChild(tr);
					for (var k in j) {
						//K is the associated key, so we use that to get the value from the arrray
						var td = document.createElement("td");
						td.innerHTML = j[k];
						tr.appendChild(td);
					}
				});
			}
		});
	</script>
</body>
</html>
