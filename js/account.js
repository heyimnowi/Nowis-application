/*! jQuery v1.11.1 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */

$('document').ready(function(){
	
	var showResponse = function( resp ) {
	  console.log(resp);
	};
	
	$.ajax({
		url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAccount&username=' + localStorage.username + '&authentication_token=' + localStorage.token,
		dataType: 'jsonp',
        timeout: 6000,
        
	}).done(function(resp){
		$("#user-name").append(resp.account.username);
		$("#name").attr("placeholder", resp.account.firstName);
		$("#lastname").attr("placeholder", resp.account.lastName);
		$("#email").attr("placeholder", resp.account.email);
		$("#bday").attr("placeholder", resp.account.birthDate);
		$("#gender-g").attr("placeholder", resp.account.gender);
		$("#identityCard").attr("placeholder", resp.account.identityCard);
	
	});
	
	
	//Editar Cambios
	$("#edit-btn").click( function( event ){
		event.preventDefault();
	
		$(".form-control").attr('disabled', false);
		$(".apply").css('visibility', 'visible');
		$(this).hide();
	
	});
	
	// Guardar Cambios
		//Primero checkea que haya cambios
	function aux(firstName, lastName, gender, identityCard, email, birthDate){
		var form = document.getElementById('form');	
		if( form.lastname.value != '' ){
			lastName = form.lastname.value;
		};
		if( form.gender.value != '' ){
			gender = form.gender.value;
		};
		if( form.identityCard.value != '' ){
			identityCard = form.identityCard.value;
		};
		if( form.email.value != '' ){
			email = form.email.value;
		};
		if( form.bday.value != '' ){
			birthDate = form.bay.value;
		};
		
		var accountInfo = {
	      firstName : firstName,
	      lastName : lastName,
	      gender : gender,
	      identityCard: identityCard,
	      email: email,
	      birthDate : birthDate
	    };	
	    console.log(JSON.stringify(accountInfo)); 
	    return JSON.stringify(accountInfo);
	}


	function seeChanges(){	
		$.ajax({
			url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAccount&username=' + localStorage.username + '&authentication_token=' + localStorage.token,
			dataType: 'jsonp',
	        timeout: 6000,
	        
		}).done(function(resp){
			var firstName = resp.account.firstName;
			var lastName = resp.account.lastName;
			var gender = resp.account.gender;
			var identityCard = resp.account.identityCard;
			var email = resp.account.email;
			var birthDate = resp.account.birthDate;
			var rta = aux(firstName, lastName, gender, identityCard, email, birthDate);
		
			var accountAjax = {
           		url:'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=UpdateAccount&username=' + localStorage.username + '&authentication_token=' + localStorage.token + '&account=' + rta,
           		dataType: 'jsonp',
           		timeout: 6000,
           		success: showResponse 
       		};
       
      		$.ajax(accountAjax);
		
		});
	}
	
		
	$('#save-btn').click(function(  ){
      
            
      $("#edit-btn").show();
      $(this).css('visibility','hidden');
      
       var form = document.getElementById('form');
       
       var accountInfo = seeChanges();
       
       console.log(JSON.stringify(accountInfo));    
       
       $(".form-control").attr('disabled', true);
       $(".apply").css('visibility', 'hidden');
       
	});
	
	// Descartar Cambios
	$('#cancel-btn').click(function(  ){
		$("#edit-btn").show();
		$(".form-control").attr('disabled', true);
       	$(".apply").css('visibility', 'hidden');
	});
	
	
	// Cambiar Contraseña
	
	$("#pwd-btn").click(function(){
		$( "#dialog-pwd" ).show("slow");
    	$(this).css('visibility', 'hidden');
    		
  	})
	
	$(".close-pwd").click(function(){
		$("#pwd-btn").css('visibility', 'visible');
		$( "#dialog-pwd" ).hide("slow");
	})
	
	
	
	$("#changePwd").click(function(){
		var actualPass = $('input[name="actualPwd"]').val();
		
		$.ajax({ 
			url:'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignIn&username='+localStorage.username+'&password='+actualPass,
			dataType:'jsonp',
			timeout:3000
		}).done( function(resp){
			
			if( actualPass == ''){
				$("#actualPwd").css('border', '1px solid #781351');
			}else if( !(jQuery.type(resp.error) === "undefined") ){
				if( resp.error.code == 105 || resp.error.code == 101){
					console.log(resp.error.code);
					$(this).parent().append(
						'<div class="field-error"> Las contraseña es incorrecta.</div>'
					);
					$("#actualPwd").css('border', '1px solid #781351');
				}			
			}else if( $('input[name="newPwd"]').val() == '' ){
				$("#newPwd").css('border', '1px solid #781351');
			} else if( $('input[name="confirmPwd"]').val() == '' ){
				$("#confirmPwd").css('border', '1px solid #781351');
			}else if( $('input[name="confirmPwd"]').val() != $('input[name="newPwd"]').val() ){
				$(this).parent().append(
					'<div class="field-error"> Las contraseñas no coinciden.</div>'
				);
				$("#confirmPwd").css('border', '1px solid #781351');
				$("#newPwd").css('border', '1px solid #781351');
			}else{
				$.ajax({
				url:'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=ChangePassword&username='+ localStorage.username +'&password=' + actualPass +'&new_password='+ $("#newPwd"),
	        	dataType:'jsonp',
	        	timeout: 3000
	        	}).done(function(resp){
	        		console.log(resp);
	        		$( "#dialog-pwd" ).slideUp();
	        		$("#pwd-btn").show();
	        	});	
	        		
			}
			
			
		
		} );	
	
	})
	
	
	
	// Agregar Direccion de Envio
	
	function addProvinces() {
	
		var provincesAjax =  {
			url: 'http://eiffel.itba.edu.ar/hci/service3/Common.groovy?method=GetAllStates',
	        dataType: 'jsonp',
	        timeout: 3000
		};
		
		$.ajax(provincesAjax).done(function( resp ){
				
	        $.each(resp.states, appendProvince);
	    });	
	}

	function appendProvince(index, province) {
	
		$('select[name="provincia"]').append(
			'<option value="'+province.stateId+'">'+province.name+'</option>'
		);
	}
	

	
		
		$("#add-direction").click(function(){
			$( "#dialog" ).show("slow");
	    	addProvinces();	
	  	})
		
		$(".close-direction").click(function(){
			$( "#dialog" ).hide("slow");
		})
	
	function searchProvinceName(letter){
		var provincesAjax =  {
		url: 'http://eiffel.itba.edu.ar/hci/service3/Common.groovy?method=GetAllStates',
        dataType: 'jsonp',
        timeout: 3000
	};
	
	localStorage.provinceLetter = letter;
	var provName = $.ajax(provincesAjax).done(function( resp ){
			
		for(key in resp.states) {
			var province = resp.states[key];
			if(  province.stateId == localStorage.provinceLetter ) {
				localStorage.provinceName = province.name;
			}
		}    
    });
	
	return localStorage.provinceName;
	}
	
	function provinceName(provinceId, states){
		if( JSON.stringify(states.stateId) == JSON.stringify(provinceId) )
			return JSON.stringify(sates.name);
	}
	
	// Submit Direccion de Envio
	
	$("#addSubmit").click(function() {
		if( $(".field").val() == '' ){
			alert("Hay campos incompletos.");
		} else {
			$("#direction-table").append(
			'<tr>'+
            	'<td>'+
                	'<img src="images/direccion.png"  height="30" width="30" alt=""/>'+
                '</td>'+
                '<td>'+
                	'<strong>Nombre:</strong>' + $("#aName").val() + '<br>' +
                    '<strong>Dirección:</strong>' + $("#aStreet").val() + ' ' + $("#aNumber").val() + ', ' + searchProvinceName( $("#aProvince").val() ) +
                    '<hr>'+
                    '<td id="'+resp.id+'">'+
                        '<button type="button" class="btn btn-default" >'+
                            '<span class="glyphicon glyphicon-trash"></span>'+
                        '</button>'+
          		  	'</td>' +
                '</td>'+
             '</tr>'
			);
			$( "#dialog" ).slideUp();
			deleteDirection( $("#"+resp.id), resp.id);

			var form2 = document.getElementById('form2');

			var addressInfo = {
	           name: form2.aName.value,
	           street: form2.aStreet.value,
	           number: form2.aNumber.value,
	           province : form2.aProvince.value,
	           city: form2.aProvince.value,
	           zipCode: form2.aZipCode.value,
	           phoneNumber: form2.aPhoneNumber.value   
	       };

		
			console.log(JSON.stringify(addressInfo));
			
	       var addAddressAjax = {
	           url:'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAddress&username=' + localStorage.username + '&authentication_token=' + localStorage.token +'&address=' + JSON.stringify(addressInfo),
	           dataType: 'jsonp',
	           timeout: 6000,
	           success: showResponse 
    	   };
       
       		$.ajax(addAddressAjax);

		
		
		}
	});
	
	//Cargar direcciones de envio
	
	var idDirections;
	
	$.ajax({
        url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllAddresses&username='+ localStorage.username +'&authentication_token='+ localStorage.token,
        dataType: 'jsonp',
        timeout: 3000    
    }).done(function( resp ){
        $.each(resp.addresses, function(index, addr){
           $.ajax({
                url:'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAddressById&username='+ localStorage.username +'&authentication_token='+ localStorage.token +'&id='+ addr.id,
                dataType: 'jsonp',
                timeout: 3000
            }).done(function( resp ){
                $("#direction-table").append(
					'<tr>'+
            			'<td>'+
                			'<img src="images/direccion.png"  height="30" width="30" alt=""/>'+
                		'</td>'+
                		'<td>'+
                			'<strong>Nombre:</strong>' + resp.address.name + '<br>' +
                    		'<strong>Dirección:</strong>' + resp.address.street + ' ' + resp.address.number + ', ' + searchProvinceName(resp.address.province) +
                    	'<hr>'+
                		'</td>'+
                		'<td id="'+addr.id+'">'+
	                        '<button type="button" class="btn btn-default" >'+
	                            '<span class="glyphicon glyphicon-trash"></span>'+
	                        '</button>'+
              		  	'</td>' +
             		'</tr>'
				);
				console.log(resp);
				deleteDirection( $("#"+addr.id), addr.id);
                });
            });
        });

	//Eliminar Direccion de envio
	
	function deleteDirection(btn, idAddr){
		btn.click( function(){
			btn.parent().detach();
			$.ajax({
		        url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=DeleteAddress&username='+ localStorage.username +'&authentication_token='+ localStorage.token +'&id=' + idAddr,
		        dataType: 'jsonp',
		        timeout: 6000    
		    }).done(function(resp){
		    	console.log(resp);
		    });
			
		});
	}



	//Agregar Tarjetas
	
	
	$("#add-card").click(function(){
			$( "#dialogCard" ).show("slow");
	    	addProvinces();	
	  	})
		
	$(".close-card").click(function(){
		$( "#dialogCard" ).hide("slow");
	})
	
	//Submit Tarjetas
	
	$("#addSubmitCard").click(function() {
			if( !validatesNewCard() )
				return false;	
				
			var credit_card = {
				 number: $( "input[name='number']" ).val(),
				 expirationDate: $( "input[name='expirationDate']" ).val().replace("/", ""),
				 securityCode: $( "input[name='securityCode']" ).val()
			};				
			var cardAjax =  {
				url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateCreditCard&username='+	localStorage.username +'&authentication_token='+ localStorage.token+'&credit_card='+JSON.stringify(credit_card),
				dataType: 'jsonp',
		        timeout: 3000
			};
				
			$.ajax(cardAjax).done( function(resp) {
				$("#card-table").append(
					'<tr>'+
		            	'<td>'+
		                	'<img src="images/tarjeta.png"  height="30" width="30" alt=""/>'+
		                '</td>'+
		                '<td >'+
		                	'<strong>Número:</strong>' + $("#cNumber").val().substr(0,4) + ' ...  ' + $("#cNumber").val().substr($("#cNumber").val().length - 4) +  '<br>' +
		                    '<strong>Vencimiento:</strong>' + $("#cExpDate").val() + '<br>' +
		                    '<hr>'+
		                '</td>'+
		                '<td id="'+resp.id+'">'+
		                        '<button type="button" class="btn btn-default" >'+
		                            '<span class="glyphicon glyphicon-trash"></span>'+
		                        '</button>'+
		                '</td>' +
		             '</tr>'
				);
				assignId( $("#"+resp.id), resp.id);
				$( "#dialogCard" ).slideUp();
				console.log(resp);	
			});
	})
		
		function validatesNewCard() {
			validates = validateNumber();
			validates = validateExpiry() && validates;
			validates = validateCode() && validates;
			return validates;
		}
		
		function validator() {
			
			$( "input[name='number']" ).focusout(validateNumber);
			$( "input[name='expirationDate']" ).focusout(validateExpiry);
			$( "input[name='securityCode']" ).focusout(validateCode);
			
		}
		
		
		function validateNumber() {
			
			var validates = true; 
			var name = $( "input[name='number']" ).val();
			var error = $("#cNumber");
			var type = $("#cBrand").val();
			var parent = $( "input[name='number']" ).parent();
		
			if( name.length != 0 ) {
				if( type == "american" && name.match(/^((34)|(37))[0-9]{13}$/g) == null ) {
					$("#cNumber").css('border', '1px solid #781351');
					validates = false;
				}
				if( type == "diners" && name.match(/^(36)[0-9]{14}$/g) == null ) {
					$("#cNumber").css('border', '1px solid #781351');
					validates = false;
				}
				if( type == "mastercard" && name.match(/^((51)|(52)|(53))[0-9]{14}$/g) == null ) {
					$("#cNumber").css('border', '1px solid #781351');
					validates = false;
				}
				if( type == "visa" && name.match(/^4(([0-9]{12})|([0-9]{15}))$/g) == null ) {
					$("#cNumber").css('border', '1px solid #781351');
					validates = false;
				}
			}
			if( name.length == 0 ) {
				$("#cNumber").css('border', '1px solid #781351');
				validates = false;
			}
			return validates;
		}
		
		function validateExpiry() {
			
			var validates = true; 
			var name = $( "input[name='expirationDate']" ).val();
			var parent = $( "input[name='expirationDate']" ).parent();
			if( name.length != 0 && name.match(/[0-9][0-9]\/[0-9][0-9]/g) == null ) {
				$("#cExpDate").css('border', '1px solid #781351');
				validates = false;
				return validates;
			}
			if( name.length == 0 ) {
				$("#cExpDate").css('border', '1px solid #781351');
				validates = false;
			}
			var month = name.split("/")[0];
			var year = name.split("/")[1];
			
			if( month < 1 || month > 12 || year < 14 ) {
				$("#cExpDate").css('border', '1px solid #781351');
				validates = false;
			}
			return validates;
		}
		
		function validateCode() {
			
			var validates = true; 
			var name = $( "input[name='securityCode']" ).val();
			var parent = $( "input[name='securityCode']" ).parent();
			
			if( name.match(/[^0-9]/g) != null ) {
				$("#cSecCode").css('border', '1px solid #781351');
				validates = false;
				return validates;
			}
			if( name.length != 0 && name.length != 3 && $("#cBrand").val() != 'Amex') {
				$("#cSecCode").css('border', '1px solid #781351');
				validates = false;
			}
			if( name.length != 0 && name.length != 4 && $("#cBrand").val() != 'Amex') {
				$("#cSecCode").css('border', '1px solid #781351');
				validates = false;
			}
			if( name.length == 0 ) {
				$("#cSecCode").css('border', '1px solid #781351');
				validates = false;
			}
			return validates;
		}

	//Cargar Tarjetas
	
	function addExistingCards() {
	
		var cardsAjax =  {
			url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllCreditCards&username='+
				localStorage.username +'&authentication_token='+ localStorage.token,
        	dataType: 'jsonp',
        	timeout: 3000
		};
			
		$.ajax(cardsAjax).done(function( resp ){
	
	        $.each(resp.creditCards, appendCard);
	    });
	}
	
	function appendCard(index, resp) {
		
		 $("#card-table").append(
			'<tr>'+
            	'<td>'+
                	'<img src="images/tarjeta.png"  height="30" width="30" alt=""/>'+
                '</td>'+
                '<td >'+
                	'<strong>Número:</strong>' + resp.number.substr(0,4) + ' ...  ' + resp.number.substr(resp.number.length - 4) + '<br>' +
                    '<strong>Vencimiento:</strong>' + resp.expirationDate + '<br>' +
                    '<hr>'+
                '</td>'+
                '<td id="'+resp.id+'">'+
                        '<button type="button" class="btn btn-default" >'+
                            '<span class="glyphicon glyphicon-trash"></span>'+
                        '</button>'+
                '</td>' +
             '</tr>'
		);
		assignId( $("#"+resp.id), resp.id);      
	}
	
	addExistingCards();
	
	//Eliminar Tarjeta
	
	function assignId(btn, idCard){
		btn.click( function(){
			btn.parent().detach();
			$.ajax({
		        url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=DeleteCreditCard&username='+ localStorage.username +'&authentication_token='+ localStorage.token +'&id=' + idCard,
		        dataType: 'jsonp',
		        timeout: 6000    
		    }).done(function(resp){
		    	console.log(resp);
		    });
			
		});
	}
	
	
	
});