//This is the callback function specified in the Google Maps API code. 
//This way we can use the same map info in multiple pages, but change what this function might do
function initMap() {
	map.initMap();
}

function loadScript(url, callback, arg1)
{
	var scr = document.createElement('script');
	scr.type = 'text/javascript';
	scr.src = url;
	if (callback) 
	{
		scr.onreadystatechange = function() { callback(arg1); };
		scr.onload = function() { callback(arg1); };
	}
	document.head.appendChild(scr);
}

//Event listener, called on body load.
function loadInit(loc) 
{
	//loc:1 means ambulance.php, 2:dispatch
	//Loads the google script, and after loading will do the map initialization.
	if (loc == 1) 
	{
		var ele = document.getElementById('curCall'); 	
		loadScript('/inc/googleapi.php', amboInfo, ele);
		document.getElementsByTagName("body")[0].addEventListener("keypress", amboShortcuts, false);
	} 
	else if (loc == 2) 
	{
		var ele = document.getElementById('body');
		loadScript('/inc/googleapi.php');
	}
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
	markers: [],
	bounds:null,
	initMap: function() { //Passes origin and destination
		this.map = new google.maps.Map(document.getElementById("map"), {center: { lat: 34.182175, lng: -117.318794 },zoom: 15,});
		this.ds = new google.maps.DirectionsService();
		this.dr = new google.maps.DirectionsRenderer({map:this.map, suppressMarkers:true, polylineOptions: {strokeColor: "FireBrick"}});
		this.init = true;
		//Previous lines filled out our placeholders. Next line sets the DirectionsRenderer map.
		//this.dr.setMap(this.map);
		const contentString = 'My text for this marker';
		//This initializes our infowindow for use with markers.
		this.infowindow = new google.maps.InfoWindow({content: contentString});
		this.bounds = new google.maps.LatLngBounds();
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
	setMapMarkers(map) {
		for (let i = 0; i < this.markers.length; i++) 
		{
			this.markers[i].setMap(map);
		}
	},
	addMarker: function(position, icon) {
		const amboji = "🚑";
		const endoji = "🏁";
		let lbl = "";
		let title = "";
		if (icon)
		{
			if (icon == 1)
			{
				lbl = amboji;
				title = "Ambulance Location:\n"+position;
			} else {
				lbl = endoji;
				title = "Ticket Location:\n"+position;
			}
		} else {
			lbl = "";
			title = "Location:"+position;
		}
		const marker = new google.maps.Marker({
			position: position,
			title: title,
			label: lbl,
			map: this.map
		});
		marker.addListener('click', () => this.infoWindowHandler(marker));
		this.markers.push(marker);
	},
	showMarkers: function() {
		setMapMarkers(this.map);
	},
	hideMarkers: function() {
		setMapMarkers(null);
	},
	deleteMarkers: function() {
		hideMarkers();
		this.markers = [];
	},
	setupDispatch: function() {
		getJSON('inc/getjson.php?tbl=dispatchMap', function(err, data){
			if (err !== null) {
				ele.innerHTML = "Oops, error:" + err;
			} else {
				if (map.init)
				{
					data.forEach((e) => {
					     if (e.location && e.destination) 
						{
							map.calcAllRoutes(e);
						} else {
							map.addMarker(e.location, e.source);
						}
					});
				}
			}
		});
	},
	testfunc: function() {
		//This runs an initial route determined by the ambulance and ticket locations.
		this.calculateAndDisplayRoute(this.start, this.end);
	},
	infoWindowHandler: function(marker) {
		//EventHandler, listening to click events on our generated markers.
		this.infowindow.close(); 
		this.infowindow.setContent(marker.getTitle());
		this.infowindow.open(this.map, marker);
	},
	//general routes for all ambo->dir
	calcAllRoutes: function(route) {
		this.ds.route({
			origin: route.location,
			destination: route.destination,
			travelMode: google.maps.TravelMode.DRIVING,
		}).then((response) => {
			const ovp = response.routes[0];
			this.dr.setDirections(response);
			this.addMarker(ovp.overview_path[0], 1);
			this.addMarker(ovp.overview_path[ovp.overview_path.length-1], 0);
		}).catch((e) => console.log("Directions request failed due to " + e));
	},
	//specific route for ambulances
	calculateAndDisplayRoute: function(start, end) {
		//This routes the directions through the google server
		this.ds.route(
		{
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode.DRIVING,
		})
		.then((response) => {
			//Once we get them back, set the directions.
			this.dr.setDirections(response);
			const ovp = response.routes[0];
			this.addMarker(ovp.overview_path[0], 1);
			if (end != start)
			{
				this.addMarker(ovp.overview_path[ovp.overview_path.length-1], 0);
			}
			this.bounds.union(response.routes[0].bounds);
			this.fitBounds(this.bounds);
			//Next, do some magic with the returned data, so we have lat and long of locations. Markers REQUIRE latlong, can't use street data.
		}).catch((e) => console.log("Directions request failed due to " + e));
	}
};

//After defining what ddMap does, create a global instance of it.
var map = Object.create(ddMap);
