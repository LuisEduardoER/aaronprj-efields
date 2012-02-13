package com.aaronprj.common.utils;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;


/**
 * Common Util.
 * 
 * @author
 *
 */
public final class CommonUtil {
	/**
	 * private default constructor.
	 */
	private CommonUtil() {
	}
	
	/**
	 * to get the earliest date for today.
	 * 
	 * @param date current date usually.
	 * @return <class>Date</class>
	 */
	public static Date getEarliestToday(Date date) {
		Calendar today = Calendar.getInstance();
		today.setTime(date);
		today.set(Calendar.HOUR_OF_DAY, 0);
		today.set(Calendar.MINUTE, 0);
		today.set(Calendar.SECOND, 0);
		today.set(Calendar.MILLISECOND, 0);
		
		return today.getTime();
	} 
	
	/**
	 * to get the earliest date for tomorrow.
	 * 
	 * @param date current date usually.
	 * @return <class>Date</class>
	 */
	public static Date getEarliestTomorrow(Date date) {
		Calendar tomorrow = Calendar.getInstance();
		tomorrow.setTime(date);
		tomorrow.add(Calendar.DATE, 1);
		tomorrow.set(Calendar.HOUR_OF_DAY, 0);
		tomorrow.set(Calendar.MINUTE, 0);
		tomorrow.set(Calendar.SECOND, 0);
		tomorrow.set(Calendar.MILLISECOND, 0);
		
		return tomorrow.getTime();
	}
	
	/**
	 * @param regionCode region code; e.g: en_GB
	 * @return <class>Locale</class>
	 */
	public static Locale getLocale(String regionCode) {
		return new Locale(getLanguagePart(regionCode), getCountryPart(regionCode));
	}
	
	/**
	 * @param regionCode the region code to get the language portion of the region code.
	 * @return language code
	 */
	private static String getLanguagePart(String regionCode) {
		return regionCode.substring(0, regionCode.indexOf("_"));
	}
	
	/**
	 * 
	 * @param regionCode the region code to get the country portion of the region code.
	 * @return country code
	 */
	private static String getCountryPart(String regionCode) {
		return regionCode.substring(regionCode.indexOf("_") + 1, regionCode.length());
	}

	/**
	 * @param thisDate first date to compare
	 * @param thatDate second date to compare
	 * @return either thisDate is the same as thatDate (only up to Date, excluding HH:MM:SS:mmm).
	 */
	public static boolean isSameDate(Date thisDate, Date thatDate) {
		boolean result = false;
		
		if (thisDate == null && thatDate == null)
			result = true;
		else if (thisDate == null || thatDate == null)
			result = false;
		else {
			Calendar thisCal = Calendar.getInstance();
			Calendar thatCal = Calendar.getInstance();
			thisCal.setTime(thisDate);
			thatCal.setTime(thatDate);
			
			result = (thisCal.get(Calendar.YEAR) == thatCal.get(Calendar.YEAR) 
						&& thisCal.get(Calendar.MONTH) == thatCal.get(Calendar.MONTH)
						&& thisCal.get(Calendar.DATE) == thatCal.get(Calendar.DATE));
			
		}
		
		return result;
	}
	
	/**
	 * To reverse a string.
	 * 
	 * @param str
	 * @return
	 */
	public static String reverseString(String str) {
		StringBuffer sb = new StringBuffer();
		for (int i = str.length() - 1; i >= 0; i--) {
			sb.append(str.charAt(i));
		}
		
		return sb.toString();
	}

	/**
	 * To decide if handicap is Asian Handicapap
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isAsianHandicap(double handicap) {
		int handicap100 = (int)(handicap * 100);
		return (handicap100 % 50 != 0) && (handicap100 % 25 == 0);
	}
	
	/**
	 * @return current date.
	 */
	public static Date getCurrentDate() {
		Calendar c = Calendar.getInstance();
		return c.getTime();
	}
	
	/**
	 * @param today input date
	 * @return date 1 day before today.
	 */
	public static Date getDateBefore(Date today) {
		Calendar c = GregorianCalendar.getInstance();
		c.setTime(today);
		c.add(Calendar.DAY_OF_MONTH, -1);
		return c.getTime();
	}
	
	/**
	 * @param date to format
	 * @param pattern
	 * @return formatted date.
	 */
	public static String formatDate(Date today, String pattern) {
		SimpleDateFormat format = (SimpleDateFormat) SimpleDateFormat.getInstance();
		format.applyPattern(pattern);
		return format.format(today);
	}
	
	/**
	 * @return current date in epoch time.
	 */
	public static long getEpochTime() {
		Calendar c = Calendar.getInstance();
		int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);
        int day = c.get(Calendar.DATE);
        int hour = c.get(Calendar.HOUR_OF_DAY);
        GregorianCalendar gregorianCalendar = new GregorianCalendar(year, month, day, hour, 0);
        return gregorianCalendar.getTimeInMillis();
	}
	
	/**
	 * Returns the start of the month of the given date.
	 * @param date
	 * @return Date
	 */
	public static Date getStartOfMonth() {
		Calendar calendar = Calendar.getInstance();
		calendar.set(
			calendar.get(Calendar.YEAR),
			calendar.get(Calendar.MONTH),
			1,
			0,
			0,
			0);
		return calendar.getTime();
	}
	
	/**
	 * Returns the start of next month.
	 * @param date
	 * @return Date
	 */
	public static Date getStartOfNextMonth() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.MONTH, 1);
		calendar.set(
			calendar.get(Calendar.YEAR),
			calendar.get(Calendar.MONTH),
			1,
			0,
			0,
			0);
		return calendar.getTime();
	}
	
	/**
	 * Returns the server ip address.
	 * @return ip address
	 */
	public static String getIpAdress() {
		try {
			return InetAddress.getLocalHost().getHostAddress();
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
		return null;
	}

}
