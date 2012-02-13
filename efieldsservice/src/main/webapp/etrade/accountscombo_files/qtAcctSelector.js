var _orgClassFr = '';	//to save the org class of the current hover row
var _orgClassTo = '';
var firstList = 1;
var secondList = 2;
	 
var _FrSelectedRowId = '';
var _FrSelectedOrgClassOld = '';	//to save the original class of the selected row
var _ToSelectedOrgClassOld = '';
var _ToSelectedRowId = '';
var _FrCurrRowID_UpDown = '';	//for Up & Down arrow keys
var _ToCurrRowID_UpDown = '';	//for Up & Down arrow keys
var _FrSelectedOrgClassOld_UDKey = '';
var _ToSelectedOrgClassOld_UDKey = '';
var _selectedClass = 'etAccount_ov';
var _FrAccList = new Object();	//For Key Enter
var _ToAccList = new Object();


$(document).ready(function(){	
	
	setRowClass($('#etFromAccounts > li:not(:has(ul.title))'));
	initTransferAcctDiv($('#etFromAccounts > li:not(:has(ul.title),:has(div.xAcctTxtDisabled))'), $('#from_acct_input'));
	//initTransferAcctDiv($('#etFromAccounts > li:not(:has(ul.title))'), $('#from_acct_input'));
	
	if (document.getElementById(_FrSelectedRowId)) {		
		
		// _orgClassFr = document.getElementById(_FrSelectedRowId).className;	
		_FrSelectedOrgClassOld = document.getElementById(_FrSelectedRowId).className;	//fix for edit transfer	
		document.getElementById(_FrSelectedRowId).className = _selectedClass;
	}
	
	$('#from_acct_input').bind('click', function() {			
		showAccList($('#transferFrDiv'));
	});
	
		
	$('#to_acct_input').bind('click', function() {			
		showAccList($('#transferToDiv'));
	});	
	setRowClass($('#etToAccounts > li:not(:has(ul.title))'));
	initTransferAcctDiv($('#etToAccounts > li:not(:has(ul.title),:has(div.xAcctTxtDisabled))'), $('#to_acct_input'));
	//initTransferAcctDiv($('#etToAccounts > li:not(:has(ul.title))'), $('#to_acct_input'));
	if (document.getElementById(_ToSelectedRowId)) {
		//_orgClassTo = document.getElementById(_ToSelectedRowId).className;
		_ToSelectedOrgClassOld = document.getElementById(_ToSelectedRowId).className;
		document.getElementById(_ToSelectedRowId).className = _selectedClass;
	}

	$(document).mouseup(function(event){	
		if ((event.target.id == '' || event.target.id == null) || 
			(event.target.id != 'from_acct_input' && event.target.id != 'to_acct_input' && event.target.id != 'etFromAccounts' && event.target.id != 'etToAccounts')) {	
			closeAccList();
		}			
		
	});
		
	
	$(document).keyup(function(event) {			
		
		switch (event.keyCode ? event.keyCode : event.which) {
			case 40:
				if ($('#transferFrDiv').is('.showDiv')) {					
					selectOnArrowKeyDown($('#etFromAccounts > li'), firstList);
				} else 
					selectOnArrowKeyDown($('#etToAccounts > li'), secondList);
			break;
			case 38:
				if ($('#transferFrDiv').is('.showDiv')) {
					selectOnArrowKeyUp($('#etFromAccounts > li'), firstList);
				} else
					selectOnArrowKeyUp($('#etToAccounts > li'), secondList);
			break;
			
			case 13:
				var rowId = '';
				var inputId = '';
				
				if ($('#transferFrDiv').is('.showDiv')) {
					rowId = $('#etFromAccounts > li.etAccount_ov').attr("id");
					inputId = 'from_acct_input';
					setInputOnEnter(rowId, inputId, _FrAccList[rowId]);					
				}
				else if ($('#transferToDiv').is('.showDiv')) {	
					rowId = $('#etToAccounts > li.etAccount_ov').attr("id");
					inputId = 'to_acct_input';
					
					setInputOnEnter(rowId, inputId, _ToAccList[rowId]);
				}					
				//event.preventDefault();	
				//return false;				
									
			break;
			
		}			 
	});

});
//---------------------------------------------------------------------------------------

