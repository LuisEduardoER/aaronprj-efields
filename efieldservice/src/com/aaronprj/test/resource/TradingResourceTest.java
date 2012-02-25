package com.aaronprj.test.resource;

import org.junit.Test;

public class TradingResourceTest extends ResourceTestBase {

	public TradingResourceTest() throws Exception {
        super();

		//if first time login,,have to initial the user data
		//SystemInitialHelper.createUsers();
	}


	//Test
    public void testWatchList() throws Exception {

        String responseMsg = webResource.path("/trading/portfolio/951283cd-f500-4758-a5da-ec5d3aa9cb1e").get(String.class);

        System.out.println("1 portfolio ===============================================================================================================");
        System.out.println(""+responseMsg);
        
		
	}
}
