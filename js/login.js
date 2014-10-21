$(document).ready(function(){

    	$('#registerSubmit').click(register);
    	$('#loginSubmit').click(aux);
		
		validator();
});

function aux() {
	login(false);
}

function register(){
      
	  if( !validatesRegister() )
	  	return;
		
      var vusername = $("#register-form").find("input[name='username']").val();
	  var vpwd = $("#register-form").find("input[name='password']").val();
	  var vname = $("#register-form").find("input[name='name']").val();
	  var vlastname = $("#register-form").find("input[name='lastname']").val();
	  var vgender = $("#register-form").find("input[name='gender']:checked").val();
	  var vdni = $("#register-form").find("input[name='dni']").val().replace(/\./g,"");
	  var vmail = $("#register-form").find("input[name='email']").val();
	  var vbirth = $("#register-form").find("input[name='bday']").val();
	  
	  var account = {
	  	
		username: vusername,
		password: vpwd,
		firstName: vname,
		lastName: vlastname,
		gender: vgender,
		identityCard: vdni,
		email: vmail,
		birthDate: vbirth	 
	  }
	  
      var regisAjax = {
         url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAccount&account='+JSON.stringify(account),
         dataType: 'jsonp',
         timeout: 6000,
		 error: function(x, t, m) {
        	if(t==="timeout") {
            	errorAction("Se agotó el tiempo para realizar la acción solicitada.");
        	}
    	}
      }; 
	  
	  $.ajax(regisAjax).done(postRegis);
}

function postRegis(resp) {

	if(resp.hasOwnProperty('error')){
		console.log(resp.error.code);
		var message;
		switch(resp.error.code) {
			case 104:
				message = "El nombre de usuario es inválido.";
				break;
			case 105:
				message = "La contraseña del usuario es inválida.";
				break;
			case 106:
				message = "El nombre es inválido.";
				break;
			case 107:
				message = "El apellido es inválido.";
				break;
			case 108:
				message = "El género es inválido.";
				break;
			case 109:
				message = "El género es inválido.";
				break;
			case 110:
				message = "El email es inválido.";
				break;
			case 111:
				message = "La fecha de nacimiento es inválida.";
				break;
			case 200:
				message = "El usuario ya existe.";
				break;
			case 201:
				message = "El DNI ya se encuentra en uso.";
				break;
			case 999:
			default:
				message = "Se produjo un error inesperado procesando la solicitud.";
				break;
		}
		errorAction(message);
	} else
		login(true);	
}

function login(special){
	
	  if( !special )
	  	if( !validateLogin() )
	  		return;
	
	if( !special ) {	
	  	var username = $("#login-form").find("input[name='username']").val();
	  	var pwd = $("#login-form").find("input[name='password']").val();
	} else {
		var username = $("#register-form").find("input[name='username']").val();
	  	var pwd = $("#register-form").find("input[name='password']").val();
	}
	  
      var signInAjax = {
         url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignIn&username='+
		 	username +'&password='+ pwd,
         dataType: 'jsonp',
         timeout: 6000,
		 error: function(x, t, m) {
        	if(t==="timeout") {
            	errorAction("Se agotó el tiempo para realizar la acción solicitada.");
        	}
    	}
      }; 
	  
	  $.ajax(signInAjax).done(postLogin);
}

function postLogin(resp) {
	if(resp.hasOwnProperty('error')){
		console.log(resp.error.code);
		var message;
		switch(resp.error.code) {
			case 101:
			case 104:
				message = "El usuario es inválido.";
				break;
			case 105:
				message = "La contraseña es inválida.";
				break;
			case 999:
			default:
				message = "Se produjo un error inesperado procesando la solicitud.";
				break;
		}
		errorAction(message);
	} else {
	
		localStorage.token = resp.authenticationToken;
		localStorage.username = resp.account.username;
	  
		var url = window.location.search.substring(1);
		if( typeof getUrlParameter("from") != "undefined" )	
			window.location.replace(getUrlParameter("from")+".html?"+url);
		else
			window.location.replace("index.html");
	}
};

