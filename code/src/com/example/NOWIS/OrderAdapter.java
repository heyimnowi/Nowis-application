package com.example.NOWIS;

import java.util.List;

import model.Order;
import android.app.Activity;
import android.graphics.drawable.Drawable;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

public class OrderAdapter extends ArrayAdapter<Order>{
	private final Activity context;
	private final List<Order> orderList;
	private final String[] st;
	
	public OrderAdapter(Activity context, List<Order> orderList) {
		super(context, R.layout.order_list, orderList);
		this.context = context;
		this.orderList = orderList;
		String[] s = {
				context.getString(R.string.order_status_2),
				context.getString(R.string.order_status_3),
				context.getString(R.string.order_status_4)
		};
		st = s;
	}

	@Override
	public View getView(int position, View view, ViewGroup parent) {
		LayoutInflater inflater = context.getLayoutInflater();
		View rowView = inflater.inflate(R.layout.order_list, null, true);
		Order ord = orderList.get(position);
		model.Address ad;
		String s;
		
		TextView txtTitle = (TextView) rowView.findViewById(R.id.order_id2);
		ImageView status = (ImageView) rowView.findViewById(R.id.order_status);
		TextView address = (TextView) rowView.findViewById(R.id.order_sent_to2);
		TextView dateReceived = (TextView) rowView.findViewById(R.id.order_date_received2);
		TextView dateDelivery = (TextView) rowView.findViewById(R.id.order_date_delivery2);
		
		txtTitle.setSingleLine(true);
		txtTitle.setText(ord.getId() + "\n");
		
		int img_id = R.drawable.no_disponible;
		switch(Integer.valueOf(ord.getStatus())) {
		
			case 2:
				img_id = R.drawable.confirmed;
				break;
			case 3:
				if(st[Integer.valueOf(ord.getStatus()) - 2].equals("Shipped")) {
					img_id = R.drawable.shipped;
				} else {
					img_id = R.drawable.transportado;
				}
				break;
			case 4:
				if(st[Integer.valueOf(ord.getStatus()) - 2].equals("Delivered")) {
					img_id = R.drawable.delivered;
				} else {
					img_id = R.drawable.entregado;
				}
				break;
		}
		Drawable img = context.getResources().getDrawable(img_id);
		status.setImageDrawable(img);

		address.setSingleLine(true);
		ad = ord.getAddress();
		if(ad == null){
			s = context.getString(R.string.order_address_unknown);
		}else{
			s = ad.getName();
		}
		address.setText(s);
		
		if(ord.getDeliveredDate() == null){
			s = context.getString(R.string.order_date_unknown);
		}else{
			s = ord.getDeliveredDate();
		}
		dateDelivery.setText(s);
		
		dateReceived.setSingleLine(true);
		dateReceived.setText(ord.getReceivedDate());
		
		return rowView;
	}
}