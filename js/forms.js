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
	
	

	

	//Header creation here. Also references headID, dataMask, and addEditData
	if (config.createHeader) {
		var thead = document.createElement('thead');
		if (config.headID) { thead.setAttribute("id", config.headID); }
		var tr = document.createElement('tr');
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
		ele.appendChild(table);
	}
	
	//This generates the table itself.
	data.forEach(function(j, v) {
			//CreateBody is handled here. Also references bodyID 
		var tbody = document.createElement('tbody');
		tbody.setAttribute("id", j.id);
		tbody.setAttribute("class", "markerZoom");
		if (!config.createTable) { ele.appendChild(tbody); } else { table.append(tbody); }
		//Here we're iterating through the object itself.
		//Note each one is listed as 0:{array} so we're stripping out the number first
		var tr = document.createElement("tr");
		tr.setAttribute("class", "rows_" + v);
		tr.setAttribute("src", j["id"]);
		tr.setAttribute("id", "row_0_"+j["id"]);
		tbody.appendChild(tr);
		
		//If there is a dataMask available, create the table in that order
		if (config.dataMask.length > 0) {
			for (var i = 0; i < config.dataMask.length; i++) {
				tableCreation(tr, i, config.dataMask[i], j[config.dataMask[i]], config.addEditData);
			}
			if (config.dataMask2nd && config.dataMask2nd.length > 0) {
				tr = document.createElement("tr");
				tr.setAttribute("class", "hidden inner_row rows_"+v);
				tr.setAttribute("src", j["id"]);
				tr.setAttribute("id", "row_1_"+j["id"]);
				tbody.appendChild(tr);
				for (var i = 0; i < config.dataMask2nd.length; i++) {
					
					tableCreation(tr, i, config.dataMask2nd[i], j[config.dataMask2nd[i]], config.addEditData);
				}
			}
		} else {
		//If there isn't a dataMask, just iterate through it all.
			for (var k in j) {
				tableCreation(tr, k, k, j[k], config.addEditData);
			}
		}
	});
}

var tableCreation = function(tr, i, j ,k, aed) {
	var td = document.createElement("td");
	td.setAttribute("class", "info_" + i);
	td.setAttribute("id", "info_"+i+"_"+tr.getAttribute("src"));
	if (j == "comments" && k.length > 100) {
		td.innerHTML = k.substring(0, 100)+"...<a href='ticket.php?id="+tr.getAttribute("src")+"'><em>Read More</em></a>";
	} else { td.innerHTML = k; }
	tr.appendChild(td);
	if (j == "id" && aed === 1)
	{
		td.innerHTML = '';
		var form1 = document.createElement("form");
		form1.setAttribute("name","editform"+k);
		form1.setAttribute("id","editform"+k);
		form1.setAttribute("style", "display: inline");
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
		hid2.setAttribute("value",k);
		var btn1 = document.createElement("a");
		btn1.setAttribute("type", "submit");
		btn1.setAttribute("onclick", "openNavEdit(); this.parentNode.dispatchEvent(new Event('submit', {'bubbles':true, 'cancelable':true}));");
		btn1.setAttribute("class", "fa fa-edit");
		form1.appendChild(hid1);
		form1.appendChild(hid2);
		form1.appendChild(btn1);
		td.appendChild(form1);
		td.appendChild(document.createTextNode(' '));
		form1.addEventListener('submit', editFormPrep);
		var form2 = document.createElement("form");
		form2.setAttribute("style", "display: inline");
		form2.setAttribute("name","deleteform"+k);
		form2.setAttribute("id","deleteform"+k);
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
		hid4.setAttribute("value",k);
		var btn2 = document.createElement("a");
		btn2.setAttribute("type", "submit");
		btn2.setAttribute("class", "fa fa-trash");
		btn2.setAttribute("onclick", "this.parentNode.dispatchEvent(new Event('submit', {'bubbles':true, 'cancelable':true}));");
		form2.appendChild(hid3);
		form2.appendChild(hid4);
		form2.appendChild(btn2);
		td.appendChild(form2);
		form2.addEventListener('submit', confirmDeleteTicket);
	}
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
			config.tableID = "ambolist";
			config.dataMask = ["name", "location", "incident_type", "ambulance"];
			config.dataMask2nd = ["id", "comments", "priority", "time"];
			if (edit === 1) { config.addEditData = 1; }
			createJSTable(ele, data, config);
			//config.dataMask = ["id", "priority", "time", "comments"];
			//config.createTable = false;
		}
	});
}
