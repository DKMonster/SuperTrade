package com.supertrade.dkmonster;

import com.fxcore2.*;

public class CPResponseListener implements IO2GResponseListener {

    private CPTableListener mTableListener;

    // Constructor
    public CPResponseListener(CPTableListener tableListener) {
        mTableListener = tableListener;
    }

    // Implementation of IO2GResponseListener interface public method onRequestCompleted
    public void onRequestCompleted(String requestID, O2GResponse response) {
    }

    // Implementation of IO2GResponseListener interface public method onRequestFailed
    public void onRequestFailed(String requestID, String error) {
        mTableListener.onRequestFailed(requestID, error);
    }

    // Implementation of IO2GResponseListener interface public method onTablesUpdates
    public void onTablesUpdates(O2GResponse response) {
    }
}
