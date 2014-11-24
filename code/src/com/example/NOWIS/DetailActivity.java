package com.example.NOWIS;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import model.Product;
import model.ProductAttribute;
import android.annotation.SuppressLint;
import android.app.ActionBar;
import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v13.app.FragmentPagerAdapter;
import android.support.v4.app.NavUtils;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.GridView;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;
import api.Api;
import api.ApiCallback;
import api.ApiException;

import com.example.NOWIS.SubcategoryActivity.PlaceholderFragment;
import com.google.gson.Gson;

@SuppressLint("ValidFragment")
public class DetailActivity extends Activity implements ActionBar.TabListener {

	/**
	 * The {@link android.support.v4.view.PagerAdapter} that will provide
	 * fragments for each of the sections. We use a {@link FragmentPagerAdapter}
	 * derivative, which will keep every loaded fragment in memory. If this
	 * becomes too memory intensive, it may be best to switch to a
	 * {@link android.support.v13.app.FragmentStatePagerAdapter}.
	 */
	SectionsPagerAdapter mSectionsPagerAdapter;

	/**
	 * The {@link ViewPager} that will host the section contents.
	 */
	ViewPager mViewPager;

	private long prod_id;
	private boolean serialized = false;
	private List<ProductAttribute> attributes;
	private Product prod;
	private List<String> colors=new ArrayList<String>();
	private List<String> sizes=new ArrayList<String>();
	private List<String> material=new ArrayList<String>();

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		serialized = false;
		setContentView(R.layout.activity_detail);
		getActionBar().setDisplayHomeAsUpEnabled(true);

		Intent intent = getIntent();
		String title= intent.getStringExtra("TITLE");
		String[] images_url=intent.getStringArrayExtra("IMAGES_URL");
		String brand=intent.getStringExtra("BRAND");
		String price=intent.getStringExtra("PRICE");
		prod_id=intent.getIntExtra("PROD_ID", 1);
		get_data();

		// Set up the action bar.
		final ActionBar actionBar = getActionBar();
		actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
		actionBar.setDisplayShowTitleEnabled(true);
		actionBar.setTitle(title);


		// Create the adapter that will return a fragment for each of the three
		// primary sections of the activity.
		mSectionsPagerAdapter = new SectionsPagerAdapter(getFragmentManager(),images_url,brand,price,prod_id,colors,sizes,material);

		// Set up the ViewPager with the sections adapter.
		mViewPager = (ViewPager) findViewById(R.id.pager);
		mViewPager.setAdapter(mSectionsPagerAdapter);

		// When swiping between different sections, select the corresponding
		// tab. We can also use ActionBar.Tab#select() to do this if we have
		// a reference to the Tab.
//		mViewPager
//		.setOnPageChangeListener(new ViewPager.SimpleOnPageChangeListener() {
//			@Override
//			public void onPageSelected(int position) {
//				actionBar.setSelectedNavigationItem(position);
//			}
//		});

