package com.aaronprj.entities.efields;

import java.util.Date;

import com.aaronprj.common.enums.OrderStatus;

public class TradingOrder {

	private Symbol symbol;
	private TradEntity tradEntity;

	private OrderStatus status;
	
	private double amount;
	private Date tradingDate;
	
	public Symbol getSymbol() {
		return symbol;
	}
	public void setSymbol(Symbol symbol) {
		this.symbol = symbol;
	}
	public TradEntity getTradEntity() {
		return tradEntity;
	}
	public void setTradEntity(TradEntity tradEntity) {
		this.tradEntity = tradEntity;
	}
	public OrderStatus getStatus() {
		return status;
	}
	public void setStatus(OrderStatus status) {
		this.status = status;
	}
	public double getAmount() {
		return amount;
	}
	public void setAmount(double amount) {
		this.amount = amount;
	}
	public Date getTradingDate() {
		return tradingDate;
	}
	public void setTradingDate(Date tradingDate) {
		this.tradingDate = tradingDate;
	}
	
}
