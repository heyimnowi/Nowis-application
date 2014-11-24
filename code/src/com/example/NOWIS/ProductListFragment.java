package com.example.NOWIS;

import java.util.ArrayList;
import java.util.List;

import model.ApiResponse;
import model.Filter;
import model.Product;
import android.app.Fragment;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.AbsListView.OnScrollListener;
import android.widget.AdapterView;
import android.widget.GridView;
import android.widget.ListView;
import api.Api;
import api.ApiCallback;


public class ProductListFragment extends Fragment{
	private static List<Product> product_info;
	private static List<Integer> images;
	private static int total;
	private static int page;
	private boolean more=false;
	private static long subcatid;
	private static List<Filter> filter;
	private boolean serialized = false;
	private static boolean is_Search=false;
	private static String query=null;

	private static final int PORTRAIT = 1;
	private static final int LANDSCAPE = 2;

	public ProductListFragment(){}
	
	public ProductListFragment(List<Product> product_list,List<Integer> product_images,int total, int page,
			long subcatid, List<Filter> filter,String query){
		setProductInfo(product_list, product_images,total,page,subcatid,filter,query);
	}
	
	public static void setProductInfo(List<Product>product_list,List<Integer> product_images,int t,int p,
			long subcatId, List<Filter> f,String q){
		ProductListFragment.product_info=product_list;
		ProductListFragment.images=product_images;
		ProductListFragment.total=t;
		ProductListFragment.page=p;
		ProductListFragment.subcatid=subcatId;
		ProductListFragment.filter=f;
		ProductListFragment.query=q;
		if(subcatId==-1 && filter==null){
			ProductListFragment.is_Search=true;
		}
	}
	
	public static ProductListFragment newInstance(List<Product> product_list,List<Integer>product_images,
			int total, int page, long subcatid, List<Filter> filter,String query) {
		ProductListFragment fragment = new ProductListFragment(product_list,product_images,total,page,subcatid,filter,query);
        return fragment;
    }


	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		serialized = false;
		if(product_info.isEmpty()){
			View rootView = inflater.inflate(R.layout.no_product_layout,container, false);
			return rootView;
		}
		more=(page*8)<total;
		
		ProductAdapter adapter = new ProductAdapter(getActivity(),product_info, images,more); 
		View rootView = inflater.inflate(R.layout.fragment_product_list,container, false);
		
		load_products(rootView,adapter);
				
		return rootView;
	}
	
	private void load_products(final View rootView,ProductAdapter adapter){

		int orientation=getActivity().getResources().getConfiguration().orientation;
		if(orientation == PORTRAIT){
			ListView listview=(ListView)rootView.findViewById(R.id.product_list);
			listview.setAdapter(adapter);
			//TO-DO:hacer un nuevo adapter para ambos casos
			
			listview.setOnItemClickListener(new AdapterView.OnItemClickListener() {
				@Override
				public void onItemClick(AdapterView<?> parent, View view,
						int position, long id) {
					create_intent(product_info.get(+ position).getName(),product_info.get(position).getImgsrc(), 
							product_info.get(+ position).getAttributeById(Product.BrandId).getValues().get(0),
							 String.valueOf(product_info.get(+ position).getPrice()),product_info.get(position).getId());
				}
			});
			listview.setOnScrollListener(new OnScrollListener(){

				private int currentFirstVisibleItem;
				private int currentVisibleItemCount;
				private int currentScrollState;

				@Override
				public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
				    this.currentFirstVisibleItem = firstVisibleItem;
				    this.currentVisibleItemCount = visibleItemCount;
				}
				@Override
				public void onScrollStateChanged(AbsListView view, int scrollState) {
				    this.currentScrollState = scrollState;
				    this.isScrollCompleted();
				 }

				private void isScrollCompleted() {
				    if (this.currentVisibleItemCount > 0 && this.currentScrollState == SCROLL_STATE_IDLE) {
				        /*** In this way I detect if there's been a scroll which has completed ***/
				        /*** do the work! ***/
				    	if(more){
				    		page++;
				    		more=(page*8)<total;
				    		get_products(rootView);
				    	}
				    }
				}
				
			});
			
		}
		else if(orientation== LANDSCAPE){
			GridView gridview=(GridView)rootView.findViewById(R.id.product_list);
			gridview.setAdapter(adapter);
			gridview.setOnItemClickListener(new AdapterView.OnItemClickListener() {
				@Override
				public void onItemClick(AdapterView<?> parent, View view,
						int position, long id) {
					create_intent(product_info.get(+ position).getName(),product_info.get(position).getImgsrc(), 
							product_info.get(+ position).getAttributeById(Product.BrandId).getValues().get(0),
							 String.valueOf(product_info.get(+ position).getPrice()),product_info.get(position).getId());
				}
			});
			
			gridview.setOnScrollListener(new OnScrollListener(){

				private int currentFirstVisibleItem;
				private int currentVisibleItemCount;
				private int currentScrollState;

				@Override
				public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
				    this.currentFirstVisibleItem = firstVisibleItem;
				    this.currentVisibleItemCount = visibleItemCount;
				}
				@Override
				public void onScrollStateChanged(AbsListView view, int scrollState) {
				    this.currentScrollState = scrollState;
				    this.isScrollCompleted();
				 }

				private void isScrollCompleted() {
				    if (this.currentVisibleItemCount > 0 && this.currentScrollState == SCROLL_STATE_IDLE) {
				        /*** In this way I detect if there's been a scroll which has completed ***/
				        /*** do the work! ***/
				    	if(more){
				    		page++;
				    		more=(page*8)<total;
				    		get_products(rootView);
				    	}
				    }
				}
				
			});

		}

	}
	
	private void get_products(final View rootView){
		if(!is_Search){
			if(filter!=null){
			Api.get().getProductsBySubcategoryId(subcatid, page, filter, new ApiCallback<ApiResponse>() {

				@Override
				public void call(ApiResponse result, Exception exception) {
					List<String> list= new ArrayList<String>();
					if (exception != null) {
						//TO-DO:manejar excepciones
						list.add(exception.getMessage());
					} else {
						for(Product product:result.getProducts()){
							product_info.add(product);
						}
						total= result.getTotal();
						page= result.getPage();
						
						ProductAdapter adapter = new ProductAdapter(getActivity(),product_info, images,more); 
						
						load_products(rootView,adapter);
						//if (!serialized) {
							//addProductsToFragment(result.getProducts(), total, page);	 						
						//}
					}
				}

			});
			}
		}
		else{
			  Api.get().getProductsByName(query, new ApiCallback<ApiResponse>() {

				  @Override
				  public void call(ApiResponse result, Exception exception) {
					  List<String> list= new ArrayList<String>();
					  if (exception != null) {
						  //TO-DO:manejar excepciones
						  list.add(exception.getMessage());
					  } else {
						  for(Product product:result.getProducts()){
								product_info.add(product);
							}
							total= result.getTotal();
							page= result.getPage();
							ProductAdapter adapter = new ProductAdapter(getActivity(),product_info, images,more); 
							
							load_products(rootView,adapter);
					  }
				  }

			  });

		}
	}
	
	private void create_intent(String title, String[] images, String brand, String price,int id){
		Intent intent= new Intent(getActivity(),DetailActivity.class);
		intent.putExtra("TITLE", title);
		intent.putExtra("IMAGES_URL",images);
		intent.putExtra("BRAND", brand);
		intent.putExtra("PRICE", price);
		intent.putExtra("PROD_ID", id);
		startActivity(intent);
	}
}
