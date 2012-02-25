package com.aaronprj.common.enums;

public enum OrderType {
	BUY("BUY"),SELL("SELL");
	
	private String value;
	
	OrderType(String value){
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
