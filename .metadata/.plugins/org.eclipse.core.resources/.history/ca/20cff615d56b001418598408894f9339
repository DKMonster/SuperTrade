package com.supertrade.dkcode;

import com.fxcore2.IO2GResponseListener;
import com.fxcore2.O2GResponse;
import com.fxcore2.O2GResponseReaderFactory;
import com.fxcore2.O2GResponseType;
import com.fxcore2.O2GOffersTableResponseReader;
import com.fxcore2.O2GSession;
import com.fxcore2.O2GOfferRow;

public class ResponseListener implements IO2GResponseListener {
   
    // Session, response and request variables
    private O2GSession mSession = null;
    private String mInstrument = "";
    private O2GResponse mResponse = null; 
    private String mRequest = "";

    // Constructor
    public ResponseListener(O2GSession session, String instrument) {
        mSession = session;
        mInstrument = instrument;   
    }
    
    // Implementation of IO2GResponseListener interface public method onRequestCompleted
    public void onRequestCompleted(String requestID, O2GResponse response) {
        if (response.getType() == O2GResponseType.GET_OFFERS) {
            mResponse = response;
            mRequest = "getoffers"; 
            printOffers(mSession, mResponse, mInstrument);    
        }
    }

    // Implementation of IO2GResponseListener interface public method onRequestFailed
    public void onRequestFailed(String requestID, String error) {
        System.out.println("Request failed. requestID= " + requestID + "; error= " + error);
    }

    // Implementation of IO2GResponseListener interface public method onTablesUpdates
    public void onTablesUpdates(O2GResponse response) {
        if (response.getType() == O2GResponseType.TABLES_UPDATES) {
            mResponse = response;
            mRequest = "tablesupdates";         
            printOffers(mSession, mResponse, mInstrument); 
        }
    }
    
    // Prints response to a user request and live offer updates
    public void printOffers(O2GSession session, O2GResponse response, String instrument) {
        O2GResponseReaderFactory readerFactory = session.getResponseReaderFactory();
        if (readerFactory != null) {
            O2GOffersTableResponseReader reader = readerFactory.createOffersTableReader(response);
            for (int i = 0; i < reader.size(); i++) {       
                O2GOfferRow row = reader.getRow(i);
                if (row.isBidValid() && row.isAskValid())
                {
                    if (row.getInstrument().equals(instrument)) {
                        if (mRequest == "getoffers") {
                            System.out.println("This is a response to getOffers request.");
                        }
                        if (mRequest == "tablesupdates") {
                            System.out.println("This is your live update.");
                        }           
                        System.out.println("Instrument = " + row.getInstrument() +
                                       " Bid Price = " +  row.getBid() +
                                       " Ask Price = " + row.getAsk()); 
                        mRequest = "";                 
                        break;                      
                    }
                }                          
            }
        }   
    }
}
