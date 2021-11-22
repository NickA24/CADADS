
//Hotkeys for the page. Will use later to do automatic ambulance status updates
function amboShortcuts(e) {
    var str = "You have pressed a button. Press info: "+e.code+" alt:"+e.altKey+" shift:"+e.shiftKey+" ctrl:"+e.ctrlKey+" meta:"+e.metaKey+" repeat:"+e.repeat;
    console.log(str); 
}

function amboService(stat, pos, ele, ajx) {
	if (ajx) {
		document.getElementById("id").value = ele.tabledata.id;
		document.getElementById("loc").value = pos.origin;
		document.getElementById("lat").value = pos.coords.latitude;
		document.getElementById("lng").value = pos.coords.longitude;
		if (stat < 4) {
			document.getElementById("submitType").value = 'ambostat';
			document.getElementById("status").value = stat;
		} else {
			document.getElementById("submitType").value = 'en2Hosp';
			document.getElementById("hospid").value = stat-3;
		}
		document.getElementById("directions").value = '';
		document.getElementById("distance").value = '';
		document.getElementById("duration").value = '';
		document.getElementById("statusSubmit").submit();
	} else {
		const params = new FormData();
		params.append('returnMessage', 1);
		params.append('method', 'POST');
		params.append('action', '/inc/amboupdates.php');
		params.append('id', ele.tabledata.id);
		params.append('loc', pos.origin);
		params.append('lat', pos.coords.latitude);
		params.append('lng', pos.coords.longitude);
		if (ele[0] && ele[0].directions && ele[0].directions != '')
		{
			params.append('directions', ele[0].directions);
			params.append('distance', ele[0].distance);
			params.append('duration', ele[0].duration);
		} else if (map.directions && map.directions[0]) {
			params.append('directions', map.directions[0].encodedpolyline);
			params.append('distance', map.directions[0].distance.text);
			params.append('duration', map.directions[0].duration.text);
		}
		params.append('submitType', 'amboup');

		doAJAX("/inc/amboupdates.php", params, (ret) => {
			let ele = document.getElementById("curCall");
			ele.innerHTML = '';
			popupMessage(ret);
			amboInfo();
		});
	}
}


//This displays the current data for the logged-in ambulance user.
//Note the map.testfunc() runs the initial google map script. We should change this later, probably.
//Used: ambulance.php
//input: ele: document element to put table info into.
var amboInfo = function()
{
	let ele = document.getElementById("curCall");
	const params = new Object();
	params.method = "get";
	params.responseType = "json";
	doAJAX('inc/getjson.php?tbl=curAmbo', params, function(err, data){
		if (err !== null) {
			ele.innerHTML = "Oops, error:" + err;
			if (popupMessage) { popupMessage("Error: " + err); }
		} else if (data !== null) {
			let config = new Object(); 
			if (data[0].ticket_id > 0)
			{
				config.newTicket = true;
			}
			if (ele.tabledata && ele.tabledata.lastupdate == data[0].lastupdate && ele.data[0].directions != '') 
			{ 
				console.log("ignoring"); 
				return; 
			} 
			else 
			{
				ele.tabledata = Object.assign({}, data[0]);
				data[0].id = data[0].ticket_id;
				data[0].ticket_id = ele.tabledata.id;
				
				
				config.addEditData = 0;
				config.createTable = true;
				config.createHeader = true;
				config.createBody = true;
				config.bodyID = "ambobody";
				config.dataMask = ["name", "incident_type", "location", "destination", "priorityText"];
				config.dataMask2nd = ["status", "incident_description", "time", "lastupdate"];
				config.addComments = true;
				ele.innerHTML = '';
				createJSTable(ele, data, config);
			}
			const html = document.getElementsByTagName("html")[0].dataset;
			let paramx = new Object();
			paramx.initType = html.inittype;
			paramx.preferredMap = html.preferredMap;
			paramx.ticketId = 0;
			paramx.id = ele.tabledata.id;
			ele.tabledata.username = html.username;
			paramx.ele = "curCall";
			paramx.callback = ambosetupCallback;
			if (!map.init) { 
				loadInit(paramx); 
			} else { 
				doAJAX('inc/getjson.php?tbl=dispatchMap&id='+ele.tabledata.id, new Object(), (err, datax)=> {
					if (err !== null) {
						ele.innerHTML = "Oops, error:" + err;
					} else if (datax !== null) {
						ele.data = datax;
						map.clearAlldr();
						map.deleteMarkers();
						map.setup(ele);
					}
				});
			}
		}
	});
}

var source;
var attempts = 3;
function initNewSource()
{
	if (attempts > 0) {
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
	} else {
		console.log("fallback to Interval positioning");
		source = setInterval(updateCurrentPos, 30000);
	}
}

function updateCurrentPos()
{
	map.loc.getCurrentPosition((position) => {
		const ele = document.getElementById("curCall");
		if (position.coords.latitude != ele.data[0].loclat || position.coords.longitude != ele.data[0].loclng) 
		{
			testFetch('inc/googlereversegeocode.php?returntext=1&id='+ele.data.id+'&lat='+position.coords.latitude+'&lng='+position.coords.longitude, {}, (data) => {
				console.log("updating position");
				position.origin = data.address;
				amboService(status, position, ele);
				const coords = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				}
				map.ambulance_markers[0].setPosition(coords);
				map.doBounding();
			});
		} else {
			amboInfo();
		}
	}, (error) => { console.log(error); }, {enableHighAccuracy: true, maximumAge: 30000, timeout: 5000});
}

function ambosetupCallback(dummy)
{
	//initNewSource();
}



document.addEventListener('DOMContentLoaded', function(e) {
	document.getElementsByTagName("body")[0].addEventListener("keypress", amboShortcuts, false);
	amboInfo();
});
