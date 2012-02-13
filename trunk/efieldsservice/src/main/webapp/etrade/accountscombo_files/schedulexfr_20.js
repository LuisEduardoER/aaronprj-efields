//common methods used by RealTime Cashtransfer pages
var achMode = "20";
var ulId = 'etToAccounts';

//executes open account url
function openAccount(url) {
    this.location.href=url;
}

//evalutes if we choose an option in ToList, if it is url it calls openAccount  method
function executeToOption(obj) {
    //var toValue = obj.to_acctnum_list.options[obj.to_acctnum_list.selectedIndex].value;
	var toValue = obj.to_acctnum_list.value;

    if (toValue.substring(0, 5) == "http:") {
	obj.action = getSource(toValue);
	obj.submit();
    }

    if ( toValue.length != 0 && toValue != "default"  && toValue.indexOf("|") == -1 ) {
	openAccount(toValue);
    }
}

function formatCurrency(num) {
	num = num.toString().replace(/\$|\,/g,'');
	if(isNaN(num))
	num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num*100+0.50000000001);
	cents = num%100;
	num = Math.floor(num/100).toString();
	if(cents<10)
	cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
	num = num.substring(0,num.length-(4*i+3))+','+
	num.substring(num.length-(4*i+3));
	//return (((sign)?'':'-') + '$' + num + '.' + cents);
	return (((sign)?'':'-') + '$' + num);

}

function aboveMaxLimt( tAmount , obj )
{
  var achVer = parseFloat (achMode);
  
  if (isNaN(achVer)) achVer = 20;
    
  if (achVer >= 20) return aboveMaxLimtAch20( tAmount , obj );
  else              return aboveMaxLimtAch15( tAmount , obj )
}

function aboveMaxLimtAch20( tAmount , obj )
{
  //var fromAccount = obj.from_acctnum_list.options[obj.from_acctnum_list.selectedIndex].value;
  //var toAccount = obj.to_acctnum_list.options[obj.to_acctnum_list.selectedIndex].value;
  var fromAccount = obj.from_acctnum_list.value;
  var toAccount = obj.to_acctnum_list.value;
  var fromSource = getSource(fromAccount);
  var toSource = getSource(toAccount);
  var maxLimit = 0;
  var isUnverified = false;
  x=obj.transfer_date.value;
  theYear="20"+x.substring(6,8);
  
  //var iralimit=getIRAlimits(theYear);
  //var iraType=getIRAType(toAccount);
  //var iralimitDollar=checkIRALimit(theYear, iraType);
  if (fromSource == "EXTERNAL")
  {
    maxLimit = getMaxLimit(fromAccount);
    isUnverified = getFieldByIndex(fromAccount, 11/*isUnverified flag index*/) == "true";
  }
  else if (toSource=="EXTERNAL")
  {
    maxLimit = getMaxLimit(toAccount);
    isUnverified = getFieldByIndex(toAccount, 11/*isUnverified flag index*/) == "true";
  }
  // if override Daily Max flag is checked in CSR view  get maxLimit from HiddenInfo/*OverMaxLimit  

  if(obj.override_xframount){ if (obj.override_xframount.checked){ maxLimit = mxLimit;}}
  /*
  if ( isIRAAccount(toAccount) && (Number(tAmount) > Number(iralimitDollar)) )
  {   
    selectAlertType("Transfer Amount cannot be greater than "+formatCurrency(iralimitDollar));
    return true;
  }
.*/
  else if ( fromSource=="EXTERNAL" && maxLimit != 0 && tAmount > maxLimit )
  {
    if (toSource=="CREDITCARD")
    {
      selectAlertType("Online payments from non-E*TRADE Financial accounts are limited to " + formatCurrency(maxLimit) + " per account per day.");
    }
    else
    {
      if (isUnverified)
      {
	selectAlertType("Online deposits from unverified external accounts are limited to " + formatCurrency(maxLimit )+ " per day.");
      }
      else
      {
	selectAlertType(" Online deposits from external accounts are limited to " + formatCurrency(maxLimit) + " per day.");
      }
    }

    return true;        
  }
  else if ( toSource=="EXTERNAL" && maxLimit != 0 && tAmount > maxLimit )
  {
    if (isUnverified)
    {
      selectAlertType("Transfers to unverified external accounts are limited to " + formatCurrency(maxLimit) + " per day.");
    }
    else
    {
      selectAlertType("Transfers to external accounts are limited to " + formatCurrency(maxLimit) + " per day.");
    }

    return true;        
  }
  else if (achMode<50){
	  if ( fromSource=="ETB" && toSource=="ETB" && tAmount > 100000 )
	  {
	    selectAlertType("Transfer Amount cannot be greater than $100,000");
	    return true;
	  }
  }
  return false;
}

function aboveMaxLimtAch15( tAmount , obj )
{
  //var fromAccount = obj.from_acctnum_list.options[obj.from_acctnum_list.selectedIndex].value;
  //var toAccount = obj.to_acctnum_list.options[obj.to_acctnum_list.selectedIndex].value;
  var fromAccount = obj.from_acctnum_list.value;
  var toAccount = obj.to_acctnum_list.value;
  var fromSource = getSource(fromAccount);
  var toSource = getSource(toAccount);

  if ( isIRAAccount(toAccount) && tAmount > 3500 )
  {   
    selectAlertType("Transfer Amount cannot be greater than $3,500");
    return true;
  }
  else if (( fromSource=="EXTERNAL" && toSource=="ETF") && tAmount > 10000 )
  {
    selectAlertType("Online deposits from external accounts are limited to $10,000 per E*TRADE account per day.");
    return true;        
  }
  else if ( (fromSource=="EXTERNAL" && toSource=="ETB") && tAmount > 10000 )
  {
    selectAlertType("Online deposits from external accounts are limited to $10,000 per E*TRADE account per day.");
    return true;        
  }
  else if ( fromSource=="ETB" && toSource=="ETB" && tAmount > 100000 )
  {
    selectAlertType("Transfer Amount cannot be greater than $100,000");
    return true;
  }
  
  return false;
}


function getFromKey(info)
{
    var acctId = info.split("|");
    var key = acctId[0] + ":"+acctId[6];
    return key;
}

function getItemSplit(info, delim,num)
{
	var splitinfo = eval("info.split('"+delim+"')");
	return eval("splitinfo['"+num+"']");
}

function getAccountNumFromList(info)
{
    var acctNumber = ((info.split("|"))||(info.split(" ")) ||( info.split("-")));
    return acctNumber[0];
}


