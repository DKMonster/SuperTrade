package com.supertrade.dkcode;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

/**
 * Servlet implementation class AjaxServlet
 */
@WebServlet(
		urlPatterns = { "/AjaxServlet" }, 
		initParams = { 
				@WebInitParam(name = "default", value = "This is a default value")
		})
public class AjaxServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    Map<String, Object> responseData = new HashMap<String, Object>();
    
    public AjaxServlet() {
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
        
        response.setContentType("application/json");
        
        responseData.clear();
        
        if(account.getloadType().equals("getAccount")){
        	
        	responseData.put("loadType", account.getloadType());
            responseData.put("userId" , account.getUserId());
            responseData.put("pwd" , account.getPwd());
            responseData.put("url" , account.getUrl());
            responseData.put("con" , account.getCon());
            
            System.out.println(responseData);
            
        }else if(account.getloadType().equals("getInfo")){
        	
        	String[] accountData = new String[4];
        	
        	accountData[0] = account.getUserId();
        	accountData[1] = account.getPwd();
        	accountData[2] = account.getUrl();
        	accountData[3] = account.getCon();
        	
        	responseData = getInfo.main(accountData);
        	
        	responseData.put("loadType", account.getloadType());
            
            System.out.println(responseData);
        }
        
        try {
        	mapper.writeValue(response.getOutputStream(), responseData);
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
