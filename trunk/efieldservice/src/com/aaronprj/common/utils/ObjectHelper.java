package com.aaronprj.common.utils;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.GenericArrayType;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;

/**
 * @author aaron.xiong
 */
public class ObjectHelper {


	/**
	 * Set State field from value.
	 * 
	 * @param <T>
	 * @param object
	 * @param name
	 * @param value
	 */
	public static <T extends Object> void setStateField(T object, String name, String value) {
		if (value == null || value.toString().length() == 0) return;

		List<Field> allFields = new ArrayList<Field>();
		allFields.addAll(Arrays.asList(object.getClass().getDeclaredFields()));
		allFields.addAll(Arrays.asList(object.getClass().getSuperclass().getDeclaredFields()));
		
		for (Field field : allFields) {
			if (field.getName().equalsIgnoreCase(name)) {
				char[] chars = field.getName().toCharArray();
				chars[0] = Character.toUpperCase(chars[0]);
				Class<?> fieldType = field.getType();
				Object obj; 

				try {
					if (fieldType == int.class) {
						obj = Integer.valueOf(value);
					} else if (fieldType == Long.class) {
						obj = Long.valueOf(value);
					} else if (fieldType == Double.class) {
						obj = Double.valueOf(value);
					} else if (fieldType == String.class) {
						obj = String.valueOf(value);
					} else if (fieldType == Timestamp.class) {
					    Date tmpdate = DateUtil.parseTimestamp(value);
						obj = new Date(tmpdate.getTime());
					} else if (fieldType == Date.class) {
						obj = DateUtil.parseDateTime(value);
					} else if (fieldType == BigDecimal.class) {
						obj = new BigDecimal(String.valueOf(value));
					} else {
						obj = value;
					}
				} catch (NumberFormatException e1) {
					obj = 0;
					e1.printStackTrace();
				}

				Method setMethod = null;
				try {
					setMethod = object.getClass().getDeclaredMethod("set" + new String(chars), fieldType);
				} catch (NoSuchMethodException ex) {
					try {
						setMethod = object.getClass().getSuperclass().getDeclaredMethod("set" + new String(chars), fieldType);
					} catch (NoSuchMethodException ef) {
						ef.printStackTrace();
					}
				} catch (Exception e) {
					e.printStackTrace();
				}

				if (setMethod != null) {
					try {
						setMethod.invoke(object, obj);
					} catch (Exception e) {
						e.printStackTrace();
					}
				}

				break;
			}			
		}
	}

	
	/**
	 * get State field value.
	 * 
	 * @param <T>
	 * @param object
	 * @param name
	 */
	public static <T extends Object> Object getFieldValue(T object, String fieldName){
		return getFieldValue(object, fieldName, 0);
	}
	public static <T extends Object> Object getFieldValue(T object, String fieldName, int index) {
		if (fieldName == null || fieldName.toString().length() == 0) return null;
		String[] splitedfields = extractFields(fieldName);
		boolean isObjectField = splitedfields.length == 2;
		Object tmpObj = null;
		if(object instanceof Collection){
			tmpObj = ((Collection<?>)object).toArray()[index];
		}else if(object instanceof Map){
			tmpObj = ((Map<?,?>)object).values().toArray()[index];
		}else{
			tmpObj = object;
		}
		Object objValue = getStateFieldValue(tmpObj, splitedfields[0]);
		if(isObjectField){
			if(null == objValue){
				return getFieldValue(tmpObj, splitedfields[1], index);
			}else{
				return getFieldValue(objValue, splitedfields[1], index);
			}
		}
		
		return objValue;
	}

