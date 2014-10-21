<<<<<<< HEAD
$(document).ready(function() {

	$("#wishlist-btn").click(wishlistButton);
	$("#cart-btn").click(cartButton);
	$("#user-btn").click(userButton);
	$("#suscribe-btn").click(suscribeButton);
	$("#search-btn").prop("disabled", true);
	$("input[name='gender']").click(enableButton);
	
	if( getUrlParameter("logout") == "yes" ) {
		console.log("hear");
		localStorage.clear();	
	}

	var genderTitle;
		if( getUrlParameter("gender") == "Masculino" && getUrlParameter("edad") == "Adulto") {
			genderTitle = "Hombre";
		}
		if( getUrlParameter("gender") == "Femenino" && getUrlParameter("edad") == "Adulto") {
			genderTitle = "Mujer";
		}
		if( getUrlParameter("gender") == "Masculino" && getUrlParameter("edad") == "Bebe") {
			genderTitle = "Niños";
		}
		if( getUrlParameter("gender") == "Femenino" && getUrlParameter("edad") == "Bebe") {
			genderTitle = "Niñas";
		}
	
	$("#gender").append(genderTitle);
	
});

function wishlistButton() {
	console.log(localStorage.username);
	
	if( typeof localStorage.token != "undefined" && typeof localStorage.username != "undefined" ) {
		window.location.replace("wish_list.html");
	} else {
		var from = window.location.pathname.match(/[a-zA-Z0-9_]+\.html/);
		from = from[0].replace(/\.html/g, "");
		window.location.replace("login.html?from="+from);	
	}
}

function cartButton() {
	console.log(localStorage.username);
	
	if( typeof localStorage.token != "undefined" && typeof localStorage.username != "undefined" ) {
		window.location.replace("cart.html");
	} else {
		var from = window.location.pathname.match(/[a-zA-Z0-9_]+\.html/);
		from = from[0].replace(/\.html/g, "");
		window.location.replace("login.html?from="+from);	
	}
}

function userButton() {
	$("#user-dropdown").empty();
	if( typeof localStorage.token != "undefined" && typeof localStorage.username != "undefined" ) {
		$("#user-dropdown").append(
			'<li role="presentation"><a role="menuitem" tabindex="-1" href="account.html">Mi cuenta</a></li>'+
			'<li role="presentation"><a role="menuitem" tabindex="-1" href="gestion_pedidos.html">Mis pedidos</a></li>'+
			'<li role="presentation"><a role="menuitem" tabindex="-1" href="index.html?logout=yes">Salir</a></li>'
		);
	} else {
		var from = window.location.pathname.match(/[a-zA-Z0-9_]+\.html/);
		from = from[0].replace(/\.html/g, "");	
		$("#user-dropdown").append(
			'<li role="presentation"><a role="menuitem" tabindex="-1" href="login.html?from='+from+'">Registrarse/<br>Acceder</a></li>'
		);	
	}	
}

function enableButton() {
	$("#search-btn").prop("disabled", false);	
}

function suscribeButton() {
	if($("#suscribebar").val().length > 0 && $("#suscribebar").val().match(/^[a-zA-Z0-9_\.]+@[a-zA-Z0-9_\.]+\.[a-zA-Z]{2,4}$/g) != null )
		successAction("La suscripción se ha realizado correctamente.");
	else
		errorAction("El e-mail ingresado no es válido.");	
}

function errorAction(message) {
	
	createPopUpDivs();
	var type = "#error-popup";
	showPopUp(type, message);
	setTimeout(function() {fadeoutPopUp(type)}, 2500);
	setTimeout(function() {removePopUp(type)}, 3500);
}

function alertAction(message) {
	
	createPopUpDivs();
	var type = "#alert-popup";
	showPopUp(type, message);
	setTimeout(function() {fadeoutPopUp(type)}, 2500);
	setTimeout(function() {removePopUp(type)}, 3500);
}


