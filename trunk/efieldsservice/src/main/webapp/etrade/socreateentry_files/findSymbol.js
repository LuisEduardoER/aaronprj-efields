
  		
$(document).ready(function () {
		$("#fsw-dialog").dialog({

bgiframe: true,
width: 390,
minWidth: 390,
minHeight: 150,
position: [300,100],
resizable: true,
draggable: true, 
modal: true,
autoOpen: false,
drag: function(event, ui) { 
dragWidth = $(".ui-dialog").width();	// fix IE white spaces
dragHeight = $(".ui-dialog").height();
},

dragStop: function(event, ui) {

if($.browser.mozilla) {

$(".ui-dialog").width(dragWidth+3);	
$(".ui-dialog").height(dragHeight+4);

}
else {
	$(".ui-dialog").width(dragWidth);	
	$(".ui-dialog").height(dragHeight);
}
},

resizeStop: function(event, ui) { 

		    if($.browser.mozilla) {
			    $("#fsw-dialog").width("100%");
			    $("#fsw-dialog").height($(".ui-dialog").height()-65);

		    }

	    },

open: function(event, ui) {


	      if (!(document.getElementById('dialogFooter'))){		
		      $(".ui-dialog").append("<div id='dialogFooter' style='display: none'></div>");
	      }


      }
});
});




function findSymbolDialog(optionObj)
{
	var securityType= optionObj.securityType;
	var symbol = optionObj.symbol;
	hideAdjOption = optionObj.hideAdjOption;

	country = "";
	country = optionObj.country;

	if (securityType != "Options") { symbol = ''; }
	$("#fsw-result").html("");
	$("#fsw-dialog").dialog('open');

	var maskHt = $(".ui-widget-overlay").css("height");
	var newtop = parseInt(maskHt);
	var cur_top = $(".ui-dialog").css("top");
	if(cur_top == "0px" ||  parseInt(cur_top) > 0) {
		$(".ui-dialog").css("top", "300px");
		if(!$.browser.msie) $(".ui-dialog").css("left", "300px");
		else  $(".ui-dialog").css("left", "234px");
		$(".ui-dialog").css("z-index", "200005");	
	}
	else if(cur_top == "auto"){ }
	else {
		newtop =  ($.browser.msie)? newtop - 500 : newtop - 300; 
		$(".ui-dialog").css("top", "-"+newtop+"px");
		if(!$.browser.msie) $(".ui-dialog").css("left", "300px");
		else  $(".ui-dialog").css("left", "-134px");
		$(".ui-dialog").css("z-index", "200005");	
	}

	window.scrollTo(0,0);
	dialogInitalization(securityType, symbol);
}

function dialogInitalization(securityType, symbol)
{

	var select_list_field = document.getElementById('fsw-search_type');

	for (var i=0;i<select_list_field.options.length;i++) {
		if (select_list_field.options[i].value == securityType)
			select_list_field.options[i].selected = true;
	}

	changeSearchType();
	$("#fsw-searchTerm").val(symbol);

	if (securityType != "MutualFund") { $("#fsw-searchTerm").focus().val($("#fsw-searchTerm").val());  }

	if (symbol.length > 0){
		$("#fsw-error").hide();
		if (securityType == "Options") { $("#fsw-search_button").click(); }
	}

	fswGoEvent ();
}

function setHeightMin()
{

	$(document).ready(function () {
			$(".ui-dialog").height("auto");	
			$("#fsw-dialog").height("auto");
			});

}


function setHeightMax()
{


	$(document).ready(function () {
			$("#fsw-dialog").height(450);	
			$(".ui-dialog").height("auto");

			if (fundType == "MutualFund")
			{		
			if($.browser.mozilla)
			{
			$("#fsw-dialog").width("auto");
			} 		
			else if($.browser.safari)
			{
			$("#fsw-dialog").width("auto");
			} 
			else {    
			$("#fsw-dialog").width("auto");	
			$("#fsw-dialog-table").width("auto");
			}
			} else{
			/*
			   if($.browser.mozilla)
			   {
			   $("#fsw-dialog").width("auto");
			   } else if($.browser.safari) {
			   $("#fsw-dialog").width("94.8%");
			   }else{
			   $("#fsw-dialog").width("94.2%");		
			   $("#fsw-dialog-table").width("94.9%");
			   }
			 */

			}



	});

}

