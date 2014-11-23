package com.supertrade.dkmonster;

import java.util.HashMap;
import java.util.Map;

import com.fxcore2.*;

public class getOrder {

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
        
	   // Create a session, subscribe to session listener, login, find order and print order info, logout
	   try {
	       mSession = O2GTransport.createSession();
	       mSession.useTableManager(O2GTableManagerMode.YES, null);
	       SessionStatusListener statusListener = new SessionStatusListener(mSession, mDBName, mPin);
	       mSession.subscribeSessionStatus(statusListener);
	       mSession.login(mUserID, mPassword, mURL, mConnection);
	       while (!statusListener.isConnected() && !statusListener.hasError()) {
	               Thread.sleep(50);
	       }
           
	       if (!statusListener.hasError()) {
	    	   O2GTableManager tableManager = mSession.getTableManager();
               while (tableManager.getStatus() == O2GTableManagerStatus.TABLES_LOADING)
                   Thread.sleep(50);
               if (tableManager.getStatus() == O2GTableManagerStatus.TABLES_LOADED)
               {
                   O2GOrdersTable ordersTable = (O2GOrdersTable)tableManager.getTable(O2GTableType.ORDERS);
                   O2GOffersTable offersTable = (O2GOffersTable)tableManager.getTable(O2GTableType.OFFERS);
                   TableListener tableListener = new TableListener();
                   ordersTable.subscribeStatus(tableListener);

                   // Get row level information
                   Data = new Map[ordersTable.size()];
                   for (int i = 0; i < ordersTable.size(); i++) {
                       HashMap<String, Object> responseData = new HashMap<String, Object>();
                       O2GOrderTableRow order = ordersTable.getRow(i);
                       responseData.put("OrderID" , order.getOrderID());
                       responseData.put("AccountID" , order.getAccountID());
                       responseData.put("Type" , order.getType());
                       responseData.put("Status" , order.getStatus());
                       responseData.put("TradeID" , order.getTradeID());
                       responseData.put("Amount" , order.getAmount());
                       responseData.put("BuySell" , order.getBuySell());
                       responseData.put("Rate" , order.getRate());
                       responseData.put("Stop" , order.getStop());
                       responseData.put("Limit" , order.getLimit());
                       responseData.put("StatusTime" , String.valueOf(order.getStatusTime().getTime()));
                       responseData.put("ExpireDate" , String.valueOf(order.getExpireDate().getTime()));
                       O2GTableIterator offersIterator = new O2GTableIterator();
                       O2GOfferTableRow offer = offersTable.getNextRowByColumnValue("OfferID", order.getOfferID(), offersIterator);
                       responseData.put("Instrument" , offer.getInstrument());
                       Data[i] = responseData;
                       System.out.println(Data[i]);
                   }
               	}
               
                mSession.logout();
                while (!statusListener.isDisconnected()) {
                    Thread.sleep(50);
                }
            }
            mSession.unsubscribeSessionStatus(statusListener);
            mSession.dispose();
    		return Data;
        } catch (Exception e) {
            System.out.println ("Exception: " + e.getMessage());
//            System.exit(1);
    		return Data;
        }
        
	}

}
