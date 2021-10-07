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

var postJSON = function(url, params, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('post', url, true);
	xhr.onload = function()
		{
			var status = xhr.status;
			if (status == 200) {
				callback(null, xhr.response);
			} else {
				callback(status, xhr.response);
			}
		};
	xhr.send(params);
}

var testFetch = function(url, params) {
	fetch(url).then(response => {
		if (response.ok){
			return response.json();
		}else{
			return Promise.reject(response.status);
		}
	}).then(response => console.log(response)).catch(err => console.log('Error with message: ${err}'));
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
		if(headdata[i] == "id" ** addEditData === 1)
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

var amboInfo = function(ele)
{
	getJSON('inc/getjson.php?tbl=curAmbo', function(err, data){
		if (err !== null) {
			ele.innerHTML = "Oops, error:" + err;
		} else {
			createJSTable(ele, data, 0);
		}
	});
}

var loginsubmit = function(e)
{
	e.preventDefault();
	const msgbox = document.getElementById("msgBox");
	const params = new FormData(e.target)
	postJSON('inc/login.php',params, function(err, data) {
		if (err !== null) {
			msgbox.innerHTML = err;
		} else {
			if (data == "Success!") {
				msgbox.innerHTML = data;
				location.href = "index.php";
				window.location.reload(true);
			} else {
				msgbox.innerHTML = data;
			}
		}
	});
}

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

var adminEditUser = function(e)
{
	e.preventDefault();
	const msgbox = document.getElementById("msgBox");
	const editbox = document.getElementById("editUser");
	let lv = document.getElementById("listedUsers");
		getJSON('inc/getjson.php?tbl=usr&usrid='+lv.value, function(err, data) {
		if (err !== null) {
			msgBox.innerHTML = err;
		} else {
			lv.textContent = '';
			console.log(data[0]);
			var frm = document.createElement("form");
			frm.setAttribute("method", "POST");
			frm.setAttribute("action", "admin.php");
			frm.setAttribute("id", "EditUser");
			var submittype = document.createElement("input");
			submittype.setAttribute("type", "hidden");
			submittype.setAttribute("value", "adminEditUser");
			frm.appendChild(submittype);
			data.forEach(function(j) {
				for (var k in j)
				{
					var lbl = document.createElement("label");
					lbl.setAttribute("for", k);
					var inp = document.createElement("input");
					inp.setAttribute("id", k);
					inp.setAttribute("name", k);
					inp.setAttribute("type", "textbox");
					inp.setAttribute("value", j[k]);
					frm.appendChild(lbl);
					frm.appendChild(inp);
				}
			});
		}
	});
}

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
