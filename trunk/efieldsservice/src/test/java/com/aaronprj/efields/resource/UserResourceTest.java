package com.aaronprj.efields.resource;

import org.junit.Assert;

import com.aaronprj.common.utils.ObjectHelper;
import com.aaronprj.common.web.uivo.BaseEntity;
import com.aaronprj.entities.efields.Account;


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
	//Test
    public void testGetUserAccounts() throws Exception {

        String responseMsg = webResource.path("account/acts").get(String.class);

        System.out.println("1 user ===============================================================================================================");
        System.out.println(""+responseMsg);
        
        BaseEntity<Account> be = toObject(responseMsg, BaseEntity.class);
        ObjectHelper.toString(be.getEntities());
        
        Assert.assertNotNull("The return object can't be null.", be);

    }
    

    @SuppressWarnings("unchecked")
	//Test
    public void testLogin() throws Exception {

        String responseMsg = webResource.path("account/login/userName/password").post(String.class);

        System.out.println("1 user ===============================================================================================================");
        System.out.println(""+responseMsg);

        BaseEntity<Account> be = toObject(responseMsg, BaseEntity.class);
        
        ObjectHelper.toString(be);
        
        Assert.assertNotNull("The return object can't be null.", be);
    }
    

}
