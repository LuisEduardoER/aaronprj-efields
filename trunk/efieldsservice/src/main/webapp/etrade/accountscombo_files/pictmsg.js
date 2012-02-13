
    var BANK_BRKG = "4";
    var BRKG_BANK = "5";
    var EXT_BRKG = "6";
    var BRKG_IRA = "7";
    var BANK_BANK = "8";
    var BANK_IRA = "9";
    var BRKG_BRKG = "15";
		var CREDITCARD = "17";
    var HELOC_BRKG = "100";
    var HELOC_BANK = "101";
    var BANK_HELOC = "102";
    var BANK_HEIL = "103";
    var BRKG_HELOC = "104";
    var BRKG_HEIL = "105";
    var EXT_BANK = "106";
    var BANK_EXT = "107";
    var BANK_AUTO = "108";
    var BRKG_AUTO = "109";
	var BRKG_EXT = "110";
		
function getXfrMsg(xfrType, postdate, type, fmpstatus, buypower, postdays, pardep,frequency)
{
    var msg = "";	
	
	if (type == 'RT' && (xfrType == BANK_BRKG || xfrType == BRKG_BANK 
				|| xfrType == BANK_BANK || xfrType == EXT_BRKG|| xfrType  == CREDITCARD|| xfrType == BRKG_BRKG))
		postdate = "<b>today</b> ";
	else
		postdate = "on <b>" + postdate+"</b>";
	
	if (type == 'SCH' && (xfrType == BANK_BRKG || xfrType == BRKG_BANK 
				|| xfrType == BANK_BANK || xfrType == BANK_IRA || xfrType == BRKG_IRA|| xfrType == BRKG_BRKG))
		when = " on that date";
	else 
		when = "";
	
	if(xfrType == BANK_BRKG ){
			if (type == 'SCH') {xtramsg=" before Market open"; 
     		msg = "transfer will post to your accounts " +  postdate + ", and funds will be immediately available for investment upon posting."; }
			else msg ="transfer will post to your accounts <b>today</b>, and funds will be immediately available for investment upon posting.";
	}
	if(xfrType == BRKG_BANK || xfrType == BRKG_BRKG)
			msg = "transfer will post to your accounts " + postdate + ", and funds will be immediately available for withdrawal upon posting.";
		
    if(xfrType ==  EXT_BRKG )
	{ 
            if (type == 'RT') 
			{
            	if (fmpstatus==1) { //check if full deposit available			   
			   	msg= "transferred funds will be available for investment immediately and will be available for withdrawal on the 6<sup>th</sup> business day after the day of deposit.<br><br>If this is your initial deposit, funds will be available for investment and withdrawal on the 8<sup>th</sup> business day after the day of deposit. <a href='/e/t/estation/help?id=1902000000#Know'>Learn more</a>"
					}
			  		else { //partial deposit
				  		if (fmpstatus==2 && pardep=='true') {
					msg="transfer of <b>$"+ buypower+"</b> will be available for investment immediately. The remainder will be available for investment, and the entire amount will be available for withdrawal, on the 6<sup>th</sup> business day after the day of deposit.<br><br>If this is your initial deposit, funds will be available for investment and withdrawal on the 8<sup>th</sup> business day after the day of deposit. <a href='/e/t/estation/help?id=1902000000#Know'>Learn more</a>"
				  		}
				  	else { //no dep available for inv
				 		msg="transferred funds will be available for investment and withdrawal on the 6<sup>th</sup> business day after the day of deposit.<br><br>If this is your initial deposit, funds will be available for investment and withdrawal on the 8<sup>th</sup> business day after the day of deposit. <a href='/e/t/estation/help?id=1902000000#Know'>Learn more</a>";
				 		}
            		}
				}			
            else { 
					if (frequency == 'One time'){
						msg="scheduled  transfer will post to your brokerage account <b>"+postdate+"</b>. Transferred funds will be available for investment and withdrawal on the 6<sup>th</sup> business day after the day of posting.<br><br>If this is your initial deposit, funds will be available for investment and withdrawal on the 8<sup>th</sup> business day after the day of posting. <a href='/e/t/estation/help?id=1903000000#Know2'>Learn more</a>";
          
					}
					else {
						msg=" transfer of this series will post to your brokerage account <b>"+postdate+"</b>. The entire amount of this transfer will be available for investment and withdrawal on the 6<sup>th</sup> business day after the day of posting.<br><br>If this is your initial deposit, funds will be available for investment and withdrawal on the 8<sup>th</sup> business day after the date of posting. <a href='/e/t/estation/help?id=1903000000#Know2'>Learn more</a>";
					 }
				}
	}
	if(xfrType ==  BRKG_IRA ){
			if (type == 'SCH') {xtramsg=" before Market open"; 
     		msg ="transfer will post to your accounts " + postdate + ", and funds will be immediately available for investment upon posting."; }
			else msg ="transfer will post to your accounts <b>today</b>, and funds will be immediately available for investment upon posting.";
	}
	if(xfrType ==  BANK_IRA ){
			if (type == 'SCH'){xtramsg=" before Market open"; 
     		msg = "transfer will post to your IRA account " + postdate + xtramsg+" and funds will be immediately available for investment"+when+".";}
			else msg="transfer will post to your accounts <b>today</b>, and funds will be immediately available for investment upon posting.";
	}
	if(xfrType == BANK_BANK )
     		msg = "transfer will post to your accounts " + postdate + "."; 
	if(xfrType ==  HELOC_BRKG )
     		msg =  "transfer will post to your Brokerage account " + postdate + " before Market open,  and funds will be immediately available for investment on that date." ; 
	if(xfrType ==  HELOC_BANK  )
     		msg = "transfer will post to your Bank account " + postdate + " and funds will be immediately available for withdrawal on that date."; 
	if(xfrType == BANK_HELOC )
     		msg = "payment will post to your Home Equity account " +postdate + ".";
	if(xfrType == BANK_HEIL )
     		msg =  "payment will post to your Home Equity account " +postdate +".";  
	if(xfrType == BRKG_HELOC )
     		msg =  "payment will post to your Home Equity account " +postdate+".";  
	if(xfrType ==  BRKG_HEIL )
     		msg =  "payment will post to your Home Equity account " +postdate+".";  
	if(xfrType ==  EXT_BANK  )
     		msg = " transfer will credit your E*TRADE Bank account "+ postdate + " by 6 pm EST. <br><br>NOTE: Deposits will earn interest on the day they are credited. They will be available for withdrawal on the <b>evening of the third business day</b> after the date of credit."; 
	if(xfrType ==  BANK_EXT )
     		msg = " transfer will debit your E*TRADE Bank account "+ postdate + " by 6 pm EST. <br><br>NOTE: Please ensure that you maintain a sufficient balance in your E*TRADE Bank account until the withdrawal is processed. Your funds will typically appear at your external financial institution within <b>three business days</b> of the transfer being processed."; 
      if(xfrType ==  BANK_AUTO )
     		msg = " payment will post to your Vehicle Loan account " + postdate +"."; 
      if(xfrType ==  BRKG_AUTO )
     		msg = " payment will post to your Vehicle Loan account " + postdate+"."; 
	if(xfrType ==  CREDITCARD )
     		msg = " payment will post to your Credit Card account " + postdate+".";
			if(xfrType ==  BRKG_EXT )
     		msg = " transfer will immediately debit your E*TRADE securities account  "+postdate+"<br><br>NOTE: Your funds will typically appear at your external financial institution within <b>three business days</b> of the transfer being processed.";
	return msg;
}

