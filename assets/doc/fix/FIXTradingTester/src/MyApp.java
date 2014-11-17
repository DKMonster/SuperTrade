import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.TimeZone;

import quickfix.Application;
import quickfix.FieldNotFound;
import quickfix.Group;
import quickfix.IntField;
import quickfix.Message;
import quickfix.Session;
import quickfix.SessionID;
import quickfix.SessionSettings;
import quickfix.field.Account;
import quickfix.field.AccountType;
import quickfix.field.ClOrdID;
import quickfix.field.ClearingBusinessDate;
import quickfix.field.CollInquiryID;
import quickfix.field.MDEntryType;
import quickfix.field.MDReqID;
import quickfix.field.MDUpdateType;
import quickfix.field.MarketDepth;
import quickfix.field.NoRelatedSym;
import quickfix.field.OrdType;
import quickfix.field.OrderID;
import quickfix.field.OrderQty;
import quickfix.field.Password;
import quickfix.field.PosReqID;
import quickfix.field.PosReqType;
import quickfix.field.SecondaryClOrdID;
import quickfix.field.SecurityStatusReqID;
import quickfix.field.Side;
import quickfix.field.SubscriptionRequestType;
import quickfix.field.Symbol;
import quickfix.field.TimeInForce;
import quickfix.field.TradSesReqID;
import quickfix.field.TransactTime;
import quickfix.field.UserRequestID;
import quickfix.field.UserRequestType;
import quickfix.field.UserStatus;
import quickfix.field.Username;
import quickfix.fix44.CollateralInquiry;
import quickfix.fix44.CollateralReport;
import quickfix.fix44.ExecutionReport;
import quickfix.fix44.MarketDataRequest;
import quickfix.fix44.MarketDataSnapshotFullRefresh;
import quickfix.fix44.MessageCracker;
import quickfix.fix44.NewOrderSingle;
import quickfix.fix44.PositionReport;
import quickfix.fix44.RequestForPositions;
import quickfix.fix44.SecurityList;
import quickfix.fix44.SecurityStatusRequest;
import quickfix.fix44.TradingSessionStatus;
import quickfix.fix44.TradingSessionStatusRequest;
import quickfix.fix44.UserRequest;
import quickfix.fix44.UserResponse;
import quickfix.fix44.component.Instrument;

/**
 * Edit of MyApp
 * 
 * Orginal found in FIXTrader.java
 *
 */
public class MyApp extends MessageCracker implements Application
{
  static final private int FXCM = 9000;
  static final private int FXCMPosID = FXCM + 41; //9041;
  static final private int FXCMOpenOrderID = 37;
  static final private int FXCMLastReportRequested = 912;
  static final private int FXCMNoParam = FXCM + 16; //9016;
  static final private int FXCMParamValue = FXCM + 18; //9018;
  static final private int FXCMParamName = FXCM + 17; //9017;
  static final private int FXCMMinQuantity = FXCM + 95; //9095;
  static final private int REQUEST_LIST_OF_TRADING_SESSIONS = 5;
  static final public String FIXAPITEST = "fix_example_test";
  
  private CollInquiryID colInquiryID;
  private String userPassword;
  private String userPin;
  private long requestID;
  private SessionID sessionID;
  private TradingSessionStatus sessionStatus;
  private Date sessionStart;
  private String userName;
  private Calendar calendarUTC = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
  
  private SessionSettings settings;

  private boolean requestCompleted = false;
  private HashMap<Account, CollateralReport> accounts;
  private HashMap<OrderID, ExecutionReport> orders; 
  private HashMap<String, PositionReport> positions;
  private HashMap<String, MarketDataSnapshotFullRefresh> instruments; 
  

//START SECTION - public trading functions
  public boolean getRequestCompleted() { return requestCompleted; }
  
