

//This is a simple new user function
//It cancels the normal form function and sends its own out
//used: admin.php
//input: e: event
var adminNewUser = function(e)
{
	e.preventDefault();
	const msgbox = document.getElementById("msgBoxPopup");
	const params = new FormData(e.target)
	doAJAX('admin.php',params, function(err, data) {
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
	const msgbox = document.getElementById("msgBoxPopup");
	doAJAX('inc/getjson.php?tbl=usr', {}, function(err, data) {
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
	const msgbox = document.getElementById("msgBoxPopup");
	const editbox = document.getElementById("EditUser");
	editbox.textContent = '';
	let lv = document.getElementById("listedUsers");
		doAJAX('inc/getjson.php?tbl=usr&usrid='+lv.value, {}, function(err, data) {
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
	const msgbox = document.getElementById("msgBoxPopup");
	const lu = document.getElementById("listedUsers");
	let confirmAction = confirm("Are you sure you want to delete user "+lu.value+"?");
	if (confirmAction) {
		const params = new FormData();
		params.append("method", "POST");
		params.append("responseType", "text");
		params.append('id', lu.value);
		params.append('submitType', 'adminDeleteUser');
		doAJAX('admin.php',params, function(err, data) {
			if (err !== null) {
				popupMessage(err);
			} else {
				popupMessage(data);
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


document.addEventListener('DOMContentLoaded', function(e) {
		var x = document.getElementById("ambulancetableexample");
		var y = document.querySelector('input[id="inactive"]');
		var inactive = 0;
		//This is the code to get the table to update on click.
		y.addEventListener('click', (event) => {
			if(y.checked) { inactive = 1; } else {inactive = 0;}
			while (x.firstChild) {
				x.removeChild(x.firstChild);
			}
			ticketTable(x, inactive);
		});
		//This is found in json.js, if it needs to be edited.
		ticketTable(x, inactive);
});