function getConfXfrMsg_pre(xfrType, postdate, type, fmpstatus, buypower, postdays, pardep, frequency)
{
   var msg = "";		
	if (type == 'RT') {hasOrwill = "has posted"; areOrwill="are";}
	else {hasOrwill = "will post"; areOrwill="will be";}
	
	if (type == 'RT' && (xfrType == BANK_BRKG || xfrType == BRKG_BANK 
				|| xfrType == BANK_BANK || xfrType == CREDITCARD||xfrType == BRKG_EXT||xfrType == BRKG_BRKG))
		postdate = "<b>today</b>";
	else
		postdate = "on <b>" + postdate+"</b>";
	
	if (type == 'SCH' && (xfrType == BANK_BRKG || xfrType == BRKG_BANK 
				|| xfrType == BANK_BANK || xfrType == BANK_IRA || xfrType == BRKG_IRA||xfrType == BRKG_BRKG)){
		when = " on that date";
		}
	else {
		when = "";
		}	
	if(xfrType == BANK_BRKG ){
     		msg = "transfer has been submitted and will post to your accounts " + postdate + ". Upon posting, funds are immediately available for investment." }
	if(xfrType == BRKG_BANK || xfrType == BRKG_BRKG)
     		msg = "transfer has been submitted and will post to your accounts " + postdate + ". Upon posting, funds are immediately available for withdrawal."
			
	if(xfrType ==  EXT_BRKG ){
    if (type == 'RT') {
	  		if (fmpstatus==1) { //check if full deposit available			   
			   	msg= "transferred funds are available for investment immediately and will be available for withdrawal on the 6<sup>th</sup> business day after the day of deposit."
				}
			  else { //partial deposit
				  if (fmpstatus==2 && pardep=='true') {
					msg="transfer of  <b>$"+ buypower +"</b> is available for investment immediately. The remainder will be available for investment, and the entire amount will be available for withdrawal, on the 6<sup>th</sup> business day after the day of deposit.<br><br>If this is your initial deposit, funds will be available for investment and withdrawal on the 8<sup>th</sup> business day after the day of deposit. <a href='/e/t/estation/help?id=1903000000#Know2'>Learn more</a>"
				  }
				  else { //no dep available for inv
				 	msg="transferred funds will be available for investment and withdrawal on the 6<sup>th</sup> business day after the day of deposit.<br><br>If this is your initial deposit, funds will be available for investment and withdrawal on the 8<sup>th</sup> business day after the day of deposit. <a href='/e/t/estation/help?id=1903000000#Know2'>Learn more</a>";
				 }
              }			
    }
    else { //scheduled xfr	  		
		if (frequency == 'One time'){
		msg=" scheduled transfer will post to your brokerage account "+postdate+". Transferred funds will be available for investment and withdrawal on the 6<sup>th</sup> business day after the day of posting.<br><br>If this is your initial deposit, funds will be available for investment and withdrawal on the 8<sup>th</sup> business day after the day of deposit. <a href='/e/t/estation/help?id=1903000000#Know2'>Learn more</a>";
		}
		else {
		msg=" transfer will post to your brokerage account "+postdate+". The entire amount of this transfer will be available for investment and withdrawal on the 6<sup>th</sup> business day after the day of posting..<br><br>If this is your initial deposit, funds will be available for investment and withdrawal on the 8<sup>th</sup> business day after the day of deposit. <a href='/e/t/estation/help?id=1903000000#Know2'>Learn more</a>";
		}
    
      }
	}
	if(xfrType ==  BRKG_IRA ){
			if (type == 'SCH') {xtramsg=" before Market open";
     		msg = "transfer "+hasOrwill+" to your IRA account " + postdate + xtramsg + " and funds "+areOrwill+" immediately available for investment"+when+"."; }
			else msg="transfer has been submitted and will post to your accounts <b>today</b>. Upon posting, funds are immediately available for withdrawal.";
	}
	if(xfrType ==  BANK_IRA ){
			if (type == 'SCH') xtramsg=" before Market open"; else xtramsg="";
     		msg = "transfer "+hasOrwill+" to your IRA account " + postdate + xtramsg+" and funds "+areOrwill+" immediately available for investment"+when+"."; }
	if(xfrType == BANK_BANK ){
		if (type == 'RT') msg = "transfer has been submitted and will post to your accounts <b>today</b>. Upon posting, funds are immediately available for withdrawal.";
     	else	msg = "transfer "+hasOrwill+" to your accounts " + postdate + "."; }
	if(xfrType ==  HELOC_BRKG )
     		msg =  "transfer "+hasOrwill+" to your Brokerage account " + postdate + " before Market open,  and funds "+areOrwill+" immediately available for investment on that date." ; 
	if(xfrType ==  HELOC_BANK  )
     		msg = "transfer "+hasOrwill+" to your Bank account " + postdate + " and funds "+areOrwill+" immediately available for withdrawal on that date."; 
	if(xfrType == BANK_HELOC )
     		msg = "payment "+hasOrwill+" to your Home Equity account " +postdate + ".";
	if(xfrType == BANK_HEIL )
     		msg =  "payment "+hasOrwill+" to your Home Equity account " +postdate +".";  
	if(xfrType == BRKG_HELOC )
     		msg =  "payment "+hasOrwill+" to your Home Equity account " +postdate+".";  
	if(xfrType ==  BRKG_HEIL )
     		msg =  "payment "+hasOrwill+" to your Home Equity account " +postdate+".";  
	if(xfrType ==  EXT_BANK  )
     		msg = " transfer will credit your E*TRADE Bank account "+ postdate + " by 6 pm EST. <br><br>NOTE: Deposits will earn interest on the day they are credited. They "+areOrwill+" available for withdrawal on the <b>evening of the third business day</b> after the date of credit."; 
	if(xfrType ==  BANK_EXT )
     		msg = " transfer will debit your E*TRADE Bank account "+ postdate + " by 6 pm EST. <br><br>NOTE: Please ensure that you maintain a sufficient balance in your E*TRADE Bank account until the withdrawal is processed. Your funds will typically appear at your external financial institution within <b>three business days</b> of the transfer being processed."; 
      if(xfrType ==  BANK_AUTO )
     		msg = " payment "+hasOrwill+" to your Vehicle Loan account " + postdate +"."; 
      if(xfrType ==  BRKG_AUTO )
     		msg = " payment "+hasOrwill+" to your Vehicle Loan account " + postdate+"."; 
		if(xfrType ==  CREDITCARD )
     		msg = " payment "+hasOrwill+" to your Credit Card account " + postdate +". Credit card payments may take 2-3 days to debit your <b>From</b> account, even if you are paying from another E*TRADE account.  Please make sure that enough funds are available to cover your payment until it has cleared."; 
	if(xfrType ==  BRKG_EXT )
     		msg = " transfer will immediately debit your E*TRADE securities account "+postdate+"<br><br>NOTE: Your funds will typically appear at your external financial institution within 3 business days of the transfer being processed.";
	return msg;
}

