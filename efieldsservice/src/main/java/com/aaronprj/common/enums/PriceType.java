package com.aaronprj.common.enums;

public enum PriceType {
	MARKET("MARKET"),
	LIMIT("LIMIT");
	
	private String value;
	
	PriceType(String value){
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
