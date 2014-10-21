/* TODO: cuando ingreso campos correctos en el form no hace nada */
/* ver porq no anda $('form').submit(function(){});   */

function getUrlParameterByName(name) {
   var url = window.location.search.substring(1);
   var urlVariables = url.split('&');
   for (var i = 0; i < urlVariables.length; i++){
      var parameterName = urlVariables[i].split('=');
      if (parameterName[0] == name){
         return parameterName[1];
      }
   }
};

var showResponse = function( resp ) {
  console.log(resp);
};

var storeToken = function( resp ) {
  localStorage.token = resp.authenticationToken;
  localStorage.username = resp.account.username;
  document.location.hash = "close";
  console.log(resp);
};

/*--- Create Account ---*/

/*--- LogInOut  ---*/

$(document).ready(function(){
   
   $('#userMenu button').click(function( event ){ /* TODO: cambiar el div id="user-menu" por "userMenu" en todos lados (los - te cagan el js) */
      event.preventDefault();
      
      if (localStorage.token !== undefined) {
         document.location.hash = "logout";
      }else{
         document.location.hash = "login";
      }
      
   });
   
   
   
   
   /*--- SingOut ---*/  /* TODO: Crear el css y html de div id="logout" */
   $('#logoutSubmit').click(function(){ /* TODO: porq me puedo deslogear dos veces seguidas con el mismo token? no deberia tirar error el servidor? */
         
         var logoutAjax = {
            url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignOut&username='+ localStorage.username +'&authentication_token='+ localStorage.token,
            dataType: 'jsonp',
            timeout: 6000,
            success: showResponse
         };
         
         $.ajax(logoutAjax).done(function(){ /* TODO: manejo de errores */
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            document.location.hash = "close";
         });
         
   });
   
});




