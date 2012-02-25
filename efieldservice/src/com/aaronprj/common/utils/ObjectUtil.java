package com.aaronprj.common.utils;

import java.lang.reflect.Array;
import java.lang.reflect.Field;

public class ObjectUtil {
	public static String dump( Object o ) {
		StringBuffer buffer = new StringBuffer();
		Class<?> oClass = o.getClass();
		if ( oClass.isArray() ) {
			buffer.append( "[" );
			for ( int i=0; i<Array.getLength(o); i++ ) {
				Object value = Array.get(o,i);
				if(value != null) {
					if ( i > 0 )
						buffer.append( "," );				
					buffer.append( value.getClass().isArray()?dump(value):value );
				}
			}
			buffer.append( "]" );
		}
		else
		{
			buffer.append( "{" );
			while ( oClass != null ) {
				Field[] fields = oClass.getDeclaredFields();
				for ( int i=0; i<fields.length; i++ ) {
					if ( buffer.length() > 1 )
						buffer.append( "," );
					fields[i].setAccessible( true );
					buffer.append( fields[i].getName() );
					buffer.append( "=" );
					try {
						Object value = fields[i].get(o);
						if (value != null) {
							buffer.append( value.getClass().isArray()?dump(value):value );
						}
					} catch ( IllegalAccessException e ) {
					}
				}
				oClass = oClass.getSuperclass();
			}
			buffer.append( "}" );
		}
		return buffer.toString();
	}
}