function successAction(message) {
	
	createPopUpDivs();
	var type = "#success-popup";
	showPopUp(type, message);
	setTimeout(function() {fadeoutPopUp(type)}, 2500);
	setTimeout(function() {removePopUp(type)}, 3500);
}

function showPopUp(type, message) {
	
	$(type).find(".popup-text").empty();
	$(type).find(".popup-text").append(message);
	$(type).addClass("fade-in");
	$(type).css("visibility", "visible");

}

function fadeoutPopUp(type) {
	
	$(type).removeClass("fade-in");
	$(type).addClass("fade-out");
}

function removePopUp(type) {

	$(type).css("visibility", "hidden");
	$(type).removeClass("fade-out");
}

function fadeinPopUp(type) {
	
	$(type).addClass("fade-in");	
}

function createPopUpDivs() {
	$("#sucess-popup").remove();
	$("#error-popup").remove();
	
	$("#container").append(
		'<div id="success-popup">'+
			'<img src="images/check.png" width="30" height="30" alt="OK" />'+
			'<span class="popup-text"></span>'+
		'</div>'+
		'<div id="alert-popup">'+
			'<img src="images/alert.png" width="30" height="30" alt="Warning" />'+
			'<span class="popup-text"></span>'+
		'</div>'+
		'<div id="error-popup">'+
			'<img src="images/error.png" width="30" height="30" alt="Error" />'+
			'<span class="popup-text"></span>'+
		'</div>'
	);
}

function getUrlParameter(name) {
   var url = window.location.search.substring(1);
   var urlVariables = url.split('&');
   for (var i = 0; i < urlVariables.length; i++){
      var parameterName = urlVariables[i].split('=');
      if (parameterName[0] == name){
         return parameterName[1];
      }
   }
}


=======
$(document).ready(function() {

	$("#wishlist-btn").click(wishlistButton);
	$("#cart-btn").click(cartButton);
	$("#user-btn").click(userButton);
	$("#suscribe-btn").click(suscribeButton);
	$("#search-btn").prop("disabled", true);
	$("input[name='gender']").click(enableButton);
	
	if( getUrlParameter("logout") == "yes" ) {
		console.log("hear");
		localStorage.clear();	
	}

	var genderTitle;
		if( getUrlParameter("gender") == "Masculino" && getUrlParameter("edad") == "Adulto") {
			genderTitle = "Hombre";
		}
		if( getUrlParameter("gender") == "Femenino" && getUrlParameter("edad") == "Adulto") {
			genderTitle = "Mujer";
		}
		if( getUrlParameter("gender") == "Masculino" && getUrlParameter("edad") == "Bebe") {
			genderTitle = "Niños";
		}
		if( getUrlParameter("gender") == "Femenino" && getUrlParameter("edad") == "Bebe") {
			genderTitle = "Niñas";
		}
	
	$("#gender").append(genderTitle);
	
	$('#search-btn').click(function(event){		
		event.preventDefault();
		var query = $('#searchbar').val();
		var gender = $('#search-genders input:checked').val();		
		window.location.replace('search.html?gender='+ gender +'&page=1&name='+ query);
	});
	
});

function wishlistButton() {
	console.log(localStorage.username);
	
	if( typeof localStorage.token != "undefined" && typeof localStorage.username != "undefined" ) {
		window.location.replace("wish_list.html");
	} else {
		var from = window.location.pathname.match(/[a-zA-Z0-9_]+\.html/);
		from = from[0].replace(/\.html/g, "");
		window.location.replace("login.html?from="+from);	
	}
}

function cartButton() {
	console.log(localStorage.username);
	
	if( typeof localStorage.token != "undefined" && typeof localStorage.username != "undefined" ) {
		window.location.replace("cart.html");
	} else {
		var from = window.location.pathname.match(/[a-zA-Z0-9_]+\.html/);
		from = from[0].replace(/\.html/g, "");
		window.location.replace("login.html?from="+from);	
	}
}

