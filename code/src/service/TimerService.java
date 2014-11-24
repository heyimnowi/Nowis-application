package service;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import model.Order;
import model.Orders;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.os.Handler;
import android.os.IBinder;
import android.preference.PreferenceManager;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import api.Api;
import api.ApiCallback;

import com.example.NOWIS.MainActivity;
import com.example.NOWIS.OrderDetailActivity;
import com.example.NOWIS.R;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class TimerService extends Service {
	
	public static final long MILLI_TO_MINS = 1000 * 60;
	private final String DEFAULT_ORDERS = "[]";
	
	private Handler handler = new Handler();
	private Timer timer = null;
	private long interval = 0;

	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}
	
	public void onCreate() {		
		if (timer != null) {
			timer.cancel();
			timer.purge();
		}
			
		timer = new Timer();
		
		SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
		interval = Long.valueOf(sp.getString("update_frequency", "0"));
		
		if (interval != 0)
			timer.scheduleAtFixedRate(new TimeDisplayTimerTask(), 0, interval * MILLI_TO_MINS);
	}

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
    	// Handling change of frequency in notifications
    	if (intent == null)
    		return START_STICKY;
    	
    	String action = intent.getAction();
    	if (action != null && action.equals("com.example.NOWIS.change_update_frequency")) {
	    	long newInterval = intent.getLongExtra("com.example.NOWIS.update_frequency", 0L);
    		
    		// Kill the timer
    		if (newInterval == 0) {
    			if (timer != null) {
    				timer.cancel();
    				timer.purge();
    			}
    			
    			return START_STICKY;
    		}
    		
	    	if (newInterval != interval) {
	    		interval = newInterval;
	    		if (timer != null) {
	    			timer.cancel();
	    			timer.purge();
	    		}
	    			
	    		timer = new Timer();	    		
	    		timer.scheduleAtFixedRate(new TimeDisplayTimerTask(), 0, interval * MILLI_TO_MINS);
	    	}
    	}
    	
        return START_STICKY;
    }
	
	class TimeDisplayTimerTask extends TimerTask {
		
		@Override
		public void run() {
			// run on another thread
			handler.post(new Runnable() {

				@Override
				public void run() {
					SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
					String auth_token = sp.getString("authenticationtoken", null);
					String username = sp.getString("username", null);
					
					if (auth_token == null || username == null)
						return;
					
					final NotificationManager nManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
					Api.get().getAllOrders(username, auth_token, new ApiCallback<Orders>() {
						
						public void call(Orders result, Exception exception) {
							Log.i("SETTINGS", "requested");
							if (exception != null) {
								Log.e("SETTINGS", "ERROR");
							} else {
								SharedPreferences sp = PreferenceManager
										.getDefaultSharedPreferences(getApplicationContext());
								String storedOrders = sp.getString("orders", DEFAULT_ORDERS);
								Type type = new TypeToken<List<Order>>(){}.getType();
								List<Order> oldOrders = new Gson().fromJson(storedOrders, type);
								List<Order> newOrders = result.getOrders();
								
								NotificationCompat.Builder notification;
								for (Order o : newOrders) {
									for (Order o2 : oldOrders) {
										if (o.getId().equals(o2.getId())
												&& !o.getStatus().equals(o2.getStatus())) {
											Intent intent = new Intent(getApplicationContext(), OrderDetailActivity.class);
											intent.putExtra("id", o.getId());
											PendingIntent pIntent = PendingIntent.getActivity(
													getApplicationContext(), 0, intent, 0);
											
											String notificationText = getResources().getString(R.string.notification_text);
											String[] orderStates = getResources().getStringArray(R.array.order_states);
											String t = String.format(notificationText,
													o.getId(),
													orderStates[Integer.valueOf(o.getStatus()) - 1]
											);
											
											notification = new NotificationCompat.Builder(getApplicationContext())
												.setSmallIcon(R.drawable.ic_launcher)
												.setContentTitle(getResources().getString(R.string.app_name))
												.setContentText(t).setContentIntent(pIntent);
											nManager.notify(o.getId(), notification.build());
										}
										if (o.getId().equals(o2.getId())
												&& (!o.getLatitude().equals(o2.getLatitude())
														|| !o.getLongitude().equals(o2.getLongitude()))) {
											Intent intent = new Intent(getApplicationContext(), OrderDetailActivity.class);
											intent.putExtra("id", o.getId());
											PendingIntent pIntent = PendingIntent.getActivity(
													getApplicationContext(), 0, intent, 0);
											
											String notificationText = getResources().getString(R.string.notification_position_text);
											String t = String.format(notificationText,
													o.getId()
											);
											
											notification = new NotificationCompat.Builder(getApplicationContext())
												.setSmallIcon(R.drawable.ic_launcher)
												.setContentTitle(getResources().getString(R.string.app_name))
												.setContentText(t).setContentIntent(pIntent);
											nManager.notify(o.getId(), notification.build());
										}
									}
								}
								Editor editor = sp.edit();
								editor.putString("orders", new Gson().toJson(newOrders));
								editor.commit();
							}
						}
						
					});
					
				}

			});
		}
		
	}
}