function changeSearchType ()

{
	$("#fsw-result").html("");
	$('.dialogFooter').html("").hide();
	setHeightMin();
	$(".fsw-checkbox").attr('checked', false);

	fundType= $('#fsw-search_type').val();

	if (fundType =="Indexes" )
	{
		$("#fsw-searchTerm").val('');
		$("#fsw-optionOnly").hide();
		$("#fsw-mutualFundOnly").hide();
		$("#fsw-symbolInput").show();
		$("#fsw-fundFamily").hide();
		$("#fsw-searchHeader").text("Company or Symbol");
		$("#fsw-dialog").width("auto");					 
		$(".ui-dialog").width(370);	
		$("#fsw-error").show();
		$(".fsw-error-msg").hide();			
		$("#fsw-errStockIndex").show();
		$("#fsw-error-icon").attr("src", AkamaiURL+"/images/osi/find_symbol.gif");
		fswGoEvent ();
		$("#fsw-searchTerm").focus();			
	}

	if ( fundType =="Stocks" )
	{	$("#fsw-searchTerm").val('');
		$("#fsw-optionOnly").hide();
		$("#fsw-mutualFundOnly").hide();			 
		$("#fsw-symbolInput").show();
		$("#fsw-fundFamily").hide();
		$("#fsw-searchHeader").text("Company or Symbol");
		$("#fsw-dialog").width("auto");					 
		$(".ui-dialog").width(370);			
		$("#fsw-error").show();
		$(".fsw-error-msg").hide();
		$("#fsw-errStockIndex").show();
		$("#fsw-error-icon").attr("src", AkamaiURL+"/images/osi/find_symbol.gif");			
		fswGoEvent ();
		$("#fsw-searchTerm").focus();			
	}

	if ( fundType =="MutualFund" )
	{

		if($.browser.mozilla)
		{
			$("#fsw-dialog").width("auto");					 
			$(".ui-dialog").width(460);	

		} else if($.browser.safari)
		{
			$("#fsw-dialog").width("auto");					 
			$(".ui-dialog").width(465);	
		} 
		else {
			$("#fsw-dialog").width("auto");					 
			$(".ui-dialog").width(455);	
		}

		$("#fsw-MFTradableOnly").attr('checked', true);
		$("#fsw-optionOnly").hide();
		$("#fsw-symbolInput").hide();
		$("#fsw-fundFamily").show();
		$("#fsw-mutualFundOnly").show();  
		$("#fsw-searchHeader").text("Fund Family");
		$('#familyFundList option:nth(0)').attr("selected","selected");
		$("#fsw-search_button").click();
		$("#fsw-error").show();
		$(".fsw-error-msg").hide();
		$("#fsw-errMutualFund").show();
		$("#fsw-error-icon").attr("src", AkamaiURL+"/images/osi/find_symbol.gif");			
	} 				

	if ( fundType =="Options" )
	{
		$("#fsw-searchTerm").val('');
		$("#fsw-mutualFundOnly").hide();	 
		$("#fsw-optionOnly").show();
		$("#fsw-symbolInput").show();
		$("#fsw-fundFamily").hide();
		$("#fsw-searchHeader").text("Symbol");
		$("#fsw-dialog").width("auto");					 
		$(".ui-dialog").width(370);	
		$("#fsw-error").show();
		$(".fsw-error-msg").hide();
		$("#fsw-errOptions").show();		
		$("#fsw-error-icon").attr("src", AkamaiURL+"/images/osi/find_symbol.gif");
		if (hideAdjOption == '1') {  $("#fsw-addAdjusted").attr("disabled", true); 
			$("#fsw-adjustedIcon").attr("src", AkamaiURL+"/images/osi/i_adjopts_disabled.gif"); 
			$("#fsw-adjustedIcon").attr("title", "Adjusted options are available on the Options: Basic ticket only."); 
			$("#fsw-adjustedTxt").css("color", "gray"); 													  

		}   else { 						   
			$("#fsw-addAdjusted").attr("disabled", false); 
			$("#fsw-adjustedIcon").attr("src", AkamaiURL+"/images/osi/adj_options.gif"); 
			$("#fsw-adjustedIcon").attr("title", "Adjusted options"); 
			$("#fsw-adjustedTxt").css("color", "black"); 
		}


		fswGoEvent ();
		$("#fsw-searchTerm").focus();			
	} 				

}



