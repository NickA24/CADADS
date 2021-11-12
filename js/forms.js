// This javascript file contains all functions that are related to the creation, editing, and posting of form data for our program


//This is a more all-purpose function to create a table display
//Used: dispatch.php, ambulance.php, admin.php
//It accepts 3 inputs:
//ele: an HTML element to be used for displaying the table
//data: this is JSON data, probably returned from getjson.php
//config: for passing arguments. 
//		-->addEditData - 	boolean value. 1(true): specifically for displaying multiple tickets, it will use colspan:3
//							This allows one table header to cover the three table columns of id, edit, and delete.
//							Also returns the Edit and Delete buttons for each table in the ID section.
//		-->CreateTable - 	boolean value. Creates the table object.
//		-->CreateHeader-	boolean value. Creates a header section.
//		-->CreateBody  -	boolean value. Creates the body. If false, just assigns the data to the element.
//		--TableID	   -	String. Assigns an ID to the main table object for easy access.
//		-->HeadID	   -	String. Assigns an ID to the table head for easy access.
//		-->BodyID	   -	String. Assigns an ID to the table body for easy access.
//		-->DataMask	   -	numbered array. Will output only the data selected, in order it is numbered in the array.

var createJSTable = function(ele, data, config)
{
	//The majority of this is using createelement to make the html nodes
	//It's kind of monotonous but it's just one way to generate this stuff
	//We auto-generate the header data off the JSON object's keys.
	var headdata = Object.keys(data[0]);
	
	
	//CreateBody is handled here. Also references bodyID 
	if (config.createBody) {
		var tbody = document.createElement('tbody');
		if (config.bodyID) { tbody.setAttribute("id", config.bodyID); }
		if (!config.createTable) { ele.appendChild(tbody); }
	}
	

	//Header creation here. Also references headID, dataMask, and addEditData
	if (config.createHeader) {
		var thead = document.createElement('thead');
		if (config.headID) { thead.setAttribute("id", config.headID); }
		var tr = document.createElement('tr');
		tr.setAttribute("class", "main-info");
		tr.setAttribute("id", "mainInfo");
		thead.appendChild(tr);
		if (config.dataMask) {
			for (var i = 0; i < config.dataMask.length; i++) {
				var td = document.createElement("th");
				td.setAttribute("class", "header_" + config.dataMask[i]);
				td.innerHTML = config.dataMask[i];
				tr.appendChild(td);
				if(config.dataMask[i] == "id" && config.addEditData === 1)
				{
					td.innerHTML = "";
					td.setAttribute("colspan", 3);
				}
			}
		} else {
			for (var i = 0; i < headdata.length; i++) {
				var td = document.createElement("th");
				td.setAttribute("class", "header_" + headdata[i]);
				td.innerHTML = headdata[i];
				tr.appendChild(td);
				if(headdata[i] == "id" && config.addEditData === 1)
				{
					td.innerHTML = "";
					td.setAttribute("colspan", 3);
				}
			}
		}
		if (!config.createTable) { ele.appendChild(thead); }
	}
	
	//Table creation, also references tableID and links up head and body if needed.
	if (config.createTable) {
		var table = document.createElement('table');
		table.setAttribute("class", "table1");
		if (config.tableID) { table.setAttribute("id", config.tableID); }
		if (thead) { table.appendChild(thead); }
		if (tbody) { table.appendChild(tbody); }
		ele.appendChild(table);
	}
	
	//This generates the table itself.
	data.forEach(function(j, v) {
		//Here we're iterating through the object itself.
		//Note each one is listed as 0:{array} so we're stripping out the number first
		var tr = document.createElement("tr");
		tr.setAttribute("class", "markerZoom rows_" + v);
		tr.setAttribute("src", j["id"]);
		if (config.createBody) { tbody.appendChild(tr); } else { ele.appendChild(tr); }
		
		//If there is a dataMask available, create the table in that order
		if (config.dataMask.length > 0) {
			for (var i = 0; i < config.dataMask.length; i++) {
				var td = document.createElement("td");
				td.setAttribute("class", "info_" + i);
				td.innerHTML = j[config.dataMask[i]];	
				tr.appendChild(td);
				if (config.dataMask[i] == "id" && config.addEditData === 1)
				{
					td.innerHTML = '';
					var td2 = document.createElement("td");
					var form1 = document.createElement("form");
					form1.setAttribute("name","editform"+j[config.dataMask[i]]);
					form1.setAttribute("id","editform"+j[config.dataMask[i]]);
					form1.setAttribute("class", "leftContainer");
					form1.setAttribute("method", "post");
					form1.setAttribute("action", "inc/submit.php");
					var hid1 = document.createElement("input");
					hid1.setAttribute("type", "hidden");
					hid1.setAttribute("name", "submitType");
					hid1.setAttribute("id", "submitType");
					hid1.setAttribute("value", "editTicket");
					var hid2 = document.createElement("input");
					hid2.setAttribute("type", "hidden");
					hid2.setAttribute("name","editid");
					hid2.setAttribute("id","editid");
					hid2.setAttribute("value",j[config.dataMask[i]]);
					var btn1 = document.createElement("button");
					btn1.setAttribute("type", "submit");
					btn1.setAttribute("class", "edButton");
					btn1.setAttribute("class", "edButton-primary");
					btn1.setAttribute("onclick", "openNavEdit()");
					btn1.innerHTML = "Edit";
					form1.appendChild(hid1);
					form1.appendChild(hid2);
					form1.appendChild(btn1);
					td2.appendChild(form1);
					tr.appendChild(td2);
					form1.addEventListener('submit', editFormPrep);
					var td3 = document.createElement("td");
					var form2 = document.createElement("form");
					form2.setAttribute("name","deleteform"+j[config.dataMask[i]]);
					form2.setAttribute("id","deleteform"+j[config.dataMask[i]]);
					form2.setAttribute("method", "post");
					form2.setAttribute("action", "inc/submit.php");
					var hid3 = document.createElement("input");
					hid3.setAttribute("type", "hidden");
					hid3.setAttribute("name", "submitType");
					hid3.setAttribute("id", "submitType");
					hid3.setAttribute("value", "deleteTicket");
					var hid4 = document.createElement("input");
					hid4.setAttribute("type","hidden");
					hid4.setAttribute("name","deleteid");
					hid4.setAttribute("id","deleteid");
					hid4.setAttribute("value",j[config.dataMask[i]]);
					var btn2 = document.createElement("button");
					btn2.setAttribute("type", "submit");
					btn2.setAttribute("class", "edButton");
					btn2.setAttribute("class", "edButton-primary");
					btn2.innerHTML = "Delete";
					form2.appendChild(hid3);
					form2.appendChild(hid4);
					form2.appendChild(btn2);
					td3.appendChild(form2);
					form2.addEventListener('submit', confirmDeleteTicket);
					tr.appendChild(td3);
				}
			}
		} else {
		//If there isn't a dataMask, just iterate through it all.
			for (var k in j) {
				//K is the associated key, so we use that to get the value from the arrray
				var td = document.createElement("td");
				td.setAttribute("class", "info_" + k);
				td.innerHTML = j[k];	
				tr.appendChild(td);
				if (k == "id" && config.addEditData === 1)
				{
					td.innerHTML = '';
					var td2 = document.createElement("td");
					var form1 = document.createElement("form");
					form1.setAttribute("name","editform"+j[k]);
					form1.setAttribute("id","editform"+j[k]);
					form1.setAttribute("class", "leftContainer");
					form1.setAttribute("method", "post");
					form1.setAttribute("action", "inc/submit.php");
					var hid1 = document.createElement("input");
					hid1.setAttribute("type", "hidden");
					hid1.setAttribute("name", "submitType");
					hid1.setAttribute("id", "submitType");
					hid1.setAttribute("value", "editTicket");
					var hid2 = document.createElement("input");
					hid2.setAttribute("type", "hidden");
					hid2.setAttribute("name","editid");
					hid2.setAttribute("id","editid");
					hid2.setAttribute("value",j[k]);
					var btn1 = document.createElement("button");
					btn1.setAttribute("type", "submit");
					btn1.setAttribute("class", "edButton");
					btn1.setAttribute("class", "edButton-primary");
					btn1.setAttribute("onclick", "openNavEdit()");
					btn1.innerHTML = "Edit";
					form1.appendChild(hid1);
					form1.appendChild(hid2);
					form1.appendChild(btn1);
					td2.appendChild(form1);
					tr.appendChild(td2);
					form1.addEventListener('submit', editFormPrep);
					var td3 = document.createElement("td");
					var form2 = document.createElement("form");
					form2.setAttribute("name","deleteform"+j[k]);
					form2.setAttribute("id","deleteform"+j[k]);
					form2.setAttribute("method", "post");
					form2.setAttribute("action", "inc/submit.php");
					var hid3 = document.createElement("input");
					hid3.setAttribute("type", "hidden");
					hid3.setAttribute("name", "submitType");
					hid3.setAttribute("id", "submitType");
					hid3.setAttribute("value", "deleteTicket");
					var hid4 = document.createElement("input");
					hid4.setAttribute("type","hidden");
					hid4.setAttribute("name","deleteid");
					hid4.setAttribute("id","deleteid");
					hid4.setAttribute("value",j[k]);
					var btn2 = document.createElement("button");
					btn2.setAttribute("type", "submit");
					btn2.setAttribute("class", "edButton");
					btn2.setAttribute("class", "edButton-primary");
					btn2.innerHTML = "Delete";
					form2.appendChild(hid3);
					form2.appendChild(hid4);
					form2.appendChild(btn2);
					td3.appendChild(form2);
					form2.addEventListener('submit', confirmDeleteTicket);
					tr.appendChild(td3);
				}
			}
		}
	});
}

