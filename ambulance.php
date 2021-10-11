<?php include_once("./inc/login.php"); include_once("./inc/header.php"); if (checklogin() != 2) { return; } ?>
<body onload="var ele = document.getElementById('curCall'); amboInfo(ele); this.onkeydown = amboShortcuts;">
<?php echo logoutbutton(); ?>
    <style type="text/css">
    /* Set the size of the div element that contains the map */
    #map {
      height: 600px;
      width: 100%;
    }
  </style>
<h1>Ambulance <?php echo $_SESSION['myusername'] ?>:</h1>
<div id="curCall"></div>
<div id="map"></div>
<script>
var amboShortcuts = function(e) {
    var str = "You have pressed a button. Press info: "+e.code+" alt:"+e.altKey+" shift:"+e.shiftKey+" ctrl:"+e.ctrlKey+" meta:"+e.metaKey+" repeat:"+e.repeat;
    console.log(str); 
}
	
function initMap() {
	const map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: 34.182175, lng: -117.318794 },
		zoom: 15,
		//center: { lat: 34.05349, lng: -118.24532 },zoom: 8, //Attempting something
	});
	const directionsService = new google.maps.DirectionsService();
	const directionsRenderer = new google.maps.DirectionsRenderer({map:map, suppressMarkers:true});

	directionsRenderer.setMap(map);
	
	map.testfunc = function() {
		console.log("Attemping test function");
		calculateAndDisplayRoute(directionsService, directionsRenderer);
	};
	document.getElementById("map").map = map;
}
	
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
	const ele = document.getElementById("curCall");
	directionsService.route(
	{
		origin: ele.data.ambulance_location,
		destination: ele.data.ticket_location,
		travelMode: google.maps.TravelMode.DRIVING,
	})
	.then((response) => {
		directionsRenderer.setDirections(response);
		console.log(response);
		var m1 = new google.maps.Marker({
			position: response.request.destination.location,
			title:"Ambulance Location",
			label:"🚑",
			map: document.getElementById("map").map
		});
		var m2 = new google.maps.Marker({
			position: response.request.destination.location,
			title:"Ticket Location",
			label:"🏁",
			map: document.getElementById("map").map
		});
	})
	.catch((e) => console.log("Directions request failed due to " + status));
}

</script>
  
   <!-- Async script executes immediately and must be after any DOM elements used in callback. -->
    <script
      src="/inc/googleapi.php"
      async
    ></script>
  
</body>
</html>
