package com.aaronprj.entities.efields;

import java.util.Date;

import com.aaronprj.common.enums.OrderStatus;

public class TradingOrder {

	private Ticker ticker;
	private TradingEntity tradEntity;

	private OrderStatus status;
	
	private double amount;
	private double gainer;
	private double gainerP;
	private double totalGainer;
	private double totalGainerP;
	private Date tradingDate;
	
	public Ticker getTicker() {
		return ticker;
	}
	public void setTicker(Ticker ticker) {
		this.ticker = ticker;
	}
	public TradingEntity getTradEntity() {
		return tradEntity;
	}
	public void setTradEntity(TradingEntity tradEntity) {
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
	public double getGainer() {
		return gainer;
	}
	public void setGainer(double gainer) {
		this.gainer = gainer;
	}
	public double getGainerP() {
		return gainerP;
	}
	public void setGainerP(double gainerP) {
		this.gainerP = gainerP;
	}
	public double getTotalGainer() {
		return totalGainer;
	}
	public void setTotalGainer(double totalGainer) {
		this.totalGainer = totalGainer;
	}
	public double getTotalGainerP() {
		return totalGainerP;
	}
	public void setTotalGainerP(double totalGainerP) {
		this.totalGainerP = totalGainerP;
	}
	public Date getTradingDate() {
		return tradingDate;
	}
	public void setTradingDate(Date tradingDate) {
		this.tradingDate = tradingDate;
	}
	

	

}
