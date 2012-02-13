

var MARKET_SYMS = "COMP.IDX,DJIND,SPX";
var QFOOTERCT =0;
var QTIMER =0;

//Default input message
var DEFAULT_MESSAGE = "Enter symbol(s)";
var QUOTE_TYPES = ["Real Time","15 Minute Delay","Closing Price","Extended Hours - Real Time","Pre-Open Quote","Extended Hours - Closing Price"];

// webTrends name-value query string pairs
var WTpn = "WT.pn";
var WTpnValue = "Quotes Symbol Lookup";
var WTtx = "WT.tx_u";
var WTtxValue = "1";
var WTpc = "WT.pc_sc";

// base webTrends query string that all data capture events take
var WTbaseQS = WTpn + "=" + WTpnValue + "&" + WTtx + "=" + WTtxValue + "&" + WTpc + "=";

// WT.pc_sc value is the only one that differs between data capture events
var WTpcTrade = "Trade";				// on TRADE button release (quote view)	
var WTpcInd = "Stock Symbol";			// on index text link release (market view)
var WTpcSymSearch = "Symbol Lookup";	// on SYMBOL SEARCH release
var WTpcMarkInfo = "More Market Info";	// on MORE MARKET INFO release (market view)
var WTpcDQ = "Detailed Quote";			// on DETAILED QUOTE select
// var WTpcCS = "Company Snapshot";		// on COMPANY SNAPSHOT select  // not needed anymore
var WTpcOC = "Option Chains";			// on OPTION CHAINS select
var WTpcCN = "News";			// on CO NEWS select
var WTpcCC = "Charts";			// on CHARTS select
var WTpcQQ = "Quick View";				// on equity quick quote

var mode = 1; // Must correct this // for extended hours how does the html get this value?. 
var AH_FLAG = mode == 1 ? "&ah_flag=1" : "";


// link paths
var PAGE_TRADE_STOCKS = "/e/t/invest/socreateentry?traxui=QW&" + WTbaseQS + WTpcTrade + "&Symbol="; 
var PAGE_TRADE_OPTIONS = "/e/t/invest/optionorderentry?traxui=QW&" + WTbaseQS + WTpcTrade + "&Symbol="; 
var PAGE_TRADE_MUTUAL = "/e/t/applogic/MFBuy2?traxui=QW&" + WTbaseQS + WTpcTrade + "&buy=";
var PAGE_TRADE_EXTENDED = "/e/t/invest/ehcreateentry?traxui=QW&" + WTbaseQS + WTpcTrade + "&Symbol=";
var LINK_QRESEARCH = "/e/t/invest/quotesandresearch?traxui=QW&content=1&site=quotesandresearch"; 
var PAGE_DETAILED = LINK_QRESEARCH + AH_FLAG + "&" + WTbaseQS + WTpcDQ + "&sym=";
var PAGE_INDEX_NASDAQ = LINK_QRESEARCH + "&sym=comp.idx" + AH_FLAG + "&" + WTbaseQS + WTpcInd; 
var PAGE_INDEX_DJIA	= LINK_QRESEARCH  + "&sym=djind" + AH_FLAG + "&" + WTbaseQS + WTpcInd;
var PAGE_INDEX_SP = LINK_QRESEARCH  +"&sym=spx" + AH_FLAG + "&" + WTbaseQS + WTpcInd;
var PAGE_MARKETS = "/e/t/invest/markets?traxui=QW&" + WTbaseQS + WTpcMarkInfo;
// var PAGE_SNAPSHOT = "/e/t/invest/quotesandresearch?traxui=QW&content=2&site=quotesandresearch&" + WTbaseQS + WTpcCS + "&sym="
var PAGE_OPTIONS = "/e/t/invest/quotesandresearch?traxui=QW&content=3&site=quotesandresearch&" + WTbaseQS + WTpcOC + "&sym="
var PAGE_NEWS = "/e/t/invest/newsandresearch?traxui=QW&content=3&site=newsandresearch&" + WTbaseQS + WTpcCN + "&sym="
var PAGE_TCHART	= "/e/t/invest/quotechart?traxui=QW&content=2&site=quotechart&" + WTbaseQS + WTpcCC + "&sym="
var PAGE_SYMBOLSEARCH = "javascript:symbolSearch();dcsMultiTrack('" + WTpn + "', '" + WTpnValue + "', '" + WTpc + "', '" + WTpcSymSearch + "', '" + WTtx + "', '" + WTtxValue + "');";

var MainQuote; //CONTAINER FOR THE QUOTE INFORMATION.