function validateLogin() {
	
	validates = validateLoginUser();
	validates = validateLoginPwd();
	return validates;	
}

function validateLoginUser() {
	
	var validates = true; 
	var name = $("#login-form").find("input[name='username']").val();
	var parent = $("#login-form").find("input[name='username']").parent();
	parent.find('.field-error').remove();
	if( name.length == 0 ) {
		parent.append( 
			'<div class="field-error"> Se debe ingresar un nombre de usuario.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateLoginPwd() {
	
	var validates = true; 
	var name = $("#login-form").find("input[name='password']").val();
	var parent = $("#login-form").find("input[name='password']").parent();
	parent.find('.field-error').remove();
	if( name.length == 0 ) {
		parent.append( 
			'<div class="field-error"> Se debe ingresar una contraseña.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateRegisUser() {
	
	var validates = true; 
	var name = $("#register-form").find("input[name='username']").val();
	var parent = $("#register-form").find("input[name='username']").parent();
	parent.find('.field-error').remove();
	if( name.match(/[^a-zA-Z0-9]/g) != null && name.length != 0 ) {
		parent.append( 
			'<div class="field-error"> Debe contener sólo caracteres alfanuméricos.</div>'
		);
		validates = false;
	}
	if( name.length < 6  && name.length != 0 ) {
		parent.append( 
			'<div class="field-error"> Debe tener al menos 6 caracteres.</div>'
		);
		validates = false;
	}
	if( name.length > 15 ) {
		parent.append( 
			'<div class="field-error"> No debe tener más de 15 caracteres.</div>'
		);
		validates = false;
	}
	if( name.length == 0 ) {
		parent.append( 
			'<div class="field-error"> El campo es obligatorio.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateRegisPwd() {
	
	var validates = true; 
	var name = $("#register-form").find("input[name='password']").val();
	var parent = $("#register-form").find("input[name='password']").parent();
	parent.find('.field-error').remove();
	if( name.match(/[^a-zA-Z0-9]/g) != null ) {
		parent.append( 
			'<div class="field-error"> Debe contener sólo caracteres alfanuméricos.</div>'
		);
		validates = false;
	}
	if( name.length < 8 && name.length != 0 ) {
		parent.append( 
			'<div class="field-error"> Debe tener al menos 8 caracteres.</div>'
		);
		validates = false;
	}
	if( name.length > 15 ) {
		parent.append( 
			'<div class="field-error"> No debe tener más de 15 caracteres.</div>'
		);
		validates = false;
	}
	if( name.length == 0 ) {
		parent.append( 
			'<div class="field-error"> El campo es obligatorio.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateRegisRePwd() {
	
	var validates = true; 
	var name = $("#register-form").find("input[name='repassword']").val();
	var parent = $("#register-form").find("input[name='repassword']").parent();
	parent.find('.field-error').remove();
	if( name != $("#register-form").find("input[name='password']").val() ) {
		parent.append( 
			'<div class="field-error"> Las contraseñas no coinciden.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateRegisName() {
	
	var validates = true; 
	var name = $("#register-form").find("input[name='name']").val();
	var parent = $("#register-form").find("input[name='name']").parent();
	parent.find('.field-error').remove();
	if( name.match(/[^a-zA-Z]/g) != null ) {
		parent.append( 
			'<div class="field-error"> Debe contener sólo caracteres alfabéticos.</div>'
		);
		validates = false;
	}
	if( name.length > 80 ) {
		parent.append( 
			'<div class="field-error"> No debe tener más de 80 caracteres.</div>'
		);
		validates = false;
	}
	if( name.length == 0 ) {
		parent.append( 
			'<div class="field-error"> El campo es obligatorio.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateRegisLastname() {
	
	var validates = true; 
	var name = $("#register-form").find("input[name='lastname']").val();
	var parent = $("#register-form").find("input[name='lastname']").parent();
	parent.find('.field-error').remove();
	if( name.match(/[^a-zA-Z]/g) != null ) {
		parent.append( 
			'<div class="field-error"> Debe contener sólo caracteres alfabéticos.</div>'
		);
		validates = false;
	}
	if( name.length > 80 ) {
		parent.append( 
			'<div class="field-error"> No debe tener más de 80 caracteres.</div>'
		);
		validates = false;
	}
	if( name.length == 0 ) {
		parent.append( 
			'<div class="field-error"> El campo es obligatorio.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateRegisDNI() {
	
	var validates = true; 
	var name = $("#register-form").find("input[name='dni']").val();
	var parent = $("#register-form").find("input[name='dni']").parent();
	parent.find('.field-error').remove();
	if( name.match(/(^[1-9][0-9]?(\.[0-9]{3}){0,2}$)|(^[1-9][0-9]{2}(\.[1-9][0-9]{2})?$)/g) == null ) {
		parent.append( 
			'<div class="field-error"> Debe ser un DNI válido.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateRegisMail() {
	
	var validates = true; 
	var name = $("#register-form").find("input[name='email']").val();
	var parent = $("#register-form").find("input[name='email']").parent();
	parent.find('.field-error').remove();
	if( name.match(/^[a-zA-Z0-9_\.]+@[a-zA-Z0-9_\.]+\.[a-zA-Z]{2,4}$/g) == null && name.length != 0 ) {
		parent.append( 
			'<div class="field-error"> Debe ser un e-mail válido.</div>'
		);
		validates = false;
	}
	if( name.length > 128 ) {
		parent.append( 
			'<div class="field-error"> No debe tener más de 128 caracteres.</div>'
		);
		validates = false;
	}
	if( name.length == 0 ) {
		parent.append( 
			'<div class="field-error"> El campo es obligatorio.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateRegisBirth() {
	
	var validates = true; 
	var name = $("#register-form").find("input[name='bday']").val();
	var parent = $("#register-form").find("input[name='bday']").parent();
	parent.find('.field-error').remove();

	if( calculateAge(new Date(name)) < 16 ) {
		parent.append( 
			'<div class="field-error"> Debes ser mayor de 16 años.</div>'
		);
		validates = false;
	}
	if( name.length == 0 ) {
		parent.append( 
			'<div class="field-error"> El campo es obligatorio.</div>'
		);
		validates = false;
	}
	return validates;
}

function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function validateRegisGender() {
	
	var validates = true; 
	var name = $("#register-form").find("input[name='gender']:checked").val();
	var parent = $("#register-form").find("input[name='gender']").parent();

	if( name != "M" && name != "F" ) {
		parent.append( 
			'<div class="field-error"> Se debe seleccionar un género.</div>'
		);
		validates = false;
	}
	
	return validates;
}

function validatesRegister() {
	
	validates = validateRegisUser();
	validates = validateRegisPwd() && validates;
	validates = validateRegisRePwd() && validates;
	validates = validateRegisMail() && validates;
	validates = validateRegisDNI() && validates;
	validates = validateRegisName() && validates;
	validates = validateRegisLastname() && validates;
	validates = validateRegisBirth() && validates;
	validates = validateRegisGender() && validates;
	return validates;
}

function validator() {
	
	$("#login-form").find("input[name='username']").focusout(validateLoginUser);
	$("#login-form").find("input[name='password']").focusout(validateLoginPwd);
	$("#register-form").find("input[name='username']" ).focusout(validateRegisUser);
	$("#register-form").find("input[name='password']" ).focusout(validateRegisPwd);
	$("#register-form").find("input[name='repassword']" ).focusout(validateRegisRePwd);
	$("#register-form").find("input[name='email']" ).focusout(validateRegisMail);
	$("#register-form").find("input[name='dni']" ).focusout(validateRegisDNI);
	$("#register-form").find("input[name='name']" ).focusout(validateRegisName);
	$("#register-form").find("input[name='lastname']" ).focusout(validateRegisLastname);
	$("#register-form").find("input[name='bday']" ).focusout(validateRegisBirth);
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


   