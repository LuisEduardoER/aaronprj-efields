package com.aaronprj.efields.resource;

import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.aaronprj.common.enums.TickerClassType;
import com.aaronprj.common.web.resource.ResourceServices;
import com.aaronprj.efields.dataservice.DataFactory;
import com.aaronprj.entities.efields.Ticker;


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
}
