package com.aaronprj.efields.resource;

import java.util.Date;

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
import com.aaronprj.entities.efields.TradingEntity;
import com.aaronprj.entities.efields.TradingOrder;

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
		
		//account;

		CommonEntityManager.save(account);
        
    	return this.writeValueAsString(generateResult());
    }
}
