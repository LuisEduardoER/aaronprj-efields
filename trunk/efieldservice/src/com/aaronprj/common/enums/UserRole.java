package com.aaronprj.common.enums;


public enum UserRole{
	Administrator(1,"Administrator"),
	Costumer(2,"Costumer");

	private int value;
	private String displayName;
	
	
	UserRole(int value, String displayName){
		this.value = value;
		this.displayName = displayName;
		
	}


	public String getDisplayName() {
		return displayName;
	}


	public int getValue() {
		return value;
	}

}
