package model;

public class CreditCard {
	
	private int id;
	private String number;
	
	CreditCard() { };
	
	public CreditCard(int id, String number) {
		super();
		this.id = id;
		this.number = number;
	}

	public int getId() {
		return id;
	}
	public String getNumber() {
		return number;
	}
	
	

}
