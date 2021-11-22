function dropdown() {
	document.getElementById("myDropdown").classList.toggle("show");
}

function dropdownMap() {
	document.getElementById("myDropdownMap").classList.toggle("show");
}
window.onclick = function(e) {
	if (!e.target.matches('.dropbtn')) {
		const myDropdown = document.getElementById("myDropdown");
		if (myDropdown && myDropdown.classList.contains('show')) {
			myDropdown.classList.remove('show');
		}
	}
	if (!e.target.matches('.dropbtnMap')) {
		const myDropdown2 = document.getElementById("myDropdownMap");
        if (myDropdown2 && myDropdown2.classList.contains('show')) {
			myDropdown2.classList.remove('show');
        }
	}
}

document.addEventListener('DOMContentLoaded', function(e) {
	const drop = document.getElementById("dropbtnList");
	const dropMap = document.getElementById("dropbtnMapList");
	if (drop) { 
		drop.addEventListener("click", function() { dropdown(); }); 
		Array.from(document.getElementsByClassName("service")).forEach((e) => {
			e.addEventListener("click", function(evt) {
				map.loc.getCurrentPosition((position) => {
					const ele = document.getElementById("curCall");
					evt.preventDefault();
					console.log("updating status");
					popupMessage("updating status");
					position.origin = document.getElementById("curCall").data[0].location;
					amboService(evt.target.attributes.data.nodeValue, position, ele, true);
				}, (error) => { console.log(error); }, {enableHighAccuracy: true, maximumAge: 30000, timeout: 5000});
			});
		});
	}
	if (dropMap) { 
		dropMap.addEventListener("click", function() { dropdownMap(); }); 
		Array.from(document.getElementsByClassName("mapStyle")).forEach((e) => {
			e.addEventListener("click", function(evt) {
				const params = new FormData();
				params.append("updateMapStyle", "true");
				params.append("mapID", evt.target.attributes.data.nodeValue);
				params.append('method', 'post');
				params.append('responseType', 'text');
				doAJAX('inc/login.php',params, function(err, data) {
					const msgbox = document.getElementById("msgBoxPopup");
					if (err !== null) {
						msgbox.innerHTML = err;
						console.log(err);
						if (popupMessage) { popupMessage("Error: " + err); }
					} else {
						msgbox.innerHTML = data;
						console.log("here");
						location.href = "index.php";
						window.location.reload(true);
					}
				});
			});
		});
	}
	

});