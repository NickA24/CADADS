
//Hotkeys for the page. Will use later to do automatic ambulance status updates
function amboShortcuts(e) {
    var str = "You have pressed a button. Press info: "+e.code+" alt:"+e.altKey+" shift:"+e.shiftKey+" ctrl:"+e.ctrlKey+" meta:"+e.metaKey+" repeat:"+e.repeat;
    console.log(str); 
}


//This displays the current data for the logged-in ambulance user.
//Note the map.testfunc() runs the initial google map script. We should change this later, probably.
//Used: ambulance.php
//input: ele: document element to put table info into.
var amboInit = function()
{
	let ele = document.getElementById("curCall");
	const params = new Object();
	params.method = "get";
	params.responseType = "json";
	let url = 'inc/getjson.php?tbl=curAmbo';
	if (ele.pos.latitude && ele.pos.longitude)
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

var amboUpdate = function()
{
	let ele = document.getElementById("curCall");
	const params = new Object();
	params.method = "get";
	params.responseType = "json";
	let url = 'inc/getjson.php?tbl=curAmbo';
	if (ele.pos.latitude && ele.pos.longitude)
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
			map.redraw(ele);
			ele.innerHTML = '';
			createJSTable(ele, [ele.tabledata], ele.tableconfig);
			console.log("updated");
		}
	});
}

//A single geolocation var just to make it easy on ourselves.
var loc;

//Using promises to do async functions in a proper order.
var updateCurrentPos = () => { 
	return new Promise((resolve, reject) => {
		loc.getCurrentPosition((position) => resolve(geo_success(position)), (error) => reject(geo_fail(error)), {enableHighAccuracy: true, maximumAge: 5000, timeout: 5000});
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
	updateCurrentPos().then(amboUpdate);
}

var source;
var attempts = 3;
function initNewSource()
{
	/*if (attempts > 0) {
		console.log("Attempting Server-Sent Events, Attempt:"+(4-attempts)+".");
		source = new EventSource('/events', {withCredentials: true});
		source.addEventListener('ping', event => {
			updateCurrentPos();
			attempts = 3;
		});
		source.addEventListener('error', event => {
			if (source.readyState == 2)
			{
				source.close();
				if (attempts > 0) {
					attempts--;
					console.log("Failed "+(3-attempts)+" times.");
					initNewSource();
				}
			}
		});
	} else {*/
		console.log("fallback to Interval positioning");
		source = setInterval(amboUpdateWorker, 15000);
	//}
}

function ambosetupCallback(dummy)
{
	initNewSource();
}


document.addEventListener('DOMContentLoaded', function(e) {
	document.getElementsByTagName("body")[0].addEventListener("keypress", amboShortcuts, false);
	if (!window.navigator.geolocation) {
		alert("This browser does not support geolocation! automatic tracking will not function.");
	} else if (loc == null) { 
		loc = window.navigator.geolocation;
	}
	updateCurrentPos().then(amboInit);
});

