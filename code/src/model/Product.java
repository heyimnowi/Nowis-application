package model;

import java.util.List;

import android.util.Log;

public class Product {
	private int id;
	private String name;
	private double price;
	private String[] imageUrl;
	private Category category;
	private Subcategory subcategory;
	private List<ProductAttribute> attributes;
	public static final int BrandId = 9;
	public static final int ColorId = 4;
	public static final int MaterialId = 8;


	public int getId() {
		return id;
	}
	public String getName() {
		return name;
	}
	public double getPrice() {
		return price;
	}
	public String[] getImgsrc() {
		return imageUrl;
	}
	public Category getCategory() {
		return category;
	}
	public Subcategory getSubcategory() {
		return subcategory;
	}
	
	public List<ProductAttribute> getattributes(){
		return attributes;
	}
	
	public ProductAttribute getAttributeById(int id){
		for(ProductAttribute att: attributes){
			if(att.getId()==id)
				return att;
		}
		return null;
	}
	
	public ProductAttribute findSizes() {
		for(ProductAttribute att: attributes){
			Log.i("hola","enfindsizes"+att.getName()+String.valueOf(att.getId()));
			for(int i=0;i<att.getValues().size();i++){
				Log.i("hola",att.getValues().get(i));
			}
			//if(att.getName().contains("Talle"))
			//	return att;
		}
		return null;
	}
	public ProductAttribute findMaterials() {
		for(ProductAttribute att: attributes){
			if(att.getName().contains("Material")){
				Log.i("hola",att.getName());
				for(int i=0;i<att.getValues().size();i++){
					Log.i("hola",att.getValues().get(i));
				}
				return att;
			}
		}
		return null;
	}
	public ProductAttribute findColors() {
		for(ProductAttribute att: attributes){
			Log.i("hola","enfindcolors"+att.getName()+String.valueOf(att.getId()));
			for(int i=0;i<att.getValues().size();i++){
				Log.i("hola",att.getValues().get(i));
			}
			//if(att.getName().contains("Color")){
			//	return att;
			//}
		}
		return null;
	}


}