function OptionStrikePriceGet(sym,m,d,y,app)
{

	if (app==null){app = 'fsw';} 

	var urlstring = document.URL;
	urlstring = urlstring.toLowerCase();
	var nWatchList = urlstring.indexOf("/pfm/", 0);

	if (app == 'wl') {
		var addAdjusted = ( document.getElementById('wl-addAdjusted').checked == false ) ? '0' : '1';
		var showAllStrikes = ( document.getElementById('wl-showAllStrikes').checked == false ) ? '0' : '1';
	}									
	else {
		var addAdjusted = ( document.getElementById('fsw-addAdjusted').checked == false ) ? '0' : '1';
		var showAllStrikes = ( document.getElementById('fsw-showAllStrikes').checked == false ) ? '0' : '1';
	}

	var url = "/e/t/invest/OptionStrikeGet";
	var queryparams = "?symbol="+sym.toUpperCase()
		+ '&' + 'month=' + m 
		+ "&" + "day=" + d 
		+ "&year=" + y
		+ "&addAdjusted=" + addAdjusted
		+ "&showAllStrikes=" + showAllStrikes;

	$.ajax({
type: "POST",
async: true,
dataType: "html",
cache: false,
url: url+queryparams,
success: optionAjaxSuccess,
error:  optionAjaxError,
complete: optionAjaxComplete
});


function optionAjaxSuccess (sResponseText, sStatusMsg)
{
	if (app == 'wl') {
		sResponseText = sResponseText.replace(/TYPE=\"radio\"/ig, "TYPE=\"checkbox\"");
		sResponseText = sResponseText.replace(/\'fsw\'/g, "\'wl\'");	
	}

	if ( $("#"+m+d+y+"_result_"+app).is(':visible'))
	{
		$("#"+m+d+y+"_result_"+app).html("").hide();
		if(typeof($('input[name=symbolRadio]:checked').val()) == "undefined"){
			fswButtonEnable(app);
		}
	}

	else {

		$("#"+m+d+y+"_result_"+app).html(sResponseText).show();									

	}

}

function optionAjaxError (oXHR, sStatusMsg){

	$("#fsw-result").html("Error occured during ajax request.  Server error info " + oXHR.status + " " + oXHR.statusText).show();

}				

function optionAjaxComplete(oXHR, sStatusMsg) {

	if (app == 'fsw') {					
		var rowCount = $('#fundTable tr').size();

		if (rowCount > 12) {	setHeightMax(); 	}
		else {		setHeightMin(); 		}
	}							



	if (app == 'wl') {					
		var rowCount = $('#wl-fundTable tr').size();

		if (rowCount > 8) {			$("#wl-option-area").height(242);		}
		else {		$("#wl-option-area").height("auto"); 	}
	}		

	//	$("#fundTable  tr  td ").css("background-color", "Orange");  

	var switchFlag = false;
	var index = 0;
	$(".options  tr  td").each(function(){

			if ((index % 3 ) == 0) { switchFlag = !switchFlag;}

			if (!switchFlag) {  $(this).css("background-color", "#F7F7F7");  }
			if (switchFlag) {  $(this).css("background-color", "#FFFFFF");  }			
			index = index+1;
			});



}
}



function fswTrim(stringToTrim) {
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}


function fswGoEvent (e){

	if (fswTrim($("#fsw-searchTerm").val()).length>0)
	{
		$("#fsw-search_button").attr("src", AkamaiURL+"/images/osi/button_go_a.gif");
	}
	else
	{
		$("#fsw-search_button").attr("src", AkamaiURL+"/images/osi/button_go_ia.gif");
	}
}

function watchFswReturnKey(e)
{

	var nkeycode = e.which ? e.which : e.keyCode;

	if (nkeycode == 13)
	{
		$("#fsw-search_button").click();
	}

}



function fswMFGoEvent ()

{

	if ($("#familyFundList").val() != "-^99999")
	{
		$("#fsw-search_button").attr("src", AkamaiURL+"/images/osi/button_go_a.gif");
	}
	else
	{
		$("#fsw-search_button").attr("src", AkamaiURL+"/images/osi/button_go_ia.gif");
	}

}


function fswUpDown(oThis)
{

	if (oThis.src.indexOf('expand.gif') != -1) {
		oThis.src=AkamaiURL+"/images/osi/collapse.gif";
	} else {
		oThis.src=AkamaiURL+"/images/osi/expand.gif";
	}
}


function fswButtonEnable(app)
{

	if (app == null)
	{app = 'fsw';}


	var bItemChecked;
	if(typeof($('input[name=symbolRadio]:checked').val()) == "undefined"){
		bItemChecked = false;
	} else { bItemChecked = true; }


	var urlstring = document.URL;
	urlstring = urlstring.toLowerCase();
	var nWatchList = urlstring.indexOf("/pfm/", 0);

	if ((app == 'wl') && (bItemChecked == false)) {
		$("#option_add").attr("src", AkamaiURL+"/images/osi/b_add_disab.gif");
		return;
	} 
	else  if  ((app == 'fsw') && (bItemChecked == false)) {
		document.getElementById('fswOptionExpGoButton').src =AkamaiURL+"/images/osi/b_ok_disabled.gif";
		$("#dialogFooter").html($('#dialogFooterHTML').html()).show();
		return;
	}


	if ((app == 'wl') && (bItemChecked == true)) {

		$("#option_add").attr("src", AkamaiURL+"/images/osi/b_add.gif");
		return; 
	}	else  if  ((app == 'fsw') && (bItemChecked == true)) {
		document.getElementById('fswOptionExpGoButton').src =AkamaiURL+"/images/osi/b_ok.gif";
		$("#dialogFooter").html($('#dialogFooterHTML').html()).show();
		return;
	}


}

function fswSleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}

