// JavaScript Document


function mgItemList(data){
	
	var item = $('#contentview');					
	item.empty();	
	item.setTemplateURL('admin/books.html');
	for(var i=0; i<data.uiMenuItems.length; i++){
		if(data.uiMenuItems[i].key =="TextBook"){
			vlistedbooks = data.uiMenuItems[i].value;
			item.processTemplate(data.uiMenuItems[i]);	
		}
	}
	
	
	$('a[name^="mgbook"]').click(function() {
		var itemId=$(this).attr('value');
		mgItemDetail(itemId);
		
		categorylist.value = 1;
		showCourseList();
	
		return false;
	});

	$('a[name^="delbook"]').click(function() {
		var itemId=$(this).attr('value');
		deleteBook(itemId);
		return false;
	});

	
	$('tr[id^="bookitemrow-"]').each(function (index) {
		if (index % 2 == 0){
		  $(this).css("background-color", "");
		}else{
		  $(this).css("background-color", "#FDF5E6");
		}
	})
}

function deleteBook(itemId){
	
	$.ajax({
		type: 'POST',
		url:'resource/item/delete/'+itemId,
		dataType: 'json',
		success: function(result) {
			
			alert(result.msgCode +"\n"+ result.msgDiscription);
			viewBooks();
		},
		error: function (request, status, error) {
			alert('Your book deletion is unsuccessful.');
		}
	});	
}

function mgItemDetail(itemid) {
	
	var item = $('#contentview');					
	item.empty();	
	item.setTemplateURL('admin/bookdetail.html');
	if(itemid == 0){
		item.processTemplate({id:0});	
	}else{
		for(var i=0; i<vlistedbooks.length; i++){
			if(vlistedbooks[i].id == itemid){
				item.processTemplate(vlistedbooks[i]);	
			}
		}
	}
	
	$('#fileuploadform111').submit(function() {
		//var iret = upload_target.returnValue;
	  	//alert('Handler for .submit() called.');
	  	return false;
	});
	
}

function addNewBook(){
	mgItemDetail(0);
	
	categorylist.value = 1;
	showCourseList();
}

function showCourseList(){
	//vsetting
	var c = categorylist.value;
	
	var item = $('#itemcourselist');					
	item.empty();
	item.setTemplateURL('admin/itemcourselist.html');
			
	for(var i=0; i<vsetting.itemCategory.length; i++){
		var cty = vsetting.itemCategory[i];
		if(c == cty.value){
			item.processTemplate(cty);	
		}
	}
	
}

function viewOrders(isAdmin){
	
	
	if(userobj){
		shiftState(true);
	
		var item = $('#contentview');					
		item.empty();
	
		var urlstring = 'resource/order/orders';
		if(!isAdmin){
			urlstring +='/'+userobj.id;
		}
		
		$.getJSON(urlstring, function(data) {
			item.setTemplateURL('admin/orders.html');
			item.processTemplate(data);	
		
			$('tr[id^="orderrow-"]').each(function (index) {
				if (index % 2 == 0){
				  $(this).css("background-color", "");
				}else{
				  $(this).css("background-color", "#FDF5E6");
				}
			})
			
		});	
	}else{
		alert("Please login to check your order history!");
		return false;
	}
	
	
	
}

function viewBooks(){
	shiftState(true);
	
	if(keywords.value.length > 0){
		searchItems();
	}else{
		loadDefaultItems();
	}
	
}

function registerMember(){
	shiftState(true);
	
	var item = $('#contentview');					
	item.empty();

	item.setTemplateURL('parts/userinfor.html');
	item.processTemplate({id:0,role:2});
}

function viewProfile(){
	//alert("isadminstate:"+isadminstate);
	
	shiftState(true);
	
	var item = $('#contentview');					
	item.empty();
	item.setTemplateURL('parts/userinfor.html');
		$.getJSON('resource/user/'+userobj.id, function(data) {
		item.setTemplateURL('parts/userinfor.html');
		item.processTemplate(data);	
	});	
	

}


function viewInfor(userId){
	//alert("isadminstate:"+isadminstate);
	
	shiftState(true);
	
	var item = $('#contentview');					
	item.empty();
	//retrieve setting data
	$.getJSON('resource/user/'+userId, function(data) {
		item.setTemplateURL('admin/userdetail.html');
		item.processTemplate(data);	
	});	
	

}

function viewMembers(){
	//alert("isadminstate:"+isadminstate);
	
	shiftState(true);
	
	var item = $('#contentview');					
	item.empty();
	//retrieve setting data
	$.getJSON('resource/user/users', function(data) {
		item.setTemplateURL('admin/members.html');
		item.processTemplate(data);	
	
		$('tr[id^="userrow-"]').each(function (index) {
			if (index % 2 == 0){
			  $(this).css("background-color", "");
			}else{
			  $(this).css("background-color", "#FDF5E6");
			}
		})
	
		$('a[name^="mguser"]').click(function() {
			var userId=$(this).attr('value');
			viewInfor(userId);
			return false;
		});
		
	});	
	
}

function shiftState(isAdmin){
	isadminstate = isAdmin;
	if(isAdmin){
		
		homestate.style.display = "none";
		adminstate.style.display = "block";
	}else{
		homestate.style.display = "block";
		adminstate.style.display = "none";
	}
}


function saveBook(){
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
	
	//for new item check
	if($('#newItemId')[0].value == 0){
	
		if($('#courseSelect')[0].value.length > 0){
			//file
			$('#itemCourse')[0].value = $('#courseSelect')[0].value;
		}else{
			if($('#itemCourse')[0].value.length == 0){
				alert("Please select course type for this book.");
				isvalid = false;
				
				return false;
			}
		}
	}
	
	var newupfilepath = $('#imguploadpath')[0].value;
	
	if(newupfilepath.length > 0){
		//file
		$('#imgfilepath')[0].value = newupfilepath;
	}else{
		if($('#imgfilepath')[0].value.length == 0){
			alert("Please select the picture for this book.");
			isvalid = false;
			
			return false;
		}
	}
	
	
	if(isvalid){
		if($('#imguploadpath')[0].value.length > 0){
			//file
			$('#fileuploadform').submit();
		}
	
		var sobj = $('#fileuploadform').serialize();
		
		$.ajax({
			type: 'POST',
			url:'resource/item' + "?"+sobj,
			//data:sobj,
			dataType: 'json',
			success: function(result) {
				
				alert(result.msgCode +"\n"+ result.msgDiscription);
				
				if($('#newItemId')[0].value == 0){
					addNewBook();
				}else{
					viewBooks();
				}
			},
			error: function (request, status, error) {
				alert('You save book is unsuccessful.');
			}
		});	
	}else{
		alert("Please input valid value on each field.");
	}
	
}

function saveUser(){
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
		
		var sobj = $('#userform').serialize();
		
		$.ajax({
			type: 'POST',
			url:'resource/user' + "?"+sobj,
			//data:sobj,
			dataType: 'json',
			success: function(result) {
				
				alert(result.msgCode +"\n"+ result.msgDiscription);
			},
			error: function (request, status, error) {
				alert('You save information is unsuccessful.');
			}
		});	
	}else{
		alert("Please input valid value on each field.");
	}
	
}

