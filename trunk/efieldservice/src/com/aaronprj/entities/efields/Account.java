package com.aaronprj.entities.efields;

import java.util.ArrayList;
import java.util.List;

import com.aaronprj.common.enums.OrderStatus;
import com.aaronprj.common.enums.OrderType;
import com.aaronprj.common.utils.NumberUtil;

public class Account implements Cloneable{


	private String sessionId;
	private String userName;
	private String password;
	private String firstName;
	private String email;
	private String address;
	private String postCode;
	private String phoneNumber;
	
	private String accountCode;
	private AccountPreferences accountPreferences;
	private List<String> watchList;
	private List<Message> messages;
	private List<TradingOrder> protfolios;
	private List<TradingOrder> tradingOrders;
	private List<TradingOrder> pendingOrders;
	
	private double netValue;
	private double marketValue;
	private double totalGain;
	private double cashValue;
	
	public void addTradingOrder(TradingOrder to){
		if(null == tradingOrders){
			tradingOrders = new ArrayList<TradingOrder>();
		}
		if(null == protfolios){
			protfolios = new ArrayList<TradingOrder>();
		}
		if(null == pendingOrders){
			pendingOrders = new ArrayList<TradingOrder>();
		}
		tradingOrders.add(to);
		if(OrderStatus.EXECUTED.equals(to.getStatus())){
			protfolios.add(to);
			if(OrderType.BUY.equals(to.getTradEntity().getOrderType())){
				this.netValue -= to.getPaidAmount();
				
			}else{
				this.netValue += to.getPaidAmount();
			}
			this.netValue = NumberUtil.format2Decimal(this.netValue);
		}else if(OrderStatus.OPEN.equals(to.getStatus())){
			pendingOrders.add(to);
		}
	}
	

	public List<TradingOrder> getPendingOrders() {
		return pendingOrders;
	}

	public void setPendingOrders(List<TradingOrder> pendingOrders) {
		this.pendingOrders = pendingOrders;
	}

	public String getSessionId() {
		return sessionId;
	}


	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}


	public String getUserName() {
		return userName;
	}


	public void setUserName(String userName) {
		this.userName = userName;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}


	public String getFirstName() {
		return firstName;
	}


	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}


	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public String getAddress() {
		return address;
	}


	public void setAddress(String address) {
		this.address = address;
	}


	public String getPostCode() {
		return postCode;
	}


	public void setPostCode(String postCode) {
		this.postCode = postCode;
	}


	public String getPhoneNumber() {
		return phoneNumber;
	}


	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}


	public String getAccountCode() {
		return accountCode;
	}
	public void setAccountCode(String accountCode) {
		this.accountCode = accountCode;
	}
	public AccountPreferences getAccountPreferences() {
		return accountPreferences;
	}
	public void setAccountPreferences(AccountPreferences accountPreferences) {
		this.accountPreferences = accountPreferences;
	}
	public List<String> getWatchList() {
		return watchList;
	}
	public void setWatchList(List<String> watchList) {
		this.watchList = watchList;
	}
	public List<Message> getMessages() {
		return messages;
	}
	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}
	public List<TradingOrder> getProtfolios() {
		return protfolios;
	}
	public void setProtfolios(List<TradingOrder> protfolios) {
		this.protfolios = protfolios;
	}
	public List<TradingOrder> getTradingOrders() {
		return tradingOrders;
	}
	public void setTradingOrders(List<TradingOrder> tradingOrders) {
		this.tradingOrders = tradingOrders;
	}
	public double getNetValue() {
		return netValue;
	}
	public void setNetValue(double netValue) {
		this.netValue = netValue;
	}
	public double getMarketValue() {
		return marketValue;
	}
	public void setMarketValue(double marketValue) {
		this.marketValue = marketValue;
	}
	public double getTotalGain() {
		return totalGain;
	}
	public void setTotalGain(double totalGain) {
		this.totalGain = totalGain;
	}
	public double getCashValue() {
		return cashValue;
	}
	public void setCashValue(double cashValue) {
		this.cashValue = cashValue;
	}
	
	
	
}
