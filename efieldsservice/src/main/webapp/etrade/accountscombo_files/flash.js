var flashVers = ( typeof FindFlashVers != "undefined" ) ?  FindFlashVers() : null;
var AkamaiURL = ( typeof AkamaiURL != "undefined" ) ?  AkamaiURL : "";

function showSWF(reqdPlayer,swfPath,swfWidth,swfHeight,swfID,salign,bgColor,swfVars,noFlashHtml,noFlashImg,imgOnClick,imgW, imgH,base,wmode,scale) 
{
document.write(
  getFlashHtml(reqdPlayer,swfPath,swfWidth,swfHeight,swfID,salign,bgColor,swfVars,noFlashHtml,noFlashImg,imgOnClick,imgW, imgH,base,wmode,scale));
}

function writeSWF2Div(divID,reqdPlayer,swfPath,swfWidth,swfHeight,swfID,salign,bgColor,swfVars,noFlashHtml,noFlashImg,imgOnClick, imgW,imgH,base,wmode,scale) 
{
document.getElementById(divID).innerHTML = 
  getFlashHtml(reqdPlayer,swfPath,swfWidth,swfHeight,swfID,salign,bgColor,swfVars,noFlashHtml,noFlashImg,imgOnClick,imgW, imgH,base,wmode,scale);
}

function getFlashHtml(reqdPlayer,swfPath,swfWidth,swfHeight,swfID,salign,bgColor,swfVars,noFlashHtml,noFlashImg,imgOnClick,imgW, imgH,base,wmode,scale)  
{
	var str = "";
	if (flashVers >= parseInt(reqdPlayer) || reqdPlayer == -1) {
		swfPath = (swfPath.indexOf("http") == 0) ? swfPath : AkamaiURL + swfPath;
		if (salign == undefined || salign == '') { salign = "TL"; }
		if (wmode == undefined || wmode == '') { wmode = "opaque"; }
		if (scale == undefined) { scale = "noscale"; }
		//Object
		str = str + ("<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' codebase='https://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=" + reqdPlayer.toString() + ",0,0,0' width='" + swfWidth + "' height='" + swfHeight + "' id='" + swfID + "' align='' />"); 
		str = str + ("<param name=movie value='" + swfPath + "' />"); 
		str = str + ("<param name=salign value='" + salign + "' />"); 
		str = str + ("<param name=wmode value='" + wmode + "' />"); 
		str = str + ("<param name=menu value='false' />");
		str = str + ("<param name=allowScriptAccess value='always' />");
		str = str + ("<param name=allowFullScreen value='true' />");  
		str = str + ("<param name=quality value='high' />");
		str = str + ("<param name=scale value='" + scale + "' />");
		if (swfVars != undefined) { str = str + ("<param name=flashvars value='" + swfVars + "' />"); }
		if (base != undefined && base != '') { str = str + ("<param name=base value='" + base + "' />"); }
		if (bgColor != undefined && bgColor != '') { str = str + ("<param name=bgcolor value='" + bgColor + "' />"); }
		//Embed
		str = str + ("<embed src='" + swfPath + "' quality=high" + " width='" + swfWidth + "' height='" + swfHeight + "' name='" + swfID + "' scale='" + scale + "' salign='" + salign + "' wmode='" + wmode + "' menu='false' allowScriptAccess='always' allowFullScreen='true'  type='application/x-shockwave-flash' pluginspage='https://www.macromedia.com/go/getflashplayer' ");
		if (swfVars != undefined) { str = str + ("flashvars='" + swfVars +"' "); }
		if (bgColor != undefined && bgColor != '') { str = str + ("bgcolor='" + bgColor +"' "); }
		if (base != undefined && base != '') { str = str + ("base='" + base +"' "); }
		str = str + ("></embed></object>");
	} else {
		//Required flash version not found:
		if (noFlashImg == undefined || noFlashImg == '' ) {
			if (noFlashHtml == undefined) {
				//Use default image
				str = str + ("<a href='#' onClick=\"javascript:window.open('https://www.adobe.com/go/getflashplayer');\"><img src='" + AkamaiURL + "/images/w_g_noflsh_6.gif' width='272' height='84' border='0' /></a>");
			} else {
				str = str + (noFlashHtml);
			}
		} else {
			//Use supplied image and optional onclick handler:
			if (imgOnClick == undefined || imgOnClick == '') {
				str = str + ("<img src='" + noFlashImg +"' width='"+imgW+"' height='"+ imgH + "' border='0' />");
			} else {
				str = str + ("<a href='#' onClick='"+imgOnClick+"'><img src='" + noFlashImg +"' width='"+imgW+"' height='"+ imgH + "' border='0' /></a>");
			}
		}
	}
	return str;
}

