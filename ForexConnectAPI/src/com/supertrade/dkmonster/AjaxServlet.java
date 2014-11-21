package com.supertrade.dkmonster;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import com.supertrade.dkmonster.getInfo;
import com.supertrade.dkmonster.getOffers;
import com.supertrade.dkmonster.getTrade;
import com.supertrade.dkmonster.getAccount;

/**
 * Servlet implementation class AjaxServlet
 */
@WebServlet("/AjaxServlet")
public class AjaxServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */

	Object[] listData_getOffers;
	Object[] listData_getTrade;
	Object[] listData_getNews;
	
	int backData = 0;
	
	Map<String, Object> responseData_getAccount = new HashMap<String, Object>();
	Map<String, Object> responseData_getInfo = new HashMap<String, Object>();
	Map<String, Object> responseData_createEntryOrder = new HashMap<String, Object>();
	Map<String, Object> responseData_createEntry = new HashMap<String, Object>();
   
   
    public AjaxServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String json = "";
        if(br != null){
            json = br.readLine();
        }
        
        ObjectMapper mapper = new ObjectMapper();
        
        getAccount account = mapper.readValue(json, getAccount.class);

		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
		response.setHeader("Access-Control-Max-Age", "3600");
		response.setHeader("Access-Control-Allow-Headers", "x-requested-with");
        response.setContentType("application/json");
        
        responseData_getAccount.clear();
        responseData_getInfo.clear();
        responseData_createEntryOrder.clear();        

        if(account.getloadType().equals("getAccount")){
        	
        	backData = 1;
        	
        	responseData_getAccount.put("userId" , account.getUserId());
        	responseData_getAccount.put("pwd" , account.getPwd());
        	responseData_getAccount.put("url" , account.getUrl());
        	responseData_getAccount.put("con" , account.getCon());
            
            
        }else if(account.getloadType().equals("getInfo")){
        	
        	backData = 2;
        	
        	String[] accountData = new String[4];
        	
        	accountData[0] = account.getUserId();
        	accountData[1] = account.getPwd();
        	accountData[2] = account.getUrl();
        	accountData[3] = account.getCon();
        	
        	responseData_getInfo = getInfo.main(accountData);
        
        }else if(account.getloadType().equals("getOffers")){

        	backData = 3;
        	
        	String[] accountData = new String[5];
        	
        	accountData[0] = account.getInstrument();
        	accountData[1] = account.getUserId();
        	accountData[2] = account.getPwd();
        	accountData[3] = account.getUrl();
        	accountData[4] = account.getCon();
        	
        	listData_getOffers = getOffers.main(accountData);
       
        }else if(account.getloadType().equals("getTrade")){
        	
        	backData = 4;
        	
        	String[] accountData = new String[4];
        	
        	accountData[0] = account.getUserId();
        	accountData[1] = account.getPwd();
        	accountData[2] = account.getUrl();
        	accountData[3] = account.getCon();
        	
        	listData_getTrade = getTrade.main(accountData);
        	
        }else if(account.getloadType().equals("getNews")){
        	
        	backData = 5;
        	
        	String[] accountData = new String[4];
        	
        	accountData[0] = account.getUserId();
        	accountData[1] = account.getPwd();
        	accountData[2] = account.getUrl();
        	accountData[3] = account.getCon();
        	
        	listData_getNews = getNews.main(accountData);
        	
        }else if(account.getloadType().equals("createEntry")){
        	
        	backData = 6;
        	
        	String[] accountData = new String[8];
        	
        	accountData[0] = account.getInstrument();
        	accountData[1] = account.getAmount();
        	accountData[2] = account.getbuysell();
        	accountData[3] = account.getRate();
        	accountData[4] = account.getUserId();
            accountData[5] = account.getPwd();
            accountData[6] = account.getUrl();
            accountData[7] = account.getCon();
            
            responseData_createEntry = createEntry.main(accountData);

        }
        
        try {
        	if(backData == 1) {
            	mapper.writeValue(response.getOutputStream(), responseData_getAccount);
        	}else if(backData == 2) {
            	mapper.writeValue(response.getOutputStream(), responseData_getInfo);
        	}else if(backData == 3) {
            	mapper.writeValue(response.getOutputStream(), listData_getOffers);
        	}else if(backData == 4) {
            	mapper.writeValue(response.getOutputStream(), listData_getTrade);
        	}else if(backData == 5) {
            	mapper.writeValue(response.getOutputStream(), listData_getNews);
        	}else if(backData == 6) {
            	mapper.writeValue(response.getOutputStream(), responseData_createEntry);
        	}
        } catch (JsonGenerationException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (JsonMappingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        
        
	}

}