function opt (obj, text, value)
{
    var optionName = new Option(text, value, false, false);
    var length = obj.to_acctnum_list.length;
    obj.to_acctnum_list.options[length] = optionName;
}

function truncateAccountType(acctType,balance,acctNum)
{
    var tacctType ="";
    var disStr="";
    var reqLength=0;

    disStr=acctType+" -"+acctNum+" $"+balance;

    if (disStr.length <= 32) {
	tacctType=acctType;
    }
    else {
	reqLength = 32 - ( disStr.length - acctType.length);
	tacctType = acctType.substring(0,reqLength);
    }

    return tacctType;
}

function truncateAccountNum(acctNum)
{
    var reqLength=0;
    var accountNum ="";

    reqLength  = acctNum.length - 4;
    accountNum = acctNum.substring(reqLength);

    return accountNum;
}

function createDisplayText(str)
{
    var strArr = str.split("|");
    var retStr="";
    var displayName="";
    var acctType = strArr[2];
    var acctName = strArr[1];

    var acctnum = truncateAccountNum(strArr[0]);
    if ( strArr[8]=="ETF" ) {
	//retStr = strArr[0] + "-" + strArr[1] + " " + "(Bal:$" + strArr[4] + ")";
	    if (acctName == "UNKNOWN") { 
	        if (acctType.indexOf("IRA") != -1)
	            displayName = "IRA";
	        else 
		    displayName = "Brokerage";
	} else 
		displayName = acctName;

	displayName = truncateAccountType(displayName,strArr[4],acctnum);
	retStr = displayName + " -"+" "+acctnum + "  "+"$"+strArr[4];

    }
    else if ( strArr[8]=="ETB" ) {
	var acctDesc = truncateAccountType(strArr[1],strArr[4],acctnum);

	retStr = acctDesc+" -"+ acctnum + "  " + "$" + strArr[4];
    }
    else if ( strArr[8]=="HELOC" ) {
	var balArr = strArr[4].split(";");

	    if (acctName == "UNKNOWN") 
	        displayName = "HELOC";
	    else
	        displayName = acctName;

	displayName = truncateAccountType(displayName,balArr[0],acctnum);
	retStr = displayName+" -"+ acctnum + "  " + "$" + balArr[0];
    }
    else if ( strArr[8]=="HEIL" ) {

	    if (acctName == "UNKNOWN") 
	        displayName = "HEIL";
	    else
	        displayName = acctName;

	displayName = truncateAccountType(displayName,strArr[4],acctnum);
	retStr = displayName+" -"+ acctnum + "  " + "$" + strArr[4];
    }
    else if ( strArr[8]=="AUTO" ) {

	    if (acctName == "UNKNOWN") 
	        displayName = "AUTO";
	    else
	        displayName = acctName;

	displayName = truncateAccountType(displayName,strArr[4],acctnum);
	retStr = displayName+" -"+ acctnum + "  " + "$" + strArr[4];
    }
    else if ( strArr[8]=="CREDITCARD" ) {
	acctnum=truncateAccountNum(strArr[1]);
	acctName=truncateAccountType(strArr[5],strArr[4],acctnum);
	retStr = acctName + " -"+ acctnum + "  " + "$" + strArr[4];
    }

    return retStr;
}

function createToHelocText(str)
{
    var strArr = str.split("|");
    var retStr="";
    var displayName="";
    var acctName = strArr[1];

    var acctnum = truncateAccountNum(strArr[0]);
    if ( strArr[8]=="HELOC" ) {
	var balArr = strArr[4].split(";");

	    if (acctName == "UNKNOWN") 
	        displayName = "HELOC";
	    else
	        displayName = acctName;

	displayName = truncateAccountType(displayName,balArr[1],acctnum);
	retStr = displayName+" -"+ acctnum + "  " + "$" + balArr[1];
    }

    return retStr;
}

function getSource(acctStr)
{
  return getFieldByIndex(acctStr, 8); // 8 is index of source.
}

function getFieldByIndex(acctStr, fieldIndex)
{
  if (acctStr == null)  return "";
  if (fieldIndex < 0) return "";
  
  var acctTokens = acctStr.split("|");
  
  if (acctTokens.length > fieldIndex)
  {
    return acctTokens[fieldIndex];
  }
  else
  {
    return "";
  }
}

function getMaxLimit(acctStr)
{
  if (acctStr == null)  return 0;
  
  var acctTokens = acctStr.split("|");
  
  if (acctTokens.length >= 13)
  {
    return parseFloat(acctTokens[12]); // 12 is index of limit.
  }
  else
  {
    return 0;
  }
}


function getAccountType(acctStr)
{
    var acctType="";
    if (acctStr != "") {
	if (acctStr == "default") {
	    acctType = acctStr;
	}
	else {
	    var acctToken = acctStr.split("|");
	    acctType= acctToken[2];
	}
    }
    return acctType;
}

function filterString(input)
{
    var returnString="";
    var i;
    filteredValues=",";
    whiteSpace=" ";

    for (i=0;i<input.length;i++) {
	var c = input.charAt(i);
	if (filteredValues.indexOf(c)==-1)
	    returnString +=c;

    }
    return returnString;
}

function isIRAAccount(acctStr)
{
    var acctType = acctStr.split("|");
    if  (acctType[2].toLowerCase().indexOf("ira") != -1) 
	return true;
    return false;
}
function getIRAType(acctStr){
	var acctType=acctStr.split("|");
	return acctType[9];
}