function setRowClass(divObj){
	divObj.filter(":even").addClass('odd');	
	divObj.filter(":odd").addClass('even');
}

function initTransferAcctDiv(divObj, inputObj) {	

	if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
		inputObj.keydown(checkForEnter);
	}
	else {
		inputObj.keypress(checkForEnter);
	}
	
	divObj.mouseover(function(){
		mOver($(this).attr('id'));
	});
	
	divObj.mouseout(function(){
		mOut($(this).attr('id'));
	});
	
	divObj.bind('click', function(event){		
		
		$(this).attr('class', _selectedClass);		
		setSelectedInput($(this).attr("id"), inputObj.attr("id"));
		
	});

}

function checkForEnter(event) {     						
	if ((event.keyCode ? event.keyCode : event.which) == 13) {
      
		var rowId = '';
		var inputId = '';
		
		if ($('#transferFrDiv').is('.showDiv')) {			
			rowId = $('#etFromAccounts > li.etAccount_ov').attr("id"); 
			inputId = 'from_acct_input';
			setInputOnEnter(rowId, inputId, _FrAccList[rowId]);					
		}
		else if ($('#transferToDiv').is('.showDiv')) {	
			rowId = $('#etToAccounts > li.etAccount_ov').attr("id");
			inputId = 'to_acct_input';
			setInputOnEnter(rowId, inputId, _ToAccList[rowId]);
		}
					
		event.preventDefault();
        return false;
    }

}

function selectOnArrowKeyDown (etAcctRows, openDiv) {		
	var rowSelected = etAcctRows.filter('.etAccount_ov');	
	
	if (rowSelected.length > 0) {
			
		var $next = rowSelected.next();
		
		if ($next.children().length > 0 && ($next.children()[0].className) == 'title') {							
			$next = rowSelected.next().next();			
		}	
						
		if (openDiv == firstList) {
			rowSelected.addClass(_orgClassFr);
			//rowSelected.addClass(_FrSelectedOrgClassOld);
		
			rowSelected.removeClass(_selectedClass);
			
				 
			 _FrSelectedOrgClassOld_UDKey = $next.attr("class"); 
			 _FrCurrRowID_UpDown = $next.attr("id");		
			_orgClassFr = $next.attr("class");
			
		
			$next.addClass(_selectedClass);	
			$next.removeClass(_orgClassFr);	
		} 
		else if (openDiv == secondList) {
			rowSelected.addClass(_orgClassTo);
			rowSelected.removeClass(_selectedClass);
						
			_ToSelectedOrgClassOld = $next.attr("class"); 
			 _ToCurrRowID_UpDown = $next.attr("id");
			_orgClassTo = $next.attr("class"); 
				
	
			$next.addClass(_selectedClass);	
			$next.removeClass(_orgClassTo);	
		}
	
	}
	else {						
		
		var nextRowClass = etAcctRows.filter(':first-child').next().attr("class");
		
		etAcctRows.filter(':first-child').next().removeClass(nextRowClass);
		etAcctRows.filter(':first-child').next().addClass(_selectedClass);
		
		_orgClassFr = nextRowClass;		
		
	}
	
}

function selectOnArrowKeyUp (etAcctRows, openDiv) {		
	var rowSelected = etAcctRows.filter('.etAccount_ov');	
	
	if (rowSelected.length > 0) {				
		var $pre = rowSelected.prev();			

		if ($pre.children().length > 0 && ($pre.children()[0].className) == 'title') {							
			$pre = rowSelected.prev().prev();			
		}
		
		if (openDiv == firstList) {
			rowSelected.addClass(_orgClassFr);
			rowSelected.removeClass(_selectedClass);
			
			_FrSelectedOrgClassOld_UDKey = $pre.attr("class"); 
			_FrCurrRowID_UpDown = $pre.attr("id");			
			_orgClassFr = $pre.attr("class");			
			$pre.addClass(_selectedClass);	
			$pre.removeClass(_orgClassFr);
		}
		else if (openDiv == secondList) {
			rowSelected.addClass(_orgClassTo);
			rowSelected.removeClass(_selectedClass);
			
			_ToSelectedOrgClassOld = $pre.attr("class"); 
			_ToCurrRowID_UpDown = $pre.attr("id");		
			_orgClassTo = $pre.attr("class");
			$pre.addClass(_selectedClass);	
			$pre.removeClass(_orgClassTo);	
			
		}
	
	}
	else {		
		 			
		var lastRowClass = etAcctRows.filter(':last-child').attr("class"); 			
		
		etAcctRows.filter(':last-child').removeClass(lastRowClass);	
		etAcctRows.filter(':last-child').addClass(_selectedClass);					
	}
}