function getConfXfrMsg(xfrType, appname,type){

msg = "";
pagename = "xfrpending";
if (appname == "genietools") 
{ 
pxfrlink=" Pending Transfers ";
}
else
{
pxfrlink=" <a href='/e/t/"+appname+"/"+pagename+"'>Pending Transfers</a> ";
}

switch (xfrType){

case 100: 
case 101: 
msg="Transfers can be edited or deleted until 4:00 PM EST on the date of processing from the "+pxfrlink+"page.";
break;
case 102:
case 103:
case 104:
case 105: 
msg="Payments can be edited or deleted until 4:00 PM EST on the date of processing from the "+pxfrlink+"page.";
break;
case 4:
case 5:
case 7:
case 8:
case 9:
case 15:
case 106:                                       
case 107:
if(type=="SCH")msg="Scheduled transfers can be edited or deleted until the date of processing from the "+pxfrlink+"page.";
break;

case 108:
case 109:
case 110:
msg="Scheduled payments can be edited or deleted until the date of processing from the "+pxfrlink+"page.";
break;
case 17:
if(type=="SCH")msg="Payments can be edited or deleted until 5:00 PM EST on the date of processing from the "+pxfrlink+"page.";
break;

default:
break;

}

if (msg!="")return "<br><br>"+msg;
else return msg;

}


