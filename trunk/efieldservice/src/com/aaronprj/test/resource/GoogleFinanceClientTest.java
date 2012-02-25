package com.aaronprj.test.resource;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;

public class GoogleFinanceClientTest {

	public void theTest() {
		try {

			Client client = Client.create();

			WebResource webResource = client.resource("http://www.google.com/ig/api?stock=AAPL&stock=GOOG");

			ClientResponse response = webResource.accept("application/json").get(ClientResponse.class);

//			WebResource webResource = client.resource("http://localhost:8080/RESTfulExample/rest/json/metallica/post");
//			String input = "{\"singer\":\"Metallica\",\"title\":\"Fade To Black\"}";
//			ClientResponse response = webResource.type("application/json").post(ClientResponse.class, input);

			if (response.getStatus() != 200) {
				throw new RuntimeException("Failed : HTTP error code : " + response.getStatus());
			}

			String output = response.getEntity(String.class);

			System.out.println("Output from Server .... \n");
			System.out.println(output);

		} catch (Exception e) {

			e.printStackTrace();

		}

		System.out.println("test success");
	}

}
