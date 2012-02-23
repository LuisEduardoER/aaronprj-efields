package com.aaronprj.efields.resource;

import org.junit.Test;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;

public class MarketDataResourceTest extends ResourceTestBase {

	public MarketDataResourceTest() throws Exception {
        super();

		//if first time login,,have to initial the user data
		//SystemInitialHelper.createUsers();
	}

	@Test
    public void testTickers() throws Exception {
		Client client = Client.create();
		WebResource webRes = client.resource("http://www.google.com/finance/info?infotype=infoquoteall&q=C,APPL,AIG,BAC");
		
        String responseMsg = webRes.get(String.class);

        System.out.println("1 testTickers ===============================================================================================================");
        System.out.println(""+responseMsg);
		
	}

	//Test
    public void testWatchList() throws Exception {

        String responseMsg = webResource.path("/market/watchlist/11111").get(String.class);

        System.out.println("1 testWatchList ===============================================================================================================");
        System.out.println(""+responseMsg);
        
		
	}
}
