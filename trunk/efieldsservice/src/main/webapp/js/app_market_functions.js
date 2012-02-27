// JavaScript Document

function menuSwitch(amenu){
	
	clearInterval(refreshId);
	
	$(".menuitem").removeClass("active");
	$(amenu).addClass("active");
}

function loginsystem(){
	
	var userid = $("#modlgn_username")[0].value;
	var password = $("#modlgn_passwd")[0].value;
	

	$.ajax({
		type: 'POST',
		url:"resource/account/login/"+userid+"/"+password,
		dataType: 'json',
		success: function(result) {
			if(result.success == true){
				userAccount = result.entity;
				
				$('#form-login').slideUp('slow');
				setCookie('cookie_aaron_prj_efields_session', result.sessionId,100);
				
				$('#header-wrapper').load('header-menu.html');
				$('#secondary-highlight-wrapper').hide();
				$('#body-column').hide();
			
				setTimeout(function(){
					userAccount.netValue = new Number(userAccount.netValue);
					$('#userinforbar')[0].textContent = "Account: " + userAccount.accountCode + " Net Value: " + userAccount.netValue.toFixed(2);
				
					var amenu = $('.menuitem')[0];
					loadWatchList(amenu) ;
				},600);
			
			}else{
				alert(result.msgCode+"\n"+result.msgDiscription);
			}

		},
		error: function (request, status, error) {
			alert('Login system unsuccessful.');
		}
	});	
	
}

function logoutsystem(){
	setCookie('cookie_aaron_prj_efields_session', null,null);
	document.location = "index.html";
}

function checklogin(){
	userSession = getCookie("cookie_aaron_prj_efields_session");
	$.post("resource/account/logincheck/"+userSession, function(result) {
		if(result.success == true){
			userAccount = result.entity;
		}else{
			alert(result.msgCode+"\n"+result.msgDiscription);
		}
	});	
	
}

function showMyMessage(){
		
	var item = $('#orderdetail');					
	item.empty();	
	item.setTemplateURL('parts/orderdetail.html');	
	item.processTemplate(bookorder);	
	
	$('a[name^="course"]').click(function() {
		var courseId=$(this).attr('value');
		//loadItems(courseId);
		
		
		//loadOrderInfor();
		return false;
	});
	 
	$('#orderdetail').show();
}

function addWatch(quote){
	
	userSession = getCookie("cookie_aaron_prj_efields_session");
	$.post('resource/market/addwatch/'+quote+'/'+userSession, function(result) {
		if(result.success == true){
			
		}else{
			alert(result.msgCode+"\n"+result.msgDiscription);
		}
	});	
}

function removeWatch(quote){
	
	userSession = getCookie("cookie_aaron_prj_efields_session");
	$.post('resource/market/removewatch/'+quote+'/'+userSession, function(result) {
		if(result.success == true){
			
		}else{
			alert(result.msgCode+"\n"+result.msgDiscription);
		}
	});	
}

function loadWatchList(amenu) {
	
	menuSwitch(amenu.parentElement);
	
	$('#content').load('account/watchlist.html', function() {
	
		userSession = getCookie("cookie_aaron_prj_efields_session");
		$.getJSON('resource/market/watchlist/'+userSession, function(data) {
			
			var tickers = data.entities;
			var html = $("#watchlistTmpl").render( tickers );
			
			// Insert as HTML
			$("#watchlist").html( html );
		});	
				
	});
}

function loadSearchedSymbols(quote) {
	
	//$('#content').load('account/accountpref.html #content');
	$('#content').load('market/symbols.html', function() {
		
		//retrieve setting data
		$.getJSON('resource/market/tickers/'+quote.toUpperCase(), function(data) {
			//alert("isadminstate:"+isadminstate);
			//entities
			var tickers = data.entities;
			
			// An array renders once for each item (concatenated)
			var html = $( "#markettickerTmpl" ).render( tickers );
			
			// Insert as HTML
			$( "#markettickers" ).html( html );
		});	
		
	});
}

