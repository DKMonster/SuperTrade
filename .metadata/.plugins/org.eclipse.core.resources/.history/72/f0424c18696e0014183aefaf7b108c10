package com.supertrade.dkmonster;

import java.util.Calendar;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentLinkedQueue;

import com.fxcore2.O2GAccountRow;
import com.fxcore2.O2GAccountsTableResponseReader;
import com.fxcore2.O2GClosedTradeRow;
import com.fxcore2.O2GClosedTradesTableResponseReader;
import com.fxcore2.O2GGenericTableResponseReader;
import com.fxcore2.O2GLoginRules;
import com.fxcore2.O2GMarketDataSnapshotResponseReader;
import com.fxcore2.O2GMessageRow;
import com.fxcore2.O2GOfferRow;
import com.fxcore2.O2GOffersTableResponseReader;
import com.fxcore2.O2GOrderRow;
import com.fxcore2.O2GOrdersTableResponseReader;
import com.fxcore2.O2GRequest;
import com.fxcore2.O2GRequestFactory;
import com.fxcore2.O2GResponse;
import com.fxcore2.O2GResponseReaderFactory;
import com.fxcore2.O2GResponseType;
import com.fxcore2.O2GSession;
import com.fxcore2.O2GSystemPropertiesReader;
import com.fxcore2.O2GTableType;
import com.fxcore2.O2GTableColumn;
import com.fxcore2.O2GTableColumnCollection;
import com.fxcore2.O2GTableUpdateType;
import com.fxcore2.O2GTablesUpdatesReader;
import com.fxcore2.O2GTimeConverter;
import com.fxcore2.O2GTimeConverterTimeZone;
import com.fxcore2.O2GTimeframe;
import com.fxcore2.O2GTimeframeCollection;
import com.fxcore2.O2GTradeRow;
import com.fxcore2.O2GTradesTableResponseReader;

public class EventListener {
    private SimpleLog mSimpleLog;
    private ConcurrentLinkedQueue<O2GResponse> mResponseQueue;
    private O2GSession mSession;
    private EventPipe mEventPipe;
    private CreateOrderSample mOrderSample;
    private PermissionCheckerSample mPermissionSample;
    private TradingSettingsProviderSample mTradingSettings;

    public EventListener(SimpleLog simpleLog, ConcurrentLinkedQueue<O2GResponse> responseQueue, O2GSession session, EventPipe eventPipe) {
        mSimpleLog = simpleLog;
        mResponseQueue = responseQueue;
        mSession = session;
        mEventPipe = eventPipe;
        mOrderSample = new CreateOrderSample(mSimpleLog, mSession);
        mPermissionSample = new PermissionCheckerSample(mSimpleLog, mSession);
        mTradingSettings = new TradingSettingsProviderSample(mSimpleLog, mSession);
    }

    public void waitNextEvent() {
        boolean bContinue = true;
        while (bContinue) {
            EventType eEventType = mEventPipe.waitEvent();
            if (eEventType == EventType.STATUS) {
                this.onStatusChanged();
            } else if (eEventType == EventType.CONNECTED) {
                this.onConnected();
            } else if (eEventType == EventType.RESPONSE) {
                this.onResponse();
            } else {
                // "How to login" : Logout when you are done.
                mSession.logout();
                bContinue = false;
            }
        }
    }

    private void onResponse() {
        while (true) {
            if (mResponseQueue.size() == 0)
                break;

            O2GResponse response = mResponseQueue.poll();
            if (response.getType() == O2GResponseType.MARKET_DATA_SNAPSHOT)
                onMarketDataSnaphsotRecieved(response);
            else if (response.getType() == O2GResponseType.GET_OFFERS || response.getType() == O2GResponseType.TABLES_UPDATES) {
                onOffersRecieved(response);
                if (response.getType() == O2GResponseType.TABLES_UPDATES)
                    onTableUpdateReceive(response);
            } else if (response.getType() == O2GResponseType.GET_ORDERS)
                onOrderReceived(response);
            else if (response.getType() == O2GResponseType.CREATE_ORDER_RESPONSE)
                onOrderResponse(response);
            else if (response.getType() == O2GResponseType.GET_TRADES)
                onTradeReceived(response);
            else if (response.getType() == O2GResponseType.GET_CLOSED_TRADES)
                onClosedTradeReceived(response);
        }
    }

