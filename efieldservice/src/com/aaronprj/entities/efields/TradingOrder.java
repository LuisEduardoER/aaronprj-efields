package com.aaronprj.entities.efields;

import java.util.Date;

import com.aaronprj.common.enums.OrderStatus;
import com.aaronprj.common.utils.NumberUtil;

public class TradingOrder {

	private QuoteFeed quote;
	private TradingEntity tradEntity;

	private OrderStatus status;
	
	private double paidAmount;
	private double gainer;
	private double totalGainer;
	private double totalGainerP;
	private double marketValue;
	private Date tradingDate;
	
	public void calculateGain(){
		double lastPrice = Double.parseDouble(quote.getL());
		double change = Double.parseDouble(quote.getC());
		double totalchange = this.tradEntity.getPrice() - lastPrice;
		
		double daygain = change * this.tradEntity.getQuantity();
		double totalgain = totalchange * this.tradEntity.getQuantity();
		double totalgainp = totalgain / paidAmount;
		double mvalue = lastPrice * this.tradEntity.getQuantity();
		
		this.gainer = NumberUtil.format2Decimal(daygain);
		this.totalGainer = NumberUtil.format2Decimal(totalgain);
		this.totalGainerP = NumberUtil.format4Decimal(totalgainp*100);
		this.marketValue = NumberUtil.format2Decimal(mvalue);
		
	}
	
	public QuoteFeed getQuote() {
		return quote;
	}
	public void setQuote(QuoteFeed quote) {
		this.quote = quote;
		calculateGain();
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

	public double getPaidAmount() {
		return paidAmount;
	}

	public void setPaidAmount(double paidAmount) {
		this.paidAmount = paidAmount;
	}

	public double getGainer() {
		return gainer;
	}
	public void setGainer(double gainer) {
		this.gainer = gainer;
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

	public double getMarketValue() {
		return marketValue;
	}

	public void setMarketValue(double marketValue) {
		this.marketValue = marketValue;
	}
	

	

}
