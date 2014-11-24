package com.example.NOWIS;
import java.util.ArrayList;
import java.util.List;

import model.ApiResponse;
import model.Filter;
import model.Product;
import android.app.ActionBar;
import android.app.Activity;
import android.app.FragmentManager;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.widget.SearchView;
import android.widget.TextView;
import android.widget.SearchView.OnQueryTextListener;
import api.Api;
import api.ApiCallback;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class ProductListActivity extends Activity {

	private String title;
	private String subtitle;
	private Long subcatId;
	private List<Filter> filter;
	private List<Product> product_list = new ArrayList<Product>();
	private List<Integer> product_images= new ArrayList<Integer>();
	private boolean serialized = false;
	private int total;
	private int page;

	  @Override
	  protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		serialized = false;
		setContentView(R.layout.activity_product_list);
		getActionBar().setDisplayHomeAsUpEnabled(true);

		Intent intent = getIntent();
		Integer category= intent.getIntExtra("CATEGORY", 0); //defaultvalue
		Integer gender= intent.getIntExtra("GENDER", 0); //defaultvalue
		subcatId= intent.getLongExtra("SUBCAT_ID", 0);
		subtitle= intent.getStringExtra("SUBCAT_NAME");
		title=intent.getStringExtra("TITLE");
		page=intent.getIntExtra("PAGE", 1);

		if (savedInstanceState == null || !savedInstanceState.containsKey("productlist")) {
			get_products(category,gender,subcatId);		
		} else {
			product_list = new Gson()
			.fromJson(savedInstanceState.getString("productlist"), new TypeToken<List<Product>>(){}.getType());
			addProductsToFragment(product_list,total,page);
		}
	}

	@Override
	protected void onSaveInstanceState(Bundle outState) {
		super.onSaveInstanceState(outState);
		serialized = true;
		if (product_list != null) {
			outState.putString("productlist", new Gson().toJson(product_list));
		}
	}

	@Override
	protected void onRestoreInstanceState(Bundle savedInstanceState) {
		super.onRestoreInstanceState(savedInstanceState);
		serialized = false;
	}

	private void get_products(int category, int gender, long subcatId){
		filter=Filter.getFilter(category,gender);
		if(filter!=null){
			Api.get().getProductsBySubcategoryId(subcatId, page, filter, new ApiCallback<ApiResponse>() {

				@Override
				public void call(ApiResponse result, Exception exception) {
					List<String> list= new ArrayList<String>();
					if (exception != null) {
						//TO-DO:manejar excepciones
						list.add(exception.getMessage());
					} else {
						product_list = result.getProducts();
						total= result.getTotal();
						page= result.getPage();
						
						if (!serialized) {
							addProductsToFragment(result.getProducts(), total, page);	 						
						}
					}
				}

			});
		}
	}

	private void addProductsToFragment(List<Product> prodList, int total, int page){
		for (Product product : prodList) {
			//pedirle elementos al producto
			product_images.add(R.drawable.ic_launcher);
		}
		start_productlist_fragment(product_list,product_images, total, page);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		if(!super.onCreateOptionsMenu(menu)) return false;

		ActionBar actionBar = getActionBar(); 
		actionBar.setCustomView(R.layout.subcategory_list_search_bar); 

		actionBar.setDisplayShowCustomEnabled(true);
		SearchView searchview = (SearchView) actionBar.getCustomView().findViewById(R.id.search_bar_subcat);
		TextView textview= (TextView) actionBar.getCustomView().findViewById(R.id.title_bar_subcat);
		textview.setText(title);
		TextView textview2= (TextView) actionBar.getCustomView().findViewById(R.id.subtitle_bar_subcat);
		textview2.setText(subtitle);

		searchview.setOnQueryTextListener(new OnQueryTextListener(){
			@Override
			public boolean onQueryTextChange(String arg0) {
				// TODO Auto-generated method stub
				return false;
			}

			@Override
			public boolean onQueryTextSubmit(String query) {
				Intent intent = new Intent(ProductListActivity.this, SearchActivity.class);
				intent.putExtra("SEARCH", query);
				startActivity(intent);
				return false;
			}
		});

		return true;
	}

	public void start_productlist_fragment(List<Product> product_list,List<Integer> product_images,int total, int page){
		FragmentManager fragmentManager = getFragmentManager();
		fragmentManager.beginTransaction()
		.replace(R.id.container, ProductListFragment.newInstance(product_list,product_images,total,page,subcatId,filter,null)).commit();
	}

}