	/**
	 * get State field value.
	 * 
	 * @param <T>
	 * @param object
	 * @param name
	 */
	public static <T extends Object> Object getStateFieldValue(T object, String fieldName) {
		if (fieldName == null || fieldName.toString().length() == 0) return null;
		
		char[] chars = fieldName.toCharArray();
		chars[0] = Character.toUpperCase(chars[0]);
		
		Method getMethod = null;
		try {
			getMethod = object.getClass().getDeclaredMethod("get" + new String(chars));
		} catch (NoSuchMethodException ex) {
			try {
				getMethod = object.getClass().getSuperclass().getDeclaredMethod("get" + new String(chars));
			} catch (NoSuchMethodException ef) {
				//ef.printStackTrace();
			}
		} catch (Exception e) {
			//e.printStackTrace();
		}
	
		if (getMethod != null) {
			try {
				return getMethod.invoke(object);
			} catch (Exception e) {
				//e.printStackTrace();
			}
		}

		return null;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static int objectCompareTo(Object fieldVale, Object tofieldVale) throws Exception{

		if(fieldVale instanceof Comparable && tofieldVale instanceof Comparable){
			return ((Comparable)fieldVale).compareTo((Comparable)tofieldVale);
		}else{
			if(null == fieldVale && null == tofieldVale){
				return 0;
			}else if(null == fieldVale){
				return -1;
			}else if(null == tofieldVale){
				return 1;
			}else{
				throw new Exception("Uncomparable fields");
			}
		}
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static <T extends Object>  int fieldsCompareTo(T obj, T objTo, String fieldName) throws Exception{

		Object objv = getFieldValue(obj,fieldName);
		Object objtov = getFieldValue(objTo,fieldName);
		
		if(objv instanceof Comparable && objtov instanceof Comparable){
			return ((Comparable)objv).compareTo((Comparable)objtov);
		}else{
			if(null == objv && null == objtov){
				return 0;
			}else if(null == objv){
				return -1;
			}else if(null == objtov){
				return 1;
			}else{
				throw new Exception("Uncomparable fields");
			}
		}
	}
	
	public static String extractClassName(String classPath){
		return classPath.substring(classPath.lastIndexOf("."));
	}
	
	public static String[] extractFields(String ofieldName){
		int sindex = ofieldName.indexOf(".");
		if(sindex == -1){
			return new String[]{ofieldName};
		}else{
			String p = ofieldName.substring(0, sindex);
			String f = ofieldName.substring(sindex+1);
			
			return new String[]{p,f};
		}
	}
	

	public static boolean isCollectionType(Class<?> messageObjectClass){
		return Collection.class.isAssignableFrom(messageObjectClass) || List.class.isAssignableFrom(messageObjectClass);
	}
	
	public static boolean isCollectionType(Class<?> messageObjectClass, String filedName){
		return isCollectionType((Class<?>)getParentFieldType(messageObjectClass, filedName));
	}

	public static Class<?> getGenericTypeClass(Type type) {
		if (type instanceof Class) {
			return (Class<?>)type;
		} else if (type instanceof ParameterizedType) {
			return getGenericTypeClass(((ParameterizedType) type).getActualTypeArguments()[0]);
		} else if (type instanceof GenericArrayType) {
			Type componentType = ((GenericArrayType) type).getGenericComponentType();
			Type componentClass = getGenericTypeClass(componentType);
			if (componentClass != null) {
				return Array.newInstance(componentClass.getClass(), 0).getClass();
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
	
	public static Type getParentFieldType(Class<?> messageObjectClass, String filedName){
		
		try {
			String[] f = extractFields(filedName);
			Field fd = messageObjectClass.getDeclaredField(f[0]);
			Type ftype = fd.getType();
			if(f.length > 2){
				return getParentFieldType(ftype.getClass(), f[1]);
			}else{
				return ftype;
			}
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchFieldException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static Field getParentField(Class<?> messageObjectClass, String filedName) {
		try {
			String[] f = extractFields(filedName);
			Field fd = messageObjectClass.getDeclaredField(f[0]);
			if (f.length > 2) {
				return getParentField(fd.getType(), f[1]);
			} else {
				return fd;
			}
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchFieldException e) {
			e.printStackTrace();
		}
		return null;
	}
	
    public static String toString(Object obj) {
        
    	List<Class<?>> types = new ArrayList<Class<?>>();
    	types.add(Boolean.class);
    	types.add(BigDecimal.class);
    	types.add(Byte.class);
    	types.add(Character.class);
    	types.add(Date.class);
    	types.add(Double.class);
    	types.add(Float.class);
    	types.add(Integer.class);
    	types.add(Long.class);
    	types.add(Short.class);
    	types.add(String.class);
    	types.add(Timestamp.class);
    	types.add(Void.class);
    	
    	if(types.contains(obj.getClass())){
    		return obj.toString();
    	}else{
            return ReflectionToStringBuilder.toString(obj);
    	}
    }

}