function setInputOnEnter(rowId, inputId, value) {
	
	if ( ($('#etFromAccounts > li.etAccount_ov').length > 0 && $('#transferFrDiv').is('.showDiv')) ||
		 ($('#etToAccounts > li.etAccount_ov').length > 0 && $('#transferToDiv').is('.showDiv')) ) {
		if (rowId) {
			setSelectedInput(rowId, inputId, value);			
		}			
	}
	closeAccList();
}

function setSelectedInput(rowId, inputId, rowValue){
	
	var divElm = document.getElementById(rowId).childNodes; 
	var textInput = '';
	var n = 0;
	//var div = "";
	for (var i=0; i<divElm.length; i++) {
		if (divElm[i].nodeName == 'DIV') {			
			//var span = divElm[i].childNodes[0];
			/*if (divElm[i].childNodes[0]) {			
				if (n > 0 && divElm[i].childNodes[0] != '')	textInput += " - ";
				textInput += divElm[i].childNodes[0].nodeValue;
				n++;
			}*/
			
			if (divElm[i].childNodes[0].childNodes[0])         {// && divElm[i].childNodes[0].nodeName == 'SPAN') {
				if (n > 0 && divElm[i].childNodes[0].childNodes[0] != '')	textInput += " - ";
				textInput += divElm[i].childNodes[0].childNodes[0].nodeValue;
				n++;
				//div += "node nanm: " + divElm[i].childNodes[0].nodeName + "\t... value: " + textInput + "\n\n #nodes:"+divElm[i].childNodes[0].length;
			}
			
			if (divElm[i].childNodes[1] && divElm[i].childNodes[1].childNodes[0]){// && divElm[i].childNodes[1].nodeName == 'SPAN') {
				if (n > 0 && divElm[i].childNodes[0].childNodes[0] != '')	textInput += " - ";
				textInput += divElm[i].childNodes[0].childNodes[0].nodeValue;
				
				//div += "node nanm: " + divElm[i].childNodes[0].nodeName + "\t... value: " + textInput + "\n\n #nodes:"+divElm[i].childNodes[0].length;
			}			
			
		}
	}
		
	document.getElementById(inputId).value = textInput;		
	
	if (inputId == 'from_acct_input') {	
		
		//new row is selected
		if (_FrSelectedRowId != rowId && document.getElementById(_FrSelectedRowId)){// && _FrSelectedOrgClassOld != '') {
			if (_FrSelectedOrgClassOld == '')
				_FrSelectedOrgClassOld = _orgClassFr;
											
			document.getElementById(_FrSelectedRowId).className = _FrSelectedOrgClassOld;		//Put back its org class
			
			document.getElementById(rowId).className = _selectedClass;
		}
		_FrSelectedOrgClassOld = _orgClassFr;	//class already changed to hover status: document.getElementById(rowId).className;							
	
		_FrSelectedRowId = rowId;
		rowValue = _FrAccList[rowId];
		if (rowValue)
			document.rtm.from_acctnum_list.value = rowValue;  
		else
			document.rtm.from_acctnum_list.value = rowId;
			
		
	} 
	else {	
		if (_ToSelectedRowId != rowId && document.getElementById(_ToSelectedRowId)) {// && _ToSelectedOrgClassOld != '') {	
			if (_ToSelectedOrgClassOld == '')
				_ToSelectedOrgClassOld = _orgClassTo;
											
			document.getElementById(_ToSelectedRowId).className = _ToSelectedOrgClassOld;		//Put back its org class				
			document.getElementById(rowId).className = _selectedClass;
		}
		_ToSelectedOrgClassOld = _orgClassTo;	//class already changed to hover status: document.getElementById(rowId).className;	
								
		_ToSelectedRowId = rowId; 
		rowValue = _ToAccList[rowId];		
				
		if (rowValue)
			document.rtm.to_acctnum_list.value = rowValue;
		else
			document.rtm.to_acctnum_list.value = rowId;		//TBD: hardcode the form name for now.
	}
					
	document.getElementById(inputId).onchange();
	
	
}