		// For each of the sections in the app, add a tab to the action bar.
//		for (int i = 0; i < mSectionsPagerAdapter.getCount(); i++) {
//			// Create a tab with text corresponding to the page title defined by
//			// the adapter. Also specify this Activity object, which implements
//			// the TabListener interface, as the callback (listener) for when
//			// this tab is selected.
//			actionBar.addTab(actionBar.newTab()
//					.setText(mSectionsPagerAdapter.getPageTitle(i))
//					.setTabListener(this));
//		}

	}


	@Override
	protected void onSaveInstanceState(Bundle outState) {
		super.onSaveInstanceState(outState);
		serialized = true;
		if (attributes != null) {
			outState.putString("attributes", new Gson().toJson(attributes));
		}
	}

	@Override
	protected void onRestoreInstanceState(Bundle savedInstanceState) {
		super.onRestoreInstanceState(savedInstanceState);
		serialized = false;
	}

	private void get_data(){
		Api.get().getProductById(prod_id, new ApiCallback<Product>(){

			@Override
			public void call(Product result,
					Exception exception) {
				List<String> list= new ArrayList<String>();
				if (exception != null) {
					//TO-DO manejar excepciones
				} else {
					prod=result;
					attributes= prod.getattributes();
					if (!serialized) {
						addDetailsToFragment(attributes);	 						
					}
				}

			}

		});
	}

	private void addDetailsToFragment(List<ProductAttribute> attr) {
		for(ProductAttribute at: attr){
			if(at.getName().contains("Color")){
				for(String s:at.getValues()){
					colors.add(s);
				}
			}
			if(at.getName().contains("Talle")){
				for(String s: at.getValues()){
					sizes.add(s);
				}
			}
			if(at.getName().contains("Material")){
				//Log.i("hola",at.getValues().get(0));
				material.add(at.getValues().get(0));

			}
		}
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {

		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.detail, menu);
		SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(this);
		if(sp.getString("authenticationtoken", null) == null){
			menu.findItem(R.id.action_logout).setVisible(false);
			menu.findItem(R.id.action_order).setVisible(false);
			menu.findItem(R.id.action_settings).setVisible(false);
		}else{
			menu.findItem(R.id.action_login).setVisible(false);
		}

		return true;
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

	protected void onResume(){
		super.onResume();
		invalidateOptionsMenu();
	}

	@Override
	public void onTabSelected(ActionBar.Tab tab,
			FragmentTransaction fragmentTransaction) {
		// When the given tab is selected, switch to the corresponding page in
		// the ViewPager.
		mViewPager.setCurrentItem(tab.getPosition());
	}

	@Override
	public void onTabUnselected(ActionBar.Tab tab,
			FragmentTransaction fragmentTransaction) {
	}

	@Override
	public void onTabReselected(ActionBar.Tab tab,
			FragmentTransaction fragmentTransaction) {
	}

	/**
	 * A {@link FragmentPagerAdapter} that returns a fragment corresponding to
	 * one of the sections/tabs/pages.
	 */
	public class SectionsPagerAdapter extends FragmentPagerAdapter {
		private String[] images_url;
		private String brand;
		private String price;
		private long prod_id;
		private List<String> colors;
		private List<String> sizes;
		private List<String> material;

		public SectionsPagerAdapter(FragmentManager fm,String[] imagesurl,String prod_brand,String prod_price,long id,
				List<String> c,List<String> size, List<String> mat) {
			super(fm);
			this.images_url=imagesurl;
			this.brand=prod_brand;
			this.price=prod_price;
			this.prod_id=id;
			this.colors=c;
			this.sizes=size;
			this.material=mat;
		}

		@Override
		public Fragment getItem(int position) {
			// getItem is called to instantiate the fragment for the given page.
			// Return a PlaceholderFragment (defined as a static inner class
			// below).
			return PlaceholderFragment.newInstance(position + 1,images_url,brand,price,prod_id,colors,sizes,material);
		}

		@Override
		public int getCount() {
			// Show 2 total pages.
			return 1;
		}

		@Override
		public CharSequence getPageTitle(int position) {
			Locale l = Locale.getDefault();
			switch (position) {
			case 0:
				return getString(R.string.title_photos).toUpperCase(l);
				//case 2:
				//return getString(R.string.title_section3).toUpperCase(l);
			}
			return null;
		}
	}

	/**
	 * A placeholder fragment containing a simple view.
	 */
	public static class PlaceholderFragment extends Fragment {
		/**
		 * The fragment argument representing the section number for this
		 * fragment.
		 */
		private static final String ARG_SECTION_NUMBER = "section_number";
		private static String[] images_url;
		private static String brand;
		private static String price;
		private static long prod_id;
		private static List<String> colors;
		private static List<String> sizes;
		private static List<String> material;

		/**
		 * Returns a new instance of this fragment for the given section number.
		 */
		public static PlaceholderFragment newInstance(int sectionNumber,String[] imagesurl,String brand,String price,long id,
				List<String> colors, List<String> sizes, List<String> material) {

			PlaceholderFragment fragment = new PlaceholderFragment(imagesurl,brand,price,id,colors,sizes,material);
			Bundle args = new Bundle();
			args.putInt(ARG_SECTION_NUMBER, sectionNumber);
			fragment.setArguments(args);
			return fragment;
		}

		public PlaceholderFragment() {
		}

		public PlaceholderFragment(String[] imagesurl,String brand,String price,long id,List<String> colors, List<String> sizes,
				List<String> material){
			set_images_url(imagesurl);
			set_product_info(brand,price,id,colors,sizes,material);
		}

		private void set_images_url(String[] imagesurl){
			PlaceholderFragment.images_url=imagesurl;
		}

		private void set_product_info(String prod_brand,String prod_price,long id,List<String> c,List<String> size,
				List<String> mat){
			PlaceholderFragment.brand=prod_brand;
			PlaceholderFragment.price=prod_price;
			PlaceholderFragment.prod_id=id;
			PlaceholderFragment.colors=c;
			PlaceholderFragment.sizes=size;
			PlaceholderFragment.material=mat;
		}

		private String[] get_images_url(){
			return this.images_url;
		}

		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container,
				Bundle savedInstanceState) {

			List<String> images =new ArrayList<String>();
			for(int j=0;j<images_url.length;j++){
				images.add(images_url[j]);
			}
			ImagesAdapter adapter = new ImagesAdapter(getActivity(),images);
			View rootView = inflater.inflate(R.layout.fragment_detail,container, false);

			set_textviews(rootView);

			rootView = inflater.inflate(R.layout.detail_info,container, false);
			set_textviews(rootView);

			int orientation=getActivity().getResources().getConfiguration().orientation;
			if(orientation==1){//PORTRAIT
				ListView listview=(ListView)rootView.findViewById(R.id.product_photos);
				listview.setRotation(-90);
				listview.setAdapter(adapter);
			}
			else if(orientation==2){//LANDSCAPE
				ListView listview=(ListView)rootView.findViewById(R.id.product_photos);
				listview.setRotation(-90);
				listview.setAdapter(adapter);
			}
			
			return rootView;
		}

		public static List<String> getColors(){
			return colors;
		}

		public static List<String> getSizes(){
			return sizes;
		}

		public static String getMaterial(){
			return material.get(0);
		}
		private void set_textviews(View rootView){
			TextView textView1 = (TextView) rootView.findViewById(R.id.prod_name);

			CharSequence title=getActivity().getActionBar().getTitle();

			int orientation=getActivity().getResources().getConfiguration().orientation;
			if(orientation==1){//PORTRAIT
				textView1.setText(title);
			}
			else if(orientation==2){//LANDSCAPE
				CharSequence title2="";
				CharSequence title3="";
				CharSequence title4="";
				if(title.length()>16){
					int i=10;
					boolean flag=true;
					for(i=10;i<title.length() &&flag;i++){
						if(title.charAt(i)==' '){
							flag=false;
						}
					}
					title2=title.subSequence(0, i);
					title3=title.subSequence(i, title.length());
					title4=(String)title2+"\n"+(String)title3;
					textView1.setText(title4);
				}
				else{
					textView1.setText(title);
				}
			}

			TextView textView2 = (TextView) rootView.findViewById(R.id.prod_brand);
			textView2.setText(getString(R.string.brand)+" "+brand);
			TextView textView3 = (TextView) rootView.findViewById(R.id.prod_price);
			textView3.setText("$"+price);
		}
	}

}
