

$('document').ready(function(){
    
    function getParameterByName(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match[1];
    };
    var prodParams = {
        id: parseInt(getParameterByName('id')),
        name: getParameterByName('name')
    };
    
    var getProdAjax = {
        url: 'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByName&name='+prodParams.name,
        dataType: 'jsonp',
        timeout: 3000
    };
    
    $.ajax(getProdAjax).done(function(resp){
        console.log(resp);
        if (resp.products[0].id == prodParams.id) {
            
            /* Imgs and descriptions loading */
            
            var product = resp.products[0];
            var filters = resp.filters;
            
            $('#topDesc').html(
                '<span class="prod-title">'+ product.name +'</span><br>'+
                '<div id="prod_price"> $' + product.price + '</div>'
            );
            
            $('.carousel-inner').empty();
            $('.carousel-inner').append(
                '<div class="item active">'+
                    '<img src="'+ product.imageUrl[0] +'" alt="'+ product.name +'" width=250 height=250>'+      
                    '<div class="carousel-caption"></div>'+
                '</div>'
            );
            $.each(product.imageUrl, function(index, imgUrl){
                if (index != 0) {
                    $('.carousel-inner').append(
                        '<div class="item">'+
                            '<img src="'+ imgUrl +'" alt="'+ product.name +'" width=250 height=250>'+      
                            '<div class="carousel-caption"></div>'+
                        '</div>'
                    );
                }
            });
            
            $('#bottomDesc').html(   /* TODO: completar */
                '' + product.subcategory.name 
            );
            
            /* Filters options loading  TODO: evaluar si se puede meter todo en una func*/
            var sizes = $.grep(filters, function(filter, index){
                return (filter.name == "Talle-"+ product.subcategory.name ||
                        filter.name == "Talle-"+ product.subcategory.name +'s' ||
                        filter.name == "Talle-"+ product.category.name);
            })[0];
            console.log(sizes);
            if (sizes != undefined) {
                $('#selectSize').html(
                    

                    '<div class="title">Talle:</div><br>' +
                    '<select id="'+ sizes.id +'">'+
                        '<option value="none">Seleccione un talle</option>'+
                    '</select>'
                             
                );                
                $.each(sizes.values, function(index, size){
                    $('#'+ sizes.id).append(
                        '<option value="'+ size +'">'+ size +'</option>'
                    );
                });
            }else{
                $('#selectSize').empty();
            }
                
            var colors = $.grep(filters, function(filter, index){
                return (filter.id == 4);
            })[0];
            
            var gender =  $.grep(filters, function(filter, index){
                return (filter.id == 1);
            })[0];
            
            if (colors != undefined) {
                $('#selectColor').html(
                    '<div class="title">Color:</div><br>'+
                    '<select id="'+ colors.id +'">'+
                        '<option value="none">Seleccione un color</option>'+
                    '</select>'
                );
                
                $.each(colors.values, function(index, color){
                    $('#'+ colors.id).append(
                        '<option value="'+ color +'">'+ color +'</option>'
                    );
                });
            }else{
                $('#selectColor').empty();
            }
            
            /* Buttons listeners */
            
            
            
            var selectedProdOptions = function(){
                var selectedOptions = $('#productSpecifications select option:selected');
                var options = [];
                $.each(selectedOptions, function(index, option){ /* TODO: mensaje de error */
                    if (option.value == "none") {
                        alert(option.text);
                        options = [];
                        return false;  /* sale del $.each  con return true se saltea uno */
                    }
                    if (option.parentElement.id != "quantity") {
                        options.push({
                            id:option.parentElement.id,
                            value:option.value
                        });
                    }
                    
                });
                console.log(options);
                return options;
            };
            
            
            
            
            
            /*--- AddToCart  button ---*/
            
            $('#addToCart').click(function( event ){
                event.preventDefault();
                
                if (localStorage.token === undefined) { /* no esta logeado */
					console.log("no log");
					var url = window.location.search.substring(1);
                    document.location.replace("login.html?from=product&action=cart&"+url);
                }else{
					console.log("prueba");
                    selectedOptions = selectedProdOptions();
                    if (selectedOptions.length != 0) {
                        addToCart(product.id);
                    }
                }
                
            });
            /*--- AddToWishList  button ---*/
            $('#addToWishlist').click(function( event ){
                event.preventDefault();
                console.log(product)
                prodOptions = selectedProdOptions();
                if (prodOptions.length != 0) {
                    wishListItem = {
                        id: product.id,
                        quantity: parseInt($('#quantity').val()),
                    };
                    if (localStorage.wishList === undefined) {
                        localStorage.wishList = JSON.stringify([wishListItem]);
                    }else{
                        var newWishList = jQuery.parseJSON(localStorage.wishList);
                        if (newWishList.length == 0) {
                            newWishList.push(wishListItem);
                        }else{
                            var found = $.grep(newWishList, function(item, index){
                                return item.id == wishListItem.id;
                            });
                            if (found.length == 0) {
                                newWishList.push(wishListItem);
                            }
                        }
                        localStorage.wishList = JSON.stringify(newWishList);
                    }
                    console.log(localStorage.wishList);
                    successAction("El producto se ha agregado a la lista de deseos satisfactoriamente");
                }
                
            });
            

            
            /*--- Sugestions Loading ---*/
            console.log(gender.values[0]);
            $.ajax({
                url: 'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsByCategoryId&id='+ product.category.id +'&page_size=3&filters=[{"id": 1, "value": "'+ gender.values[0] +'"}]',
                dataType: 'jsonp',
                timeout: 3000
            }).done(function( resp ){
                console.log(resp);
                $('.sugestion').remove();
                $.each(resp.products, function(index, product){
                    $('#sugestions').append(
                        '<a href="product.html?id='+ product.id +'&name='+ product.name +'">'+
                            '<div class="sugestion">'+
                                    '<img src="'+ product.imageUrl[0] +'" alt="'+ product.name +'" width="80" height="80"> <br>'+
                                '<span class="name">'+ product.name +'</span><br>'+
                                '<span class="price">$'+ product.price +'</span>'+
                            '</div>'+
                        '</a>'
                    );
                })
            });
            /*--- Breadcrums Loading ---*/
            
            
        }else{
            /* TODO: mensaje de error */
            console.log('No se encontro el producto en la BD')
        }
        
    });


});