function ValidateForm(obj) 
{
	//obj.to_acctnum_list.disabled = false;
    var tAmount= obj.transfer_amount.value;

    //var fromAccount = obj.from_acctnum_list.options[obj.from_acctnum_list.selectedIndex].value;
	var fromAccount = obj.from_acctnum_list.value;
    //var toAccount = obj.to_acctnum_list.options[obj.to_acctnum_list.selectedIndex].value;
	var toAccount = obj.to_acctnum_list.value;
    var fromSource = getSource (fromAccount);
    var toSource = getSource (toAccount);
    var applyTo ="";
	if (obj.schtransfermode.value=="1" && obj.transfer_seq){
		applyTo = obj.transfer_seq.options[obj.transfer_seq.selectedIndex].value;
	}
    var decallowed = 2;
    if (fromAccount=="default") {
		selectAlertType("Please select From Account from the drop down list");
		return false;
    }
    
    if (!validateIraMsg(fromAccount)) {
		return false;
	}

    if (isIRAAccount(fromAccount)) {
		selectAlertType("You cannot transfer money from IRA accounts");
		return false;
    }

    if (toAccount=="default" || toAccount.length==0) {
		selectAlertType("Please select To Account from the drop down list");
		return false;
    }

    if (! tAmount) {
		selectAlertType("Please enter a transfer amount.");
		return false;
    }
		
	
    tAmount = filterString(tAmount);
	
    if (isNaN(tAmount) || isNaN(parseFloat(tAmount))) {
		selectAlertType("Please enter a valid transfer amount.");
		return false;
    }

    if (tAmount.indexOf('.') != -1){	
		var dectext = tAmount.substring(tAmount.indexOf('.')+1, tAmount.length);
	    /*
		if (
		    dectext > 0 &&
		    
		    !(fromSource == "ETF" &&
		      toSource == "ETF" && achMode >= 50) &&
	
		    !((fromSource == "ETF" &&
		       toSource == "EXTERNAL" ||
		       fromSource == "EXTERNAL" &&
		       toSource == "ETF") && achMode >= 50) &&
	
		    (fromSource != "HELOC" &&
		     toSource == "ETF" ||
	
		     fromSource == "ETF" && 
		     toSource != "HELOC" && 
		     toSource != "HEIL" &&
		     toSource != "AUTO" &&
		     toSource != "CREDITCARD")
		   )
		{
		    selectAlertType("Please enter only whole dollars for the Transfer Amount. ");
		    return false;
		} */

		if (dectext.length > decallowed){
		    selectAlertType("Please enter a number with up to " + decallowed + " decimal places.");
		    return false;
		}
    }

    Amount=parseFloat(tAmount);
    if (Amount <= 0) {
		selectAlertType("Transfer amount must be greater than 0. Please enter a valid amount.");
		return false;
    }

    if (applyTo=="default") {
		selectAlertType("Please indicate which transfers you wish to edit using the Apply To selection.");
		return false;
    }
    if ( aboveMaxLimt( tAmount , obj )) return false;
    return true;
}


function showAccountTypeRestrictionWarningMsg( fromAcct , toAcct )
{
    var showMsg = false;
    var fromSource = getSource( fromAcct);
    var toSource  = getSource( toAcct );
    var fromAcctType = getAccountType( fromAcct );
    var toAcctType   = getAccountType( toAcct);

    if ( fromSource == "ETF" ) {  //FromAccount is brokerage account
	if ( toSource == "ETB") {

	    if ( fromAcctType != toAcctType) {
		showMsg = true;
	    }

	}
    }
    else if ( fromSource == "ETB" ) { //From Account is bank account
	if ( toSource == "ETF" ) {

	    if ( fromAcctType != toAcctType) {
		showMsg = true;
	    }

	}
    }
    else { // for transfers other than from brokerage and bank
	showMsg=false;
    }

    return showMsg;
}

function show7DaysValidationOverrideMsg( fromAcct , toAcct )
{
    var showMsg = false;
    var fromSource = getSource( fromAcct);
    var toSource  = getSource( toAcct );
    var fromAcctType = getAccountType( fromAcct );
    var toAcctType   = getAccountType( toAcct);

    if ( fromSource == "ETF" ) {
	if ( toSource == "ETF" && isIRAAccount( toAcct ) ) {
	    showMsg=true;
	}
    }
    else if ( fromSource == "ETB" ) {
	if ( toSource == "ETF" && isIRAAccount( toAcct )) {
	    showMsg = true;
	}
    }
    else if ( fromSource == "EXTERNAL" ) {
	showMsg = true;
    }

    return showMsg;
}

function showAmountOverrideMsg (tAmount , obj )
{
    //var fromAccount = obj.from_acctnum_list.options[obj.from_acctnum_list.selectedIndex].value;
    //var toAccount = obj.to_acctnum_list.options[obj.to_acctnum_list.selectedIndex].value;
	var fromAccount = obj.from_acctnum_list.value;
    var toAccount = obj.to_acctnum_list.value;
    var fromSource = getSource(fromAccount);
    var toSource = getSource(toAccount);
    var msg = "";


    if ( isIRAAccount(toAccount) && tAmount > 3500 )
    {   
	msg = "Transfer amount limit $3500 to IRA account."; 
    }
    else if ( fromSource=="EXTERNAL" && toSource=="ETF" && tAmount > 10000 )
    {
	msg = "Transfer amount limit $10,000 from external to brokerage account.";
    }
    else if ( fromSource=="ETB" && toSource=="ETB" && tAmount > 100000 )
    {
	msg = "Transfer amount limit $100,000 from Etrade bank to  another Etrade bank account.";

    }
    return msg;
} 

 
//gets linked external accounts for given E*trade bank account 
function linkedExtAcctsForEtBankAcct(obj, pageSource)
{

	if (extAcctStrList!=""){
		var extAcctsStr = extAcctStrList.split("~"); 
		var extAcctsCount = extAcctsStr.length;

			      //loop thru "external acct str" for given external acct
		for(k=0; k<extAcctsCount; k++) {	
			var extAcctInfo = extAcctsStr[k].split("|");
			
			var extLinkAcctNum = extAcctInfo[0] + ":" + extAcctInfo[6];
			
			//if( acctNumFrmLinkStr != extLinkAcctNum)
			// continue; 
			
			var formattedInstName = "";
			
			var formattedAcctNum = "";
			
			if(pageSource == "AccountsCombo") {
				formattedInstName = extAcctInfo[5].substring(0,24);
				formattedAcctNum = truncateAccountNum(extAcctInfo[0]);
			} 
			else {
				formattedInstName = extAcctInfo[5].substring(0,29);
				formattedAcctNum = truncateAccountNum(extAcctInfo[0]);
			} 

			formattedInstName=(formattedInstName=="")?'EXTERNAL':formattedInstName;
					
			var extAcct = ''; 
			var qsMode = ''; 
			var urlInfo = '';
			
			if (extAcctInfo[11] != null && extAcctInfo[11]=="true") {
				//formattedAcctNum += '*';
				extAcct = 'Verify';
				qsMode = "mode=4";
				//urlInfo = "/verifyextacct?extAcctInfo=" + escape(qsMode+"|xRoutNo="+extAcctInfo[7]+"|xInstNo="+extAcctInfo[6]+"|xAcctNo="+extAcctInfo[0]);
				urlInfo = "/viewextacctpage?_formtarget=viewlinkextaccts&extAcctInfo=" + qsMode +"|xRoutNo="+extAcctInfo[7]+"|xInstNo="+extAcctInfo[6]+"|xAcctNo="+extAcctInfo[0];
			}
			else if (extAcctInfo[14] != null && extAcctInfo[14]=="true") {				
				extAcct = 'Activate';
				qsMode = "mode=7";
				urlInfo = "/viewextacctpage?_formtarget=viewlinkextaccts&ExtAcctAction=7&extAcctInfo=" + escape(qsMode+"|xRoutNo="+extAcctInfo[7]+"|xInstNo="+extAcctInfo[6]+"|xAcctNo="+extAcctInfo[0]);
			}			
			   
			 var rowId = extAcctInfo[0]+"_"+formattedInstName.substring(0,1)+formattedInstName.substring(formattedInstName.length-1);	
			 var goToApp = '';
			 if(jsAppName == "genietools") 
			 	goToApp = jsAppName;
			 else if (jsAppName == "accounts" || jsAppName == "bank" || jsAppName == "ibank")
			 	goToApp = 'accounts';
			 var hrefValue = "javascript:GoToETURL('/e/t/" + goToApp + urlInfo + "', 'etrade')";
			 
			 createToXAccRow(rowId, extAcctsStr[k], formattedInstName+" - "+formattedAcctNum, extAcct, hrefValue);
		     //  opt(obj, formattedInstName+" - "+formattedAcctNum, extAcctsStr[k]); 
			 		      
		}
	}
	   
} 

