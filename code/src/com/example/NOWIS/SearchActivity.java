package com.example.NOWIS;

import java.util.ArrayList;
import java.util.List;

import model.ApiResponse;
import model.Product;
import android.app.ActionBar;
import android.app.Activity;
import android.app.FragmentManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.app.NavUtils;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.SearchView;
import android.widget.TextView;
import android.widget.SearchView.OnQueryTextListener;
import api.Api;
import api.ApiCallback;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class SearchActivity extends Activity {
	
	private List<Product> product_list = new ArrayList<Product>();
	private List<Integer> product_images= new ArrayList<Integer>();
	private String query;
	private boolean serialized = false;
	private int total;
	private int page=1;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		serialized = false;
		
		setContentView(R.layout.activity_product_list);
		getActionBar().setDisplayHomeAsUpEnabled(true);
		
		Intent intent = getIntent();
		query=intent.getStringExtra("SEARCH");
		
		if (savedInstanceState == null || !savedInstanceState.containsKey("productlist")) {
			get_search(query);		
		} else {
			product_list = new Gson()
			.fromJson(savedInstanceState.getString("productlist"), new TypeToken<List<Product>>(){}.getType());
			addProductsToFragment(product_list,total,page);
		}
	}

	private void addProductsToFragment(List<Product> prodList,int total, int page){
		for (Product product : prodList) {
			product_images.add(R.drawable.ic_launcher);
		}
		start_productlist_fragment(product_list,product_images,total,page);
	}
	
	public void start_productlist_fragment(List<Product> product_list,List<Integer> product_images,int total,int page){
		FragmentManager fragmentManager = getFragmentManager();
		fragmentManager.beginTransaction()
		.replace(R.id.container, ProductListFragment.newInstance(product_list,product_images,total,page,-1,null,query)).commit();
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

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        switch(id){
        	case R.id.action_settings:
        		startActivity(new Intent(this, SettingsActivity.class));
        		return true;
        	case R.id.action_login:
        		startActivity(new Intent(this, LoginActivity.class));
        		return true;
        	case R.id.action_logout:
				SharedPreferences.Editor editor = PreferenceManager.getDefaultSharedPreferences(this).edit();
				editor
				.remove("username")
				.remove("password")
				.remove("authenticationtoken")
				.commit();
				invalidateOptionsMenu();
				return true;
        	case R.id.action_order:
        		startActivity(new Intent(this, OrderListActivity.class));
        		return true;
			case android.R.id.home:
		        NavUtils.navigateUpFromSameTask(this);
		        return true;
        }
        return super.onOptionsItemSelected(item);
    }
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {

		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.base, menu);
		
		SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(this);
		if(sp.getString("authenticationtoken", null) == null){
			menu.findItem(R.id.action_logout).setVisible(false);
			menu.findItem(R.id.action_order).setVisible(false);
			menu.findItem(R.id.action_settings).setVisible(false);
		}else{
			menu.findItem(R.id.action_login).setVisible(false);
		}

		ActionBar actionBar = getActionBar(); 
		actionBar.setCustomView(R.layout.subcategory_list_search_bar); 

		actionBar.setDisplayShowCustomEnabled(true);
		SearchView searchview = (SearchView) actionBar.getCustomView().findViewById(R.id.search_bar_subcat);
		TextView textview= (TextView) actionBar.getCustomView().findViewById(R.id.title_bar_subcat);
		textview.setText(R.string.searching_product);
		TextView textview2= (TextView) actionBar.getCustomView().findViewById(R.id.subtitle_bar_subcat);
		textview2.setText("\""+query+"\"");

		searchview.setOnQueryTextListener(new OnQueryTextListener(){
			@Override
			public boolean onQueryTextChange(String arg0) {
				// TODO Auto-generated method stub
				return false;
			}

			@Override
			public boolean onQueryTextSubmit(String query) {
				Intent intent = new Intent(SearchActivity.this, SearchActivity.class);
				intent.putExtra("SEARCH", query);
				finish();
				startActivity(intent);
				return false;
			}
		});

		return true;
	}
	
	private void get_search(String query){
			  Api.get().getProductsByName(query, new ApiCallback<ApiResponse>() {

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
							addProductsToFragment(result.getProducts(),total,page);	 						
						}
					  }
				  }
			  });
	}
}
