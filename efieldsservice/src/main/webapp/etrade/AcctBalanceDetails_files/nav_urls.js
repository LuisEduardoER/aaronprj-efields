if(typeof(bankCust)=="undefined")
{
	var bankCust=0;
}

if(typeof(ccCust)=="undefined")
{
	var ccCust=0;
}

function tab_data(name,chinesename,url,server){
	this.name=name;
	this.chinesename=chinesename;
	this.url=url;
	this.server=server;
}
/* Declare the Arrays */
var homelevel = new Array();
var tradinglevel = new Array();
var quoteslevel = new Array();
var retirementlevel = new Array();
var banklevel = new Array();
var mortgageslevel = new Array();
var mutualfundslevel = new Array();
var chineselevel = new Array();
var rightclicklevel = new Array();

/* Top level Navagation URLS */
var tab_titles = new Array();
tab_titles[1] = new tab_data("Home","","/e/t/home","etrade");
tab_titles[2] = new tab_data("Accounts","","/e/t/accounts/accountscombo","etrade");
if(userType.toLowerCase()!="visitor"){
	tab_titles[3] = new tab_data("Trading & Portfolios","","/e/t/invest/socreateentry","etrade");
}else{
	tab_titles[3] = new tab_data("Trading & Portfolios","","/e/t/invest/pethome","etrade");
}
tab_titles[4] = new tab_data("Quotes & Research","","/e/t/invest/markets","etrade");

var secondnav_titles = new Array();
secondnav_titles[1] = "home";
secondnav_titles[2] = "home";
secondnav_titles[3] = "trading";
secondnav_titles[4] = "quotes";
secondnav_titles[5] = "mutualfunds";
secondnav_titles[6] = "stockplan";
secondnav_titles[7] = "retirement";
secondnav_titles[8] = "bank";
secondnav_titles[9] = "mortgages";



if(userType.toLowerCase()!="visitor")
{
	//Customer(accounts) version of home/accounts tab
	homelevel[0] = new tab_data("Complete View","", "/e/t/accounts/accountsCombo","etrade");
	homelevel[1] = new tab_data("My&nbsp;Info","","/e/t/accounts/changemyinfo","etrade");
	homelevel[2] = new tab_data("Subscriptions","","/e/t/scenter/SubscriptionCenter","etrade");  
	homelevel[3] = new tab_data("Move&nbsp;Money","","/e/t/accounts/acctxfrfundspage","etrade");
	homelevel[4] = new tab_data("Account&nbsp;Transfer","","/e/t/toareq/toarequest","etrade");
	homelevel[5] = new tab_data("Statements&nbsp;&amp;&nbsp;Records","","/e/t/accounts/acctrecords","etrade");
	homelevel[6] = new tab_data("Forms&nbsp;&amp;&nbsp;Applications","","/e/t/estation/pricing?id=1201010000","etrade");
	homelevel[7] = new tab_data("Products","","/e/t/home/productservices","etrade");
	homelevel[8] = new tab_data("Commissions","","/e/t/estation/commissions?id=1206010100","etrade");
}else{	
	//Visitor version of home/accounts tab
	homelevel[0] = new tab_data("Open&nbsp;An&nbsp;Account","","/e/t/home/openanaccount","etrade");
	homelevel[1] = new tab_data("Products&nbsp;&amp;&nbsp;Services","","/e/t/home/productservices","etrade");
	homelevel[2] = new tab_data("Forms&nbsp;&&nbsp;Applications","","/e/t/estation/pricing?id=1201010000","etrade");
	homelevel[3] = new tab_data("Contact&nbsp;Us","","/e/t/home/accessus","etrade");
	homelevel[4] = new tab_data("About&nbsp;Us","","/e/t/home/aboutus","etrade");
	homelevel[5] = new tab_data("Fees&nbsp;&amp;&nbsp;Commissions","","/e/t/estation/commissions?id=1206010100","etrade");
}	
if(userType.toLowerCase()=="customer")
{ 
	//Customer version of Trading & Investing Tab
	tradinglevel[0] = new tab_data("Trade","","/e/t/invest/socreateentry","etrade");
	tradinglevel[1] = new tab_data("Portfolios","","/e/t/pfm/portfolioview","etrade");
	tradinglevel[2] = new tab_data("View&nbsp;Orders","","/e/t/invest/vieworders?view_type=Advanced&order_type=O&order_status=O&fp=xy","etrade");
	tradinglevel[3] = new tab_data("Balances","","/e/t/accounts/AcctBalanceDetails","etrade");
	tradinglevel[4] = new tab_data("Transaction&nbsp;History","","/e/t/accounts/accountactivity?TXN=AccountTrans","etrade");
	tradinglevel[5] = new tab_data("Account&nbsp;Records","","/e/t/onlinedocs/docsummary","edocs");
	tradinglevel[6] = new tab_data("Active&nbsp;Trading","","/e/t/invest/pethome","etrade");

	
	//Customer version of Quotes & Research Tab

	quoteslevel[0] = new tab_data("US Markets","","/e/t/invest/markets","etrade");
	quoteslevel[1] = new tab_data("News","","/e/t/invest/marketnews","etrade");
	quoteslevel[2] = new tab_data("Streaming&nbsp;Quotes","","/e/t/applogic/MarketCasterInfo1","etrade");
	quoteslevel[3] = new tab_data("Charts","","/e/t/invest/quotechart?etstyle=3m&size=m&sym=DJIND","etrade");
 	quoteslevel[4] = new tab_data("Stocks","","/e/t/invest/stocks","etrade");
	quoteslevel[5] = new tab_data("Options","","/e/t/invest/options","etrade");
	var Q=document.URL;
	var q=Q.toUpperCase();
	if(q.search('BONDDESK.C') != -1){
		quoteslevel[6] = new tab_data("Bonds","","/etrade/owa/pkg_static.home?p_custom=BASE","bond");
	}else{
		if(userType.toLowerCase()=="customer"){
			quoteslevel[6] = new tab_data("Bonds","","/e/t/applogic/bondbridge?bdest=WELCOME","etrade");
		}else{
		 	quoteslevel[6] = new tab_data("Bonds","","/e/t/invest/bonds","etrade");  
		}
	}
	quoteslevel[7] = new tab_data("Fees&nbsp;&amp;&nbsp;Commissions","","/e/t/estation/commissions?id=1206010100","etrade");
}
else
{
	//Visitor version of Trading & Investing Tab	
	tradinglevel[0] = new tab_data("Trade","","/e/t/invest/socreateentry","etrade");
	tradinglevel[1] = new tab_data("Portfolios","","/e/t/pfm/portfolioview","etrade");
	tradinglevel[2] = new tab_data("View&nbsp;Orders","","/e/t/invest/vieworders?view_type=Advanced&security_type=S&order_type=O&order_status=O&fp=xy","etrade");
	tradinglevel[3] = new tab_data("Account&nbsp;Records","","/e/t/invest/acctrecords","etrade");
	tradinglevel[4] = new tab_data("Active&nbsp;Trading","","/e/t/invest/pethome","etrade");
	tradinglevel[5] = new tab_data("Fees&nbsp;&amp;&nbsp;Commissions","","/e/t/estation/commissions?id=1206010100","etrade");
	
	//Visitor version of Quotes & Research Tab	
	quoteslevel[0] = new tab_data("US Markets","","/e/t/invest/markets","etrade");
	quoteslevel[1] = new tab_data("News","","/e/t/invest/marketnews","etrade");
	quoteslevel[2] = new tab_data("Charts","","/e/t/invest/quotechart?etstyle=3m&size=m&sym=DJIND","etrade");
	quoteslevel[3] = new tab_data("Stocks","","/e/t/invest/stocks","etrade");
	quoteslevel[4] = new tab_data("Options","","/e/t/invest/options","etrade");
	var Q=document.URL;
	var q=Q.toUpperCase();
	if(q.search('BONDDESK.C') != -1){
		quoteslevel[5] = new tab_data("Bonds","","/etrade/owa/pkg_static.home?p_custom=BASE","bond");
	}else{
		if(userType.toLowerCase()=="customer"){
			quoteslevel[5] = new tab_data("Bonds","","/e/t/applogic/bondbridge?bdest=WELCOME","etrade");
		}else{
		 	quoteslevel[5] = new tab_data("Bonds","","/e/t/invest/bonds","etrade");  
		}
	}
	quoteslevel[6] = new tab_data("Fees&nbsp;&amp;&nbsp;Commissions","","/e/t/estation/commissions?id=1206010100","etrade");
}
	