    private void onConnected() {
        // Show log time frames.
        logTimeFrames();
        // Send history data.
        sendMarketDataSnapshot();
        // Show login rules.
        O2GLoginRules loginRules = mSession.getLoginRules();

        // Has been received offers table snapshot?
        if (loginRules != null && loginRules.isTableLoadedByDefault(O2GTableType.OFFERS)) {
            O2GResponse response = loginRules.getTableRefreshResponse(O2GTableType.OFFERS);
            onOffersRecieved(response);
        } else
            sendGetOffers();

        // Has been received accounts table snapshot?
        if (loginRules != null && loginRules.isTableLoadedByDefault(O2GTableType.ACCOUNTS)) {
            O2GResponse response = loginRules.getTableRefreshResponse(O2GTableType.ACCOUNTS);
            onAccountsReceived(response);
        }

        if (loginRules != null) {
            // Get system properties from login rules.
            O2GResponse systemPropertiesResponse = loginRules.getSystemPropertiesResponse();
            onSystemPropertiesReceived(systemPropertiesResponse);

            // Create sample order.
            mOrderSample.prepareParamsFromLoginRules(loginRules);
            mOrderSample.createOrders();

            // Print permissions
            mPermissionSample.print();
            // Print trading settings
            mTradingSettings.print();
        }
    }

    private void onOffersRecieved(O2GResponse response) {
        O2GResponseReaderFactory factory = mSession.getResponseReaderFactory();
        if (factory == null)
            return;

        O2GOffersTableResponseReader offersReader = factory.createOffersTableReader(response);
        if (offersReader == null)
            return;

        if (response.getType() == O2GResponseType.TABLES_UPDATES)
            onUpdateOffers(offersReader);
        else
            onOffersTableResponse(offersReader);
    }

    private void onUpdateOffers(O2GOffersTableResponseReader offersReader) {
        int iCount = offersReader.size();

        mSimpleLog.log("Offer updates count {0}", iCount);

        for (int i = 0; i < iCount; i++) {
            O2GOfferRow offer = offersReader.getRow(i);
            mSimpleLog.log("{0} OfferID={1} Bid={2} Ask={3} Volume={4}", offer.getInstrument(), offer.getOfferID(), offer.getBid(), offer.getAsk(), offer.getVolume());
        }
    }

    private void onOffersTableResponse(O2GOffersTableResponseReader offersReader) {
        useGenericTableInterface(offersReader);
        useOffersTableIntefaces(offersReader);
    }

    private void onAccountsReceived(O2GResponse response) {
        O2GResponseReaderFactory factory = mSession.getResponseReaderFactory();
        if (factory == null)
            return;

        O2GAccountsTableResponseReader accountsReader = factory.createAccountsTableReader(response);
        if (accountsReader == null)
            return;

        useGenericTableInterface(accountsReader);
        useAccountsTableIntefaces(accountsReader);
        // Gets orders from server
        getOrders(accountsReader);
        // Get trades from server
        getTrades();
        // Get closed trades from server
        getClosedTrades();
    }

    private void useAccountsTableIntefaces(O2GAccountsTableResponseReader accountsReader) {
        mSimpleLog.log("Accounts Table");
        for (int i = 0; i < accountsReader.size(); i++) {
            O2GAccountRow account = accountsReader.getRow(i);
            printToLogAccount(account);
        }
    }

