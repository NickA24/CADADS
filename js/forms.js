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
	
	if (!data || !data[0]) { return ; }
	//The majority of this is using createelement to make the html nodes
	//It's kind of monotonous but it's just one way to generate this stuff
	//We auto-generate the header data off the JSON object's keys.
	var headdata = Object.keys(data[0]);
	
	

	

	//Header creation here. Also references headID, dataMask, and addEditData
	if (config.createHeader) {
		var thead = document.createElement('thead');
		thead.setAttribute("class", "head");
		if (config.headID) { thead.setAttribute("id", config.headID); }
		var tr = document.createElement('tr');
		thead.appendChild(tr);
		if (config.dataMask) {
			for (var i = 0; i < config.dataMask.length; i++) {
				var td = document.createElement("th");
				td.setAttribute("class", "header_" + config.dataMask[i]);
				td.innerHTML = config.dataMask[i];
				if (config.dataMask[i] == "name") {
					td.innerHTML = "Caller";	
				}
				else if (config.dataMask[i] == "incident_type") {
					td.innerHTML = "Type";	
				}
				else if (config.dataMask[i] == "id") {
					td.innerHTML = "Edit";	
				} 
				else if (config.dataMask[i] == "priorityText") {
					td.innerHTML = "Priority";
				}
				else if (config.dataMask[i] == "incident_description") {
					td.innerHTML = "Desc."	
				}
				tr.appendChild(td);
			}
			if (config.dataMask2nd) {
				var tr = document.createElement('tr');
				tr.setAttribute("class", "header");  //add back in hidden inner_row to class if you want it to hide with the other stuff
				thead.appendChild(tr);
				for (var i = 0; i < config.dataMask2nd.length; i++) {
					var td = document.createElement("th");
					td.setAttribute("class", "header_" + config.dataMask2nd[i]);
					td.innerHTML = config.dataMask2nd[i];
					if (config.dataMask2nd[i] == "name") {
						td.innerHTML = "Caller";	
					}
					else if (config.dataMask2nd[i] == "incident_type") {
						td.innerHTML = "Type";	
					}
					else if (config.dataMask2nd[i] == "id") {
						td.innerHTML = "Edit";	
					}
					else if (config.dataMask2nd[i] == "priorityText") {
						td.innerHTML = "Priority";
					}
					else if (config.dataMask2nd[i] == "incident_description") {
						td.innerHTML = "Desc."	
					}
					tr.appendChild(td);
				}
				if (config.dataMask2nd.length < config.dataMask.length)
				{
					let x = config.dataMask.length - config.dataMask2nd.length;
					for (var i = 0; i < x; i++) {
						var td = document.createElement("th");
						td.setAttribute("class", "header_x_" + i);
						td.innerHTML = '';
						tr.appendChild(td);
					}
				}
			}
		} else {
			for (var i = 0; i < headdata.length; i++) {
				var td = document.createElement("th");
				td.setAttribute("class", "header_" + headdata[i]);
				td.innerHTML = headdata[i];
				tr.appendChild(td);
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
		if (config.newTicket) {
			ele.classList.add("oncall");
		} else {
			ele.classList.remove("oncall");
		}
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
				if (typeof map !== 'undefined' && config.dataMask[i] == "color") {
					j[config.dataMask[i]] = map.getRandomColor(j['ambo_id']);		
				}
				if (typeof map !== 'undefined' && config.dataMask[i] == "ambulance" && j[config.dataMask[i]] == "None") {
					tbody.classList.add("unlinked");
				}
				tableCreation(tr, i, config.dataMask[i], j[config.dataMask[i]], config.addEditData);
			}
			if (config.dataMask2nd && config.dataMask2nd.length > 0) {
				tr = document.createElement("tr");
				tr.setAttribute("class", "hidden inner_row rows_"+v);
				if (j.id == reloadid) {
					tr.classList.remove("hidden");
				}
				tr.setAttribute("src", j["id"]);
				tr.setAttribute("id", "row_1_"+j["id"]);
				tbody.appendChild(tr);
				for (var i = 0; i < config.dataMask2nd.length; i++) 
				{	
					if (typeof map !== 'undefined' && config.dataMask2nd[i] == "color") {
						j[config.dataMask2nd[i]] = map.getRandomColor(j['ambo_id']);	
					}
					if (typeof map !== 'undefined' && config.dataMask2nd[i] == "ambulance" && j[config.dataMask2nd[i]] == "None") {
						tbody.classList.add("unlinked");
					}
					tableCreation(tr, i, config.dataMask2nd[i], j[config.dataMask2nd[i]], config.addEditData);
				}
				if (config.dataMask2nd.length < config.dataMask.length)
				{
					let x = config.dataMask.length - config.dataMask2nd.length;
					for (var i = 0; i < x; i++) {
						tableCreation(tr, i, '', '', false);
					}
				}
			}
		} else {
		//If there isn't a dataMask, just iterate through it all.
			for (var k in j) {
				tableCreation(tr, k, k, j[k], config.addEditData);
			}
		}
		if (config.addComments && j['comments'] && j['comments'].length > 1) {
			tr = document.createElement("tr");
			tr.setAttribute("class", "hidden inner_row rows_"+v);
			if (j.id == reloadid) {
				tr.classList.remove("hidden");
			}
			tr.setAttribute("src", j["id"]);
			tr.setAttribute("id", "row_comment_"+j["id"]);
			tbody.appendChild(tr);
			var td = document.createElement("td");
			td.setAttribute("class", "info_comments");
			td.setAttribute("colspan", "100%");
			td.setAttribute("id", "info_comments_"+tr.getAttribute("src"));
			if (j['comments'].length > 100) {
				td.innerHTML = "<b>Comments:</b> "+j['comments'].substring(0, 100)+"...<a href='ticket.php?id="+tr.getAttribute("src")+"'><em>Read More</em></a>";
			} else { td.innerHTML = "<b>Comments:</b> "+j['comments']; }
			tr.appendChild(td);
			tbody.appendChild(tr);
		}
	});
}