  public Set<Account> getAccts() { return new LinkedHashSet<Account>(accounts.keySet()); }
  public Set<OrderID> getOrdersPlaced() { return new LinkedHashSet<OrderID>(orders.keySet()); }
  public Set<String> getPositionsExecuted() { return new LinkedHashSet<String>(positions.keySet()); }
  public void resetPositionsExecuted()
  {
    if(positions.size() > 0)
      positions.clear();
  }
  public Set<String> getInstruments() { return new LinkedHashSet<String>(instruments.keySet()); }
  public PositionReport getPositionReport(String ticketID) { return positions.get(ticketID); }
  
  /**
   * Check whether a position has the specified secondary order id
   * 
   * @param positionReport - the position to check
   * @param secondaryOrderID - the specified secondary order id
   * @return
   */
  public boolean isOpenedByOrder(PositionReport positionReport, String secondaryOrderID)
  {
    try
    {
      // return true if the secondary order id is equal to the secondary order id of the position report
      return positionReport.getString(SecondaryClOrdID.FIELD).equalsIgnoreCase(secondaryOrderID);
    }
    catch (FieldNotFound e)
    {
      // catch and process FieldNotFound errors
    }
    // the field was not found, so the ticket does not have the specified order id
    return false;
  }
  
  /**
   * Retrieve the positions for the specified account and add them to the positions list
   * 
   * @param account
   */
  public void getPositions(Account account)
  {
    getPositions(accounts.get(account), new PosReqType(PosReqType.POSITIONS));
  }
  
//END SECTION - public trading functions

  
  public MyApp(SessionSettings settings)
  {
    this.settings = settings;
    try
    {
      this.userName = settings.getString("username");
      this.userPassword = settings.getString("password");
      this.userPin = settings.getDefaultProperties().getProperty("pin", null);
    }
    catch (Exception e)
    {
      e.printStackTrace();
    }
    
    accounts = new HashMap<Account, CollateralReport>();
    orders = new HashMap<OrderID, ExecutionReport>();
    positions = new HashMap<String, PositionReport>();
    instruments = new HashMap<String, MarketDataSnapshotFullRefresh>();
  }
  
  /**
   * Retrieve and add to map a list of trading accounts under the current login
   */
  private void getAccounts()
  {
    // create a new collateral inquiry request
    CollateralInquiry request = new CollateralInquiry();
    // assign a new id from generated number list to the current request
    colInquiryID = new CollInquiryID(String.valueOf(nextID()));
    // assign the inquiry id to the request
    request.set(colInquiryID);
    // set the subscription type to get the snapshot and all updates
    request.set(new SubscriptionRequestType(SubscriptionRequestType.SNAPSHOT_PLUS_UPDATES));
    // set the state that the request has not been completed
    requestCompleted = false;
    // send the request to the api
    send(request);
  }

  /**
   * Force a refresh of current positions, depending on whether they are open () or closed ()
   * during this session
   * 
   * @param account
   * @param positionType
   */
  private void getPositions(CollateralReport account, PosReqType positionType)
  {
    try {
      // create a new request for positions
      RequestForPositions request = new RequestForPositions();
      // 
      request.addGroup(account.getGroup(1, new CollateralReport.NoPartyIDs()));
      // set the subscription to updates to the current snapshot and updates to send refresh messages
      request.set(new SubscriptionRequestType(SubscriptionRequestType.SNAPSHOT_PLUS_UPDATES));
      // set the type of request, PosReqType(PosReqType.TRADES) for closed and PosReqType(PosReqType.POSITIONS) for open
      request.set(positionType);
      // set the account to retrieve the positions from 
      request.set(account.getAccount());
      // set the time for the transaction to now for the current data
      request.set(new TransactTime(new Date()));
      // set the date for the position reports to the current date for fresh data 
      request.set(new ClearingBusinessDate(getDate()));
      // set the type of account, by default FXCM has ACCOUNT_IS_CARRIED_ON_NON_CUSTOMER_SIDE_OF_BOOKS_AND_IS_CROSS_MARGINED
      request.set(new AccountType(AccountType.ACCOUNT_IS_CARRIED_ON_NON_CUSTOMER_SIDE_OF_BOOKS_AND_IS_CROSS_MARGINED));
      // set a new request for positions id 
      request.set(new PosReqID(String.valueOf(nextID())));
      // set the state that the request has not been completed
      requestCompleted = false;
      // send the request to the api
      send(request);
    }
    catch (Exception aException)
    {
      aException.printStackTrace();
    }
  }
  
