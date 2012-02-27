package com.aaronprj.entities.efields;

import com.aaronprj.common.enums.ExchangeType;

public class Ticker  implements Comparable<Ticker>{

	private String ticker;
	private String company;
	private String sector;
	private String industry;
	private String country;
	private String makretCap;
	private String pe;
	private Double price;
	private Double valueChange;
	private String change;
	private Double percentageChange;
	private Double volume;
	private ExchangeType exchangeType;
	
	public String getTicker() {
		return ticker;
	}
	public void setTicker(String ticker) {
		this.ticker = ticker;
	}
	public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
	}
	public String getSector() {
		return sector;
	}
	public void setSector(String sector) {
		this.sector = sector;
	}
	public String getIndustry() {
		return industry;
	}
	public void setIndustry(String industry) {
		this.industry = industry;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getMakretCap() {
		return makretCap;
	}
	public void setMakretCap(String makretCap) {
		this.makretCap = makretCap;
	}
	public String getPe() {
		return pe;
	}
	public void setPe(String pe) {
		this.pe = pe;
	}
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	public Double getValueChange() {
		return valueChange;
	}
	public void setValueChange(Double valueChange) {
		this.valueChange = valueChange;
	}
	public String getChange() {
		return change;
	}
	public void setChange(String change) {
		this.change = change;
	}
	public Double getPercentageChange() {
		return percentageChange;
	}
	public void setPercentageChange(Double percentageChange) {
		this.percentageChange = percentageChange;
	}
	public Double getVolume() {
		return volume;
	}
	public void setVolume(Double volume) {
		this.volume = volume;
	}
	public ExchangeType getExchangeType() {
		return exchangeType;
	}
	public void setExchangeType(ExchangeType exchangeType) {
		this.exchangeType = exchangeType;
	}

	@Override
	public int compareTo(Ticker o) {
		return o.getTicker().compareTo(this.getTicker());
	}
	
}
