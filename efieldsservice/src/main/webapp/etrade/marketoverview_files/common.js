//--------------------------------------------------------------------------
// The smallest subset possible from jQuery to support dom Ready event.
// http://code.google.com/p/domready/
//--------------------------------------------------------------------------
(function(){var DomReady=window.DomReady={};var userAgent=navigator.userAgent.toLowerCase();var browser={version:(userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(userAgent),opera:/opera/.test(userAgent),msie:(/msie/.test(userAgent))&&(!/opera/.test(userAgent)),mozilla:(/mozilla/.test(userAgent))&&(!/(compatible|webkit)/.test(userAgent))};var readyBound=false;var isReady=false;var readyList=[];function domReady(){if(!isReady){isReady=true;if(readyList){for(var fn=0;fn<readyList.length;fn++){readyList[fn].call(window,[])}readyList=[]}}};function addLoadEvent(func){var oldonload=window.onload;if(typeof window.onload!='function'){window.onload=func}else{window.onload=function(){if(oldonload){oldonload()}func()}}};function bindReady(){if(readyBound){return}readyBound=true;if(document.addEventListener&&!browser.opera){document.addEventListener("DOMContentLoaded",domReady,false)}if(browser.msie&&window==top)(function(){if(isReady)return;try{document.documentElement.doScroll("left")}catch(error){setTimeout(arguments.callee,0);return}domReady()})();if(browser.opera){document.addEventListener("DOMContentLoaded",function(){if(isReady)return;for(var i=0;i<document.styleSheets.length;i++)if(document.styleSheets[i].disabled){setTimeout(arguments.callee,0);return}domReady()},false)}if(browser.safari){var numStyles;(function(){if(isReady)return;if(document.readyState!="loaded"&&document.readyState!="complete"){setTimeout(arguments.callee,0);return}if(numStyles===undefined){var links=document.getElementsByTagName("link");for(var i=0;i<links.length;i++){if(links[i].getAttribute('rel')=='stylesheet'){numStyles++}}var styles=document.getElementsByTagName("style");numStyles+=styles.length}if(document.styleSheets.length!=numStyles){setTimeout(arguments.callee,0);return}domReady()})()}addLoadEvent(domReady)};DomReady.ready=function(fn,args){bindReady();if(isReady){fn.call(window,[])}else{readyList.push(function(){return fn.call(window,[])})}};bindReady()})();
//--------------------------------------------------------------------------

function eventBufferObject() {
	this.buffer = [];
	this.add = function(func) {
		this.buffer[this.buffer.length] = func;
	}
	this.load = function() {
		for (var x = 0; x < this.buffer.length; x++) {
			if (typeof(this.buffer[x]) == "string") {
				eval(this.buffer[x])
			} else {
				this.buffer[x]();
			}
		}
	}
}

/* Rollover methods*/

function rolloverHighlightT (elem) {	
	$(elem).addClass("highlight");
};	

function rolloffNormalT (elem) {
	$(elem).removeClass("highlight");	
};

// init event buffer
var loadBuffer = new eventBufferObject();

//function get(id) {return document.getElementById(id);}
function rc(who,what) {
	try {
		var row = get(who);
		if (what) {
			row.className = 'greenBG';
		} else {
			row.className = 'dotsB';
		}
	} catch(e) {}
}
// common js
common_js = function() {
	
	this.commonGen = document.getElementById("commonGen");
	this.commonContainer = document.getElementById("commonContainer");
	this.rollOver = []; // remove line
	this.cb = new ContentBuffer();		
	
}

// Selects and Focus the Symbol Entry Value on Click
common_js.prototype.checkSymbolEntry = function() {
	if (this.symbolEnter.value) {
		this.symbolEnter.select();
		this.symbolEnter.focus();
	}
}
// PopUp Window
common_js.prototype.popwin = function(url,w,h,type) {
	if (!w) {w = 800;}
	if (!h) {h = 500;}
	if (url) {
		if (type == 'nonav') {
			this.popWindow = window.open(url, 'pop_window', 'width='+w+',height='+h+',scrollbars=yes,menubar=0,status=no,toolbar=0,resizable=yes');
		} else if (type == 'noscroll') {
			this.popWindow = window.open(url, 'pop_window', 'width='+w+',height='+h+',scrollbars=0,menubar=0,status=no,toolbar=0,resizable=yes');
		} else {
			this.popWindow = window.open(url, 'pop_window', 'width='+w+',height='+h+',scrollbars=yes,menubar=1,status=no,toolbar=1,resizable=yes');
		}
		this.popWindow.focus();
	}
}

// Figure out what browser is being used
common_js.prototype.browser = function(){
	var userAgent = navigator.userAgent.toLowerCase();
	browser = {
		version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
		safari: /webkit/.test( userAgent ),
		opera: /opera/.test( userAgent ),
		msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
		mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
	};
	return browser;
}

common_js.prototype.browserIsIE = function() {
	var browserDetails = this.browser();
	return browserDetails.msie;
}

// load recent symbols
common_js.prototype.showRecentQuotes = function() {

	var rQpanel = Element.get('recentSymbolsFlyDown');
	var rSLinks = Element.get('span-recentSymbolLinks');
	var rSCount = Element.get('span-recentSymbolCount');
	var rQMenuImg = Element.get('rQMenuClick');
	var rQContainerLeftEdge = Element.get('rqSep');
	var rQContainerRightEdge = Element.get('rightEdge');
	var rQContainerImgTD = Element.get('rqImg');
	var rQContainerTD = Element.get('rcCon');
	
	//open
	if(rQpanel.style.display != 'block'){
		
		//find out how far apart pipes are, get distance, set width
		var leftEdgePos = Element.getXY(rQContainerLeftEdge);
		var rightEdgePos = Element.getXY(rQContainerRightEdge);
		var leftX = leftEdgePos.x;
		var rightX = rightEdgePos.x;
		var heightOfTD = Element.getSize(rQContainerTD);
		
		var top = leftEdgePos.y + (heightOfTD.height - 7); //offset from top (7 accounts for padding)		
		var newWidth = (rightX - 1) - leftX; //need to remove 1 b/c right pipe is 2px wide with white right edge

		if (this.browserIsIE() && !isProspect) { //overrides for IE
			top += 13;
			leftX += 10;
		} else if (this.browserIsIE() && isProspect) {
			top -= 1;
		} else if (isProspect) {
			leftX -= 1;
			newWidth += 1;
		}
		
		Element.setStyle(rSLinks,"display:none;");
		Element.setStyle(rQpanel,"display:block; width:"+newWidth+"px; left:"+leftX+"px; top:"+top+"px;");
		Element.setStyle(rSCount,"display:block;");
		rQMenuImg.src = '../../images/recentsymbols-off.gif';
		
	} else {
		//close
		Element.setStyle(rQpanel,"display:none;");
		Element.setStyle(rSLinks,"display:block;");
		Element.setStyle(rSCount,"display:none;");
		rQMenuImg.src = '../../images/recentsymbols.gif';
	}
}

common_js.prototype.setRQTimeout = function() {
	this.RQtimeout = window.setTimeout("common.showRecentQuotes();",500);
}

common_js.prototype.cancelRQTimeout = function() {
	window.clearTimeout(this.RQtimeout);
}

common_js.prototype.showLoading = function(container,hasRoundedBottomCorners,gifPos) {
	
	if (window["jQuery"]){
		
		if ($("#loading_"+container).length > 0){ 
			this.hideLoading(container);
		}
		var height = $("#"+container).outerHeight();
		var width = $("#"+container).outerWidth();
		var elPos = $("#"+container).offset();
		var topPosOfImg = (parseInt(height / 2 - 16)); //center loading gif
		var leftPos = (parseInt(width / 2 - 16)); //centered
		var indicator = $('<div />').attr({id:'loading_' +container, 'className':'loadingIndicator'}).css({top:elPos.top+'px',left:elPos.left+'px',height:height+'px',width:width+'px'}).appendTo("body");	
		//attach spinning icon to DOM
		$('<img src="https://images.etrade.wallst.com/v1/images/loading-blue.gif" />').attr({id:'loadingIcon'}).css({position:"absolute",top:topPosOfImg+'px',left:leftPos+'px'}).appendTo(indicator);

	} else {
	
		var size = Element.getSize(container);
		var pos = Element.getXY(container);
		
		//can't be as tall as container b/c of our rounded corners on the bottom
		if(hasRoundedBottomCorners) {
			var newHeight = (size.height-12);
		}
		else {
			newHeight = size.height;
		}
		
		//We can position the loading gif (0=center,1=top,2=bottom)
		if(gifPos==1) {
			var topPosOfImg = 60; //show the gif near the top
		}
		else if(gifPos==2) {
			var topPosOfImg = (parseInt(size.height - 30)); //show the gif near the bottom
		}
		else {
			var topPosOfImg = (parseInt(size.height / 2 - 16)); //center loading gif
		}
		
		var appendTo = Element.get("etContainer");
		if (!appendTo || appendTo.style.position == "relative") {
			appendTo = document.body;
		}
		
		//create new transparent div and attach to DOM
		var indicator = Element.create('div',{id:'loading_'+container,'class': 'loadingIndicator',style:'top:'+pos.y+'px;left:'+pos.x+'px;height:'+newHeight+'px;width:'+size.width+'px'},'', appendTo);
		
		//create new loading gif and attach to new div
		//var loadingContainer = Element.create('div',{id:'loadingImg_'+container,'class': 'loadingIndicator',style:'opacity:1;background:transparent;top:'+pos.y+'px;left:'+pos.x+'px;height:'+newHeight+'px;width:'+size.width+'px'},'', appendTo);
		
		var graphic = Element.create('img', {src:'https://images.etrade.wallst.com/v1/images/loading-blue.gif', style:'position:absolute;top:' +topPosOfImg+ 'px;left:' + (parseInt(size.width / 2 - 16)) + 'px;'}, '', indicator);
	}
}

common_js.prototype.hideLoading = function(container) {
	if (window["jQuery"]){
		$("#loading_"+container).remove();	
	} else {	
		Element.remove('loading_' + container);
		//Element.remove('loadingImg_'+container);
	}
}

// Load Quote/Company Info
common_js.prototype.showInfo = function(who, symbol, type, version) {
	this.eleOffset = who;
	/* 
	//don't know if this is needed; holding off for now
	if (symbol && (symbol.indexOf("'") > -1 || symbol.indexOf('"') > -1)) {
	symbol = escape(symbol);
	}
	*/
	this.symbol = symbol;
	this.version = version;	
	if (type) { this.type = type; } else { this.type = ''; }	
	this.isMFETFOveriew = false;
	if(this.type == "topStrategies" || this.type == "allStar" || this.type == "fundSectors"){this.isMFETFOveriew = true;}
	if(this.isMFETFOveriew){
		this.infoID = common.showInfoTime();
	}else{
		this.infoID = window.setTimeout("common.showInfoTime();", 300);
	}
	
}
common_js.prototype.showInfoTime = function() {
	
	if (this.symbol) {
		var x = 0; var y = 0;
		var linkSize = Element.getSize(this.eleOffset);

		while (this.eleOffset.offsetParent != null) {
			x += this.eleOffset.offsetLeft;
			y += this.eleOffset.offsetTop;
			this.eleOffset = this.eleOffset.offsetParent;
		}
		y = parseInt(y) + parseInt(linkSize.height) - 5;
		
		if (this.version == 'redesign') {
			
			if (this.symbol == 'yellowbox') {
				this.containerWidth = 215;
			
			}else if (this.type == 'DeclaredDividend' || this.type == 'DeclaredDividend2') {
				this.containerWidth = 220;
			
			}else if(this.isMFETFOveriew){
				this.containerWidth = 400;
			
			}else {
				this.containerWidth = 260;
			}
			this.maxWidth = 745; //Must be less than page width (760) for IE
			
		}else {
			this.containerWidth = 220;
			this.maxWidth = 700;
		}

		if (this.symbol == 'yellowbox') {
			x = x - 175;
		
		}else if (this.type == "expenseCap") {
			x = x - 300;
		
		}else if (this.type && this.type.indexOf("shiftBoth") > -1) {

			var shiftValues = this.type.split('|');			
			x = x + parseInt(shiftValues[1]);
			y = y - parseInt(shiftValues[2]);
			this.type = '';
		}else if (this.type && this.type.indexOf("shiftRight") > -1) {
			var shift = this.type.replace("shiftRight", "");
			x = x + parseInt(shift);
			this.type = '';
		}else if (this.type && this.type.indexOf("shiftUp") > -1) {
			var shift = this.type.replace("shiftUp", "");
			y = y - parseInt(shift);
			this.type = '';
		}else if (this.symbol == 'smartConsensus') {
			x += this.eleOffset.offsetLeft;
		}else if(this.isMFETFOveriew){
			
			x += this.eleOffset.offsetLeft + 30;
			y += this.eleOffset.offsetTop - 30;
			
		}else {
			if ((x + this.containerWidth > this.maxWidth)) {
				//if the hover will appear further to the right than the defined maxWidth (of page), show it on the left.
				x += this.eleOffset.offsetLeft - 260;
			} else {
				x += this.eleOffset.offsetLeft + 30;
			}
		}
		y += this.eleOffset.offsetTop + 12;

		this.commonContainer.style.display = 'block';
		this.commonContainer.style.top = y + 'px';
		this.commonContainer.style.left = x + 'px';
		
		this.commonContainer.innerHTML = '<div class="iWin" style="width:' + this.containerWidth + 'px;"><span style="padding:4px;">Loading ...</span></div>';

		if (this.symbol == 'yellowbox') {
			this.commonContainer.innerHTML = '<div class="" style="width:' + this.containerWidth + 'px;border:1px solid #000;background:#ffffb3 none;padding:5px;text-align:left;"><span class="txt12">' + this.type + '</span></div>';
		}
		else if (this.symbol == 'recentquote') {
			this.commonContainer.innerHTML = '<div class="iWin" style="width:' + this.containerWidth + 'px;text-align:left;"><span class="txt12">' + this.type + '</span></div>';
		}
		else if (this.symbol == 'smartConsensus') {
			this.commonContainer.innerHTML = '<div class="iWin" style="width:' + this.containerWidth + 'px; text-align:left;"><span class="txt12">' + this.type + '</span></div>';
			this.commonContainer.style.top = (y * 1 - 25) + 'px';
			this.commonContainer.style.left = (x * 1 + 15) + 'px';
		}
		else if (this.symbol == 'earnings' || this.symbol == 'events') {
			if (this.symbol == 'events' || this.type == 'DeclaredDividend' || this.type == 'DeclaredDividend2') {
				this.commonContainer.style.top = (y - 50) + 'px';
			}
			else {
				if (this.type == 'ProFormaEarnings') {
					this.commonContainer.style.top = (y - 29) + 'px';
				} else {
					this.commonContainer.style.top = (y - 250) + 'px';
				}
			}
			commonGen.document.location.replace('../../common/disclaimers/earningsInfo.asp?symbol=' + this.symbol + '&typeOfMouse=' + this.type);
		}
		else if (this.symbol == 'trefis' ) {
			//if (this.type == 'PriceEstimate'){
				this.commonContainer.style.top = (y - 100) + 'px';
				this.commonContainer.style.left = (x - 10) + 'px';
			//}
			commonGen.document.location.replace('../../news2/commentary/trefis_info.asp?symbol=' + this.symbol + '&typeOfMouse=' + this.type);
		}
		else if (this.type == "expenseCap") {
			commonGen.document.location.replace('../../common/disclaimers/ExpenseCapAndExpense.asp?symbol=' + this.symbol + '&typeOfMouse=' + this.type);
		}
		else if (this.isMFETFOveriew) {
			//this.commonContainer.style.top = (y * 1 - 25) + 'px';
			//this.commonContainer.style.left = (x * 1 + 15) + 'px';
			commonGen.document.location.replace('../../fundresearch/overview/overviewInfo.asp?itemTitle=' + this.symbol + '&type=' + this.type);
		}
		else {
			if (this.version == 'redesign') {
				this.commonContainer.innerHTML = '<div class="winHoverTop" style="width:' + this.containerWidth + 'px;"><span style="padding:4px;">Loading ...</span></div>';
				commonGen.document.location.replace('../../common/symbol_info/symbolInfo2.asp?symbol=' + this.symbol + '&typeOfMouse=' + this.type);
			}
			else {
				commonGen.document.location.replace('../../common/symbol_info/symbolInfo.asp?symbol=' + this.symbol + '&typeOfMouse=' + this.type);
			}
		}
	}
}

common_js.prototype.closeInfo = function(symbol) {
	window.clearTimeout(this.infoID);
	this.commonContainer.style.display = 'none';
}
common_js.prototype.usageReporting = function(note, page) {
		//this is for usage reporting on client side actions
		//It needs a page becuase it will show the ajax page instead of the page you actually made the action
		jQuery.ajax({
			type: "POST",
			url: '../../common/usageReportingBuffer.asp',
			data: {note:note, page:page}
		});
}
common_js.prototype.saveToSession = function(saveWhere, saveName, saveData) {
		
		// you can save to save to session or save to prefences
		// saveWhere needs to be either "session" or "preferences"
		jQuery.ajax({
			type: "POST",
			url: '../../common/saveToSession.asp',
			data: {saveWhere:saveWhere, saveName:saveName, saveData:saveData }
		});
}
// toggle news
common_js.prototype.newsSearch = function(type,version) {
    
    var section = 'news';
    if(version) section = 'news2';
	
	var nS = document.getElementById('advSearch');
	if (nS.innerHTML.length > 100) {
		this.src = '../../common/'+section+'/update_advSearch.asp?advSearch=off&type='+type;
		commonGen.document.location.replace(this.src);
	} else {
		this.src = '../../common/'+section+'/update_advSearch.asp?advSearch=on&type='+type;
		commonGen.document.location.replace(this.src);
	}
}
// Add to watchlist
common_js.prototype.addToWatchlist = function(symbol,bURL) {
	// copied directly from ET
	tWin = window.open (bURL+'/e/t/pfm/pfmwledit?addinvto.x=x&symbollist='+symbol, "", 'innerWidth=1, innerHeight=1,width=1,height=1,titlebar=0,personalbar=0,toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=0');
	alert ("" + symbol + " has been added into your investments to watch");
	tWin.close();
}

/**
 * Creates drop shadow beneath a menu 
 *
 * @param container {String} Id of container to apply shadow to
 */
common_js.prototype.createDropShadow = function(container,x,y,extraClassName,showOnLeft){
	var $shadowContainer = jQuery("#"+container);
    var height = $shadowContainer.outerHeight();
    var width = $shadowContainer.outerWidth();
    var extraCSS = (extraClassName) ? " " + extraClassName : "";
    $shadowContainer.after('<div class="WSODHoverShadowContainer' +extraCSS+ '"></div>');
   	var $shadow = $shadowContainer.next();
    
    var numLayers = 4;
    for (var i = 0; i < numLayers; i++) {
        var $el = jQuery('<div class="WSODHoverShadowLayer"></div>');
        //jQuery make 'opacity' to fit both firefox and IE
        $el.css({
            opacity: 0.055 * i,
            top: (numLayers + i) + 'px',
            left: (numLayers + i) + 'px'
        });
        $shadow.append($el);
    }
    
    if (showOnLeft){
    	y -= numLayers;
    }
    
    //adjust, position, and show.
    $shadow
    	.children('div')
    	.width(width + 2)
    	.height(height + 4)
    	.end()
    	.css({top:x,left:y})
    	.show()
    ;
};

function showNHH(ele, teaser, headline) {
    try {
	    Element.get("headline_hover_title").innerHTML = unescape(headline);
	    if(teaser) {
	        Element.get("headline_hover_body").innerHTML = unescape(teaser);
	        Element.get("headline_hover_body").style.display = 'block';
	    } else {
	        Element.get("headline_hover_body").style.display = 'none';
	    }
	    var div = Element.get("headline_hover");
	    var xy = Element.getXY(ele);
    	
	    var x = 0;var y = 0;
	    while (ele.offsetParent.offsetParent.offsetParent != null) {
		    x += ele.offsetLeft;
		    y += ele.offsetTop;
		    ele = ele.offsetParent;
	    }
        div.style.display = 'block';
        div.style.top = parseInt(y + 25) + 'px';
        div.style.left = parseInt(x + 25) + 'px';
    } catch (e) {}
}

function hideNHH() {
	
	Element.get("headline_hover_title").innerHTML = '';
	Element.get("headline_hover_body").innerHTML = '';
	var div = Element.get("headline_hover");
	    div.style.display = 'none';
}

common_js.prototype.abortContentBuffer = function() {
	try{
		//stop any requests currently in queue
		this.cb.abortRequests();
	}catch(e){}
}

common_js.prototype.updateNews = function(el,qryStr) {
	
	this.abortContentBuffer();
	if (Element.get('loading_news_story')) { common.hideLoading('news_story'); }
	
	common.showLoading('news_story',1,1);
	if(el && el != '') {
	    var tr = Element.parseSelector(".newsHRow",Element.get("news_headlines"))[0];
	    if(tr) {
            tr.className = "newsVRow";
	    }
	    var parent_tr = Element.getParent(Element.getParent(el, "td"),"tr");
	    parent_tr.className = "newsRow newsHRow";
	}
		
	this.cb.load({
		url: "../../common/news2/update_news_story.asp"+qryStr,
		method: "get",
		contentType: "text/html",
		onload: function(cp){
			results = cp.getResult();
			if (results) {
				Element.get("news_story").innerHTML = results;
			}
			common.hideLoading('news_story');
		},
		onerror: function(){common.hideLoading('news_story')}
	});
}

common_js.prototype.changePage = function(firstRow,rowCount,matches,pause, minStartPage) {
    
    firstRow = firstRow ? parseInt(firstRow) : 0;
    
    if(!isNaN(firstRow)) {
    	
    		var minStartPage = minStartPage && !isNaN(parseInt(minStartPage)) ? parseInt(minStartPage) : 0;
    	    	
        var tempCount = matches - rowCount;
        if(firstRow > tempCount) {
		    	firstRow = Math.floor( (matches-minStartPage) / rowCount) * rowCount; 
		    	firstRow+=minStartPage;   
		    }
		    else {
			    firstRow = firstRow < minStartPage ? minStartPage : firstRow;
  			}
        
        this.pagingUrl = '../../common/news2/update_news_headlines.asp?FirstRow=' + firstRow;  
          
        if(pause) {
            window.clearTimeout(this.newPageTimeOut);
            this.newPageTimeOut = window.setTimeout("timeoutCallback()",2000);
        } else {
            commonGen.document.location.replace(this.pagingUrl);
        }

    }
}

common_js.prototype.changePageRedux = function(args) {
    
	var self = this;
    args = args || {};
    var firstRow = parseInt(args.firstRow) || 0;
    var rowCount = args.rowCount;
    var matches = args.matches;
    
    var minStartPage = args.minStartPage && !isNaN(parseInt(args.minStartPage)) ? parseInt(args.minStartPage) : 0;
  
    if(!isNaN(firstRow)) {
    	    	
        var tempCount = matches - rowCount;
        if(firstRow > tempCount) {
		    	firstRow = Math.floor( (matches-minStartPage) / rowCount) * rowCount;
		    	firstRow = firstRow + minStartPage;    
		    }
		    else {
			    firstRow = firstRow < minStartPage ? minStartPage : firstRow;
  			}
        var div = args.loadingDiv;

		if (this.request) {
			this.request.abort();
			this.request = null;
			if ($("#loading_" + div).length > 0) {
				this.hideLoading(div);
			}
		}
	
		this.showLoading(div);
	
		this.request = jQuery.ajax({
			data: {},
			dataType: "html",
			type: "GET",
			url: args.ajaxURL+"?FirstRow="+firstRow+"&"+args.extraQS,
			success: function(results) {
				//insert new view
				$("#" + div).html(results);
				//hide loading
				self.hideLoading(div);
			},
			error: function() {
				self.hideLoading(div);
			}
		});

    }
}

common_js.prototype.showNewswireOverlay = function(el,moduleHeight,moduleTitle) {
	
	var w = 780;
	var h = 560;
	if (this.browserIsIE) {
		w = 800;
		h = 580;
	}
	
	var divWithPreContent = el.nextSibling; //element reference; contains <pre> table
	var moduleContent = divWithPreContent.innerHTML;
	var moduleTitle = " - Additional Data";
	
	if (moduleContent) {
	
		etWin('../../common/news2/newswirepop.asp','newsWireDetail',w,h,'no','no','yes','no','yes',10,10);
		
		window.setTimeout(function(){
			
			try {
				ETpopUp.document.getElementById("modalModuleContent").innerHTML = moduleContent;
				ETpopUp.document.title = "E*TRADE FINANCIAL" + moduleTitle;

			} catch(e) {

				window.setTimeout(function(){
					if (ETpopUp.document.getElementById("modalModuleContent")) {
						ETpopUp.document.getElementById("modalModuleContent").innerHTML = moduleContent;
						ETpopUp.document.title = "E*TRADE FINANCIAL" + moduleTitle;
					}
				},2500);
			
			}
			
			ETpopUp.focus();
			
		},500);
	}
}

//do some quick select element attribute reassignment for minyanville
common_js.prototype.minyanvilleTypeSet = false;
common_js.prototype.setNewsType = function(eq,type,submitForm){
	if (!this.minyanvilleTypeSet){
		$('select[name=newsType]').eq(eq).attr('name',type+'NewsType');
		this.minyanvilleTypeSet = true;	
		if (submitForm){
			$("#newsSearch").submit();
		}
	}
}
common_js.prototype.overlayPopup = function(obj) {

	//create module
	try {
		var title 	=(obj && obj.title) ? obj.title : "";
		var body 	=(obj && obj.body) 	? obj.body : "";
		this.OVERLAY_FIXED_HEIGHT 	= (obj && obj.overlayHeight)? obj.overlayHeight :640; //if no fixed height is specified 640 is default
		this.IFRAME_FIXED_HEIGHT 	= (obj && obj.iframeHeight) ? obj.iframeHeight 	:582;
		this.IFRAME_FIXED_WIDTH 	= (obj && obj.iframeWidth) 	? obj.iframeWidth 	:918;
		
		var titleWidth = "100%";
		//smoke screen
		var smokeScreen = Element.create("div", {id: "smokeScreen"}, null, document.body);
    	var nHeight = $(document).height();
	    smokeScreen.style.height = nHeight + 'px';
		//close button
		var closeButton = '<a href="javascript:void(0);" onclick="this.closeOverlayPopup();return false;">Close</a>';
		//popup
		var bubble = Element.create("div", {id: "overlayPopup"}, [
			Element.create("div", {className: "overlayPop-module" }, [
				Element.create("div", {className: "overlayPop-top"}, [
					Element.create("div", {className: "overlayPop-left"}, null),
					Element.create("div", {className: "overlayPop-close", id: "overlayCloseButton"}, null),
					Element.create("div", {className: "overlayPop-title"}, title)
				]),
			   	Element.create("div", {className: "overlayPop-middle clearfix"}, [
					Element.create("div", {className: "overlayPop-left"}, null),
					Element.create("div", {className: "overlayPop-right"}, null),
					Element.create("div", {className: "overlayPop-content"}, [
						Element.create("div", {style: "overflow-x:auto;overflow-y:hidden;"}, [
							Element.create("iframe", {className: "wsodIFrame", src: body, frameBorder: '0', scrolling: 'auto'}, null)
						])
					])
				]),
				Element.create("div", {className: "overlayPop-bottom"}, [
					Element.create("div", {className: "overlayPop-left"}, null),
					Element.create("div", {className: "overlayPop-right"}, null),
					Element.create("div", {className: "overlayPop-footer"}, null)
				])
			])
		], document.body);
		
	this.resizeOverlayPopup();
	$('#overlayCloseButton').bind("click", function() {
			common.closeOverlayPopup();
			
	});
	if(this.IFRAME_FIXED_WIDTH < 918){
		$('iframe.wsodIFrame').attr("width",this.IFRAME_FIXED_WIDTH).width(this.IFRAME_FIXED_WIDTH);
	}
	}catch(e){}
}
common_js.prototype.closeOverlayPopup = function(){		
	$('#smokeScreen').remove();
	$('#overlayPopup').remove();
}
common_js.prototype.resizeOverlayPopup = function() {
	this.browserSize();
	this._findSizeOverlayPopup();
	this._changeSizeOverlayPopup();
}
common_js.prototype._changeSizeOverlayPopup = function() {

	$('#overlayPopup').css({'margin-top': -this.marginTopAdjustment});
	$('iframe.wsodIFrame').attr("height",this.innerWSODIframeHeight).height(this.innerWSODIframeHeight);
	$('#overlayPopup').css({'margin-left': -this.marginLeftAdjustment}).width(this.WSODIframeWidth).attr("width",this.WSODIframeWidth);
	
}	
common_js.prototype._findSizeOverlayPopup = function() {
	//height
	if(this.browserHeight < this.OVERLAY_FIXED_HEIGHT){
		this.innerWSODIframeHeight = (this.IFRAME_FIXED_HEIGHT -(this.OVERLAY_FIXED_HEIGHT-this.browserHeight)-60); // 60 adjusts the how much space between the bottoom of the overlay and the end of the window.
		this.marginTopAdjustment = (this.IFRAME_FIXED_HEIGHT -(this.OVERLAY_FIXED_HEIGHT-this.browserHeight))/2;
	}else{
		this.innerWSODIframeHeight = this.IFRAME_FIXED_HEIGHT;
		this.marginTopAdjustment = this.OVERLAY_FIXED_HEIGHT/2;
	}
	//width
	if(this.browserWidth < this.IFRAME_FIXED_WIDTH){
		this.WSODIframeWidth = this.browserWidth - 60;
		this.marginLeftAdjustment = this.WSODIframeWidth/2;
		
		if ($.browser.msie && $.browser.version == 7.0) {
			$('iframe.wsodIFrame').attr("style",'padding-bottom:15px;');				
		}
	}else{
		this.WSODIframeWidth = this.IFRAME_FIXED_WIDTH;
		this.marginLeftAdjustment = this.WSODIframeWidth/2;
	}
}
common_js.prototype.browserSize = function() {
	this.browserWidth;
	this.browserHeight;
	
	if( typeof( window.innerWidth ) == 'number' ) { 
		//Non-IE 
		this.browserWidth = window.innerWidth;
		this.browserHeight = $(window).height(); 
	} else if( document.documentElement &&( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) { 
		//IE 6+ in 'standards compliant mode' 
		this.browserWidth = document.documentElement.clientWidth; 
		this.browserHeight = document.documentElement.clientHeight; 
	}
}

common_js.prototype.showSpeedBumpPopup = function(forwardUrl,type,page) {
		
		var thisPage = page?page:'';
		
		if(type == 'trefis'){
			var note = "See More Trefis Link ";
			var usagePage = thisPage;
			this.usageReporting(note, usagePage); 
		}
        window.open('../../common/speedbump/speedBumpDisclosure.asp?forwardUrl='+escape(forwardUrl)+'&type='+type+'&page='+page, type+'_popup', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=0,resizable=1,width=750,height=500');
}
common_js.prototype.toggleTrailingReturns_js = function() {
	$('#annualReturn_quarter').toggleClass("chtOn");
	$('#annualReturn_month').toggleClass("chtOn");
	$('#annualReturn_quarter').toggleClass("chtOff");
	$('#annualReturn_month').toggleClass("chtOff");
	$('table#AnnualReturnMonth').toggleClass("hide");
	$('table#AnnualReturnQuarter').toggleClass("hide");
}
common_js.prototype._getScrollXY = function() {
  var scrOfX = 0, scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape compliant
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    //DOM compliant
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return { scrOfX: scrOfX, scrOfY: scrOfY };
}

common_js.prototype.killDialog = function() {
	//show all select elements now that modal is closed
	if (common.browserIsIE) {
		for (var i=0; i<common.sel.length; i++) {
			Element.setStyle(common.sel[i],"visibility:visible;");
		}
	}
	Element.remove("modalOverlay");
	Element.remove("modalModule");
}

common_js.prototype.singleClickSelect = function(obj) {
	try {
		var el = document.getElementById(obj);
		el.focus();
		el.select();
	} catch(e){}
}

common_js.prototype.showBubble = function(ele,obj){
	
	try {
		var title = (obj && obj.title) ? obj.title : "";
		var subTitle = (obj && obj.subTitle) ? obj.subTitle : "";
		var body = (obj && obj.body) ? obj.body : "";
		var overrideWidth = (obj && obj.overrideWidth) ? "width:"+obj.overrideWidth+"px;" : ""; //overrides the body width
		var overrideStyles = (obj && obj.overrideStyles) ? obj.overrideStyles +";": "";			//overrides the body styles
		var titleWidth = "100%";
		var subTitleWidth = "0"
		
		
		var bubble = Element.create("div", {id: "textBubble",style: overrideWidth + overrideStyles}, [
		
		    Element.create("div", {className: "body"}, (function() {
				var array = [];
				if(title != ""){
					if (obj && obj.pointer){
						array.push(Element.create("div", {className: "pointer"}));
					}
					if(subTitle != ""){titleWidth = "50%";subTitleWidth = "47%";}
					array.push(Element.create("div", {className: "title", style: "width:"+titleWidth}, title));
					array.push(Element.create("div", {className: "subTitle", style: "width:"+subTitleWidth}, subTitle));
				}
			    array.push(Element.create("div", {}, body));

				return array;
			})())
		],document.body);
	    
	    var xy = Element.getXY(ele);
	    var linkSize = Element.getSize(ele);
	    
		var x = 0;var y = 0;
	    while (ele.offsetParent != null) {
		    x += ele.offsetLeft;
		    y += ele.offsetTop;
		    ele = ele.offsetParent;
	    }
	    
	    var bubbleSize = Element.getSize(bubble);
		
		if (obj && obj.moveHorizontally) {
			var l = parseInt(x - bubbleSize.width) + parseFloat(obj.moveHorizontally) + 'px';
		} else {
			var l = parseInt(x - bubbleSize.width) + 'px';
		}
		
		if (obj && obj.moveVertically) {
			var t = parseInt(y - bubbleSize.height) + parseFloat(obj.moveVertically) + 'px';
		} else {
			var t = parseInt(y - bubbleSize.height) + 'px';//move bubble above link
		}	    
	    	    
	    bubble.style.top = t;
	    bubble.style.left = l;

	}catch(e){}
}

common_js.prototype.hideBubble = function(el) {
	try{Element.remove("textBubble");}catch(e){}
}

function timeoutCallback () {
    commonGen.document.location.replace(common.pagingUrl);
}
function timeoutCallbackPassURL (url) {
    document.location.href = url;
}

//any non-news paging without a pause
common_js.prototype.changeResultPage = function(pageURL,firstRow,rowCount,matches, minStartPage, pause, event) {
	
	//pageURL must include start of querystring (to allow for additional params)
	//e.g. '../dir/page.asp?x=1&FirstRow='
	var self = this;
	firstRow = firstRow ? parseInt(firstRow) : 0;
	this.pageUrlWithFirstRow = pageURL + firstRow;
	
	if(!isNaN(firstRow)) {
		var minStartPage = minStartPage && !isNaN(parseInt(minStartPage)) ? parseInt(minStartPage) : 0;
		var tempCount = matches - rowCount;
		if(firstRow > tempCount) {
	    	firstRow = Math.floor( (matches-minStartPage) / rowCount) * rowCount;
	    	firstRow+=minStartPage;    
	    }else {
		    firstRow = firstRow < minStartPage ? minStartPage : firstRow;
		}
		
		if(pause) {
			if(event.keyCode == 13){// return key
				document.location.href = this.pageUrlWithFirstRow;
			}else{
				window.clearTimeout(this.newPageTimeOut);
           		this.newPageTimeOut = window.setTimeout(function() {
					timeoutCallbackPassURL(self.pageUrlWithFirstRow);
				}, 2000);
			}
        } else {
            document.location.href = this.pageUrlWithFirstRow;
        }
	}
}





/**
 *  Manipulates querystring on URL
 *
 * 	@param key {type?} description
 * 	@param value {type?} description
 */
common_js.prototype.updateQueryString = function(key, value){
	
	var currQueryString = location.search;

	//Query string exists, so alter it
	if(location.search){
		
		//Query string exists and key|value pair exists, so change it
		if(currQueryString.indexOf(key) != -1){
			
			currQueryString = currQueryString.replace('?', '');
			var keyValueArray = currQueryString.split('&');
			var newQueryStringArray = ['?'];
			
			for(var i = 0, iLen = keyValueArray.length; i < iLen; i++){
				
				if(keyValueArray[i].indexOf(key) == -1){
					newQueryStringArray.push(keyValueArray[i], '&');
				}
			}
			
			location.search = [newQueryStringArray.join(''), key, '=', value].join('');
		}
		//Query string exists but key|value doesn't exist, so create it
		else{
			location.search += ['&', key, '=', value].join('');
		}
	}
	//No query string exists, so create one
	else{
		location.href += ['?', key, '=', value].join('');
	}
};

/* mh: DO NOT REMOVE THESE */
common_js.prototype.sessionExpired = function() { }
common_js.prototype.expireSession = function() { }
common_js.prototype.sessionExpired = function() { }
common_js.prototype.resetSessionExpiration = function(){ }
common_js.prototype.cancelSessionExpired = function() { }

/* We're ready with a few items.... init them....**************************************************/
DomReady.ready(function(){
	if(typeof(common) == 'undefined'){
		common = new common_js();	// Adds the common js object
	}
	loadBuffer.load(); 			// Initializes all onload event
});
//onload = function() {loadBuffer.load();}

// Symbol Entry JS
symbolentry_js = function() {
	this.symbol = document.getElementById("symbol");
	this.symbol.select();
	//this.symbol.focus();
	this.symbolVal = this.symbol.value;
	this.section = document.getElementById("section");
	this.sectionVal = this.section.value;
	this.markettype = document.getElementById("markettype");
}
symbolentry_js.prototype.redirectToURL = function() {

	if (this.symbol.value && this.section.value && this.symbol.value != "Enter Symbol(s)") {

		if (this.markettype && this.markettype.value && this.markettype.value == 'US') {

			if (this.section.value && this.section.value == "snapshot") {
				var u = '../../stocks/snapshot/snapshot.asp?symbol=' + escape(this.symbol.value) + '&rsO=new';
			} else if (this.section.value && this.section.value == "news") {
				var u = '../../stocks/news/search_results.asp?symbol=' + escape(this.symbol.value) + '&rsO=new';
			} else if (this.section.value && this.section.value == "charts") {
				var u = '../../stocks/charts/charts.asp?symbol=' + escape(this.symbol.value) + '&rsO=new';
			} else {
				var u = '../../stocks/snapshot/snapshot.asp?symbol=' + escape(this.symbol.value) + '&rsO=new';
			}

		} else {
			if (this.markettype && this.markettype.value && this.markettype.value != 'US') {
				var u = '../../globalmarkets/snapshot/redirectToETGlobal.asp?symbol=' + escape(this.symbol.value) + '&globalmarket=' + this.markettype.value + '&section=' + this.section.value;
			} else if (this.section.value == "#") {
				return false;
			} else if (this.section.value.indexOf("http") != -1) {
				var u = this.section.value + '&sym=' + escape(this.symbol.value);
			}
			else if (this.section.value.indexOf("multisnapshot") > -1) {
				var u = '../' + this.section.value + '?symbol=' + escape(this.symbol.value) + '&symbols=' + escape(this.symbol.value) + '&peer=false&rsO=new';
			}
			else {
				var u = '../' + this.section.value + '?symbol=' + escape(this.symbol.value) + '&rsO=new';
			}
		}

		if (window.top != window.self) {
			window.top.location.href = u;
		} else {
			window.location.href = u;
		}
	}
}
symbolentry_js.prototype.changeSym = function() {
	this.symbolVal = this.symbol.value;
}
symbolentry_js.prototype.blurSym = function() {
	if (this.symbol.value < 1) {
	this.symbol.value = this.symbolVal;
	}
}
symbolentry_js.prototype.singleClickSelect = function() {
	this.symbol.select();
	this.symbol.focus();
}

stream=[];stream.streamQuote = function(){}

try { // cache bg imgs in IE
	document.execCommand("BackgroundImageCache", false, true);
} catch(err) {}

// two wrappers
function showInfo(who,symbol,type,version){
	try {common.showInfo(who,symbol,type,version);} catch(e) {}
}
function closeInfo(symbol){
	try {common.closeInfo(symbol);} catch(e) {}
}

// E*Trade Specific JS
function removeSpecialChar(str, pattern){
	while (str.indexOf(pattern)!= -1){
		str=str.substring(0,str.indexOf(pattern))+str.substring(str.indexOf(pattern)+1,str.length);
	}
	return str;
}
function etWin(url,windowName,sWidth,sHeight,toolbarYS,locationYS,scrollbarYS,menubarYS,resizeYS,HorizPos,VertPos,server){
	if(!windowName){windowName='ETpopUp';}
	if(!sWidth){sWidth=400;}
	if(!sHeight){sHeight=400;}
	if(!toolbarYS){toolbarYS='yes';}
	if(!locationYS){locationYS='yes';}
	if(!scrollbarYS){scrollbarYS='yes';}
	if(!menubarYS){menubarYS='yes';}
	if(!resizeYS){resizeYS='yes';}
	if(!HorizPos){HorizPos=5;}
	if(!VertPos){VertPos=5;}
	if(!server || url.substr(0,4) == "http" || server ==""){server="";}
	windowName=removeSpecialChar(windowName, "*");
	windowName=removeSpecialChar(windowName, " ");
	ETpopUp=window.open(server+url,windowName,'toolbar='+toolbarYS+',menubar='+menubarYS+',resizable='+resizeYS+',scrollbars='+scrollbarYS+',location='+locationYS+',top='+VertPos+',left='+HorizPos+',width='+sWidth+',height='+sHeight);
if(window.focus){ETpopUp.focus();}
}
function openHelp(freshurl){
	web_Server = 'https://us.etrade.com';
	fresh_url = web_Server + freshurl;
	leftPos = 0;
	if(screen) {
		leftPos = screen.width-280
	}
	SmallWin=window.open(fresh_url, 'HelpWindow','scrollbars=yes,resizable=yes,toolbar=no,height=688,width=272,left='+leftPos+',top=0');
	if(window.focus){SmallWin.focus();}
	if(SmallWin.opener == null) {SmallWin.opener = window;SmallWin.opener.name = "newPUMain";}
}
//cross-browser firebug console.log()
function log(){
	try {
		if (typeof(console) != "undefined"){
			console.log.apply(console,arguments);
		}
	}catch(e){}
}

/**
 * On focus and on blur events for symbol search boxes
 *
 * usage:
 * 		jQuery(input).search();
 */
if (window["jQuery"]){
	jQuery.fn.search = function() {
		return this.focus(function() {
			if( this.value == this.defaultValue ) {
				this.value = "";
			}
		}).blur(function() {
			if( !this.value.length ) {
				this.value = this.defaultValue;
			}
		});
	};
}

//logging
(function() {
	var log = function () {};
	if (!window["console"]) {
		window.console = {};
	};
	
	var logFns = {
		log: log,
		warn: log,
		error: log,
		info: log
	};
	
	for (var i in logFns) {
		if (!window.console[i]) {
			window.console[i] = logFns[i];
		}
	}
	
})();