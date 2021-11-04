//This is our login script for the main page, when we are not logged in already.
//Used: loginform.html
//Placed in this file as loginform uses json but not any of the forms.js scripts.
//input: e: form submission event
var loginsubmit = function(e)
{
	e.preventDefault();
	let params = new FormData(e.target);
	params.method = e.target.method;
	params.responseType = 'text';
	doAJAX('inc/login.php',params, function(err, data) {
		let msgbox = document.getElementById("msgBox");
		if (err !== null) {
			msgbox.innerHTML = err;
			console.log(err);
		} else {
			if (data == "Success!") {
				msgbox.innerHTML = data;
				location.href = "index.php";
				window.location.reload(true);
			} else {
				msgbox.innerHTML = data;
			}
		}
	});
}

function toggleMessages() {
	const Loggingin = document.getElementById("loggingIN");
	const msgbox = document.getElementById("msgBox");
	Loggingin.classList.toggle('visible');
	msgbox.classList.toggle('visible');
}

document.addEventListener('DOMContentLoaded', function(e) {
	document.getElementById("loginbox").addEventListener('submit', loginsubmit, false);
	var login = document.getElementById("loginbtn");
    login.onclick = function() {
        toggleMessages();
		setTimeout("toggleMessages()", 3000);
    }
	
});
