package com.example.NOWIS;

import model.Order;
import android.app.Fragment;
import android.app.FragmentManager;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import api.Api;
import api.ApiCallback;

public class OrderDetailActivity extends BaseActivity {
	private Order order;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_order_detail);
		getActionBar().setDisplayHomeAsUpEnabled(true);
		getActionBar().setTitle(R.string.title_activity_order_detail);
		
		int orderId = getIntent().getIntExtra("ID", -1);
		
		getOrderInfo();

		if (savedInstanceState == null) {
			getFragmentManager().beginTransaction()
					.add(R.id.container, new PlaceholderFragment()).commit();
		}
	}

	private void getOrderInfo(){
		SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
		String authToken = sp.getString("authenticationtoken", null);
		String username = sp.getString("username", null);

		if (authToken == null || username == null) return;

		Api.get().getOrderById(username, authToken, new ApiCallback<Order>() {
			@Override
			public void call(Order result, Exception exception) {
				if (exception != null) {
					Log.i("order", "ERROR");
					return;
				}
				order = result;
				startOrderDetailFragment();
			}
		});
	}
	
	private void startOrderDetailFragment(){
		FragmentManager fm = getFragmentManager();
		fm.beginTransaction().replace(R.id.container, (new OrderDetailFragment(order))).commit();
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.order_detail, menu);
		return true;
	}

	/**
	 * A placeholder fragment containing a simple view.
	 */
	public static class OrderDetailFragment extends Fragment {
		private Order order;
		private String[] st = {
			getString(R.string.order_status_2),
			getString(R.string.order_status_3),
			getString(R.string.order_status_4),
		};

		public OrderDetailFragment() {

		}

		public OrderDetailFragment(Order order) {
			this.order = order;
		}

		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container,
				Bundle savedInstanceState) {
		if(order == null){
			View rootView = inflater.inflate(R.layout.fragment_order_detail, container, false);
			return rootView;
		}

		View rootView = inflater.inflate(R.layout.order_list, container, false);
		
		model.Address ad;
		String s;
		
		TextView txtTitle = (TextView) rootView.findViewById(R.id.order_id2);
		ImageView status = (ImageView) rootView.findViewById(R.id.order_status);
		TextView address = (TextView) rootView.findViewById(R.id.order_sent_to2);
		TextView dateReceived = (TextView) rootView.findViewById(R.id.order_date_received2);
		TextView dateDelivery = (TextView) rootView.findViewById(R.id.order_date_delivery2);
		
		txtTitle.setSingleLine(true);
		txtTitle.setText(order.getId() + "\n");
		
		int img_id = R.drawable.no_disponible;
		switch(Integer.valueOf(order.getStatus())) {
		
			case 2:
				img_id = R.drawable.confirmed;
				break;
			case 3:
				if(st[Integer.valueOf(order.getStatus()) - 2].equals("Shipped")) {
					img_id = R.drawable.shipped;
				} else {
					img_id = R.drawable.transportado;
				}
				break;
			case 4:
				if(st[Integer.valueOf(order.getStatus()) - 2].equals("Delivered")) {
					img_id = R.drawable.delivered;
				} else {
					img_id = R.drawable.entregado;
				}
				break;
		}
		
		Drawable img = getResources().getDrawable(img_id);
		status.setImageDrawable(img);

		address.setSingleLine(true);
		ad = order.getAddress();
		if(ad == null){
			s = getString(R.string.order_address_unknown);
		}else{
			s = ad.getName();
		}
		address.setText(s);
		
		if(order.getDeliveredDate() == null){
			s = getString(R.string.order_date_unknown);
		}else{
			s = order.getDeliveredDate();
		}
		dateDelivery.setText(s);
		
		dateReceived.setSingleLine(true);
		dateReceived.setText(order.getReceivedDate());
		
		return rootView;
		}
	}
}