function changeToAccountList(obj) {
  //alert("Function changeToAccountList -> \nacctStrList: " + acctStrList + "\nbankAcctStrList: " + bankAcctStrList);
	/*
  obj.to_acctnum_list.options.length = 0;
  obj.to_acctnum_list.options[0] = new Option ("---------- Select To Account ----------             ","default",false,true);
  
  var fromAccount = obj.from_acctnum_list.options[obj.from_acctnum_list.selectedIndex].value;
  var toAccount = obj.to_acctnum_list.options[obj.to_acctnum_list.selectedIndex].value;
  */
 
 //Remove all rows in Transfer To list, reset the Transfer To input
  $('#etToAccounts > li:not(:first)').remove();
  obj.to_acctnum_list.value = "default";	
  document.getElementById('to_acct_input').value = "Select To Account";
  _ToSelectedRowId = '';
  _ToSelectedOrgClassOld = '';
  _ToCurrRowID_UpDown = '';
  
  var fromAccount = obj.from_acctnum_list.value;			   
  //var toAccount = obj.to_acctnum_list.value;
  var fromSource = "";
  var counter = 0; //define property
  var tmpAcctArr="";
  
  this.counter = counter; //to be used for counting records being added to options
  //get array of accounts using inner function createArr(arrStr)  
  etBankArr = createArr(bnkAcctStr);
  helocArr = createArr(helocAcctStr);
  heilArr = createArr(heilAcctStr);
  brkgIRAArr = createArr(brkgIRAAcctStr);
  brkgArr = createArr(brkgAcctStr);
  creditCardArr = createArr(creditCardAcctStr);

  var brkgNonIRAArr = [];
	var brkgStr;
	for ( var i = 0; i < brkgArr.length; i++) {
		brkgStr = brkgArr[i];
    //get nonIRABrkgAccounts
		if(!isIRAAccount(brkgStr)) {
      brkgNonIRAArr.push(brkgStr);
	  }
  }

//alert("Brkg IRA: " + brkgIRAArr +"\n\nBrkg: " + brkgArr);
//alert("changeToAccountList -> fromAccount: " + fromAccount);
  if ( fromAccount != "default"  && fromAccount.indexOf("|") == -1 ) {
    //obj.to_acctnum_list.disabled = true;
	  obj.to_acct_input.disabled = true;
	  obj.to_acct_input.style.backgroundImage ="url('" + AkamaiURL + "/images/disabled-dd.gif')";
    openAccount(fromAccount);
  }
  else {
    if ( fromAccount == "default") {
	    //obj.to_acctnum_list.disabled = true;
	    obj.to_acct_input.disabled = true;
	    obj.to_acct_input.style.backgroundImage ="url('" + AkamaiURL + "/images/disabled-dd.gif')";
    }
    else {
	    //obj.to_acctnum_list.disabled = false;
	    obj.to_acct_input.disabled = false;
	    obj.to_acct_input.style.backgroundImage ="url('" + AkamaiURL + "/images/enabled-dd.gif')";
    }

    fromSource = getSource(fromAccount);	


    var from = fromSource;
	  var bankCount=0;
	  var brkgCount=0;
	  var brkgIRACount=0;
	  var brkgNonIRACount=0;
	  var helocCount=0;
	  var heilCount=0;
	  var ccCount=0;
	  var frmAcctNum = (fromAccount.indexOf("|") != -1)? fromAccount.split("|") : fromAccount;

//    getHashtab(); //call to hashtab after form load (onetime)

    for( var key in hashtab ) {		
//alert("changeToAccountList -> key: " + key + "\nhashtab[key]: " + hashtab[key]);
      if (from == key ) {
        var vals = hashtab[key];
//alert("changeToAccountList -> key: " + key + "\nfrom:" + from + "\nvals: "+ vals);
        if(jsAppName=="plan") {
          switch(from) {
            case "EXTERNAL":
              //link external accts
              //optionAddExternalAccount(obj);
              //if there are no bank accounts and not genietools, add open account url
              //optionOpenAccount(obj, etBankArr, bankUrlName, bankUrlValue);
              //get all External Accounts
              isValidAccount(obj);
              break;
            case "ETF":
            case "ETB": /* populate IRA accounts */
              createOption(obj, brkgIRAArr, createDisplayText);
              break;
          }
          return;
        }

        var valsArr=[];
        try {
          valsArr=vals.split(",");
        }
        catch(e) {
            alert("caught exception:name="+e.name+" message="+e.message);
        }
//alert("vals: "+ vals +"\narry: " + valsArr);
        if( valsArr.length > 0 ) {
          for ( var i=0; i<valsArr.length;i++) {
            val=valsArr[i];
//alert("valsArr: " + valsArr + "\nfrom: " + from + ", val["+ i +"]: " + val);

            switch(val) {
              case "ETF": //ETRADE Brokerage
                if(from==val) { //check against current brokerage account selected (not to be included in TO list)
               	  var frmAcctNum = fromAccount.split("|")[0];
                }
            	  if(achMode>=50 || from != "ETF") { //check for achMode only when from == "ETF"
                  /* populate Brokerage accounts with nonIRABrkgAccounts */
                  this.counter = brkgNonIRACount;
                  createOption(obj, brkgNonIRAArr, createDisplayText, true, frmAcctNum);
                  brkgNonIRACount = this.counter;
          	    }
                break;
              case "ETB": //ETRADE Bank
          	    /* populate bank accounts */
                if(from==val) { //check against current bank account selected (not to be included in TO list)
               	  var frmAcctNum = fromAccount.split("|")[0];
                }
                this.counter = bankCount;
                createOption(obj, etBankArr, createDisplayText, true, frmAcctNum);
                bankCount = this.counter;
                break;
              case "IRA": //ETRADE IRA
                this.counter = brkgIRACount;
                createOption(obj, brkgIRAArr, createDisplayText, true);
                brkgIRACount = this.counter;
                break;
              case "EXTERNAL": //ETRADE External
                //External accounts list for TO list
                //isValidAccount(obj);
                break;
              case "HEIL": //ETRADE HEIL
                //add heil
                this.counter = heilCount;
                createOption(obj, heilArr, createDisplayText, true);
                heilCount = this.counter;
                break;
              case "HELOC": //ETRADE Heloc
            	  /* populate heloc accounts */
                this.counter = helocCount;
                createOption(obj, helocArr, createToHelocText, true);
                helocCount = this.counter;
                break;
              case "CREDITCARD": //ETRADE CreditCard
            	  /* populate Credit Card accounts */
                this.counter = ccCount;
                createOption(obj, creditCardArr, createDisplayText);
                ccCount = this.counter;
                break;
              case "AUTO": //ETRADE Auto
                break;
              case "AddExternalAccount": //ETRADE External Account List and Add Link
              	createAccHeader();
                switch(from) {
                  case "ETF":
                	  //add external accts, for sl=40
              	    if(achMode>=40)linkedExtAcctsForEtBankAcct(obj, "AccountsCombo");
              	    //if there are no bank accounts and not genietools, add open account url
                    //optionOpenAccount(obj, etBankArr, bankUrlName, bankUrlValue);
                    break;
                  case "ETB":
                    //link external accts
                    //optionAddExternalAccount(obj);
                    //add external accts 
                	  linkedExtAcctsForEtBankAcct(obj, "AccountsCombo");
              	    //if there are no heloc/heil accounts add open account url
                    //if there are no brokerage accounts and not genietools, add open account url
                    //optionOpenAccount(obj, brkgArr, brkgUrlName, brkgUrlValue);
                    break;
                  case "EXTERNAL":
                    //link external accts
                    //optionAddExternalAccount(obj);
                    //if there are no bank accounts and not genietools, add open account url
                    //optionOpenAccount(obj, etBankArr, bankUrlName, bankUrlValue);
                    break;
                }
                break;
            }
          }//end of 'for' loop
        }
      }
    }// \for loop
	
  }
  setRowClass($('#etToAccounts > li:not(:has(ul.title))'), $('#to_acct_input'));
  initTransferAcctDiv($('#etToAccounts > li:not(:has(ul.title),:has(div.xAcctTxtDisabled))'), $('#to_acct_input'));
  //initTransferAcctDiv($('#etToAccounts > li:not(:has(ul.title))'), $('#to_acct_input'));
  
  //Get IRA Message
  validateIraMsg(fromAccount);
  
  //inner function - get array of accounts from arrStr
  function createArr(arrStr) {
    var arr="";
    if(arrStr != null && arrStr.indexOf("|") != -1) { 
      arr = arrStr.split("~");
    }
    return arr;
  }

  //inner function - create to account options with appropriate account
  // set option val / text, compare current value, increment counter
  function createOption(obj, arr, fnCreateText, counter, curAcctNum) {
    for(var i = 0; i < arr.length; i++) {
      var optionStr = arr[i];
      if(!curAcctNum || curAcctNum != optionStr.split("|")[0]) {
        var val = optionStr;
        var txt = fnCreateText(optionStr);
        //alert("For " +obj+ "\ntext: "+txt+ "\nval: " + val);
        //opt(obj, txt, val);
		createToAccRow(val, txt);
        
        if(counter) {
          ++this.counter;
        }
      }
    }
  }

  //inner function - set option to open account
  //bank - optionOpenAccount(obj, etBankArr, bankUrlName, bankUrlValue)
  //brokerage - optionOpenAccount(obj, brkgArr, brkgUrlName, brkgUrlValue)
  function optionOpenAccount(obj, acctArr, urlName, urlVal) {
    //if there are no bank accounts and not genietools, add open account url
    if ( acctArr.length == 0 && jsAppName!='genietools') {
      //opt(obj,urlName,urlVal);
	  createToAccRow(urlVal, urlName);
    }
  }
  
  //inner function - option to add external account. TBD: no longer needed
  function optionAddExternalAccount(obj) {
    //link external accts
    if(jsAppName!="genietools") {		
      if (jsAppName == "bank" || jsAppName == "ibank")
        opt(obj,"Add External Account","javascript:GoToETURL('/e/t/bank/LinkExtAcctPage?appName=bank&pageName=home','etrade')");
      else
        opt(obj,"Add External Account","javascript:GoToETURL('/e/t/accounts/LinkExtAcctPage?appName=accounts&pageName=AccountsCombo','etrade')"); 
    }
  }
}