    private void useGenericTableInterface(O2GGenericTableResponseReader genericReader) {
        mSimpleLog.log("Generic table");
        O2GTableColumnCollection columns = genericReader.getColumns();
        // Print column
        for (int i = 0; i < columns.size(); i++) {
            O2GTableColumn column = columns.get(i);
            mSimpleLog.log("{0} {1} {2}", i, column.getId(), column.getType());
        }

        for (int i = 0; i < genericReader.size(); i++) {
            int iCount = columns.size();
            for (int j = 0; j < iCount; j++) {
                Object value = genericReader.getCell(i, j);
                boolean bIsCellValid = genericReader.isCellValid(i, j);
                O2GTableColumn column = columns.get(j);
                if (value instanceof Calendar) {
                    value = ((Calendar)value).getTime();
                }
                mSimpleLog.log("{0} = {1} Valid={2}", column.getId(), value, bIsCellValid);
            }
        }
    }

    private void useOffersTableIntefaces(O2GOffersTableResponseReader offersReader) {
        mSimpleLog.log("Offers Table");
        for (int i = 0; i < offersReader.size(); i++) {
            O2GOfferRow offer = offersReader.getRow(i);
            printToLogOffer(offer);
        }
    }

    private void sendGetOffers() {
        O2GRequestFactory factory = mSession.getRequestFactory();
        O2GRequest refreshOffers = factory.createRefreshTableRequest(O2GTableType.OFFERS);
        mSession.sendRequest(refreshOffers);
    }

    private void getOrders(O2GAccountsTableResponseReader accountsReader) {
        O2GRequestFactory factory = mSession.getRequestFactory();
        for (int i = 0; i < accountsReader.size(); i++) {
            O2GAccountRow account = accountsReader.getRow(i);
            O2GRequest request = factory.createRefreshTableRequestByAccount(O2GTableType.ORDERS, account.getAccountID());
            mSession.sendRequest(request);
        }
    }

    private void getTrades() {
        O2GRequestFactory factory = mSession.getRequestFactory();
        O2GRequest request = factory.createRefreshTableRequest(O2GTableType.TRADES);
        mSession.sendRequest(request);
    }

    private void getClosedTrades() {
        O2GRequestFactory factory = mSession.getRequestFactory();
        O2GRequest request = factory.createRefreshTableRequest(O2GTableType.CLOSED_TRADES);
        mSession.sendRequest(request);
    }

    private void onOrderReceived(O2GResponse response) {
        O2GResponseReaderFactory factory = mSession.getResponseReaderFactory();
        if (factory == null)
            return;

        O2GOrdersTableResponseReader ordersReader = factory.createOrdersTableReader(response);
        if (ordersReader == null)
            return;

        useGenericTableInterface(ordersReader);
        useOrdersTableIntefaces(ordersReader);
    }

    private void sendMarketDataSnapshot() {
        O2GRequestFactory factory = mSession.getRequestFactory();
        O2GTimeframeCollection timeFrames = factory.getTimeFrameCollection();
        O2GTimeframe timeFrame = timeFrames.get(0);
        O2GRequest marketDataRequest = factory.createMarketDataSnapshotRequestInstrument("EUR/USD", timeFrame, 300);
        if (marketDataRequest == null)
            return;
        factory.fillMarketDataSnapshotRequestTime(marketDataRequest, null, null, false);
        mSession.sendRequest(marketDataRequest);
    }

    private void onMarketDataSnaphsotRecieved(O2GResponse response) {
        O2GResponseReaderFactory factory = mSession.getResponseReaderFactory();
        O2GMarketDataSnapshotResponseReader marketSnapshotReader = factory.createMarketDataSnapshotReader(response);
        O2GTimeConverter converter = mSession.getTimeConverter();
        Calendar date;
        for (int i = 0; i < marketSnapshotReader.size(); i++) {
            date = marketSnapshotReader.getDate(i);
            date = converter.convert(date, O2GTimeConverterTimeZone.LOCAL);
            mSimpleLog.log("Date={0},BidOpen={1},BidHigh={2},BidLow={3},BidClose={4},AskOpen={5},AskHigh={6},AskLow={7},AskClose={8}", date.getTime(), marketSnapshotReader.getBidOpen(i), marketSnapshotReader.getBidHigh(i), marketSnapshotReader.getBidLow(i), marketSnapshotReader.getBidClose(i),
                    marketSnapshotReader.getAskOpen(i), marketSnapshotReader.getAskHigh(i), marketSnapshotReader.getAskLow(i), marketSnapshotReader.getAskClose(i));
        }
        // Last bar volume
        date = marketSnapshotReader.getLastBarTime();
        date = converter.convert(date, O2GTimeConverterTimeZone.LOCAL);
        mSimpleLog.log("LastMinute={0} Volume={1}", date.getTime(), marketSnapshotReader.getLastBarVolume());
    }