function loadDefaultMarkets(amenu) {
	
	menuSwitch(amenu.parentElement);
	
	//$('#content').load('account/accountpref.html #content');
	$('#content').load('market/markets.html', function() {
		
		//retrieve setting data
		$.getJSON('resource/market/tickers/NYSE/actives', function(data) {
			//alert("isadminstate:"+isadminstate);
			//entities
			var tickers = data.entities;
			
			// An array renders once for each item (concatenated)
			var html = $( "#markettickerTmpl" ).render( tickers );
			
			// Insert as HTML
			$( "#markettickers" ).html( html );
		});	
		
	});
}

function loadMarkets(markettype) {
	
	var et = $("#exchangeType")[0].value;
	//retrieve setting data
	$.getJSON('resource/market/tickers/'+et+'/'+markettype, function(data) {
		//alert("isadminstate:"+isadminstate);
		//entities
		var tickers = data.entities;
		
		// An array renders once for each item (concatenated)
		var html = $( "#markettickerTmpl" ).render( tickers );
		
		// Insert as HTML
		$( "#markettickers" ).html( html );
	});	
}

function loadSnapshot(qutoes) {
	
	clearInterval(refreshId);
	//$('#content').load('account/accountpref.html #content');
	$('#content').load('market/snapshot.html', function() {
		$.getJSON('resource/market/quotes/'+qutoes, function(data) {
			
			var ticker = data.entities[0];
			
			// An array renders once for each item (concatenated)
			var html = $("#snapshotTmpl").render( ticker );
			
			// Insert as HTML
			$("#snapshot").html( html );
		});	
	});

}

function loadDefaultTrade(amenu) {
	
	menuSwitch(amenu.parentElement);
	
	//$('#content').load('account/accountpref.html #content');
	$('#content').load('market/trade.html', function() {
		
			// An array renders once for each item (concatenated)
			var html = $("#tradorderinforTmpl").render(null);
			
			// Insert as HTML
			$("#tradorderinfor").html( html );
	});

}

function loadTrade(quote, orderType) {
	
	$('#content').load('market/trade.html', function() {
		
		loadTradeInfor(quote, orderType) ;
		
	});

}

function loadTradeInfor(quote, orderType) {
	
	$.getJSON('resource/market/quotes/'+quote, function(data) {
		
		var ticker = data.entities[0];
		
		ticker.orderType = orderType;
		// An array renders once for each item (concatenated)
		var html = $("#tradorderinforTmpl").render( ticker );
		// Insert as HTML
		$("#tradorderinfor").html( html );
	});	

}


function loadPortfolio(amenu) {
	
	menuSwitch(amenu.parentElement);
	
	//$('#content').load('account/accountpref.html #content');
	$('#content').load('account/portfolioview.html', function() {
	
	
		userSession = getCookie("cookie_aaron_prj_efields_session");
		$.getJSON('resource/trading/portfolio/'+userSession, function(data) {
			
			var tickers = data.entities;
			
			// An array renders once for each item (concatenated)
			var html = $("#portfolioitemsTmpl").render( tickers );
			// Insert as HTML
			$("#portfolioitems").html( html );
			
		});	
	});

}


function loadAccountInfor(amenu) {
	
	menuSwitch(amenu.parentElement.parentElement.parentElement);
	
	$('#content').load('account/accountpref.html', function() {
		
	});

}


function loadOrdersView(amenu) {
	
	menuSwitch(amenu.parentElement.parentElement.parentElement);
	
	$('#content').load('account/vieworders.html', function() {
	  
		// An array renders once for each item (concatenated)
		var html = $("#orderitemsTmpl").render( userAccount.tradingOrders );
		$("#orderitems").html( html );
	});

}

function loadSupportView(amenu) {
	
	menuSwitch(amenu.parentElement.parentElement.parentElement);
	
	$('#content').load('support/get-support.html', function() {
	  //alert('Load account/accountpref.html was performed.');
	});

}

