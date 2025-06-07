package com.example.qrcodescan;

import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.speech.tts.TextToSpeech;
import android.util.Log;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MyNotificationListener extends NotificationListenerService {

    private TextToSpeech textToSpeech;

    @Override
    public void onCreate() {
        super.onCreate();
        textToSpeech = new TextToSpeech(getApplicationContext(), status -> {
            if (status == TextToSpeech.SUCCESS) {
                textToSpeech.setLanguage(Locale.getDefault()); // hoặc Locale.US
            }
        });
        Log.d("MyNotificationListener", "Notification Listener Service started");
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();

        if (packageName.contains("com.vietinbank.ipay")) {
            CharSequence text = sbn.getNotification().extras.getCharSequence("android.text");

            if (text != null && text.toString().contains("CT DEN")) {
                String message = text.toString();
                Log.d("MyNotificationListener", "Matched Notification: " + message);

                // Trích xuất số tiền
                String amount = extractAmount(message);
                //TODO: Uncomment the next line to enable speech output
                // if (amount != null) {
                //     String speakText = "Bạn đã nhận được " + amount + " đồng";
                //     speakOut(speakText);
                // }
            }
        }
    }

    private String extractAmount(String message) {
        Pattern pattern = Pattern.compile("Giao dịch:\\s*\\+([\\d,]+)VND");
        Matcher matcher = pattern.matcher(message);
        if (matcher.find()) {
            return matcher.group(1).replace(",", "");
        }
        return null;
    }

    private void speakOut(String text) {
        new Handler(Looper.getMainLooper()).post(() -> {
            if (textToSpeech != null) {
                textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, null);
            }
        });
    }

    @Override
    public void onDestroy() {
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
        }
        super.onDestroy();
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
    }
}