function validateIraMsg(fromAcct) {
	// Get IRA Message; Returns true if the account is valid for transfer, false if can't use the account.
	var enableIraMsgValidation = true;
	var fromIraMsg = null;
	//var iraAccts = $("input[name='ira_brkg_acct_str']").val();
	var iraSubst = "";
	var iraDesc = null;

	if (enableIraMsgValidation && typeof(getIRAMsg) == "function") {
		// iraSubst = iraAccts.substr(iraAccts.indexOf(fromAcct));
		// Using brkgFrmAcctStr instead
			
		if(brkgFrmAcctStr.indexOf(fromAcct)>-1){
		
		    iraSubst = brkgFrmAcctStr.substr(brkgFrmAcctStr.indexOf(fromAcct));
			//brkgFrmAcctStr.substr(-1) doesn’t work for IE. 
			var end = iraSubst.indexOf("~");
			if (end < 0) { end = iraSubst.length; }
			iraDesc = iraSubst.substring(fromAcct.length + 1, end);
		    fromIraMsg = getIRAMsg(iraDesc);
		}
		
		if (fromIraMsg) {
		    // Can't transfer from Ira Account.
			$("#transferbutton").attr("src", AkamaiURL + "/images/b_previewtransfer_green_inactive.gif");
			$("#to_acct_input").attr("disabled", true);
			$("#to_acct_input").css("background-image", "url('" + AkamaiURL + "/images/disabled-dd.gif')");
			selectAlertType(fromIraMsg.replace(/"/g, "\\\""));
			return false;
		} else {
		    // Can use account so clear the error message.
			$("#transferbutton").attr("src", AkamaiURL + "/images/b_previewtransfer_green.gif");
			$("#errorMsg").html("");
		}
	}
	
	return true;
}

