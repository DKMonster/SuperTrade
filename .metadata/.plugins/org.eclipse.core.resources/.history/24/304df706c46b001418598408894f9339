package com.supertrade.dkcode;

import com.fxcore2.IO2GTableListener;
import com.fxcore2.O2GRow;
import com.fxcore2.O2GTableStatus;
import com.fxcore2.O2GTradeTableRow;

public class TableListener implements IO2GTableListener {
	 
    // Implementation of IO2GTableListener interface public method onAdded
     public void onAdded(String rowID, O2GRow rowData) {
       O2GTradeTableRow trade = (O2GTradeTableRow)(rowData);
       System.out.println("Trade information added " + rowID);
       System.out.println("TradeID: " + trade.getTradeID() +
                          " Close = " + trade.getClose());
    }
 
    // Implementation of IO2GTableListener interface public method onChanged
    public void onChanged(String rowID, O2GRow rowData) {
       O2GTradeTableRow trade = (O2GTradeTableRow)(rowData);
       System.out.println("Trade information changed " + rowID);
       System.out.println("TradeID: " + trade.getTradeID() +
                          " Close = " + trade.getClose());
    }
 
    // Implementation of IO2GTableListener interface public method onDeleted
    public void onDeleted(String rowID, O2GRow rowData) {
       O2GTradeTableRow trade = (O2GTradeTableRow)(rowData);
       System.out.println("Trade information deleted " + rowID);
       System.out.println("TradeID: " + trade.getTradeID() +
                          " Close = " + trade.getClose());
    }
 
    // Implementation of IO2GTableListener interface public method onStatus
    public void onStatusChanged(O2GTableStatus status) {
    }
}
