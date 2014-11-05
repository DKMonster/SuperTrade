package com.supertrade.dkcode;

import java.util.HashMap;
import java.util.Map;

import com.fxcore2.O2GLoginRules;
import com.fxcore2.O2GOfferRow;
import com.fxcore2.O2GOffersTableResponseReader;
import com.fxcore2.O2GRequestFactory;
import com.fxcore2.O2GResponse;
import com.fxcore2.O2GResponseReaderFactory;
import com.fxcore2.O2GSession;
import com.fxcore2.O2GTableType;
import com.fxcore2.O2GTransport;

public class getOffers {

	static Map<String, Object> responseData = new HashMap<String, Object>();
    static String mInstrument = "";

	public static Map<String, Object> main(String[] args) {
		// TODO Auto-generated method stub

        // Connection and session variables
        String mUserID = "";
        String mPassword = "";
        String mURL = "";
        String mConnection = "";
        String mDBName = "";
        String mPin = "";
        O2GSession mSession = null;
        
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
        
        // Create a session, subscribe to session listener, login, get offers, logout
        try {
            mSession = O2GTransport.createSession();
            SessionStatusListener statusListener = new SessionStatusListener(mSession, mDBName, mPin);
            mSession.subscribeSessionStatus(statusListener);
            ResponseListener responseListener = new ResponseListener(mSession,mInstrument);
            mSession.subscribeResponse(responseListener);
            mSession.login(mUserID, mPassword, mURL, mConnection);
            while (!statusListener.isConnected() && !statusListener.hasError()) {
                    Thread.sleep(50);
            }
            if (!statusListener.hasError()) {
                getOffers(mSession);
                if (!mInstrument.equals("{INSTRUMENT}") && !mInstrument.equals("")) {
                    O2GRequestFactory requestFactory = mSession.getRequestFactory();
                    if (requestFactory != null) {
                        mSession.sendRequest(requestFactory.createRefreshTableRequest(O2GTableType.OFFERS));
                        Thread.sleep(10000);
                    }
                }   
                mSession.logout();
                while (!statusListener.isDisconnected()) {
                    Thread.sleep(50);
                }
            }
            mSession.unsubscribeSessionStatus(statusListener);
            mSession.unsubscribeResponse(responseListener);
            mSession.dispose();
        } catch (Exception e) {
            System.out.println ("Exception: " + e.getMessage());
            System.exit(1);
        }
		return responseData;
    }
    
    // Get offers information
    public static void getOffers(O2GSession session) { 
        try {
            O2GLoginRules loginRules = session.getLoginRules();
            if (loginRules != null && loginRules.isTableLoadedByDefault(O2GTableType.OFFERS)) {
                O2GResponse offersResponse = loginRules.getTableRefreshResponse(O2GTableType.OFFERS);
                O2GResponseReaderFactory responseFactory = session.getResponseReaderFactory();
                O2GOffersTableResponseReader offersReader = responseFactory.createOffersTableReader(offersResponse);
                for (int i = 0; i < offersReader.size(); i++) {
                    O2GOfferRow offer = offersReader.getRow(i);
                    if(mInstrument.equals(offer.getInstrument())){
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
                        responseData.put("Time" , offer.getTime());
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Exception in getOffers().\n\t " + e.getMessage());
        }   
    }
}