$(document).ready(function(){
	//show Indx as default
	updateIndex();

	$("#qselect").change(function() {
		//get the symbol from the input box.
		// if no symbol was found, then default urls to be used
		//if symbol was found, send the symbol with the url.
		var inp_sym = $("#qtinput").val();
		
		//trim spaces in the input symbol by replacing them with ,
		inp_sym = inp_sym.replace(/^\s+|\s+$/g,""); //trim the leading and trailing whitespaces
		if(inp_sym != DEFAULT_MESSAGE) inp_sym = inp_sym.replace(/ /g, ','); //any space inbetween becomes ,
	
		switch($("#qselect option:selected").val()){
			case "2":
				if (inp_sym == undefined || inp_sym == "" ||  inp_sym == DEFAULT_MESSAGE)
					document.location.href = "/e/t/invest/wsoddirect?wsod_page=/v1/stocks/multisnapshot/multisnapshot.asp?symbols=COMP.IDX,DJIND,SPX&peer=false"; 
				else if(inp_sym.indexOf(',') != -1)
					document.location.href = "/e/t/invest/wsoddirect?wsod_page=/v1/stocks/multisnapshot/multisnapshot.asp?symbols="+inp_sym+"&peer=false"; 
				else 
					document.location.href = "/e/t/invest/wsoddirect?wsod_page=/v1/stocks/snapshot/snapshot.asp?symbol=" +inp_sym; 
				break;
			case "3":
				if (inp_sym == undefined || inp_sym == "" ||  inp_sym == DEFAULT_MESSAGE)
					document.location.href = "/e/t/invest/options";
				else if(inp_sym.indexOf(',') != -1)
					document.location.href = "/e/t/invest/wsoddirect?wsod_page=/v1/stocks/multisnapshot/multisnapshot.asp?symbols="+inp_sym+"&peer=false"; 
				else
					document.location.href = PAGE_OPTIONS + inp_sym; 
				break;
			case "4":
				if (inp_sym == undefined || inp_sym == "" ||  inp_sym == DEFAULT_MESSAGE)
					document.location.href = "/e/t/invest/wsoddirect?wsod_page=/v1/news/marketnews/marketnews.asp?newsType=headlines";
				else if(inp_sym.indexOf(',') != -1)
					document.location.href = "/e/t/invest/wsoddirect?wsod_page=/v1/stocks/multisnapshot/multisnapshot.asp?symbols="+inp_sym+"&peer=false"; 
				else
					document.location.href="/e/t/invest/wsoddirect?wsod_page=/v1/stocks/news/search_results.asp?symbol="+inp_sym;
			
				break;
			case "5":
				if (inp_sym == undefined || inp_sym == "" ||  inp_sym == DEFAULT_MESSAGE)
					document.location.href = "/e/t/invest/wsoddirect?wsod_page=/v1/stocks/multisnapshot/charts.asp?symbols=COMP.IDX,DJIND,SPX&peer=false";
				else if(inp_sym.indexOf(',') != -1)
					document.location.href = "/e/t/invest/wsoddirect?wsod_page=/v1/stocks/multisnapshot/charts.asp?symbols="+inp_sym+"&peer=false"; 
				else 
					document.location.href = "/e/t/invest/wsoddirect?wsod_page=/v1/stocks/charts/charts.asp?symbol="+inp_sym;

				break;
		}
	});

	$("#qtinput").click(function(){
		this.select();
	});

 $("#qtinput").keypress(function (e) {
        var k = e.keyCode || e.which;
        if (k == 13) {
           updateQuotes();
        }
    });

$("#qbtn").click(function(){
           updateQuotes();
});

});

//rotating display for the time display
function updateIndex(){
	if($("#qtinput").val() == "") {
	 $("#qtinput").val(DEFAULT_MESSAGE);
	 $("#qtinput").select();
	}
	var iUrl = "/e/t/invest/flash?sym="+MARKET_SYMS;
	$.ajax({
		type: "GET",
		url: iUrl,
		success: function(xmldata) {
			xmldata = xmldata.replace(/&/g,  "&amp;");	
			xmldata = xmldata.replace(/\n/g,  "");	
			xmldata = xmldata.replace("<?xml version='1.0'?>" ,  "");	
		
			var xmldoc;
		 	if (!window.DOMParser) {
      			xmldoc = new ActiveXObject("Microsoft.XMLDOM");
       			xmldoc.async = false;
			    xmldoc.loadXML(xmldata);
     		} else {
      			 xmldoc = xmldata;
     		} 

				//check for bad symbol. no quote from backend
			if($(xmldoc).find('quote').length == 0) { showErrorMsg(); return;}
			
			$(xmldoc).find('quote').each(function(){
				var symb = $(this).find('symbol').text();
				if(symb == "COMP.IDX") {
					$("#nssym").html("<a href='"+PAGE_INDEX_NASDAQ+"'>Nasdaq</a>");
					$("#nspoints").html($(this).find('price').text());
					$("#nschange").html(setChangeColor($(this).find('change').text()));
				}
				else if(symb == "DJIND"){
					$("#djsym").html("<a href='"+PAGE_INDEX_DJIA+"'>DJIA</a>");
					$("#djpoints").html($(this).find('price').text());
					$("#djchange").html(setChangeColor($(this).find('change').text()));
				}
				else if(symb == "SPX"){
					$("#spsym").html("<a href='"+PAGE_INDEX_SP+"'>S&amp;P 500</a>");
					$("#sppoints").html($(this).find('price').text());
					$("#spchange").html(setChangeColor($(this).find('change').text()));
				}
 				
			});
				$("#indxview").css("display", "none");
				$("#stkview").css("display", "none");
				$("#qNoticeBox").css("display", "none");
				$("#indxview").slideDown("slow");
				//update the qtime and market info tags
				fillFooter($(xmldoc).find("quote").find("quote_type").text(), $(xmldoc).find("quote").find("time").text(), 0);
		},
		error:function (xhr, ajaxOptions, thrownError){
			//alert("error");
		//                   			alert(xhr.status);
		//                 			alert(thrownError);
		}    

	});
}

