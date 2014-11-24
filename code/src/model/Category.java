package model;

import java.util.List;

public class Category {
	private int id;
	private String name;
	private List<ProductAttribute> attributes;
	
	public Category(){
		
	}
	
	public Category(int id, String name, List<ProductAttribute> attributes) {
		this.id=id;
		this.name=name;
		this.attributes=attributes;
	}
	
	public int getId() {
		return id;
	}
	public String getName() {
		return name;
	}
	public List<ProductAttribute> getAttributes() {
		return attributes;
	}
}