function previewOrder(){
	
	var formdata = $('#trade-order-form').serialize();
	
	var formo = serializeObject($('#trade-order-form'));
	
	var theamount = new Number(formo.quantity * formo.price); 
	formo.theamount = theamount.toFixed(2);;
	
	//transaction=1&quantity=100&symbol=AAPL&priceType=2&tempPrice=50
	
	$('#content').load('market/tradeconfirm.html', function() {
		$('#presubmitformdata')[0].value = formdata;
		
		// An array renders once for each item (concatenated)
		var html = $("#tradorderinforTmpl").render( formo );
		$("#theorderinformation").html( html );
	
		$.getJSON('resource/market/quotes/'+formo.symbol, function(data) {
			
			var ticker = data.entities[0];
			
			// An array renders once for each item (concatenated)
			var html = $("#symbolinformationTmpl").render( ticker );
			// Insert as HTML
			$("#symbolinformation").html( html );
		});	
	
		
	});

}

function refrechQuoteInfor(quote){
	
	$.getJSON('resource/market/quotes/'+quote.toUpperCase(), function(data) {
		return data.entities;
	});	
	return null;
}


function placeOrder(){
	
	var formdata = $('#presubmitformdata')[0].value
	//transaction=1&quantity=100&symbol=AAPL&priceType=2&tempPrice=50
	
	userSession = getCookie("cookie_aaron_prj_efields_session");
	$.ajax({
		type: 'POST',
		url:"resource/trading/trade/"+userSession+"?"+formdata,
		dataType: 'json',
		success: function(result) {
			if(result.success == true){
				
			
			}else{
				alert(result.msgCode+"\n"+result.msgDiscription);
			}

		},
		error: function (request, status, error) {
			alert('Login system unsuccessful.');
		}
	});	
	
	checklogin();
	
	$('#content').load('account/vieworders.html', function() {
	
		// An array renders once for each item (concatenated)
		var html = $("#orderitemsTmpl").render( userAccount.tradingOrders );
		$("#orderitems").html( html );
	});
}



function refreshTotal(uobj){
	for(var i=0; i<bookorder.items.length; i++){
		var itm = bookorder.items[i];
		if(uobj.id == itm.itemId){
			bookorder.subtotal -= itm.unitAmount;
			itm.units = new Number(uobj.value);
			itm.unitAmount = new Number(itm.price * itm.units); 
			bookorder.subtotal += itm.unitAmount;
			bookorder.totalAmount = bookorder.subtotal + bookorder.serviceCharge;
			
			//t_subtotal
			$('#t_subtotal')[0].textContent = bookorder.subtotal.toFixed(2);
			$('#t_totalAmount')[0].textContent = bookorder.totalAmount.toFixed(2);
			
			$('#p_subtotal')[0].value = bookorder.subtotal.toFixed(2);
			$('#p_totalAmount')[0].value = bookorder.totalAmount.toFixed(2);
			
		}
		
	}
}


function loadCommentList(itmId){
	
	var item = $('#itemcommentList');					
	item.empty();	
	item.setTemplateURL('parts/itemcomments.html');	
	
	$.getJSON('resource/item/comments/'+itmId, function(data) {

		item.processTemplate(data);
	});		
	
	 
	$('#itemcommentList').show();
}

function sumbmitComment(){

	var sobj = $('#formComment').serialize();
	
	var itmId = $('#itemidforcomment')[0].value;
	
	$.ajax({
		type: 'POST',
		url:'resource/item/comment?'+sobj,
		dataType: 'json',
		success: function(result) {
			loadCommentList(itmId);
		},
		error: function (request, status, error) {
			alert('Added item comment is unsuccessful.');
		}
	});	
	
}


function showMessage(vname){
	alert("vname::"+vname);
	
	
}


function getCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
	}
}

function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function checkCookie()
{
	var username=getCookie("username");
	if (username!=null && username!="")
	  {
	  alert("Welcome again " + username);
	  }
	else
	  {
	  username=prompt("Please enter your name:","");
	  if (username!=null && username!="")
		{
		setCookie("username",username,365);
		}
	  }
}

function serializeObject(theform)
{
    var o = {};
    var a = theform.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
