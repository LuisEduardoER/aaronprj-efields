package com.aaronprj.test.entities;



import org.junit.Test;

import com.aaronprj.common.utils.SystemInitializeUtil;

public class TickerImportTest {

	

	@Test
	public void testTickerImport(){
		SystemInitializeUtil.initTickers();
	}
}
