package com.aaronprj.common.utils;

import java.util.Calendar;
import java.util.Date;
public class CalendarUtil{

	/**
	 * A utility class for Calendar compare
	 * <p>
	 *
	 * @author aaron.xiong
	 */
	private static CalendarUtil calendarUtil;
	
	public static synchronized CalendarUtil getInstance(){
		if(null == calendarUtil){
			calendarUtil = new CalendarUtil();
		}
		return calendarUtil;
	}
	   
	/**
	 * 
     * Compares the time values (millisecond offsets from the <a href="#Epoch">Epoch</a>) represented by two
     * <code>Calendar</code> objects.
     * 
	 * @param date 
	 * @param anotherDate
	 * @param field this field must be in {Y,M,D,TH,TM,TS}
	 * @return
	 */
	public int compareToByField(Date date, Date anotherDate, String field) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		
		Calendar anotherCalendar = Calendar.getInstance();
		anotherCalendar.setTime(anotherDate);

    	int compareValue = 0;
        if (field.equalsIgnoreCase("Y")) {
            int year = calendar.get(java.util.Calendar.YEAR);
            int ayear = anotherCalendar.get(java.util.Calendar.YEAR);
            if(year < ayear){
            	compareValue = -1;
            }else if(year > ayear){
            	compareValue = 1;
            }
        }else if (field.equalsIgnoreCase("M")) {
        	calendar.clear(java.util.Calendar.DAY_OF_MONTH);
        	calendar.clear(java.util.Calendar.HOUR_OF_DAY);
        	calendar.clear(java.util.Calendar.MINUTE);
        	calendar.clear(java.util.Calendar.SECOND);

        	anotherCalendar.clear(java.util.Calendar.DAY_OF_MONTH);
        	anotherCalendar.clear(java.util.Calendar.HOUR_OF_DAY);
        	anotherCalendar.clear(java.util.Calendar.MINUTE);
        	anotherCalendar.clear(java.util.Calendar.SECOND);
        	compareValue = calendar.compareTo(anotherCalendar);
        }else if (field.equalsIgnoreCase("D")) {
        	calendar.clear(java.util.Calendar.HOUR_OF_DAY);
        	calendar.clear(java.util.Calendar.MINUTE);
        	calendar.clear(java.util.Calendar.SECOND);

        	anotherCalendar.clear(java.util.Calendar.HOUR_OF_DAY);
        	anotherCalendar.clear(java.util.Calendar.MINUTE);
        	anotherCalendar.clear(java.util.Calendar.SECOND);
        	compareValue = calendar.compareTo(anotherCalendar);
        }else if (field.equalsIgnoreCase("TH")) {
        	calendar.clear(java.util.Calendar.HOUR_OF_DAY);
        	calendar.clear(java.util.Calendar.MINUTE);
        	calendar.clear(java.util.Calendar.SECOND);
        	anotherCalendar.clear(java.util.Calendar.HOUR_OF_DAY);
        	anotherCalendar.clear(java.util.Calendar.MINUTE);
        	anotherCalendar.clear(java.util.Calendar.SECOND);
        	compareValue = calendar.compareTo(anotherCalendar);
        }else if (field.equalsIgnoreCase("TM")) {
        	calendar.clear(java.util.Calendar.MINUTE);
        	calendar.clear(java.util.Calendar.SECOND);

        	anotherCalendar.clear(java.util.Calendar.MINUTE);
        	anotherCalendar.clear(java.util.Calendar.SECOND);
        	compareValue = calendar.compareTo(anotherCalendar);
        }else if (field.equalsIgnoreCase("TS")) {
        	calendar.clear(java.util.Calendar.SECOND);
        	anotherCalendar.clear(java.util.Calendar.SECOND);
        	compareValue = calendar.compareTo(anotherCalendar);
        }else{
        	compareValue = calendar.compareTo(anotherCalendar);
        }
    	return compareValue;
    }
    
	public boolean beforeAndEqualByField(Calendar calendar, Calendar anotherCalendar, String field){
		return compareToByField(calendar.getTime(),anotherCalendar.getTime(),field) <= 0;
	}

	public boolean equalsByField(Calendar calendar, Calendar anotherCalendar, String field){
		return compareToByField(calendar.getTime(),anotherCalendar.getTime(),field) == 0;
	}
	public boolean afterAndEqualByField(Calendar calendar, Calendar anotherCalendar, String field){
		return compareToByField(calendar.getTime(),anotherCalendar.getTime(),field) >= 0;
	}

	public boolean betweenByField(Calendar calendar, Calendar beginCalendar,Calendar endCalendar, String field){
		return afterAndEqualByField(calendar,beginCalendar,field) && beforeAndEqualByField(calendar,endCalendar,field);
	}

	//compare date format
	public boolean beforeAndEqualByField(Date date, Date anotherDate, String field){
		return compareToByField(date,anotherDate,field) <= 0;
	}

	public boolean equalsByField(Date date, Date anotherDate, String field){
		return compareToByField(date,anotherDate,field) == 0;
	}
	public boolean afterAndEqualByField(Date date, Date anotherDate, String field){
		return compareToByField(date,anotherDate,field) >= 0;
	}

	public boolean betweenByField(Date date, Date beginDate,Date endDate, String field){
		return afterAndEqualByField(date,beginDate,field) && beforeAndEqualByField(date,endDate,field);
	}
	
}
