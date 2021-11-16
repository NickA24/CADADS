
//Hotkeys for the page. Will use later to do automatic ambulance status updates
function amboShortcuts(e) {
    var str = "You have pressed a button. Press info: "+e.code+" alt:"+e.altKey+" shift:"+e.shiftKey+" ctrl:"+e.ctrlKey+" meta:"+e.metaKey+" repeat:"+e.repeat;
    console.log(str); 
}

function amboService(stat, pos, ele) {
	const params = new FormData();
	params.append('method', 'POST');
	params.append('id', ele.tabledata.id);
	params.append('loc', pos.origin);
	params.append('lat', pos.coords.latitude);
	params.append('lng', pos.coords.longitude);
	if (stat < 4) {
		params.append('submitType', 'ambostat');
		params.append('status', stat);
	} else {
		params.append('submitType', 'en2Hosp');
		params.append('hospid', stat-3);
	}
	doAJAX("/inc/amboupdates.php", params, (ret) => {
		let ele = document.getElementById("curCall");
		ele.innerHTML = '';
		popupMessage(ret);
		amboInfo();
	});
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
			ele.tabledata = Object.assign({}, data[0]);
			data[0].id = data[0].ticket_id;
			data[0].ticket_id = ele.tabledata.id;
			let config = new Object();
			config.addEditData = 0;
			config.createTable = true;
			config.createHeader = true;
			config.createBody = true;
			config.bodyID = "ambobody";
			config.dataMask = ["name", "incident_type", "status", "ambulance_location", "destination"];
			config.dataMask2nd = ["id", "loclat", "loclng", "dstlat", "dstlng"];
			createJSTable(ele, data, config);
			const html = document.getElementsByTagName("html")[0].dataset;
			let paramx = new Object();
			paramx.initType = html.inittype;
			paramx.preferredMap = html.preferredMap;
			paramx.ticketId = 0;
			paramx.id = ele.tabledata.id;
			ele.tabledata.username = html.username;
			paramx.ele = "curCall";
			loadInit(paramx);
		}
	});
}

var source;
function initNewSource()
{
source = new EventSource('/events', {withCredentials: true});
source.addEventListener('ping', event => {
	const status = document.getElementById("curCall").data[0].status;
	map.loc.getCurrentPosition((position) => {
		const ele = document.getElementById("curCall");
		testFetch('inc/googlereversegeocode.php?returntext=1&id='+ele.data.id+'&lat='+position.coords.latitude+'&lng='+position.coords.longitude, {}, (data) => {
			position.origin = data.address;
			amboService(status, position, ele);
			const coords = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			}
			map.ambulance_markers[0].setPosition(coords);
		});
	}, (error) => { console.log(error); }, {enableHighAccuracy: false, maximumAge: 5000});
});
source.addEventListener('error', event => {
	//document.body.innerHTML += '<span style="color:red">'+event.data + '</span><br>';
	if (source.readyState == 2)
	{
		source.close();
		initNewSource();
	}
});
}



document.addEventListener('DOMContentLoaded', function(e) {
	document.getElementsByTagName("body")[0].addEventListener("keypress", amboShortcuts, false);
	amboInfo();
    	initNewSource();
});
