import quickfix.DefaultMessageFactory;
import quickfix.FileLogFactory;
import quickfix.FileStoreFactory;
import quickfix.LogFactory;
import quickfix.MessageFactory;
import quickfix.MessageStoreFactory;
import quickfix.SessionSettings;
import quickfix.SocketInitiator;
import quickfix.field.Account;
import quickfix.field.Side;
import quickfix.field.Symbol;
import quickfix.fix44.PositionReport;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.Set;

/**
 * Edit of FIXTradingTester.java
 * 
 * Separated MyApp to separate file and altered program flow
 */
public class FIXTradingTester
{
  public static void main(String[] args)
  {
    if (args.length == 1)
    {
      String config = args[0];
      FileInputStream fileInputStream = null;
      try
      {
        fileInputStream = new FileInputStream(config);
        SessionSettings settings = new SessionSettings(fileInputStream);
        fileInputStream.close();
        MyApp app = new MyApp(settings);
        MessageStoreFactory storeFactory = new FileStoreFactory(settings);
        LogFactory logFactory = new FileLogFactory(settings);
        MessageFactory messageFactory = new DefaultMessageFactory();
        SocketInitiator initiator = new SocketInitiator(app, storeFactory, settings, logFactory, messageFactory);
        initiator.start();
        System.out.println("Enter 't' to trade, all else to quit");
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        Thread.sleep(5000);
        while (true)
        {
          String str = in.readLine();
          if("t".equalsIgnoreCase(str.trim()))
            runExample(app);
          else
            break;
        }
        initiator.stop(true);
      }
      catch (Exception e)
      {
        e.printStackTrace();
      }
      finally
      {
        if (fileInputStream != null)
        {
          try
          {
            fileInputStream.close();
          }
          catch (Exception e)
          {
            e.printStackTrace();
          }
        }
      }
    }
    else
    {
      System.out.println("Error: Supply configuration file");
    }
  }
  
  public static void runExample(MyApp application)
  {
    // assume all details to login have been made
    try
    {
      application.resetPositionsExecuted();
      System.out.println("Begining trading");
      while(!application.getRequestCompleted()) { }
      // get accounts
      Set<Account> accounts = application.getAccts();
      // get instruments
      Set<String> instruments = application.getInstruments();
      // foreach account
      for(int a = 0; a < accounts.size(); a++)
      {
        Account account = (Account)accounts.toArray()[a];
        // foreach instrument
        for(int i = 0; i < instruments.size(); i++)
        {
          String instrument = (String) instruments.toArray()[i];
          // send market order to buy for account minimum
          application.sendMarketOrder(account, new Side(Side.SELL), instrument);
          while(!application.getRequestCompleted()) { }
        }
      }
      // wait
      Thread.sleep(5000);
      while(!application.getRequestCompleted()) {System.out.print(".");}
      for(int a = 0; a < accounts.size(); a++)
      {
        Account account = (Account)accounts.toArray()[a];
        application.getPositions(account);
      }
      // get all the open and opened the position
      Set<String> positions = application.getPositionsExecuted();
      // for each position
      for(int i = 0; i < positions.size(); i++)
      {
        String position = (String)positions.toArray()[i];
        // retrieve a position report
        PositionReport positionReport = application.getPositionReport(position);
        // if the position was opened by the application, the secondary order id should be FIXAPITEST
        if(application.isOpenedByOrder(positionReport, MyApp.FIXAPITEST))
        {
          // send market order to sell for position size
          application.sendMarketOrder(positionReport.getAccount(), new Side(Side.BUY), positionReport.get(new Symbol()).getValue());
          while(!application.getRequestCompleted()) { }
        }
      }
    }
    catch (Exception e)
    {
    }
    System.out.println("Done trading");
  }
} 