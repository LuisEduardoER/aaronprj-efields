package com.aaronprj.entities.efields;

import com.aaronprj.common.enums.OrderType;
import com.aaronprj.common.enums.PriceType;
import com.aaronprj.common.enums.TermType;

public class TradEntity {

	private long quantity;
	private double price;
	
	private OrderType orderType;
	private PriceType priceType;
	private TermType termType;
	
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
	public TermType getTermType() {
		return termType;
	}
	public void setTermType(TermType termType) {
		this.termType = termType;
	}
	
	
	
}
