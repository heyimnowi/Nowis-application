// JavaScript Document
$(document).ready(function(){
	
	var allOrdersAjax = {
		url: 'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetAllOrders&username='+
			localStorage.username +'&authentication_token='+ localStorage.token,
        dataType: 'jsonp',
        timeout: 3000
	}
	
	$.ajax(allOrdersAjax).done(function( resp ){
			
        $.each(resp.orders, confirmedOrders);
    });
});

function confirmedOrders(index, order) {
	if( order.status > 1 ) {
		
		
		
		$("#orders-table").append(
			'<tr>'+
				'<td class="image">'+
					'<img src="images/box.png"  height="100" width="100" alt=""/>'+
				'</td>'+
				'<td>'+
					'<strong>Número de orden: </strong>'+order.id+'<br>'+
					'<strong>Estado: </strong>'+order.status+'<br>'+
					'<strong>Dirección: </strong>'+order.address.name+'<br>'+
					'<strong>Fecha de creación: </strong>'+order.receivedDate+'<br>'+
					'<strong>Fecha de entrega: </strong>'+order.receivedDate+'<br>'+
				'<hr>'+
				'</td>'+
			'</tr>'
		);
	}
}

function showAddress(order) {
	
	var addressAjax =  {
		url: 'http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAddressById&username='+
				localStorage.username +'&authentication_token='+ localStorage.token +'&id='+ order.addressId,
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

