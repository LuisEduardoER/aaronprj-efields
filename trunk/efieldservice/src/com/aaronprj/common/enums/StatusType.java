package com.aaronprj.common.enums;

public enum StatusType {
	OPEN(0,"Open"),
	HOLD(1,"Hold");
	
	private int value;
	private String displayName;
	
	
	StatusType(int value, String displayName){
		this.value = value;
		this.displayName = displayName;
		
	}

	public int getValue() {
		return value;
	}


	public String getDisplayName() {
		return displayName;
	}

}
