package com.aaronprj.entities.efields;

import java.util.List;

public class Account {

	private User user;
	private String accountCode;
	private AccountPreferences accountPreferences;
	private List<Message> messages;
	private List<TradingOrder> protfolios;
	private List<TradingOrder> tradingOrders;
	
	private double netValue;
	private double drawableValue;
	private double marketValue;
	private double totalGain;
	private double cashValue;
	
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
	public double getDrawableValue() {
		return drawableValue;
	}
	public void setDrawableValue(double drawableValue) {
		this.drawableValue = drawableValue;
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
