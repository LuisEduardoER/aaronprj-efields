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
		url:"resource/user/login/"+userid+"/"+password,
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
					$('#userinforbar')[0].textContent = "Account: " + userAccount.accountCode;
				
					var amenu = $('.menuitem')[0];
					loadWatchList(amenu) ;
				},1000);
			
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

function checklogin(userSession){
	
	$.post("resource/user/logincheck/"+userSession, function(result) {
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


function loadWatchList(amenu) {
	
	menuSwitch(amenu.parentElement);
	
	$('#content').load('account/watchlist.html', function() {
	
		userSession = getCookie("cookie_aaron_prj_efields_session");
		$.getJSON('resource/market/watchlist/'+userSession, function(data) {
			
			var tickers = data.entities;
			
		//alert("watchlist 2");
			// An array renders once for each item (concatenated)
			var html = $("#watchlistTmpl").render( tickers );
			
			// Insert as HTML
			$("#watchlist").html( html );
		});	
				
	});
}

function loadDefaultMarkets(amenu) {
	
	menuSwitch(amenu.parentElement);
	
	//$('#content').load('account/accountpref.html #content');
	$('#content').load('market/markets.html', function() {
		
		//retrieve setting data
		$.getJSON('resource/market/tickers/actives', function(data) {
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
	
	//retrieve setting data
	$.getJSON('resource/market/tickers/'+markettype, function(data) {
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
	  //alert('Load account/accountpref.html was performed.');
	});

}

function loadTrade(quote, isbuy) {
	
	menuSwitch(amenu.parentElement);
	
	$('#content').load('market/trade.html', function() {
		$.getJSON('resource/market/quotes/'+quote, function(data) {
			
			var ticker = data.entities[0];
			
			// An array renders once for each item (concatenated)
			var html = $("#snapshotTmpl").render( ticker );
			
			// Insert as HTML
			$("#snapshot").html( html );
		});	
		
	});

}


function loadPortfolio(amenu) {
	
	menuSwitch(amenu.parentElement);
	
	//$('#content').load('account/accountpref.html #content');
	$('#content').load('account/portfolioview.html', function() {
	  //alert('Load account/accountpref.html was performed.');
	});

}


function loadAccountInfor(amenu) {
	
	menuSwitch(amenu.parentElement.parentElement.parentElement);
	
	$('#content').load('account/accountpref.html', function() {
	  //alert('Load account/accountpref.html was performed.');
	});

}


function loadOrdersView(amenu) {
	
	menuSwitch(amenu.parentElement.parentElement.parentElement);
	
	$('#content').load('account/vieworders.html', function() {
	  //alert('Load account/accountpref.html was performed.');
	});

}

function loadSupportView(amenu) {
	
	menuSwitch(amenu.parentElement.parentElement.parentElement);
	
	$('#content').load('support/get-support.html', function() {
	  //alert('Load account/accountpref.html was performed.');
	});

}




function searchItems() {
	if(keywords.value.length == 0){
		alert("You didn's input any words to search. \nPlease input any keywords to search.");
		return false;
	}
	
	var courses = "";
	$('input[name^="coursechecks"]').each(function() {
		if($(this).attr('checked')){
			courses +=$(this).attr('value')+",";
		}
	});
	
	var authornames = authorname.value;
	
	var querystring = "";
	if(courses.length > 0){
		querystring = "?course=" + courses;
	}
	if(authornames.length > 0){
		if(querystring.length == 0){
			querystring ="?author="+authornames;
		}else{
			querystring +="&author="+authornames;
		}
	}
	
	
	//alert("test tmplate querystring:"+querystring);
		
	//retrieve setting data
	$.getJSON('resource/item/items/fulltext/'+keywords.value+querystring, function(data) {
		if(isadminstate){
			mgItemList(data);
		}else{
			loadItemList(data);
		}
	});	
	
	searchcategory.value = 0;
	
	$('#searchoption').hide();
	
}

function searchoption(){
	$("#searchoption").toggle(1000);
}


function loadItems(course) {
	
	//retrieve setting data
	$.getJSON('resource/item/items/course/'+course, function(data) {
		if(isadminstate){
			mgItemList(data);
		}else{
			loadItemList(data);
		}
	});	
}

function loadItemList(data){
	
	
	$('#itemdetail').hide();
	$('#orderdetail').hide();
	$('#itemlist').show();
		
	var item = $('#itemlist');					
	item.empty();	
	item.setTemplateURL('items.html');
	for(var i=0; i<data.uiMenuItems.length; i++){
		if(data.uiMenuItems[i].key =="TextBook"){
			vlistedbooks = data.uiMenuItems[i].value;
			item.processTemplate(data.uiMenuItems[i]);	
		}
	}
	
	$('a[name^="book"]').click(function() {
		var itemId=$(this).attr('value');
		loadItemDetail(itemId);
		return false;
	});
	
	$('a[name^="addbook"]').click(function() {
		var itemId=$(this).attr('value');
		var itemName=$(this).attr('itemName');
		var price=$(this).attr('price');
		
		bookorder.additem(itemId,itemName,1,price);
		loadOrderInfor();
		
		return false;
	});
}


function loadItemDetail(itemid) {
	
	$('#orderdetail').hide();
	$('#itemlist').hide();
	$('#itemdetail').show();
	
	var item = $('#itemdetail');					
	item.empty();	
	item.setTemplateURL('itemdetail.html');
	for(var i=0; i<vlistedbooks.length; i++){
		if(vlistedbooks[i].id == itemid){
			var detailsdata = vlistedbooks[i];
			if(userobj){
				detailsdata.customerId = userobj.id;
				detailsdata.customerName = userobj.userName;
			}else{
				detailsdata.customerId = 0;
				detailsdata.customerName = "Guest";
			}
			item.processTemplate(detailsdata);
			loadCommentList(detailsdata.id);
		}
	}
	
	$('a[name^="addbook"]').click(function() {
		var itemId=$(this).attr('value');
		var itemName=$(this).attr('itemName');
		var price=$(this).attr('price');
		
		bookorder.additem(itemId,itemName,1,price);
		loadOrderInfor();
		
		return false;
	});
}


function loadOrderInfor() {
	
	var item = $('#orderinfo');					
	item.empty();	
	item.setTemplateURL('parts/orderinfo.html');	
	item.processTemplate(bookorder);	
	 
	$('#orderinfo').show();
	
}


function loadOrderDetail() {
	
	shiftState(false);
	
	$('#itemlist').hide();
	$('#itemdetail').hide();
	$('#orderinfo').hide();
	
	if(userobj){
		bookorder.customerId = userobj.id;
		bookorder.customerName = userobj.userName;
		bookorder.phone = userobj.phoneNamber;
		bookorder.email = userobj.email;
		bookorder.shippingAdd = userobj.address;
		bookorder.postCode = userobj.postCode;
		
	}
	
	var item = $('#orderdetail');					
	item.empty();	
	item.setTemplateURL('parts/orderdetail.html');	
	item.processTemplate(bookorder);
	 
	$('#orderdetail').show();
	
}

function placeOrder(){
	
	$('#fieldsessionId')[0].value = bookorder.sessionId;
	$('#fieldcustomerId')[0].value = bookorder.customerId;
	
	var isvalid = true;
	$("form :text").each(function(i){
		if (this.value == '' && this.parentNode.tagName == 'TD') {
			//tagName parentNode
			$(this).css("background-color","#F66");
			isvalid = false;
		}else{
			$(this).css("background-color","");
		}
	});
	
	if(isvalid){
		var sobj = $('#orderfrom').serialize();
		var urlstring = 'resource/order/placeorder';
		urlstring = urlstring + "?"+sobj;
		
		//alert(urlstring);
		
		$.ajax({
			type: 'POST',
			url:urlstring,
			//url: 'resource/order/placeorder?id=0$sessionid=1',
			//data: sobj,
			//data: {sessionid:"1",customerName:"customerName",phone:"phone",email:"email"},
			dataType: 'json',
			success: function(result) {
				
				for(var i=0; i<bookorder.items.length; i++){
					var itm = bookorder.items[i];
					addedOrderItem(result.orderNo,itm.itemId, itm.units,itm.unitAmount);
					
				}
				
				
				alert(result.msgCode +"\n"+ result.msgDiscription);
				
				//initial new order
				initialOrderInfor();
			},
			error: function (request, status, error) {
				alert('Your order is unsuccessful.');
			}
		});	
	}
}

function addedOrderItem(orderNo,itemId, units,unitAmount){
	//"/orderitem/{orderno}/{itemid}/{units}/{price}"
	var sobj = $('#orderdetail').serialize();
	var urlstring = 'resource/order/orderitem/'+orderNo+'/'+itemId+'/'+units+'/'+unitAmount;
	urlstring = urlstring + "?"+sobj;
	
	//alert(urlstring);
	
	$.ajax({
		type: 'POST',
		url:urlstring,
		dataType: 'json',
		success: function(result) {

			//alert('Added order item is successful.');
		},
		error: function (request, status, error) {
			alert('Added order item is unsuccessful.');
		}
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