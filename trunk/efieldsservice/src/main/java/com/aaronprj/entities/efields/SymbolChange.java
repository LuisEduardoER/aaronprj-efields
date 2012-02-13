package com.aaronprj.entities.efields;

public class SymbolChange {

	private double lastPrice;
	private double changeValue;
	private double changePercentage;
	private double bidPrice;
	private long bidSize;
	private double askPrice;
	private long askSize;
	private double lowestPrice;
	private double highestPrice;
	private double volume;
	
	
	public double getLastPrice() {
		return lastPrice;
	}
	public void setLastPrice(double lastPrice) {
		this.lastPrice = lastPrice;
	}
	public double getChangeValue() {
		return changeValue;
	}
	public void setChangeValue(double changeValue) {
		this.changeValue = changeValue;
	}
	public double getChangePercentage() {
		return changePercentage;
	}
	public void setChangePercentage(double changePercentage) {
		this.changePercentage = changePercentage;
	}
	public double getBidPrice() {
		return bidPrice;
	}
	public void setBidPrice(double bidPrice) {
		this.bidPrice = bidPrice;
	}
	public long getBidSize() {
		return bidSize;
	}
	public void setBidSize(long bidSize) {
		this.bidSize = bidSize;
	}
	public double getAskPrice() {
		return askPrice;
	}
	public void setAskPrice(double askPrice) {
		this.askPrice = askPrice;
	}
	public long getAskSize() {
		return askSize;
	}
	public void setAskSize(long askSize) {
		this.askSize = askSize;
	}
	public double getLowestPrice() {
		return lowestPrice;
	}
	public void setLowestPrice(double lowestPrice) {
		this.lowestPrice = lowestPrice;
	}
	public double getHighestPrice() {
		return highestPrice;
	}
	public void setHighestPrice(double highestPrice) {
		this.highestPrice = highestPrice;
	}
	public double getVolume() {
		return volume;
	}
	public void setVolume(double volume) {
		this.volume = volume;
	}
	
	
}
