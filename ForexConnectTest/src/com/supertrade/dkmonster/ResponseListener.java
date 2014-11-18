package com.supertrade.dkmonster;

import java.util.concurrent.ConcurrentLinkedQueue;

import com.fxcore2.IO2GResponseListener;
import com.fxcore2.O2GResponse;

public class ResponseListener implements IO2GResponseListener{

    private SimpleLog mSimpleLog;
    private ConcurrentLinkedQueue<O2GResponse> mResponseQueue;
    private EventPipe mEventPipe;
    
    public ResponseListener(SimpleLog simpleLog, ConcurrentLinkedQueue<O2GResponse> responseQueue, EventPipe eventPipe) {
        mSimpleLog = simpleLog;
        mResponseQueue = responseQueue;
        mEventPipe = eventPipe;
    }

    @Override
    public void onRequestCompleted(String sRequestID, O2GResponse response) {
        mResponseQueue.add(response);
        mEventPipe.putEvent(EventType.RESPONSE);
    }

    @Override
    public void onRequestFailed(String sRequestID, String sError) {
        mSimpleLog.log("Request failed requestID=%s error=%s", sRequestID, sError);
    }

    @Override
    public void onTablesUpdates(O2GResponse response) {
        mSimpleLog.log("Data received");
        mResponseQueue.add(response);
        mEventPipe.putEvent(EventType.RESPONSE);
    }
}