function createAccHeader() {
	var ul = document.getElementById(ulId);
	var li = document.createElement('li');
	var ul2 = document.createElement('ul');
	ul2.setAttribute("id", "xToAccHeader");
	ul2.setAttribute("class", "title");
	
	var li_1 = document.createElement('li');
		
	var txt1 = "External Accounts  ";
	li_1.appendChild(document.createTextNode(txt1));
	
	if (jsAppName != "genietools") {
		var anchor = document.createElement('a');
		var hrefValue = "javascript:GoToETURL('/e/t/accounts/LinkExtAcctPage?appName=accounts&pageName=accountscombo','etrade')";
				
		anchor.setAttribute("href", hrefValue);
		anchor.appendChild(document.createTextNode('(Add Account)'));
		anchor.setAttribute("class", "add_acct");
		li_1.appendChild(anchor);
	}
	ul2.appendChild(li_1);
	/*var li_2 = document.createElement('li');
	li_2.setAttribute("style", "padding-left:100px;text-align:right;");
	li_2.appendChild(document.createTextNode("Available Balance"));
	ul2.appendChild(li_2);*/
	
	li.appendChild(ul2);
	ul.appendChild(li); 
	if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
		if (document.getElementById('xToAccHeader')) {		
			document.getElementById('xToAccHeader').className = 'title'; 
			if (jsAppName != "genietools")
				document.getElementById('xToAccHeader').childNodes[0].childNodes[1].className = "add_acct";
			//if (document.getElementById('xToAccHeader').childNodes[0]) document.getElementById('xToAccHeader').childNodes[0].style.paddingLeft = "6px";
		}
	}
	
}

function createToAccRow(value, text){
	var textColClass = "textCol";
	var balCol = 'balanceCol';
	var rowPadR = 'rowPaddingR';
	var rowPadL = 'rowPaddingL';
	var ul = document.getElementById(ulId);
	var li = document.createElement('li');
	var acctNum = value.substring(0,value.indexOf('|')); 
	var bal = text.substring(text.indexOf('$'));
	//li.setAttribute("id", value);
	var rId = text.substring(0,1)+"_"+acctNum;
	li.setAttribute("id", acctNum);
	
	var div = document.createElement("div");
	div.setAttribute("class", textColClass);
	
	var span = document.createElement("span");
	span.setAttribute("class", rowPadL);
	span.appendChild(document.createTextNode(text.substring(0,text.indexOf('$'))));
	
	div.appendChild(span);	
	li.appendChild(div);
	
	var div2 = document.createElement("div");
	div2.setAttribute("class", balCol);
	
	var span2 = document.createElement("span");
	span2.setAttribute("class", rowPadR);
	span2.appendChild(document.createTextNode(bal));
	
	div2.appendChild(span2);	
	li.appendChild(div2);

	ul.appendChild(li);
	_ToAccList[acctNum] = value;
	
	if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
		if (document.getElementById(acctNum)) {			
			if (document.getElementById(acctNum).childNodes[0]) {
				document.getElementById(acctNum).childNodes[0].className = textColClass;
				if (document.getElementById(acctNum).childNodes[0].childNodes[0])
					document.getElementById(acctNum).childNodes[0].childNodes[0].className = rowPadL;
			}
			if (document.getElementById(acctNum).childNodes[1]) {
				if (document.getElementById(acctNum).childNodes[1].childNodes[0]) {
					document.getElementById(acctNum).childNodes[1].childNodes[0].className = rowPadR;
				}	
				document.getElementById(acctNum).childNodes[1].className = balCol;
				
			}
			//alert(document.getElementById(acctNum).innerHTML);
				
		}	
	}
	
}

function createToXAccRow(rowId, value, text, xAccType, goToUrl){
	var textColClass = "textCol";
	var txt = "Activate";
	var rowPadR = 'rowPaddingR';
	var rowPadL = 'rowPaddingL';
	
	
	var acctNum = rowId;//value.substring(0,value.indexOf('|'));
	//var acctNum = Math.floor(Math.random()*1111); 
	var bal = text.substring(text.indexOf('$'));

	var ul = document.getElementById(ulId);
	var li = document.createElement('li');
	//li.setAttribute("id", rowId);
	
	//li.setAttribute("id", rowId);
	li.id = rowId;
	
	
	var span = document.createElement("span");
	//span.setAttribute("class", rowPadL);
	span.appendChild(document.createTextNode(text));
	
	var div = document.createElement("div");
	
	
	if (xAccType != null && xAccType.length > 0) {
		textColClass = "xAccTextCol";				
		
		if (jsAppName == 'genietools') {   					
			
			span.setAttribute("class", rowPadL);
			div.appendChild(span);
			div.setAttribute("class", "xAcctTxtDisabled");			
			
			li.appendChild(div);		
			
			var span2 = document.createElement("span");
			
			span2.setAttribute("class", "xAcc_disabled");
	
			span2.appendChild(document.createTextNode(xAccType));
			li.appendChild(span2);			
			
		}
		else {
			var anchor = document.createElement('a');
			anchor.setAttribute("href", goToUrl);
			
			//span.setAttribute("class", textColClass);
			span.className = textColClass + " " + rowPadL;
			anchor.appendChild(span);

			var span2 = document.createElement("span");
			
			span2.setAttribute("class", "xAcc_verify");
						
			
			span2.appendChild(document.createTextNode(xAccType));
			anchor.appendChild(span2);
			li.appendChild(anchor);
		}	
		
	}
	else {
		span.setAttribute("class", rowPadL);
		div.setAttribute("class", textColClass);
		div.appendChild(span);
		
		li.appendChild(div);
		
		_ToAccList[rowId] = value;
	}
	
	ul.appendChild(li);
	
	if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
		if (xAccType != null && xAccType.length > 0) {
			var divElm = '';
			var spanElm = '';
			var txtClass = "xAccTextCol";
			var xAcctBtn = "xAcc_verify";
			if (jsAppName == 'genietools') {
				txtClass = "xAcctTxtDisabled";
				xAcctBtn = "xAcc_disabled";
			}
			
			if (document.getElementById(rowId).childNodes[0]) {				
				divElm = document.getElementById(rowId).childNodes[0].childNodes;
				if (jsAppName == 'genietools')
					document.getElementById(rowId).childNodes[0].className = txtClass;
			}
			
			//Set classs for 2nd SPAN	
			if (document.getElementById(rowId).childNodes[1]) {
				document.getElementById(rowId).childNodes[1].className = xAcctBtn;				
			}			
			
			//var s = '';
			var n = 0;
			for (var i = 0; i < divElm.length; i++) {
				
				if (divElm[i].nodeName.toLowerCase() == 'span') {
				
					if (n > 0) {						
						divElm[i].className = xAcctBtn;
					}
					else {						
						divElm[i].className = txtClass+" "+rowPadL;
					}
					
					n++;
				}
			//s += "node nanm: " + divElm[i].nodeName + "\t... class: " + divElm[i].className +"\n" +"HTML::: "+divElm[i].innerHTML+"\n .....spanHTML: "+spanElm.innerHTML;
			
			}
				
			//alert("s= "+s+"\n\nrow: "+document.getElementById(rowId).innerHTML);
		}
		else {
			
			if (document.getElementById(rowId).childNodes[0]) 
				document.getElementById(rowId).childNodes[0].className = textColClass;
			if (document.getElementById(rowId).childNodes[0].childNodes[0]) 
				document.getElementById(rowId).childNodes[0].childNodes[0].className = rowPadL;
				
		}		
	}	
}


