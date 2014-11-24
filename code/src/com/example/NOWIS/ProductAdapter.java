package com.example.NOWIS;

import java.io.FileNotFoundException;
import java.util.List;

import model.Product;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.res.TypedArray;
import android.provider.MediaStore.Images;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.Gallery;
import android.widget.ImageView;
import android.widget.TextView;

import com.koushikdutta.ion.Ion;


public class ProductAdapter extends ArrayAdapter<Product>{
	private final Activity context;
	private final List<Product> productList;
	private final List<Integer> productImgs;
	private final boolean buttonMore;
	
	public ProductAdapter(Activity context,List<Product> productInfo, List<Integer> productImgs,boolean more) {
		super(context, R.layout.product_list, productInfo);
		this.context = context;
		this.productList = productInfo;
		this.productImgs = productImgs;
		this.buttonMore=more;
	}
	@Override
	public View getView(int position, View view, ViewGroup parent) {
		LayoutInflater inflater = context.getLayoutInflater();
		View rowView= inflater.inflate(R.layout.product_list, null, true);

		TextView txtTitle = (TextView) rowView.findViewById(R.id.prod_txt);
		ImageView imageView = (ImageView) rowView.findViewById(R.id.prod_img);
		Gallery gallery = (Gallery) rowView.findViewById(R.id.prod_imgs);
	    
		
		TextView brand= (TextView) rowView.findViewById(R.id.prod_brand);
		TextView price= (TextView) rowView.findViewById(R.id.prod_price);
		
		txtTitle.setSingleLine(true);
		txtTitle.setText(productList.get(position).getName()+"\n");
		brand.setSingleLine(true);
		brand.setText(productList.get(position).getAttributeById(Product.BrandId).getValues().get(0)+"\n");
		price.setSingleLine(true);
		price.setText(String.valueOf("$"+productList.get(position).getPrice()+"\n"));
		
		Ion.with(context)
		.load(productList.get(position).getImgsrc()[0])
		.withBitmap()
		.error(R.drawable.no_disponible) //error_image
		.intoImageView(imageView);
		
		
		return rowView;
	}
	
	
}