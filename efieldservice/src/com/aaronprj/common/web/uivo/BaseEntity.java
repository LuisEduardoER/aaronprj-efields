/**
 * 
 */
package com.aaronprj.common.web.uivo;

import java.io.Serializable;
import java.util.List;


/**
 * @author Aaron.XIONG
 * @param <T>
 *
 */
public class BaseEntity<T> implements Serializable {
	private static final long serialVersionUID = 1L;

	private int id;
	private String msgCode;
	private String msgDiscription;
	private boolean success = true;
	private String sessionId;
	private T entity;
	private List<T> entities;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getMsgCode() {
		return msgCode;
	}
	public void setMsgCode(String msgCode) {
		this.msgCode = msgCode;
	}
	public String getMsgDiscription() {
		return msgDiscription;
	}
	public void setMsgDiscription(String msgDiscription) {
		this.msgDiscription = msgDiscription;
	}
	public boolean isSuccess() {
		return success;
	}
	public void setSuccess(boolean success) {
		this.success = success;
	}
	public String getSessionId() {
		return sessionId;
	}
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	public T getEntity() {
		return entity;
	}
	public void setEntity(T entity) {
		this.entity = entity;
	}
	public List<T> getEntities() {
		return entities;
	}
	public void setEntities(List<T> entities) {
		this.entities = entities;
	}



	
}