//callback for options screener
function  fswOnLoaded() {}

$(document).ready(function () {
		$("#fsw-search_button").click(function(e){


			fundType= $('#fsw-search_type').val();
			var fswsearchTerm = $('#fsw-searchTerm').val();
			fswsearchTerm=fswsearchTerm.replace(/'/g,"");
			fswsearchTerm = fswTrim(fswsearchTerm);

			if ((fswsearchTerm == '') &&  ( fundType !="MutualFund" ))
			{ return; }

			if (($("#familyFundList").val() == "-^99999") &&  ( fundType =="MutualFund" ))
			{ return; }					


			var optionScreenerflag = false; 

			if(typeof isOptionScreener == 'function') { 

			optionScreenerflag = isOptionScreener();
			} 


			if (optionScreenerflag){
				var baseURLtype = "/e/t/optionanalytics/optionableSymbolLookup?search=";

				if (fswsearchTerm.toLowerCase() == "vix")
				{
					$("#fsw-result").hide();
					$('.dialogFooter').html("").hide();
					$("#fsw-error").show();
					$(".fsw-error-msg").hide();
					$("#fsw-vixError").show();
					$("#fsw-error-icon").attr("src", AkamaiURL+"/images/osi/warning_small.gif");
					setHeightMin();
					return;
				}

			} else{
				var baseURLtype = "/e/t/invest/FindSymbolStock?search=";
				if (location.pathname.indexOf("/e/t/rtaa/identification") > -1 ){
					baseURLtype = "/e/t/rtaa/FindSym?search="
				}
			}




			$("#fsw-search_type").attr('disabled', true);
			$("#fsw-searchTerm").css({'cursor': 'wait'});
			$("#fsw-search_button").css({'cursor': 'wait'});
			$("#fsw-dialog").css({'cursor': 'wait'});




			if (fundType =="Indexes" )
			{
				var url=  baseURLtype + encodeURIComponent(fswsearchTerm)+"&type_code=INDX";
			}


			if ( fundType =="Stocks" )
			{
				var url=  baseURLtype + encodeURIComponent(fswsearchTerm)+"&type_code=EQ";
				if(country !=undefined){
					url = url+"&country="+country;
				}
			}

			if ( fundType =="MutualFund" )
			{
				var url=  "/e/t/invest/GetFundFamily";
				fundList = false;

				if (document.getElementById('familyFundList'))
				{

					familyName = document.getElementById('familyFundList').value;
					if (familyName.indexOf('-') !=0)
					{
						var displayTradableOnly = ( document.getElementById('fsw-MFTradableOnly').checked == false ) ? '0' : '1';
						familyName = encodeURIComponent(familyName);		
						var url=  "/e/t/invest/GetFundList?FamilyDesc=" +familyName+"&displayTradableOnly="+displayTradableOnly;
						fundList = true;

					}
				} //End Fmaily Fund List Check		

			} 	//End Mutual Fund			 

			if ( fundType =="Options" )
			{
				var addAdjusted = ( document.getElementById('fsw-addAdjusted').checked == false ) ? '0' : '1';
				var url=  "/e/t/invest/OptionExpireDateGet?symbol="+ fswsearchTerm+"&addAdjustedFlag="+addAdjusted;
			}





			$.ajax({
url: url,
success: stockAjaxSuccess,
error:  stockAjaxError,
complete: stockAjaxComplete
});



});






function stockAjaxSuccess (sResponseText, sStatusMsg)
{



	if (( fundType =="MutualFund" ) && (!fundList))
	{								
		$("#fsw-fundFamily").html(sResponseText).show();
		$("#fsw-search_button").attr("src", AkamaiURL+"/images/osi/button_go_ia.gif");
	} 		

	else
	{ 
		$("#fsw-error").hide();

		if ((sResponseText.indexOf("0 Item Found")<0) && (sResponseText.indexOf("No options found")<0))
		{
			$("#fsw-dialog").css({'padding-right': '0px'});
			$("#fsw-result").html(sResponseText).show();
			if($.browser.msie)
				$("#fundTable").width("95%");
		} else {
			$("#fsw-result").hide();
			$('.dialogFooter').html("").hide();
			$("#fsw-error").show();
			$(".fsw-error-msg").hide();
			$("#fsw-notFound").show();
			$("#fsw-error-icon").attr("src", AkamaiURL+"/images/osi/warning_small.gif");
			setHeightMin();
		}

		$("#fsw-search_button").attr("src", AkamaiURL+"/images/osi/button_go_a.gif");								
	}

	$("#fsw-searchTerm").css({'cursor': 'default'});					
	$("#fsw-search_button").css({'cursor': 'default'});
	$("#fsw-dialog").css({'cursor': 'default'});


	var switchFlag = false;
	var index = 0;

	$("#fundTable  tr  td").each(function(){

			if ((index % 3 ) == 0) { switchFlag = !switchFlag;}

			if (!switchFlag) {  $(this).css("background-color", "#F7F7F7");  }

			index = index+1;

			});
    fswOnLoaded();

}

function stockAjaxError (oXHR, sStatusMsg){

	$("#fsw-result").hide();
	$('.dialogFooter').html("").hide();
	$("#fsw-error").show();
	$(".fsw-error-msg").hide();
	$("#fsw-ajaxError").show();
	$("#fsw-error-icon").attr("src", AkamaiURL+"/images/osi/warning_small.gif");
	setHeightMin();
	// $("#fsw-result").html("Error occured during ajax request.  Server error info " + oXHR.status + " " + oXHR.statusText).show();

}				

function stockAjaxComplete(oXHR, sStatusMsg) {

	$("#fsw-search_type").attr('disabled', false);
	if ( $('#fsw-strikeRow1').length ) {
		$("#fsw-strikeRow1").click();
	}


}



});


