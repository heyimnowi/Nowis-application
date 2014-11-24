package model;

import java.util.ArrayList;
import java.util.List;

public class Filter {

	private int id;
	private String value;
	
	public Filter(){
		
	}
	public Filter(int id, String value) {
		this.id=id;
		this.value=value;
	}
	
	public static List<Filter> getFilter(int category, int gender){
		
		 List<Filter> filter= new ArrayList<Filter>();
        
		 switch(gender){
		 case 1://INICIO, PROMOCIONES, NOVEDADES
			// filter.add(new Filter(1,"Masculino"));
			 //filter.add(new Filter(2,"Adulto"));
			 break;
		 case 2://HOMBRES
			 filter.add(new Filter(1,"Masculino"));
			 filter.add(new Filter(2,"Adulto"));
			 break;
		 case 3://MUJERES
			 filter.add(new Filter(1,"Femenino"));
			 filter.add(new Filter(2,"Adulto"));
			 break;
		 case 4://INFANTILES
			 filter.add(new Filter(2,"Infantil"));
			 if(category==0){//NINOS
				 filter.add(new Filter(1,"Masculino"));
			 }
			 else if(category==1){//NINAS
				 filter.add(new Filter(1,"Femenino"));
			 }
			 break;
		 case 5://BEBES
			 filter.add(new Filter(2,"Bebe"));
			 if(category==0){//NINOS
				 filter.add(new Filter(1,"Masculino"));
			 }
			 else if(category==1){//NINAS
				 filter.add(new Filter(1,"Femenino"));
			 }
			 break;
		 }
		 
		 return filter;
	}
}
