package com.fxcore2.samples;

import com.fxcore2.IO2GSessionStatus;
import com.fxcore2.O2GSession;
import com.fxcore2.O2GSessionDescriptorCollection;
import com.fxcore2.O2GSessionStatusCode;

public class SessionStatusListener implements IO2GSessionStatus {

    private SimpleLog mSimpleLog;

    private O2GSession mSession;

    private LoginInfo mLoginInfo;
    
    private EventPipe mEventPipe;

    public SessionStatusListener(SimpleLog simpleLog, O2GSession session,
            LoginInfo loginInfo, EventPipe eventPipe) {
        mSimpleLog = simpleLog;
        mSession = session;
        mLoginInfo = loginInfo;
        mEventPipe = eventPipe;
    }

    @Override
    public void onLoginFailed(String sError) {
        mSimpleLog.log(sError);
        mEventPipe.putEvent(EventType.TERMINATE);
    }

    @Override
    public void onSessionStatusChanged(O2GSessionStatusCode eStatusCode) {
        switch (eStatusCode) {
        case CONNECTING:
            mSimpleLog.log("Status: Connecting");
            break;

        case CONNECTED:
            // "How to login" : Use status listener onSessionStatusChanged
            // function to capture Connected event.
            mSimpleLog.log("Status: Connected");
            mEventPipe.putEvent(EventType.CONNECTED);
            break;

        case DISCONNECTING:
            mSimpleLog.log("Status: Disconnecting");
            break;

        case DISCONNECTED:
            // "How to login" : Use status listener onSessionStatusChanged
            // function to capture Disconnected event.
            mSimpleLog.log("Status: Disconnected");
            mEventPipe.putEvent(EventType.TERMINATE);
            break;

        case RECONNECTING:
            mSimpleLog.log("Status: Reconnecting");
            break;

        case SESSION_LOST:
            mSimpleLog.log("Status: Session Lost");
            break;

        // "How to login" : If you have more than one trading sessions or pin is
        // required to login,
        // you have to catch the event TradingSessionRequested in
        // onSessionStatusChanged function of your status listener.
        case TRADING_SESSION_REQUESTED:
            mSimpleLog.log("Status: TradingSessionRequested");
            String sTradingSessionID = mLoginInfo.getTradingSessionID();
            if (sTradingSessionID == null || sTradingSessionID.trim().length() == 0) {
                // "How to login" : In that case get
                // IO2GSessionDescriptorCollection.
                O2GSessionDescriptorCollection descriptors = mSession.getTradingSessionDescriptors();

                // "How to login" : Then process elements of this collection
                if (descriptors.size() > 0)
                    sTradingSessionID = descriptors.get(0).getId();
            }

            // "How to login" : Finally set trading session using session Id and
            // pin
            mSession.setTradingSession(sTradingSessionID, mLoginInfo.getTradingSessionPIN());
            break;
        }
        
        mEventPipe.putEvent(EventType.STATUS);
    }
}