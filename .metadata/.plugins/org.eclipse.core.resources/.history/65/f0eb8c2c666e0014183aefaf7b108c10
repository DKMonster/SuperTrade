package com.fxcore2.samples;

import java.text.MessageFormat;

public class LoginInfo {

    private String mUsername;
    private String mPassword;
    private String mConnection;
    private String mConnectionName;
    private String mTradingSessionID;
    private String mTradingSessionPIN;

    public LoginInfo(String sUsername, String sPassword, String sConnection,
            String sConnectionName, String sTradingSessionID,
            String sTradingSessionPIN) {
        mUsername = sUsername;
        mPassword = sPassword;
        mConnection = sConnection;
        mConnectionName = sConnectionName;
        mTradingSessionID = sTradingSessionID;
        mTradingSessionPIN = sTradingSessionPIN;
    }

    public LoginInfo(String sUsername, String sPassword, String sConnection,
            String sConnectionName) {
        this(sUsername, sPassword, sConnection, sConnectionName, "", "");
    }

    public String getUsername() {
        return mUsername;
    }

    public String getPassword() {
        return mPassword;
    }
    
    public String getConnection() {
        return mConnection;
    }
    
    public String getConnectionName() {
        return mConnectionName;
    }
    
    public String getTradingSessionID() {
        return mTradingSessionID;
    }
    
    public String getTradingSessionPIN() {
        return mTradingSessionPIN;
    }

    public String toString() {
        return MessageFormat.format("{0} *** {1} {2} {3} {4}", mUsername, mConnection, mConnectionName,
                mTradingSessionID, mTradingSessionPIN);
    }
}