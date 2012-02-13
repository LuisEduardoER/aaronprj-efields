package com.aaronprj.common.enums;

public enum TermType {
	GOODFORTODAY("GOODFORTODAY"),
	GOODFORWEEK("GOODFORWEEK");
	
	private String value;
	
	TermType(String value){
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
