package com.aaronprj.common.utils;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import com.aaronprj.entities.efields.Ticker;

public class ParseCSVFile {
	public static void parse(InputStream is) {

		try {
			
//			InputStreamReader r = new InputStreamReader(is);
//			BufferedReader br = new BufferedReader(r);
			
			// create BufferedReader to read csv file
			BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
			String strLine = "";
			StringTokenizer st = null;
			int lineNumber = 0, tokenNumber = 0;

			// read comma separated file line by line
			while ((strLine = br.readLine()) != null) {
				lineNumber++;

				// break comma separated line using ","
				st = new StringTokenizer(strLine, ",");

				while (st.hasMoreTokens()) {
					// display csv values
					tokenNumber++;
					System.out.println("Line # " + lineNumber + ", Token # " + tokenNumber + ", Token : " + st.nextToken());
				}

				// reset token number
				tokenNumber = 0;

			}

		} catch (Exception e) {
			System.out.println("Exception while reading csv file: " + e);
		}
	}

	public static List<Ticker> parseOnlineCSVTicker(InputStream is, boolean isStoreToDatabase) {

		try {
			
			CommonEntityManager.deleteAll(Ticker.class);
			
			// create BufferedReader to read csv file
			BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
			String strLine = "";
			StringTokenizer st = null;
			int lineNumber = 0, tokenNumber = 0;
			
			//build data
			List<String> fields = new ArrayList<String>();

			List<Ticker> tickers = new ArrayList<Ticker>();
			// read comma separated file line by line
			while ((strLine = br.readLine()) != null) {
				Ticker ticker = new Ticker();
				
				//strLine = strLine.replaceAll(",Inc", " Inc");
				//strLine = strLine.replaceAll(", Inc", " Inc");
				strLine = strLine.replaceAll(", ", " ");
				
				strLine = strLine.replaceAll(",,", ",\"-\",");
				strLine = strLine.replaceAll(",,", ",\"-\",");
				// break comma separated line using ","
				st = new StringTokenizer(strLine, ",");
				while (st.hasMoreTokens()) {
					String fieldtext = st.nextToken().trim().replaceAll("\"", "");
					if(lineNumber == 0){
						if("Market Cap".equals(fieldtext)){
							fields.add("makretCap");
						}else if("P/E".equals(fieldtext)){
							fields.add("pe");
						}else{
							fields.add(fieldtext);
						}
					}else{

						if(fields.size() > tokenNumber){
							// display csv values
							System.out.println("Token # " + lineNumber +"."+ tokenNumber+", # " + fields.get(tokenNumber) + ", Token : " + fieldtext);
							if(!"-".equals(fieldtext)){
								ObjectHelper.setStateField(ticker, fields.get(tokenNumber), fieldtext);
							}
						}else{
							System.out.println("Line # " + lineNumber + ", Token # " + tokenNumber + ", Token : " + fieldtext);
						}
						
					}
					tokenNumber++;
				}
				
				if(lineNumber > 0){
					if(isStoreToDatabase){
				    	CommonEntityManager.save(ticker);
					}
					tickers.add(ticker);
				}
				
				// reset token number
				tokenNumber = 0;
				//if(lineNumber > 1800){ return;}
				lineNumber++;
			}
			
			return tickers;

		} catch (Exception e) {
			System.out.println("Exception while reading csv file: " + e.getMessage());
		}
		return null;
	}
}
