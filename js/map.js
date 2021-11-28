//This is the callback function specified in the Google Maps API code. 
//This way we can use the same map info in multiple pages, but change what this function might do
function initMap() {
	map.initMap();
}

var reloadid = 0;
//Event listener, called on body load.
function loadInit(params) //loc, style, id) 
{
	//automatic click checker to zoom on the map when clicking a ticket
	if (!map.init) { 
		document.onclick= function(e){
			e=window.event? event.srcElement: e.target;const x = e.closest('.markerZoom'); 
			if (x) {
				reloadid = x.id;
				map.zoomOnMarker(x.getAttribute("id"));
				var j = document.getElementsByClassName("inner_row");
				for (let i = 0; i < j.length; i++) {
					if (j[i].getAttribute("src") != x.id) {
						j[i].classList.add("hidden");
					}
					if (j[i].classList.contains("header") && x.lastElementChild.classList.contains("hidden")) {
						j[i].classList.remove("hidden");
					}
				}
				if (x.firstElementChild.nextElementSibling != x.lastElementChild) {
					x.firstElementChild.nextElementSibling.classList.toggle("hidden");
				}
				x.lastElementChild.classList.toggle("hidden");
			}
		}
	} else { console.log("map already loaded"); }
	//loc:1 means ambulance.php, 2:dispatch
	//Loads the google script, and after loading will do the map initialization.
	map.mapStyle = params.preferredMap;
	var ele = document.getElementById(params.ele);
	ele.ticketid = params.ticketId;
	ele.initType = params.initType;
	gurl = 'inc/googleapi.php';
	loadScript(gurl, map.setup, ele);
}

