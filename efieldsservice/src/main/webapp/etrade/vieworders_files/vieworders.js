function changeAccount(account){ //to redirect any stockplan accounts to stock plan VO page
	var acct = account;
	var acct_array=acct.split(",");
	if(acct_array[1]) document.location.href='/e/t/'+globAppName+'/spvieworders?SelectedAcctIndex='+acct_array[1];
}

function showSelectedAccount(selectedAccount){
	if(document.viewForm.account_id){
		for(var i=0; i < document.viewForm.account_id.length; i++){
			if(document.viewForm.account_id.options[i].value == selectedAccount){
				document.viewForm.account_id.options[i].selected = true;
				break;
			}
		}
	}
}

function writeNoRecordsFound(sectype,reqordstatus){
	var returnstr="";
	if(reqordstatus=='O'){
		returnstr="<b>There are no open ";
		if(sectype=='S') returnstr = returnstr + "Stock";
		if(sectype=='F') returnstr = returnstr + "Mutual Fund";
		if(sectype=='O') returnstr = returnstr + "Option";
		if(sectype=='B') returnstr = returnstr + "Bond";
		returnstr = returnstr + " orders in your account at this time.</b>";
	}
	else returnstr = "<b>We were not able to find any orders with the criteria you have submitted. Please modify one or more of the selections above and click SUBMIT again.</b>";
	return(returnstr);
}

function findOrderTitle(reqordstatus){
	var titlestr="";
	if(reqordstatus=='I') titlestr = "Inidividual Fills";
	else titlestr = "Orders";
	return(titlestr);
}

function expandCollapse(param,selectedAccount){
	if(param==0){
		document.getElementById("showsearch").innerHTML = document.getElementById("expanded_search").innerHTML;
		populateSearchDropdowns(param);
	}
	else document.getElementById("showsearch").innerHTML = document.getElementById("collapsed_search").innerHTML;
	if(document.viewForm.expandcollapse) document.viewForm.expandcollapse.value = param;
	showSelectedAccount(selectedAccount);
}

function changeEGQual(ordertype){
  	if(ordertype=='Q') document.viewForm.eg_qual.value = 'Q';
  	else document.viewForm.eg_qual.value = '';
}

function writeQuickLinks(stdlink,reqordstatus,egqual,bondQuoteLink){
	var space = '&#160;&#160;&#160;|&#160;&#160;&#160;';
	var returnstr='';

	if(reqordstatus=='O' && egqual!='Q') returnstr = returnstr + '<b>Open</b>';
	else returnstr = returnstr + stdlink + '&order_status=O">Open</a>';
	returnstr = '&#160;' + returnstr + space;

	if(reqordstatus=='X' && egqual!='Q') returnstr = returnstr + '<b>Executed</b>';
	else returnstr = returnstr + stdlink + '&order_status=X">Executed</a>';
	returnstr = returnstr + space;

	if(reqordstatus=='C R S' && egqual!='Q') returnstr = returnstr + '<b>Cancelled</b>';
	else returnstr = returnstr + stdlink + '&order_status=C R S">Cancelled</a>';
	returnstr = returnstr + space;

	if(reqordstatus=='I' && egqual!='Q') returnstr = returnstr + '<b>Individual Fills</b>';
	else returnstr = returnstr + stdlink + '&order_status=I&req_type=T">Individual Fills</a>';
	returnstr = returnstr + space;

	if(reqordstatus=='P' && egqual!='Q') returnstr = returnstr + '<b>Expired</b>';
	else returnstr = returnstr + stdlink + '&order_status=P">Expired</a>';
	returnstr = returnstr + space;

	if(reqordstatus=='Z' && egqual!='Q') returnstr = returnstr + '<b>Rejected</b>';
	else returnstr = returnstr + stdlink + '&order_status=Z">Rejected</a>';
	returnstr = returnstr + space;

	if(reqordstatus=='' && egqual!='Q') returnstr = returnstr + '<b>All</b>';
	else returnstr = returnstr + stdlink + '&order_status=">All</a>';
	returnstr = returnstr + space;

	if(egqual=='Q') returnstr = returnstr + '<b>2-Second Execution Guarantee</b>';
	else returnstr = returnstr + stdlink + '&eg_qual=Q&order_status=">2-Second Execution Guarantee</a>';
	returnstr = returnstr + space;

	if(reqordstatus=='B' && egqual=='') returnstr = returnstr + '<b>Bond Quotes</b>';
	else {
		 if(bondQuoteLink)
			{
			returnstr = returnstr + bondQuoteLink + '">Bond Quotes</a>';
			}
	}
	return(returnstr);
}

