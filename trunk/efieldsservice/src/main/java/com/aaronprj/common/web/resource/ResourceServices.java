package com.aaronprj.common.web.resource;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import com.aaronprj.common.web.uivo.BaseEntity;
import com.sun.jersey.api.core.InjectParam;

public class ResourceServices {

	
	/**
	 * @param <T> 
	 * 
	 */
	@InjectParam
	protected ObjectMapper mapper;

	@Context UriInfo uriInfo; 
	@Context HttpServletRequest request;
	
	@SuppressWarnings("deprecation")
	public String getWebApplicationRealPath(String vfolder){
		
		System.out.println(request.getContextPath().toString());
		System.out.println(request.getLocalAddr().toString());
		System.out.println("request.getPathInfo():"+request.getPathInfo().toString());
		System.out.println("request.getPathTranslated():"+request.getPathTranslated().toString());
		System.out.println("request.getRealPath():"+request.getRealPath("").toString());
		System.out.println(request.getRemoteAddr().toString());
		System.out.println(request.getServletPath().toString());
		System.out.println(request.getRequestURL().toString());
		

		System.out.println("uriInfo.getPath:"+uriInfo.getPath().toString());
		System.out.println("uriInfo.getAbsolutePath():"+uriInfo.getAbsolutePath().toString());
		System.out.println("uriInfo.getBaseUri()"+uriInfo.getBaseUri().toString());
		

		String vpath = request.getPathTranslated().toString();
		vpath = vpath.substring(0,vpath.indexOf(request.getPathInfo().toString()));
		System.out.println("edited path:::"+vpath);
		vpath = vpath + File.separator + vfolder + File.separator;
		System.out.println("added folder path:::"+vpath);
		return vpath;
	}
	 
	public String writeValueAsString(Object entity) {
		try {
            if (mapper == null) mapper = new ObjectMapper();
			return mapper.writeValueAsString(entity);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return generateFailJSON("Error", "Unknow Error!");
	}
	/**
	 * @param <T> 
	 * 
	 */
	public <T> T toObject(String content, Class<T> valueType) {
		try {
			return mapper.readValue(content, valueType);
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	public String generateFailJSON(String msgcode,String message) {

		return "{\"id\":1105,\"success\":false,\"msgCode\":\"" + msgcode+"\",\"msgDiscription\":\"" + message+"\"}";
	}
	
	public static <T> BaseEntity<T> generateResult(boolean success, String msgCode, String msgDiscription, String sessionId) {
		BaseEntity<T> un  = new BaseEntity<T>();

		un.setSuccess(success);
		un.setMsgCode(msgCode);
		un.setMsgDiscription(msgDiscription);
		un.setSessionId(sessionId);
		
		return un;
	}

	public static <T> BaseEntity<T> generateResult(T entity) {
		BaseEntity<T> un  = generateResult(true, "success", "", "");
		un.setEntity(entity);
		return un;
	}

	public static <T> BaseEntity<T> generateResult(List<T> entities) {
		BaseEntity<T> un  = generateResult(true, "success", "", "");
		un.setEntities(entities);
		return un;
	}
	
    public UUID getSessionId(){
    	return UUID.randomUUID();
    	
    }

}
