package model;

import java.util.List;

public class Orders {
	
	private List<Order> orders;
	
	Orders() { };
	
	public Orders(List<Order> orders) {
		super();
		this.orders = orders;
	}
	
	public List<Order> getOrders() {
		return orders;
	}

}
