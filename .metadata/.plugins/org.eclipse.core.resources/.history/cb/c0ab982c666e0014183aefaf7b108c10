package com.fxcore2.samples;

import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;

import com.fxcore2.Constants;
import com.fxcore2.O2GAccountRow;
import com.fxcore2.O2GAccountsTableResponseReader;
import com.fxcore2.O2GLoginRules;
import com.fxcore2.O2GOfferRow;
import com.fxcore2.O2GOffersTableResponseReader;
import com.fxcore2.O2GOrderResponseReader;
import com.fxcore2.O2GRequest;
import com.fxcore2.O2GRequestFactory;
import com.fxcore2.O2GRequestParamsEnum;
import com.fxcore2.O2GResponse;
import com.fxcore2.O2GResponseReaderFactory;
import com.fxcore2.O2GSession;
import com.fxcore2.O2GTableType;
import com.fxcore2.O2GTradeRow;
import com.fxcore2.O2GValueMap;

public class CreateOrderSample {

    private SimpleLog mSimpleLog;

    private O2GSession mSession;

    private int mOrdersForTradeNum;

    private Map<String, Action> mActions;

    private OrderCreationParameters mParams;

    public CreateOrderSample(SimpleLog simpleLog, O2GSession session) {
        mSimpleLog = simpleLog;
        mSession = session;
        mOrdersForTradeNum = 0;
        mActions = new HashMap<String, Action>();
        mParams = null;
    }

    /** Create orders.*/
    public void createOrders() {
        int iNumberOfLots = 2;
        createTrueMarketOrder(mParams.getOfferID(), mParams.getAccountID(), mParams.getBaseAmount() * iNumberOfLots, Constants.Buy);

        prepareParamsAndCallEntryStopOrder(mParams.getOfferID(), mParams.getAccountID(), mParams.getBaseAmount() * iNumberOfLots, mParams.getPointSize(), 100, Constants.Buy);

        prepareParamsAndCallEntryLimitOrder(mParams.getOfferID(), mParams.getAccountID(), mParams.getBaseAmount() * iNumberOfLots, mParams.getPointSize(), 100, Constants.Sell);

        prepareParamsAndCallEntryLimitOrderWithStopLimit(mParams.getOfferID(), mParams.getAccountID(), mParams.getBaseAmount() * iNumberOfLots, mParams.getPointSize(), 500, Constants.Buy);

        createMarketOrder(mParams.getOfferID(), mParams.getAccountID(), mParams.getBaseAmount() * iNumberOfLots, mParams.getAsk(), Constants.Buy);

        prepareParamsAndCallRangeOrder(mParams.getOfferID(), mParams.getAccountID(), mParams.getBaseAmount() * iNumberOfLots, mParams.getPointSize(), 10, Constants.Buy);

        prepareParamsAndCallOCOOrders(mParams.getOfferID(), mParams.getAccountID(), mParams.getBaseAmount() * iNumberOfLots, mParams.getPointSize(), Constants.Buy);
    }

