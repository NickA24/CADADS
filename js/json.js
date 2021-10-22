//This is just an example of doing asynchronous calls, or AJAX.
//We make our own handler function to start with (this would normally be found in a separate js file)
//We may in the future choose to use prebuilt options like JQuery to automate this stuff
//Though we should be careful about adding extra overhead that the ambo's have to deal with.
var getJSON = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.responseType = 'json';
	xhr.onload = function()
		{
			var status = xhr.status;
			if (status == 200) {
				callback(null, xhr.response);
			} else {
				callback(status, xhr.response);
			}
		};
	xhr.send();
}

var postJSON = function(url, params, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('post', url, true);
	xhr.onload = function()
		{
			var status = xhr.status;
			if (status == 200) {
				callback(null, xhr.response);
			} else {
				callback(status, xhr.response);
			}
		};
	xhr.send(params);
}

var testFetch = function(url, params, callback) {
	fetch(url, params).then(response => {
		if (response.ok){
			return response.json();
		}else{
			return Promise.reject(response.status);
		}
	}).then(response => callback(response)).catch(err => console.log('Error with message: '+err));
}




//This is our login script for the main page, when we are not logged in already.
//Used: loginform.html
//Placed in this file as loginform uses json but not any of the forms.js scripts.
//input: e: form submission event
var loginsubmit = function(e)
{
	e.preventDefault();
	const msgbox = document.getElementById("msgBox");
	const params = new FormData(e.target)
	postJSON('inc/login.php',params, function(err, data) {
		if (err !== null) {
			msgbox.innerHTML = err;
		} else {
			if (data == "Success!") {
				msgbox.innerHTML = data;
				location.href = "index.php";
				window.location.reload(true);
			} else {
				msgbox.innerHTML = data;
			}
		}
		setTimeout("document.getElementById('msgBox').style.display='none';", 2000);
	});
}
