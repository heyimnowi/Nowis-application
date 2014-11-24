package com.example.NOWIS;

import service.TimerService;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.ListPreference;
import android.preference.Preference;
import android.preference.PreferenceActivity;
import android.preference.PreferenceGroup;
import android.preference.PreferenceManager;
import android.support.v4.app.NavUtils;
import android.view.Menu;
import android.view.MenuItem;

public class SettingsActivity extends PreferenceActivity {

	@SuppressWarnings("deprecation")
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		getActionBar().setDisplayHomeAsUpEnabled(true);
		addPreferencesFromResource(R.xml.fragment_settings);
		PreferenceManager.setDefaultValues(getApplicationContext(), R.xml.fragment_settings, false);
		
		SharedPreferences info = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

		bindPreference(findPreference("update_frequency"));
	}
	
	protected void onResume() {
		super.onResume();
		invalidateOptionsMenu();
		SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
		PreferenceGroup preferenceGroup = (PreferenceGroup) findPreference("account_category");
		String auth_token = sp.getString("authenticationtoken", null);
		
		if (auth_token == null) {
			findPreference("update_frequency").setEnabled(false);
			preferenceGroup.removePreference(findPreference("signout"));
		} else {
			preferenceGroup.addPreference(findPreference("signout"));
			
			findPreference("signout").setOnPreferenceClickListener(new Preference.OnPreferenceClickListener() {
				
				@Override
				public boolean onPreferenceClick(Preference preference) {
					Context ctx = preference.getContext();
					SharedPreferences.Editor editor = PreferenceManager.getDefaultSharedPreferences(ctx).edit();
					editor
						.remove("username")
						.remove("password")
						.remove("authenticationtoken")
						.commit();
					finish();
					
					return true;
				}
			});
		}
	}
	
	private static Preference.OnPreferenceChangeListener preferenceBinder = new Preference.OnPreferenceChangeListener() {
		
		@Override
		public boolean onPreferenceChange(Preference preference, Object newValue) {
			String value = newValue.toString();
			if (preference instanceof ListPreference) {
				int index = ((ListPreference) preference).findIndexOfValue(value);
				preference
					.setSummary(index >= 0 ? ((ListPreference) preference).getEntries()[index] 
									: null);
				if (preference.getKey().equals("update_frequency") && !value.isEmpty()) {
					Intent i = new Intent(preference.getContext(), TimerService.class);
					i.setAction("com.example.NOWIS.change_update_frequency");
					i.putExtra("com.example.NOWIS.update_frequency", Long.valueOf(value));
					preference.getContext().startService(i);
				}
			} else {
				if (preference.getKey().equals("password")) {
					value = value.replaceAll(".", "*");
				}
				
				preference.setSummary(value);
			}
			
			return true;
		}
	};
	
	private static void bindPreference(Preference preference) {
		preference.setOnPreferenceChangeListener(preferenceBinder);
		preferenceBinder.onPreferenceChange(preference, 
				PreferenceManager.getDefaultSharedPreferences(
							preference.getContext()).getString(preference.getKey(), ""));
	}	

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		int id = item.getItemId();
		switch(id){
			case android.R.id.home:
				NavUtils.navigateUpFromSameTask(this);
	        return true;
		}
		return super.onOptionsItemSelected(item);
	}

}