    /** Create OCO orders. */
    public void createOCO(String sOfferID, String sAccountID, int iAmount, double dRate, String sBuySell, int iOrdersCount) {
        O2GRequestFactory factory = mSession.getRequestFactory();

        O2GValueMap mainValueMap = factory.createValueMap();
        mainValueMap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.CreateOCO);
        for (int i = 0; i < iOrdersCount; i++) {
            O2GValueMap valuemap = factory.createValueMap();
            valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.CreateOrder);
            valuemap.setString(O2GRequestParamsEnum.ORDER_TYPE, Constants.Orders.LimitEntry);
            valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID); // The identifier of the account the order should be placed for.
            valuemap.setString(O2GRequestParamsEnum.OFFER_ID, sOfferID); // The identifier of the instrument the order should be placed for.
            valuemap.setString(O2GRequestParamsEnum.BUY_SELL, sBuySell); // The order direction (Constants.Buy for buy, Constants.Sell for sell)
            valuemap.setDouble(O2GRequestParamsEnum.RATE, dRate); // The dRate at which the order must be filled (below current dRate for Buy, above current dRate for Sell)
            valuemap.setInt(O2GRequestParamsEnum.AMOUNT, iAmount); // The quantity of the instrument to be bought or sold.

            valuemap.setString(O2GRequestParamsEnum.CUSTOM_ID, MessageFormat.format("OCO_LimitEntry_N{0}", i + 1)); // The custom identifier of the order.
            mainValueMap.appendChild(valuemap);
        }

        O2GRequest request = factory.createOrderRequest(mainValueMap);
        for (int i = 0; i < request.getChildrenCount(); i++) {
            O2GRequest childRequest = request.getChildRequest(i);
            mActions.put(childRequest.getRequestId(), Action.DELETE_ORDER);
        }
        mSession.sendRequest(request);
    }

    /** Create True Market order */
    public void createTrueMarketOrder(String sOfferID, String sAccountID, int iAmount, String sBuySell) {

        O2GRequestFactory factory = mSession.getRequestFactory();

        O2GValueMap valuemap = factory.createValueMap();
        valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.CreateOrder);
        valuemap.setString(O2GRequestParamsEnum.ORDER_TYPE, Constants.Orders.TrueMarketOpen);
        valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID); // The identifier of the account the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.OFFER_ID, sOfferID); // The identifier of the instrument the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.BUY_SELL, sBuySell); // The order direction: Constants.Sell for "Sell", Constants.Buy for "Buy".
        valuemap.setInt(O2GRequestParamsEnum.AMOUNT, iAmount); // The quantity of the instrument to be bought or sold.
        valuemap.setString(O2GRequestParamsEnum.CUSTOM_ID, "TrueMarketOrder"); // The custom identifier of the order.

        O2GRequest request = factory.createOrderRequest(valuemap);
        mSession.sendRequest(request);
    }

    /** Create Stop Entry order */
    public void createEntryStopOrder(String sOfferID, String sAccountID, int iAmount, double dRate, String sBuySell) {

        O2GRequestFactory factory = mSession.getRequestFactory();

        O2GValueMap valuemap = factory.createValueMap();
        valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.CreateOrder);
        valuemap.setString(O2GRequestParamsEnum.ORDER_TYPE, Constants.Orders.StopEntry);
        valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID); // The identifier of the account the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.OFFER_ID, sOfferID); // The identifier of the instrument the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.BUY_SELL, sBuySell); // The order direction (Constants.Buy for buy, Constants.Sell for sell)
        valuemap.setDouble(O2GRequestParamsEnum.RATE, dRate); // The dRate at which the order must be filled (above current dRate for Buy, bellow current dRate for Sell)
        valuemap.setInt(O2GRequestParamsEnum.AMOUNT, iAmount); // The quantity of the instrument to be bought or sold.
        valuemap.setString(O2GRequestParamsEnum.CUSTOM_ID, "StopEntryOrder"); // The custom identifier of the order.

        O2GRequest request = factory.createOrderRequest(valuemap);
        mSession.sendRequest(request);
        // Store the request and set delete actions. After the order has been created,
        // delete it.
        mActions.put(request.getRequestId(), Action.DELETE_ORDER);
    }

    /** Create Limit Entry order */
    public void createEntryLimitOrder(String sOfferID, String sAccountID, int iAmount, double dRate, String sBuySell) {

        O2GRequestFactory factory = mSession.getRequestFactory();

        O2GValueMap valuemap = factory.createValueMap();
        valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.CreateOrder);
        valuemap.setString(O2GRequestParamsEnum.ORDER_TYPE, Constants.Orders.LimitEntry);
        valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID); // The identifier of the account the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.OFFER_ID, sOfferID); // The identifier of the instrument the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.BUY_SELL, sBuySell); // The order direction (Constants.Buy for buy, Constants.Sell for sell)
        valuemap.setDouble(O2GRequestParamsEnum.RATE, dRate); // The dRate at which the order must be filled (below current dRate for Buy, above current dRate for Sell)
        valuemap.setInt(O2GRequestParamsEnum.AMOUNT, iAmount); // The quantity of the instrument to be bought or sold.
        valuemap.setString(O2GRequestParamsEnum.CUSTOM_ID, "LimitEntryOrder"); // The custom identifier of the order.

        O2GRequest request = factory.createOrderRequest(valuemap);
        mSession.sendRequest(request);
    }

    /** Create True Market Close order */
    public void createTrueMarketCloseOrder(String sOfferID, String sAccountID, String sTradeID, int iAmount, String sBuySell) {

        O2GRequestFactory factory = mSession.getRequestFactory();

        O2GValueMap valuemap = factory.createValueMap();
        valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.CreateOrder);
        valuemap.setString(O2GRequestParamsEnum.ORDER_TYPE, Constants.Orders.TrueMarketClose);
        valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID); // The identifier of the account the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.OFFER_ID, sOfferID); // The identifier of the instrument the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.TRADE_ID, sTradeID); // The identifier of the trade to be closed.
        valuemap.setInt(O2GRequestParamsEnum.AMOUNT, iAmount); // The quantity of the instrument to be bought or sold. Must be <= to the size of the position ("Trades" table, Lot column).
        valuemap.setString(O2GRequestParamsEnum.BUY_SELL, sBuySell); // The order direction: Constants.Buy for Buy, Constants.Sell for Sell. Must be opposite to the direction of the trade.
        valuemap.setString(O2GRequestParamsEnum.CUSTOM_ID, "CloseTrueMarketOrder"); // The custom identifier of the order.

        O2GRequest request = factory.createOrderRequest(valuemap);
        mSession.sendRequest(request);
    }

    /** Create Market order.*/
    public void createMarketOrder(String sOfferID, String sAccountID, int iAmount, double dRate, String sBuySell) {
        O2GRequestFactory factory = mSession.getRequestFactory();

        O2GValueMap valuemap = factory.createValueMap();
        valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.CreateOrder);
        valuemap.setString(O2GRequestParamsEnum.ORDER_TYPE, Constants.Orders.MarketOpen);
        valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID); // The identifier of the account the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.OFFER_ID, sOfferID); // The identifier of the instrument the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.BUY_SELL, sBuySell); // The order direction (use Constants.Buy for Buy, Constants.Sell for Sell)
        valuemap.setDouble(O2GRequestParamsEnum.RATE, dRate); // The dRate at which the order must be filled.
        valuemap.setInt(O2GRequestParamsEnum.AMOUNT, iAmount); // The quantity of the instrument to be bought or sold.
        valuemap.setString(O2GRequestParamsEnum.CUSTOM_ID, "OpenMarketOrder"); // The custom identifier of the order.

        O2GRequest request = factory.createOrderRequest(valuemap);
        mSession.sendRequest(request);
    }

    /** Create Market order */
    public void createMarketCloseOrder(String sOfferID, String sAccountID, String sTradeID, int iAmount, double dRate, String sBuySell) {
        O2GRequestFactory factory = mSession.getRequestFactory();

        O2GValueMap valuemap = factory.createValueMap();
        valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.CreateOrder);
        valuemap.setString(O2GRequestParamsEnum.ORDER_TYPE, Constants.Orders.MarketClose);
        valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID); // The identifier of the account the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.OFFER_ID, sOfferID); // The identifier of the instrument the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.TRADE_ID, sTradeID); // The identifier of the trade to be closed.
        valuemap.setString(O2GRequestParamsEnum.BUY_SELL, sBuySell); // The order direction (Constants.Buy - for Buy, Constants.Sell - for Sell). Must be opposite to the direction of the trade.
        valuemap.setInt(O2GRequestParamsEnum.AMOUNT, iAmount); // The quantity of the instrument to be bought or sold.  Must <= to the size of the position (Lot column of the trade).
        valuemap.setDouble(O2GRequestParamsEnum.RATE, dRate); // The dRate at which the order must be filled.
        valuemap.setString(O2GRequestParamsEnum.CUSTOM_ID, "CloseMarketOrder"); // The custom identifier of the order.
        O2GRequest request = factory.createOrderRequest(valuemap);
        mSession.sendRequest(request);
    }

    /** Create Range order.*/
    public void createRangeOrder(String sOfferID, String sAccountID, int iAmount, double dRateMin, double dRateMax, String sBuySell) {
        O2GRequestFactory factory = mSession.getRequestFactory();

        O2GValueMap valuemap = factory.createValueMap();
        valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.CreateOrder);
        valuemap.setString(O2GRequestParamsEnum.ORDER_TYPE, Constants.Orders.MarketOpenRange);
        valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID); // The identifier of the account the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.OFFER_ID, sOfferID); // The identifier of the instrument the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.BUY_SELL, sBuySell); // The order direction (Constants.Buy for buy, Constants.Sell for sell).
        valuemap.setDouble(O2GRequestParamsEnum.RATE_MIN, dRateMin); // The minimum dRate at which the order can be filled.
        valuemap.setDouble(O2GRequestParamsEnum.RATE_MAX, dRateMax); // The maximum dRate at which the order can be filled.
        valuemap.setString(O2GRequestParamsEnum.CUSTOM_ID, "OpenRangeOrder"); // The custom identifier of the order.
        valuemap.setInt(O2GRequestParamsEnum.AMOUNT, iAmount);

        O2GRequest request = factory.createOrderRequest(valuemap);
        mSession.sendRequest(request);
    }

    /** Create Range Close order */
    public void createRangeCloseOrder(String sOfferID, String sAccountID, String sTradeID, int iAmount, double dRateMin, double dRateMax, String sBuySell) {
        O2GRequestFactory factory = mSession.getRequestFactory();

        O2GValueMap valuemap = factory.createValueMap();
        valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.CreateOrder);
        valuemap.setString(O2GRequestParamsEnum.ORDER_TYPE, Constants.Orders.MarketCloseRange);
        valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID);
        valuemap.setString(O2GRequestParamsEnum.OFFER_ID, sOfferID); // The identifier of the instrument the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.TRADE_ID, sTradeID); // The identifier of the trade to be closed.
        valuemap.setString(O2GRequestParamsEnum.BUY_SELL, sBuySell); // The order direction (Constants.Buy for Buy, Constants.Sell for Sell). Must be opposite to the direction of the trade.
        valuemap.setInt(O2GRequestParamsEnum.AMOUNT, iAmount); // The quantity of the instrument to be bought or sold. Must be <= size of the position (Lot of the trade). Must be divisible by baseUnitSize.
        valuemap.setDouble(O2GRequestParamsEnum.RATE_MIN, dRateMin); // The minimum dRate at which the order can be filled.
        valuemap.setDouble(O2GRequestParamsEnum.RATE_MAX, dRateMax); // The maximum dRate at which the order can be filled.
        valuemap.setString(O2GRequestParamsEnum.CUSTOM_ID, "CloseRangeOrder"); // The custom identifier of the order.
        O2GRequest request = factory.createOrderRequest(valuemap);
        mSession.sendRequest(request);
    }

    public void onOrderResponse(O2GResponse response) {
        O2GResponseReaderFactory factory = mSession.getResponseReaderFactory();

        // Log order response
        O2GOrderResponseReader orderResponseReader = factory.createOrderResponseReader(response);
        if (orderResponseReader == null)
            return;

        mSimpleLog.log("Create order: OrderID={0}", orderResponseReader.getOrderID());

        // Try to find the request in the stored request ids
        String sRequestID = response.getRequestId();
        // In case the order request isn't associated with actions then skip the
        // response
        Action eAction = mActions.get(sRequestID);
        if (eAction != null) {
            if (eAction == Action.DELETE_ORDER) {
                deleteOrder(orderResponseReader.getOrderID(), mParams.getAccountID());
            }
            else if (eAction == Action.EDIT_ORDER) {
                editOrder(orderResponseReader.getOrderID(), mParams.getAccountID(), mParams.getBaseAmount() * 5,
                // The original rate has 500 points(50 pips),
                // increase the rate by 5 pips.
                        mParams.getAsk() - mParams.getPointSize() * 550);
            }

            mActions.remove(sRequestID);
        }
    }

    /** Edit order.*/
    public void editOrder(String sOrderID, String sAccountID, int iAmount, double dRate) {
        O2GRequestFactory factory = mSession.getRequestFactory();

        O2GValueMap valuemapChangeOrder = factory.createValueMap();
        valuemapChangeOrder.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.EditOrder);
        valuemapChangeOrder.setString(O2GRequestParamsEnum.ORDER_ID, sOrderID);
        valuemapChangeOrder.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID);
        valuemapChangeOrder.setDouble(O2GRequestParamsEnum.RATE, dRate);
        valuemapChangeOrder.setInt(O2GRequestParamsEnum.AMOUNT, iAmount);
        valuemapChangeOrder.setString(O2GRequestParamsEnum.CUSTOM_ID, "EditOrder");

        O2GRequest requestChangeOrder = factory.createOrderRequest(valuemapChangeOrder);
        mSession.sendRequest(requestChangeOrder);
    }

    public void prepareParamsFromLoginRules(O2GLoginRules loginRules) {
        mParams = new OrderCreationParameters();

        O2GResponseReaderFactory factory = mSession.getResponseReaderFactory();
        // Gets first account from login.
        O2GResponse accountsResponse = loginRules.getTableRefreshResponse(O2GTableType.ACCOUNTS);
        O2GAccountsTableResponseReader accountsReader = factory.createAccountsTableReader(accountsResponse);
        O2GAccountRow account = accountsReader.getRow(0);
        // Store account id
        mParams.setAccountID(account.getAccountID());
        // Store base iAmount
        mParams.setBaseAmount(account.getBaseUnitSize());

        // Get offers for EUR/USD
        O2GResponse offerResponse = loginRules.getTableRefreshResponse(O2GTableType.OFFERS);
        O2GOffersTableResponseReader offersReader = factory.createOffersTableReader(offerResponse);
        for (int i = 0; i < offersReader.size(); i++) {
            O2GOfferRow offer = offersReader.getRow(i);
            if (offer.getInstrument().equalsIgnoreCase("EUR/USD")) {
                mParams.setOfferID(offer.getOfferID());
                mParams.setAsk(offer.getAsk());
                mParams.setBid(offer.getBid());
                mParams.setPointSize(offer.getPointSize());
                break;
            }
        }
    }

    public void createStopOrder(String sOfferID, String sAccountID, String sTradeID, int iAmount, double dRate, String sBuySell) {
        O2GRequestFactory factory = mSession.getRequestFactory();

        O2GValueMap valuemap = factory.createValueMap();
        valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.CreateOrder);
        valuemap.setString(O2GRequestParamsEnum.ORDER_TYPE, Constants.Orders.Stop);
        valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID); // The identifier of the account the order should be placed for
        valuemap.setString(O2GRequestParamsEnum.OFFER_ID, sOfferID); // The identifier of the instrument the order should be placed for
        valuemap.setString(O2GRequestParamsEnum.TRADE_ID, sTradeID); // The identifier of the trade to be closed
        valuemap.setString(O2GRequestParamsEnum.BUY_SELL, sBuySell); // The order direction (Constants.Buy for Buy, Constants.Sell for Sell). Must be opposite to the direction of the trade
        valuemap.setInt(O2GRequestParamsEnum.AMOUNT, iAmount); // The quantity of the instrument to be bought or sold. Must be = size of the position (Lot of the trade). Must be divisible by baseUnitSize
        valuemap.setDouble(O2GRequestParamsEnum.RATE, dRate); // The dRate at which the order must be filled (< market for "Sell" order,  market for "Buy" order)
        valuemap.setString(O2GRequestParamsEnum.CUSTOM_ID, "StopOrder"); // The custom identifier of the order
        O2GRequest request = factory.createOrderRequest(valuemap);
        mSession.sendRequest(request);
    }

    public void createLimitOrder(String sOfferID, String sAccountID, String sTradeID, int iAmount, double dRate, String sBuySell) {
        O2GRequestFactory factory = mSession.getRequestFactory();

        O2GValueMap valuemap = factory.createValueMap();

        valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.CreateOrder);
        valuemap.setString(O2GRequestParamsEnum.ORDER_TYPE, Constants.Orders.Limit);
        valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID);
        valuemap.setString(O2GRequestParamsEnum.OFFER_ID, sOfferID); // The identifier of the instrument the order should be placed for
        valuemap.setString(O2GRequestParamsEnum.TRADE_ID, sTradeID); // The identifier of the trade to be closed
        valuemap.setString(O2GRequestParamsEnum.BUY_SELL, sBuySell); // The order direction(Constants.Buy for Buy, Constants.Sell for Sell). Must be opposite to the direction of the trade
        valuemap.setInt(O2GRequestParamsEnum.AMOUNT, iAmount); // The quantity of the instrument to be bought or sold. Must == the size of the position (Lot of the trade).
        valuemap.setDouble(O2GRequestParamsEnum.RATE, dRate); // The dRate at which the order must be filled ( market for Sell, < market for Buy)
        valuemap.setString(O2GRequestParamsEnum.CUSTOM_ID, "LimitOrder"); // The custom identifier of the order
        O2GRequest request = factory.createOrderRequest(valuemap);
        mSession.sendRequest(request);
    }

    /** Delete order command.*/
    public void deleteOrder(String sOrderID, String sAccountID) {

        O2GRequestFactory factory = mSession.getRequestFactory();
        O2GValueMap valuemap = factory.createValueMap();
        valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.DeleteOrder);
        valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID);
        valuemap.setString(O2GRequestParamsEnum.ORDER_ID, sOrderID);
        O2GRequest request = factory.createOrderRequest(valuemap);
        if (request == null)
        {
            mSimpleLog.log("Fail to create delete order request: OrderID={0}", sOrderID);
            return;
        }
        mSession.sendRequest(request);
    }

    /** Prepare parameters for True Market Close order, then create an order */
    public void prepareParamsAndCallTrueMarketCloseOrder(O2GTradeRow tradeRow) {
        //The order direction of the close order must be opposite to the direction of the trade.
        String sTradeBuySell = tradeRow.getBuySell();
        if (sTradeBuySell == Constants.Buy) // trade BuySell=Constants.Buy = order BuySell = Constants.Sell
            createTrueMarketCloseOrder(tradeRow.getOfferID(), tradeRow.getAccountID(), tradeRow.getTradeID(), tradeRow.getAmount(), Constants.Sell);
        else
            // trade BuySell=Constants.Sell = order BuySell = Constants.Buy
            createTrueMarketCloseOrder(tradeRow.getOfferID(), tradeRow.getAccountID(), tradeRow.getTradeID(), tradeRow.getAmount(), Constants.Buy);
    }

    /** Prepare parameters for Market close order, then create and order */
    public void prepareParamsAndCallMarketCloseOrder(O2GTradeRow tradeRow) {
        String sTradeBuySell = tradeRow.getBuySell();
        // Close order is opposite to the trade
        boolean bBuyOrder = (sTradeBuySell == Constants.Sell);

        String sTradeOfferID = tradeRow.getOfferID();
        double dRate = 0;
        // Ask price for Buy and Bid price for Sell
        dRate = bBuyOrder ? mParams.getAsk() : mParams.getBid();

        createMarketCloseOrder(sTradeOfferID, tradeRow.getAccountID(), tradeRow.getTradeID(), tradeRow.getAmount(), dRate, bBuyOrder ? Constants.Buy : Constants.Sell);
    }

    /** Prepare parameters for Range Close order, then create an order */
    public void prepareParamsAndCallRangeCloseOrder(O2GTradeRow tradeRow, int iAtMarket) {
        String sTradeBuySell = tradeRow.getBuySell();
        // Close order is opposite to the trade
        boolean bBuyOrder = (sTradeBuySell == Constants.Sell);

        // Get dRate, then calculate dRateMin and dRateMax
        String sTradeOfferID = tradeRow.getOfferID();
        double dRate = 0;
        dRate = bBuyOrder ? mParams.getAsk() : mParams.getBid();

        double dPointSize = mParams.getPointSize();
        double dRateMin = dRate - iAtMarket * dPointSize;
        double dRateMax = dRate + iAtMarket * dPointSize;

        createRangeCloseOrder(sTradeOfferID, tradeRow.getAccountID(), tradeRow.getTradeID(), tradeRow.getAmount(), dRateMin, dRateMax, bBuyOrder ? Constants.Buy : Constants.Sell);
    }

    /** Prepare parameters for Stop order, then create an order */
    public void prepareParamsAndCallStopOrder(O2GTradeRow tradeRow, int iAtMarket) {
        String sTradeBuySell = tradeRow.getBuySell();
        // Close order is opposite to the trade
        boolean bBuyOrder = false;
        if (sTradeBuySell == com.fxcore2.Constants.Sell)
            bBuyOrder = true;

        String sTradeOfferID = tradeRow.getOfferID();
        double dCurrentRate = 0;
        double dStopRate = 0;
        double dPointSize = mParams.getPointSize();
        if (bBuyOrder) {
            dCurrentRate = mParams.getAsk();
            dStopRate = dCurrentRate + iAtMarket * dPointSize;

        } else {
            dCurrentRate = mParams.getBid();
            dStopRate = dCurrentRate - iAtMarket * dPointSize;
        }

        createStopOrder(sTradeOfferID, tradeRow.getAccountID(), tradeRow.getTradeID(), tradeRow.getAmount(), dStopRate, bBuyOrder ? Constants.Buy : Constants.Sell);
    }

    /** Prepare parameters for Limit order, then create an order */
    public void prepareParamsAndCallLimitOrder(O2GTradeRow tradeRow, int iAtMarket) {
        String sTradeBuySell = tradeRow.getBuySell();
        // Close order is opposite to the trade
        boolean bBuyOrder = false;
        if (sTradeBuySell == Constants.Sell)
            bBuyOrder = true;

        String sTradeOfferID = tradeRow.getOfferID();
        double dCurrentRate = 0;
        double dLimitRate = 0;
        double dPointSize = mParams.getPointSize();
        if (bBuyOrder) {
            dCurrentRate = mParams.getAsk();
            dLimitRate = dCurrentRate - iAtMarket * dPointSize;
        } else {
            dCurrentRate = mParams.getBid();
            dLimitRate = dCurrentRate + iAtMarket * dPointSize;
        }

        createLimitOrder(sTradeOfferID, tradeRow.getAccountID(), tradeRow.getTradeID(), tradeRow.getAmount(), dLimitRate, bBuyOrder ? Constants.Buy : Constants.Sell);
    }

    /** Prepare parameters for Stop Entry order, then create an order */
    public void prepareParamsAndCallEntryStopOrder(String sOfferID, String sAccountID, int iAmount, double dPointSize, int iNumPoints, String sBuySell) {
        double dCurrentRate = 0;
        double dOrderRate = 0;
        if (sBuySell == Constants.Buy) {
            dCurrentRate = mParams.getAsk();
            dOrderRate = dCurrentRate + dPointSize * iNumPoints; // The buy order dRate must be above the market.
        } else // BuySell = Constants.Sell
        {
            dCurrentRate = mParams.getBid();
            dOrderRate = dCurrentRate - dPointSize * iNumPoints; // The sell order dRate must be below the market.
        }
        createEntryStopOrder(sOfferID, sAccountID, iAmount, dOrderRate, sBuySell);
    }

    /** Prepare parameters for Limit Entry order, than create an order */
    public void prepareParamsAndCallEntryLimitOrder(String sOfferID, String sAccountID, int iAmount, double dPointSize, int numPoints, String sBuySell) {
        double dOrderRate = 0;
        double dCurrentRate = 0;
        if (sBuySell == Constants.Buy) {
            dCurrentRate = mParams.getAsk();
            dOrderRate = dCurrentRate - dPointSize * numPoints; // The buy order dRate must be below the market.
        } else// BuySell = Constants.Sell
        {
            dCurrentRate = mParams.getBid();
            dOrderRate = dCurrentRate + dPointSize * numPoints; // The sell order dRate must be above the market.
        }
        createEntryLimitOrder(sOfferID, sAccountID, iAmount, dOrderRate, sBuySell);
    }

    /** Prepare parameters for Range order, then create an order */
    public void prepareParamsAndCallRangeOrder(String sOfferID, String sAccountID, int iAmount, double dPointSize, int iAtMarket, String sBuySell) {
        boolean bBuy = (sBuySell == Constants.Buy);
        double dCurrentRate = bBuy ? mParams.getAsk() : mParams.getBid();
        double dRateMin = dCurrentRate - dPointSize * iAtMarket;
        double dRateMax = dCurrentRate + dPointSize * iAtMarket;
        createRangeOrder(sOfferID, sAccountID, iAmount, dRateMin, dRateMax, sBuySell);
    }

    /** Prepare entry order and call entry limit order with stop/limit.*/
    public void prepareParamsAndCallEntryLimitOrderWithStopLimit(String sOfferID, String sAccountID, int iAmount, double dPointSize, int iNumPoints, String sBuySell) {
        double dDistance = 10.0; // Distance in pips
        double dPegStop = 0;
        double dPegLimit = 0;
        double dOrderRate = 0;
        double dCurrentRate = 0;
        if (sBuySell == Constants.Buy) {
            dCurrentRate = mParams.getAsk();
            dOrderRate = dCurrentRate - dPointSize * iNumPoints;// The buy order rate must be below the market.
            dPegStop = -dDistance;
            dPegLimit = dDistance;
        } else// sBuySell = Constants.Sell
        {
            dCurrentRate = mParams.getBid();
            dOrderRate = dCurrentRate + dPointSize * (iNumPoints + dDistance);// The sell order rate must be above the market.
            dPegStop = dDistance;
            dPegLimit = -dDistance;
        }

        createEntryLimitOrderWithStopLimit(sOfferID, sAccountID, iAmount, dOrderRate, sBuySell, dPegStop, dPegLimit);
    }

    /** Create entry limit order with attached stop limit.*/
    public void createEntryLimitOrderWithStopLimit(String sOfferID, String sAccountID, int iAmount, double dOrderRate, String sBuySell, double dPegStopOffset, double dPegLimitOffset) {
        O2GRequestFactory factory = mSession.getRequestFactory();

        O2GValueMap valuemap = factory.createValueMap();
        valuemap.setString(O2GRequestParamsEnum.COMMAND, Constants.Commands.CreateOrder);
        valuemap.setString(O2GRequestParamsEnum.ORDER_TYPE, Constants.Orders.LimitEntry);
        valuemap.setString(O2GRequestParamsEnum.ACCOUNT_ID, sAccountID); // The identifier of the account the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.OFFER_ID, sOfferID); // The identifier of the instrument the order should be placed for.
        valuemap.setString(O2GRequestParamsEnum.BUY_SELL, sBuySell); // The order direction (Constants.Buy for buy, Constants.Sell for sell)
        valuemap.setDouble(O2GRequestParamsEnum.RATE, dOrderRate); // The rate at which the order must be filled (below current rate for Buy, above current rate for Sell)
        valuemap.setInt(O2GRequestParamsEnum.AMOUNT, iAmount); // The quantity of the instrument to be bought or sold.
        valuemap.setString(O2GRequestParamsEnum.CUSTOM_ID, "LimitEntryOrderWithStopLimit"); // The custom identifier of the order.
        valuemap.setString(O2GRequestParamsEnum.PEG_TYPE_STOP, Constants.Peg.FromClose); // The peg stop type
        valuemap.setDouble(O2GRequestParamsEnum.PEG_OFFSET_STOP, dPegStopOffset);
        valuemap.setString(O2GRequestParamsEnum.PEG_TYPE_LIMIT, Constants.Peg.FromOpen); // The peg limit type
        valuemap.setDouble(O2GRequestParamsEnum.PEG_OFFSET_LIMIT, dPegLimitOffset);

        O2GRequest request = factory.createOrderRequest(valuemap);
        mSession.sendRequest(request);

        // Store request ID and set the order for further editing. After the order has been created,
        // the order rate and amount will be changed.
        mActions.put(request.getRequestId(), Action.EDIT_ORDER);
    }

    /** Prepare parameters and call OCO orders */
    public void prepareParamsAndCallOCOOrders(String sOfferID, String sAccountID, int iAmount, double dPointSize, String sBuySell) {
        boolean bBuy = (sBuySell == Constants.Buy);
        double dRate = bBuy ? mParams.getAsk() : mParams.getBid();
        double dAmendment = 5 * dPointSize;
        if (bBuy)
            dRate -= dAmendment;
        else
            dRate += dAmendment;
        createOCO(sOfferID, sAccountID, iAmount, dRate, sBuySell, 3);
    }

    /** When the trade is created, either create one of the close orders (Market Close, True Market Close, Range Close) or add Stop/Limit to the trade */
    public void createOrderForTrade(O2GTradeRow trade) {
        switch (mOrdersForTradeNum) {
        case 0:
            prepareParamsAndCallMarketCloseOrder(trade);
            mOrdersForTradeNum++;
            break;
        case 1:
            prepareParamsAndCallTrueMarketCloseOrder(trade);
            mOrdersForTradeNum++;
            break;
        case 2:
            prepareParamsAndCallRangeCloseOrder(trade, 10);
            mOrdersForTradeNum++;
            break;
        case 3:
            prepareParamsAndCallStopOrder(trade, 100);
            prepareParamsAndCallLimitOrder(trade, 100);
            mOrdersForTradeNum++;
            break;
        default:
            break;
        }
    }

    private enum Action {
        DELETE_ORDER, SET_STOP_LIMIT, EDIT_ORDER;
    }

    private class OrderCreationParameters {
        private String mOfferID;
        private String mAccountID;
        private int mBaseAmount;
        private double mAsk;
        private double mBid;
        private double mPointSize;

        public OrderCreationParameters() {
        }

        public void setOfferID(String offerID) {
            mOfferID = offerID;
        }

        public String getOfferID() {
            return mOfferID;
        }

        public void setAccountID(String accountID) {
            mAccountID = accountID;
        }

        public String getAccountID() {
            return mAccountID;
        }

        public void setBaseAmount(int baseAmount) {
            mBaseAmount = baseAmount;
        }

        public int getBaseAmount() {
            return mBaseAmount;
        }

        public void setAsk(double ask) {
            mAsk = ask;
        }

        public double getAsk() {
            return mAsk;
        }

        private void setBid(double bid) {
            mBid = bid;
        }

        private double getBid() {
            return mBid;
        }

        private void setPointSize(double pointSize) {
            mPointSize = pointSize;
        }

        private double getPointSize() {
            return mPointSize;
        }
    }
}
