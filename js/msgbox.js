
function toggleMessageBox() {
	const msgBox = document.getElementById("msgBoxPopup");
	const q = msgBox.classList.toggle('show');
	if (q) {
		setTimeout("toggleMessageBox()", 5000);
	}
}

function popupMessage(msg)
{
	const msgBox = document.getElementById("msgBoxPopup");
	if (msgBox) { msgBox.innerHTML = msg; }
}

var observer;
document.addEventListener('DOMContentLoaded', function(e) {
	const msgBox = document.getElementById("msgBoxPopup");
	if (msgBox) {
		if (msgBox.innerHTML !== '')
		{
			toggleMessageBox();
		}
		observer = new MutationObserver(function(mutationsList, observer) {
			toggleMessageBox();
		});
		observer.observe(msgBox, {characterData: false, childList: true, attributes: false});
	}
});