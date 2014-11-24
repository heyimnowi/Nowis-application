package model;

public class Address {
	
	private int id;
	private String name;
	
	Address() { };
	
	public Address(int id, String name) {
		super();
		this.id = id;
		this.name = name;
	}
	public int getId() {
		return id;
	}
	public String getName() {
		return name;
	}
	
	

}
