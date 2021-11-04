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
					testFetch('inc/googlereversegeocode.php?returntext=1&id='+ele.data.id+'&lat='+position.coords.latitude+'&lng='+position.coords.longitude, {}, (data) => {
						position.origin = data.address;
						evt.preventDefault();
						amboService(evt.target.attributes.data.nodeValue, position, ele);
					});
				}, (error) => { console.log(error); }, {enableHighAccuracy: false, maximumAge: 5000});
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
						location.href = "index.php";
						window.location.reload(true);
					}
				});
			});
		});
	}
	

});