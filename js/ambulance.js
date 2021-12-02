
//A single geolocation var just to make it easy on ourselves.
var loc;
//A single audio variable as well
var notif = new Audio('./sound/notif.wav');


//Hotkeys for the page. Will use later to do automatic ambulance status updates
function amboShortcuts(e) {
    var str = "You have pressed a button. Press info: "+e.code+" alt:"+e.altKey+" shift:"+e.shiftKey+" ctrl:"+e.ctrlKey+" meta:"+e.metaKey+" repeat:"+e.repeat;
    console.log(str); 
}

function amboService(stat) {
	const ele = document.getElementById("curCall");
	document.getElementById("id").value = ele.tabledata.id;
	if (stat < 4) {
		document.getElementById("submitType").value = 'ambostat';
		document.getElementById("status").value = stat;
	} else {
		document.getElementById("submitType").value = 'en2Hosp';
		document.getElementById("hospid").value = stat-3;
	}
	document.getElementById("statusSubmit").submit();
}

//This initializes the current data for the logged-in ambulance user.
var amboInit = function()
{
	let ele = document.getElementById("curCall");
	const params = new Object();
	params.method = "get";
	params.responseType = "json";
	let url = 'inc/getjson.php?tbl=curAmbo';
	if (ele.pos && ele.pos.latitude && ele.pos.longitude)
	{
		url += "&lat="+ele.pos.latitude+"&lng="+ele.pos.longitude;
	}
	doAJAX(url, params, function(err, data){
		if (err !== null) {
			ele.innerHTML = "Oops, error:" + err;
			if (popupMessage) { popupMessage("Error: " + err); }
		} else if (data !== null) {
			ele.data = data['dispatchMap'];
			ele.tabledata = Object.assign({}, data['curAmbo'][0]);
			let config = new Object();
			data = data['curAmbo'];
			ele.tabledata.id = data[0].ticket_id;
			ele.tabledata.ticket_id = data[0].id;
			const html = document.getElementsByTagName("html")[0].dataset;
			let paramx = new Object();
			paramx.initType = html.inittype;
			paramx.preferredMap = html.preferredMap;
			paramx.ticketId = 0;
			paramx.id = ele.tabledata.id;
			ele.tabledata.username = html.username;
			paramx.ele = "curCall";
			ele.callback = ambosetupCallback;
			if (!map.init) { 
				loadInit(paramx); 
			}
			config.newTicket = false;
			if (data[0].ticket_id > 0)
			{
				config.newTicket = true;
			}
			config.addEditData = 0;
			config.createTable = true;
			config.createHeader = true;
			config.createBody = true;
			config.bodyID = "ambobody";
			config.dataMask = ["name", "incident_type", "location", "destination", "priorityText"];
			config.dataMask2nd = ["status", "incident_description", "time", "lastupdate"];
			config.addComments = true;
			ele.innerHTML = '';
			createJSTable(ele, [ele.tabledata], config);
			ele.tableconfig = config;
			ele.dataconfig = paramx;
		}
	});
}

//This continues to update the map and the ticket data.
var amboUpdate = function()
{
	let ele = document.getElementById("curCall");
	const params = new Object();
	params.method = "get";
	params.responseType = "json";
	let url = 'inc/getjson.php?tbl=curAmbo';
	if (ele.tabledata && ele.tabledata.lastupdate)
	{
		url += '&lastupdate='+ele.tabledata.lastupdate;
	}
	if (ele.pos && ele.pos.latitude && ele.pos.longitude && (ele.pos.latitude != ele.tabledata.loclat || ele.pos.longitude != ele.tabledata.loclng))
	{
		url += "&lat="+ele.pos.latitude+"&lng="+ele.pos.longitude;
	}
	doAJAX(url, params, function(err, data){
		if (err !== null) {
			ele.innerHTML = "Oops, error:" + err;
			if (popupMessage) { popupMessage("Error: " + err); }
		} else if (data !== null) {
			ele.data = data['dispatchMap'];
			ele.tabledata = Object.assign({}, data['curAmbo'][0]);
			data = data['curAmbo'];
			ele.tabledata.id = data[0].ticket_id;
			ele.tabledata.ticket_id = data[0].id;
			if (ele.tableconfig.newTicket == false && ele.tabledata.id > 0)
			{
				notif.play();
				ele.tableconfig.newTicket = true;
			} else if ((ele.tabledata.id == 0 || ele.tabledata.id == null) && ele.tableconfig.newTicket == true) {
				ele.tableconfig.newTicket = false;
			}
			


			map.redraw(ele);
			ele.innerHTML = '';
			createJSTable(ele, [ele.tabledata], ele.tableconfig);
			//console.log("updated");
		}
	});
}

//Using promises to do async functions in a proper order.
var updateCurrentPos = () => { 
	return new Promise((resolve, reject) => {
		if (loc) 
		{
			loc.getCurrentPosition((position) => resolve(geo_success(position)), (error) => reject(geo_fail(error)), {enableHighAccuracy: true, maximumAge: 5000, timeout: 5000});
		} else {
			resolve(geo_fail("No location"));
		}
	});
}

function geo_success(pos)
{
	let ele = document.getElementById("curCall");
	ele.pos = pos.coords;
	console.log("updating position");
}

function geo_fail(err)
{
	console.log(err);
}

function amboUpdateWorker() {
	updateCurrentPos().then(amboUpdate).catch((e)=>{popupMessage("Geolocation isn't working. Do you have it disabled?");});
}

var source;
var attempts = 3;
function initNewSource()
{
	//This is where the server-sent event stuff went. Removed to reduce complexity.
	//console.log("fallback to Interval positioning");
	source = setInterval(amboUpdateWorker, 10000);
}

function ambosetupCallback(dummy)
{
	initNewSource();
}


document.addEventListener('DOMContentLoaded', function(e) {
	const html = document.getElementsByTagName("html")[0].dataset;
	//document.getElementsByTagName("body")[0].addEventListener("keypress", amboShortcuts, false);
	if (!window.navigator.geolocation) {
		console.log("No geolocation available");
		alert("This browser does not support geolocation! automatic tracking will not function.");
	} else if (loc == null && html.dummy == null) {
		console.log("geoloc available");
		loc = window.navigator.geolocation;
	} else if (html.dummy) {
		console.log("dummy");
		alert("This is a dummy version of the ambulance page. It will show updates to this ambulance, but not use this client's geolocation");
	} else {
		console.log("Don't know let's just try stuff...");
		loc = window.navigator.geolocation;
	}
	updateCurrentPos().then(amboInit).catch((e)=>{popupMessage("Geolocation isn't working. Do you have it disabled?");});
});

