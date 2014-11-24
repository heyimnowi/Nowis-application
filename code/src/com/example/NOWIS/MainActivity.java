package com.example.NOWIS;

import java.util.ArrayList;
import java.util.List;
import service.TimerService;
import android.annotation.SuppressLint;
import android.app.ActionBar;
import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v4.widget.DrawerLayout;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.SearchView;
import android.widget.SearchView.OnQueryTextListener;
import android.widget.TextView;

public class MainActivity extends Activity
implements NavigationDrawerFragment.NavigationDrawerCallbacks {
	

	private NavigationDrawerFragment nv;
	private CharSequence title;



	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		startService(new Intent(this, TimerService.class));

		nv = (NavigationDrawerFragment)                
				getFragmentManager().findFragmentById(R.id.navigation_drawer);
		title = getTitle();
		nv.setUp(
				R.id.navigation_drawer,
				(DrawerLayout) findViewById(R.id.drawer_layout));
	}


	@Override
	public void onNavigationDrawerItemSelected(int position) {


		Log.i("NOWIS", "Pos: " + Integer.toString(position));
		get_categories(position);
		
	}

	void get_categories(final int position){
		List<String> list= new ArrayList<String>();

		switch(position){
		case 0: 
			FragmentManager fragmentManager = getFragmentManager();		
			Fragment f = new PrincipalFragment();
			fragmentManager.beginTransaction()
			.replace(R.id.container, f)
			.commit();
			return;
		case 1: 
		case 2: 
			list.add(getString(R.string.categ_section1));
			list.add(getString(R.string.categ_section2));
			list.add(getString(R.string.categ_section3));
			break;
		case 3: 
		case 4: 
			list.add(getString(R.string.categ_section4));
			list.add(getString(R.string.categ_section5));
			break;
		}
		start_category_fragment(list,position);
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		int ide = item.getItemId();
		switch(ide){
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
			startActivity(new Intent(this,OrderListActivity.class));
			return true;
		}
		return super.onOptionsItemSelected(item);
	}

	public void start_category_fragment(List<String> list,int position){
		FragmentManager fragmentManager = getFragmentManager();		
		fragmentManager.beginTransaction()
		.replace(R.id.container, PlaceholderFragment.newInstance(list,position + 1))
		.commit();
	}

	public void onSectionAttached(int number) {
		switch (number) {
		case 1:
			title = getString(R.string.app_name);
			break;
		case 2:
			title = getString(R.string.title_section2);
			break;
		case 3:
			title = getString(R.string.title_section3);
			break;
		case 4:
			title = getString(R.string.title_section4);
			break;
		case 5:
			title = getString(R.string.title_section5);
			break;
		}
	}

	public boolean onCreateOptionsMenu(Menu menu) {
		if (!nv.isDrawerOpen()) {
			getMenuInflater().inflate(R.menu.main, menu);

			SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(this);
			if(sp.getString("authenticationtoken", null) == null){
				menu.findItem(R.id.action_logout).setVisible(false);
				menu.findItem(R.id.action_order).setVisible(false);
				menu.findItem(R.id.action_settings).setVisible(false);
			}else{
				menu.findItem(R.id.action_login).setVisible(false);
			}

			ActionBar actionBar = getActionBar(); 
			actionBar.setCustomView(R.layout.search_bar); 

			actionBar.setDisplayShowCustomEnabled(true);
			SearchView searchview = (SearchView) actionBar.getCustomView().findViewById(R.id.search_bar);
			TextView textview = (TextView) actionBar.getCustomView().findViewById(R.id.title_bar);
			textview.setText(title);

			searchview.setOnQueryTextListener(new OnQueryTextListener(){
				@Override
				public boolean onQueryTextChange(String arg0) {
					return false;
				}

				@Override
				public boolean onQueryTextSubmit(String query) {
					Intent intent = new Intent(MainActivity.this, SearchActivity.class);
					intent.putExtra("SEARCH", query);
					startActivity(intent);
					return false;
				}
			});
			return true;
		}
		return super.onCreateOptionsMenu(menu);
	}



	public void setTitle(CharSequence title) {
		this.title = title;
	}


	protected void onResume(){
		super.onResume();
		invalidateOptionsMenu();
	}


	public void restoreActionBar(String s) {
		ActionBar actionBar = getActionBar();
		actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
		actionBar.setDisplayShowTitleEnabled(true);
		actionBar.setTitle(s);
	}

	/**
	 * A placeholder fragment containing a simple view.
	 */
	@SuppressLint("ValidFragment")
	public static class PlaceholderFragment extends Fragment {

		private static final String ARG_GENDER_NUMBER = "gender_number";
		private static List<String> categories=null;


		public static PlaceholderFragment newInstance(List<String> list, int gender) {
			PlaceholderFragment fragment = new PlaceholderFragment(list);
			Bundle args = new Bundle();
			args.putInt(ARG_GENDER_NUMBER, gender);
			fragment.setArguments(args);
			return fragment;
		}

		public PlaceholderFragment(){

		}
		public PlaceholderFragment(List<String> categories) {
			setCategories(categories);
		}
		
		public void onAttach(Activity activity) {
			super.onAttach(activity);
			((MainActivity) activity).onSectionAttached(
					getArguments().getInt(ARG_GENDER_NUMBER));
		}

		public View onCreateView(LayoutInflater inflater, ViewGroup container,
				Bundle savedInstanceState) {

			ArrayAdapter<String> adapter=new ArrayAdapter<String>(getActivity(),android.R.layout.simple_list_item_1,getCategories());

			View rootView = inflater.inflate(R.layout.fragment_main, container, false);
			ListView catlistView = (ListView) rootView.findViewById(R.id.section_label);
			catlistView.setAdapter(adapter);

			catlistView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
				@Override
				public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
					Intent intent= new Intent(getActivity(),SubcategoryActivity.class);

					intent.putExtra("CATEGORY",position);

					intent.putExtra("GENDER", getArguments().getInt(ARG_GENDER_NUMBER));

					Object item=parent.getItemAtPosition(position);
					String subtitle= item.toString();
					intent.putExtra("TITLE", getGender(getArguments().getInt(ARG_GENDER_NUMBER)));
					intent.putExtra("SUBTITLE",subtitle);

					startActivity(intent);
				}
			});

			return rootView;
		}

		private String getGender(int gender){
			switch(gender){
			case 1:
				break;
			case 2:
				return getString(R.string.title_section2);
			case 3:
				return getString(R.string.title_section3);
			case 4:
				return getString(R.string.title_section4);
			case 5:
				return getString(R.string.title_section5);
			}
			return ""; 
		}
		
		public static void setCategories(List<String> categories) {
			PlaceholderFragment.categories = categories;

		}
		public static List<String> getCategories() {
			return categories;
		}
		
	}
}