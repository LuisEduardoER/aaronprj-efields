package com.aaronprj.test.entities;


import java.util.StringTokenizer;

import org.junit.Test;

public class EntityTest {

	@Test
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
	
}
