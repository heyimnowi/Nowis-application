
/*---  ----*/
$('document').ready(function(){
    var removedItems = [];
    var changedItems = [];
    var cartItems = [];
    
    var addCartItems = function(items){ 
        
        $.each(items, function(index, item){
            cartItems.push(item);
            var trId =  item.id +'-'+ item.product.id ;
            $('tbody').append(
                '<tr id="'+ trId +'">'+
                    '<td>'+
                        '<a href="product.html?id='+ item.product.id +'&name='+ item.product.name +'">'+
                        '<img id="preview" src="'+ item.product.imageUrl +'" alt="'+ item.product.name +'"> '+
                        '</a>'+
                    '</td>'+
                    '<td>'+ item.product.name + '<br><br>' +
                    '</td>'+
                    '<td class="quantity">'+
                    
                        '<button type="button" class="btn btn-default">'+
                            '<span class="glyphicon glyphicon-minus"></span>'+
                        '</button>'+ 
                    
                        '<label>'+ item.quantity +'</label>' +
                        '<button type="button" class="btn btn-default">'+
                             '<span class="glyphicon glyphicon-plus"></span>'+
                        '</button>'+
                        '<br>'+
                    '</td>'+
                    '<td class="price">$ '+ (item.price).toFixed(2) +'</td>'+
                    '<td class="totalPrice">$ '+ (item.price * item.quantity).toFixed(2) +'</td>'+
                    '<td class="remove">'+
                    '<div id="moveToWishlist-'+ trId +'" class="btn btn-default btn-lg btn-warning table-button">'+
                        '<span class="glyphicon glyphicon-heart"></span> Mover a la lista de deseos'+
                    '</div>' +
                    '<br><br>' +
                    '<button type="button" class="btn btn-default btn-danger">'+
                        '<span class="glyphicon glyphicon-trash"></span>Eliminar'+
                    '</button>'+
                '</td>'+
                '</tr>'
            );
            
            /* quantity buttons */
            var quan = parseInt($('#quantity').text());
            console.log(quan);

            $('#quantity').html((quan + cartItems.length) );
            $('#quantity').html((quan + cartItems.length ));



            var currTotal = parseInt($('#total').text());
            console.log(currTotal);
            $('#total').html((currTotal + (item.price * item.quantity)).toFixed(2));
            
            $('tbody tr[id="'+ trId +'"] td[class="quantity"] :button').click(function( event ){
                var buttonClass = event.currentTarget.children[0].classList[1];
                var quantityLabel = $('tbody tr[id="'+trId+'"] label');
                var totalPrice = $('tbody tr[id="'+trId+'"] td[class="totalPrice"]');
                var quantity = parseInt(quantityLabel.text());
                var currTotal = parseInt($('#total').text());
                if (buttonClass == "glyphicon-plus") {
                    quantityLabel.html(quantity + 1);
                    totalPrice.html('$ ' + (item.price * (quantity+1)).toFixed(2));
                    $('#total').html((currTotal + item.price).toFixed(2));
                }else{
                    if (quantity != 1) {
                        quantityLabel.html(quantity - 1);
                        totalPrice.html('$ ' + (item.price * (quantity-1)).toFixed(2));
                        $('#total').html((currTotal - item.price).toFixed(2));
                    }
                }
            });
            
            $('tbody tr[id="'+ trId +'"] td[class="remove"] :button').click(function( event ){
                removeItems([item]);
                var prodId = (this.id.split('-'))[2];
                var itemId = (this.id.split('-'))[1]; 
                var currTotal = parseInt($('#total').text());
                var totalPrice = $('tbody tr[id="'+trId+'"] td[class="totalPrice"]').html();
                $('#total').html((currTotal - parseInt(totalPrice.slice(2, totalPrice.length))).toFixed(2));
                $('tbody tr[id="'+ trId +'"]').empty();
            });
            
            $('#moveToWishlist-'+trId).click(function(){
                var prodId = (this.id.split('-'))[2];
                var itemId = (this.id.split('-'))[1]; 
                console.log(trId);
                console.log(prodId);
                
                /* TODO: considerar addToWishlist */

                wishListItem = {
                        id: prodId,
                        quantity: 1,
                };
                if (localStorage.wishList === undefined) {
                    localStorage.wishList = JSON.stringify([wishListItem]);
                }else{
                    var newWishList = jQuery.parseJSON(localStorage.wishList);
                    newWishList.push(wishListItem);
                    localStorage.wishList = JSON.stringify(newWishList);
                }
                console.log(localStorage.wishList);
                
                $.ajax({
                    url: 'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=RemoveItemFromOrder&username='+ localStorage.username +'&authentication_token='+ localStorage.token +'&id='+itemId,
                    dataType: 'jsonp',
                    tomeout: 3000
                }).done(function( resp ){
                    console.log(resp);
                });
                var currTotal = parseInt($('#total').text());
                var totalPrice = $('tbody tr[id="'+trId+'"] td[class="totalPrice"]').html();
                $('#total').html((currTotal - parseInt(totalPrice.slice(2, totalPrice.length))).toFixed(2));
                $('tbody tr[id="'+ (itemId +'-'+ prodId) +'"]').empty();
            });
            
        });
    };
    
    $.ajax({
        url: 'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetAllOrders&username='+ localStorage.username +'&authentication_token='+ localStorage.token,    
        dataType: 'jsonp',
        timeout: 3000
    }).done(function( resp ){
        var orders = resp.orders;
        console.log(resp);
        $('tbody').empty();
        $.each(orders, function(index, order){
            $.ajax({
                url:'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username='+ localStorage.username +'&authentication_token='+ localStorage.token +'&id='+ order.id,
                dataType: 'jsonp',
                timeout: 3000
            }).done(function( resp ){
                console.log(resp.order.items);
                var items = resp.order.items;
                addCartItems(items);
               
                
            });
            
        });
      
    });
    
    var removeItems = function(items){
        $.each(items, function(index, item){
            $.ajax({
                url: 'http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=RemoveItemFromOrder&username='+ localStorage.username +'&authentication_token='+ localStorage.token +'&id='+item.id,
                dataType: 'jsonp',
                tomeout: 3000
            }).done(function( resp ){
                console.log(resp);
            });
            
        });
    };
    
    
    $('#saveChanges').click(function(){
        console.log(removedItems)
        if(removedItems.length != 0){
            removeItems(removedItems);
        }
    
    });
    
    $('#emptyCart').click(function(){
        removeItems(cartItems);
        $('tbody').empty();
    });

});