function updateQuotes(){
	var inp_symb = $("#qtinput").val();
	var iUrl = "/e/t/invest/flash?sym=";
	//trim spaces in the input symbol by replacing them with ,
	inp_symb = inp_symb.replace(/^\s+|\s+$/g,""); //trim the leading and trailing whitespaces

	if(inp_symb == DEFAULT_MESSAGE || inp_symb == ''){
		updateIndex();
		return;
	}

	inp_symb = inp_symb.replace(/ /g, ','); //any space inbetween becomes ,
	if(inp_symb.indexOf(',') != -1){
		document.location.href = "/e/t/invest/wsoddirect?wsod_page=/v1/stocks/multisnapshot/multisnapshot.asp?symbols="+inp_symb+"&peer=false"; 
	}
	else {
		iUrl = iUrl +escape(inp_symb);
		$.ajax({
		type: "GET",
		url: iUrl,
		success: function(xmldata) {
		
		// remove the spaces and newlines so the xml could be validated. empty spaces are treated as another node in IE
		xmldata = xmldata.replace(/&/g,  "&amp;");	
		xmldata = xmldata.replace(/\n/g,  "");	
		xmldata = xmldata.replace("<?xml version='1.0'?>" ,  "");	
		

		//	 The raw data from backend needs to be converted to xml document for IE .otherwise $().find() will not work.
		var xmldoc;
		 if (!window.DOMParser) {
       			xmldoc = new ActiveXObject("Microsoft.XMLDOM");
       			xmldoc.async = false;
       			xmldoc.loadXML(xmldata);
     		} else {
     		  	xmldoc = xmldata;
     		} 
		 
			if($(xmldoc).find("quote").length == 0) {showErrorMsg(); return;}	


			$(xmldoc).find('quote').each(function(){
				var qdata = $(this);
				var cpname =qdata.find("company_name").text();
				var cpsym ="(" +qdata.find("symbol").text()+ ")";

				//length of symbol and cpname
				var cpsym_len = cpsym.length;
				var cpname_len = cpname.length;
				var allowd_len = 23 - cpsym_len;

				allowd_len = allowd_len == 0 ? 1 : allowd_len;

				cpname = (cpname_len < allowd_len) ? cpname : cpname.substr(0, allowd_len)+"... ";
				$("#cpname").html("<strong>"+cpname +"</strong>"); 
			
			//symbol
			$("#cpsym").html("<strong>("+qdata.find("symbol").text()+")</strong>");
				
			
			//price
			$("#qprice").html("<strong>"+roundNumber(qdata.find("price").text(), 2)+"</strong>");

			//change
			$("#qchange").html(setChangeColor(roundNumber(qdata.find("change").text(), 2)));

			//percentage
			$("#qperc").html(setChangeColorPerc(qdata.find("percent_change").text()));

			//bid  and ask
			$("#bid").html("Bid "+roundNumber(qdata.find("bid").text(), 2));
			$("#ask").html("Ask "+roundNumber(qdata.find("ask").text(), 2));

			//volume
			if(qdata.find("product_type").text() == "MF"){
				$("#vol").html("Mutual Fund Quote");
				$("#trlink").html("<a href='"+PAGE_TRADE_MUTUAL+inp_symb+"'>Trade</a>");
			}
			else if(qdata.find("product_type").text() == "OPTN"){
				$("#vol").html("Option Quote");
				$("#trlink").html("<a href='"+PAGE_TRADE_OPTIONS+inp_symb+"'>Trade</a>");
			}
			else {
				$("#vol").html("Vol "  +formatNumber(qdata.find("volume").text(), 0));
				$("#trlink").html("<a href='"+PAGE_TRADE_STOCKS+inp_symb+"'>Trade</a>");
			}
			fillFooter(qdata.find("quote_type").text(), qdata.find("time").text(), 1);
				return false; 
			});
			$("#stkview").css("display", "none");
			$("#indxview").css("display", "none");
			$("#qNoticeBox").css("display", "none");
			$("#stkview").slideDown("slow");
			$("#qtinput").select();

		},
		error:function (xhr, ajaxOptions, thrownError){
			//alert("error");
		//                   			alert(xhr.status);
		//                 			alert(thrownError);
		}    

	});	

	}
}

