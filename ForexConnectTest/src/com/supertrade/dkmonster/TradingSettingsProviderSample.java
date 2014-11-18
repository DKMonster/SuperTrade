package com.supertrade.dkmonster;

import com.fxcore2.O2GAccountRow;
import com.fxcore2.O2GAccountsTableResponseReader;
import com.fxcore2.O2GLoginRules;
import com.fxcore2.O2GMargin;
import com.fxcore2.O2GMarketStatus;
import com.fxcore2.O2GOfferRow;
import com.fxcore2.O2GOffersTableResponseReader;
import com.fxcore2.O2GResponse;
import com.fxcore2.O2GResponseReaderFactory;
import com.fxcore2.O2GSession;
import com.fxcore2.O2GTableType;
import com.fxcore2.O2GTradingSettingsProvider;

public class TradingSettingsProviderSample {
    private O2GSession mSession;

    private SimpleLog mSimpleLog;

    public TradingSettingsProviderSample(SimpleLog simpleLog, O2GSession session)
    {
        mSimpleLog = simpleLog;
        mSession = session;
    }

    public void print()
    {
        O2GLoginRules loginRules = mSession.getLoginRules();
        O2GResponse accountsResponse = loginRules.getTableRefreshResponse(O2GTableType.ACCOUNTS);
        if (accountsResponse == null)
            return;

        O2GResponse offersResponse = loginRules.getTableRefreshResponse(O2GTableType.OFFERS);
        if (offersResponse == null)
            return;

        O2GTradingSettingsProvider tradingSettingsProvider = loginRules.getTradingSettingsProvider();
        O2GResponseReaderFactory factory = mSession.getResponseReaderFactory();
        if (factory == null)
            return;
        
        O2GAccountsTableResponseReader accountsReader = factory.createAccountsTableReader(accountsResponse);
        if (accountsReader == null)
            return;

        O2GOffersTableResponseReader instrumentsReader = factory.createOffersTableReader(offersResponse);
        if (instrumentsReader == null)
            return;

        O2GAccountRow sAccount = accountsReader.getRow(0);
        if (sAccount == null)
            return;

        for (int i = 0; i < instrumentsReader.size(); i++)
        {
            O2GOfferRow instrumentRow = instrumentsReader.getRow(i);
            String sInstrument = instrumentRow.getInstrument();
            int iCondDistStopForTrade = tradingSettingsProvider.getCondDistStopForTrade(sInstrument);
            int iCondDistLimitForTrade = tradingSettingsProvider.getCondDistLimitForTrade(sInstrument);
            int iCondDistEntryStop = tradingSettingsProvider.getCondDistEntryStop(sInstrument);
            int iCondDistEntryLimit = tradingSettingsProvider.getCondDistEntryLimit(sInstrument);
            int iMinQuantity = tradingSettingsProvider.getMinQuantity(sInstrument, sAccount);
            int iMaxQuantity = tradingSettingsProvider.getMaxQuantity(sInstrument, sAccount);
            int iBaseUnitSize = tradingSettingsProvider.getBaseUnitSize(sInstrument, sAccount);
            O2GMarketStatus eMarketStatus = tradingSettingsProvider.getMarketStatus(sInstrument);
            int iMinTrailingStep = tradingSettingsProvider.getMinTrailingStep();
            int iMaxTrailingStep = tradingSettingsProvider.getMaxTrailingStep();
            double dMMR = tradingSettingsProvider.getMMR(sInstrument, sAccount);

            O2GMargin margin = tradingSettingsProvider.getMargins(sInstrument, sAccount);
            double dMMR2 = margin.getMMR();
            double dEMR = margin.getEMR();
            double dLMR = margin.getLMR();
            boolean b3LevelMarginUsed = margin.is3LevelMargin(); 

            mSimpleLog.log("  [{0} ({1})] Cond.Dist: ST={2}; LT={3}", sInstrument, eMarketStatus,
                iCondDistStopForTrade, iCondDistLimitForTrade);
            mSimpleLog.log("            Cond.Dist entry stop={0}; entry limit={1}", iCondDistEntryStop, iCondDistEntryLimit);
            mSimpleLog.log("            Quantity: Min={0}; Max={1}. Base unit size={2}; MMR={3}", iMinQuantity,
                iMaxQuantity, iBaseUnitSize, dMMR);
            if (b3LevelMarginUsed)
                mSimpleLog.log("            Three level margin: MMR={0}; EMR={1}; LMR={2}", dMMR2, dEMR, dLMR);
            else
                mSimpleLog.log("            Single level margin: MMR={0}; EMR={1}; LMR={2}", dMMR2, dEMR, dLMR);
            mSimpleLog.log("            Margins: Min={0}; Max={1}. Base unit size={2}; MMR={3}", iMinQuantity,
                iMaxQuantity, iBaseUnitSize, dMMR);
            mSimpleLog.log("            Trailing step: {0}-{1}", iMinTrailingStep, iMaxTrailingStep);
        }
    }
}
