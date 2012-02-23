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

