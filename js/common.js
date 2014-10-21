

var createOrder = function(username, token, prodId){ /* crea una orden con el prod */
    $.ajax({
        url: 'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=CreateOrder&username='+ username +'&authentication_token='+ token,
        dataType: 'jsonp',
        timeout: 3000
    }).done(function( resp ){
        console.log( "createOrder" );
        console.log( resp );
        var orderItem = createOrderItem(resp.order.id, prodId);
        addItemToOrder(username, token, orderItem);
    });
};

var addItemToOrder = function(username, token, orderItem){
    $.ajax({
        url: 'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=AddItemToOrder&username='+ username +'&authentication_token='+ token +'&order_item='+ orderItem,
        dataType: 'jsonp',
        timeout: 3000
    }).done(function( resp ){
        successAction("El producto se ha agregado a el carrito de compras satisfactoriamente");
        console.log( "addItemToOrder" );
        console.log( resp );
        getOrderById(username, token, resp.orderItem.order.id);
    });
};

var getOrderById = function(username, token, orderId){
    $.ajax({
        url:'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username='+ username +'&authentication_token='+ token +'&id='+ orderId,
        dataType: 'jsonp',
        timeout: 3000
    }).done(function ( resp ){
        console.log( "order by id" );
        console.log( resp );
    });
};


var createOrderItem = function(orderId, prodId){
    var orderItem = JSON.stringify({ 
        order: { id: orderId },
        product: { id: prodId},
        quantity: 1
    });
    console.log(orderItem);
    return orderItem;
};

var addToCart = function(prodId){
    $.ajax({
        url: 'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetAllOrders&username='+ localStorage.username +'&authentication_token='+ localStorage.token,
        dataType: 'jsonp',
        timeout: 3000
    }).done(function( resp ){
        console.log( resp );
        if (resp.orders.length == 0) { /* hay q crear una orden */
            createOrder(localStorage.username, localStorage.token, prodId);
        }else{
            /* TODO: ver si status == 1 es el estado correspondiente */
            var currentOrder = $.grep(resp.orders, function(order, index){
                return order.status == 1;    
            });
            if (currentOrder.length == 0) {
                createOrder(localStorage.username, localStorage.token, prodId);
            }else{
                console.log(currentOrder);
                var orderItem = createOrderItem(currentOrder[0].id, prodId);
                addItemToOrder(localStorage.username, localStorage.token, orderItem);
            }
        }
    });
};

