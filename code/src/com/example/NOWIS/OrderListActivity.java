package com.example.NOWIS;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import model.Order;
import model.Orders;
import model.Product;
import android.app.Activity;
import android.app.ActionBar;
import android.app.Fragment;
import android.app.FragmentManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.ListView;
import android.os.Build;
import android.preference.PreferenceManager;
import android.renderscript.Type;
import api.Api;
import api.ApiCallback;

public class OrderListActivity extends BaseActivity {
	
	private List<Order> ordersList = new ArrayList<Order>();
	private final String DEFAULT_ORDERS = "[]";

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		setContentView(R.layout.activity_order_list);
		getActionBar().setDisplayHomeAsUpEnabled(true);
		getActionBar().setTitle(R.string.title_activity_order_list);

		if (savedInstanceState == null || !savedInstanceState.containsKey("ordersList")) {
			getOrders();
		}else{
			ordersList = new Gson()
			.fromJson(savedInstanceState.getString("ordersList"), new TypeToken<List<Order>>(){}.getType());
			addOrdersToFragment(ordersList);
		}
	}

	private void addOrdersToFragment(List<Order> ol){
		startOrderListFragment();
	}

	private void getOrders(){
		SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
		String authToken = sp.getString("authenticationtoken", null);
		String username = sp.getString("username", null);

		if (authToken == null || username == null) return;

		Api.get().getAllOrders(username, authToken, new ApiCallback<Orders>() {
			@Override
			public void call(Orders result, Exception exception) {
				if (exception != null) {
					Log.i("hola", "ERROR");
					return;
				}

				for(Order o : result.getOrders()){
					
					if(Integer.valueOf(o.getStatus()) > 1) {
						ordersList.add(o);
					}
				}
				startOrderListFragment();
			}
		});
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.order_list, menu);
		return true;
	}

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
    	if(!super.onOptionsItemSelected(item)) return false;
    	if(item.getItemId() == R.id.action_logout) finish();
        return true;
    }

	protected void onResume(){
		super.onResume();
		invalidateOptionsMenu();
	}

	public void startOrderListFragment(){
		FragmentManager fm = getFragmentManager();
		fm.beginTransaction().replace(R.id.container, (new OrderListFragment(ordersList))).commit();
	}
}
