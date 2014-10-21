var count = 0;

$(document).ready(function(){

    	$('#efectivo').click(hide_card);
    	$('#tarjeta-credito').click(show_card);
		$( "#cash-btn" ).click(payWithCash);
		$( "#existing-card-btn" ).click(addCardToOrder);
		$( "#new-card-btn" ).click(createCard);
		
		validator();
		
		showCartItems();
});

function payWithCash() {
	window.location.replace("confirm.html?method=cash");	
}

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

function appendCard(index, card) {
	
	$('select[name="card"]').append(
		'<option value="'+card.id+'">'+card.number+'</option>'
	);
}

function showCartItems() {
	
	var ordersAjax =  {
		url: 'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetAllOrders&username='+
			localStorage.username +'&authentication_token='+ localStorage.token,
        dataType: 'jsonp',
        timeout: 3000
	};
		
	$.ajax(ordersAjax).done(function( resp ){
			
        $.each(resp.orders, appendOrderItems);
    });
}

function appendOrderItems(index, order){
			
	if( order.status == 1 ) {
				
		var singleOrderAjax = {
			url:'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username='+
				localStorage.username +'&authentication_token='+ localStorage.token +'&id='+ order.id,
			dataType: 'jsonp',
			timeout: 3000
		};
				
		$.ajax(singleOrderAjax).done(function( resp ){
			var sum = 0;
			localStorage.orderId = resp.order.id;
			for(key in resp.order.items) {
				var item = resp.order.items[key];
				appendItem(item);	
				sum+=item.price;
			}
			$("#total-price").append("Total: $"+sum);
		});	
	}
}

function appendItem(item) {

		$('#cart-products-table').append(
			'<tr>'+
				'<td>'+
					'<img src="'+ item.product.imageUrl +'" alt="'+ item.product.name +'" width="100" height="125" />'+
				'</td>'+
            	'<td>'+
            		'<p class="product-name">'+ item.product.name +'</p>'+
                	'<p>'+
                	'<br />Precio: $'+item.price+
                	'<br />Cantidad: 1'+item.quantity+
                	'</p>'+
				'</td>'+
			'</tr>'
		);
		return item.price;
}

function createCard() {
	if( !validatesNewCard() )
		return;
		
		
	var card = {
		 "number": $( "input[name='numero']" ).val(),
		 "expirationDate": $( "input[name='vencimiento']" ).val().replace("/", ""),
		 "securityCode": $( "input[name='codigo']" ).val(),
	}
	localStorage.cardNames = $( "input[name='nombres']" ).val();
	localStorage.cardLastNames = $( "input[name='apellidos']" ).val();
	localStorage.cardDNI = $( "input[name='dni']" ).val();
		
	var cardAjax =  {
		url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateCreditCard&username='+
			localStorage.username +'&authentication_token='+ localStorage.token+'&credit_card='+JSON.stringify(card),
        dataType: 'jsonp',
        timeout: 3000
	};
		
	$.ajax(cardAjax).done( function(resp) {

		addCardToOrderById(resp.creditCard.id, true);	
	});
}

function validatesNewCard() {
	validates = validateNumber();
	validates = validateExpiry() && validates;
	validates = validateCode() && validates;
	validates = validateName() && validates;
	validates = validateLastName() && validates;
	validates = validateDNI() && validates;
	return validates;
}

function validator() {
	
	$( "input[name='numero']" ).focusout(validateNumber);
	$( "input[name='vencimiento']" ).focusout(validateExpiry);
	$( "input[name='codigo']" ).focusout(validateCode);
	$( "input[name='nombres']" ).focusout(validateName);
	$( "input[name='apellidos']" ).focusout(validateLastName);
	$( "input[name='dni']" ).focusout(validateDNI);
}