// Banking & Credit Card Tab
if(bankCust==1){ 
	banklevel[0] = new tab_data("Overview","","/e/t/bank/home","bankus");
	banklevel[1] = new tab_data("Bank&nbsp;Account&nbsp;Details","","/e/t/ibank/accountdetails","bankus");
	banklevel[2] = new tab_data("Bank&nbsp;Bill&nbsp;Pay","","/e/t/ibank/billpay/schedulepayments","bankus");
	banklevel[3] = new tab_data("Bank&nbsp;Reports","","/e/t/ibank/reports","bankus");
	if (ccCust==1){  
	banklevel[4] = new tab_data("Credit&nbsp;Cards","","/e/t/creditcard/cctransactionhistory","etrade");
	}
	else{
	banklevel[4] = new tab_data("Credit&nbsp;Cards","","/e/t/creditcard/cchome","etrade");
	}
}else{
if(ccCust==1){     //Credit Card Only
	banklevel[0] = new tab_data("Overview","","/e/t/bank/home","bankus");
	banklevel[1] = new tab_data("Bank&nbsp;Account&nbsp;Details","","/e/t/ibank/accountdetails","bankus");
	banklevel[2] = new tab_data("Bank&nbsp;Bill&nbsp;Pay","","/e/t/ibank/billpay","bankus");
	banklevel[3] = new tab_data("Bank&nbsp;Reports","","/e/t/ibank/reports","bankus");
	banklevel[4] = new tab_data("Credit&nbsp;Cards","","/e/t/creditcard/cctransactionhistory","etrade");
	}
else{				//Visitor
	banklevel[0] = new tab_data("Getting&nbsp;Started","","/e/t/bank/home","bankus");
	banklevel[1] = new tab_data("Checking","","/e/t/home/independentchecking?_skinnertab=bank","etrade");
	banklevel[2] = new tab_data("Money&nbsp;Market","","/e/t/home/moneymarket?_skinnertab=bank","etrade");
	banklevel[3] = new tab_data("CDs","","/e/t/home/comparecd?_skinnertab=bank","etrade");
	banklevel[4] = new tab_data("Credit&nbsp;Cards","","/e/t/creditcard/cchome","etrade");
	}
}

/*Chinese Version of links*/
chineselevel[0]=['"xxxx", "chinese"', 'english name', 'chinese name of site'];

var navigation = new Array();
navigation[0] = homelevel;
navigation[1] = tradinglevel;
navigation[2] = quoteslevel;

//document.write(navigation);
var navigation = escape(navigation); 
