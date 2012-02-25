package com.aaronprj.efields.dataservice;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.aaronprj.common.enums.TickerClassType;
import com.aaronprj.common.utils.CommonEntityManager;
import com.aaronprj.common.utils.SystemInitializeUtil;
import com.aaronprj.entities.efields.Account;
import com.aaronprj.entities.efields.QuoteFeed;
import com.aaronprj.entities.efields.Ticker;
import com.aaronprj.entities.efields.User;

public class DataFactory {

	private static ScheduledExecutorService scheduler;
	
	private static ConcurrentHashMap<String,String> onlineMemberKeys = new ConcurrentHashMap<String,String>();
	private static ConcurrentHashMap<String,Account> onlineMembers = new ConcurrentHashMap<String,Account>();
	
	private static ConcurrentHashMap<String,Ticker> maptickers = new ConcurrentHashMap<String,Ticker>();
	
	private static ConcurrentHashMap<TickerClassType,List<Ticker>> topMarkets = new ConcurrentHashMap<TickerClassType,List<Ticker>>();

	private static ConcurrentHashMap<String,QuoteFeed> quoteFeeds = new ConcurrentHashMap<String,QuoteFeed>();
	
	private static DecimalFormat decimalFormat = new DecimalFormat("#.0000");

	public static void initDataFactory(){
		
		int vtiming = 20;
		scheduler = Executors.newScheduledThreadPool(1);
		scheduler.scheduleWithFixedDelay(new Runnable() {
			public void run() {
				try {
					System.out.println("initDataFactory...");
					//Date b = new Date();
					SystemInitializeUtil.initTickers();
					
					maptickers.clear();
					topMarkets.clear();
					refreshingChanges();
					
					//LOG.info("--- refreshDataVersion() taked......" + ((new Date()).getTime() - b.getTime()));
				} catch (Exception ex) {
					System.out.println(ex.getMessage());
				}
			}
		}, vtiming, vtiming, TimeUnit.MINUTES);
		
		
	}
	
	public static boolean addQuoteFeed(QuoteFeed qf){
		
		quoteFeeds.put(qf.getT(), qf);
		
		return false;
	}
	
	public static void addOnlineMember(String sessionId,Account account){

		String osessionId = onlineMemberKeys.get(account.getAccountCode());
		if(null != osessionId){
			onlineMemberKeys.remove(account.getAccountCode());
			onlineMembers.remove(osessionId);
		}
		//update sessionid and account
		onlineMemberKeys.put(account.getAccountCode(),sessionId);
		onlineMembers.put(sessionId, account);
	}
	public static Account getAccount(String sessionId){
		Account account = onlineMembers.get(sessionId);
		if(null == account){
			User u = new User();
			u.setSessionId(sessionId);
			u = (User)CommonEntityManager.getEntityByExample(u);
			if(null == u){
				return null;
			}
			account = new Account();
			account.setUser(u);
			final Account qaccount = (Account) CommonEntityManager.getEntityByExample(account);
			if(null == qaccount){
				return null;
			}
			onlineMembers.put(sessionId, qaccount);

		}
		return account;
	}
	
	@SuppressWarnings("unchecked")
	public static void refreshingChanges(){

    	List<Ticker> tickers =  (List<Ticker>) CommonEntityManager.getAllEntities(Ticker.class);
    	
		List<Ticker> topactives = new ArrayList<Ticker>();
		List<Ticker> topgainers = new ArrayList<Ticker>();
		List<Ticker> toplosers = new ArrayList<Ticker>();
		List<Ticker> topgainermoneys = new ArrayList<Ticker>();
		List<Ticker> toplosermoneys = new ArrayList<Ticker>();
	
		for(Ticker ticker:tickers){

			if(null != ticker.getChange() && null != ticker.getPrice()){
				Double changePercentage = Double.parseDouble(ticker.getChange().trim().replaceAll("%", ""))/100; 
				Double changeValue = ticker.getPrice() /(1- changePercentage) - ticker.getPrice(); 

				ticker.setValueChange(decimalFormat(changeValue));
				ticker.setPercentageChange(decimalFormat(changePercentage));
			}
			
			insertObj(ticker, topactives, TickerClassType.ACTIVES);
			insertObj(ticker, topgainers, TickerClassType.GAINERS);
			insertObj(ticker, toplosers, TickerClassType.LOSERS);
			insertObj(ticker, topgainermoneys, TickerClassType.GAINERMONEY);
			insertObj(ticker, toplosermoneys, TickerClassType.LOSERMONEY);
			

			maptickers.put(ticker.getTicker(), ticker);
			
		}
		topMarkets.put(TickerClassType.ACTIVES, topactives);
		topMarkets.put(TickerClassType.GAINERS, topgainers);
		topMarkets.put(TickerClassType.LOSERS, toplosers);
		topMarkets.put(TickerClassType.GAINERMONEY, topgainermoneys);
		topMarkets.put(TickerClassType.LOSERMONEY, toplosermoneys);
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
		}else if(null != ticker.getChange()){ 
			
			if(TickerClassType.GAINERS.equals(classType)){
				isInsert = ticker.getPercentageChange().compareTo(topticker.getPercentageChange()) > 0;
			}else if(TickerClassType.LOSERS.equals(classType)){
				isInsert = ticker.getPercentageChange().compareTo(topticker.getPercentageChange()) < 0;
			}else if(TickerClassType.GAINERMONEY.equals(classType)){
				isInsert = ticker.getValueChange().compareTo(topticker.getValueChange()) > 0;
			}else if(TickerClassType.LOSERMONEY.equals(classType)){
				isInsert = ticker.getValueChange().compareTo(topticker.getValueChange()) < 0;
			}
		}
		return isInsert;
	}
	private static double decimalFormat(double doubleValue){
		return Double.parseDouble(decimalFormat.format(doubleValue));
	}
	
	public static List<Ticker> getTopTickers(TickerClassType classType){
		if(topMarkets.isEmpty()){
			initDataFactory();
		}
		return topMarkets.get(classType);
	}
	
	
}
