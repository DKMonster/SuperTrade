package com.supertrade.dkcode;

import com.fxcore2.O2GSession;
import com.fxcore2.O2GTransport;

public class Logout {

	public static void main(String[] args) {
		
		// Connection and session variables
        String mUserID = "";
        String mPassword = "";
        String mURL = "";
        String mConnection = "";
        String mDBName = "";
        String mPin = "";  

        O2GSession mSession = null;

        // Check for correct number of arguments
        if (args.length < 4) {
            System.out.println("Not Enough Parameters!");
            System.out.println("USAGE: [user ID] [password] [URL] [connection] [session ID (if needed)] [pin (if needed)]");
            System.exit(1);
        }

        // Get command line arguments
        mUserID = args[0];
        mPassword = args[1];
        mURL = args[2];
        mConnection = args[3];
        if (args.length > 4) {
            mDBName = args[4];
        }
        if (args.length > 5) {
            mPin = args[5];
        }

        // Create a session, subscribe to session listener, login, get accounts, logout
        try {
            mSession = O2GTransport.createSession();
            SessionStatusListener statusListener = new SessionStatusListener(mSession, mDBName, mPin);
            mSession.subscribeSessionStatus(statusListener);
            mSession.logout();
            while (!statusListener.isConnected() && !statusListener.hasError()) {
                    Thread.sleep(50);
            }
            mSession.unsubscribeSessionStatus(statusListener);
            mSession.dispose();
        } catch (Exception e) {
            System.out.println ("Exception: " + e.getMessage());
            System.exit(1);
        }
	}

}
