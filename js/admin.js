

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
	document.getElementById("ListUsers").classList.remove("show");
	document.getElementById("EditUser").classList.add("show");
	const msgbox = document.getElementById("msgBoxPopup");
	const editbox = document.getElementById("EditUser");
	editbox.textContent = '';
	let lv = document.getElementById("listedUsers");
		doAJAX('inc/getjson.php?tbl=usr&usrid='+lv.value, {}, function(err, data) {
		if (err !== null) {
			msgBox.innerHTML = err;
		} else {
			var h2 = document.createElement("h2");
			editbox.appendChild(h2);
			h2.innerHTML = "Editing user "+data[0]['name'];
			var frm = document.createElement("form");
			frm.setAttribute("method", "POST");
			frm.setAttribute("action", "admin.php");
			frm.setAttribute("id", "EditUserForm");
			var submittype = document.createElement("input");
			submittype.setAttribute("type", "hidden");
			submittype.setAttribute("name", "submitType");
			submittype.setAttribute("id", "submitType");
			submittype.setAttribute("value", "adminEditUser");
			frm.appendChild(submittype);
			var table = document.createElement("table");
			data.forEach(function(j) {
				for (var k in j)
				{
					var tr = document.createElement("tr");
					var td1 = document.createElement("td");
					var td2 = document.createElement("td");
					if (k == "user_type") {
						td1.innerHTML = "User Type:";
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
						td2.appendChild(sel);
					} else {
						var inp = document.createElement("input");
						inp.setAttribute("id", k);
						inp.setAttribute("name", k);
						inp.setAttribute("type", "hidden");						
						inp.setAttribute("value", j[k]);
						if (k == "pass") {
							inp.setAttribute("id", k+"edit");
							inp.setAttribute("name", k+"edit");
							inp.setAttribute("type", "password");
							inp.setAttribute("placeholder", "Leave blank to keep same");
						}
						if (k != "id") {
							var lbl = document.createElement("label");
							lbl.setAttribute("for", k);
							lbl.innerHTML = k+":"
							if (k != "pass") { inp.setAttribute("type", "textbox"); }
							td1.appendChild(lbl);
						}
						td2.appendChild(inp);
						if (k == "pass") {
							var inp2 = document.createElement("input");
							inp2.setAttribute("id", k+"edit2");
							inp2.setAttribute("name", k+"edit2");
							inp2.setAttribute("type", "password");
							inp2.setAttribute("placeholder", "Enter twice to change");
							td2.appendChild(inp2);
						}
					}
					tr.appendChild(td1);
					tr.appendChild(td2);
					table.appendChild(tr);
				}
			});
			frm.appendChild(table);
			var sbm = document.createElement("input");
			sbm.setAttribute("type", "submit");
			sbm.setAttribute("id", "usrEditSubmit");
			sbm.setAttribute("value", "Submit");
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
					adminListUsers(new CustomEvent('aa'));
					editbox.textContent = '';
				});
			});
			frm.appendChild(sbm);
			var clr = document.createElement("button");
			clr.setAttribute("type", "reset");
			clr.setAttribute("id", "usrEditClear");
			clr.setAttribute("value", "Clear");
			clr.addEventListener("click", function(e) {
				e.preventDefault(); 
				editbox.textContent='';
				document.getElementById("EditUser").classList.remove("show");				
			});
			clr.innerHTML = "Clear";
			frm.appendChild(clr);
			editbox.appendChild(frm);
			document.getElementById("passedit2").addEventListener("focusout", doPassCheck, this);
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
	let confirmAction = confirm("Are you sure you want to delete user "+lu.value+": "+lu.selectedOptions[0].label+"?");
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
			adminListUsers(new CustomEvent('aa'));
			document.getElementById("ListUsers").classList.remove("show");			
		});
	} else {
		msgbox.innerHTML = "Deletion cancelled";
	}
}

//This is a password check function, this compares the two text boxes and gives a notice
function doPassCheck(t) {
	let r = 'pass';
	if (t.id = 'passedit2') { r = 'passedit'; t = document.getElementById('passedit2'); }
	const s = document.getElementById(r);
	if (t.value == '') {
		t.setCustomValidity('');
		t.style.backgroundColor = "";
	} else if (s && t.value != s.value && t.value != '')
	{
		t.style.backgroundColor = "rgba(255,0,0,0.3)";
		t.setCustomValidity('Passwords must match!');
	} else {
		t.setCustomValidity('');
		t.style.backgroundColor = "";
	}
	t.reportValidity();	
}

function ShowCont(){
  var x = document.getElementById("AddForm");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
  }
}

