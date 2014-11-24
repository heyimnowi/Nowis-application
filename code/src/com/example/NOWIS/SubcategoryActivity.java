package com.example.NOWIS;

import java.util.ArrayList;
import java.util.List;

import model.Filter;
import model.SignInResult;
import model.Subcategory;
import android.app.ActionBar;
import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.content.Intent;
import android.os.Bundle;
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
import android.widget.TextView;
import android.widget.SearchView.OnQueryTextListener;
import api.Api;
import api.ApiCallback;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;


public class SubcategoryActivity extends BaseActivity {
	
	private int cat;
	private int gen;
	private boolean serialized = false;
	private String title;
	private String subtitle;
	private List<Subcategory> subcategories;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		serialized = false;
		setContentView(R.layout.activity_subcategory);
		getActionBar().setDisplayHomeAsUpEnabled(true);
		
			Intent intent = getIntent();
			Integer category= intent.getIntExtra("CATEGORY", 0); //defaultvalue
			cat=category;
			Integer gender= intent.getIntExtra("GENDER", 0); //defaultvalue
			gen=gender;
			title= intent.getStringExtra("TITLE");
			subtitle=intent.getStringExtra("SUBTITLE");
			
		if (savedInstanceState == null || !savedInstanceState.containsKey("subcategories")) {
			get_subcategories(cat,gen);			
		} else {
			subcategories = new Gson()
			.fromJson(savedInstanceState.getString("subcategories"), new TypeToken<List<Subcategory>>(){}.getType());
			addSubcategoriesToFragment(subcategories);
		}
		
	}
	
	protected void onResume(){
		super.onResume();
		invalidateOptionsMenu();
	}
	
	@Override
	protected void onSaveInstanceState(Bundle outState) {
		super.onSaveInstanceState(outState);
		serialized = true;
		outState.putString("TITLE", title);
		if (subcategories != null) {
			outState.putString("subcategories", new Gson().toJson(subcategories));
		}
	}
	
	@Override
	protected void onRestoreInstanceState(Bundle savedInstanceState) {
		super.onRestoreInstanceState(savedInstanceState);
		serialized = false;
	}
	
	private void get_subcategories(final int category, final int gender){
		
		List<Filter> filter=Filter.getFilter(category,gender);
    	
    	long id=0;
    	//TO-DO: gender==1 inicio 
    	if(gender==2 || gender==3){//HOMBRES o MUJERES
    		if(category==0){//INDUMENTARIA
    			id=2;
    		}
    		else if(category==1){//CALZADO
    			id=1;
    		}
    		else if(category==2){//ACCESORIOS
    			id=3;
    		}
    	}
    	else if(gender==4 || gender==5){//INFANTIL
    		id=1; //CALZADO
    	}
    	
    	
	    if(filter!=null && id!=0){
	    	Api.get().getAllSubcategories(id, filter, new ApiCallback<List<Subcategory>>(){
	    			
					@Override
					public void call(List<Subcategory> result, Exception exception) {
						List<String> list= new ArrayList<String>();
	 				if (exception != null) {
	 					//TO-DO manejar excepciones
	 					list.add(exception.getMessage());
	 				} else {
	 					subcategories = result;
	 					if (!serialized) {
	 						addSubcategoriesToFragment(result);	 						
	 					}
	 				}
	 				

	 				//start_subcategory_fragment(list,subcat_id,cat,gen);
	 			//	textView.setText(msg);
					}
	         	
	         	
	         });
	    }
    }
	
	private void addSubcategoriesToFragment(List<Subcategory> subCats) {
		List<Long> subcat_id= new ArrayList<Long>();
		List<String> list= new ArrayList<String>();
		// Yo agrego mis cosas a la lista.
		for (Subcategory subcat : subCats) {
				list.add(subcat.getName());
				subcat_id.add(subcat.getId());
		}
		start_subcategory_fragment(list,subcat_id,cat,gen,title);
	}
    
	 public void start_subcategory_fragment(List<String> list,List<Long>subcat_id,int cat, int gen,String title){
	    	FragmentManager fragmentManager = getFragmentManager();
	        fragmentManager.beginTransaction()
	                .replace(R.id.container, PlaceholderFragment.newInstance(list,subcat_id,cat,gen,title)).commit();
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
				Intent intent = new Intent(SubcategoryActivity.this, SearchActivity.class);
				intent.putExtra("SEARCH", query);
				startActivity(intent);
				return false;
			}
		});

		return true;
	}

	/**
	 * A placeholder fragment containing a simple view.
	 */
	public static class PlaceholderFragment extends Fragment {
		private static List<String> subcategories=null;
		private static List<Long> subcat_id= new ArrayList<Long>();
		private static int category;
		private static int gender;
		private static String title;

		public static PlaceholderFragment newInstance(List<String> list,List<Long>subcat_id,int cat,int gen,String title) {
            PlaceholderFragment fragment = new PlaceholderFragment(list,subcat_id,cat,gen,title);
        //    Bundle args = new Bundle();
       //     args.putInt(ARG_SECTION_NUMBER, sectionNumber);
          //  fragment.setArguments(args);
            return fragment;
        }

		public PlaceholderFragment() {
		}
		
		public PlaceholderFragment(List<String> subcategories,List<Long>subcat_id,int cat,int gen,String t) {
			setSubcategories(subcategories,subcat_id);
			PlaceholderFragment.category=cat;
			PlaceholderFragment.gender=gen;
			PlaceholderFragment.title=t;
        }
		 @Override
		 public void onSaveInstanceState( Bundle outState ) {

		 }
		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container,
				Bundle savedInstanceState) {
			
			ArrayAdapter<String> adapter=new ArrayAdapter<String>(getActivity(),android.R.layout.simple_list_item_1,getSubcategories());
	           
        	View rootView = inflater.inflate(R.layout.fragment_subcategory, container, false);
        	ListView listView = (ListView) rootView.findViewById(R.id.section_subcat);
        	listView.setAdapter(adapter);
           
        	listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {

				@Override
				public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
					Intent intent= new Intent(getActivity(),ProductListActivity.class);
              	  	intent.putExtra("GENDER", getGen());
              	  	intent.putExtra("CATEGORY", getCat());
              	  	intent.putExtra("SUBCAT_ID",getSubcatId().get(position));
              	  	Object item=parent.getItemAtPosition(position);
              	  	String subtitle= item.toString();
              	  	intent.putExtra("SUBCAT_NAME",subtitle);
              	  	intent.putExtra("TITLE", title);
              	  	intent.putExtra("PAGE", 1);
              	  	startActivity(intent);
				}
        		
        	});
        	
            return rootView;
		}
		@Override
        public void onAttach(Activity activity) {
            super.onAttach(activity);
         //   ((MainActivity) activity).onSectionAttached(
           //         getArguments().getInt(ARG_SECTION_NUMBER));
        }

		public static List<String> getSubcategories() {
			return subcategories;
		}
		
		public static int getCat(){
			return category;
		}
		
		public static int getGen(){
			return gender;
		}
		
		public static List<Long> getSubcatId(){
			return subcat_id;
		}

		public static void setSubcategories(List<String> subcategories,List<Long>subcat_id) {
			PlaceholderFragment.subcategories = subcategories;
			PlaceholderFragment.subcat_id=subcat_id;
		}
	}
}
