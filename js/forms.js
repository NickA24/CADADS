// This javascript file contains all functions that are related to the creation, editing, and posting of form data for our program

//This is an intermediate step in editing a dispatch ticket.
//When a user hits the edit button, it will take the ID of that entry and get the data for it using our getJSON function
//It will then edit all of the form fields listed below, tagged with an "edit" prefix and then the column designation.
//If we choose to do anything else fancy with regards to editing tickets, you'll change it here.
//Used: dispatch.php
//Input: e: form submission event
var editFormPrep = function(e)
{
	e.preventDefault();
	if (e.target.submitType.value == "editTicket" && e.target.editid.value > 0)
	{
		getJSON('inc/getjson.php?tbl=editTicket&returnAmbo=1&id='+e.target.editid.value, function(err, data) {
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
				document.getElementById("editcomments").value = data.comments;
				const a = document.getElementById("editambulance");
				while (a.firstChild) {
				  a.removeChild(a.firstChild);
				}
				if (data.ambulance) {
					if (typeof data.ambulance == "number") {
						a.appendChild(new Option("Unable to be edited", data.ambulance, true));
						a.disabled = true;
					} else {
						a.disabled = false;
						data.ambulance.forEach(function(j){
							let n = j.name;
							if (j.assigned) { n += " - Assigned Ambo"; }
							let opt = new Option(n, j.id, j.assigned);
							a.appendChild(opt);
						});
					}
				} else {
					a.appendChild(new Option("No Ambulances Available", 0, 1));	
				}
			}
		});
	}
}

