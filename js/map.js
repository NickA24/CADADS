//This is the callback function specified in the Google Maps API code. 
//This way we can use the same map info in multiple pages, but change what this function might do
function initMap() {
	var ele = document.getElementById('curCall'); 
	if (!map.init && ele.data) {
		map.initMap(ele.data.ambulance_location, ele.data.ticket_location);
	}
}

//Event listener, called on body load.
function loadInit() {
	var ele = document.getElementById('curCall'); 
	amboInfo(ele);
	if (!map.init) {
		map.initMap(ele.data.ambulance_location, ele.data.ticket_location);
	}
	document.getElementsByTagName("body")[0].addEventListener("keypress", amboShortcuts, false);
}

//Hotkeys for the page. Will use later to do automatic ambulance status updates
function amboShortcuts(e) {
    var str = "You have pressed a button. Press info: "+e.code+" alt:"+e.altKey+" shift:"+e.shiftKey+" ctrl:"+e.ctrlKey+" meta:"+e.metaKey+" repeat:"+e.repeat;
    console.log(str); 
}

//Set up a ddMap object.
var ddMap = {
	map: null, //Placeholder for the google map object
	init: null, // Lets us know we've initialized the map with proper data.
	ds: null, // Placeholder for directionsService
	dr: null, //Placeholder for directionsRenderer
	iw: null, //Placeholder for google infowindow
	start: null, //Stores the ambulance location
	end: null, //Stores the ticket location
	directions: null, // Don't remember what this does.
	infowindow: null, // Placeholder to create an instance of google maps api's infowindow
	initMap: function(amb_loc, tkt_loc) { //Passes origin and destination
		this.map = new google.maps.Map(document.getElementById("map"), {center: { lat: 34.182175, lng: -117.318794 },zoom: 15,});
		this.ds = new google.maps.DirectionsService();
		this.dr = new google.maps.DirectionsRenderer({map:this.map, suppressMarkers:true, polylineOptions: {strokeColor: "FireBrick"}});
		this.start = amb_loc;
		this.end = tkt_loc;
		this.init = true;
		//Previous lines filled out our placeholders. Next line sets the DirectionsRenderer map.
		this.dr.setMap(this.map);
		const contentString = 'My text for this marker';
		//This initializes our infowindow for use with markers.
		this.infowindow = new google.maps.InfoWindow({content: contentString});
		this.testfunc();
	},
	testfunc: function() {
		//This runs an initial route determined by the ambulance and ticket locations. uses ds and dr in case we need to do this multiple times? we'll see.
		this.calculateAndDisplayRoute(this.ds, this.dr);
		
	},
	infoWindowHandler: function(marker) {
		//EventHandler, listening to click events on our generated markers.
		this.infowindow.close(); 
		this.infowindow.setContent(marker.getTitle());
		this.infowindow.open(this.map, marker);
	},
	calculateAndDisplayRoute: function(directionsService, directionsRenderer) {
		//This routes the directions through the google server
		directionsService.route(
		{
			origin: this.start,
			destination: this.end,
			travelMode: google.maps.TravelMode.DRIVING,
		})
		.then((response) => {
			//Once we get them back, set the directions.
			directionsRenderer.setDirections(response);
			const ovp = response.routes[0].overview_path;
			//Next, do some magic with the returned data, so we have lat and long of locations. Markers REQUIRE latlong, can't use street data.
			var m1 = new google.maps.Marker({
				position: ovp[0],
				title:"Ambulance Location",
				label:"🚑",
				map: this.map
			});
			var m2 = new google.maps.Marker({
				position: ovp[ovp.length-1],
				title:"Ticket Location",
				label:"🏁",
				map: this.map
			});
			m1.addListener('click', () => this.infoWindowHandler(m1));
			m2.addListener('click', () => this.infoWindowHandler(m2));
		})
		.catch((e) => console.log("Directions request failed due to " + status));
	}
};

//After defining what ddMap does, create a global instance of it.
var map = Object.create(ddMap);