// where the hashtab object is formed by server and passed to an
// innerHTML div tag 
//this  will give the value of Transfer Properties
var hashtab = new Object(); // Global Var

function getHashtab(doc){
//  var jsonXfrRulesStr = document.getElementById('JsonXfrRules').value;
var jsonXfrObj = jsonXfrRulesStr; //Js variable defined in pict/schxfr/schxfrform_selectfrom_15.html
  //alert("jsonXfrObj= "+jsonXfrObj);
/*
  var jsonXfrObj = [
    {"FromType":"ETB","ToType":"ETF"}, //ETRADE BANK
    {"FromType":"ETB","ToType":"ETB"},
    {"FromType":"ETB","ToType":"IRA"},
    {"FromType":"ETB","ToType":"EXTERNAL"},
    {"FromType":"ETB","ToType":"HEIL"},
    {"FromType":"ETB","ToType":"HELOC"},
    {"FromType":"ETB","ToType":"CREDITCARD"},
    {"FromType":"ETB","ToType":"AUTO"},
    {"FromType":"ETF","ToType":"ETF"}, //ETRADE BROKERAGE
    {"FromType":"ETF","ToType":"ETB"},
    {"FromType":"ETF","ToType":"IRA"},
    {"FromType":"ETF","ToType":"EXTERNAL"},
    {"FromType":"ETF","ToType":"HEIL"},
    {"FromType":"ETF","ToType":"HELOC"},
    {"FromType":"ETF","ToType":"CREDITCARD"},
    {"FromType":"ETF","ToType":"AUTO"},
    {"FromType":"HELOC","ToType":"ETF"}, //ETRADE HELOC
    {"FromType":"HELOC","ToType":"ETB"},
    {"FromType":"EXTERNAL","ToType":"ETF"}, //EXTERNAL
    {"FromType":"EXTERNAL","ToType":"ETB"},
    {"FromType":"EXTERNAL","ToType":"IRA"},
    {"FromType":"ETF","ToType":"AddExternalAccount"}, //AddExternalAccount Link
    {"FromType":"ETB","ToType":"AddExternalAccount"},
    {"FromType":"EXTERNAL","ToType":"AddExternalAccount"}
  ];
*/
//  var jsonXfrObj = eval("(" + jsonXfrPropStr + ")");
  
  var maplist = jsonXfrObj,
    mapVals = "";
  //alert("getHashtab -> jsonXfrObj: "+ jsonXfrObj); // + ", maplist.length: "+ maplist.length);
  if (jsonXfrObj == undefined || jsonXfrObj == null) {
//alert("getHashtab -> return EMPTY (no mapping)");
    return hashtab; //no mapping
  }
//alert("mapping returned");
  for (var i = 0; i < maplist.length; i++) {
    var map = maplist[i];
    for (var key in map) {
      if (key == 'FromType') {
        var fromkey = map[key];
      }
      else if (key == 'ToType') {
        if (hashtab[fromkey] == null) 
          hashtab[fromkey] = map[key];
        else 
          hashtab[fromkey] = hashtab[fromkey] + "," + map[key];
      }
//alert("getHashtab -> \nkey: [" + key + "], fromkey: [" + fromkey + "]\nhashtab[fromkey]: [" + hashtab[fromkey] + "], map[key]: [" + map[key] +"]");
    }
  }
//  for( var key in hashtab) alert("getHashtab -> key: " + key + "\nhashtab[key]: " + hashtab[key]);
  return hashtab; //mapping returned
}

