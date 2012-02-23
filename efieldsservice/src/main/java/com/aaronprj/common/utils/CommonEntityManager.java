package com.aaronprj.common.utils;

import java.util.Collection;

import com.db4o.Db4oEmbedded;
import com.db4o.ObjectContainer;
import com.db4o.ObjectSet;
import com.db4o.config.ConfigScope;
import com.db4o.config.EmbeddedConfiguration;
import com.db4o.config.QueryEvaluationMode;
import com.db4o.config.encoding.StringEncodings;
import com.db4o.diagnostic.DiagnosticToConsole;
import com.db4o.ext.DatabaseClosedException;
import com.db4o.ext.DatabaseReadOnlyException;
import com.db4o.ext.Db4oIOException;
import com.db4o.io.CachingStorage;
import com.db4o.io.FileStorage;
import com.db4o.io.Storage;
import com.db4o.nativequery.expr.cmp.ComparisonOperator;
import com.db4o.query.Predicate;


public class CommonEntityManager{

	
	private static ObjectContainer objdb;
	//user.dir
	final static String DB4OFILENAME = System.getProperty("user.home") + "/efieldsdb.db4o";
	
	public static void verifyEntityManager(){
		if(null == objdb || objdb.close()){
			EmbeddedConfiguration configuration = Db4oEmbedded.newConfiguration();
			/**
			 * db4o uses the concept of activation to avoid loading to much data into memory
			 * A higher activation depth is usually more convenient to work with, because you don't face inactivated objects. 
			 * However, a higher activation depth costs performance, because more data has to read from the database. 
			 * Therefore a good balance need to be found. Take also a look a transparent activation, since it solves the 
			 * activation issue completely.
			 */
//			configuration.common().activationDepth(2);
//			configuration.common().updateDepth(2);
//			configuration.common().callbacks(false);
//			//configuration.common().callConstructors(true);
//			//configuration.common().objectClass(Person.class).callConstructor(true);
//			//configuration.common().detectSchemaChanges(false);
//			
//			//Enables you to add diagnostic listeners to db4o
//			configuration.common().diagnostic().addListener(new DiagnosticToConsole());
//			//configuration.common().exceptionsOnNotStorable(false);
//			
//			//configure db4o to call the intern method on all strings
//			//configuration.common().internStrings(true);
//			//Immediate  Lazy   Snapshot 
//			configuration.common().queries().evaluationMode(QueryEvaluationMode.IMMEDIATE);
//			
//			configuration.common().testConstructors(false);
//			configuration.common().weakReferenceCollectionInterval(10*1000);
//			//configuration.common().weakReferences(false);
//
//			configuration.common().stringEncoding(StringEncodings.utf8());
//			
//			//configuration.file().asynchronousSync(true);
//			configuration.file().databaseGrowthSize(4096);
//			configuration.file().disableCommitRecovery();
//			
//			configuration.file().freespace().useRamSystem();
//			configuration.file().generateUUIDs(ConfigScope.GLOBALLY);
//			configuration.file().generateCommitTimestamps(true);
//			
//			Storage fileStorage = new FileStorage();
//			// A cache with 128 pages of 1024KB size, gives a 128KB cache
//			Storage cachingStorage = new CachingStorage(fileStorage,128,1024);
//			configuration.file().storage(cachingStorage);
//			configuration.idSystem().useStackedBTreeSystem();
			
			objdb = Db4oEmbedded.openFile(configuration, DB4OFILENAME);
		}
	}
	
	
	
	public static void save(Object obj){
		verifyEntityManager();
		objdb.store(obj);
	}

	public static void save(Object[] objs){
		verifyEntityManager();
		try {
			for(Object obj:objs){
				save(obj);
			}
			objdb.commit();
		} catch (Db4oIOException e) {
			e.printStackTrace();
		} catch (DatabaseClosedException e) {
			e.printStackTrace();
		} catch (DatabaseReadOnlyException e) {
			e.printStackTrace();
		}catch (Exception e) {
			e.printStackTrace();
			objdb.rollback();
		}
		objdb.ext().refresh(objs, Integer.MAX_VALUE);
		
		
	}
	