function fillFooter(qp, qtime, mrk){
				qtime = qtime.split("ET");
				qtime = qtime[0]+" ET";
				qtime = qtime.replace(/-/, " - ");
				qp = qp.charAt(0);
				
				$("#qtypesp").html("<strong>"+QUOTE_TYPES[qp]+"</strong>");
				$("#qtimesp").html("<strong>"+qtime+"</strong>");
				
				if(mrk==1)
					$("#mrkinfo").html("<a href='javascript: updateIndex();'>Back to Markets Index</a>");
				else
					$("#mrkinfo").html("<a href='"+PAGE_MARKETS+"'>More Market Info</a>");

				if(QTIMER != 0){
					QTIMER = clearInterval(QTIMER);
					QTIMER =0;
				}
				QTIMER = setInterval("changeqfooter()", 2000);
}

function changeqfooter(){
	if(QFOOTERCT == 0) {
		$("#qfooter").html($("#qtypesp").html());
		QFOOTERCT =1;
	}
	else {
		$("#qfooter").html($("#qtimesp").html());
		QFOOTERCT = 0;
	}
}

function showErrorMsg() {
	$("#indxview").css("display", "none");
	$("#stkview").css("display", "none");
  	$("#qNoticeBox").css("display", "none");
  	$("#qNoticeBox").slideDown("slow");
	$("#qtinput").select();

	$("#qfooter").html("");
	$("#mrkinfo").html("<a href='"+PAGE_MARKETS+"'>More Market Info</a>");
		if(QTIMER != 0){
					QTIMER = clearInterval(QTIMER);
					QTIMER =0;
				}			
}

//from the quotes widget flash
function formatNumber(iNum,iDec){
	var w,d,dp,sNum,sRet,i,loops,size,next;

	sNum=String(iNum);
	dp=sNum.indexOf(".");
	w=dp!=-1?sNum.subStr(0,dp):sNum;
	d=iDec>0?sNum.subStr(dp,iDec+1):"";
	while(iDec>0&&d.length-1<iDec){
		d+="0";
	}
	sRet='';
	size = w.length;
	loops=Math.ceil(w.length/3);
	for(var i=0; i < loops; i++){
		next = size-(i+1)*3;
		if(next>0){
			sRet=","+w.substr(next,3)+sRet;
		}else{
			sRet=w.substr(0,next+3)+sRet;
		}
	}
	sRet+=d;
	return sRet;
}

// rounds number to specified decimal place
	// num = number to round
	// place = number of places to round to, e.g., 2 --> .00
function roundNumber(num,place) {
	// round number
	if (place >= 0) {
		var tempNum = Math.pow(10,place);
		var roundedNum = Math.round(num * tempNum) / tempNum;
	}
	// format as 0.00
	var numStr = roundedNum.toString();
	if(numStr == "NaN") numStr = "0";
	// find decimal
	var decPlace = numStr.indexOf(".")
	if (decPlace == -1) {
		return numStr.concat(".00");
	} else if (numStr.length - decPlace != 3) {
		return numStr.concat("0");
	} else {
		return numStr;
	}
}

function setChangeColor (dataValue){
	var hex;
	var dsign="";
	if (dataValue < 0) hex = "#FF0000"; 
	if (dataValue > 0) { hex = "#008800"; dsign = "+";}
	if (dataValue == 0) { hex = "#000000"; dataValue= "0.00";}
	return "<b><font color='"+hex+"' >"+dsign+dataValue+"</font></b>";
}


function setChangeColorPerc (dataValue){

	var hex;
	if (dataValue < 0) {hex = "#FF0000"; dataValue.replace("-", "");} 
	if (dataValue > 0) { hex = "#008800"; }
	if (dataValue == 0) { hex = "#000000"; dataValue= "0.00";}
	return "<b><font color='"+hex+"' >("+dataValue+"%)</font></b>";
}

/* function noCache () {
	return "&noCache=" + Math.ceil(Math.random()*2); 
}
*/
