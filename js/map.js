//This is the callback function specified in the Google Maps API code. 
//This way we can use the same map info in multiple pages, but change what this function might do
function initMap() {
	map.initMap();
}

//Event listener, called on body load.
function loadInit() {
	var ele = document.getElementById('curCall'); 
	amboInfo(ele);
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
	infowindow: null, // Placeholder to create an instance of google maps api's infowindow
	initMap: function() { //Passes origin and destination
		this.map = new google.maps.Map(document.getElementById("map"), {center: { lat: 34.182175, lng: -117.318794 },zoom: 15,});
		this.ds = new google.maps.DirectionsService();
		this.dr = new google.maps.DirectionsRenderer({map:this.map, suppressMarkers:true, polylineOptions: {strokeColor: "FireBrick"}});
		this.init = true;
		//Previous lines filled out our placeholders. Next line sets the DirectionsRenderer map.
		this.dr.setMap(this.map);
		const contentString = 'My text for this marker';
		//This initializes our infowindow for use with markers.
		this.infowindow = new google.maps.InfoWindow({content: contentString});
		this.testfunc();
	},
	setDirections: function(s, e) {
		this.start = s;
		this.end = e;	
	},
	getTime: function() {
		const v = this.dr.routes[0].legs[0];
		return v.duration;
	},
	getDistance: function() {
		const v = this.dr.routes[0].legs[0];
		return v.distance;
	},
	testfunc: function() {
		//This runs an initial route determined by the ambulance and ticket locations. uses ds and dr in case we need to do this multiple times? we'll see.
		if (this.start && this.end) {
			this.calculateAndDisplayRoute(this.ds, this.dr);
		}
		
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
			const ovp = response.routes[0];
			var m1 = new google.maps.Marker({
				position: ovp.overview_path[0],
				title:"Ambulance Location:\n"+ovp.legs[0].start_address,
				label:"🚑",
				map: this.map
			});
			m1.addListener('click', () => this.infoWindowHandler(m1));
			if (this.end != this.start)
			{
				var m2 = new google.maps.Marker({
					position: ovp.overview_path[ovp.overview_path.length-1],
					title:"Ticket Location:\n"+ovp.legs[0].end_address,
					label:"🏁",
					map: this.map
				});
				m2.addListener('click', () => this.infoWindowHandler(m2));
			} else {
				this.map.setZoom(18);	
			}
			//Next, do some magic with the returned data, so we have lat and long of locations. Markers REQUIRE latlong, can't use street data.
		}).catch((e) => console.log("Directions request failed due to " + e));
	}
};

//After defining what ddMap does, create a global instance of it.
var map = Object.create(ddMap);
