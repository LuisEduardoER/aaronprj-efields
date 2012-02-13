package com.aaronprj.common.utils;

import java.util.ArrayList;
import java.util.List;

public class QueryObject {

	private LogicalOperator logicalOperator;
	private List<QueryParamter> queryParamters;

	private List<QueryObject> queryObjects;
	
	public QueryObject(){}
	public QueryObject(LogicalOperator logicalOperator){
		this.logicalOperator = logicalOperator;
	}
	
	public void addQueryParamter(QueryParamter queryParamter){
		if(null == queryParamters){
			queryParamters = new ArrayList<QueryParamter>();
		}
		queryParamters.add(queryParamter);
	}
	
	public LogicalOperator getLogicalOperator() {
		return logicalOperator;
	}
	public void setLogicalOperator(LogicalOperator logicalOperator) {
		this.logicalOperator = logicalOperator;
	}
	public List<QueryParamter> getQueryParamters() {
		return queryParamters;
	}
	public void setQueryParamters(List<QueryParamter> queryParamters) {
		this.queryParamters = queryParamters;
	}
	public List<QueryObject> getQueryObjects() {
		return queryObjects;
	}
	public void setQueryObjects(List<QueryObject> queryObjects) {
		this.queryObjects = queryObjects;
	}

	
}