function getTitle(xfrType)
{

	var title ="";

	if(xfrType == BANK_BRKG )
			title = "Bank to Brokerage Transfer";
	if(xfrType == BRKG_BANK )
	        title = "Brokerage to Bank Transfer";
	if(xfrType ==  EXT_BRKG )
	        title = "Bank to Brokerage Transfer";
	if(xfrType ==  BRKG_IRA )
	        title = "Brokerage to IRA Transfer";
	if(xfrType ==  BANK_IRA )
	        title = "Bank to IRA Transfer";
	if(xfrType == BANK_BANK )
	        title = "Bank to Bank Transfer";
	if(xfrType ==  HELOC_BRKG )
	        title = "Home Equity Withdrawal";
	if(xfrType ==  HELOC_BANK  )
	        title = "Home Equity Withdrawal";
	if(xfrType == BANK_HELOC )
	        title = "Home Equity Payment";
	if(xfrType == BANK_HEIL )
	        title = "Home Equity Payment";
	if(xfrType == BRKG_HELOC )
	        title = "Home Equity Payment";
	if(xfrType ==  BRKG_HEIL )
	        title = "Home Equity Payment";
	if(xfrType ==  EXT_BANK  )
			title = "Online Deposit to Bank";
	if(xfrType ==  EXT_BRKG  )
			title = "Online Deposit to Brokerage";
	if(xfrType ==  BANK_EXT )
			title = "Online Withdrawal from Bank";
	if(xfrType ==  BRKG_AUTO )
			title = "Vehicle Loan Payment";
	if(xfrType ==  BANK_AUTO )
			title = "Vehicle Loan Payment";
	if(xfrType ==  CREDITCARD )
			title = "Credit Card Payment"; 
	if(xfrType ==  BRKG_EXT)
			title = "Online Withdrawal from Brokerage";
	if(xfrType ==  BRKG_BRKG)
			title = "Brokerage to Brokerage Transfer";
	return title;
}

