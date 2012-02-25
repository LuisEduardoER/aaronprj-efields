package com.aaronprj.common.utils;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.aaronprj.entities.efields.Account;
import com.aaronprj.entities.efields.User;

public class SystemInitializeUtil {
	
	public static void initUsers(){
		
    	User u = new User();
    	u.setAddress("");
    	u.setFirstName("firstName");
    	u.setPassword("password");
    	u.setUserName("userName");
    	
    	CommonEntityManager.save(u);
    	
    	Account act = new Account();
    	act.setUser(u);
    	act.setAccountCode("AC");
    	act.setCashValue(10000);
    	act.setMarketValue(500);
    	act.setNetValue(10000);
    	act.setTotalGain(0);
    	List<String> wls = new ArrayList<String>();
    	wls.add("AAPL");
    	wls.add("GOOG");
    	wls.add("C");
    	wls.add("BAC");
    	wls.add("HP");
    	wls.add("BQI");

    	act.setWatchList(wls);

    	CommonEntityManager.save(act);
    	
    	u = new User();
    	u.setAddress("");
    	u.setFirstName("firstName1");
    	u.setPassword("password");
    	u.setUserName("userName1");

    	CommonEntityManager.save(u);

    	act.setUser(u);
    	act.setAccountCode("AC1");
    	act.setCashValue(10500);
    	act.setMarketValue(500);
    	act.setNetValue(10500);
    	act.setTotalGain(0);

    	wls.add("F");
    	wls.add("INTC");
    	wls.add("EBAY");

    	act.setWatchList(wls);
    	CommonEntityManager.save(act);
	}
	
	
	public static void initTickers(){

		try {

			System.out.println("Started:"+(new Date()).toString());
			URLConnection conn = new URL("http://www.finviz.com/export.ashx?v=111").openConnection();
			InputStream is = conn.getInputStream();
			System.out.println("Online File Loaded:"+(new Date()).toString());
			
			ParseCSVFile.parseOnlineCSVTicker(is, true);

			System.out.println("Online File Readed:"+(new Date()).toString());
			
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
}
