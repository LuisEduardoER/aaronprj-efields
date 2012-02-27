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
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.type.TypeReference;

import com.aaronprj.common.enums.OrderStatus;
import com.aaronprj.common.enums.OrderType;
import com.aaronprj.common.enums.PriceType;
import com.aaronprj.common.utils.CommonEntityManager;
import com.aaronprj.common.utils.NumberUtil;
import com.aaronprj.efields.dataservice.DataService;
import com.aaronprj.entities.efields.Account;
import com.aaronprj.entities.efields.QuoteFeed;
import com.aaronprj.entities.efields.TradingEntity;
import com.aaronprj.entities.efields.TradingOrder;
import com.db4o.ObjectContainer;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;

@Path("/trading")
public class TradingResource extends ResourceServices{

	@Path("/trade/{sessionid}")
	@POST 
	@Produces(MediaType.APPLICATION_JSON)
    public String placeOrder(@QueryParam("symbol") String symbol,
    		@QueryParam("quantity") long quantity,
    		@QueryParam("price") double price,
    		@QueryParam("priceType") String priceType,
    		@QueryParam("orderType") String orderType,
    		@PathParam("sessionid") String sessionid) {

		ObjectContainer objdb = CommonEntityManager.getObjectContainer();
		Account account = DataService.checkSession(sessionid,objdb);

		if(null != account){
		
			TradingEntity te = new TradingEntity();
			te.setTicker(symbol);
			te.setQuantity(quantity);
			te.setPrice(price);
			te.setPriceType(PriceType.valueOf(priceType));
			te.setOrderType(OrderType.valueOf(orderType));
			
			
			TradingOrder tr = new TradingOrder();
			tr.setTradEntity(te);
			tr.setPaidAmount(NumberUtil.format2Decimal(price*quantity));
			tr.setTradingDate(new Date());
			if(te.getPriceType().equals(PriceType.MARKET)){
				tr.setStatus(OrderStatus.EXECUTED);
			}else{
				tr.setStatus(OrderStatus.OPEN);
			}
			
			account.addTradingOrder(tr);
			
			objdb.store(account);
			objdb.commit();
	
		}
        
    	return this.writeValueAsString(generateResult());
    }

	@Path("/portfolio/{sessionid}")
    @GET 
	@Produces(MediaType.APPLICATION_JSON)
    public String getPortfolio(@PathParam("sessionid") String sessionid) {

    	String responseMsg = "";
		ObjectContainer objdb = CommonEntityManager.getObjectContainer();
		Account account = DataService.checkSession(sessionid,objdb);

		if(null != account){
    		Map<String,TradingOrder> pmap = new HashMap<String,TradingOrder>();
	    	String qstr = "";
	    	if(null != account.getProtfolios() && !account.getProtfolios().isEmpty()){

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

		        List<QuoteFeed> quotes = toObjects(responseMsg, new TypeReference<List<QuoteFeed>>() {});
		        for(QuoteFeed qf : quotes){
		        	pmap.get(qf.getT()).setQuote(qf);
		        }
	    	}
	    	
	    	return this.writeValueAsString(generateResult(pmap.values()));
    	}
        return this.writeValueAsString(generateResult(null));
    }
}