function getFooterMsg(xfrType, app)
{

        var msg ="";

        if(xfrType == BANK_BRKG )
                msg = 'Transfers submitted before 5:00 pm EST M - F will be processed the same day. All other transfers will be processed the following business day.<br>Your confirmation of this transfer request acknowledges your full authority and ownership of both the "From Account" and "To Account".<br><b>Funds are being transferred from a FDIC insured account into a non-FDIC insured account.</b>';
        if(xfrType == BRKG_BANK )
                msg = 'Transfers submitted before 5:00 pm EST M - F will be processed the same day. All other transfers will be processed the following business day.<br>Your confirmation of this transfer request acknowledges your full authority and ownership of both the "From Account" and "To Account".<br><b>Funds are being transferred from a non-FDIC insured account into a FDIC insured account.</b>';
        if(xfrType ==  EXT_BRKG )
                 msg = "Bank to Brokerage Transfer";
        if(xfrType ==  BRKG_IRA || xfrType == BRKG_BRKG||xfrType == BANK_BANK)
                 msg = 'Your confirmation of this transfer request acknowledges your full authority and ownership of both the "From Account" and "To Account".';
        if(xfrType ==  BANK_IRA )
				//msg = "Bank to IRA Transfer";
				 msg='Your confirmation of this transfer request acknowledges your full authority and ownership of both the "From Account" and "To Account".'; 		
		if(xfrType ==  HELOC_BRKG )
                 //msg = "Home Equity Withdrawal";
				 msg='Transfers submitted before 4 pm EST M - F will be processed the same day. All other transfers will be processed the following business day.<br>Your confirmation of this transfer request acknowledges your full authority and ownership of both the "From Account" and "To Account".<br><b>Funds may or may not be tax-deductible. Please consult your tax advisor</b>';
        if(xfrType ==  HELOC_BANK  )
                 //msg = "Home Equity Withdrawal";
				 msg='Transfers submitted before 4 pm EST M - F will be processed the same day. All other transfers will be processed the following business day.<br>Your confirmation of this transfer request acknowledges your full authority and ownership of both the "From Account" and "To Account".<br><b>Funds may or may not be tax-deductible. Please consult your tax advisor</b>';
        if(xfrType == BANK_HELOC )
                 //msg = "Home Equity Payment";
				 msg='Transfers submitted before 4 pm EST M - F will be processed the same day. All other transfers will be processed the following business day.<br>Your confirmation of this payment request acknowledges your full authority and ownership of both the "From Account" and "To Account".';
        if(xfrType == BANK_HEIL )
                 //msg = "Home Equity Payment";
				 msg='Transfers submitted before 4 pm EST M - F will be processed the same day. All other transfers will be processed the following business day.<br>Your confirmation of this payment request acknowledges your full authority and ownership of both the "From Account" and "To Account".';
        if(xfrType == BRKG_HELOC )
                 //msg = "Home Equity Payment";
				 msg='Transfers submitted before 4 pm EST M - F will be processed the same day. All other transfers will be processed the following business day.<br>Your confirmation of this payment request acknowledges your full authority and ownership of both the "From Account" and "To Account".';
        if(xfrType ==  BRKG_HEIL )
                 //msg = "Home Equity Payment";
				 msg='Transfers submitted before 4 pm EST M - F will be processed the same day. All other transfers will be processed the following business day.<br>Your confirmation of this payment request acknowledges your full authority and ownership of both the "From Account" and "To Account".';
        if(xfrType ==  EXT_BANK  )
                 msg = 'Transfers submitted before 4 pm EST M - F will be processed the same day. All other transfers will be processed the following business day.<br>Your confirmation of this transfer request acknowledges your full authority and ownership of both the "From Account" and "To Account".';
        if(xfrType ==  EXT_BRKG  )
        {
		if( app != null && app == "genietools")
		{
                 msg = 'Please note: Online cash transfer is not appropriate to cover a call. Please request a wire transfer or FedEx a check and contact us at 1-800-ETRADE-1 (1-800-387-2331) so we may update your account appropriately.<br>Your confirmation of this transfer request acknowledges your full authority and ownership of both the "From Account" and "To Account". ';
                }
		else
		{
                 msg = 'Please note: Online cash transfer is not appropriate to cover a call. Please request a wire transfer or FedEx a check and contact us at 1-800-ETRADE-1 (1-800-387-2331) so we may update your account appropriately.<br>Click <a href="javascript:GoToETURL(\'/e/t/estation/help?id=309020300\',\'etrade\');">here</a> to learn about E*TRADE Securities LLC funds availability requirements. <br>Your confirmation of this transfer request acknowledges your full authority and ownership of both the "From Account" and "To Account". ';
                }
	}
        if(xfrType ==  BANK_EXT )
                 msg = 'Transfers submitted before 4 pm EST M - F will be processed the same day. All other transfers will be processed the following business day.<br>Your confirmation of this transfer request acknowledges your full authority and ownership of both the "From Account" and "To Account".';
      if(xfrType ==  BRKG_AUTO )
                 msg = 'Transfers submitted before 4 pm EST M - F will be processed the same day. All other transfers will be processed the following business day.<br>Your confirmation of this transfer request acknowledges your full authority and ownership of both the "From Account" and "To Account".';
      if(xfrType ==  BANK_AUTO)
                 msg = 'Transfers submitted before 4 pm EST M - F will be processed the same day. All other transfers will be processed the following business day.<br>Your confirmation of this transfer request acknowledges your full authority and ownership of both the "From Account" and "To Account".';
	if(xfrType ==  CREDITCARD )
                 msg = 'Transfers submitted before 5 pm EST Sunday - Friday (except holidays) will be processed the same day. All other transfers will be processed the following business day.  <br>If your scheduled transfer amount is greater than your credit card account\'s current balance at processing, your transfer amount will be reduced to the current balance. <br>Your confirmation of this payment request acknowledges your full authority and ownership of both the "From Account" and "To Account".';
         //return xfrType+"::"+msg;
		return msg;
}


