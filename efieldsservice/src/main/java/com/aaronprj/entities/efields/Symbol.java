package com.aaronprj.entities.efields;

import java.util.Date;
import java.util.List;

import com.db4o.config.annotations.Indexed;

public class Symbol {

	@Indexed
	private String symbolCode;
	private String companyName;
	private SymbolChange change;

	private List<Message> messages;
	
	private double openPrice;
	private double previousPrice;
	private RangePrice rangePrice;
	
	private double avgVolume;
	private double marketCap;
	private double sharesOutstanding;
	private double beta;
	private double dividendYield;
	private Date nextEarningDate;
	private Date dividendDate;
	
	
	public String getSymbolCode() {
		return symbolCode;
	}
	public void setSymbolCode(String symbolCode) {
		this.symbolCode = symbolCode;
	}
	public String getCompanyName() {
		return companyName;
	}
	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}
	public SymbolChange getChange() {
		return change;
	}
	public void setChange(SymbolChange change) {
		this.change = change;
	}
	public List<Message> getMessages() {
		return messages;
	}
	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}
	public double getOpenPrice() {
		return openPrice;
	}
	public void setOpenPrice(double openPrice) {
		this.openPrice = openPrice;
	}
	public double getPreviousPrice() {
		return previousPrice;
	}
	public void setPreviousPrice(double previousPrice) {
		this.previousPrice = previousPrice;
	}
	public RangePrice getRangePrice() {
		return rangePrice;
	}
	public void setRangePrice(RangePrice rangePrice) {
		this.rangePrice = rangePrice;
	}
	public double getAvgVolume() {
		return avgVolume;
	}
	public void setAvgVolume(double avgVolume) {
		this.avgVolume = avgVolume;
	}
	public double getMarketCap() {
		return marketCap;
	}
	public void setMarketCap(double marketCap) {
		this.marketCap = marketCap;
	}
	public double getSharesOutstanding() {
		return sharesOutstanding;
	}
	public void setSharesOutstanding(double sharesOutstanding) {
		this.sharesOutstanding = sharesOutstanding;
	}
	public double getBeta() {
		return beta;
	}
	public void setBeta(double beta) {
		this.beta = beta;
	}
	public double getDividendYield() {
		return dividendYield;
	}
	public void setDividendYield(double dividendYield) {
		this.dividendYield = dividendYield;
	}
	public Date getNextEarningDate() {
		return nextEarningDate;
	}
	public void setNextEarningDate(Date nextEarningDate) {
		this.nextEarningDate = nextEarningDate;
	}
	public Date getDividendDate() {
		return dividendDate;
	}
	public void setDividendDate(Date dividendDate) {
		this.dividendDate = dividendDate;
	}
	
	
}
