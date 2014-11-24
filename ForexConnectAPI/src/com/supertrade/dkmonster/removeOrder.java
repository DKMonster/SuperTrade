package com.supertrade.dkmonster;

import java.util.HashMap;
import java.util.Map;

import com.fxcore2.*;

public class removeOrder {
	
	static Map<String, Object> responseData = new HashMap<String, Object>();

	public static Map<String, Object> main(String[] args) {
		// Connection and session variables
		String mOrderID = "";
		String mAccountID = "";
        String mUserID = "";
        String mPassword = "";
        String mURL = "";
        String mConnection = "";
        String mDBName = "";
        String mPin = "";
        O2GSession mSession = null;
 
        // Check for correct number of arguments
        if (args.length < 6) {
            System.out.println("Not Enough Parameters!");
            System.out.println("USAGE: [user ID] [password] [URL] [connection] [session ID (if needed)] [pin (if needed)]");
            System.exit(1);
        }
 
       // Get command line arguments
        mOrderID = args[0];
        mAccountID = args[1];
        mUserID = args[2];
        mPassword = args[3];
        mURL = args[4];
        mConnection = args[5];
        if (args.length > 6) {
            mDBName = args[6];
        }
        if (args.length > 7) {
            mPin = args[7];
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
                	
                	deleteOrder(mOrderID , mAccountID , mSession);

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
	
    private static void deleteOrder(String sOrderID, String sAccountID , O2GSession mSession)
    {
       O2GRequestFactory factory = mSession.getRequestFactory();
       if (factory == null) {
           return;
       }
       O2GValueMap valuemap = factory.createValueMap();
       valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.DeleteOrder);
       valuemap.setString(O2GRequestParamsEnum.ORDER_ID, sOrderID);
       valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID);
       O2GRequest request = factory.createOrderRequest(valuemap);
       mSession.sendRequest(request);
    }

}