    private void logTimeFrames() {
        O2GRequestFactory factory = mSession.getRequestFactory();
        O2GTimeframeCollection timeFrames = factory.getTimeFrameCollection();
        for (int i = 0; i < timeFrames.size(); i++) {
            O2GTimeframe timeFrame = timeFrames.get(i);
            mSimpleLog.log("Time frame id={0} unit={1} size={2}\n", timeFrame.getId(), timeFrame.getUnit(), timeFrame.getSize());
        }
    }

    private void onStatusChanged() {
    }

    private void onTradeReceived(O2GResponse response) {
        O2GResponseReaderFactory factory = mSession.getResponseReaderFactory();
        if (factory == null)
            return;
        O2GTradesTableResponseReader tradesReader = factory.createTradesTableReader(response);
        if (tradesReader == null)
            return;

        useGenericTableInterface(tradesReader);
        useTradesTableInterfaces(tradesReader);
    }

    private void onClosedTradeReceived(O2GResponse response) {
        O2GResponseReaderFactory factory = mSession.getResponseReaderFactory();
        if (factory == null)
            return;
        O2GClosedTradesTableResponseReader closedTradesReader = factory.createClosedTradesTableReader(response);
        if (closedTradesReader == null)
            return;

        useGenericTableInterface(closedTradesReader);
        useClosedTradesTableInterfaces(closedTradesReader);
    }

    private void useOrdersTableIntefaces(O2GOrdersTableResponseReader ordersReader) {
        for (int i = 0; i < ordersReader.size(); i++) {
            O2GOrderRow order = ordersReader.getRow(i);
            printToLogOrder(order);
        }
    }

    private void useTradesTableInterfaces(O2GTradesTableResponseReader tradesReader) {
        for (int i = 0; i < tradesReader.size(); i++) {
            O2GTradeRow trade = tradesReader.getRow(i);
            printToLogTrade(trade);
        }
    }

    private void useClosedTradesTableInterfaces(O2GClosedTradesTableResponseReader closedTradesReader) {
        for (int i = 0; i < closedTradesReader.size(); i++) {
            O2GClosedTradeRow closedTrade = closedTradesReader.getRow(i);
            printToLogClosedTrade(closedTrade);
        }
    }

    private void onTableUpdateReceive(O2GResponse response) {
        O2GResponseReaderFactory factory = mSession.getResponseReaderFactory();
        if (factory == null)
            return;

        O2GTablesUpdatesReader updatesReader = factory.createTablesUpdatesReader(response);
        if (updatesReader == null)
            return;

        for (int i = 0; i < updatesReader.size(); i++) {
            O2GTableType eTableType = updatesReader.getUpdateTable(i);
            if (eTableType == O2GTableType.TABLE_UNKNOWN)
                continue;

            O2GTableUpdateType eTableUpdateType = updatesReader.getUpdateType(i);
            mSimpleLog.log("Action={0} Table={1}", eTableUpdateType, eTableType);

            switch (eTableType) {
            case OFFERS: {
                O2GOfferRow offer = updatesReader.getOfferRow(i);
                printToLogOffer(offer);
                break;
            }
            case ACCOUNTS: {
                O2GAccountRow account = updatesReader.getAccountRow(i);
                printToLogAccount(account);
            }
                break;
            case ORDERS: {
                O2GOrderRow order = updatesReader.getOrderRow(i);
                printToLogOrder(order);
            }
                break;
            case TRADES: {
                O2GTradeRow trade = updatesReader.getTradeRow(i);
                printToLogTrade(trade);
                if (eTableUpdateType == O2GTableUpdateType.INSERT)
                    mOrderSample.createOrderForTrade(trade);
            }
                break;
            case CLOSED_TRADES: {
                O2GClosedTradeRow closedTrade = updatesReader.getClosedTradeRow(i);
                printToLogClosedTrade(closedTrade);
            }
                break;
            case MESSAGES: {
                O2GMessageRow message = updatesReader.getMessageRow(i);
                printToLogMessage(message);
            }
                break;
            }
        }
    }

