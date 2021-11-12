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
});

function closestambulancecallback(data) {
}

function closestAmbulanceFailed(msg) {
	popupMessage(msg);
	setTimeout('location.href = "index.php";', 6000 );
}