  /**
   * Retrieve a formated string value of the current date in UTC
   * 
   * @return - a String formated date
   */
  private String getDate()
  {
    String year = String.valueOf(calendarUTC.get(Calendar.YEAR));
    int iMonth = calendarUTC.get(Calendar.MONTH) + 1;
    String month = iMonth <= 9 ? "0" + iMonth : String.valueOf(iMonth);
    int iDay = calendarUTC.get(Calendar.DAY_OF_MONTH);
    String day = iDay <= 9 ? "0" + iDay : String.valueOf(iDay);
    return year + month + day;
  }
  
  /**
   * Retrieve the next request counter
   * 
   * @return - a Long value for the current request counter
   */
  private synchronized long nextID()
  {
    // increment the local long id counter
    requestID++;
    // if the long request id is nearing Long.MAX_VALUE 
    if (requestID > 0x7FFFFFF0)
    {
      // reset back to one
      requestID = 1;
    }
    // return the new request id
    return requestID;
  }

  /**
   * Send the message to the api
   * 
   * @param aMessage - generic message to be sent to the api
   */
  private void send(Message aMessage)
  {
    try
    {
      // send the message to the api on the current session id
      Session.sendToTarget(aMessage, sessionID);
    }
    catch (Exception aException)
    {
      // notify console if there was any error
      aException.printStackTrace();
    } 
  }
  
  /**
   * Retrieve current market status. Used as part of the login procedure
   * 
   * @param aSubscriptionRequestType - type of subscription to apply for
   */
  private void sendMarketDataRequest(char aSubscriptionRequestType)
  {
    try
    {
      SubscriptionRequestType subReqType = new SubscriptionRequestType(aSubscriptionRequestType);
      MarketDataRequest mdr = new MarketDataRequest();
      mdr.set(new MDReqID(String.valueOf(nextID())));
      mdr.set(subReqType);
      mdr.set(new MarketDepth(1)); //Top of Book is only choice
      mdr.set(new MDUpdateType(MDUpdateType.FULL_REFRESH));
      
      MarketDataRequest.NoMDEntryTypes types = new MarketDataRequest.NoMDEntryTypes();
      types.set(new MDEntryType(MDEntryType.BID));
      mdr.addGroup(types);
      
      types = new MarketDataRequest.NoMDEntryTypes();
      types.set(new MDEntryType(MDEntryType.OFFER));
      mdr.addGroup(types);
      
      types = new MarketDataRequest.NoMDEntryTypes();
      types.set(new MDEntryType(MDEntryType.TRADING_SESSION_HIGH_PRICE));
      mdr.addGroup(types);
      
      types = new MarketDataRequest.NoMDEntryTypes();
      types.set(new MDEntryType(MDEntryType.TRADING_SESSION_LOW_PRICE));
      mdr.addGroup(types);
      
      int max = sessionStatus.getField(new IntField(NoRelatedSym.FIELD)).getValue();
      for (int i = 1; i <= max; i++)
      {
        SecurityList.NoRelatedSym relatedSym = new SecurityList.NoRelatedSym();
        SecurityList.NoRelatedSym group = (SecurityList.NoRelatedSym) sessionStatus.getGroup(i,
          relatedSym);
        MarketDataRequest.NoRelatedSym symbol = new MarketDataRequest.NoRelatedSym();
        symbol.set(group.getInstrument());
        mdr.addGroup(symbol);
        SecurityStatusReqID id = new SecurityStatusReqID(String.valueOf(nextID()));
        SecurityStatusRequest ssr = new SecurityStatusRequest(id, subReqType);
        ssr.set(group.getInstrument());
        send(ssr);
      }
      send(mdr);
    }
    catch (FieldNotFound aFieldNotFound)
    {
      aFieldNotFound.printStackTrace();
    }
  }
  
