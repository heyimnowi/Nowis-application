package com.example.NOWIS;



import android.app.Activity;
import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

public class PrincipalFragment extends Fragment {

	public PrincipalFragment() {}

	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
		
		View rootView = inflater.inflate(R.layout.fragment_principal, container, false);
		
		rootView.findViewById(R.id.men_button).setOnClickListener(
				new View.OnClickListener() {
					@Override
					public void onClick(View view) {
						
						MainActivity main = (MainActivity) PrincipalFragment.this.getActivity();
						
						if(main != null) {
							main.get_categories(1);
						} else {
							return;
						}
					}
		});
		
		rootView.findViewById(R.id.woman_button).setOnClickListener(
				new View.OnClickListener() {
					@Override
					public void onClick(View view) {
						
						MainActivity main = (MainActivity) PrincipalFragment.this.getActivity();
						
						if(main != null) {
							main.get_categories(2);
						} else {
							return;
						}
					}
		});
		
		rootView.findViewById(R.id.kids_button).setOnClickListener(
				new View.OnClickListener() {
					@Override
					public void onClick(View view) {
						
						MainActivity main = (MainActivity) PrincipalFragment.this.getActivity();
						
						if(main != null) {
							main.get_categories(3);
						} else {
							return;
						}
					}
		});
		
		return rootView;
	}
}