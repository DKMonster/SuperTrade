package com.supertrade.dkmonster;

import com.fxcore2.IO2GTableListener;
import com.fxcore2.O2GRow;
import com.fxcore2.O2GSession;
import com.fxcore2.O2GOfferTableRow;
import com.fxcore2.O2GTableStatus;

public class OffersListener implements IO2GTableListener {
    
    private String mInstrument = null;
    
    public void SetInstrumentFilter(String instrument) {
        mInstrument = instrument;
    }
    
    public void onAdded(String string, O2GRow o2grow) {
        
    }

    public void onChanged(String string, O2GRow o2grow) {
        O2GOfferTableRow row = (O2GOfferTableRow)o2grow;
        if (mInstrument == null || mInstrument.isEmpty() || row.getInstrument().equals(mInstrument)) {
            System.out.println("Instrument = " + row.getInstrument() +
                               " Bid Price = " +  row.getBid() +
                               " Ask Price = " + row.getAsk());
        }
    }

    public void onDeleted(String string, O2GRow o2grow) {
        
    }

    public void onStatusChanged(O2GTableStatus ogts) {
        
    }    
    
}