	public static void delete(Object obj){
		verifyEntityManager();
		objdb.delete(obj);
	}
	
	@SuppressWarnings("unchecked")
	public static <T> T find(Class<T> entityClass, Object primaryKey){
		verifyEntityManager();
		objdb.ext().getID(primaryKey);
		Object objectForID = objdb.ext().getByID((Long)primaryKey);
		// getting by id doesn't activate the object
		// so you need to do it manually
		objdb.ext().activate(objectForID,2);
		return (T) objectForID;
	} 
	
	public static ObjectSet<?> getAllEntities(Class<?> entityClass){

		verifyEntityManager();
		
		return objdb.queryByExample(entityClass);
	} 
	
	public static Object getEntity(final QueryObject queryObject){
		ObjectSet<Object> objs = getEntities(queryObject);
		if(null == objs || objs.isEmpty()){
			return null;
		}
		return objs.get(0);
	} 
	
	public static Object getEntityByExample(final Object queryObject){
		ObjectSet<Object> objs = objdb.queryByExample(queryObject);
		if(null == objs || objs.isEmpty()){
			return null;
		}
		return objs.get(0);
	} 
	
	@SuppressWarnings("serial")
	public static ObjectSet<Object> getEntities(final QueryObject queryObject){

		verifyEntityManager();
		
		ObjectSet<Object> result = objdb.query(new Predicate<Object>() {
		    @Override
		    public boolean match(Object obj) {
		    	return comparisonOperator(obj, queryObject);
		    }
		});
		
		return result;
	} 
	
	private static boolean comparisonOperator(Object obj, QueryObject queryObject){
		LogicalOperator logicalOperator = queryObject.getLogicalOperator();
		for(QueryParamter queryParamter:queryObject.getQueryParamters()){
			try {
				Object fieldValue = ObjectHelper.getStateFieldValue(obj, queryParamter.getFieldName());
				ComparisonOperator comparisonOperator = queryParamter.getComparisonOperator();
				if(comparisonOperator  == ComparisonOperator.CONTAINS || 
						comparisonOperator  == ComparisonOperator.STARTS_WITH ||
						comparisonOperator  == ComparisonOperator.ENDS_WITH){
					boolean cp = caculateResult(fieldValue, queryParamter.getFieldValue(), comparisonOperator);
					if(logicalOperator.equals(LogicalOperator.AND)){
						if(!cp) return false;
					}else{
						if(cp) return true;
					}
				}else{
					int comparisonValue = ObjectHelper.objectCompareTo(fieldValue, queryParamter.getFieldValue());
					if(logicalOperator.equals(LogicalOperator.AND)){
						if(!caculateResult(comparisonValue, comparisonOperator)){
							return false;
						}
					}else{
						if(caculateResult(comparisonValue, comparisonOperator)){
							return true;
						}
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return logicalOperator.equals(LogicalOperator.AND);
	}
	
	@SuppressWarnings("rawtypes")
	private static boolean caculateResult(Object fieldValue, Object tofieldValue, ComparisonOperator comparisonOperator){

		if(ObjectHelper.isCollectionType(fieldValue.getClass())){
			if(comparisonOperator  == ComparisonOperator.CONTAINS){
				return ((Collection)fieldValue).contains(tofieldValue);
			}
		}else if(String.class.isAssignableFrom(fieldValue.getClass())){
			if(comparisonOperator  == ComparisonOperator.STARTS_WITH){
				return ((String)fieldValue).startsWith((String)tofieldValue);
			}else if(comparisonOperator  == ComparisonOperator.ENDS_WITH){
				return ((String)fieldValue).endsWith((String)tofieldValue);
			}
		}
		return false;
		
	}

	private static boolean caculateResult(int comparisonValue, ComparisonOperator comparisonOperator){
		if(comparisonOperator  == ComparisonOperator.VALUE_EQUALITY){
			return comparisonValue == 0;
		}else if(comparisonOperator  == ComparisonOperator.GREATER){
			return comparisonValue > 0;
		}else if(comparisonOperator  == ComparisonOperator.SMALLER){
			return comparisonValue < 0;
		}
		return false;
		
	}

}
