
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
			createJSTable(ele, data, config);
			config.createTable = false;
			config.createHeader = false;
			config.createBody = false;
			config.dataMask = ["id", "loclat", "loclng", "dstlat", "dstlng"];
			createJSTable(document.getElementById("ambobody"), data, config);
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


document.addEventListener('DOMContentLoaded', function(e) {
	document.getElementsByTagName("body")[0].addEventListener("keypress", amboShortcuts, false);
	amboInfo();
});