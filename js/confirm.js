var totalPrice = 0;

$(document).ready(function(){

		$( "#confirm-btn" ).click(confirmOrder);
		$("#select-cuota" ).click(showFinalPrice);
		
		showAddress();
		showPayment();
		showCartItems();
});

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
			totalPrice = sum;
			$("#total-price").append("Total: $"+sum);
			showFinalPrice();
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

function showAddress() {
	
	var addressAjax =  {
		url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAddressById&username='+
				localStorage.username +'&authentication_token='+ localStorage.token +'&id='+ localStorage.addressId,
        dataType: 'jsonp',
        timeout: 3000
	};
	
	$.ajax(addressAjax).done( function(resp) {

		var address = resp.address;
		$("#delivery-name").append(address.name);
		var addrFloor = "";
		if( address.floor != null )
			addrFloor = " - "+address.floor;
		$("#delivery-address").append(address.street+" "+address.number+addrFloor);
		var addrCity = "-";
		if( address.city != null )
			addrCity = address.city;
		$("#delivery-city").append(addrCity);
		$("#delivery-cp").append(address.zipCode);
		$("#delivery-province").append(getProvinceName(address.province));
		$("#delivery-tel").append(address.phoneNumber);
	});
}

function showPayment() {

	var method = getUrlParameter('method');
	if( method == "cash" ) {
		$("#payment-info").append("Efectivo");
	} else {
		$("#payment-info").append("Tarjeta de crédito");
		
		var cardAjax =  {
			url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetCreditCardById&username='+
				localStorage.username +'&authentication_token='+ localStorage.token +'&id='+ localStorage.cardId,
			dataType: 'jsonp',
			timeout: 3000
		};
	
		$.ajax(cardAjax).done( function(resp) {

			var card = resp.creditCard;
			$("#credit-num").append(card.number);
			$("#credit-expiracy").append(card.expirationDate);
			showCuotas();
			$("#credit-card").css("visibility", "visible");
		});
	}
}

function showCuotas() {
	$("#coutas").css("visibility", "visible");	
	
	var coutaAjax =  {
			url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetCreditCardInstallments&username='+
				localStorage.username +'&authentication_token='+ localStorage.token +'&id='+ localStorage.cardId,
			dataType: 'jsonp',
			timeout: 3000
		};
	
		$.ajax(coutaAjax).done( function(resp) {

			$.each(resp.installments, appendCuota);
		});
}

function appendCuota(index, cuota) {
	
	$('select[name="cuota"]').append(
		'<option value="'+cuota.quantity+'-'+cuota.value+'">'+cuota.quantity+'</option>'
	);
}

function getProvinceName(letter) {
	
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

function showFinalPrice() {
	
	$("#final-price").empty();
	var quantity = $('select[name="cuota"]').val().split("-")[0];
	var value = $('select[name="cuota"]').val().split("-")[1];
	$("#final-price").append("*Precio final: $"+(totalPrice*(1+value)).toFixed(2));	
}

function confirmOrder() {
	
	var order = {
		"id": localStorage.orderId	,
		"address": {
			"id": localStorage.addressId,
		}
	}
	
	var method = getUrlParameter('method');
	if( method != "cash" ) {
		order["creditCard"] = {
			"id": localStorage.cardId
		}
	}
	
	var getOrderAjax = {
		url: 'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username='+
				localStorage.username +'&authentication_token='+ localStorage.token +'&id='+ localStorage.orderId,
			dataType: 'jsonp',
			timeout: 3000
	}
	
	$.ajax(getOrderAjax).done( function(resp) {
			console.log(resp);
	});
	
	JSONstring = '{"id":'+localStorage.orderId+',"address":{"id":'+localStorage.addressId+'}';
	var method = getUrlParameter('method');
	if( method != "cash" ) {
		JSONstring += ',"creditCard":{"id":'+localStorage.cardId+'}';
	}
	JSONstring += "}";
	URLstring = JSONstring.replace(/"/g, "%22");
	
	var confirmAjax = {
		url: 'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=ConfirmOrder&username='+
				localStorage.username +'&authentication_token='+ localStorage.token +'&order='+ URLstring,
			dataType: 'jsonp',
			 timeout: 6000,
		 	error: function(x, t, m) {
        	if(t==="timeout") {
            	errorAction("Se agotó el tiempo para realizar la acción solicitada.");
        	}
    	}
	}
	
	$.ajax(confirmAjax).done( function(resp) {
		if(resp.hasOwnProperty('error')){
		console.log(resp.error.code);
		var message;
		switch(resp.error.code) {
			case 101:
				message = "La orden ya fue confirmada, o no contiene ningún producto.";
			case 104:
				message = "El nombre de usuario es inválido.";
				break;
			case 105:
				message = "La contraseña del usuario es inválida.";
				break;
			case 999:
			default:
				message = "Se produjo un error inesperado procesando la solicitud. Verifique que tiene al menos un producto en el carrito de compras.";
				break;
		}
		errorAction(message);
	} else {
			successAction("La compra se realizó correctamente.");
			setTimeout(function(){window.location.replace("gestion_pedidos.html?result=success")}, 4000);
	}
	});
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