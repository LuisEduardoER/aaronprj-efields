package com.aaronprj.entities.efields;

import java.util.Date;

public class Message {

	private String title;
	private String content;
	private boolean unreaded;
	private Date createDate;
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public boolean isUnreaded() {
		return unreaded;
	}
	public void setUnreaded(boolean unreaded) {
		this.unreaded = unreaded;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	
}
