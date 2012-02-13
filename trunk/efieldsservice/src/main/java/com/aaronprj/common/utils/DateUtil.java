package com.aaronprj.common.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * A utility class for Date and Time Conversion
 * <p>
 * 
 * @author aaron.xiong updated
 */
public class DateUtil
{
    public final static String defTimestampFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ";
    public final static String defDateTimeFormat = "yyyy-MM-dd'T'HH:mm:ssZ";
    public final static String defDateFormat = "yyyy-MM-dd";
    public final static String defTimeFormat = "HH:mm:ss";

    public static Date getEarliestDate(Date date)
    {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.HOUR_OF_DAY, c.getMinimum(Calendar.HOUR_OF_DAY));
        c.set(Calendar.MINUTE, c.getMinimum(Calendar.MINUTE));
        c.set(Calendar.SECOND, c.getMinimum(Calendar.SECOND));

        return c.getTime();
    }

    public static Date getLatestDate(Date date)
    {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.set(Calendar.HOUR_OF_DAY, c.getMaximum(Calendar.HOUR_OF_DAY));
        c.set(Calendar.MINUTE, c.getMaximum(Calendar.MINUTE));
        c.set(Calendar.SECOND, c.getMaximum(Calendar.SECOND));

        return c.getTime();
    }

    public static String formatDate(Date date, String format)
    {
        return new SimpleDateFormat(format).format(date);
    }

    public static String formatDate(Date date)
    {
        return new SimpleDateFormat(defDateFormat).format(date);
    }

    public static String formatTime(Date time)
    {
        return new SimpleDateFormat(defDateFormat).format(time);
    }

    public static String formatDateTime(Date dateTime)
    {
        return new SimpleDateFormat(defDateTimeFormat).format(dateTime);
    }

    public static String formatTimestamp(Date dateTime)
    {
        return new SimpleDateFormat(defTimestampFormat).format(dateTime);
    }

    public static Date parseDate(String date, String format)
    {
        try
        {
            return new SimpleDateFormat(defDateFormat).parse(date);
        }
        catch (ParseException e)
        {
            e.printStackTrace();
            return null;
        }
    }

    public static Date parseDate(String date)
    {
        try
        {
            return new SimpleDateFormat(defDateFormat).parse(date);
        }
        catch (ParseException e)
        {
            e.printStackTrace();
            return null;
        }
    }

    public static Date parseTime(String time)
    {
        try
        {
            return new SimpleDateFormat(defDateFormat).parse(time);
        }
        catch (ParseException e)
        {
            e.printStackTrace();
            return null;
        }
    }

    public static Date parseDateTime(String dateTime)
    {
        try
        {
            return new SimpleDateFormat(defDateTimeFormat).parse(dateTime);
        }
        catch (ParseException e)
        {
            e.printStackTrace();
            return null;
        }
    }

    public static Date parseTimestamp(String dateTime)
    {
        try
        {
            return new SimpleDateFormat(defTimestampFormat).parse(dateTime);
        }
        catch (ParseException e)
        {
            e.printStackTrace();
            return null;
        }
    }

}
