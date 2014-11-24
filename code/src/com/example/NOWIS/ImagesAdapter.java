package com.example.NOWIS;

import java.util.List;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;

import com.koushikdutta.ion.Ion;

public class ImagesAdapter extends ArrayAdapter<String>{
		private final Activity context;
		private final List<String> product_images;
		
		public ImagesAdapter(Activity context,List<String> product_images) {
			super(context, R.layout.product_photos, product_images);
			this.context = context;
			this.product_images = product_images;
		}
		@Override
		public View getView(int position, View view, ViewGroup parent) {
			LayoutInflater inflater = context.getLayoutInflater();
			View rowView= inflater.inflate(R.layout.product_photos, null, true);
			
			ImageView imageView = (ImageView) rowView.findViewById(R.id.prod_img);
			
			Ion.with(context)
			.load(product_images.get(position))
			.withBitmap()
			//.placeholder(R.drawable.placeholder_image)  //placeholder_image
			.error(R.drawable.no_disponible) //error_image
			//.animateLoad(spinAnimation)
			//.animateIn(fadeInAnimation)
			.intoImageView(imageView);
			
			imageView.setRotation(90);
			
			return rowView;
		}
	
}
