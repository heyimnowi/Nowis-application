package com.example.NOWIS;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import api.Api;
import api.ApiCallback;
import api.ApiException;
import model.Account;
import model.SignInResult;


public class LoginActivity extends Activity {

	public static final String EXTRA_EMAIL = "com.example.android.authenticatordemo.extra.EMAIL";


	private UserLoginTask mAuthTask = null;
	private String user;
	private String pass;
	private EditText username;
	private EditText password;
	private View loginF;
	private View loginS;
	private TextView loginM;
	private static final int MIN_USERNAME_LENGTH = 6;
	private static final int MAX_USERNAME_LENGTH = 15;
	private static final int MIN_PASSWORD_LENGTH = 8;
	private static final int MAX_PASSWORD_LENGTH = 15;
	private Account account;
	private ApiException error;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_login);
		getActionBar().setTitle(R.string.action_login);

		user = getIntent().getStringExtra(EXTRA_EMAIL);
		username = (EditText) findViewById(R.id.username);
		username.setText(user);

		password = (EditText) findViewById(R.id.password);
		password.setOnEditorActionListener(new TextView.OnEditorActionListener(){
				@Override
				public boolean
				onEditorAction(TextView textView, int id, KeyEvent keyEvent){
					if (id == R.id.login || id == EditorInfo.IME_NULL){
						attemptLogin();
						return true;
					}
					return false;
				}
			});

		loginF = findViewById(R.id.login_form);
		loginS = findViewById(R.id.login_status);
		loginM = (TextView) findViewById(R.id.login_status_message);

		findViewById(R.id.sign_in_button).setOnClickListener(
				new View.OnClickListener() {
					@Override
					public void onClick(View view) {
						//attemptLogin();
						if(!userIsOnline()){
							Toast.makeText(LoginActivity.this,R.string.connection_lost, Toast.LENGTH_LONG).show();
						}else{
							attemptLogin();
						}
					}
				});
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		super.onCreateOptionsMenu(menu);
		getMenuInflater().inflate(R.menu.login, menu);
		return true;
	}


	public void attemptLogin() {
		if (mAuthTask != null) {
			return; } 
		username.setError(null);
		password.setError(null);

		user = username.getText().toString();
		pass = password.getText().toString();

		boolean cancel = false;
		View focusView = null;

		if (TextUtils.isEmpty(pass)) {
			password.setError(getString(R.string.field_required));
			focusView = password;
			cancel = true;
		} else if (pass.length() > MAX_PASSWORD_LENGTH || pass.length() < MIN_PASSWORD_LENGTH) {
			password.setError(getString(R.string.invalid_password));
			focusView = password;
			cancel = true;
		}

		if (TextUtils.isEmpty(user)) {
			username.setError(getString(R.string.field_required));
			focusView = username;
			cancel = true;
		} else if (user.length() > MAX_USERNAME_LENGTH || user.length() < MIN_USERNAME_LENGTH) {
			username.setError(getString(R.string.invalid_username));
			focusView = username;
			cancel = true;
		}

		if (cancel) {

			focusView.requestFocus();
		} else {
			loginM.setText(R.string.login_progress_signing_in);
			showProgress(true);
			mAuthTask = new UserLoginTask();
			mAuthTask.execute((Void) null);
		}
	}
	
	public Account getaccount() {
		return account;
	}

	public void setaccount(Account account) {
		this.account = account;
	}
	

	@TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
	private void showProgress(final boolean show) {
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
			int shortAnimTime = getResources().getInteger(
					android.R.integer.config_shortAnimTime);

			loginS.setVisibility(View.VISIBLE);
			loginS.animate().setDuration(shortAnimTime)
					.alpha(show ? 1 : 0)
					.setListener(new AnimatorListenerAdapter() {
						@Override
						public void onAnimationEnd(Animator animation) {
							loginS.setVisibility(show ? View.VISIBLE
									: View.GONE);
						}
					});

			loginF.setVisibility(View.VISIBLE);
			loginF.animate().setDuration(shortAnimTime)
					.alpha(show ? 0 : 1)
					.setListener(new AnimatorListenerAdapter() {
						@Override
						public void onAnimationEnd(Animator animation) {
							loginF.setVisibility(show ? View.GONE
									: View.VISIBLE);
						}
					});
		} else {
			loginS.setVisibility(show ? View.VISIBLE : View.GONE);
			loginF.setVisibility(show ? View.GONE : View.VISIBLE);
		}
	}


	public  boolean userIsOnline() {
	    NetworkInfo n = ((ConnectivityManager)getSystemService(Context.CONNECTIVITY_SERVICE)).getActiveNetworkInfo();
	    if (n != null && n.isConnectedOrConnecting()) return true;
	    return false;
	}


	
	public class UserLoginTask extends AsyncTask<Void, Void, Boolean> {
		protected Boolean doInBackground(Void... params) {
		final SharedPreferences.Editor ed = PreferenceManager.getDefaultSharedPreferences(getApplicationContext()).edit();
				Api.get().signIn(user, pass, new ApiCallback<SignInResult>(){
					@Override
					public void call(SignInResult result,
					Exception exception) {
						mAuthTask = null;
						showProgress(false);
						if(result != null){
							setaccount(result.getAccount());
							ed.putString("authenticationtoken", result.getToken())
							.putString("username", result.getAccount().getUsername())
							.putString("password", pass).commit();
							finish();
						}else if(exception != null && exception.getClass() == ApiException.class){
							error = (ApiException) exception;
							if(error.getErrorCode() == 101){ 
								username.setError(getString(R.string.invalid_username));
								username.requestFocus();
							}else if(error.getErrorCode() == 104){ 
								password.setError(getString(R.string.invalid_password));
								password.requestFocus();
							}
						}
					}
				});
			return true;
		}

		@Override
		protected void onCancelled() {
			mAuthTask = null;
			showProgress(false);
		}
	}
}
