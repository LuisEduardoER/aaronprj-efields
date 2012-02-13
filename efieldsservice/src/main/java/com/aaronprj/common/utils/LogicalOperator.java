package com.aaronprj.common.utils;

public enum LogicalOperator {
	AND("AND"),OR("OR");
	
	private String value;
	
	LogicalOperator(String value){
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
