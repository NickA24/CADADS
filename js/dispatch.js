
//This is an intermediate step in editing a dispatch ticket.
//When a user hits the edit button, it will take the ID of that entry and get the data for it using our getJSON function
//It will then edit all of the form fields listed below, tagged with an "edit" prefix and then the column designation.
//If we choose to do anything else fancy with regards to editing tickets, you'll change it here.
//Used: dispatch.php
//Input: e: form submission event
var editFormPrep = function(e)
{
	e.preventDefault();
	if (e.target.submitType.value == "editTicket" && e.target.editid.value > 0)
	{
		doAJAX('inc/getjson.php?tbl=editTicket&returnAmbo=1&id='+e.target.editid.value, {}, function(err, data) {
			if (err !== null) {
				alert("Error finding entry data:" + err);
			} else {
				data = data[0];
				document.getElementById("editid").value = data.id;
				document.getElementById("editidlabel").innerHTML = "<b>Id:"+data.id+"</b>";
				document.getElementById("editactive").value = data.active;
				document.getElementById("editname").value = data.name;
				document.getElementById("editlocation").value = data.location;
				document.getElementById("editincident_type").value = data.incident_type;
				document.getElementById("editpriority").value = data.priority;
				document.getElementById("editcomments").innerHTML = data.comments;
				const a = document.getElementById("editambulance");
				while (a.firstChild) {
				  a.removeChild(a.firstChild);
				}
				if (data.ambulance) {
					if (typeof data.ambulance == "number") {
						a.appendChild(new Option("Unable to be edited", data.ambulance, true));
						a.disabled = true;
					} else {
						a.disabled = false;
						data.ambulance.forEach(function(j){
							let n = j.name;
							if (j.assigned) { n += " - Assigned Ambo"; }
							let opt = new Option(n, j.id, j.assigned);
							a.appendChild(opt);
						});
					}
				} else {
					a.appendChild(new Option("No Ambulances Available", 0, 1));	
				}
			}
		});
	}
}
		
function confirmDeleteTicket(e) {
	e.preventDefault();
	if (confirm("Are you sure you want to delete?")) {
		this.submit();
		//Do submit
	} else { 
		console.log("Canceling delete function.");
		//Skipped	
	}
}
	
function openNavAdd() {
  document.getElementById("mySidenav").style.width = "31%";
}
/* Set the width of the side navigation to 0 */
function closeNavAdd() {
  document.getElementById("mySidenav").style.width = "0";
}

function openNavEdit() {
  document.getElementById("mySidenavEdit").style.width = "31%";
}
/* Set the width of the side navigation to 0 */
function closeNavEdit() {
  document.getElementById("mySidenavEdit").style.width = "0";
}
    
function searchTable() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("enter");
  filter = input.value.toUpperCase();
  table = document.getElementById("ambolist");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

window.addEventListener('load', () => {
    const button = document.querySelector('#clear');
    button.addEventListener('click', () => {
        document.querySelector('#enter').value = "";
    });
});

document.addEventListener('DOMContentLoaded', function(e) {
	const html = document.getElementsByTagName("html")[0].dataset;
	let params = new Object();
	params.initType = html.inittype;
	params.preferredMap = html.preferredMap;
	params.ticketId = 0;
	params.ele = "tickets";
	params.datamask = {};
	var x = document.getElementById(params.ele);
	ticketTable(x, 0, 1);
	loadInit(params);
});
