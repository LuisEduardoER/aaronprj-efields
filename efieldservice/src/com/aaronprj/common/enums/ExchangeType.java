package com.aaronprj.common.enums;

public enum ExchangeType {
	NYSE("NYSE"),
	NASDAQ("NASDAQ"),
	AMEX("AMEX");
	
	private String value;
	
	ExchangeType(String value){
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
