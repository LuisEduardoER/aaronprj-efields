package com.aaronprj.efields.entities;

import java.util.StringTokenizer;

import org.junit.Test;

import com.aaronprj.common.utils.CommonEntityManager;
import com.aaronprj.entities.efields.Message;
import com.db4o.ObjectContainer;
import com.db4o.ObjectSet;

public class EntityTest {

	//Test
	public void testEntity(){
		

		StringTokenizer st = null;
		String str = "\"Aaron's, Inc.\",\"Services\",1962.76,,25.99";
		st = new StringTokenizer(str);
		if(st.hasMoreTokens()){
			System.out.println(st.nextToken("\""));
		}
		while(st.hasMoreTokens()){
			System.out.println(st.nextToken("\""));
		}
		
	}
	

	//Test
	public void testEntityStore(){
		

		ObjectContainer objdb = CommonEntityManager.getObjectContainer();
		
		Message msg = new Message();
		msg.setTitle("test");
		msg.setContent("the test message");

		objdb.store(msg);
		System.out.println("Saved Message------------------------------");
		
		msg = (Message) objdb.queryByExample(msg).next();
		msg.setUnreaded(true);
		msg.setTitle("tested");
		
		objdb.store(msg);
		System.out.println("updated Message------------------------------");
		
		ObjectSet<Message> msgs = objdb.query(Message.class);
		
		while(msgs.hasNext()){
			Message tmpmsg = msgs.next();
			System.out.println("Message------------------------------");
			System.out.println(tmpmsg.getTitle());
			System.out.println(tmpmsg.getContent());
			System.out.println(tmpmsg.isUnreaded());
			System.out.println(tmpmsg.getCreateDate());
		}
		
	}

	//Test
	public void testEntityListing(){

		ObjectContainer objdb = CommonEntityManager.getObjectContainer();
		ObjectSet<Message> msgs = objdb.query(Message.class);
		
		while(msgs.hasNext()){
			Message tmpmsg = msgs.next();
			System.out.println("Message------------------------------");
			System.out.println(tmpmsg.getTitle());
			System.out.println(tmpmsg.getContent());
			System.out.println(tmpmsg.isUnreaded());
			System.out.println(tmpmsg.getCreateDate());
		}
	}
	
	//Test
	public void testEntityDeleting(){


		ObjectContainer objdb = CommonEntityManager.getObjectContainer();
		ObjectSet<Message> msgs = objdb.query(Message.class);
		
		while(msgs.hasNext()){
			Message tmpmsg = msgs.next();
			System.out.println("deleted Message------------------------------");
			objdb.delete(tmpmsg);
		}
		objdb.commit();
	}
	
}
