package com.aaronprj.common.utils;

/**
 * @author RedSector PTE LTD
 */
public class NumberUtil {

	/**
	 * Formats floating number to string. Converts 0.25 to "¼", 0.5 fraction to
	 * "½", 0.75 to "¾", otherwise as per normal.
	 * <p>
	 * e.g. 34.5 -- "34½"
	 * 
	 * @param d
	 *            The number to convert
	 * @return The number in string format
	 */
	public static String format(double d) {
		double fraction = Math.abs(d - (int) d);

		String result = "" + (int) d;

		if (fraction == 0.5)
			result += "½";
		else if (fraction == 0.75)
			result += "¾";
		else if (fraction == 0.25)
			result += "¼";
		else if (fraction == 0)
			result += "";
		else
			result += "" + fraction;

		return result;
	}

	/**
	 * Adds sign to the number given.
	 * <p>
	 * e.g. 34.5 -- "+34.5", -34.5 -- "-34.5", 34.0 -- "+34"
	 * 
	 * @param d
	 *            The number to convert
	 * @return The number in string format
	 */
	public static String addSign(double d) {
		if (d == 0)
			return "0";

		if (d == (int) d)
			return d >= 0 ? "+" + (int) d : "" + (int) d;

		return d >= 0 ? "+" + d : "" + d;
	}

	/**
	 * Adds sign to the number string.
	 * <p>
	 * e.g. "34.5" -- "+34.5", "-34.5" -- "-34.5", "34.0" -- "+34.0"
	 * 
	 * @param d
	 *            The number string to add
	 * @return The number in string format
	 */
	public static String addSign(String d) {
		return d.charAt(0) == '-' ? d : "+" + d;
	}

	public static String append(double d, int digits) {
		int i = (int) d;
		int divider = (int) Math.pow(10, digits);

		String remainder = "" + (i % divider);

		while (remainder.length() < digits) {
			remainder = "0" + remainder;
		}

		return remainder;
	}
}
