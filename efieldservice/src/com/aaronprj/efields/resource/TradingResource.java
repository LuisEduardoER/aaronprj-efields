package com.aaronprj.efields.resource;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.aaronprj.common.enums.OrderStatus;
import com.aaronprj.common.enums.PriceType;
import com.aaronprj.common.utils.CommonEntityManager;
import com.aaronprj.common.web.resource.ResourceServices;
import com.aaronprj.efields.dataservice.DataFactory;
import com.aaronprj.entities.efields.Account;
import com.aaronprj.entities.efields.QuoteFeed;
import com.aaronprj.entities.efields.TradingEntity;
import com.aaronprj.entities.efields.TradingOrder;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;

@Path("/trading")
public class TradingResource extends ResourceServices{

	@Path("/trade/{quote}/{qty}/{price}/{priceType}/{sessionid}")
	@POST 
	@Produces(MediaType.APPLICATION_JSON)
    public String placeOrder(@PathParam("quote") String quote,
    		@PathParam("qty") long qty,
    		@PathParam("price") double price,
    		@PathParam("priceType") String priceType,
    		@PathParam("sessionid") String sessionid) {

		Account account = DataFactory.getAccount(sessionid);
		
		TradingEntity te = new TradingEntity();
		te.setTicker(quote);
		te.setQuantity(qty);
		te.setPrice(price);
		te.setPriceType(PriceType.valueOf(priceType));
		
		
		TradingOrder tr = new TradingOrder();
		tr.setTradEntity(te);
		tr.setAmount(price*qty);
		tr.setTradingDate(new Date());
		if(te.getPriceType().equals(PriceType.MARKET)){
			tr.setStatus(OrderStatus.EXECUTED);
		}else{
			tr.setStatus(OrderStatus.OPEN);
		}
		
		CommonEntityManager.save(account);
		//account;
		DataFactory.addOnlineMember(sessionid, account);
        
    	return this.writeValueAsString(generateResult());
    }

	@SuppressWarnings("unchecked")
	@Path("/portfolio/{sessionid}")
    @GET 
	@Produces(MediaType.APPLICATION_JSON)
    public String getPortfolio(@PathParam("sessionid") String sessionid) {

    	Account account = DataFactory.getAccount(sessionid);
    	String responseMsg = "";
    	if(null != account){
    		Map<String,TradingOrder> pmap = new HashMap<String,TradingOrder>();
	    	String qstr = "";
	    	if(null != account.getProtfolios() && account.getProtfolios().isEmpty()){

		    	for(TradingOrder to:account.getProtfolios()){
		    		pmap.put(to.getTradEntity().getTicker(), to);
		    		if("".equals(qstr)){
		        		qstr = to.getTradEntity().getTicker();
		    		}else{
		    			qstr += ","+to.getTradEntity().getTicker();
		    		}
		    	}
		    	
				Client client = Client.create();
				WebResource webRes = client.resource("http://www.google.com/finance/info?infotype=infoquoteall&q="+qstr);
		        responseMsg = webRes.get(String.class).replaceAll("/", "").replaceAll("\\\\","");
		        List<QuoteFeed> quotes = toObject(responseMsg, List.class);
		        for(QuoteFeed qf : quotes){
		        	pmap.get(qf.getT()).setQuote(qf);
		        }
	    	}
	        
	    	return this.writeValueAsString(generateResult(pmap.values()));
    	}
        return this.writeValueAsString(generateResult(null));
    }
}