  /**
   * Sends a market order to the FIX api
   */
  public void sendMarketOrder(Account account, Side side, String symbol)
  throws FieldNotFound
  {
    // set up a multiplier for the lot size
    int lotValue = 10000;
    // if the symbol to be traded is the US Dollar, the multiplier should be 1
    if(symbol.equalsIgnoreCase("USDOLLAR")) lotValue = 1;
    // send the market order
    sendMarketOrder(sessionID, accounts.get(account), side, instruments.get(symbol).getSymbol(),
      new OrderQty(instruments.get(symbol).getDouble(FXCMMinQuantity) * lotValue),
      new TimeInForce(TimeInForce.GOOD_TILL_CANCEL));
  }
  
  /**
   * Sends a market order to the FIX api
   * 
   * @param sessionID - current session ID
   * @param account - the account on which the order is to be placed
   * @param side - the direction, Buy or Sell
   * @param symbol - instrument for the order
   * @param orderQty - the lot size or amount of the order
   * @param timeInForce
   * @throws FieldNotFound
   */
  public void sendMarketOrder(SessionID sessionID, CollateralReport account,
    Side side, Symbol symbol, OrderQty orderQty, TimeInForce timeInForce)
    throws FieldNotFound
  {
    // create a new order with an new temporary id, Side, new transaction time and set type as OrdType.MARKET
    NewOrderSingle order = new NewOrderSingle(
      new ClOrdID(sessionID + "-" + System.currentTimeMillis() + "-" + Long.toString(nextID())),
      new Side(side.getValue()),
      new TransactTime(),
      new OrdType(OrdType.MARKET));
    // set the account for the order
    order.set(account.getAccount());
    // set the symbol
    order.set(symbol);
    // set the lot size or amount of the order
    order.set(orderQty);
    // set the time in force for the order
    order.set(timeInForce);
    // add a text as the secondary temporary order id
    order.set(new SecondaryClOrdID(FIXAPITEST));
    // 
    requestCompleted = false;
    // send the order to the api
    send(order, sessionID);
  }

  /**
   * Send a message to the api for the specified session id
   * 
   * @param message
   * @param sessionID
   */
  public void send(Message message, SessionID sessionID)
  {
    // attempt to send an order to the api
    try
    {
      // send the order to the api
      Session.sendToTarget(message, sessionID);
    }
    // capture any errors in execution
    catch (Exception e)
    {
      // display error messages and continue application run
      e.printStackTrace();
    } 
  }

  /**
   * Sends the final step in the account login process, the UserRequest sets the
   * pin for the account to establish authenticated status.
   */
  public void sendUserRequest()
  {
    // create a new user request
    UserRequest ur = new UserRequest();
    // assign a new request id to the user request
    ur.setString(UserRequestID.FIELD, String.valueOf(nextID()));
    // apply the username to the user request
    ur.setString(Username.FIELD, userName);
    // apply the username to the passwrd request
    ur.setString(Password.FIELD, userPassword);
    // if the user has a pin assigned
    if (userPin != null)
    {
      // create a new group with the custom FXCM fields
      Group params = new Group(FXCMNoParam, FXCMParamName);
      // assign the parameter name as PIN
      params.setString(FXCMParamName, "PIN");
      // assign the value of the PIN as the users pin number
      params.setString(FXCMParamValue, userPin);
      // add the group to the user request
      ur.addGroup(params);
    }
    // set the request type to the FXCM custom value REQUEST_LIST_OF_TRADING_SESSIONS
    ur.setInt(UserRequestType.FIELD, REQUEST_LIST_OF_TRADING_SESSIONS);
    // sent the request to the api
    send(ur);
  }


//START SECTION - quickfix.Application implementation  
  /**
   * This callback notifies you when an administrative message is sent from a counterparty to your FIX engine.
   * This can be usefull for doing extra validation on logon messages such as for checking passwords. Throwing
   * a RejectLogon exception will disconnect the counterparty.
   */
  public void fromAdmin(Message aMessage, SessionID sessionID)
  {
    try {
      // attempt to process the message through the MessageCracker root object
      // and send the result through the onMessage functions
      crack(aMessage, sessionID);
    }
    catch (Exception e)
    {
      // catch and process the unsupported message type, field not found, and
      // incorrect tag values errors
    }
  }

