package com.aaronprj.test.resource;

import java.io.IOException;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.test.framework.JerseyTest;
import com.sun.jersey.test.framework.WebAppDescriptor;

public class ResourceTestBase  extends JerseyTest {

	static ObjectMapper mapper;
	static WebResource webResource;
	public ResourceTestBase() throws Exception {
        super(new WebAppDescriptor.Builder("com.aaronprj.efields.resource").contextPath("efields").servletPath("resource").build());
        if(null == mapper){
            mapper = new ObjectMapper();
        }
        if(null == webResource){
            webResource = resource();
        }
	}


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
}
