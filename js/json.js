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

//This is an intermediate step in editing a ticket.
//When a user hits the edit button, it will take the ID of that entry and get the data for it using our getJSON function
//It will then edit all of the form fields listed below, tagged with an "edit" prefix and then the column designation.
//If we choose to do anything else fancy with regards to editing tickets, you'll change it here.
var editFormPrep = function(e)
{
	e.preventDefault();
	if (e.target.submitType.value == "editTicket" && e.target.editid.value > 0)
	{
		getJSON('inc/getjson.php?tbl=editTicket&id='+e.target.editid.value, function(err, data) {
			if (err !== null) {
				alert("Error finding entry data:" + err);
			} else {
				data = data[0];
				document.getElementById("editid").value = data.id;
				document.getElementById("editactive").value = data.active;
				document.getElementById("editname").value = data.name;
				document.getElementById("editlocation").value = data.location;
				document.getElementById("editincident_type").value = data.incident_type;
				document.getElementById("editpriority").value = data.priority;
				document.getElementById("editambulance").value = data.ambulance;
				document.getElementById("editcomments").value = data.comments;
			}
		});
	}
}

//This generates the ticket table automatically for us.
//The initial use case is when you toggle the Show Inactive button, it will grab fresh data from the db using our getJSON function
//and then display it by creating a DOM table with javascript.
//The messier code at the bottom checks if it is the ID field being created, and generates two buttons alongside it, Edit and Delete
//This gives us the data in an easy format to allow the user to edit or delete information later. 
var ticketTable = function(ele, showOld)
{
	getJSON('inc/getjson.php?tbl=tkt&showinactive='+showOld, function(err, data) {
		if (err !== null) {
			ele.innerHTML = "Oops, error:" + err;
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
			ele.appendChild(table);
			var tr = document.createElement('tr');
			thead.appendChild(tr);
			for (var i = 0; i < headdata.length; i++) {
				var td = document.createElement("th");
				td.innerHTML = headdata[i];
				tr.appendChild(td);
				if(headdata[i] == "id")
				{
					td.setAttribute("colspan", 3);
				}
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
					if (k == "id")
					{
						var td2 = document.createElement("td");
						var form1 = document.createElement("form");
						form1.setAttribute("name","editform"+j[k]);
						form1.setAttribute("id","editform"+j[k]);
						form1.setAttribute("method", "post");
						form1.setAttribute("action", "inc/submit.php");
						var hid1 = document.createElement("input");
						hid1.setAttribute("type", "hidden");
						hid1.setAttribute("name", "submitType");
						hid1.setAttribute("id", "submitType");
						hid1.setAttribute("value", "editTicket");
						var hid2 = document.createElement("input");
						hid2.setAttribute("type", "hidden");
						hid2.setAttribute("name","editid");
						hid2.setAttribute("id","editid");
						hid2.setAttribute("value",j[k]);
						var btn1 = document.createElement("button");
						btn1.setAttribute("type", "submit");
						btn1.innerHTML = "Edit";
						form1.appendChild(hid1);
						form1.appendChild(hid2);
						form1.appendChild(btn1);
						td2.appendChild(form1);
						tr.appendChild(td2);
						form1.addEventListener('submit', editFormPrep);
						var td3 = document.createElement("td");
						var form2 = document.createElement("form");
						form2.setAttribute("name","deleteform"+j[k]);
						form2.setAttribute("id","deleteform"+j[k]);
						form2.setAttribute("method", "post");
						form2.setAttribute("action", "inc/submit.php");
						var hid3 = document.createElement("input");
						hid3.setAttribute("type", "hidden");
						hid3.setAttribute("name", "submitType");
						hid3.setAttribute("id", "submitType");
						hid3.setAttribute("value", "deleteTicket");
						var hid4 = document.createElement("input");
						hid4.setAttribute("type","hidden");
						hid4.setAttribute("name","deleteid");
						hid4.setAttribute("id","deleteid");
						hid4.setAttribute("value",j[k]);
						var btn2 = document.createElement("button");
						btn2.setAttribute("type", "submit");
						btn2.innerHTML = "Delete";
						form2.appendChild(hid3);
						form2.appendChild(hid4);
						form2.appendChild(btn2);
						td3.appendChild(form2);
						tr.appendChild(td3);
					}
				}
			});
		}
	});
}