//Set up a ddMap object.
var ddMap = {
	map: null, //Placeholder for the google map object
	init: null, // Lets us know we've initialized the map with proper data.
	ds: null, // Placeholder for directionsService
	dr: null, //Placeholder for directionsRenderer
	iw: null, //Placeholder for google infowindow
	infowindow: null, // Placeholder to create an instance of google maps api's infowindow
	ambulance_markers: [],
	ticket_markers: [],
	directions: [],
	colors: [],
	promises: 0,
	bounds:null,
	mapStyle:null,
	promiseFunc: Promise.resolve(),
	promiseInterval: 250,
	initMap: function() { //Passes origin and destination
		this.map = new google.maps.Map(document.getElementById("map"), {
			center: { lat: 34.182175, lng: -117.318794 },
			zoom: 15,
			mapId: this.mapStyle,
		});
		this.ds = new google.maps.DirectionsService();
		this.dr = new google.maps.DirectionsRenderer({map:this.map, suppressMarkers:true, polylineOptions: {strokeColor: "FireBrick"}});
		this.init = true;
		//Previous lines filled out our placeholders. Next line sets the DirectionsRenderer map.
		//this.dr.setMap(this.map);
		const contentString = 'My text for this marker';
		//This initializes our infowindow for use with markers.
		this.infowindow = new google.maps.InfoWindow({content: contentString});
		this.bounds = new google.maps.LatLngBounds();
		const ccd = document.createElement("div");
		this.mapControl(ccd, this.map);
		this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(ccd);
	},
	mapControl: function(div, map) {
		const controlUI = document.createElement("div");
		controlUI.setAttribute("class", "controlUI");
		controlUI.title = "Click to center and show all tickets and ambulances";
		div.appendChild(controlUI);
		const controlText = document.createElement("div");
		controlText.setAttribute("class", "controlText");
		controlText.innerHTML = "Show All";
		controlUI.appendChild(controlText);
		controlUI.addEventListener("click", () => {
			this.doBounding();
		});
	},
	infoWindowHandler: function(marker) {
		//EventHandler, listening to click events on our generated markers.
		this.infowindow.close(); 
		this.infowindow.setContent(marker.getTitle().split("\n").join("<br>"));
		this.infowindow.open(this.map, marker);
	},
	getRandomColor: function(id) {
		// This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
		// Adam Cole, 2011-Sept-14
		// HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
		if (id == 0 || id == null) { return "#ff0000"; }
		if (this.colors[id]) { return this.colors[id]; }
		let color;
		var r, g, b;
		var min = Math.ceil(30);
		var max = Math.floor(330);
		var h = Math.floor(Math.random() * (max - min + 1) + min) / 360;
		let htmp = h*360;
		if (90 < htmp && htmp < 150) {
			if (htmp < 120) {
				h = (htmp-30)/360;
			} else if (htmp >= 120) {
				h = (htmp+30)/360;
			}
		}
		var i = ~~(h * 6);
		var f = h * 6 - i;
		var q = 1 - f;
		switch(i % 6){
			case 0: r = 1; g = f; b = 0; break;
			case 1: r = q; g = 1; b = 0; break;
			case 2: r = 0; g = 1; b = f; break;
			case 3: r = 0; g = q; b = 1; break;
			case 4: r = f; g = 0; b = 1; break;
			case 5: r = 1; g = 0; b = q; break;
		}
		var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
		color = (c);
		if (id) {
			this.colors[id] = color;
		} else {
			this.colors.push(color);
		}
		return color;
	},
	zoomOnMarker: function(id) {
		let index = this.ticket_markers.findIndex(x => x.id == id);
		let extraindex = this.directions.findIndex(x => x.id == this.ticket_markers[index].isFree);
		if (extraindex >= 0) {
			const c = this.directions[extraindex];
			this.bounds = new google.maps.LatLngBounds();
			this.bounds.extend(c.start_location);
			this.bounds.extend(c.end_location);
			this.map.fitBounds(this.bounds, 50);
		} else {
			if (this.ticket_markers[index]) {
				this.map.setZoom(15);
				this.map.panTo(this.ticket_markers[index].position);
			}
		}
	},
	doBounding: function() {
		this.bounds = null;
		this.bounds = new google.maps.LatLngBounds();
		for (var index in this.ambulance_markers ) {
			let latlng = this.ambulance_markers[index].getPosition();
			this.bounds.extend(latlng);
		}
		for (var index in this.ticket_markers ) {
			let latlng = this.ticket_markers[index].getPosition();
			this.bounds.extend(latlng);
		}
		if (this.bounds.getNorthEast().equals(this.bounds.getSouthWest())) {
			var extendPoint = new google.maps.LatLng(this.bounds.getNorthEast().lat() + 0.01, this.bounds.getNorthEast().lng() + 0.01);
			this.bounds.extend(extendPoint);
			extendPoint = new google.maps.LatLng(this.bounds.getSouthWest().lat() - 0.01, this.bounds.getSouthWest().lng() - 0.01);
			this.bounds.extend(extendPoint);
		}
		this.map.fitBounds(this.bounds, 50);
	},
	setMapMarkers: function(map) {
		for (let i = 0; i < this.ambulance_markers.length; i++) 
		{
			this.ambulance_markers[i].setMap(map);
		}
		for (let i = 0; i < this.ticket_markers.length; i++) 
		{
			this.ticket_markers[i].setMap(map);
		}
		
	},
	setMapMakersD: function(map, a) {
		for (let i = 0; i < a.length; i++)
		{
			a[i].setMap(map);
		}
	},
	remDirectionsD: function(a) {
		for (let i = 0; i < a.length; i++)
		{
			a[i].polyline.setMap(null);
		}
	},
	showMarkers: function() {
		this.setMapMarkers(this.map);
	},
	hideMarkers: function() {
		this.setMapMarkers(null);
	},
	remMarker: function(id, type) {
		if (type == 1) {
			this.ambulance_markers[id].setMap(null);
		} else {
			this.ticket_markers[id].setMap(null);
		}
	},
	deleteMarkers: function() {
		this.hideMarkers();
		this.ambulance_markers = [];
		this.ticket_markers = [];
	},
	delMarker: function(id, type) {
		this.remMarker(id, type);
		if (type == 1) {
			this.ambulance_markers[id] = null;
		} else {
			this.ticket_markers[id] = null;
		}
	},
	clearAlldr: function() {
		for (let i = 0; i < this.directions.length; i++) 
		{
			this.deleteDirections(i);
		}
		this.directions = [];
	},
	deleteDirections: function(id) {
		this.directions[id].polyline.setMap(null);
		this.directions[id] = null;
	},
	setup: function(ele) {
		if (Array.isArray(ele.data)) {
			if (ele.initType == 3 && ele.data.length == 1) {
				closestAmbulanceFailed("There are no available ambulances for this ticket. Returning...");
				return;
			}
			ele.data.forEach((j, k) => {
				const o = map.markerprep(j);
				if (o.latlng) { map.addMarker(o.latlng, o); }
				if (o.type == 1 && (o.directions || o.dlatlng)) {
					map.addDirections(o.latlng, o.dlatlng, o.id, ele.initType, o);
				} else if (ele.initType == 3 && k > 0) {
					map.addDirections(o.latlng, map.ticket_markers[0].position, o.id, 3, o);
				}
			});
		} else { 
			popupMessage("Unable to load map, please hold.");
		}
		map.doBounding();
		ele.callback();
	},
	redraw: function(ele) { 
		if (Array.isArray(ele.data)) {
			var tmpdirections = map.directions;
			var tmpambo = map.ambulance_markers;
			var tmptkt = map.ticket_markers;
			map.directions = [];
			map.ambulance_markers = [];
			map.ticket_markers = [];
			ele.data.forEach((j, k) => {
				const o = map.markerprep(j);
				if (o.latlng) { map.addMarker(o.latlng, o); }
				if (o.type == 1 && (o.directions || o.dlatlng)) {
					map.addDirections(o.latlng, o.dlatlng, o.id, ele.initType, o);
				}
			});
			setTimeout(map.delaydelete, 1000, tmpdirections, tmpambo, tmptkt);
		} else { 
			popupMessage("Unable to load map, please hold.");
		}
	},
	delaydelete: function(a, b, c)
	{
		map.remDirectionsD(a);
		map.setMapMakersD(null, b);
		map.setMapMakersD(null, c);
	},
	markerprep: function(data) {
		const ambostatus = ["Out of Service", "Available", "Enroute", "Unavailable"];
		var obj = new Object();
		obj.dlatlng = null;
		obj.status = data.status;
		obj.type = data.markertype;
		obj.name = data.name;
		obj.title = data.name;
		obj.isFree = data.isFree;
		obj.lastupdate = data.lastupdate;
		obj.id = data.id;
		if ((data.loclat && data.loclng)) {
			obj.latlng = { "lat": data.loclat, "lng": data.loclng };
		} else if (data.lat && data.lng) {
			obj.latlng = { "lat": data.lat, "lng": data.lng };
		}
		if (obj.type == 1) {
			obj.title += ": "+ambostatus[obj.status]+"\n"+data.location;
			obj.clr = map.getRandomColor(obj.id);
			if (obj.isFree > 0) {
				obj.dlatlng = { "lat": data.dstlat, "lng": data.dstlng };
			}
		} else {
			obj.title += ": "+obj.status+"\n"+data.location;
			if (obj.isFree == 0) {
				obj.title += "\n"+"<a href='closestambulance.php?id="+obj.id+"'>Find Closest Ambulance</a>";
			} else {
				obj.clr = map.getRandomColor(obj.isFree);
			}
		}
		if (data.directions) {
			obj.directions = data.directions;
			obj.distance = data.distance;
			obj.duration = data.duration;
		}
		return obj;
	},
	addMarker: function(position, obj) {
		const amboji = "🚑";
		const endoji = "🏁";
		let lbl = "";
		let title = obj['title'];
		let icn = { url: "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=", labelOrigin: new google.maps.Point(10,10) };
		let typename = '';
		if (obj['type'] == 2) {
			//Hospitals
			typename = 'Hospital';
			console.log("Shouldn't be any hospitals yet");
		} else if (obj['type'] == 1) {
			//Ambulances
			lbl = amboji;
			typename = 'Ambulance';
			if (obj['status'] == "Out of Service" || obj['status'] == "Unavailable" || obj['status'] == 0 || obj['status'] == 3)
			{
				icn.url = icn.url+"%20|888888|000000";
			} else if (obj['status'] == "Available" || obj['status'] == 1)
			{
				icn.url = icn.url+"%20|00ff00|000000";
			} else {
				icn.url = icn.url+"%20|"+obj.clr.substring(1)+"|000000";	
			}
		} else if (obj['type'] == 0) {
			//Destinations
			lbl = endoji;
			typename = 'Ticket';
			if (obj['isFree'] == 0 || obj['clr'] == "#ff0000") {
				icn.url = icn.url+"%20|ff0000|000000";
			} else {
				//Figure out how to color it based on what ambo it's connected to.
				icn.url = icn.url+"%20|"+obj.clr.substring(1)+"|000000";
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
		marker.type = typename;
		marker.id = obj['id'];
		marker.isFree = obj['isFree'];
		marker.lastupdate = Math.floor((new Date(obj['lastupdate']).getTime())/1000);
		marker.addListener('click', () => this.infoWindowHandler(marker));
		if (obj['type'] == 1) {
			this.ambulance_markers.push(marker);
		} else if (obj['type'] == 0) {
			this.ticket_markers.push(marker);
		}
		//use this.ambulance_marker.find(x => x.id === 1) to return the object, or this.ambulance_marker.findIndex(x => x.id === 1);
		//this.doBounding();
	},
	addDirections: function(or, d, id, initType, o) {
		if (initType == 3) {
			this.directionPromises(or, d, id, initType, o);	
		} else {
			if (o.directions && o.distance && o.duration) {
				let r = google.maps.geometry.encoding.decodePath(o.directions);
				this.directionFake(or,d,id,initType,o, r);
			}
		}
	},
	directionFake: function(or, d, id, initType, o, r) {
		let route = {"id": id, "encodedpolyline":o.directions, "steps": r};
		route.start_location = route.steps[0];
		route.end_location = route.steps[route.steps.length-1];
		route.polyline = new google.maps.Polyline({
			map: this.map,
			path: route.steps,
			strokeColor: map.getRandomColor(id),
			strokeOpacity: 1.0,
			strokeWeight: 5,
		});
		route.distance = {'text':o.distance};
		route.duration = {'text':o.duration};
		const q = this.ambulance_markers.find(x => x.id === route.id);
		q.title += '\nDistance: '+o.distance+', Arrival time: '+ o.duration;
		this.directions.push(route);
		//this.doBounding();
	},
	directionPromises: function(or, d, id, initType, o) {
		this.promises++;
		this.promiseFunc = this.promiseFunc.then(() => {
			this.ds.route(
			{
				origin: or,
				destination: d,
				travelMode: google.maps.TravelMode.DRIVING,
			})
			.then((response) => {
				//Once we get them back, set the directions.
				let route = response.routes[0].legs[0];
				route.id = id;
				route.encodedpolyline = response.routes[0].overview_polyline;
				let polypath = [];
				for (var i = 0; i < route.steps.length; i++)
				{
					for (var j = 0; j < route.steps[i].path.length; j++)
					{
						polypath.push(route.steps[i].path[j]);
					}
				}
				route.polyline = new google.maps.Polyline({
					map: this.map,
					path: polypath,
					strokeColor: map.getRandomColor(id),
					strokeOpacity: 1.0,
					strokeWeight: 5,
				});
				const q = this.ambulance_markers.find(x => x.id === route.id);
				q.title += '\nDistance: '+route.distance.text+', Arrival time: '+ route.duration.text;
				const x = this.directions.find(x => x.id === route.id);
				this.directions.push(route);
				//this.doBounding();
				if (initType == 3) 
				{
					k = this.directions.length-1;
					if (document.getElementById("radioambo"+k)) {
						document.getElementById("radioambo"+k).value = o.id;
						var p = document.getElementById("ambo"+k).firstChild.nextElementSibling.nextElementSibling;
						p.innerHTML = o.name;
						p = p.nextElementSibling;
						p.innerHTML = map.directions[k].distance.text;
						p = p.nextElementSibling;
						p.innerHTML = map.directions[k].duration.text;
						p = p.nextElementSibling;
						if (map.directions[k].duration.value > 600) {
							p.innerHTML = "Warning - >10min response time - Inform caller";
							p.style.backgroundColor = '#f7baba';
						}
					}
				}
				this.promises--;
				return true;
			}).catch((e) => {
				this.promises--;
				console.log("Directions request failed -> " + e);
				if (this.promises == 0) {
					if (!this.directions.length && initType == 3) {
						//No directions added at all, after attempting many.
						closestAmbulanceFailed("Failure to find a direct route for any available ambulance. Returning...");
						return;
					}
				}
				return e;
			});
			return new Promise(function(resolve) {
				setTimeout(resolve, this.promiseInterval);
			});
		});
	},
};

//After defining what ddMap does, create a global instance of it.
var map = Object.create(ddMap);