//This generates the ticket table automatically for us.
//The initial use case is when you toggle the Show Inactive button, it will grab fresh data from the db using our getJSON function
//and then display it by creating a DOM table with javascript.
//The messier code at the bottom checks if it is the ID field being created, and generates two buttons alongside it, Edit and Delete
//This gives us the data in an easy format to allow the user to edit or delete information later.
//Used: dispatch.php, admin.php
//Inputs: ele: Document element to display table in
//showOld: Boolean. Toggles whether to show inactive data as well
//edit: Boolean. Toggles whether to combine the ID column into 3 columns. Read createJSTable for more info.
var ticketTable = function(ele, showOld, edit)
{
	doAJAX('inc/getjson.php?tbl=tkt&showinactive='+showOld, new Object(), function(err, data) {
		if (err !== null) {
			ele.innerHTML = "Oops, error:" + err;
			if (popupMessage) { popupMessage("Error: " + err); }
		} else if (data !== null) {
			var p = 0;
			let config = new Object();
			config.addEditData = 0;
			config.createTable = true;
			config.createHeader = true;
			config.createBody = true;
			config.bodyID = "ambobody";
			config.dataMask = ["name", "location", "incident_type", "priority"];
			if (edit === 1) { config.addEditData = 1; }
			createJSTable(ele, data, config);
		}
	});
}

var ticketTable2 = function(ele, showOld, edit)
{
	doAJAX('inc/getjson.php?tbl=tkt&showinactive='+showOld, new Object(), function(err, data) {
		if (err !== null) {
			ele.innerHTML = "Oops, error:" + err;
			if (popupMessage) { popupMessage("Error: " + err); }
		} else if (data !== null) {
			var p = 0;
			let config = new Object();
			config.addEditData = 0;
			config.createTable = true;
			config.createHeader = true;
			config.createBody = true;
			config.bodyID = "ambobody";
			config.dataMask = ["id", "ambulance", "time", "comments"];
			if (edit === 1) { config.addEditData = 1; }
			createJSTable(ele, data, config);
		}
	});
}