function hdrmsg(layerName,STR)
{
var agt=navigator.userAgent.toLowerCase();
var is_ie5=(agt.indexOf("msie 5.0")!=-1);
if(!is_ie5)
  {
	eval("document.getElementById('"+layerName+"').innerHTML='"+STR+"'");
    }
}


function maskAcnum(num){
    reqLength  = num.length - 4;
    accountNum = num.substring(reqLength);
	leadingX="";
	for(i=0;i<reqLength;i++)leadingX="X"+leadingX;
	document.write(leadingX+accountNum);
}

function ErrorBox(msg) {

layerName="errorMsg";

var agt=navigator.userAgent.toLowerCase();

	var is_ie5=(agt.indexOf("msie 5.0")!=-1);
	var e = "Enter";
	var ST1 ="<table width=100% border=0 cellpadding=0 cellspacing=0> <tr> <td bgcolor=#ff9900> <table border=0 cellpadding=8 cellspacing=1 width=100%> <tr> <td bgcolor=#ffffcc class=f1 valign=top> <table border=0 cellpadding=2 cellspacing=0 width=100%> <tr> <td valign=middle width=31> <img align=absmiddle src=/images/bi_warningtri_eng.gif width=26 height=31 valign=top></td> <td width=10 nowrap><img align=left src=/images/spacer.gif valign=top></td> <td class=mHeader valign=middle align=left>";
	ST2="</td></tr></table></td></tr></table></td></tr></table>";
	if(is_ie5)  // 5.0
	{
	  alert(msg);
	  return false;
	 }
	  		  eval("document.getElementById('"+layerName+"').innerHTML=\" "+ST1+msg+ST2+" \" ");
}
