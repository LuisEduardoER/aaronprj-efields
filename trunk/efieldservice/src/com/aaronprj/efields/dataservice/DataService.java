package com.aaronprj.efields.dataservice;

import com.aaronprj.entities.efields.Account;
import com.db4o.ObjectContainer;
import com.db4o.ObjectSet;

public class DataService {

    public static Account checkSession(String sessionid, ObjectContainer objdb){
    	
		Account account = new Account();
		account.setSessionId(sessionid);
		ObjectSet<Account> accounts = objdb.queryByExample(account);

		if(null != accounts && accounts.hasNext()){
			
			return accounts.next();
		}
		return null;
    }

    public static Account checkAccount(String userName, ObjectContainer objdb){
    	
		Account account = new Account();
		account.setUserName(userName);
		ObjectSet<Account> accounts = objdb.queryByExample(account);

		if(null != accounts && accounts.hasNext()){
			
			return accounts.next();
		}
		return null;
    }
}