    private void printToLogOffer(O2GOfferRow offer) {
        mSimpleLog.log("{0} OfferID={1} Bid={2} Ask={3} Low={4} High={5} Volume={6} QuoteID={7} Time={8} BidTradable={9} AskTradable={10} ContractCurreny={11} Digits={12} PointSize={13} SubscriptionStatus={14} TradingStatus={15} InstrumentType={16} ContractMultiplier={17} ValueDate={18} BuyInterest={19} SellInterest={20}",
                offer.getInstrument(), offer.getOfferID(), offer.getBid(), offer.getAsk(), offer.getLow(), offer.getHigh(), offer.getVolume(), offer.getQuoteID(), offer.getTime().getTime(), offer.getBidTradable(), offer.getAskTradable(), offer.getContractCurrency(), offer.getDigits(), offer.getPointSize(),
                offer.getSubscriptionStatus(), offer.getTradingStatus(), offer.getInstrumentType(), offer.getContractMultiplier(), offer.getValueDate(), offer.getBuyInterest(), offer.getSellInterest());
    }

    private void printToLogAccount(O2GAccountRow account) {
        mSimpleLog.log("AccountID={0} AccountName={1} AccountKind={2} AccountLimit={3} Balance={4} NonTradableEquity={5} M2MEquity={6} UsedMargin={7} UsedMargin3={8} MarginCallFlag={9} LastMarginCallDate={10} MainteanceType={11} AmountLimit={12} MaintenanceFlag={13} BaseUnitSize={14} LevarageProfileID={15} ManagerAccountID={16}",
                        account.getAccountID(), account.getAccountName(), account.getAccountKind(), account.getAmountLimit(), account.getBalance(), account.getNonTradeEquity(), account.getM2MEquity(), account.getUsedMargin(), account.getUsedMargin3(), account.getMarginCallFlag(),
                        account.getLastMarginCallDate(), account.getMaintenanceType(), account.getAmountLimit(), account.getMaintenanceFlag(), account.getBaseUnitSize(), account.getLeverageProfileID(), account.getManagerAccountID());
    }

    private void printToLogOrder(O2GOrderRow order) {
        mSimpleLog.log("OrderID={0} OfferID={1} TradeID={2} AccountID={3} AccountName={4} AccountKind={5} Amount={6} BuySell={7} Rate={8} RateMin={9} RateMax={10} ExecutionRate={11} TimeInForce={12} LifeTime={13} Status={14} StatusTime={15} Type={16} NetQuantity={17} TrailStep={18} TrailRate={19} PegType={20} PegOffset={21} ContingentOrderID={22} WorkingIndicator={23} ContingencyType={24} PrimaryID={25} OriginAmount={26} FilledAmount={27} RequestID={28} RequestTXT={29} ExpireDate={30} ValueDate={31} Parties={32}",
                        order.getOrderID(), order.getOfferID(), order.getTradeID(), order.getAccountID(), order.getAccountName(), order.getAccountKind(), order.getAmount(), order.getBuySell(), order.getRate(), order.getRateMin(), order.getRateMax(), order.getExecutionRate(), order.getTimeInForce(),
                        order.getLifetime(), order.getStatus(), order.getStatusTime().getTime(), order.getType(), order.getNetQuantity(), order.getTrailStep(), order.getTrailRate(), order.getPegType(), order.getPegOffset(), order.getContingentOrderID(), order.getWorkingIndicator(),
                        order.getContingencyType(), order.getPrimaryID(), order.getOriginAmount(), order.getFilledAmount(), order.getRequestID(), order.getRequestTXT(), order.getParties(), order.getExpireDate().getTime(), order.getValueDate());
    }

