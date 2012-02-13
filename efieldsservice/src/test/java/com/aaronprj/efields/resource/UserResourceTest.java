package com.aaronprj.efields.resource;

import org.junit.Assert;
import org.junit.Test;

import com.aaronprj.common.enums.UserRole;
import com.aaronprj.common.utils.CommonEntityManager;
import com.aaronprj.common.utils.ObjectHelper;
import com.aaronprj.common.web.uivo.BaseEntity;
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
    public void testGetUsers() throws Exception {

    	
//    	User u = new User();
//    	u.setAddress("");
//    	u.setFirstName("firstName");
//    	u.setPassword("password");
//    	u.setUserName("userName");
//    	//u.setRole(UserRole.Administrator);
//    	
//    	CommonEntityManager.save(u);
//    	
//    	u = new User();
//    	u.setAddress("");
//    	u.setFirstName("firstName1");
//    	u.setPassword("password");
//    	u.setUserName("userName1");
//    	//u.setRole(UserRole.Costumer);
//
//    	CommonEntityManager.save(u);
    	
        String responseMsg = webResource.path("user/users").get(String.class);

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