var tableCreation = function(tr, i, j ,k, aed) {
	var td = document.createElement("td");
	td.setAttribute("class", "info_" + i);
	td.setAttribute("id", "info_"+i+"_"+tr.getAttribute("src"));
	if (j == "comments" && k.length > 100) {
		td.innerHTML = k.substring(0, 100)+"...<a href='ticket.php?id="+tr.getAttribute("src")+"'><em>Read More</em></a>";
	} else if (j == "color") {
		td.innerHTML = '';
		var span = document.createElement("div");
		span.innerHTML = '';
		span.setAttribute('style', 'background-color:'+k);
		span.setAttribute("class", "pathColor");
		td.appendChild(span);
	} else { td.innerHTML = k; }
	tr.appendChild(td);
	if (j == "id" && aed === 1)
	{
		td.innerHTML = '';
		if (tr.parentNode.classList.contains("unlinked"))
		{
			var aaa = document.createElement("a");
			aaa.setAttribute("type", "submit");
			aaa.setAttribute("href", "closestambulance.php?id="+k);
			aaa.setAttribute("title", "Choose closest ambulance for this ticket");
			aaa.setAttribute("class", "fa fa-ambulance linkformat");
			aaa.setAttribute("onclick", "");
			aaa.innerHTML = '';
			td.appendChild(aaa);
		}
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
		btn1.setAttribute("title", "Edit this Ticket");
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
		btn2.setAttribute("title", "Delete this Ticket");
		btn2.setAttribute("onclick", "this.parentNode.dispatchEvent(new Event('submit', {'bubbles':true, 'cancelable':true}));");
		form2.appendChild(hid3);
		form2.appendChild(hid4);
		form2.appendChild(btn2);
		td.appendChild(form2);
		form2.addEventListener('submit', confirmDeleteTicket);
	}
}
