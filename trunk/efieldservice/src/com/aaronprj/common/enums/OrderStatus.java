package com.aaronprj.common.enums;

public enum OrderStatus {
	NEW("NEW"),
	OPEN("OPEN"),
	EXECUTED("EXECUTED"),
	CANCELLED("CANCELLED"),
	EXPIRED("EXPIRED"),
	REJECTED("REJECTED");
	
	private String value;
	
	OrderStatus(String value){
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
