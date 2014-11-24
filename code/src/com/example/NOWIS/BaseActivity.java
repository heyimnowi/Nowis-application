package com.example.NOWIS;

import android.app.Activity;
import android.app.ActionBar;
import android.app.Fragment;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.app.NavUtils;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.os.Build;
import android.preference.PreferenceManager;

public abstract class BaseActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_base);

		if (savedInstanceState == null) {
			getFragmentManager().beginTransaction()
					.add(R.id.container, new PlaceholderFragment()).commit();
		}
	}

    public void restoreActionBar(String s) {
        ActionBar actionBar = getActionBar();
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
        actionBar.setDisplayShowTitleEnabled(true);
        actionBar.setTitle(s);
    }

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.base, menu);

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

	/**
	 * A placeholder fragment containing a simple view.
	 */
	public static class PlaceholderFragment extends Fragment {

		public PlaceholderFragment() {
		}

		@Override
		public View onCreateView(LayoutInflater inflater, ViewGroup container,
				Bundle savedInstanceState) {
			View rootView = inflater.inflate(R.layout.fragment_base, container,
					false);
			return rootView;
		}
	}

}
