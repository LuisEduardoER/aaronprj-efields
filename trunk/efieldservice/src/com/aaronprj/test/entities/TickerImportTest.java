package com.aaronprj.test.entities;



import org.junit.Test;

import com.aaronprj.common.utils.CommonEntityManager;
import com.aaronprj.common.utils.SystemInitializeUtil;

public class TickerImportTest {

	

	@Test
	public void testTickerImport(){
		SystemInitializeUtil.initTickers();
	}

	@Test
	public void testPath(){
		String DB4OFILENAME = CommonEntityManager.class.getResource("").getPath();
		DB4OFILENAME = DB4OFILENAME.substring(0, DB4OFILENAME.indexOf("classes"));
		System.out.println(DB4OFILENAME);
	}
}
