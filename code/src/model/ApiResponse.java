package model;

import java.util.ArrayList;
import java.util.List;


public class ApiResponse {
	public static final int SizeId=7;

	private Meta meta;
	private int page;
	private int pageSize;
	private int total;
	private List<Product> products;

	public Meta getMeta() {
		return meta;
	}

	public List<Product> getProducts() {
		return products;
	}
	
	public int getTotal() {
		return total;
	}
	
	public int getPagesize() {
		return pageSize;
	}
	
	public int getPage(){
		return page;
	}
	
}