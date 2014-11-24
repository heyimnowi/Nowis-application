package model;

import java.util.List;

public class ApiFilter {
	private long id;
	private String name;
	private List<String> values;
	
	public long getId(){
		return id;
	}
	
	public String getName(){
		return name;
	}
	
	public List<String> getValues(){
		return values;
	}
}