  /**
   * This is one of the core entry points for your FIX application. Every application level request will come
   * through here. If, for example, your application is a sell-side OMS, this is where you will get your new
   * order requests. If you were a buy side, you would get your execution reports here. If a FieldNotFound
   * exception is thrown, the counterparty will receive a reject indicating a conditionally required field is
   * missing. The Message class will throw this exception when trying to retrieve a missing field, so you will
   * rarely need the throw this explicitly. You can also throw an UnsupportedMessageType exception. This will
   * result in the counterparty getting a reject informing them your application cannot process those types of
   * messages. An IncorrectTagValue can also be thrown if a field contains a value that is out of range or you
   * do not support.
   */
  public void fromApp(Message aMessage, SessionID sessionID)
  {
    try
    {
      // attempt to process the message through the MessageCracker root object
      // and send the result through the onMessage functions
      crack(aMessage, sessionID);
    }
    catch (Exception e)
    {
      // catch and process the unsupported message type, field not found, and
      // incorrect tag values errors
    }
  }
  
  /**
   * This callback provides you with a peak at the administrative messages that are being sent from your FIX
   * engine to the counter party. This is normally not useful for an application however it is provided for
   * any logging you may wish to do. Notice that the FIX::Message is not const. This allows you to add fields
   * before an adminstrative message before it is sent out.
   */
  public void toAdmin(Message aMessage, SessionID sessionID) { }
  
  /**
   * This is a callback for application messages that you are being sent to a counterparty. If you throw a
   * DoNotSend exception in this function, the application will not send the message. This is mostly useful if
   * the application has been asked to resend a message such as an order that is no longer relevant for the
   * current market. Messages that are being resent are marked with the PossDupFlag in the header set to true;
   * If a DoNotSend exception is thrown and the flag is set to true, a sequence reset will be sent in place of
   * the message. If it is set to false, the message will simply not be sent. Notice that the FIX::Message is
   * not const. This allows you to add fields before an application message before it is sent out.
   */
  public void toApp(Message aMessage, SessionID sessionID) { }
  
  /**
   * This method is called when quickfix creates a new session. A session comes into and remains in existence
   * for the life of the application. Sessions exist whether or not a counter party is connected to it. As soon
   * as a session is created, you can begin sending messages to it. If no one is logged on, the messages will be
   * sent at the time a connection is established with the counterparty.
   */
  public void onCreate(SessionID sessionID)
  {
    // the session has been created, but no login yet, so we save the sessionID
    this.sessionID = sessionID;
  }
  
  /**
   * This callback notifies you when a valid logon has been established with a counter party. This is called
   * when a connection has been established and the FIX logon process has completed with both parties exchanging
   * valid logon messages.
   */
  public void onLogon(SessionID sessionID)
  {
    // process message that the sessionID has started login process
    System.out.println("Login begun for " + this.userName);
    // set the time that the current logged in session started
    sessionStart = new Date();
    // configure and sent a UserRequest to complete login procedure
    sendUserRequest();
  }
  
