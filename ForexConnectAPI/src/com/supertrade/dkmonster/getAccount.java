package com.supertrade.dkmonster;

public class getAccount {
	private String loadType;
	private String userId , pwd , url = "http://www.fxcorporate.com/Hosts.jsp" , con , instrument;
	private String amount,rate,buysell, offerid;
	private String login,password,connection;
	//getters & setters 
	
	public String getofferid(){
		return offerid;
	}
	
	public void setofferid(String offerid){
		this.offerid = offerid;
	}
	
	public String getbuysell(){
		return buysell;
	}
	
	public void setbuysell(String buysell){
		this.buysell = buysell;
	}
	
	public String getPassword(){
		return password;
	}
	
	public void setPassword(String password){
		this.password = password;
	}

	
	public String getConnection(){
		return connection;
	}
	
	public void setConnection(String connection){
		this.connection = connection;
	}

	
	public String getLogin(){
		return login;
	}
	
	public void setLogin(String login){
		this.login = login;
	}
	
	public String getRate(){
		return rate;
	}
	
	public void setRate(String rate){
		this.rate = rate;
	}
	
	public String getAmount(){
		return amount;
	}
	
	public void setAmount(String amount){
		this.amount = amount;
	}
	
	public String getloadType(){
		return loadType;
	}
	
	public void setloadType(String loadType){
		this.loadType = loadType;
	}
	
	public String getUserId(){
		return userId;
	}
	
	public void setUserId(String userId){
		this.userId = userId;
	}
	
	public String getPwd(){
		return pwd;
	}
	
	public void setPwd(String pwd){
		this.pwd = pwd;
	}
	
	public String getUrl(){
		return url;
	}
	
	public void setUrl(String url){
		this.url = url;
	}
	
	public String getCon(){
		return con;
	}
	
	public void setCon(String con){
		this.con = con;
	}
	
	public String getInstrument(){
		return instrument;
	}
	
	public void setInstrument(String instrument){
		this.instrument = instrument;
	}
	
	@Override
	public String toString(){
		return "{\"userId\":\"" + userId + "\", \"pwd\":\"" + pwd + "\", \"url\":\"" + url + "\", \"con\":\"" + con + "\", \"amount\":\"" + amount + "\", \"rate\":\"" + rate + "\", \"buysell\":\"" + buysell + "\", \"instrument\":\"" + instrument + "\", \"login\":\"" + login + "\", \"password\":\"" + password + "\", \"connection\":\"" + connection + "\"}";
	}
}