function showAccList(jDivObj) {	
	closeAccList();			
	jDivObj.removeClass('hiddenDiv');
	jDivObj.addClass('showDiv');
	if ($('#transferFrDiv').is('.showDiv')) {
		document.getElementById('from_acct_input').blur();		
	} else {
		document.getElementById('to_acct_input').blur();
	}
	
}

function closeAccList(){
	
	if ($('#transferFrDiv').is('.showDiv')) {
		
		//For mouse hover: Highlight the old selected row
		if (_FrSelectedRowId != '' && (document.getElementById(_FrSelectedRowId) && document.getElementById(_FrSelectedRowId).className != _selectedClass)) {				
			document.getElementById(_FrSelectedRowId).className = _selectedClass;
			
			//For the case the user hovered on row but closed the list without selection.  The class of the last hover row must be set back to the selected row		
			/*???if (_FrSelectedOrgClassOld != '') {		
				_orgClassFr = _FrSelectedOrgClassOld;
			}*/
		} 
		//For key Arrow Up and key Arrow Down:  If more than 1 rows highlighted: that means the user did not select or hit enter on the new highlighted row.  Put back the class of the last highlighted row
		if ($('#etFromAccounts > li.etAccount_ov').length > 1 && document.getElementById(_FrCurrRowID_UpDown)) {			
			document.getElementById(_FrCurrRowID_UpDown).className = _FrSelectedOrgClassOld_UDKey;			
		}
						
		$('#transferFrDiv').removeClass('showDiv');
		$('#transferFrDiv').addClass('hiddenDiv');
		
	}			
	else if ($('#transferToDiv').is('.showDiv')) {		
		
		if (_ToSelectedRowId != '' && (document.getElementById(_ToSelectedRowId) && document.getElementById(_ToSelectedRowId).className != _selectedClass)) {				
			document.getElementById(_ToSelectedRowId).className = _selectedClass;
			
			//For the case the user hovered on row but closed the list without selection.  The class of the last hover row must be set back to the selected row
			/*if (_ToSelectedOrgClassOld != '') {		
				_orgClassTo = _ToSelectedOrgClassOld;
			}*/
		} 
		if ($('#etToAccounts > li.etAccount_ov').length > 1 && document.getElementById(_ToCurrRowID_UpDown)) {			
			document.getElementById(_ToCurrRowID_UpDown).className = _ToSelectedOrgClassOld;			
		}
					
		$('#transferToDiv').removeClass('showDiv');
		$('#transferToDiv').addClass('hiddenDiv');
		
	}
			
}

function mOver(elmId) { 		
	
	if ($('#transferFrDiv').is('.showDiv')) {
		// if there at least 1 row selected
		if ($('#etFromAccounts > li.etAccount_ov').length > 0) {
			//put back the selected row its org class							 
			$('#etFromAccounts > li.etAccount_ov').addClass(_FrSelectedOrgClassOld);
			
			
			$('#etFromAccounts > li.etAccount_ov').removeClass(_selectedClass);			
			
		}
		
		if (document.getElementById(elmId))
			_orgClassFr = document.getElementById(elmId).className;			//set new org class for the current hovered row
				
	}
	else if ($('#transferToDiv').is('.showDiv')) { 		
				
		if ($('#etToAccounts > li.etAccount_ov').length > 0) {					
			
			//put back the selected row its org class
			$('#etToAccounts > li.etAccount_ov').addClass(_ToSelectedOrgClassOld);			
			
			$('#etToAccounts > li.etAccount_ov').removeClass(_selectedClass);
		}
		
		if (document.getElementById(elmId))
			_orgClassTo = document.getElementById(elmId).className;		//set new org class for the current hovered row
		
	}		
	
	document.getElementById(elmId).className = _selectedClass;		
}

function mOut(elmId) {		
 
	if ($('#transferFrDiv').is('.showDiv')) { 
		document.getElementById(elmId).className = _orgClassFr;		
	}
	else if ($('#transferToDiv').is('.showDiv')) {
		if (document.getElementById(elmId))		
			document.getElementById(elmId).className = _orgClassTo;
		if (_ToSelectedOrgClassOld != '')
			_orgClassTo = _ToSelectedOrgClassOld;
		
	}	
}
