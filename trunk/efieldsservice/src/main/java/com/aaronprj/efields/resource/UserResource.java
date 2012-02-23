package com.aaronprj.efields.resource;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.aaronprj.common.utils.CommonEntityManager;
import com.aaronprj.common.utils.LogicalOperator;
import com.aaronprj.common.utils.QueryObject;
import com.aaronprj.common.utils.QueryParamter;
import com.aaronprj.common.web.resource.ResourceServices;
import com.aaronprj.common.web.uivo.BaseEntity;
import com.aaronprj.efields.dataservice.DataFactory;
import com.aaronprj.entities.efields.Account;
import com.aaronprj.entities.efields.User;
import com.db4o.nativequery.expr.cmp.ComparisonOperator;



@Path("/user")
public class UserResource extends ResourceServices{

	@SuppressWarnings("unchecked")
	@Path("/acts")
    @GET 
	@Produces(MediaType.APPLICATION_JSON)
    public String getUsers() {
    	
    	
    	List<User> users =  (List<User>) CommonEntityManager.getAllEntities(User.class);

    	if(null == users || users.isEmpty()){
            return this.writeValueAsString(generateResult(null));
    	}
    	List<Account> acts = new ArrayList<Account>();
    	for(User u:users){

			Account account = new Account();
			account.setUser(u);
			final Account qaccount = (Account) CommonEntityManager.getEntityByExample(account);
			acts.add(qaccount);
    	}

    	return this.writeValueAsString(generateResult(acts));
    }
    
	@Path("/login/{username}/{password}")
    @POST 
	@Produces(MediaType.APPLICATION_JSON)
    public String login(@PathParam("username") String username, @PathParam("password") String password){
    	
    	final QueryObject queryObject = new QueryObject(LogicalOperator.AND);
    	
    	queryObject.addQueryParamter(new QueryParamter("userName",username, ComparisonOperator.VALUE_EQUALITY));
    	queryObject.addQueryParamter(new QueryParamter("password",password, ComparisonOperator.VALUE_EQUALITY));
    	
    	BaseEntity<Account> be = generateResult(true, "Login success", "", "");
    	try {
			User user =  (User) CommonEntityManager.getEntity(queryObject);
			
			if(null == user){
				be.setMsgCode("Login name not matched!");
				be.setMsgDiscription("Please input your correct login name!");
				be.setSuccess(false);
				
			}else if(!password.equals(user.getPassword())){
				be.setMsgCode("Login password not matched!");
				be.setMsgDiscription("Please input your correct password!");
				be.setSuccess(false);
			}else{
				
				Account account = new Account();
				account.setUser(user);
				final Account qaccount = (Account) CommonEntityManager.getEntityByExample(account);
				if(null != qaccount){
					String sessionid = this.getSessionId().toString();
					user.setSessionId(sessionid);
					CommonEntityManager.save(user);
					qaccount.getUser().setSessionId(sessionid);
					DataFactory.addOnlineMember(sessionid, qaccount);
					
					be.setEntity(qaccount);
					be.setSessionId(sessionid);
				}else{
					be.setMsgCode("Unable to locate account information!");
					be.setMsgDiscription(" ");
					be.setSuccess(false);
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
    	
    	Account account = DataFactory.getAccount(sessionid);
    	be.setEntity(account);
    	
    	return this.writeValueAsString(be);
    }
    
}
