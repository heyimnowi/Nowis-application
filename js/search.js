/*--- Random Products Loading ---*/

$(document).ready(function(){
    
    var gender = getUrlParameterByName('gender');
    var subcatid = getUrlParameterByName('subcatid');
    var filterId = getUrlParameterByName('filterId');
    var filterName = getUrlParameterByName('filterName');
    var edad = getUrlParameterByName('edad');
    var page = getUrlParameterByName('page');
	
	if( gender == "Ninios" ) {
		edad = "Bebe";
		gender = "Masculino";
	}
	
	else if( gender == "Ninias" ) {
		edad = "Bebe";
		gender = "Femenino";
	}
		
    
    console.log(gender);
    console.log(subcatid);
    console.log(filterId);
    console.log(filterName);
    
    var appendProducts = function(products){
       $.each(products, function(index, value){
            $('#products').append(
                '<a href="product.html?gender='+ gender +'&edad='+ edad +'&id='+ value.id +'&name='+ value.name +'" rel="external"><div class="product">'
                    + '<img src="'+ value.imageUrl[0] +'" width="150" height="150"><br>'
                    + value.name + '<br>'
                    + '$ ' + value.price +
                '</div></a>'     
            );    
        });    
    };
    
    /*--- Loads filters options depending on the subcategory ---*/
    
	var correctPrice = function() {
		validateMinPrice();
		if(  $("input[name='priceMin']").val() < 0 ) {
			$("input[name='priceMin']").val(0);
		}
		if(  $("input[name='priceMax']").val() < 0 ) {
			$("input[name='priceMax']").val(0);
		}
	}
	
	var validateMinPrice = function() {
		setTimeout(correctPrice, 10);
	}	
	
    var addFilters = function(newSubCat){
        $.ajax({
            url:'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsBySubcategoryId&id='+ newSubCat.id+'&page_size=1', /* page_size=1 para hacer mas rapida la consulta (preguntar) */
            dataType: 'jsonp'
        }).done(function(resp){  
            console.log(resp);
            if (resp.products.length == 0) {
                $('#colorFilter').empty();
                $('#sizeFilter').empty();
                $('#priceFilter').empty();
                $('#submitFilter').empty();
                $('#purposeFilter').empty();
                $('#noProduct').html(
                    'Lo sentimos, no tenemos '+ newSubCat.name +' en stock este momento.'
                );   
            }else{
                $('#noProduct').empty();
                $('#colorFilter').html(
                    '<p class="filter-name"> Color </p>'+               
                    '<div class="options">'+
                           '<select id="colorOptions" class="option-list"></select>'+
                    '</div>'+
					'<hr class="filter-separator">'
                );
                $('#sizeFilter').html(
                    '<p class="filter-name">Talle </p>'+      
                    '<div class="options" >'+
                            '<select id="sizeOptions" class="option-list"></select>'+
                    '</div>'+
					'<hr class="filter-separator">'
                );
                $('#purposeFilter').html(
                    '<p class="filter-name"> Ocasión </p>'+ 
                    '<div class="options" >'+
                            '<select id="purposeOptions" class="option-list"></select>'+
                    '</div>'+
					'<hr class="filter-separator">'
                ); 		
				$("#priceFilter").focusin(validateMinPrice);
                $('#priceFilter').html(
                    '<p class="filter-name"> Precio </p>'+
                    '<div class="options">'+
                            '<label class="price-min" >Entre </label>'+
                            '<input type="number" name="priceMin" value="0" class="form-control">'+
                            '<label class="price-max"> y </label>'+
                            '<input type="number" name="priceMax" value="0" class="form-control">'+
                    '</div>'
                );
                
                $('#submitFilter').html(
                    '<button type="submit" class="btn btn-primary">'+
                    '<span class="glyphicon glyphicon-filter"></span> Filtrar</button>'
                );
                
                addFiltersOptions(resp, newSubCat);
            }
            
        });
    }       
    var addFiltersOptions = function(resp, newSubCat){
        
        var colors = $.grep(resp.filters, function (element, index) {
            return element.id == 4;
        });
        var sizes = $.grep(resp.filters, function (element, index) {
            return (element.name == "Talle-"+ newSubCat.name ||
                    element.name == "Talle-"+ newSubCat.name+'s' ||
                    element.name == "Talle-"+resp.products[0].category.name)
        });
        var purposes = $.grep(resp.filters, function (element, index) {
            return element.id == 3;
        });
        console.log(newSubCat.name);
        console.log("colors :"+ colors[0]);
        console.log(sizes);
        console.log("purposes :"+ purposes[0] );
        
        /* Color options */
        if (colors[0] != undefined) {
            $('#colorOptions').append(
                '<option value="-1">Todos</option>'
            );
            $.each(colors[0].values, function(index, value){
                $('#colorOptions').append(
                    '<option value="4">'+ value +'</option>'
                )
            });
        }else{
            $('#colorFilter').empty();
        }
        
        
        /* Size options */
        if (sizes[0] != undefined){
            $('#sizeOptions').append(
                '<option value="-1">Todos</option>'
            );
            $.each(sizes[0].values, function(index, value){
                $('#sizeOptions').append(
                    '<option value="'+ sizes[0].id +'">'+ value +'</option>'
                )
            });
        }else{
            $('#sizeFilter').empty();
        }
        
        /* Purpose options */
        if (purposes[0] != undefined) {
            
            $('#purposeOptions').append(
                '<option value="-1">Todas</option>'
            );
            $.each(purposes[0].values, function(index, value){
                $('#purposeOptions').append(
                    '<option value="3">'+ value +'</option>'
                )
            });
        }else{
            $('#purposeFilter').empty();
        }
    
    };        
    
    var subCatListener = function(){/* TODO: insertar el html desde un archivo externo */
        $('#subCatOptions').change(function(){
            var newSubCat = {
                id:$('#subCatOptions option:selected').val(),
                name:$('#subCatOptions option:selected').text()
            };
            if (newSubCat.id != '0'){
                addFilters(newSubCat);
                
            }else{
                $('#colorFilter').empty();
                $('#sizeFilter').empty();
                $('#priceFilter').empty();
                $('#submitFilter').empty();
                $('#purposeFilter').empty();
            }
            
        }); 
    };
    
    
    /*--- Filters Loading ---*/
    var selectedCat = $('#catOptions option:selected').val();
    console.log(selectedCat);
    
    var appendSubCats = function(data){
        console.log(data);
        $('#subCatOptions').append(
            '<option value="0">Todas</option>'                           
        );
        $.each(data.subcategories, function(index, value){ 
            $('#subCatOptions').append(
                '<option value="'+ value.id +'">'+ value.name +'</option>'                           
            );
        })
        
        subCatListener();
    };
    
    var subCatFilterAjax = function(cat){
        return {
            url: 'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllSubcategories&id='+ cat +'&filters=[{"id": 1,"value":"'+ gender +'"}]',
            dataType: 'jsonp',
            success: appendSubCats
        }
    };        
    /*--- Loads "tipo de prenda" filter options ---*/
    
    $('#catOptions').change(function(isFirstLoad){
        var newCat = $('#catOptions option:selected').val();
        console.log(newCat);
        console.log(isFirstLoad);
        $('#subCatOptions').empty();
        if (newCat != '0') {
            $('#subCatFilter').html(
                '<p class="filter-name"> Tipo de prenda </p>'+              
                '<div class="options">'+
                        '<select id="subCatOptions" class="option-list"></select>'+
                '</div>'+
				 '<hr class="filter-separator">'
            );
            $.ajax(subCatFilterAjax(newCat)).done(function(){
                if (isFirstLoad !== undefined) {
                    $('#subCatOptions option[value='+ subcatid +']').attr('selected','selected');
                    $('#subCatOptions').trigger("change", true);
                }
            });
        }else{
            $('#subCatFilter').empty();
        }
    });
    
    /*--- Pages loading ---*/
    
    var insertPages = function(maxPage){
        var url = window.location.href;
        var pageNum = parseInt(page);
        if (maxPage > 1) {
            if (pageNum == 1) {
                $('.pages .pagination').html(
                    '<li><a href="'+ url.replace('page='+page,'page=1') +'">&laquo;</a></li>'
                );
            }else{
                $('.pages .pagination').html(
                    '<li><a href="'+ url.replace('page='+page,'page='+(pageNum-1)) +'">&laquo;</a></li>'
                );
            }
        
            for(var i = 1; i < maxPage; i++){
                if (i == pageNum) {
                    $('.pages .pagination').append(
                        '<li class="active"><a href="'+ url.replace('page='+page,'page='+ i) +'">'+ i +'</a></li>'
                    )
                }else{
                    $('.pages .pagination').append(
                        '<li><a href="'+ url.replace('page='+page,'page='+ i) +'">'+ i +'</a></li>'
                    )
                }
            };
            $('.pages .pagination').append(
                '<li><a href="'+ url.replace('page='+page,'page='+ (pageNum+1)) +'">&raquo;</a></li>'
            );
        }else{
            $('.pages .pagination').html(
                '<li class="active"><a href="'+ url.replace('page='+page,'page=1') +'">1</a></li>'
            );
        }
    }
    
    
    var whileAjax = function(currPage){
        $.ajax({
            url:'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllProducts&page='+ currPage +'&filters=[{"id":1, "value": "'+ gender +'"},{"id": 2,"value": "'+ edad +'"}]',
            dataType: 'jsonp',
            timeout: 3000
        }).done(function ( resp ){
           if (resp.products.length == 0){
                console.log(currPage);
                insertPages(currPage);
           }else{
                currPage++;
                whileAjax(currPage);
           }
        });
    }
    var whileSubcatAjax = function(currPage){
        $.ajax({
                url:'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsBySubcategoryId&id='+ subcatid +'&page='+ currPage +'&filters=[{"id":1, "value": "'+ gender +'"},{"id": 2,"value": "'+ edad +'"}]',
                dataType: 'jsonp',
                timeout: 3000
            }).done(function ( resp ){
           if (resp.products.length < 8){
                console.log(currPage);
                insertPages(currPage);
           }else{
                currPage++;
                whileSubcatAjax(currPage);
           }
        });
    }

    
    /*--- Random products Loading ---*/
	
    if (filterId !== undefined) {
		
        $.ajax({
            url:'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllProducts&filters=[{"id":1, "value": "'+ gender +'"},{"id": 2,"value": "Adulto"},{"id": '+ filterId +',"value": "'+ filterName +'"}]',
            dataType: 'jsonp',
            timeout: 3000
        }).done(function ( resp ){
            appendProducts(resp.products);
        });
    }else if (subcatid === undefined) {
        $.ajax({
            url:'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllProducts&page='+ page +'&filters=[{"id":1, "value": "'+ gender +'"},{"id": 2,"value": "'+ edad +'"}]',
            dataType: 'jsonp',
            timeout: 3000
        }).done(function ( resp ){
            appendProducts(resp.products);
            whileAjax(parseInt(page));
        });
    }else{
        $.ajax({
            url:'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsBySubcategoryId&id='+ subcatid +'&page='+ page +'&filters=[{"id":1, "value": "'+ gender +'"},{"id": 2,"value": "'+ edad +'"}]',
            dataType: 'jsonp',
            timeout: 3000
        }).done(function ( resp ){
            console.log(resp);
            $('#catOptions option[value='+ resp.products[0].category.id +']').attr('selected','selected');
            $('#catOptions').trigger("change", true);
            /*addFilters(resp.products[0].subcategory);*/
			
            appendProducts(resp.products);
            whileSubcatAjax(parseInt(page));
        });
    }
    
    /*--- Filter Handling ---*/

    $('form').submit(function( event ){
        event.preventDefault();
        var filterOptions = $.grep($('form select option:selected'), function(option, index){
                                return (option.value != '-1')
                            });
        console.log(filterOptions.length);
        console.log(filterOptions);
		
        var filters = [];
        for(var i = 2; i < filterOptions.length; i++){
            filters[i - 2] = {"id":parseInt(filterOptions[i].value),"value":filterOptions[i].text};
        };
        filters[filters.length] = {"id":1, "value":gender};
        console.log(filters);
        var price = {"min":parseInt($("form input[name='priceMin']").val()), "max":parseInt($("form input[name='priceMax']").val())};
        console.log(price);
        $.ajax({
            url:'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsBySubcategoryId&id='+
                filterOptions[1].value +'&filters='+JSON.stringify(filters),
            dataType: 'jsonp',
            timeout: 6000
        }).done(function(resp){
            console.log(resp);
            
            var products;
            if (price.max != 0 && price.min <= price.max){
                products = $.grep(resp.products, function(prod, index){
                    return (prod.price >= price.min && prod.price <= price.max);    
                });
            }else{
                products = resp.products;
            }
            $('#products').empty();
            appendProducts(products);
        
        });
    
    });
            


	$("input[name='precioMin']").focusout(validateMinPrice);

});










    
    
    
     
    
