$(document).ready(function(){

    	$('#casa').click(hide_piso);
    	$('#departamento').click(show_piso);
		$( "#create-address" ).click(createAddress);
		$( "#select-existing-address" ).click(addAddressToOrder);
		
		validator();
		
		addExistingAddresses();
		addProvinces();
		
		showCartItems();
});

function addExistingAddresses() {
	
	var addressesAjax =  {
		url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllAddresses&username='+
			localStorage.username +'&authentication_token='+ localStorage.token,
        dataType: 'jsonp',
        timeout: 3000
	};
		
	$.ajax(addressesAjax).done(function( resp ){
		
        $.each(resp.addresses, appendAddress);
    });
}

function appendAddress(index, address) {
	
	$('select[name="address"]').append(
		'<option value="'+address.id+'">'+address.name+'</option>'
	);
}

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

function createAddress() {
	if( !validatesNewAddress() )
		return;
		
		
	var address = {
		 "name": $( "input[name='nombre']" ).val(),
		 "street": $( "input[name='calle']" ).val(),
		 "number": $( "input[name='numero']" ).val(),
		 "province": $( "select[name='provincia']" ).val(),
		 "zipCode": $( "input[name='codigo-postal']" ).val(),
		 "phoneNumber": $( "input[name='telefono']" ).val()
	}
	if( $( "input[name='piso']" ).val().length != 0 ) 
		 address["floor"] = $( "input[name='piso']" ).val();
		 
	if( $( "input[name='ciudad']" ).val().length != 0 ) 
		 address["city"] = $( "input[name='ciudad']" ).val();

	
	var addressAjax =  {
		url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAddress&username='+
			localStorage.username +'&authentication_token='+ localStorage.token+'&address='+JSON.stringify(address),
        dataType: 'jsonp',
        timeout: 3000
	};
		
	$.ajax(addressAjax).done( function(resp) {
		
		addAddressToOrderById(resp.address.id, true);
	});
}

function validatesNewAddress() {
	validates = validateName();
	validates = validateStreet() && validates;
	validates = validateNumber() && validates;
	validates = validateFloor() && validates;
	validates = validateProvince() && validates;
	validates = validateCity() && validates;
	validates = validateZipCode() && validates;
	validates = validateTel() && validates;
	return validates;
}

function validator() {
	
	$( "input[name='nombre']" ).focusout(validateName);
	$( "input[name='calle']" ).focusout(validateStreet);
	$( "input[name='numero']" ).focusout(validateNumber);
	$( "input[name='piso']" ).focusout(validateFloor);
	$( "select[name='provincia']" ).focusout(validateProvince);
	$( "input[name='ciudad']" ).focusout(validateCity);
	$( "input[name='codigo-postal']" ).focusout(validateZipCode);
	$( "input[name='telefono']" ).focusout(validateTel);
}

