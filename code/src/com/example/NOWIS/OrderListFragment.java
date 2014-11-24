package com.example.NOWIS;

import java.util.Collections;
import java.util.List;

import android.app.Fragment;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import model.Order;

public class OrderListFragment extends Fragment {
	private List<Order> orderList;

	public OrderListFragment() {}

	public OrderListFragment(List<Order> orderList){
		this.orderList = orderList;
		Collections.sort(orderList);
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
		if(orderList != null && orderList.isEmpty()){
			View rootView = inflater.inflate(R.layout.fragment_order_list, container, false);
			return rootView;
		}

		OrderAdapter adapter = new OrderAdapter(getActivity(), orderList);
		View rootView = inflater.inflate(R.layout.fragment_order_list, container, false);

		ListView lv = (ListView)rootView.findViewById(R.id.order_list);
		lv.setAdapter(adapter);

		return rootView;
	}
}