function validateExistingCard() {
	
	var validates = true;
	var name = $( "#card-select" ).val();
	var parent = $( "#card-select" ).parent();
	parent.find('.field-error').remove();
	if( name == "none" ) {
		parent.append( 
			'<div class="field-error"> Debe selecccionar una tarjeta de crédito.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateNumber() {
	
	var validates = true; 
	var name = $( "input[name='numero']" ).val();
	var parent = $( "input[name='numero']" ).parent();
	parent.find('.field-error').remove();
	var type = $('input[name=metodo-pago]:checked', '#payment-method-form').attr('id');

	if( name.length != 0 ) {
		if( type == "american" && name.match(/^((34)|(37))[0-9]{13}$/g) == null ) {
			parent.append( 
				'<div class="field-error"> Debe ser un número de American Express válido.</div>'
			);
			validates = false;
		}
		if( type == "diners" && name.match(/^(36)[0-9]{14}$/g) == null ) {
			parent.append( 
				'<div class="field-error"> Debe ser un número de Diners válido.</div>'
			);
			validates = false;
		}
		if( type == "mastercard" && name.match(/^((51)|(52)|(53))[0-9]{14}$/g) == null ) {
			parent.append( 
				'<div class="field-error"> Debe ser un número de Mastercard válido.</div>'
			);
			validates = false;
		}
		if( type == "visa" && name.match(/^4(([0-9]{12})|([0-9]{15}))$/g) == null ) {
			parent.append( 
				'<div class="field-error"> Debe ser un número de Visa válido.</div>'
			);
			validates = false;
		}
	}
	if( name.length == 0 ) {
		parent.append( 
			'<div class="field-error"> El campo es obligatorio.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateExpiry() {
	
	var validates = true; 
	var name = $( "input[name='vencimiento']" ).val();
	var parent = $( "input[name='vencimiento']" ).parent();
	parent.find('.field-error').remove();
	if( name.length != 0 && name.match(/[0-9][0-9]\/[0-9][0-9]/g) == null ) {
		parent.append( 
			'<div class="field-error"> Debe ser una fecha de vencimiento válida.</div>'
		);
		validates = false;
		return validates;
	}
	if( name.length == 0 ) {
		parent.append( 
			'<div class="field-error"> El campo es obligatorio.</div>'
		);
		validates = false;
	}
	var month = name.split("/")[0];
	var year = name.split("/")[1];
	
	if( month < 1 || month > 12 || year < 14 ) {
		parent.append( 
			'<div class="field-error"> Debe ser una fecha de vencimiento válida.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateCode() {
	
	var validates = true; 
	var name = $( "input[name='codigo']" ).val();
	var parent = $( "input[name='codigo']" ).parent();
	parent.find('.field-error').remove();
	if( name.match(/[^0-9]/g) != null ) {
		parent.append( 
			'<div class="field-error"> Debe ser un código de seguridad válido.</div>'
		);
		validates = false;
		return validates;
	}
	if( name.length != 0 && name.length != 3 && $('input[name=metodo-pago]:checked', '#payment-method-form').attr('id') != "american" ) {
		parent.append( 
			'<div class="field-error"> Debe ser un código de seguridad válido.</div>'
		);
		validates = false;
	}
	if( name.length != 0 && name.length != 4 && $('input[name=metodo-pago]:checked', '#payment-method-form').attr('id') == "american" ) {
		parent.append( 
			'<div class="field-error"> Debe ser un código de seguridad válido.</div>'
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

function validateName() {
	
	var validates = true; 
	var name = $( "input[name='nombres']" ).val();
	var parent = $( "input[name='nombres']" ).parent();
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

function validateLastName() {
	
	var validates = true; 
	var name = $( "input[name='apellidos']" ).val();
	var parent = $( "input[name='apellidos']" ).parent();
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

function validateDNI() {
	
	var validates = true; 
	var name = $( "input[name='dni']" ).val();
	var parent = $( "input[name='dni']" ).parent();
	parent.find('.field-error').remove();

	if( name.match(/[^0-9]/g) != null || (name.length != 0 && name.length != 8) ) {
		parent.append( 
			'<div class="field-error"> Debe ser un DNI válido.</div>'
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

function addCardToOrder() {
	
	addCardToOrderById($( "#card-select" ).val(), false);
}

function addCardToOrderById(cardId, newCard) {
	
	if( !newCard && !validateExistingCard() ) 
		return;
		
	localStorage.cardId = cardId;
	window.location.replace("confirm.html?method=credit_card&id="+cardId);	
}

function hide_card() {
	
    	$('#credit-card').css("display", "none");
		$('#cash').css("display", "block");
}

function show_card() {
	
		$('#cash').css("display", "none");
    	$('#credit-card').css("display", "block");
		if( count == 0 )
			addExistingCards();
		if( count >= 1 )
			validatesNewCard();
		count++;
}