function validateExistingAddress() {
	
	var validates = true;
	var name = $( "#existing-addresses" ).val();
	var parent = $( "#existing-addresses" ).parent();
	parent.find('.field-error').remove();
	if( name == "none" ) {
		parent.append( 
			'<div class="field-error"> Debe selecccionar una dirección de envío.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateName() {
	
	var validates = true; 
	var name = $( "input[name='nombre']" ).val();
	var parent = $( "input[name='nombre']" ).parent();
	parent.find('.field-error').remove();
	if( name.match(/[^a-zA-Z0-9]/g) != null ) {
		parent.append( 
			'<div class="field-error"> Debe contener sólo caracteres alfanuméricos.</div>'
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

function validateStreet() {
	
	var validates = true; 
	var name = $( "input[name='calle']" ).val();
	var parent = $( "input[name='calle']" ).parent();
	parent.find('.field-error').remove();
	if( name.match(/[^a-zA-Z0-9 ]/g) != null ) {
		parent.append( 
			'<div class="field-error"> Debe contener sólo caracteres alfanuméricos.</div>'
		);
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

function validateNumber() {
	
	var validates = true; 
	var name = $( "input[name='numero']" ).val();
	var parent = $( "input[name='numero']" ).parent();
	parent.find('.field-error').remove();
	if( name.match(/[^0-9]/g) != null ) {
		parent.append( 
			'<div class="field-error"> Debe contener sólo caracteres numéricos.</div>'
		);
		validates = false;
	}
	if( name.length > 6 ) {
		parent.append( 
			'<div class="field-error"> No debe tener más de 6 caracteres.</div>'
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

function validateFloor() {
	
	var validates = true; 
	var name = $( "input[name='piso']" ).val();
	var parent = $( "input[name='piso']" ).parent();
	parent.find('.field-error').remove();
	if( name.match(/[^a-zA-Z0-9]/g) != null ) {
		parent.append( 
			'<div class="field-error"> Debe contener sólo caracteres alfanuméricos.</div>'
		);
		validates = false;
	}
	if( name.length > 3 ) {
		parent.append( 
			'<div class="field-error"> No debe tener más de 3 caracteres.</div>'
		);
		validates = false;
	}
	return validates;
}

function validateProvince() {
	
	var validates = true; 
	var name = $( "select[name='provincia']" ).val();
	var parent = $( "select[name='provincia']" ).parent();
	var cityTag = $("#city-tag");
	var city = $( "input[name='ciudad']" );
	city.parent().find('.field-error').remove();
	cityTag.empty();
	parent.find('.field-error').remove();
	
	if( name == "none" ) {
		parent.append( 
			'<div class="field-error"> Debe selecccionar una provincia.</div>'
		);
		validates = false;
	}
	if( name != "C" && name != "c" ) {
		cityTag.append("*Ciudad");
		if( city.val().length == 0 ) {
			city.parent().append( 
				'<div class="field-error"> El campo es obligatorio.</div>'
			);
		}
	} else {
		cityTag.append("Ciudad");
		city.parent().find('.field-error').remove();
	}
	
	return validates;
}

function validateCity() {
	
	var validates = true;
	var province = $( "select[name='provincia']" ).val(); 
	var name = $( "input[name='ciudad']" ).val();
	var parent = $( "input[name='ciudad']" ).parent();
	parent.find('.field-error').remove();
	
	if( name.match(/[^a-zA-Z0-9]/g) != null ) {
		parent.append( 
			'<div class="field-error"> Debe contener sólo caracteres alfanuméricos.</div>'
		);
		validates = false;
	}
	if( name.length > 80 ) {
		parent.append( 
			'<div class="field-error"> No debe tener más de 80 caracteres.</div>'
		);
		validates = false;
	}
	if( name.length == 0 )
	if( province != "C" && province != "c" ) {
		parent.append( 
			'<div class="field-error"> El campo es obligatorio.</div>'
		);
		validates = false;
	}

	return validates;
}

function validateZipCode() {
	
	var validates = true; 
	var name = $( "input[name='codigo-postal']" ).val();
	var parent = $( "input[name='codigo-postal']" ).parent();
	parent.find('.field-error').remove();
	if( name.match(/[^0-9]/g) != null ) {
		parent.append( 
			'<div class="field-error"> Debe contener sólo caracteres numéricos.</div>'
		);
		validates = false;
	}
	if( name.length > 10 ) {
		parent.append( 
			'<div class="field-error"> No debe tener más de 10 caracteres.</div>'
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

function validateTel() {
	
	var validates = true; 
	var name = $( "input[name='telefono']" ).val();
	var parent = $( "input[name='telefono']" ).parent();
	parent.find('.field-error').remove();
	if( name.match(/[^0-9\-]/g) != null ) {
		parent.append( 
			'<div class="field-error"> Debe ser un número de teléfono válido.</div>'
		);
		validates = false;
	}
	if( name.length > 25 ) {
		parent.append( 
			'<div class="field-error"> No debe tener más de 25 caracteres.</div>'
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

function addAddressToOrder() {
	
	addAddressToOrderById($( "#existing-addresses" ).val(), false);
}

function addAddressToOrderById(addressId, newAddr) {
	
	if( !newAddr && !validateExistingAddress() ) 
		return;
	
	JSONstring = '{"id":'+localStorage.orderId+',"address":{"id":'+addressId+'}}';
	URLstring = JSONstring.replace(/"/g, "%22");
	
	var orderAjax =  {
		url: 'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=ChangeOrderAddress&username='+
			localStorage.username +'&authentication_token='+ localStorage.token+'&order='+URLstring,
        dataType: 'jsonp',
        timeout: 3000
	};
	
	$.ajax(orderAjax).done( function(resp) {
		localStorage.addressId = addressId;
		window.location.replace("payment.html");	
	});
}


function hide_piso() {
	
    	$('#piso').css("visibility", "hidden");
}

function show_piso() {
	
    	$('#piso').css("visibility", "visible");
}

