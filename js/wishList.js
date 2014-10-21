
$('document').ready(function(){
    var wishList = jQuery.parseJSON(localStorage.wishList);
    
    var removeFromWishlist = function(prodId){
        var newWishList = jQuery.parseJSON(localStorage.wishList);
        var index = newWishList.indexOf({id: prodId});
        newWishList.splice(index, 1);
        localStorage.wishList = JSON.stringify(newWishList);
    };
    
    var addWishlistItem = function(item){ 
        
        var trId = item.product.id ;
        $('tbody').append(
            '<tr id="'+ trId +'">'+
                '<td>'+
                    '<a href="product.html?id='+ item.product.id +'&name='+ item.product.name +'">'+
                    '<img id="preview" src="'+ item.product.imageUrl[0] +'" alt="'+ item.product.name +'"> '+
                    '</a>'+
                '</td>'+
                '<td>'+ item.product.name + '<br><br>' +
                '</td>'+
                '<td class="quantity">'+
                
                    '<button type="button" class="btn btn-info btn-default">'+
                        '<span class="glyphicon glyphicon-minus"></span>'+
                    '</button>'+ 
                    '<label>'+ item.quantity+'</label>' +
                    '<button type="button" class="btn btn-default btn-info">'+
                         '<span class="glyphicon glyphicon-plus"></span>'+
                    '</button>'+
                    '<br>'+
                '</td>'+
                '<td class="price">$ '+ (item.product.price).toFixed(2) +'</td>'+
                '<td class="totalPrice">$ '+ (item.product.price * item.quantity).toFixed(2) +'</td>'+
                '<td class="remove">'+
                    '<div id="moveToCart-'+ trId +'" class="btn btn-default btn-lg table-button btn-warning ">'+
                        '<span class="glyphicon glyphicon-shopping-cart"></span> Mover al carrito de compras'+
                    '</div>' +
                    '<br><br>' +
                    '<button type="button" class="btn btn-default btn-danger">'+
                        '<span class="glyphicon glyphicon-trash"></span>Eliminar'+
                    '</button>'+
                '</td>'+
            '</tr>'
        );
        
        /* quantity buttons */

        var currTotal = parseInt($('#total').text());
        console.log(currTotal);
        $('#total').html((currTotal + (item.product.price * item.quantity)).toFixed(2));
        
        $('tbody tr[id="'+ trId +'"] td[class="quantity"] :button').click(function( event ){
            var buttonClass = event.currentTarget.children[0].classList[1];
            var quantityLabel = $('tbody tr[id="'+trId+'"] label');
            var totalPrice = $('tbody tr[id="'+trId+'"] td[class="totalPrice"]');
            var quantity = parseInt(quantityLabel.text());
            var currTotal = parseInt($('#total').text());
            if (buttonClass == "glyphicon-plus") {
                quantityLabel.html(quantity + 1);
                totalPrice.html('$ ' + (item.product.price * (quantity+1)).toFixed(2));
                $('#total').html((currTotal + item.product.price).toFixed(2));
            }else{
                if (quantity != 1) {
                    quantityLabel.html(quantity - 1);
                    totalPrice.html('$ ' + (item.product.price * (quantity-1)).toFixed(2));
                    $('#total').html((currTotal - item.product.price).toFixed(2));
                }
            }
        });
        
        
        
        $('tbody tr[id="'+ trId +'"] td[class="remove"] :button').click(function( event ){
            removeFromWishlist(trId);
            var currTotal = parseInt($('#total').text());
            $('#total').html((currTotal - (item.product.price * item.quantity)).toFixed(2));
            $('tbody tr[id="'+ trId +'"]').empty();
        });
        
        $('#moveToCart-'+trId).click(function(){
            addToCart(trId);
            $('tbody tr[id="'+ trId +'"]').empty();
            removeFromWishlist(trId);
            var currTotal = parseInt($('#total').text());
            $('#total').html((currTotal - (item.product.price * item.quantity)).toFixed(2));
            $('tbody tr[id="'+ trId +'"]').empty();
        });
            
    };
    
    $.each(wishList, function(index, item){
        $.ajax({
            url: 'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductById&id='+item.id,
            dataType: 'jsonp',
            timeout: 3000
        }).done(function( resp ){
            console.log(resp)
            var wishlistItem = {
                product: resp.product,
                quantity: item.quantity
            }
            addWishlistItem(wishlistItem);
            
        });
    });
    
    $('#moveToCart').click(function(){
        var wishList = jQuery.parseJSON(localStorage.wishList);
        $.each(wishList, function(index, item){
            addToCart(item.id);
            removeFromWishlist(item.id);
        });
        $('tbody').empty();
    });
    
    $('#emptyWishlist').click(function(){
        var wishList = jQuery.parseJSON(localStorage.wishList);
        $.each(wishList, function(index, item){
            removeFromWishlist(item.id);
        });
        $('tbody').empty();    
    });
    
});