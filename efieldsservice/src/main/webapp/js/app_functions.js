// JavaScript Document

function homeView(){
	
	$('#searchoption').hide();
		
	loadSetting();
	
	loadDefaultItems(1000);
	
	loadOrderInfor();
	
	if(userobj){
		loginpanel.style.display = "none";
		userpanel.style.display = "block";
		
		if("Administrator" == userobj.roleName){
			
			usermenu.style.display = "none";
			adminmenu.style.display = "block";
		}else{
			
			usermenu.style.display = "block";
			adminmenu.style.display = "none";
		}
	
		
	}else{
		
		username.value = "login name";
		
		loginpanel.style.display = "block";
		userpanel.style.display = "none";
		
		usermenu.style.display = "block";
		adminmenu.style.display = "none";
	}
	
	shiftState(false);
}


function initialOrderInfor(){
	bookorder = {
			sessionId:0,
			customerId:0,
			customerName:"Guest",
			phone:0,
			email:"",
			shippingAdd:"",
			postCode:"",
			subtotal:new Number(0.00),
			serviceCharge:new Number(3.00),
			totalAmount:new Number(0.00),
			orderNo:"0",
			items:[],
			additem: function(itemId,itemName, units,price){
				var uamount = new Number(price) * new Number(units);
				var isexist = false;
				if(this.items && this.items.length>0){
					for(var i = 0; i < this.items.length; i++){
						if(this.items[i].itemId == itemId){
							this.items[i].units +=1;
							this.items[i].unitAmount += uamount;
							isexist = true;
						}
					}
				}
				if(!isexist){
					var newitem = {
						itemId:itemId,
						itemName:itemName,
						price:new Number(price),
						units:new Number(units),
						unitAmount:new Number(uamount)
					};
					this.items.push(newitem);
				}
				this.subtotal += new Number(uamount);
				this.totalAmount = this.subtotal + this.serviceCharge;
			}
	};
}


function loadSetting() {
	
	//retrieve setting data
	//$.post(url, param,callback);
	$.getJSON('resource/setting', function(data) {
		//alert("test something");	
		
		vsetting = data;
		var item = $('#menuitem');					
		item.empty();	
		item.setTemplateURL('menuitem.html');	
		item.processTemplate(data);	
		
		$('a[name^="course"]').click(function() {
			var courseId=$(this).attr('course');
			loadItems(courseId);
			return false;
		});
	});	
}

function loadDefaultItems() {
	
	//retrieve setting data
	$.getJSON('resource/item/items/category/1', function(data) {
		//alert("isadminstate:"+isadminstate);
		if(isadminstate){
			mgItemList(data);
		}else{
			loadItemList(data);
		}
	});	
}


function changeCourseList(){
	//vsetting
	var c = searchcategory.value;
	for(var i=0; i<vsetting.itemCategory.length; i++){
		var cty = vsetting.itemCategory[i];
		if(c == cty.value){
			var item = $('#courselist');					
			item.empty();
			item.setTemplateURL('parts/courselisttmp.html');
			item.processTemplate(cty);	
		}
	}
	
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

function loginfun(){
	//visibility
	userpanel.style.display = "none";
	loginpanel.style.display = "block";
}

function loginsystem(){
	
	var userid = username.value;
	var password = userpass.value;
	

	$.ajax({
		type: 'POST',
		url:"resource/user/login/"+userid+"/"+password,
		dataType: 'json',
		success: function(result) {
			userobj = result;
			if(userobj.success == true){
				userwelcomeinfor.textContent = userobj.userName;
				
				bookorder.sessionId = userobj.sessionId;
				bookorder.customerId = userobj.id;
				
				loginpanel.style.display = "none";
				userpanel.style.display = "block";
				if("Administrator" == userobj.roleName){
					usermenu.style.display = "none";
					adminmenu.style.display = "block";
				}else{
					usermenu.style.display = "block";
					adminmenu.style.display = "none";
				}
				$('#mymessage')[0].textContent = userobj.unreadCount;
				
			}else{
				alert(userobj.msgCode+"\n"+userobj.msgDiscription);
			}

		},
		error: function (request, status, error) {
			alert('Login system unsuccessful.');
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


function logoutsystem(){
	
	isadminstate = false;
	
	userobj = null;

	userwelcomeinfor.textContent = "Guest";
	
	bookorder.sessionId = "";
	bookorder.customerId = 0;
	
	homeView();
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