function isValidAccount(obj) {
//alert("Function isValidAccount -> \nacctStrList: " + acctStrList + "\nbankAcctStrList: " + bankAcctStrList);
  //var accountIndex = obj.from_acctnum_list.options[obj.from_acctnum_list.selectedIndex].value;
	var accountIndex = obj.from_acctnum_list.value;
  //var accountText = obj.from_acctnum_list.options[obj.from_acctnum_list.selectedIndex].text;

  var frmAcctNum =  getFromKey(accountIndex);
  var accountList = new Array();
  var linkAcctList = new Array();  
  var listOfaccounts = new Array();
  var listOfEtBankAccounts = new Array();
  var acctListCount = 0;
  var linkAcctCount = 0;
  var linkAcctInfo, linkAcctInfoList, accountInfo , acctId, acctName, acctType,acctMode, acctBalance;

    if (acctStrList != null && acctStrList.indexOf("|") != -1)
    {
         listOfaccounts = acctStrList.split("^");
    
         for (x=0; x < listOfaccounts.length; x++)
         {
             var  linkAcctInfoStrFromList =  listOfaccounts[x];

             accountList[acctListCount] = new accountRecord(linkAcctInfoStrFromList, acctListCount);
			 
	     	acctListCount += 1;
         }
    }
 
    //alert("values of acctListCount :" + acctListCount); 
 
    if (bankAcctStrList != null && bankAcctStrList.indexOf("|") != -1)
    {
         listOfEtBankAccounts = bankAcctStrList.split("^");
 
         for (h=0; h < listOfEtBankAccounts.length; h++)
         {
        
             var  linkEtBankAcctInfoStrFromList =  listOfEtBankAccounts[h];

             accountList[acctListCount] = new accountRecord(linkEtBankAcctInfoStrFromList, acctListCount);
    
	    	 acctListCount += 1;
         }
 
    }

  
    for (y=0; y<accountList.length; y++)
    {

		var combinedaccountlist=accountList[y].name;
		var acctArray = combinedaccountlist.split("~");
	
		for (k=0;k<acctArray.length;k++){
			var acctInfo = acctArray[k].split("|");
		    var subLinkAcctNum = getItemSplit(acctInfo[0],"|",0);
		    var subLinkAcctType = getItemSplit(acctInfo[2],"|",0);
		    var subLinkAcctBal = getItemSplit(acctInfo[4],"|",0);
		    var sublinkAcctSource = getItemSplit(acctInfo[8],"|",0);
		    var truncatedAcctNum = truncateAccountNum(subLinkAcctNum);
			var displayAcctName=truncateAccountType(acctInfo[1],acctInfo[4],truncatedAcctNum);
			
			if(displayAcctName == "UNKNOWN"){
				if (sublinkAcctSource == "ETF"){ 
					if (subLinkAcctType.toLowerCase().indexOf("ira") != -1)
					displayAcctName="IRA";
					else 
					displayAcctName="Brokerage"; 
				} 
			} 
				
		if(jsAppName=='plan'){
			if(sublinkAcctSource == "ETF" && subLinkAcctType == 'IRA'){ 
			linkAcctList[linkAcctCount] = new linkAccountRecord(displayAcctName+" -"+ truncatedAcctNum + " $" +subLinkAcctBal  ,acctArray[k]);
			linkAcctCount += 1;
			}
		}
		else{ 
			linkAcctList[linkAcctCount] = new linkAccountRecord(displayAcctName+" -"+ truncatedAcctNum + " $" +subLinkAcctBal  ,acctArray[k]);
			linkAcctCount += 1;
		}
		
	    }
	}

    for(w=0; w<linkAcctList.length; w++)
    {
	   // opt(obj, linkAcctList[w].name, linkAcctList[w].value);
	   createToAccRow(linkAcctList[w].value, linkAcctList[w].name);
    }

}    
function accountRecord(name,value)
{
    this.name = name;
    this.value = value;
}

//function linkAccountRecord(acctId, name, value) : ach2.0
function linkAccountRecord(name, value)
{
    //this.acctId = acctId; : ach2.0
    this.name = name;
    this.value = value;
}

function disableScheduleXfr(obj)
{
    //var toAccount = obj.to_acctnum_list.options[obj.to_acctnum_list.selectedIndex].value;
    //var fromAccount = obj.from_acctnum_list.options[obj.from_acctnum_list.selectedIndex].value;
	var toAccount = obj.to_acctnum_list.value;
    var fromAccount = obj.from_acctnum_list.value;

    var toSource = getSource(toAccount);
    var fromSource = getSource(fromAccount);

    if(typeof(obj.transfer_date)!="undefined") 
    {
	if (fromSource == "EXTERNAL" && (toSource == "ETF"))
	{

	    var currDate = new Date();
	    fmonth=eval(currDate.getMonth()+1);
	    fmonth=(fmonth<10)?"0"+fmonth:fmonth;
	    fdate=(currDate.getDate()<10)?"0"+currDate.getDate():currDate.getDate();
	    fyear=currDate.getFullYear().toString().substring(2,4);
	    var today = fmonth+"/"+fdate+"/"+fyear;	    
	    var achVer = parseFloat (achMode);

	    if (isNaN(achVer)) achVer = 20;
      
            if (achVer >= 30)
            {
  	      obj.transfer_date.disabled = false; 
	      obj.transfer_freq.disabled = false; 
	    }
	    else
	    {
			obj.transfer_date.disabled = true; 
			obj.transfer_freq.disabled = true; 
			obj.transfer_date.value=today;
			obj.transfer_freq.options[0].selected=true;
	    }
	}
	else	
	{
	    obj.transfer_date.disabled = false; 
	    obj.transfer_freq.disabled = false; 
	}
    }
}

function ValidateInputForm(obj){
    if(ValidateForm(obj) == false) {
	return false
	    }

    //var toAccount = obj.to_acctnum_list.options[obj.to_acctnum_list.selectedIndex].value;
	var toAccount = obj.to_acctnum_list.value;
    var toSource = "";

    toSource = getSource(toAccount);
	
	if(typeof(obj.transfer_date)!="undefined") {
		    var dt=obj.transfer_date.value;
		
		    if (isValidDate(dt, obj, "QTW")==false){
			    return false;
		    }
		}
	
    return true;
}

function selectAlertType(str){
if(errBoxFlag)ErrorBox(str);
else alert(str);
}

//return current year from system date
function defaultSysYear(){
		//alert("default sys date");
		currDate = new Date();
		year=currDate.getFullYear().toString().substring(0,4);	
		return year;
}

function getCurrYear(){
//globalTimeStamp var should be defined like this in a template:
//var globalTimeStamp="<et:variable name="/global/TimeStamp"/>";
//global TimeStamp evaluates to this format today:: December 1, 2004 1:43:52 PM EST		
//if globalTimeStamp is defined somplace use it else use default system date
	if(typeof globalTimeStamp!='undefined'){
		x=globalTimeStamp;
		st=eval(x.indexOf(",")+2);
		end=eval(st+4);
		year=x.substring(st,end);
		//if year is malformed , default to system date			
		if(year==""||year.length!=4||isNaN(year)||year.substr(0,1)!=20){
			year=defaultSysYear();
		}
	}
	else {
		year=defaultSysYear();
	}
return year;
}

//get annual IRA contribs
var ira_contrib_array = [[2004, 3000, 500], [2005, 4000, 500], [2006, 4000, 1000], [2007, 4000, 1000], [2008, 5000, 1000]];

function getIRAlimits(the_year){

currYear=getCurrYear();
isYearMissing=true;

for (i=0;i<ira_contrib_array.length;i++){
	if (ira_contrib_array[i][0]==the_year){ 
		isYearMissing=false;
		break;}
}
//if the year is missing in ira_contrib_array default to current year
if (isYearMissing)the_year=currYear;

	for (i=0;i<ira_contrib_array.length;i++){
		if(ira_contrib_array[i][0]==the_year){
			return 	ira_contrib_array[i];
		}
	}
}


//function to print any given array;
function print_r(id){
x="";
//alert(id.length);
for (i=0;i<id.length;i++) x=x+" "+id[i]+"\n";
alert(x);
};
