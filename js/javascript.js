// JavaScript Document

window.onload = function() {

		hide_piso();

    	var casaRadio = document.getElementById('casa');
    	var dptoRadio = document.getElementById('departamento');

    	casaRadio.onclick = hide_piso;
    	dptoRadio.onclick = show_piso;
}

function hide_piso() {
    	var pisoBox = document.getElementById('piso');
		pisoBox.style.visibility = "hidden";
}

function show_piso() {
    	var pisoBox = document.getElementById('piso');
		pisoBox.style.visibility = "visible";
}

function enable_edit(){
		document.getElementById('name').disabled = false;
		document.getElementById('email').disabled = false;
		document.getElementById('birth-date').disabled = false;
		
		document.getElementById('save-btn').style.visibility = 'visible';
		document.getElementById('cancel-btn').style.visibility = 'visible';
		document.getElementById('edit-btn').style.visibility = 'hidden';
}

function save_edit(){
		document.getElementById('name').disabled = true;
		document.getElementById('email').disabled = true;
		document.getElementById('birth-date').disabled = true;
		
		document.getElementById('save-btn').style.visibility = 'hidden';
		document.getElementById('cancel-btn').style.visibility = 'hidden';
		document.getElementById('edit-btn').style.visibility = 'visible';
}

function cancel_edit(){
		document.getElementById('name').disabled = true;
		document.getElementById('email').disabled = true;
		document.getElementById('birth-date').disabled = true;
		
		document.getElementById('save-btn').style.visibility = 'hidden';
		document.getElementById('cancel-btn').style.visibility = 'hidden';
		document.getElementById('edit-btn').style.visibility = 'visible';
}
