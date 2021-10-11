<?php	include_once("./inc/login.php"); include_once("./inc/header.php"); if (checklogin() != 2) { return; } ?>
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
 console.log(str) 
}

  function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.05349, lng: -118.24532 },//over LA as default
          zoom: 8,
  });

  directionsRenderer.setMap(map);

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService
    .route({
      origin: {
        query: document.querySelector("#curCall > table > tbody > tr > td:nth-child(3)"),
      },
      destination: {
        query: document.querySelector("#curCall > table > tbody > tr > td:nth-child(6)"),
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + status));
}
</script>
  
   <!-- Async script executes immediately and must be after any DOM elements used in callback. -->
    <script
      src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&v=weekly"
      async
    ></script>
  
</body>
</html>
