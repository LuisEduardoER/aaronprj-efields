package com.aaronprj.entities.efields;

import com.aaronprj.common.enums.OrderType;
import com.aaronprj.common.enums.PriceType;

public class TradingEntity {

	private String ticker;
	private long quantity;
	private double price;
	
	private OrderType orderType;
	private PriceType priceType;
	
	public String getTicker() {
		return ticker;
	}
	public void setTicker(String ticker) {
		this.ticker = ticker;
	}
	public long getQuantity() {
		return quantity;
	}
	public void setQuantity(long quantity) {
		this.quantity = quantity;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	public OrderType getOrderType() {
		return orderType;
	}
	public void setOrderType(OrderType orderType) {
		this.orderType = orderType;
	}
	public PriceType getPriceType() {
		return priceType;
	}
	public void setPriceType(PriceType priceType) {
		this.priceType = priceType;
	}
}