var reloadid = 0;
document.addEventListener('DOMContentLoaded', function(e) {
		var ele = document.getElementById("admintablecontainer");
		document.onclick= function(e){
			e=window.event? event.srcElement: e.target;const x = e.closest('.markerZoom'); 
			if (x) {
				reloadid = x.id;
				//map.zoomOnMarker(x.getAttribute("id"));
				var j = document.getElementsByClassName("inner_row");
				for (let i = 0; i < j.length; i++) {
					if (j[i].getAttribute("src") != x.id) {
						j[i].classList.add("hidden");
					}
					if (j[i].classList.contains("header") && x.lastElementChild.classList.contains("hidden")) {
						j[i].classList.remove("hidden");
					}
				}
				if (x.firstElementChild.nextElementSibling != x.lastElementChild) {
					x.firstElementChild.nextElementSibling.classList.toggle("hidden");
				}
				x.lastElementChild.classList.toggle("hidden");
			}
		}
		var search = document.getElementById("search");
		search.addEventListener("submit", function(e) {
			e.preventDefault();
			ele.tableconfig.url = 'inc/getjson.php?tbl=admintkt';
			const qrst = new FormData(e.target);
			var tmptc = '';
			var tmptco = '';
			for (var v of qrst.entries()) {
				if (v[1]) {
					if (v[0] == 'timeCreated') {
						tmptc = v[1];
					}
					if (v[0] == 'timeCompleted') {
						tmptco = v[1];
					}
					if (v[0] == 'timeCreatedRange')
					{
						let tmp = tmptc.split(":");
						tmp[0] = parseInt(tmp[0],10)+parseInt(v[1],10);
						v[1] = tmp.join(":");
					}
					if (v[0] == 'timeCompletedRange')
					{
						let tmp = tmptco.split(":");
						tmp[0] = parseInt(tmp[0],10)+parseInt(v[1],10);
						v[1] = tmp.join(":");
					}
					ele.tableconfig.url += '&'+v[0]+'='+v[1];
				}
			}
			doAJAX(ele.tableconfig.url, ele.tableconfig, function(err, data){
				if (err !== null) {
					ele.innerHTML = "Oops, error:" + err;
					if (popupMessage) { popupMessage("Error: " + err); }
				} else {
					search.reset();
					ele.tabledata = data;
					ele.innerHTML = '';
					if (data !== null) { createJSTable(ele, ele.tabledata, ele.tableconfig); }
				}
			});
			let x = document.getElementById("searchOptions");
			x.classList.remove("show");
		});
		/*var y = document.querySelector('input[id="inactive"]');
		//This is the code to get the table to update on click.
		y.addEventListener('click', (event) => {
			if(y.checked) { ele.tableconfig.inactive = 1; } else {ele.tableconfig.inactive = 0;}
			while (ele.firstChild) {
				ele.removeChild(ele.firstChild);
			}
			createJSTable(ele, ele.tabledata, ele.tableconfig);
		});*/
		const html = document.getElementsByTagName("html")[0].dataset;
		let config = new Object();
		config.method = "get";
		config.responseType = "json";
		config.url = 'inc/getjson.php?tbl=admintkt';
		config.addEditData = 0;
		config.createTable = true;
		config.createHeader = true;
		config.tableID = "admintable";
		config.dataMask = ["name", "location", "incident_type", "ambulance"];
		config.dataMask2nd = ["priorityText","time", "incident_description", "dispatcher"];
		config.addComments = true;
		config.addEditData = 1;
		ele.innerHTML = '';
		ele.tableconfig = config;
		doAJAX(ele.tableconfig.url, ele.tableconfig, function(err, data){
			if (err !== null) {
				ele.innerHTML = "Oops, error:" + err;
				if (popupMessage) { popupMessage("Error: " + err); }
			} else if (data !== null) {
				ele.tabledata = data;
				createJSTable(ele, ele.tabledata, ele.tableconfig);
			}
		});
		let dCrO = new Object();
		dCrO.dateFormat = 'Y-m-d';
		dCrO.altFormat = 'm/d/Y';
		dCrO.altInput = true;
		dCrO.altInputClass = "";
		dCrO.allowInput = false;
		//dCrO.appendTo = null;
		dCrO.ariaDateFormat = 'F j, Y';
		dCrO.clickOpens = true;
		//dCrO.defaultDate = null;
		dCrO.defaultHour = 12;
		dCrO.defaultMinute = 0;
		dCrO.minDate = "2021-07-20";
		dCrO.maxDate = new Date().toISOString().slice(0,10);
		//dCrO.disable = null;
		dCrO.disableMobile = false;
		dCrO.enabl = [];
		dCrO.enableTime = false;
		dCrO.enableSeconds = false;
		//dCrO.formatDate = null;
		dCrO.hourIncrement = 1;
		dCrO.inline = false;
		dCrO.shorthandCurrentMonth = false;
		dCrO.minuteIncrement = 5;
		dCrO.mode = 'range';
		dCrO.prevArrow = '&lt;';
		dCrO.nextArrow = '&gt;';
		dCrO.parseDate = false;
		dCrO.static = false;
		dCrO.time_24hr = false;
		dCrO.weekNumbers = true;
		dCrO.noCalendar = false;
		dCrO.onChange = null;
		dCrO.onClose = null;
		dCrO.onOpen = null;
		dCrO.onReady = null;
		var dCr = flatpickr("#dateCreated", dCrO);
		var dCo = flatpickr("#dateCompleted", dCrO);
		let dCrO2 = new Object();
		dCrO2.dateFormat = 'H:i';
		dCrO2.mode = 'single';
		dCrO2.noCalendar = true;
		dCrO2.enableTime = true;
		var tCr = flatpickr("#timeCreated", dCrO2);
		var tCo = flatpickr("#timeCompleted", dCrO2);
		//This is found in json.js, if it needs to be edited.
});
function closed(e) {
	e.preventDefault();
	document.getElementById("AddUser").classList.remove("show");
	document.getElementById("ListUsers").classList.remove("show");
	document.getElementById("EditUser").classList.remove("show");
}				   
