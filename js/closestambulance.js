document.addEventListener('DOMContentLoaded', function(e) {
	document.getElementById("submitchooseambo").addEventListener("click", closestambulancepopulatedirections, false);
	const html = document.getElementsByTagName("html")[0].dataset;
	const ele = document.getElementById("pick3");
	let params = new Object();
	params.initType = html.inittype;
	params.preferredMap = html.preferredMap;
	params.ticketId = html.ticketid;
	params.ele = "pick3";
	params.datamask = {};
	params.callback = closestambulancecallback;
	url = 'inc/getjson.php?tbl=closest&ticketid='+params.ticketId;
	doAJAX(url, new Object(), (err, data)=> {
		if (err !== null) {
			ele.innerHTML = "Oops, error:" + err;
			if (popupMessage) { popupMessage("Error: " + err); }
		} else if (data !== null) {
			ele.data = data;
			ele.callback = params.callback;
			loadInit(params);
		}
	});
	
	
});

function closestambulancecallback(data) {
}

function closestAmbulanceFailed(msg) {
	popupMessage(msg);
	setTimeout('location.href = "index.php";', 6000 );
}

function closestambulancepopulatedirections(e)
{
	const id = e.target.form.amboselect.value;
	console.log(id);
	if (id == null || id == 0)
	{
		e.preventDefault();
		popupMessage("Please choose an available ambulance, if any, or leave unassigned");
		return;
	}
	e.preventDefault();
	const q = map.directions.find(x => x.id == id);
	document.getElementById("directions").value = q.encodedpolyline;
	document.getElementById("distance").value = q.distance.text;
	document.getElementById("duration").value = q.duration.text;
}
