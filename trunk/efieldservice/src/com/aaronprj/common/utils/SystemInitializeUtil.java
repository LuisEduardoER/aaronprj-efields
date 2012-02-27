package com.aaronprj.common.utils;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.aaronprj.common.enums.ExchangeType;
import com.aaronprj.entities.efields.Account;
public class SystemInitializeUtil {
	
	public static void initUsers(){

    	Account act = new Account();
    	act.setAddress("");
    	act.setFirstName("firstName");
    	act.setPassword("pass");
    	act.setUserName("user");
    	
    	act.setAccountCode("AC-00001");
    	act.setCashValue(1000000);
    	act.setMarketValue(1000000);
    	act.setNetValue(1000000);
    	act.setTotalGain(0);
    	List<String> wls = new ArrayList<String>();
    	wls.add("AAPL");
    	wls.add("GOOG");
    	wls.add("C");
    	wls.add("BAC");
    	wls.add("HP");
    	wls.add("BQI");
    	wls.add("F");
    	wls.add("INTC");
    	wls.add("EBAY");

    	act.setWatchList(wls);
    	CommonEntityManager.save(act);
	}
	
	
	public static void initTickers(){

		try {

//			//google app engine
//		    URLFetchService fetcher = URLFetchServiceFactory.getURLFetchService();
//
//		    URL dataURL = new URL("http://www.finviz.com/export.ashx?v=111");
//		    HTTPRequest fetchreq = new HTTPRequest(dataURL);
//		    HTTPResponse fetchresp = fetcher.fetch(fetchreq);
//		    System.out.println("Response Code: " + fetchresp.getResponseCode());
//		    //new String(fetchresp.getContent());
//		    InputStream is = new ByteArrayInputStream(fetchresp.getContent());
//		    
		    

			System.out.println("Started:"+(new Date()).toString());
//			URLConnection conn = new URL("http://www.finviz.com/export.ashx?v=111").openConnection();
//			InputStream is = conn.getInputStream();

			//http://www.finviz.com/export.ashx?v=111&f=exch_amex
			//http://www.finviz.com/export.ashx?v=111&f=exch_nasd
			//http://www.finviz.com/export.ashx?v=111&f=exch_nyse
            URL url = new URL("http://www.finviz.com/export.ashx?v=111&f=exch_amex");
            InputStream is = url.openStream();
			System.out.println(ExchangeType.AMEX.toString() + " Online File Loaded:"+(new Date()).toString());
			ParseCSVFile.parseOnlineCSVTicker(is, ExchangeType.AMEX);
			System.out.println("Online File Readed:"+(new Date()).toString());
			
			url = new URL("http://www.finviz.com/export.ashx?v=111&f=exch_nasd");
            is = url.openStream();
			System.out.println(ExchangeType.NASDAQ.toString() + " Online File Loaded:"+(new Date()).toString());
			ParseCSVFile.parseOnlineCSVTicker(is, ExchangeType.NASDAQ);
			System.out.println("Online File Readed:"+(new Date()).toString());
			
			url = new URL("http://www.finviz.com/export.ashx?v=111&f=exch_nyse");
            is = url.openStream();
			System.out.println(ExchangeType.NYSE.toString() + " Online File Loaded:"+(new Date()).toString());
			ParseCSVFile.parseOnlineCSVTicker(is, ExchangeType.NYSE);
			System.out.println("Online File Readed:"+(new Date()).toString());
			
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
}
