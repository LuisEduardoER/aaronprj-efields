package com.aaronprj.common.utils;

import com.db4o.nativequery.expr.cmp.ComparisonOperator;

public class QueryParamter {

	private String fieldName;
	private Object fieldValue;
	private ComparisonOperator comparisonOperator;
	
	public QueryParamter(){};

	public QueryParamter(String fieldName,Object fieldValue, ComparisonOperator comparisonOperator){
		this.fieldName = fieldName;
		this.fieldValue = fieldValue;
		this.comparisonOperator = comparisonOperator;
	}

	public String getFieldName() {
		return fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	public Object getFieldValue() {
		return fieldValue;
	}

	public void setFieldValue(Object fieldValue) {
		this.fieldValue = fieldValue;
	}

	public ComparisonOperator getComparisonOperator() {
		return comparisonOperator;
	}

	public void setComparisonOperator(ComparisonOperator comparisonOperator) {
		this.comparisonOperator = comparisonOperator;
	}
	
	
}