function userButton() {
	$("#user-dropdown").empty();
	if( typeof localStorage.token != "undefined" && typeof localStorage.username != "undefined" ) {
		$("#user-dropdown").append(
			'<li role="presentation"><a role="menuitem" tabindex="-1" href="account.html">Mi cuenta</a></li>'+
			'<li role="presentation"><a role="menuitem" tabindex="-1" href="gestion_pedidos.html">Mis pedidos</a></li>'+
			'<li role="presentation"><a role="menuitem" tabindex="-1" href="index.html?logout=yes">Salir</a></li>'
		);
	} else {
		var from = window.location.pathname.match(/[a-zA-Z0-9_]+\.html/);
		from = from[0].replace(/\.html/g, "");	
		$("#user-dropdown").append(
			'<li role="presentation"><a role="menuitem" tabindex="-1" href="login.html?from='+from+'">Registrarse/<br>Acceder</a></li>'
		);	
	}	
}

function enableButton() {
	$("#search-btn").prop("disabled", false);	
}

function suscribeButton() {
	if($("#suscribebar").val().length > 0 && $("#suscribebar").val().match(/^[a-zA-Z0-9_\.]+@[a-zA-Z0-9_\.]+\.[a-zA-Z]{2,4}$/g) != null )
		successAction("La suscripción se ha realizado correctamente.");
	else
		errorAction("El e-mail ingresado no es válido.");	
}

function errorAction(message) {
	
	createPopUpDivs();
	var type = "#error-popup";
	showPopUp(type, message);
	setTimeout(function() {fadeoutPopUp(type)}, 2500);
	setTimeout(function() {removePopUp(type)}, 3500);
}

function alertAction(message) {
	
	createPopUpDivs();
	var type = "#alert-popup";
	showPopUp(type, message);
	setTimeout(function() {fadeoutPopUp(type)}, 2500);
	setTimeout(function() {removePopUp(type)}, 3500);
}


function successAction(message) {
	
	createPopUpDivs();
	var type = "#success-popup";
	showPopUp(type, message);
	setTimeout(function() {fadeoutPopUp(type)}, 2500);
	setTimeout(function() {removePopUp(type)}, 3500);
}

function showPopUp(type, message) {
	
	$(type).find(".popup-text").empty();
	$(type).find(".popup-text").append(message);
	$(type).addClass("fade-in");
	$(type).css("visibility", "visible");

}

function fadeoutPopUp(type) {
	
	$(type).removeClass("fade-in");
	$(type).addClass("fade-out");
}

function removePopUp(type) {

	$(type).css("visibility", "hidden");
	$(type).removeClass("fade-out");
}

function fadeinPopUp(type) {
	
	$(type).addClass("fade-in");	
}

function createPopUpDivs() {
	$("#sucess-popup").remove();
	$("#error-popup").remove();
	
	$("#container").append(
		'<div id="success-popup">'+
			'<img src="images/check.png" width="30" height="30" alt="OK" />'+
			'<span class="popup-text"></span>'+
		'</div>'+
		'<div id="alert-popup">'+
			'<img src="images/alert.png" width="30" height="30" alt="Warning" />'+
			'<span class="popup-text"></span>'+
		'</div>'+
		'<div id="error-popup">'+
			'<img src="images/error.png" width="30" height="30" alt="Error" />'+
			'<span class="popup-text"></span>'+
		'</div>'
	);
}

function getUrlParameter(name) {
   var url = window.location.search.substring(1);
   var urlVariables = url.split('&');
   for (var i = 0; i < urlVariables.length; i++){
      var parameterName = urlVariables[i].split('=');
      if (parameterName[0] == name){
         return parameterName[1];
      }
   }
}


>>>>>>> d33678a532ca416e1349c39dc00ea8c8a52d2dcc