// initialize asset allocation pie chart
function initPieChart(swfID,qs) {
	showSWF(6,"/flash/charts/aa_piechart.swf","175","110",swfID,"tl","#FFFFFF","det=" +qs );
}

// update asset allocation pie chart
function updatePieChart(swfID,lgCap,smCap,fixedInc,cash,intl,other){
	if (window.document[swfID] != undefined) {
		var det = "LargeCap," + lgCap;
		det += ";MidCap," + smCap;
		det += ";FixedIncome," + fixedInc;
		det += ";Cash," + cash;
		det += ";International," + intl;
		det += ";Other," + other;
		window.document[swfID].SetVariable("det",det);
		window.document[swfID].GotoFrame(2);
	}
}

// initialize value bar chart
function initBarChart(qs) {
	showSWF(6,  //reqdPlayer,
            "/flash/charts/barChart.swf", //swfPath,
            "480", //swfWidth
            "300",  //,swfHeight,
            "barChart", //swfID,
            "tl",       //salign,
            "#FFFFFF", //bgColor,
            "det=" + qs //swfVars,
            ,null// noFlashHtml,
            ,null//  noFlashImg,
            ,null//  imgOnClick,
            ,null// imgW,
            ,null// imgH,
            ,null// base,
            ,'transparent'// wmode,
            ,null// scale
            );
}

// update value bar pie chart
function updateBarChart(qs){
	if (window.document["barChart"] != undefined) {
		window.document["barChart"].SetVariable("det",qs);
		window.document["barChart"].GotoFrame(2);
	}
}

// initialize performance line chart
function initLineChart(dataPath) {
	showSWF(9,"/flash/charts/lineChart.swf","585","350","lineChart","tl","#FFFFFF","dataURL=" + dataPath);
}

// update performance line chart
function updateLineChart(dataPath){
	if (window.document["lineChart"] != undefined) {
		window.document["lineChart"].SetVariable("dataURL",dataPath);
		window.document["lineChart"].GotoFrame(4);
	}
}

// initialize trade ticket quotes widget
function initTradingQwidget(prodType,divID,sym,ahFlag,htFlag,display,altURL,country) {
		if (htFlag) { var swfHeight = htFlag; }
		else { var swfHeight = "110"; }
		var swfVars = "sym=" + encodeURIComponent(sym) + "&ahFlag=" + ahFlag + "&productType=" + prodType + "&flash_height=" + swfHeight;
		if (display) { swfVars = swfVars+"&display="+display; }
		if (altURL) { swfVars = swfVars+"&altURL="+altURL; }
		if (country) { swfVars = swfVars+"&country="+country; }
		writeSWF2Div(divID,9,'/flash/qwidgets/tradingQwidget.swf','190',swfHeight,divID + "SWF",'tl',"#F4F4F4",swfVars,'');
}

function writeQuoteWidget4(extFlag,divID) {
	var fv = 'target=_self';
	if (extFlag && extFlag.toLowerCase() == "extended") { 
		fv = fv + "&mode=1"; 
	}
	if (divID) {
		writeSWF2Div(divID,9,'/flash/quidget04.swf','180','173','quidget04','tl','#FFFFFF',fv,''); 
	} else {
		showSWF(9,'/flash/quidget04.swf','180','173','quidget04','tl','#FFFFFF',fv,'');
	}
}