function writeRejectReason(reasoncode){
	var returnstr="";
	var helpid=0;
	if(reasoncode==100){
		returnstr="Broker Reject";
		helpid=5755;
	}
	if(reasoncode==101){
		returnstr="Auto Reject";
		helpid=5756;
	}
	if(reasoncode==102){
		returnstr="No Short Sale Invt";
		helpid=5757;
	}
	if(reasoncode==103){
		returnstr="Destination Unavailable";
		helpid=5758;
	}
	if(reasoncode==104){
		returnstr="Trade Reversal";
		helpid=5761;
	}
	if(reasoncode==105){
		returnstr="Market Reject";
		helpid=5759;
	}
	if(reasoncode==106){
		returnstr="Too Late To Cancel";
		helpid=5760;
	}
	if(returnstr!="") return ("<a href=javascript:openHelp('/e/t/estation/glossaryterm?id="+helpid+"')>"+returnstr+"</a>");
	else return "Rejected";
}

function padout(number){
	return (number < 10) ? '0' + number : number;
}

function writeOptionSymbolDesc(underlyingsymbol,expymm,strikeprice,callput,symbol,expireDate){

if (expireDate == null) {expireDate = ''}
	var returnstr="";
	var len = expymm.length;
	var month = parseFloat(expymm.substring(len-2));
	var year = padout(expymm.substring(0,len-2));
	var dispmonth="";
	var aMonth = new Array("","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
    dispmonth = aMonth[month];
	if(callput==1) callput="Call";
	else callput="Put";
	returnstr = underlyingsymbol + " " + dispmonth + " " + expireDate +" '"+year + " $" +formatMoney(strikeprice) + " " + callput;
	return(returnstr);
}

function writePrice(price){
	var returnstr="";
	if(price==0) returnstr = "--";
	 else returnstr = formatMoney(price);
	return(returnstr);
}

function writeDate(utcmilli){
	var dateval = new dateConvertET(parseInt(utcmilli));
	dateval.adjustedDate = new Date(dateval.adjustedTime);
	var yearstr = (dateval.adjustedDate.getFullYear()).toString().slice(2);
	var temphtml = (padout(dateval.adjustedDate.getMonth()+1)) + '/' + padout(dateval.adjustedDate.getDate()) + '/' + yearstr;
	return(temphtml);
}

function printLink(url,linkname){
	var linkval = "<a href=javascript:GoToETURL('" + url + "','');>" + linkname + '</a>';
	return(linkval);
}

function writeGroupCancelLink(grouptype,ordernum,accountid){
	var url = "";
	var linkhtml="";
	url = "/e/t/"+globAppName+"/groupcancelentry?ordernum=" + ordernum + "&accountid=" + accountid + "&ordergrouptype=" + grouptype;
	linkhtml = printLink(url,'Cancel');
	return linkhtml;
}

function writeFillOrderStatus(orderstatus){
	var returnstr="";
	if(orderstatus==1) returnstr= "Order Placed";
	if(orderstatus==2) returnstr= "Open";
	if(orderstatus==3) returnstr= "Open";
	if(orderstatus==4) returnstr= "Open";
	if(orderstatus==5) returnstr= "Cancel Requested";
	if(orderstatus==6) returnstr= "Modified";
	if(orderstatus==7) returnstr= "Broker Release";
	if(orderstatus==8) returnstr= "Rejected";
	if(orderstatus==9) returnstr= "Rejected";
	if(orderstatus==10) returnstr= "Cancelled";
	if(orderstatus==11) returnstr= "Cancel Rejected";
	if(orderstatus==12) returnstr= "Expired";
	if(orderstatus==13) returnstr= "Executed";
	if(orderstatus==14) returnstr= "Adjusted";
	if(orderstatus==15) returnstr= "Reversal"
	if(orderstatus==16) returnstr= "Cancellation Reversed";
	if(orderstatus==17) returnstr= "Expiration Reversed";
	if(orderstatus==18) returnstr= "Option Assignment";
	if(orderstatus==19) returnstr= "Option Expired";
	if(orderstatus==20) returnstr= "Open Order Adjusted";
	if(orderstatus==21) returnstr= "Option Exercised"
	if(orderstatus==22) returnstr= "CA Cancelled";
	if(orderstatus==23) returnstr= "CA Booked";
	if(orderstatus==24) returnstr= "IPO Allocated";
	if(orderstatus==25) returnstr= "Done Trade Executed";
	if(orderstatus==26) returnstr= "Rejection Reversed";
	if(orderstatus==27) returnstr= "Order Executed";
	return(returnstr);
}

function writeStatus(orderstatus,ordertype){
	var returnstr="";
	if(orderstatus<10) returnstr= "Open";
	if(orderstatus==5) returnstr= "Cancel Requested";
	if(orderstatus==10) returnstr = "Cancelled";
	if(orderstatus==11){
		if(ordertype==8) returnstr = "Expired"; //for option-expired show status as expired
		else returnstr = "Executed";
	}
	if(orderstatus==12) returnstr = "Rejected";
	if(orderstatus==13) returnstr = "Expired";
	return(returnstr);
}

function writeReenterLinkAO(typecode, orderaction, poseffect, symbol, qty, term, stopprice, limitprice, offset, aotype){
	var url,linkhtml="";

	aotype=parseInt(aotype);
	if(typecode=='OPTN') url = "/e/t/"+globAppName+"/optionorderentry?pricetype=5";
	else{
		if(aotype==1) url = "/e/t/"+globAppName+"/bracketedbuyorderentry?param=3";
		if(aotype==2) url = "/e/t/"+globAppName+"/bracketedbuyorderentry?param=" + offset;

//		commented because h-stop is not allowed in website
		if(aotype==3) return ("");
		if(aotype==4) url = "/e/t/"+globAppName+"/socreateentry?param="+offset;
	}

	url = url + "&ordertype=" + orderaction + "&positioneffect=" + poseffect + "&symbol=" + symbol + "&qty=" + qty + "&quantity=" + qty + "&term=" + term + "&stopprice=" + stopprice + "&limitprice=" + limitprice + "&price=" + stopprice;
	linkhtml = printLink(url,'Re-Enter Order');
	return linkhtml;
}

function writeComplexReenterLink(oa1,poseff1,sym1,qty1,oa2,poseff2,sym2,qty2,term,ordertrigger,aon,price,ordertype){
	var url = "";
	var transaction1=0;
	var transaction2=0;

	if(ordertype==4){
		url = "/e/t/"+globAppName+"/optionoptionorderentry?";
		if(oa1==2 && poseff1==1) transaction1=1;
		if(oa1==3 && poseff1==1) transaction1=2;
		if(oa1==2 && poseff1==2) transaction1=3;
		if(oa1==3 && poseff1==2) transaction1=4;
	}
	else{
		url = "/e/t/"+globAppName+"/stockoptionorderentry?";
		if(oa1==2 && poseff1==1) transaction1=1;
		if(oa1==3 && poseff1==2) transaction1=2;
		if(oa1==3 && poseff1==1) transaction1=3;
		if(oa1==2 && poseff1==2) transaction1=4;
	}
	if(oa2==2 && poseff2==1) transaction2=1;
	if(oa2==3 && poseff2==1) transaction2=2;
	if(oa2==2 && poseff2==2) transaction2=3;
	if(oa2==3 && poseff2==2) transaction2=4;

	if(term==3) term=1;
	var pricetype=ordertrigger;
	if(ordertrigger==6 || ordertrigger==9) pricetype=2;
	else if(ordertrigger==7 || ordertrigger==10) pricetype=3;
	else if(ordertrigger==8 || ordertrigger==11) pricetype=4;

	url = url + "transaction1=" + transaction1 + "&transaction2=" + transaction2 + "&symbol1=" + sym1 + "&symbol2=" + sym2 + "&quantity1=" + qty1 + "&quantity2=" + qty2 + "&pricetype=" + pricetype + "&term=" + term + "&aon=" + aon + "&limitprice=" + price;

	var linkhtml = printLink(url, 'Re-Enter Order');
	return linkhtml;
}


function writeThreeFourLegReenterLink (transOrdertype,transaction,quantity,symbol,price,term,pricetype,aonflag )
{

var ordertype = parseInt(transOrdertype);
var url ="";
var linkhtml = "";
var transaction1=transactionTypeDecode(transaction[0]);
var transaction2=transactionTypeDecode(transaction[1]);
var transaction3=transactionTypeDecode(transaction[2]);

if(ordertype > 14) {
var transaction4=transactionTypeDecode(transaction[3]);
}


	if(ordertype ==14)
		{ 
								
			url = "/e/t/"+globAppName+"/butterflycontroler?action=butterflyorderentry&num_legs=3&transaction1=" + transaction1 + "&transaction2=" + transaction2 + "&transaction3=" + transaction3 + "&quantity1=" + quantity[0] +"&quantity2=" + quantity[1] + "&quantity3=" + quantity[2] + "&quantity4=" + quantity[3] + "&symbol1=" + symbol[0] + "&symbol2=" + symbol[1] + "&symbol3=" + symbol[2] + "&symbol4=" + symbol[3] + "&aonflag=" + aonflag + "&price=" + price + "&term=" + term + "&pricetype=" + pricetype;
					
					
		}
	else if (ordertype ==15)
	
		{ 				
			url = "/e/t/"+globAppName+"/condorcontroler?action=condororderentry&num_legs=4&transaction1=" + transaction1 + "&transaction2=" + transaction2 + "&transaction3=" + transaction3 + "&transaction4=" + transaction4 + "&quantity1=" + quantity[0] +"&quantity2=" + quantity[1] + "&quantity3=" + quantity[2] + "&quantity4=" + quantity[3] + "&symbol1=" + symbol[0] + "&symbol2=" + symbol[1] + "&symbol3=" + symbol[2] + "&symbol4=" + symbol[3] + "&aonflag=" + aonflag + "&price=" + price + "&term=" + term + "&pricetype=" + pricetype;
			
					
		}
					
	else if (ordertype ==16)
	
		{ 
								
			url = "/e/t/"+globAppName+"/ironcondorcontroler?action=ironcondororderentry&num_legs=4&transaction1=" + transaction1 + "&transaction2=" + transaction2 + "&transaction3=" + transaction3 + "&transaction4=" + transaction4 + "&quantity1=" + quantity[0] +"&quantity2=" + quantity[1] + "&quantity3=" + quantity[2] + "&quantity4=" + quantity[3] + "&symbol1=" + symbol[0] + "&symbol2=" + symbol[1] + "&symbol3=" + symbol[2] + "&symbol4=" + symbol[3] + "&aonflag=" + aonflag + "&price=" + price + "&term=" + term + "&pricetype=" + pricetype;
					
					
		}

	else if (ordertype ==17)
	
		{ 
								
			url = "/e/t/"+globAppName+"/ironbutterflycontroler?action=ironbutterflyorderentry&num_legs=4&transaction1=" + transaction1 + "&transaction2=" + transaction2 + "&transaction3=" + transaction3 + "&transaction4=" + transaction4 + "&quantity1=" + quantity[0] +"&quantity2=" + quantity[1] + "&quantity3=" + quantity[2] + "&quantity4=" + quantity[3] + "&symbol1=" + symbol[0] + "&symbol2=" + symbol[1] + "&symbol3=" + symbol[2] + "&symbol4=" + symbol[3] + "&aonflag=" + aonflag + "&price=" + price + "&term=" + term + "&pricetype=" + pricetype;
					
					
		}		
	else  
		{
			return "";
			
		}
		
	linkhtml = printLink(url, 'Re-Enter Order');
	
	return linkhtml;
	
}

function writeReenterLink(typecode, orderaction, poseffect, symbol, quantity, pricetype, term, aon, stopprice, limitprice, eh, ordertrigger){
	var url = "";
	var linkhtml="";
	var transaction=0;

	if(typecode=='OPTN'){
		if(orderaction==2 && poseffect==1) transaction=1;
		if(orderaction==3 && poseffect==1) transaction=2;
		if(orderaction==2 && poseffect==2) transaction=3;
		if(orderaction==3 && poseffect==2) transaction=4;
		url = "/e/t/"+globAppName+"/optionorderentry?transaction=" + transaction + "&contracts=" + quantity;
		if(term==3) term=1;
		if(limitprice==0) limitprice=stopprice;
	}
	else if(typecode=='EQ'){
		if(orderaction==2){
			if(poseffect==2) ordertype=4;
			else ordertype=1;
		}
		if(orderaction==3){
			if(poseffect==1) ordertype=3;
			else ordertype=2;
		}
		url = "/e/t/"+globAppName+"/socreateentry?ordertype=" + ordertype;
		if(eh==2) url = url + "&mktsess=2";
	}
	else if(typecode=='MF' || typecode=='MMF'){
		if(globAppName=='ria'){
			if(orderaction==2) url = "/e/t/"+globAppName+"/mfbuy?symbol=" + symbol;
			else if(orderaction==3) url = "/e/t/"+globAppName+"/mfsell?symbol=" + symbol;
		}
		else{
			if(orderaction==2) url = "/e/t/mftrading/mfbuy?symbol=" + symbol;
			else if(orderaction==3) url = "/e/t/mftrading/mfsell?symbol=" + symbol;
		}

		if(ordertrigger==5){
			if(globAppName=='ria') url = "/e/t/"+globAppName+"/mfexchangesell";
			else url = "/e/t/mftrading/mfexchangesell";
		}
	}
	if(url!=""){
		if(typecode!='MF' && typecode!='MMF') url = url + "&symbol=" + symbol + "&numshares=" + quantity + "&quantity=" + quantity + "&pricetype=" + pricetype + "&term=" + term + "&aon=" + aon + "&limitprice=" + limitprice + "&stopprice=" + stopprice;
		linkhtml = printLink(url, 'Re-Enter Order');
	}
	return linkhtml;
}

function writeBondReenterLink(symbol,p_magic){
	symbol = symbol.toString().replace(/\$|\,/g,'');
	linkhtml = "<a href=\"javascript:gotoBondLink('bondsearch','"+symbol+"','"+p_magic+"','"+p_bridge+"');\">Re-Enter Order</a>";
	return linkhtml;
}

function writeAOChangeCancelLinks(ordernum,aotype,accountid,reverseqty,orderaction){
	var url,linkhtml="";
	if(reverseqty <= 0){
		if(parseInt(aotype)<3){
			if(orderaction==2) url = "/e/t/"+globAppName+"/bracketedbuychangeentry";
			else url = "/e/t/"+globAppName+"/bracketedsellchangeentry";
		}
		if(parseInt(aotype)==3) url = "/e/t/"+globAppName+"/etheldstopchangeentry";
		if(parseInt(aotype)==4) url = "/e/t/"+globAppName+"/trailingstopchangeentry";

		url = url + "?orderNum=" + ordernum + "&rfa=" + ordernum  + "&accountId=" + accountid;
		linkhtml =  printLink(url, 'Change') + " ";
	}
	url = "/e/t/"+globAppName+"/aocancelentry?orderNum=" + ordernum + "&rfa=" + ordernum + "&accountId=" + accountid;
	linkhtml = linkhtml + printLink(url, 'Cancel');
	return linkhtml;
}

function writeChangeCancelLinks(ordernum, accountid, typecode, reverseqty, eh, legcount, orderType){

	var url,linkhtml="";
	if(typecode=='MF' || typecode=='MMF'){
		if(globAppName=='ria') url = "/e/t/"+globAppName+"/MFCancelOrder?cancel_order=" + ordernum;
		else url = "/e/t/applogic/MFCancelOrder?cancel_order=" + ordernum;
		linkhtml = printLink(url,'Cancel');
	}
	else
	if(legcount==2){ // complex options
		if(reverseqty <= 0){
			url = "/e/t/"+globAppName+"/complexoptionorderchange?OrderNo=" + ordernum + "&RFA=" + ordernum + "&account=" + accountid;
			linkhtml = linkhtml + printLink(url, 'Change') + " ";
		}
		url = "/e/t/"+globAppName+"/complexoptionordercancel?OrderNo=" + ordernum + "&RFA=" + ordernum + "&account=" + accountid;
		linkhtml = linkhtml + printLink(url, 'Cancel');
	}
	else
	if(legcount==1){
		if(typecode=="OPTN"){
			if(reverseqty <= 0){
				url = "/e/t/"+globAppName+"/OptionOrderChange?OrderNo=" + ordernum + "&RFA=" + ordernum + "&account=" + accountid;
				linkhtml = linkhtml + printLink(url, 'Change') + " ";
			}
			url = "/e/t/"+globAppName+"/OptionOrderCancel?OrderNo=" + ordernum + "&RFA=" + ordernum + "&account=" + accountid;
			linkhtml = linkhtml + printLink(url, 'Cancel');
		}
	
		else
		if(typecode=="EQ"){
			if(eh==2){
				if(reverseqty <= 0){
					url = "/e/t/"+globAppName+"/ehchangeentry?orderNum=" + ordernum + "&accountId=" + accountid;
					linkhtml = linkhtml + printLink(url, 'Change') + " ";
				}
				url = "/e/t/"+globAppName+"/ehcancelentry?orderNum=" + ordernum + "&accountId=" + accountid;
				linkhtml = linkhtml + printLink(url, 'Cancel');
			}
			else{
				if(reverseqty <= 0){
					url = "/e/t/"+globAppName+"/sochangeentry?orderNum=" + ordernum + "&accountId=" + accountid;
					linkhtml = linkhtml + printLink(url, 'Change') + " ";
				}
				url = "/e/t/"+globAppName+"/socancelentry?orderNum=" + ordernum + "&accountId=" + accountid;
				linkhtml = linkhtml + printLink(url, 'Cancel');
			}
		}
		else
		if(typecode=="BOND") {
			ordernum = (ordernum.replace(/^\W+/,'')).replace(/\W+$/,'');
                        ordernum = ordernum.replace(/null/,'');
			cancelhtml = "<a href=\"javascript:gotoBondLink('orderdetail','"+ordernum+"','"+p_magic+"','"+p_bridge+"');\">Cancel</a>";
			linkhtml = cancelhtml;
		}
		
		
	}
	
	else if (orderType==14){
			if(reverseqty <= 0){
				url = "/e/t/"+globAppName+"/butterflycontroler?action=butterflychangeentry&additionalinput.accountId=" + accountid + "&additionalinput.orderNumber=" + ordernum;
				linkhtml = linkhtml + printLink(url, 'Change') + " ";
			}
			url = "/e/t/"+globAppName+"/complexoptionordercancel?OrderNo=" + ordernum + "&RFA=" + ordernum + "&account=" + accountid;
			linkhtml = linkhtml + printLink(url, 'Cancel');
		}
		
	else if (orderType==15){
			if(reverseqty <= 0){
				url = "/e/t/"+globAppName+"/condorcontroler?action=condorchangeentry&additionalinput.accountId=" + accountid + "&additionalinput.orderNumber=" + ordernum;
				linkhtml = linkhtml + printLink(url, 'Change') + " ";
			}
			url = "/e/t/"+globAppName+"/complexoptionordercancel?OrderNo=" + ordernum + "&RFA=" + ordernum + "&account=" + accountid;
			linkhtml = linkhtml + printLink(url, 'Cancel');
		}

	else if (orderType==16){
			if(reverseqty <= 0){
				url = "/e/t/"+globAppName+"/ironcondorcontroler?action=ironcondorchangeentry&additionalinput.accountId=" + accountid + "&additionalinput.orderNumber=" + ordernum;
				linkhtml = linkhtml + printLink(url, 'Change') + " ";
			}
			url = "/e/t/"+globAppName+"/complexoptionordercancel?OrderNo=" + ordernum + "&RFA=" + ordernum + "&account=" + accountid;
			linkhtml = linkhtml + printLink(url, 'Cancel');
		}

	else if (orderType==17){
			if(reverseqty <= 0){
				url = "/e/t/"+globAppName+"/ironbutterflycontroler?action=ironbutterflychangeentry&additionalinput.accountId=" + accountid + "&additionalinput.orderNumber=" + ordernum;
				linkhtml = linkhtml + printLink(url, 'Change') + " ";
			}
			url = "/e/t/"+globAppName+"/complexoptionordercancel?OrderNo=" + ordernum + "&RFA=" + ordernum + "&account=" + accountid;
			linkhtml = linkhtml + printLink(url, 'Cancel');
		}		
	 
	return (linkhtml);
}

function writeAOPriceEntered(aotype,offset,orderaction,brklmtprice,stopprice,pricetrail,ordertrigger,limitprice,ordertype){
	var price="";
	if(aotype<3){ //bracketed
		if(pricetrail > 0 && aotype==2) stopprice = pricetrail; // for t-stop show pricetrail as price if pricetrail > 0
		if(orderaction==2) price = formatMoney(stopprice) + "<br/>" + formatMoney(brklmtprice);
		else price = formatMoney(brklmtprice) + "<br/>" + formatMoney(stopprice);
	}
	else if(aotype==3){
		price = formatMoney(stopprice);
		if(ordertrigger==2) price = price + "<br/>" + formatMoney(limitprice);
	}
	else if(aotype==4){
		if(pricetrail > 0) stopprice = pricetrail; // for t-stop show pricetrail as price if pricetrail > 0
		price = formatMoney(stopprice);
	}
	else if(aotype==5 || aotype==6) price = formatMoney(brklmtprice);
	if(ordertype==8) price="--"; //for option expired
	return(price);
}

function writePriceEntered(typecode,ordertrigger,limitprice,stopprice,ordertype){
        var returnstr="";
	if(ordertrigger==1 || ordertrigger==12 || ordertrigger==13) returnstr = "Mkt";
	if(ordertrigger==2 || ordertrigger==6 || ordertrigger==7 || ordertrigger==14 || ordertrigger==15 || ordertrigger==16 || ordertrigger==17) returnstr = formatMoney(limitprice);
	if(ordertrigger==3) returnstr = formatMoney(stopprice);
	if(ordertrigger==4) returnstr = formatMoney(stopprice) + " STP<br/>" + formatMoney(limitprice) + " LMT";
	if(ordertrigger==8 || ordertrigger==11) returnstr = "Even";
	if(ordertrigger==5) returnstr = "Mkt"; //for Mf exchange
	if(ordertype==8) returnstr="--"; //for option expired
	return(returnstr);
}

function writeWholeOrderType(ordertype,isAO,eh,aoordertype,typecode){
	var returnstr="";
	if(ordertype==1 || ordertype==2) returnstr = "Stock";
	if(eh && eh==2) returnstr = "Extended Hours";
	if(ordertype==3 || ordertype==4 || ordertype==5 || ordertype==12) returnstr = "Option";
	if(ordertype==6) returnstr = "Option Exercise";
	if(ordertype==7) returnstr = "Option Assignment";
	if(ordertype==8) returnstr = "Option Expired";
	if(ordertype==9 && typecode=='MF') returnstr = "Mutual Fund";
	if(ordertype==9 && typecode=='MMF') returnstr = "Mutual Fund";
	if(ordertype==10) returnstr = "Money Market Fund";
	if(ordertype==11) returnstr = "Bond";
	if(ordertype==13) returnstr = "Do Not Exercise";
	
	if(ordertype==14) returnstr = "Option";
	if(ordertype==15) returnstr = "Option";
	if(ordertype==16) returnstr = "Option";
	if(ordertype==17) returnstr = "Option";
	
	if(ordertype==25) returnstr = "Contingent";
	if(ordertype==26) returnstr = "One Cancels All";
	if(ordertype==27) returnstr = "One Triggers All";
	if(ordertype==28) returnstr = "One Triggers OCO";
	if(isAO && (aoordertype==1 || aoordertype==2)) returnstr = "Bracketed";
	return(returnstr+"<br/>");
}

function writeOrderType(mktsess,typecode,orderaction,poseff){
	var returnstr="";
	if(orderaction==4) returnstr = "Exchange";
	else
	if(typecode=='EQ'){
		if(orderaction==2 && poseff==1) returnstr = "Buy";
		if(orderaction==3 && poseff==2) returnstr = "Sell";
		if(orderaction==3 && poseff==1) returnstr = "Sell Short";
		if(orderaction==2 && poseff==2) returnstr = "Buy Cover";
	}
	else
	if(typecode=='OPTN'){
		if(orderaction==2 && poseff==1) returnstr = "Buy Open";
		if(orderaction==2 && poseff==2) returnstr = "Buy Close";
		if(orderaction==3 && poseff==1) returnstr = "Sell Open";
		if(orderaction==3 && poseff==2) returnstr = "Sell Close";
	}
	else
	if(typecode=='MF'){
		if(orderaction==2) returnstr = "Buy";
		if(orderaction==3) returnstr = "Sell";
	}
	else{
		if(orderaction==2) returnstr = "Buy";
		if(orderaction==3) returnstr = "Sell";
	}
	if(mktsess==2) returnstr = "EH " + returnstr;
	return(returnstr);
}

function writeQuantity(qtytype,qty,reserveqty,aon,ordertype,rowpos,filledqty){
	var aontext='';
	if(rowpos==1 && aon==1){
		if(ordertype!=6 && ordertype!=7 && ordertype!=8 && ordertype!=9 && ordertype!=10 && ordertype!=11) aontext='<font style="font-size:8px;">/AON</font>';
	}
	else aontext="";

	var returnstr="";
	if(qtytype==4) returnstr = "All I own";
	else if(qtytype==3) returnstr = "$" + formatMoney(qty);

	else if((qtytype==2) && (ordertype!=9) && (ordertype!=10) ){
	  	if(reserveqty > 0) returnstr = formatMoney(qty,true) + "/" + formatMoney(reserveqty,true) + "R" + aontext;
  		else returnstr = formatMoney(qty,true) + aontext;
		if(filledqty > 0 && filledqty < qty) returnstr = formatMoney(filledqty,true) + " / " + returnstr;
	}

	else if((qtytype==2) && (ordertype==9 || ordertype==10) ){
	  	if(reserveqty > 0) returnstr = formatMoney(qty,false) + "/" + formatMoney(reserveqty,false) + "R" + aontext;
  		else returnstr = formatMoney(qty,false) + aontext;
		if(filledqty > 0 && filledqty < qty) returnstr = formatMoney(filledqty,false) + " / " + returnstr;
	}

	else if(qtytype==5) returnstr = formatMoney(qty);
	return(returnstr);
}

function writeAOPriceType(aotype,offsettype,orderaction,ordertrigger,grouporderno,ordergrouptype){
	var returnstr="";
	var offset = "$";
	if(offsettype==2) offset = "%";
	aotype = parseInt(aotype);
	if(aotype==1){
		if(orderaction==2) returnstr = returnstr + "H-Stop<br/>" + returnstr + "Lower Trigger";
		else returnstr = returnstr + "Upper Trigger<br/>" + returnstr + "H-Stop";
	}
	if(aotype==2){
		if(orderaction==2) returnstr = returnstr + "T-Stop " + offset + "<br/>" + returnstr + "Lower Trigger";
		else returnstr = returnstr + "Upper Trigger<br/>" + returnstr + "T-Stop " + offset;
	}
	if(aotype==3){
		if(ordertrigger && ordertrigger==1){
			if(ordergrouptype==27 || (ordergrouptype==28 && grouporderno==1) || grouporderno==0) returnstr = returnstr + "H-"; //ota or otoco 1st or if (not group and regular h-stop)
			returnstr = returnstr + "Stop";
		}
		else if(ordertrigger && ordertrigger==2) returnstr = returnstr + "Stop<br/>Limit";
		else returnstr = "H-Stop";
	}
	if(aotype==4) returnstr = "T-Stop " + offset;
	if(aotype==5) returnstr = "Limit<br/>(Presentable)";
	if(aotype==6) returnstr = "Limit";
	return(returnstr);
}

function writePriceType(typecode,ordertrigger,ordertype){
        var returnstr="";
	if(typecode=='MF' || typecode=='MMF') returnstr = "Mutual Fund";
	if(typecode=='EQ' || typecode=='OPTN' || typecode=='BOND') returnstr = getPricetype(parseInt(ordertrigger));
	if(ordertype==8) returnstr = "--"; //for option expired
	return(returnstr);
}

function getPricetype(ordertrigger){
	if(ordertrigger==1) return("Mkt");
	if(ordertrigger==2) return("Limit");
	if(ordertrigger==3) return("Stop");
	if(ordertrigger==4) return("Stop Limit");
	if(ordertrigger==6 || ordertrigger==9) return("Net Debit");
	if(ordertrigger==7 || ordertrigger==10) return("Net Credit");
	if(ordertrigger==8 || ordertrigger==11) return("Even");
	if(ordertrigger==12) return("MOO");
	if(ordertrigger==13) return("MOC");
	if(ordertrigger==14) return("LOO");
	if(ordertrigger==15) return("LOC");
        if(ordertrigger==16) return("Firm");
        if(ordertrigger==17) return("Subject");

}

function getOrderTermText(term,ordertype){
       var returnstr="";
	if(term==3 || term==1) returnstr = "Day";
	if(term==2) returnstr = "GT 60";
	if(term==2 && ordertype==11) returnstr = "GTA";
	if(term==5) returnstr = "IOC";
	if(term==6) returnstr = "FOK";
	if(ordertype==8) returnstr = "--"; //for option expired
	return(returnstr);
}

function writeExecutedLink(poseff){
	var returnstr="";
	if(globAppName=='ria'){
		var link1 = '/e/t/' + globAppName + '/portfolioview';
		var link2 = '/e/t/' + globAppName + '/revrealizedgains';
		if(poseff==1) returnstr = printLink(link1,'Portfolios');
		else if(poseff==2) returnstr = printLink(link2,'Gains/Losses');
	}
	else{
		if(poseff==1) returnstr = printLink('/e/t/pfm/portfolioview','Portfolios');
		else if(poseff==2) returnstr = printLink('/e/t/accounts/revrealizedgains','Gains/Losses');
	}
	return returnstr;
}


function formatMoney(x,dontshowcent){
	var num = x;

	if ((typeof num) == "number") num = num.toString();

	num=num.replace(/,/g, "");
	var numSplit = num.split('.');
	 // num = num - 0;
	if(!dontshowcent){

		var returnval;
		
		var decimal = numSplit.length > 1 ? numSplit[1] : '00';

decimal = decimal.length ==1 ? decimal+"0" : decimal;
decimal = decimal.length >4 ? decimal.substring(0,4) : decimal;


		returnval = numSplit[0] + "."+decimal;
	}
	else returnval = numSplit[0];
	return addCommas(returnval);
}



function addCommas(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)){
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function transactionTypeDecode (description) {

if (description == "Buy Open") return 5;
if (description == "Sell Open") return 6;
if (description == "Buy Close") return 7;
if (description == "Sell Close") return 8;

return "";

}

