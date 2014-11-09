package com.supertrade.dkcode;

import com.fxcore2.O2GSession;
import com.fxcore2.O2GTableManager;
import com.fxcore2.O2GTableManagerMode;
import com.fxcore2.O2GTableManagerStatus;
import com.fxcore2.O2GTableType;
import com.fxcore2.O2GTableUpdateType;
import com.fxcore2.O2GTradeTableRow;
import com.fxcore2.O2GTradesTable;
import com.fxcore2.O2GTransport;


public class tableManager {

	public static void main(String[] args) {
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
                    O2GTradesTable tradeTable = (O2GTradesTable)tableManager.getTable(O2GTableType.TRADES);
 
                    // Get row level information
                    for (int i = 0; i < tradeTable.size(); i++) {
                        O2GTradeTableRow trade = tradeTable.getRow(i);
                        System.out.println( "TradeID: " + trade.getTradeID() +
                                           " Close = " +  trade.getClose()  +
                                           " GrossPL= " + trade.getGrossPL());
                    }
 
                    // Create an instance of a table listener class
                    TableListener tableListener = new TableListener();
 
                    // Subscribe table listener to table updates
                    tradeTable.subscribeUpdate(O2GTableUpdateType.UPDATE, tableListener);
                    tradeTable.subscribeUpdate(O2GTableUpdateType.INSERT, tableListener);
 
                    // Process updates (see TableListener.java)
                    Thread.sleep(10000);
 
                    // Unsubscribe table listener
                    tradeTable.unsubscribeUpdate(O2GTableUpdateType.UPDATE, tableListener);
                    tradeTable.unsubscribeUpdate(O2GTableUpdateType.INSERT, tableListener);
 
                    mSession.logout();
                    while (!statusListener.isDisconnected()) {
                        Thread.sleep(50);
                    }
                }
            }
            mSession.unsubscribeSessionStatus(statusListener);
            mSession.dispose();
            System.exit(1);
        } catch (Exception e) {
            System.out.println ("Exception: " + e.getMessage());
            System.exit(1);
        }
	}

}