//This is a more all-purpose function to create a table display
//Used: dispatch.php, ambulance.php, admin.php
//It accepts 3 inputs:
//ele: an HTML element to be used for displaying the table
//data: this is JSON data, probably returned from getjson.php
//addEditData: boolean value. 1(true): specifically for displaying multiple tickets, it will use colspan:3
//This allows one table header to cover the three table columns of id, edit, and delete.
var createJSTable = function(ele, data, addEditData)
{
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
		if(headdata[i] == "id" && addEditData === 1)
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
			if (k == "id" && addEditData === 1)
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

//This generates the ticket table automatically for us.
//The initial use case is when you toggle the Show Inactive button, it will grab fresh data from the db using our getJSON function
//and then display it by creating a DOM table with javascript.
//The messier code at the bottom checks if it is the ID field being created, and generates two buttons alongside it, Edit and Delete
//This gives us the data in an easy format to allow the user to edit or delete information later.
//Used: dispatch.php, admin.php
//Inputs: ele: Document element to display table in
//showOld: Boolean. Toggles whether to show inactive data as well
//edit: Boolean. Toggles whether to combine the ID column into 3 columns. Read createJSTable for more info.
var ticketTable = function(ele, showOld, edit)
{
	getJSON('inc/getjson.php?tbl=tkt&showinactive='+showOld, function(err, data) {
		if (err !== null) {
			ele.innerHTML = "Oops, error:" + err;
		} else {
			var p = 0;
			if (edit === 1) { p = 1; }
			createJSTable(ele, data, p);
		}
	});
}

//This displays the current data for the logged-in ambulance user.
//Note the map.testfunc() runs the initial google map script. We should change this later, probably.
//Used: ambulance.php
//input: ele: document element to put table info into.
var amboInfo = function(ele)
{
	getJSON('inc/getjson.php?tbl=curAmbo', function(err, data){
		if (err !== null) {
			ele.innerHTML = "Oops, error:" + err;
		} else {
			ele.data = data[0];
			if (map.init)
			{
				let dest = ele.data.ticket_location;
				if (dest == false || dest == null || dest == '' || dest == 0) { dest = ele.data.ambulance_location; }
				map.setDirections(ele.data.ambulance_location, dest);
				map.testfunc();
			}
			createJSTable(ele, data, 0);
		}
	});
}


//This is a simple new user function
//It cancels the normal form function and sends its own out
//used: admin.php
//input: e: event
var adminNewUser = function(e)
{
	e.preventDefault();
	const msgbox = document.getElementById("msgBox");
	const params = new FormData(e.target)
	postJSON('admin.php',params, function(err, data) {
		if (err !== null) {
			msgbox.innerHTML = err;
		} else {
			msgbox.innerHTML = data;
		}
	});
}

//This is called when we push the list button
//This grabs all user names and puts them into a SELECT element,
//letting us choose which one to edit or delete.
//used: admin.php
//input: e: event
var adminListUsers = function(e)
{
	e.preventDefault();
	const msgbox = document.getElementById("msgBox");
	getJSON('inc/getjson.php?tbl=usr', function(err, data) {
		if (err !== null) {
			msgBox.innerHTML = err;
		} else {
			let lv = document.getElementById("listedUsers");
			lv.textContent = '';
			data.forEach(function(j) {
				var typ = "Dispatch";
				if (j['user_type']==2) {typ = "Ambulance";}
				if (j['user_type']==3) {typ = "Admin";}
				var usr = new Option(j["name"]+"-"+typ, j['id']);
				lv.appendChild(usr);
			});
		}
	});
	
}

//This function creates the form used to edit the user's data.
//It grabs the user's data from the SQL and puts it into the form
//based on the user's ID from the list.
//used: admin.php
//input: e: event
var adminEditUser = function(e)
{
	e.preventDefault();
	const msgbox = document.getElementById("msgBox");
	const editbox = document.getElementById("EditUser");
	editbox.textContent = '';
	let lv = document.getElementById("listedUsers");
		getJSON('inc/getjson.php?tbl=usr&usrid='+lv.value, function(err, data) {
		if (err !== null) {
			msgBox.innerHTML = err;
		} else {
			lv.textContent = '';
			var h2 = document.createElement("h2");
			editbox.appendChild(h2);
			h2.innerHTML = "Editing user "+data[0]['name'];
			var frm = document.createElement("form");
			frm.setAttribute("method", "POST");
			frm.setAttribute("action", "admin.php");
			frm.setAttribute("id", "EditUser");
			var submittype = document.createElement("input");
			submittype.setAttribute("type", "hidden");
			submittype.setAttribute("name", "submitType");
			submittype.setAttribute("id", "submitType");
			submittype.setAttribute("value", "adminEditUser");
			frm.appendChild(submittype);
			data.forEach(function(j) {
				for (var k in j)
				{
					if (k == "user_type") {
						
						var sel = document.createElement("select");
						sel.setAttribute("name", "user_type");
						sel.setAttribute("id", "user_type");
						
						var opt1 = new Option("Dispatch", 1, false);
						var opt2 = new Option("Ambulance", 2, false);
						var opt3 = new Option("Admin", 3, false);
						switch(j[k]) {
							case 1:
								opt1.selected=true;
								break;
							case 2:
								opt2.selected=true;
								break;
							case 3:
								opt3.selected=true;
								break;
						}
						sel.appendChild(opt1);
						sel.appendChild(opt2);
						sel.appendChild(opt3);
						frm.appendChild(sel);
						
					} else {
						var inp = document.createElement("input");
						inp.setAttribute("id", k);
						inp.setAttribute("name", k);
						inp.setAttribute("type", "hidden");						
						inp.setAttribute("value", j[k]);
						if (k == "pass") {
							inp.setAttribute("placeholder", "Leave blank to keep same");
						}
						if (k != "id") {
							var lbl = document.createElement("label");
							lbl.setAttribute("for", k);
							lbl.innerHTML = k+":"
							inp.setAttribute("type", "textbox");
							frm.appendChild(lbl);
						}
						frm.appendChild(inp);
					}
				}
			});
			var sbm = document.createElement("input");
			sbm.setAttribute("type", "submit");
			sbm.setAttribute("id", "usrEditSubmit");
			sbm.setAttribute("value", "submit");
			sbm.addEventListener("submit", function(e) {
				e.preventDefault();
				let formData = new FormData(frm);
				postJSON('admin.php',params, function(err, data) {
					if (err !== null) {
						msgbox.innerHTML = err;
					} else {
						console.log(data);
						msgbox.innerHTML = data;
					}
					lv.textContent = '';
					editbox.textContent = '';
				});
			});
			frm.appendChild(sbm);
			var clr = document.createElement("button");
			clr.setAttribute("type", "reset");
			clr.setAttribute("id", "usrEditClear");
			clr.setAttribute("value", "Clear");
			clr.addEventListener("click", function(e) {e.preventDefault(); editbox.textContent=''; });
			clr.innerHTML = "Clear";
			frm.appendChild(clr);
			editbox.appendChild(frm);
		}
	});
}

//This function asks the user for confirmation that the user ID will be deleted
//Used: admin.php
//Input: e: event
var adminDeleteUsers = function(e)
{
	e.preventDefault();
	const msgbox = document.getElementById("msgBox");
	let confirmAction = confirm("Are you sure you want to delete this user?");
	if (confirmAction) {
		const params = new FormData();
		params.append('id', document.getElementById("listedUsers").value);
		params.append('submitType', 'adminDeleteUser');
		postJSON('admin.php',params, function(err, data) {
			if (err !== null) {
				msgbox.innerHTML = err;
			} else {
				console.log(data);
				msgbox.innerHTML = data;
			}
			let lv = document.getElementById("listedUsers");
			lv.textContent = '';
		});
	} else {
		msgbox.innerHTML = "Deletion cancelled";
	}
}

//This is a password check function, this compares the two text boxes and gives a notice
var doPassCheck = function(t) {
	if (t.value == '') {
		t.setCustomValidity('');
		t.style.backgroundColor = "";
	} else if (t.value != document.getElementById('pass').value && t.value != '')
	{
		t.style.backgroundColor = "rgba(255,0,0,0.3)";
		t.setCustomValidity('Passwords must match!');
	} else {
		t.setCustomValidity('');
		t.style.backgroundColor = "";
	}
	t.reportValidity();	
}