    private void printToLogTrade(O2GTradeRow trade) {
        mSimpleLog.log("TradeID ={0} OfferID={1} AccountID={2} AccountName={3} AccountKind={4} BuySell={5} Commission={6} RollInt={7} Amount={8} Open={9} OpenOrderID={10} OpenOrderReqID={11} RequestTXT={12} QuoteID={13} OpenTime={14} UsedMargin={15} TradeIDOrigin={16} Parties={17}", trade.getTradeID(),
                trade.getOfferID(), trade.getAccountID(), trade.getAccountName(), trade.getAccountKind(), trade.getBuySell(), trade.getCommission(), trade.getRolloverInterest(), trade.getAmount(), trade.getOpenRate(), trade.getOpenOrderID(), trade.getOpenOrderReqID(),
                trade.getOpenOrderRequestTXT(), trade.getOpenQuoteID(), trade.getOpenTime().getTime(), trade.getUsedMargin(), trade.getTradeIDOrigin(), trade.getParties());
    }

    private void printToLogClosedTrade(O2GClosedTradeRow closedTrade) {
        mSimpleLog.log("TradeID={0} OfferID={1} AccountID={2} AccountName={3} AccountKind={4} BuySell={5} CloseRate={6} CloseOrderID={7} CloseOrderReqID={8} CloseOrderRequestTXT={9} CloseQuoteID={10} CloseOrderParties={11} CloseTime={12} Commission={13} GrossPL={14} RolloverInterest={15} Amount={16} OpenRate={17} OpenOrderID={18} OpenOrderReqID={19} OpenOrderRequestTXT={20} OpenQuoteID={21} OpenOrderParties={22} TradeIDOrigin={23} TradeIDRemain={24} ValueDate={25}",
                        closedTrade.getTradeID(), closedTrade.getOfferID(), closedTrade.getAccountID(), closedTrade.getAccountName(), closedTrade.getAccountKind(), closedTrade.getBuySell(), closedTrade.getCloseRate(), closedTrade.getCloseOrderID(), closedTrade.getCloseOrderReqID(),
                        closedTrade.getCloseOrderRequestTXT(), closedTrade.getCloseQuoteID(), closedTrade.getCloseOrderParties(), closedTrade.getCloseTime().getTime(), closedTrade.getCommission(), closedTrade.getGrossPL(), closedTrade.getRolloverInterest(), closedTrade.getAmount(), closedTrade.getOpenRate(),
                        closedTrade.getOpenOrderID(), closedTrade.getOpenOrderReqID(), closedTrade.getOpenOrderRequestTXT(), closedTrade.getOpenQuoteID(), closedTrade.getOpenOrderParties(), closedTrade.getTradeIDOrigin(), closedTrade.getTradeIDRemain(), closedTrade.getValueDate());
    }

    private void printToLogMessage(O2GMessageRow message) {
        mSimpleLog.log("MsgID={0} Feature={1} From={2} Subject={3} Type={4} Time={5} Text={6}", message.getMsgID(), message.getFeature(), message.getFrom(), message.getSubject(), message.getType(), message.getTime().getTime(), message.getText());
    }

    private void onSystemPropertiesReceived(O2GResponse response) {
        O2GResponseReaderFactory factory = mSession.getResponseReaderFactory();
        if (factory == null)
            return;

        O2GSystemPropertiesReader systemResponseReader = factory.createSystemPropertiesReader(response);
        if (systemResponseReader == null)
            return;
        mSimpleLog.log("System Properties:");
        Map<String, String> properties = systemResponseReader.getProperties();
        for (Entry<String, String> entry : properties.entrySet()) {
            mSimpleLog.log("{0} {1}", entry.getKey(), entry.getValue());
        }
    }

    private void onOrderResponse(O2GResponse response) {
        mOrderSample.onOrderResponse(response);
    }
}