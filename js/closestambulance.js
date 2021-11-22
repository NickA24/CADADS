document.addEventListener('DOMContentLoaded', function(e) {
	const html = document.getElementsByTagName("html")[0].dataset;
	let params = new Object();
	params.initType = html.inittype;
	params.preferredMap = html.preferredMap;
	params.ticketId = html.ticketid;
	params.ele = "pick3";
	params.datamask = {};
	params.callback = closestambulancecallback;
	loadInit(params);
	document.getElementById("submitchooseambo").addEventListener("click", closestambulancepopulatedirections, false);
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
	const q = map.directions.find(x => x.id == id);
	document.getElementById("directions").value = q.encodedpolyline;
	document.getElementById("distance").value = q.distance.text;
	document.getElementById("duration").value = q.duration.text;
}