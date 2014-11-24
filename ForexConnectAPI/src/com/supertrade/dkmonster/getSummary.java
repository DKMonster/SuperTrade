package com.supertrade.dkmonster;

import java.util.HashMap;
import java.util.Map;

import com.fxcore2.*;

public class getSummary {

	static Map[] Data;

	public static Map[] main(String[] args) {
		// Connection and session variables
        String mUserID = "";
        String mPassword = "";
        String mURL = "";
        String mConnection = "";
        String mDBName = "";
        String mPin = "";
        O2GSession mSession = null;
 
        // Check for correct number of arguments
        if (args.length < 4) {
            System.out.println("Not Enough Parameters!");
            System.out.println("USAGE: [user ID] [password] [URL] [connection] [session ID (if needed)] [pin (if needed)]");
            System.exit(1);
        }
 
       // Get command line arguments
        mUserID = args[0];
        mPassword = args[1];
        mURL = args[2];
        mConnection = args[3];
        if (args.length > 4) {
            mDBName = args[4];
        }
        if (args.length > 5) {
            mPin = args[5];
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

                    // Get an instance of the O2GTradesTable
                    O2GSummaryTable summaryTable = (O2GSummaryTable)tableManager.getTable(O2GTableType.SUMMARY);
 
                    // Get row level information
                    Data = new Map[summaryTable.size()];
                    for (int i = 0; i < summaryTable.size(); i++) {
                        HashMap<String, Object> responseData = new HashMap<String, Object>();
                        O2GSummaryTableRow summary = summaryTable.getRow(i);
                        responseData.put("Instrument" , summary.getInstrument());
                        responseData.put("SellNetPL" , summary.getSellNetPL());
                        responseData.put("SellAmount" , summary.getSellAmount());
                        responseData.put("SellAvgOpen" , summary.getSellAvgOpen());
                        responseData.put("BuyClose" , summary.getBuyClose());
                        responseData.put("SellClose" , summary.getSellClose());
                        responseData.put("BuyAvgOpen" , summary.getBuyAvgOpen());
                        responseData.put("BuyAmount" , summary.getBuyAmount());
                        responseData.put("BuyNetPL" , summary.getBuyNetPL());
                        responseData.put("Amount" , summary.getAmount());
                        responseData.put("GrossPL" , summary.getGrossPL());
                        responseData.put("NetPL" , summary.getNetPL());
                        Data[i] = responseData;
//                        System.out.println(Data[i]);
                    }
 
//                    // Create an instance of a table listener class
//                    TableListener tableListener = new TableListener();
// 
//                    // Subscribe table listener to table updates
//                    tradeTable.subscribeUpdate(O2GTableUpdateType.UPDATE, tableListener);
//                    tradeTable.subscribeUpdate(O2GTableUpdateType.INSERT, tableListener);
// 
//                    // Process updates (see TableListener.java)
//                    Thread.sleep(10000);
// 
//                    // Unsubscribe table listener
//                    tradeTable.unsubscribeUpdate(O2GTableUpdateType.UPDATE, tableListener);
//                    tradeTable.unsubscribeUpdate(O2GTableUpdateType.INSERT, tableListener);

                    mSession.logout();
                    while (!statusListener.isDisconnected()) {
                        Thread.sleep(50);
                    }
                }
            }
            mSession.unsubscribeSessionStatus(statusListener);
            mSession.dispose();
//            System.exit(1);
    		return Data;
        } catch (Exception e) {
            System.out.println ("Exception: " + e.getMessage());
//            System.exit(1);
            return Data;
        }
	}

}
