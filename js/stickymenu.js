function dropdown(a) { document.getElementById(a).classList.toggle("show"); }

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
	if (!e.target.matches('.dropbtnAdmin')) {
		const myDropdown3 = document.getElementById("myDropdownAdmin");
        if (myDropdown3 && myDropdown3.classList.contains('show')) {
			myDropdown3.classList.remove('show');
        }
	}
}

document.addEventListener('DOMContentLoaded', function(e) {
	const drop = document.getElementById("dropbtnList");
	const dropMap = document.getElementById("dropbtnMapList");
	const dropAdmin = document.getElementById("dropbtnAdminList");
	const sl = document.getElementById("searchlink");
	if (sl) {
		//sl.addEventListener("click", function(e) {
		//	e.preventDefault();
		//	document.getElementById("searchOptions").classList.toggle("show");
		//});
		sl.parentNode.addEventListener("click", function(e) {
			e.preventDefault();
			document.getElementById("searchOptions").classList.toggle("show");
		});
	}
	if (dropAdmin) {
		dropAdmin.addEventListener("click", function() { dropdown("myDropdownAdmin"); }); 
		Array.from(document.getElementsByClassName("adminFn")).forEach((e) => {
			e.addEventListener("click", function(evt) {
				const adduser = document.getElementById("AddUser");
				const listuser = document.getElementById("ListUsers");
				const edituser = document.getElementById("EditUser");
				const editbutton = document.getElementById("EditUserList");
				const deletebutton = document.getElementById("DeleteUserList");
				switch(evt.target.dataset.x) 
				{
					case "0":
						console.log("0");
						adduser.classList.add("show");
						listuser.classList.remove("show");
						edituser.classList.remove("show");
						break;
					case "1":
						console.log("1");
						adduser.classList.remove("show");
						listuser.classList.add("show");
						edituser.classList.remove("show");
						editbutton.classList.add("show");
						deletebutton.classList.remove("show");
						break;
					case "2":
						console.log("2");
						adduser.classList.remove("show");
						listuser.classList.add("show");
						edituser.classList.remove("show");
						editbutton.classList.remove("show");
						deletebutton.classList.add("show");
						break;
					default:
						console.log(evt.target.dataset.x == 0);
				}
			});
		});
	}
	if (drop) { 
		drop.addEventListener("click", function() { dropdown("myDropdown"); }); 
		Array.from(document.getElementsByClassName("service")).forEach((e) => {
			e.addEventListener("click", function(evt) {
				evt.preventDefault();
				console.log("updating status");
				popupMessage("updating status");
				updateCurrentPos().then(amboService(evt.target.attributes.data.nodeValue));
			});
		});
	}
	if (dropMap) { 
		dropMap.addEventListener("click", function() { dropdown("myDropdownMap"); }); 
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