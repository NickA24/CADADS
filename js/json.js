//This is just an example of doing asynchronous calls, or AJAX.
//We make our own handler function to start with (this would normally be found in a separate js file)
//We may in the future choose to use prebuilt options like JQuery to automate this stuff
//Though we should be careful about adding extra overhead that the ambo's have to deal with.
var doAJAX = function(url, params, callback) {
	var xhr = new XMLHttpRequest();
	if (!('method' in params)) { params.method = 'get'; }
	if (!('responseType' in params)) { params.responseType = 'json'; }
	if (params.get) {
		if (params.get('method')) { params.method = params.get('method'); }
		if (params.get('responseType')) { params.responseType = params.get('responseType'); }
	}
	xhr.open(params.method, url, true);
	xhr.responseType = params.responseType;
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

//XHR doesn't always play nice with some things? so attempt fetch instead.
var testFetch = function(url, params, callback) {
	fetch(url, params).then(response => {
		if (response.ok){
			return response.json();
		}else{
			return Promise.reject(response.status);
		}
	}).then(response => callback(response)).catch(err => console.log('Error with message: '+err));
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