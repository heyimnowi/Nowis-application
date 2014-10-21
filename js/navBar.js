$('document').ready(function(){
    var gender = getUrlParameterByName('gender');
    var edad = getUrlParameterByName('edad');
    var subcatid = getUrlParameterByName('subcatid');
    var page = getUrlParameterByName('page');
    /*--- Nav parameters loading ---*/ /*TODO: ver como cargar catergoria infantil */
    $('#indumentaria ul').empty();
    $('#calzados ul').empty();
    $('#accesorios ul').empty();
    
	var count = 0;
    for(var id = 1; id <= 3; id++){
        $.ajax({
            url:'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllSubcategories&id='+ id +'&filters=[{"id":1, "value": "'+ gender +'"},{"id": 2,"value": "'+ edad +'"}]',
            dataType: 'jsonp',
            timeout: 3000
        }).done(function ( resp ){
            console.log(resp);
			count++;
            $.each(resp.subcategories, function(index, subcategory){
				
				console.log("durante el each");
                if (subcategory.category.id == 1) {
                    $('#calzados ul').append(
                        '<li><a href="search.html?gender='+ gender +'&edad='+ edad +'&page=1&subcatid='+ subcategory.id +'">'+subcategory.name+'</a></li>'                              
                    );      
                }else if (subcategory.category.id == 2) {
                    $('#indumentaria ul').append(
                        '<li><a href="search.html?gender='+ gender +'&edad='+ edad +'&page=1&subcatid='+ subcategory.id +'">'+subcategory.name+'</a></li>'                              
                    ); 
                }else{
                    $('#accesorios ul').append(
                        '<li><a href="search.html?gender='+ gender +'&edad='+ edad +'&page=1&subcatid='+ subcategory.id +'">'+subcategory.name+'</a></li>'                              
                    ); 
                }
            });
        });
    }
			
    $('#novedades').html(
        '<a href="search.html?gender='+ gender +'&edad='+ edad +'&filterId=6&filterName=Nuevo">'+
           '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+
               'NOVEDADES'+
            '</button>'+
        '</a>'
    );
    
    $('#promociones').html(
        '<a href="search.html?gender='+ gender +'&edad='+ edad +'&filterId=5&filterName=Oferta">'+
           '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+
               'PROMOCIONES'+
            '</button>'+
        '</a>'
    );
    $('#novedades').click(function(){
        window.location.replace('search.html?gender='+ gender +'&edad='+ edad +'&filterId=6&filterName=Nuevo');    
    });
    
    $('#promociones').click(function(){
        window.location.replace('search.html?gender='+ gender +'&edad='+ edad +'&filterId=5&filterName=Oferta');    
    });
    
    if (gender == "Masculino" & edad == "Adulto") {
        $('#masc').addClass('active');
    }else if (gender == "Femenino" & edad == "Adulto") {
        $('#fem').addClass('active');
    }else if (gender == "Femenino" & edad == "Bebe") {
        $('#ninas').addClass('active');
    }else {
        $('#ninos').addClass('active');
    }
    
    
    
    
   
});

function isEmpty( el ){
      return !$.trim(el.html())
  }
  if (isEmpty($('#element'))) {
      // do something
 }