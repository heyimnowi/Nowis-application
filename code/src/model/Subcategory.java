package model;

import java.util.List;

public class Subcategory {

	private long id;
	private String name;
	private Category category;
	private List<ProductAttribute> attributes;
	
	public Subcategory(){
		
	}
	
	public Subcategory(long id, String name, Category category, List<ProductAttribute> attributes) {
		this.id=id;
		this.name=name;
		this.category=category;
		this.attributes=attributes;
	}
	
	public String getName(){
		return this.name;
	}
	
	public Category getCategory(){
		return category;
	}
	
	public List<ProductAttribute> getAttributes(){
		return attributes;
	}

	public long getId() {
		return id;
	}
}
