package com.aaronprj.efields.dataservice;

import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.aaronprj.common.enums.ExchangeType;
import com.aaronprj.common.enums.TickerClassType;
import com.aaronprj.common.utils.NumberUtil;
import com.aaronprj.common.utils.ParseCSVFile;
import com.aaronprj.entities.efields.Ticker;

public class DataFactory {

	private static ScheduledExecutorService scheduler;

	private static ConcurrentHashMap<String,Ticker> maptickers = new ConcurrentHashMap<String,Ticker>();

	private static ConcurrentHashMap<TickerClassType,List<Ticker>> amexTopMarkets = new ConcurrentHashMap<TickerClassType,List<Ticker>>();
	private static ConcurrentHashMap<TickerClassType,List<Ticker>> nasdaqTopMarkets = new ConcurrentHashMap<TickerClassType,List<Ticker>>();
	private static ConcurrentHashMap<TickerClassType,List<Ticker>> nyseTopMarkets = new ConcurrentHashMap<TickerClassType,List<Ticker>>();


	public static void initDataFactory(){

		System.out.println("initDataFactory...");
		long vInitialDelayTiming = 1;
		long vDelayTiming = 60;
		scheduler = Executors.newScheduledThreadPool(1);
		scheduler.scheduleWithFixedDelay(new Runnable() {

			public void run() {
				retreiveExchangeData();
				
			}
		}, vInitialDelayTiming, vDelayTiming, TimeUnit.MINUTES);
		
		
	}
	
	public static void retreiveExchangeData(){
			try {
				

				maptickers.clear();

				System.out.println("DataFactory retreiveExchangeData...");


				//http://www.finviz.com/export.ashx?v=111&f=exch_amex
				//http://www.finviz.com/export.ashx?v=111&f=exch_nasd
				//http://www.finviz.com/export.ashx?v=111&f=exch_nyse
		        URL url = new URL("http://www.finviz.com/export.ashx?v=111&f=exch_amex");
		        InputStream is = url.openStream();
				System.out.println(ExchangeType.AMEX.toString() + " Online File Loaded:"+(new Date()).toString());
				List<Ticker> tickers = ParseCSVFile.parseOnlineCSVTicker(is, ExchangeType.AMEX);
				System.out.println("Online File Readed:"+(new Date()).toString());

				refreshingChanges(tickers, ExchangeType.AMEX);
				url = null;
				is = null;
				
				
				url = new URL("http://www.finviz.com/export.ashx?v=111&f=exch_nasd");
		        is = url.openStream();
				System.out.println(ExchangeType.NASDAQ.toString() + " Online File Loaded:"+(new Date()).toString());
				tickers = ParseCSVFile.parseOnlineCSVTicker(is, ExchangeType.NASDAQ);
				System.out.println("Online File Readed:"+(new Date()).toString());

				refreshingChanges(tickers, ExchangeType.NASDAQ);
				url = null;
				is = null;
				
				url = new URL("http://www.finviz.com/export.ashx?v=111&f=exch_nyse");
		        is = url.openStream();
				System.out.println(ExchangeType.NYSE.toString() + " Online File Loaded:"+(new Date()).toString());
				tickers = ParseCSVFile.parseOnlineCSVTicker(is, ExchangeType.NYSE);
				System.out.println("Online File Readed:"+(new Date()).toString());

				refreshingChanges(tickers, ExchangeType.NYSE);
				url = null;
				is = null;
				
				//topMarkets.clear();
				
				//LOG.info("--- refreshDataVersion() taked......" + ((new Date()).getTime() - b.getTime()));
			} catch (Exception ex) {
				System.out.println(ex.getMessage());
			}
	}
	