  /**
   * This callback notifies you when an FIX session is no longer online. This could happen during a normal
   * logout exchange or because of a forced termination or a loss of network connection.
   */
  public void onLogout(SessionID sessionID)
  {
    // process message that the sessionID has been logged out
    System.out.println("Logged out " + this.userName);
  }
//END SECTION - quickfix.Application implementation


//START SECTION - extension of quickfix.fix44.MessageCracker
  /**
   * Retrieve and process the user requests. Initially part of the login process
   */
  public void onMessage(UserResponse response, SessionID sessionID)
     throws FieldNotFound
  {
    // check to see if the credentials used have allowed the first step to login
    if (response.getInt(UserStatus.FIELD) == UserStatus.LOGGED_IN)
    {
      // create a new trading session request
      TradingSessionStatusRequest msg = new TradingSessionStatusRequest();
      // set the request id to the next request counter
      msg.set(new TradSesReqID("TSSR REQUEST ID " + nextID()));
      // set the subscription type to current snapshot 
      msg.set(new SubscriptionRequestType(SubscriptionRequestType.SNAPSHOT_PLUS_UPDATES));
      // send the message to the api
      send(msg);
    }
  }

  /**
   * Retrieve and process the requests for collateral reports on this session, adding
   * each to the internal map
   */
  public void onMessage(CollateralReport report, SessionID sessionID)
     throws FieldNotFound
  {
    try
    {
      // wait until there is free access to add or modify the accounts map
      synchronized (accounts)
      {
        // add the account to the map of reports, replacing with the newest collateral report
        accounts.put(report.getAccount(), report);
      }
      // set the flag for whether the request is completed if a batch of collateral reports were requested
      requestCompleted = report.getBoolean(FXCMLastReportRequested);
    }
    catch(Exception e) 
    {
      // ignore FXCMLastReportRequested errors, since they occur when/if a single report was requested
    }
  }
  
  /**
   * Process market data snapshots, taking from each message the instrument update and adding to the 
   * internal map
   */
  public void onMessage(MarketDataSnapshotFullRefresh snapshot, SessionID sessionID)
  {
    try
    {
      // wait until there is free access to add or modify the instruments map
      synchronized(instruments)
      {
        // add the instrument and the market snapshot to the internal map
        instruments.put(snapshot.getInstrument().getSymbol().getValue(), snapshot);
      }
    }
    catch (Exception e)
    {
      // catch and process field not found error
    }
  }

  /**
   * Process the Execution reports, adding them to the internal orders map
   */
  public void onMessage(ExecutionReport report, SessionID sessionID)
     throws FieldNotFound
  {
    // wait until there is free access to add or modify the orders map
    synchronized (orders)
    {
      // add the order to the map of orders, replacing with the newest execution report
      orders.put(report.getOrderID(), report);
    }
    // capture any new positions that may have executed because of this order
    getPositions(report.getAccount());
    requestCompleted = true;
  }
  
  /**
   * Process the Position reports, adding them to the internal positoins map
   */
  public void onMessage(PositionReport report, SessionID sessionID)
  {
    try
    {
      // if the position report is about a position that is closed
      if(report.getPosReqType().valueEquals(PosReqType.TRADES))
      {
        // wait until there is free access to add or modify the positions map
        synchronized(positions)
        {
          // remove it from the positions list
          positions.remove(report.getString(FXCMPosID));
        }
      }
      // otherwise
      else
      {
        // wait until there is free access to add or modify the positions map
        synchronized(positions)
        {
          // add it to the positions list
          positions.put(report.getString(FXCMPosID), report);
        }
      }
    }
    catch (Exception e)
    {
      // catch and process the field not found error
    }
    // set the state that the request has not been completed
    requestCompleted = true;
  }

  /**
   * Capture and process the trading session status updates, part of the login process
   */
  public void onMessage(TradingSessionStatus status, SessionID sessionID)
  {
    // take the received session status as the internal status
    sessionStatus = status;
    // assuming the login process is complete
    System.out.println("Login complete for " + this.userName);
    try
    {
      // request and collect all accounts under login
      getAccounts();
      // request update on the market data, subscribing to all updates
      sendMarketDataRequest(SubscriptionRequestType.SNAPSHOT_PLUS_UPDATES);
    }
    catch (Exception e)
    {
      // catch and process field not found errors
    }
  }
//END SECTION - extension of quickfix.fix44.MessageCracker
} 