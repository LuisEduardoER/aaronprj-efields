package com.aaronprj.efields.resource;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.aaronprj.common.enums.TickerClassType;
import com.aaronprj.common.utils.CommonEntityManager;
import com.aaronprj.common.web.resource.ResourceServices;
import com.aaronprj.efields.dataservice.DataFactory;
import com.aaronprj.entities.efields.Account;
import com.aaronprj.entities.efields.QuoteFeed;
import com.aaronprj.entities.efields.Ticker;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;


@Path("/market")
public class MarketDataResource extends ResourceServices{
	
	@Path("/tickers/{classtype}")
    @GET 
	@Produces(MediaType.APPLICATION_JSON)
    public String getMarketTickers(@PathParam("classtype") String classtype) {
    	
		List<Ticker> tickers = DataFactory.getTopTickers(TickerClassType.valueOf(classtype.trim().toUpperCase()));

    	if(null == tickers || tickers.isEmpty()){
            return this.writeValueAsString(generateResult(null));
    	}

    	return this.writeValueAsString(generateResult(tickers));
    }
	
	@SuppressWarnings("unchecked")
	@Path("/watchlist/{sessionid}")
    @GET 
	@Produces(MediaType.APPLICATION_JSON)
    public String getWatchList(@PathParam("sessionid") String sessionid) {

    	Account account = DataFactory.getAccount(sessionid);
    	String responseMsg = "";
    	if(null != account){
	    	String qstr = "";
	    	for(String q:account.getWatchList()){
	    		if("".equals(qstr)){
	        		qstr = q;
	    		}else{
	    			qstr += ","+q;
	    		}
	    	}
	
			Client client = Client.create();
			WebResource webRes = client.resource("http://www.google.com/finance/info?infotype=infoquoteall&q="+qstr);
			
	        responseMsg = webRes.get(String.class).replaceAll("/", "").replaceAll("\\\\","");

	        List<QuoteFeed> quotes = toObject(responseMsg, List.class);
	        
	    	return this.writeValueAsString(generateResult(quotes));
    	}
        return this.writeValueAsString(generateResult(null));
    }

	@SuppressWarnings("unchecked")
	@Path("/quotes/{quote}")
    @GET 
	@Produces(MediaType.APPLICATION_JSON)
    public String getQuotes(@PathParam("quote") String quote) {

			Client client = Client.create();
			WebResource webRes = client.resource("http://www.google.com/finance/info?infotype=infoquoteall&q="+quote);
			
	        String responseMsg = webRes.get(String.class).replaceAll("/", "").replaceAll("\\\\","");

	        List<QuoteFeed> quotes = toObject(responseMsg, List.class);
	        
	    	return this.writeValueAsString(generateResult(quotes));
    }
	

	@Path("/addwatch/{quote}/{sessionid}")
	@POST 
	@Produces(MediaType.APPLICATION_JSON)
    public String addWatch(@PathParam("quote") String quote,@PathParam("sessionid") String sessionid) {

		Account account = DataFactory.getAccount(sessionid);
		if(null == account.getWatchList()){
			account.setWatchList(new ArrayList<String>());
		}
		account.getWatchList().add(quote);

		CommonEntityManager.save(account);
        
    	return this.writeValueAsString(generateResult());
    }

	@Path("/removewatch/{quote}/{sessionid}")
	@POST 
	@Produces(MediaType.APPLICATION_JSON)
    public String removeWatch(@PathParam("quote") String quote,@PathParam("sessionid") String sessionid) {

		Account account = DataFactory.getAccount(sessionid);
		if(null != account.getWatchList()){
			account.getWatchList().remove(quote);
			CommonEntityManager.save(account);
		}
        
    	return this.writeValueAsString(generateResult());
    }
	
}
