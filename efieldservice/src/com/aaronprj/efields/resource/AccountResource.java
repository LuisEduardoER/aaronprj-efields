package com.aaronprj.efields.resource;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.aaronprj.common.utils.CommonEntityManager;
import com.aaronprj.common.utils.SystemInitializeUtil;
import com.aaronprj.common.web.uivo.BaseEntity;
import com.aaronprj.efields.dataservice.DataService;
import com.aaronprj.entities.efields.Account;
import com.db4o.ObjectContainer;
import com.db4o.ObjectSet;



@Path("/account")
public class AccountResource extends ResourceServices{

	@SuppressWarnings("unchecked")
	@Path("/acts")
    @GET 
	@Produces(MediaType.APPLICATION_JSON)
    public String getActs() {
    	
    	
    	List<Account> acts =  (List<Account>) CommonEntityManager.getAllEntities(Account.class);

    	if(null == acts || acts.isEmpty()){
    		SystemInitializeUtil.initUsers();
    		acts =  (List<Account>) CommonEntityManager.getAllEntities(Account.class);
    	}
    	
    	return this.writeValueAsString(generateResult(acts));
    }
    
	@Path("/login/{username}/{password}")
    @POST 
	@Produces(MediaType.APPLICATION_JSON)
    public String login(@PathParam("username") String userName, @PathParam("password") String password){
    	
    	BaseEntity<Account> be = generateResult(true, "Login success", "", "");
    	try {
    		ObjectContainer objdb = CommonEntityManager.getObjectContainer();


			Account account = new Account();
			account.setUserName(userName.toLowerCase());
			ObjectSet<Account> accounts = objdb.queryByExample(account);
			
			if(null == accounts || !accounts.hasNext()){
				be.setMsgCode("Login name not matched!");
				be.setMsgDiscription("Please input your correct login name!");
				be.setSuccess(false);
				
			}else{
				account = accounts.next();
				if(!password.equals(account.getPassword())){
					be.setMsgCode("Login password not matched!");
					be.setMsgDiscription("Please input your correct password!");
					be.setSuccess(false);
				}else{
					
					String sessionid = this.getSessionId().toString();
					account.setSessionId(sessionid);
					objdb.store(account);
					
					be.setEntity(account);
					be.setSessionId(sessionid);
				}
			}
		} catch (Exception e) {
			be.setMsgCode("Login unsuccessfull!");
			be.setMsgDiscription("Please input your correct login name and password try again!");
			be.setSuccess(false);
			
			e.printStackTrace();
		}
    	
    	return this.writeValueAsString(be);
    }
	

	@Path("/logincheck/{sessionid}")
    @POST 
	@Produces(MediaType.APPLICATION_JSON)
    public String loginCheck(@PathParam("sessionid") String sessionid){
    	

    	BaseEntity<Account> be = generateResult(true, "Login success", "", "");
		ObjectContainer objdb = CommonEntityManager.getObjectContainer();
		Account account = DataService.checkSession(sessionid,objdb);
		if(null == account){
			be.setMsgCode("Unable to locate account information!");
			be.setMsgDiscription(" ");
			be.setSuccess(false);
	    	return this.writeValueAsString(be);
		}
		be.setEntity(account);

    	return this.writeValueAsString(be);
    }


	@Path("/registor")
    @POST 
	@Produces(MediaType.APPLICATION_JSON)
    public String registor(@QueryParam("userName") String userName,
    		@QueryParam("password") String password,
    		@QueryParam("firstName") String firstName,
    		@QueryParam("email") String email,
    		@QueryParam("address") String address,
    		@QueryParam("postCode") String postCode,
    		@PathParam("phoneNumber") String phoneNumber){
    	

    	BaseEntity<Account> be = generateResult(true, "Login success", "", "");
    	

		ObjectContainer objdb = CommonEntityManager.getObjectContainer();
		Account account = DataService.checkAccount(userName, objdb);
		if(null != account){
			return this.writeValueAsString(generateResult(false, "Login Name not available.", "", ""));
		}

     	Account act = new Account();
    	act.setAddress(address);
    	act.setAddress(postCode);
    	act.setAddress(phoneNumber);
    	
    	act.setFirstName(firstName);
    	act.setPassword(password);
    	act.setUserName(userName.toLowerCase());
    	
    	act.setAccountCode("AC-"+userName.toUpperCase());
    	act.setCashValue(1000000);
    	act.setMarketValue(1000000);
    	act.setNetValue(1000000);
    	act.setTotalGain(0);
    	
    	List<String> wls = new ArrayList<String>();
    	wls.add("AAPL");
    	wls.add("GOOG");
    	wls.add("C");
    	wls.add("BAC");
    	wls.add("HP");
    	wls.add("BQI");
    	wls.add("F");
    	wls.add("INTC");
    	wls.add("EBAY");

    	act.setWatchList(wls);
    	CommonEntityManager.save(act);
    	
		be.setEntity(act);

    	return this.writeValueAsString(be);
    }
    
}
