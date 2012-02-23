package com.aaronprj.efields.resource;

import java.util.ArrayList;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;

import com.aaronprj.common.utils.CommonEntityManager;
import com.aaronprj.common.utils.ObjectHelper;
import com.aaronprj.common.web.uivo.BaseEntity;
import com.aaronprj.entities.efields.Account;
import com.aaronprj.entities.efields.User;


public class UserResourceTest extends ResourceTestBase {

	public UserResourceTest() throws Exception {
        super();

		//if first time login,,have to initial the user data
		//SystemInitialHelper.createUsers();
	}
    /**
     * Test that the expected response is sent back.
     * @throws java.lang.Exception
     */
    @SuppressWarnings("unchecked")
	@Test
    public void testGetUserAccounts() throws Exception {

    	
    	User u = new User();
    	u.setAddress("");
    	u.setFirstName("firstName");
    	u.setPassword("password");
    	u.setUserName("userName");
    	//u.setRole(UserRole.Administrator);
    	
    	CommonEntityManager.save(u);
    	
    	Account act = new Account();
    	act.setUser(u);
    	act.setAccountCode("AC");
    	act.setCashValue(10000);
    	act.setDrawableValue(10000);
    	act.setMarketValue(500);
    	act.setNetValue(10000);
    	act.setTotalGain(0);
    	List<String> wls = new ArrayList<String>();
    	wls.add("AAPL");
    	wls.add("C");
    	wls.add("BAC");
    	wls.add("HP");
    	wls.add("BQI");

    	act.setWatchList(wls);

    	CommonEntityManager.save(act);
    	
    	u = new User();
    	u.setAddress("");
    	u.setFirstName("firstName1");
    	u.setPassword("password");
    	u.setUserName("userName1");
    	//u.setRole(UserRole.Costumer);

    	CommonEntityManager.save(u);

    	act.setUser(u);
    	act.setAccountCode("AC1");
    	act.setCashValue(10500);
    	act.setDrawableValue(10500);
    	act.setMarketValue(500);
    	act.setNetValue(10500);
    	act.setTotalGain(0);

    	wls.add("F");
    	wls.add("INTC");
    	wls.add("EBAY");

    	act.setWatchList(wls);
    	CommonEntityManager.save(act);
    	
        String responseMsg = webResource.path("user/acts").get(String.class);

        System.out.println("1 user ===============================================================================================================");
        System.out.println(""+responseMsg);
        
        BaseEntity<User> be = toObject(responseMsg, BaseEntity.class);
        ObjectHelper.toString(be.getEntities());
        
        Assert.assertNotNull("The return object can't be null.", be);

    }
    

    @SuppressWarnings("unchecked")
	@Test
    public void testLogin() throws Exception {

        String responseMsg = webResource.path("user/login/userName/password").post(String.class);

        System.out.println("1 user ===============================================================================================================");
        System.out.println(""+responseMsg);

        BaseEntity<User> be = toObject(responseMsg, BaseEntity.class);
        
        ObjectHelper.toString(be);
        
        Assert.assertNotNull("The return object can't be null.", be);
    }
    

}
