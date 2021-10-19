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
		loadScript('/inc/googleapi.php', map.setupDispatch);
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
	directions: [],
	colors: [],
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
	doBounding: function() {
		for (var index in this.markers ) {
			let latlng = this.markers[index].getPosition();
			this.bounds.extend(latlng);
		}
		this.map.fitBounds(this.bounds, 50);
	},
	addMarker: function(position, obj) {
		const amboji = "🚑";
		const endoji = "🏁";
		let lbl = "";
		let title = obj['title'];
		let icn = { url: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=", labelOrigin: new google.maps.Point(10,10) };
		if (obj['type'] == 2) {
			//Hospitals
			console.log("Shouldn't be any hospitals yet");
		} else if (obj['type'] == 1) {
			//Ambulances
			lbl = amboji;
			if (obj['status'] == "Out of Service" || obj['status'] == "Unavailable" || obj['status'] == 0 || obj['status'] == 3)
			{
				icn.url = icn.url+"%20|888888|000000";
			} else if (obj['status'] == "Available" || obj['status'] == 1)
			{
				icn.url = icn.url+"%20|00ff00|000000";
			} else {
				icn.url = icn.url+"%20|"+obj['clr'].substring(1)+"|000000";	
			}
		} else if (obj['type'] == 0) {
			//Destinations
			lbl = endoji;
			if (obj['isFree'] == 0) {
				icn.url = icn.url+"%20|ff0000|000000";
		    	} else {
				console.log(this.colors[2]);
				console.log(obj['isFree'] + ":" + this.colors[obj['isFree']]);
				//Figure out how to color it based on what ambo it's connected to.
				if (this.colors[obj['isFree']]) {
					icn.url = icn.url+"%20|"+this.colors[obj['isFree']].substring(1)+"|000000";
				} else {
					icn.url = icn.url+"%20|ff0000|000000";
				}
			}
		} else {
			console.log(obj);
		}
		const marker = new google.maps.Marker({
			position: position,
			title: title,
			label: lbl,
			icon: icn,
			map: this.map
		});
		marker.addListener('click', () => this.infoWindowHandler(marker));
		this.markers.push(marker);
		this.doBounding();
	},
	showMarkers: function() {
		this.setMapMarkers(this.map);
	},
	hideMarkers: function() {
		this.setMapMarkers(null);
	},
	deleteMarkers: function() {
		this.hideMarkers();
		this.markers = [];
	},
	setupDispatch: function() {
		getJSON('inc/getjson.php?tbl=dispatchMap', (err, data)=>{
			if (err !== null) {
				console.log("Oops, error:" + err);
			} else {
				if (map.init)
				{
					data.forEach((e) => {
					     if (e.destination) 
						{
							map.calcAllRoutes(e);
						} else {
							let obj = new Object();
							obj.status = e.status
							obj.type = e.source;
							obj.title = e.name;
							obj.isFree = e.isFree
							if (e.source == 0) { obj.title += ": "+e.status; }
							obj.title += ":\n"+e.location;
							map.addMarker({"lat":e.loclat, "lng":e.loclng}, obj);
						}
					});
					setTimeout(function(){map.doBounding()},1500);
				}
			}
		});
	},
	testfunc: function(data) {
		//This runs an initial route determined by the ambulance and ticket locations.
		map.setDirections({lat:data.loclat, lng:data.loclng}, {lat:data.dstlat,lng:data.dstlng});
		this.calculateAndDisplayRoute(data);
	},
	infoWindowHandler: function(marker) {
		//EventHandler, listening to click events on our generated markers.
		this.infowindow.close(); 
		this.infowindow.setContent(marker.getTitle().split("\n").join("<br>"));
		this.infowindow.open(this.map, marker);
	},
	clearAlldr: function() {
		for (let i = 0; i < this.directions.length; i++) 
		{
			this.directions[i] = null;
		}
		this.directions = [];
		this.colors = [];
	},
	getRandomColor: function(id) {
		var color;
		var letters = '0123456789ABCDEF';
		color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		if (id) {
			this.colors[id] = color;
		} else {
			this.colors.push(color);
		}
		return color;
	},
	//general routes for all ambo->dir
	calcAllRoutes: function(route) {
		this.clearAlldr();
		this.ds.route({
			origin: route.location,
			destination: route.destination,
			travelMode: google.maps.TravelMode.DRIVING,
		}).then((response) => {
			const ovp = response.routes[0];
			const clr = this.getRandomColor(route['id']);
			let newdr = new google.maps.DirectionsRenderer({map:this.map, suppressMarkers:true, polylineOptions: {strokeColor: clr}});
			newdr.setDirections(response);
			this.directions.push(newdr);
			let obj = new Object();
			obj.status = route.status
			obj.type = "1";
			obj.title = route.name+":\n"+route.location;
			obj.clr = clr;
			this.addMarker(ovp.overview_path[0], obj);
		}).catch((e) => console.log("Directions request failed due to " + e));
	},
	//specific route for ambulances
	calculateAndDisplayRoute: function(data) {
		//This routes the directions through the google server
		if (!this.start || !this.end) { return; }
		this.ds.route(
		{
			origin: this.start,
			destination: this.end,
			travelMode: google.maps.TravelMode.DRIVING,
		})
		.then((response) => {
			//Once we get them back, set the directions.
			this.dr.setDirections(response);
			const ovp = response.routes[0];
			let obj = new Object();
			obj.status = data.status
			obj.type = "1";
			obj.title = "Your location:\n"+data.ambulance_location;
			this.addMarker(ovp.overview_path[0], obj);
			if (this.end != this.start)
			{
				obj.status = data.active;
				obj.type = "0";
				obj.title = data.name+": "+data.incident_type+"\n"+data.destination
				this.addMarker(ovp.overview_path[ovp.overview_path.length-1], obj);
			}
			this.doBounding();
			//Next, do some magic with the returned data, so we have lat and long of locations. Markers REQUIRE latlong, can't use street data.
		}).catch((e) => console.log("Directions request failed due to " + e));
	}
};

//After defining what ddMap does, create a global instance of it.
var map = Object.create(ddMap);
