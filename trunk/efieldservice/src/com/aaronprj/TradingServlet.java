package com.aaronprj;

import com.aaronprj.efields.dataservice.DataFactory;
import com.sun.jersey.api.core.ResourceConfig;
import com.sun.jersey.spi.container.WebApplication;
import com.sun.jersey.spi.container.servlet.ServletContainer;
/**
 * Servlet implementation class for Servlet: WebServlet
 *
 */
public class TradingServlet extends ServletContainer {
	private static final long serialVersionUID = 1L;

	private static boolean isInit = false;
	private static Object lockObj = new Object();
	
    @Override
    protected void initiate(ResourceConfig rc, WebApplication wa) {
        try {
            wa.initiate(rc); //(rc, new SpringComponentProviderFactory(rc, getContext()));

    		if (isInit) return;
    		synchronized (lockObj) {
    			try {
    				DataFactory.initDataFactory();
    				isInit = true;
    				System.out.println("Finish initiate Trading Servlet!");
    			} catch (Exception ex) {
    				System.out.println("Failed to initiate Trading Servlet! error " + ex.getMessage());
    			}
    		}
    		
        } catch (RuntimeException e) {
        	System.out.println("Exception occurred when doing Trading Servlet intialization" + e.getMessage());
            throw e;
        }
    }
}