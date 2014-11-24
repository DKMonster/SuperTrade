package com.supertrade.dkmonster;

import java.util.HashMap;
import java.util.Map;

import com.fxcore2.*;

public class editOrder {
	
	static Map<String, Object> responseData = new HashMap<String, Object>();

	public static Map<String, Object> main(String[] args) {
		// Connection and session variables
		String mOrderID = "";
		String mAccountID = "";
		int mAmount = 0;
	    double mRate = 0.0d; 
        String mUserID = "";
        String mPassword = "";
        String mURL = "";
        String mConnection = "";
        String mDBName = "";
        String mPin = "";
        O2GSession mSession = null;
 
        // Check for correct number of arguments
        if (args.length < 8) {
            System.out.println("Not Enough Parameters!");
            System.out.println("USAGE: [user ID] [password] [URL] [connection] [session ID (if needed)] [pin (if needed)]");
            System.exit(1);
        }
 
       // Get command line arguments
        mOrderID = args[0];
        mAccountID = args[1];
        mAmount = Integer.parseInt(args[2]);
        mRate = Double.parseDouble(args[3]);
        mUserID = args[4];
        mPassword = args[5];
        mURL = args[6];
        mConnection = args[7];
        if (args.length > 8) {
            mDBName = args[8];
        }
        if (args.length > 9) {
            mPin = args[9];
        }
 
        // Create a session, subscribe to session listener, login, get open positions information, logout
        try {
 
            // Create a session
            mSession = O2GTransport.createSession();
 
            // Specify that your session uses a table manager
            mSession.useTableManager(O2GTableManagerMode.YES, null);
            SessionStatusListener statusListener = new SessionStatusListener(mSession, mDBName, mPin);
            mSession.subscribeSessionStatus(statusListener);
 
            // Login into the trading server
            mSession.login(mUserID, mPassword, mURL, mConnection);
            while (!statusListener.isConnected() && !statusListener.hasError()) {
                    Thread.sleep(50);
            }
            if (!statusListener.hasError()) {
 
                // Get an instance of table manager
                O2GTableManager tableManager = mSession.getTableManager();
 
                // Check the table manager status
                while (tableManager.getStatus() != O2GTableManagerStatus.TABLES_LOADED &&
                       tableManager.getStatus() != O2GTableManagerStatus.TABLES_LOAD_FAILED) {
                       Thread.sleep(50);
                }
                if (tableManager.getStatus() == O2GTableManagerStatus.TABLES_LOADED) {
                	
                	editOrder(mOrderID , mAccountID , mAmount , mRate , mSession);

                    mSession.logout();
                    while (!statusListener.isDisconnected()) {
                        Thread.sleep(50);
                    }
                }
            }
            mSession.unsubscribeSessionStatus(statusListener);
            mSession.dispose();
//            System.exit(1);
            responseData.put("msg", "success");
    		return responseData;
        } catch (Exception e) {
            System.out.println ("Exception: " + e.getMessage());
//            System.exit(1);
            responseData.put("msg", "fail");
            return responseData;
        }
	}
	
	public static void editOrder(String sOrderID, String sAccountID, int iAmount, double dRate , O2GSession mSession) {
	       O2GRequestFactory factory = mSession.getRequestFactory();
	       if (factory == null) {
	           return;
	       }
	       O2GValueMap valuemapChangeOrder = factory.createValueMap();
	       valuemapChangeOrder.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.EditOrder);
	       valuemapChangeOrder.setString(O2GRequestParamsEnum.ORDER_ID, sOrderID);
	       valuemapChangeOrder.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID);
	       valuemapChangeOrder.setDouble(O2GRequestParamsEnum.RATE, dRate);
	       valuemapChangeOrder.setInt(O2GRequestParamsEnum.AMOUNT, iAmount);
	       valuemapChangeOrder.setString(O2GRequestParamsEnum.CUSTOM_ID, "EditOrder");
	 
	       O2GRequest requestChangeOrder = factory.createOrderRequest(valuemapChangeOrder);
	       mSession.sendRequest(requestChangeOrder);
	}

}
