package com.supertrade.dkmonster;

import java.util.HashMap;
import java.util.Map;

import com.fxcore2.*;

public class getOffer {

	static Map[] Data;

	public static Map[] main(String[] args) {
		// TODO Auto-generated method stub
	    
        // Connection and session variables
        String mUserID = "";
        String mPassword = "";
        String mURL = "";
        String mConnection = "";
        String mDBName = "";
        String mPin = "";
        O2GSession mSession = null;
        String mInstrument = "";
        
        // Check for correct number of arguments
        if (args.length < 5) {
            System.out.println("Not Enough Parameters!");
            System.out.println("USAGE: [instrument] [user ID] [password] [URL] [connection] [session ID (if needed)] [pin (if needed)]");
            System.exit(1);
        }
        
        // Get command line arguments
        mInstrument = args[0];
        mUserID = args[1];
        mPassword = args[2];
        mURL = args[3];
        mConnection = args[4];
        if (args.length > 5) {
            mDBName = args[5];
        }
        if (args.length > 6) {
            mPin = args[6];
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
                    O2GOffersTable offersTable = (O2GOffersTable)tableManager.getTable(O2GTableType.OFFERS);
                    TableListener tableListener = new TableListener();
                    offersTable.subscribeStatus(tableListener);
                    
                    // Get row level information
                    Data = new Map[offersTable.size()];
                    for (int i = 0; i < offersTable.size(); i++) {
                        HashMap<String, Object> responseData = new HashMap<String, Object>();
                        O2GOfferTableRow offer = offersTable.getRow(i);
                        responseData.put("OfferID" , offer.getOfferID());
                        responseData.put("Instrument" , offer.getInstrument());
                        responseData.put("QuoteID" , offer.getQuoteID());
                        responseData.put("Bid" , offer.getBid());
                        responseData.put("Ask" , offer.getAsk());
                        responseData.put("BidTradable" , offer.getBidTradable());
                        responseData.put("AskTradable" , offer.getAskTradable());
                        responseData.put("High" , offer.getHigh());
                        responseData.put("Low" , offer.getLow());
                        responseData.put("BuyInterest" , offer.getBuyInterest());
                        responseData.put("SellInterest" , offer.getSellInterest());
                        responseData.put("Volume" , offer.getVolume());
                        responseData.put("ContractCurrency" , offer.getContractCurrency());
                        responseData.put("Digits" , offer.getDigits());
                        responseData.put("PointSize" , offer.getPointSize());
                        responseData.put("SubscriptionStatus" , offer.getSubscriptionStatus());
                        responseData.put("TradingStatus" , offer.getTradingStatus());
                        responseData.put("InstrumentType" , offer.getInstrumentType());
                        responseData.put("ContractMultiplier" , offer.getContractMultiplier());
                        responseData.put("ValueDate" , offer.getValueDate());
                        responseData.put("Time" , String.valueOf(offer.getTime().getTime()));
                        responseData.put("PipCost", offer.getPipCost());
//                        String symbol = offer.getInstrument();
                        
                        Data[i] = responseData;
//                        System.out.println(Data[i]);
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
//             System.exit(1);
     		return Data;
         }

	}

}
