package com.aaronprj.test.entities;



import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Date;

import org.junit.Test;

import com.aaronprj.common.utils.ParseCSVFile;

public class TickerImportTest {

	

	@Test
	public void testTickerImport(){
		try {
			System.out.println("Started:"+(new Date()).toString());
			URLConnection conn = new URL("http://www.finviz.com/export.ashx?v=111").openConnection();
			InputStream is = conn.getInputStream();
			System.out.println("Online File Loaded:"+(new Date()).toString());
			
			ParseCSVFile.parseOnlineCSVTicker(is, true);

			System.out.println("Online File Readed:"+(new Date()).toString());
			
		} catch (MalformedURLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
}
