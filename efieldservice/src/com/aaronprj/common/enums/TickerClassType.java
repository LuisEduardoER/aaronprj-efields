package com.aaronprj.common.enums;

public enum TickerClassType {
	ACTIVES("Actives"),
	GAINERS("% Gainers"),
	LOSERS("% Losers "),
	GAINERMONEY("$ Gainers"),
	LOSERMONEY("$ Losers ");
	
	private String value;
	
	TickerClassType(String value){
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
