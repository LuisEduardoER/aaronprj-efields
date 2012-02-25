package com.aaronprj.entities.efields;

import java.util.ArrayList;
import java.util.List;

import com.aaronprj.common.enums.OrderStatus;

public class Account {

	private User user;
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
			this.netValue -= to.getAmount();
		}else if(OrderStatus.OPEN.equals(to.getStatus())){
			pendingOrders.add(to);
		}
	}
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
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