	public static void refreshingChanges(List<Ticker> tickers, ExchangeType exchangeType){

		List<Ticker> topactives = new ArrayList<Ticker>();
		List<Ticker> topgainers = new ArrayList<Ticker>();
		List<Ticker> toplosers = new ArrayList<Ticker>();
		List<Ticker> topgainermoneys = new ArrayList<Ticker>();
		List<Ticker> toplosermoneys = new ArrayList<Ticker>();
		
		try {
			for(Ticker ticker:tickers){

				if(null != ticker.getChange() && !"".equals(ticker.getChange()) && null != ticker.getPrice()){
					try {
						Double changePercentage = Double.parseDouble(ticker.getChange().trim().replaceAll("%", ""))/100; 
						Double changeValue = ticker.getPrice() /(1- changePercentage) - ticker.getPrice(); 

						ticker.setValueChange(NumberUtil.format4Decimal(changeValue));
						ticker.setPercentageChange(NumberUtil.format4Decimal(changePercentage));
						
					} catch (Exception e) {
						System.out.println("Exception on:"+ticker.getTicker() + "["+ticker.getChange() + ","+ ticker.getPrice()+"]");
						e.printStackTrace();
					}
				}else{
					ticker.setValueChange((double) 0);
					ticker.setPercentageChange((double) 0);
				}
				
				try {
					insertObj(ticker, topactives, TickerClassType.ACTIVES);
					insertObj(ticker, topgainers, TickerClassType.GAINERS);
					insertObj(ticker, toplosers, TickerClassType.LOSERS);
					insertObj(ticker, topgainermoneys, TickerClassType.GAINERMONEY);
					insertObj(ticker, toplosermoneys, TickerClassType.LOSERMONEY);
				} catch (Exception e) {
					e.printStackTrace();
				}


				maptickers.put(ticker.getTicker(), ticker);
				
			}

			switch (exchangeType) {
				case AMEX :
					amexTopMarkets.clear();
					
					amexTopMarkets.put(TickerClassType.ACTIVES, topactives);
					amexTopMarkets.put(TickerClassType.GAINERS, topgainers);
					amexTopMarkets.put(TickerClassType.LOSERS, toplosers);
					amexTopMarkets.put(TickerClassType.GAINERMONEY, topgainermoneys);
					amexTopMarkets.put(TickerClassType.LOSERMONEY, toplosermoneys);
					break;
				case NASDAQ:
					nasdaqTopMarkets.clear();
					
					nasdaqTopMarkets.put(TickerClassType.ACTIVES, topactives);
					nasdaqTopMarkets.put(TickerClassType.GAINERS, topgainers);
					nasdaqTopMarkets.put(TickerClassType.LOSERS, toplosers);
					nasdaqTopMarkets.put(TickerClassType.GAINERMONEY, topgainermoneys);
					nasdaqTopMarkets.put(TickerClassType.LOSERMONEY, toplosermoneys);
					
					break;
				case NYSE:
					nyseTopMarkets.clear();
					
					nyseTopMarkets.put(TickerClassType.ACTIVES, topactives);
					nyseTopMarkets.put(TickerClassType.GAINERS, topgainers);
					nyseTopMarkets.put(TickerClassType.LOSERS, toplosers);
					nyseTopMarkets.put(TickerClassType.GAINERMONEY, topgainermoneys);
					nyseTopMarkets.put(TickerClassType.LOSERMONEY, toplosermoneys);

					break;
				default:
					break;
			
			}
		} catch (NumberFormatException e) {
			e.printStackTrace();
		}catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	private static void insertObj(Ticker ticker, List<Ticker> topTickers, TickerClassType classType){

		
		
		if(topTickers.size() == 0){
			topTickers.add(ticker);
		}else{
			if(isInsertBefore(ticker,topTickers,classType, 0)){
				topTickers.add(0,ticker);
			}else if(topTickers.size() < 20){
				for(int i=0;i<topTickers.size();i++){
					if(isInsertBefore(ticker,topTickers,classType, i)){
						topTickers.add(i,ticker);
						break;
					}else if(i == topTickers.size()){
						topTickers.add(ticker);
						break;
					}
				}
			}
			
			while(topTickers.size() > 20){
				topTickers.remove(20);
			}
		}
	}
	
	private static boolean isInsertBefore(Ticker ticker, List<Ticker> topTickers, TickerClassType classType, int index){

		boolean isInsert = false;
		Ticker topticker = topTickers.get(index);
		
		if(TickerClassType.ACTIVES.equals(classType) && null != ticker.getVolume()){
			isInsert = ticker.getVolume().compareTo(topticker.getVolume()) > 0;
		}else if(null != ticker.getPercentageChange() && null != topticker.getPercentageChange()){ 
			
			if(TickerClassType.GAINERS.equals(classType)){
				isInsert = ticker.getPercentageChange().compareTo(topticker.getPercentageChange()) > 0;
			}else if(TickerClassType.LOSERS.equals(classType)){
				isInsert = ticker.getPercentageChange().compareTo(topticker.getPercentageChange()) < 0;
			}
		}else if(null != ticker.getValueChange() && null != topticker.getValueChange()){ 
			
			if(TickerClassType.GAINERMONEY.equals(classType)){
				isInsert = ticker.getValueChange().compareTo(topticker.getValueChange()) > 0;
			}else if(TickerClassType.LOSERMONEY.equals(classType)){
				isInsert = ticker.getValueChange().compareTo(topticker.getValueChange()) < 0;
			}
		}
		return isInsert;
	}
	public static List<Ticker> getTopTickers(ExchangeType exchangeType, TickerClassType classType){
		switch (exchangeType) {
			case AMEX :
				if(amexTopMarkets.isEmpty()){
					retreiveExchangeData();
				}
				return amexTopMarkets.get(classType);
			case NASDAQ:
				if(nasdaqTopMarkets.isEmpty()){
					retreiveExchangeData();
				}
				return nasdaqTopMarkets.get(classType);
			case NYSE:
				if(nyseTopMarkets.isEmpty()){
					retreiveExchangeData();
				}
				return nyseTopMarkets.get(classType);
			default:
				break;
		
		}
		return null;
	}

	public static List<Ticker> getTickers(String quote){
		if(maptickers.isEmpty()){
			retreiveExchangeData();
		}

		List<Ticker> selectedTickers = new ArrayList<Ticker>();
		for(Ticker t : maptickers.values()){
			if(t.getTicker().startsWith(quote)){
				selectedTickers.add(t);
			}
		}
		
		Collections.sort(selectedTickers);
		
		return selectedTickers;
	}
	
	
}
