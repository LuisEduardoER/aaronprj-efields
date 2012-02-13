
trefis_js = function() {}
trefis_js.prototype.trefisPopup = function(self, issueID){
	var popupURL 	= $(self).attr("data-iframeurl");
	var symbol		= issueID?issueID:$(self).attr("data-symbol");

	var oModelPopup = {
		body: '../../news2/commentary/trefisWsodIframe.asp?popupUrl='+popupURL+'&IssueID='+symbol,
		title:'TREFIS PRICE ANALYSIS'
	};
	common.overlayPopup({body: oModelPopup.body,title:oModelPopup.title });
}

trefis_js.prototype.snapshotModule = function(issueID){
	$('#trefisModule a.modelOverlayPopup').bind("click", function() {
		
		trefis.trefisPopup(this, issueID);
		//usage Reporting
		var whatWasClicked = $(this).html();
		var page = 'Snapshot Page';
		var note = '';
		if(whatWasClicked.indexOf('img') === -1){
			note = "View Model Link Clicked";
		}else{
			note = "Sankey Clicked";
		}
		common.usageReporting(note, page);
	});
	
	var title = 'LATEST UPDATE';
	$('#trefisModule a.luOverlayPopup').bind("click", function() {
		var popupURL = $(this).attr("data-iframeURL");
		common.overlayPopup({body: popupURL,title: title});
	});
}
trefis_js.prototype.chartModule = function(issueID){
	$('#trefisChartModule a.modelOverlayPopup').bind("click", function() {
		trefis.trefisPopup(this, issueID);
		
		//usage reporting
		var page = 'Chart Page';
		var note = 'View model clicked';
		common.usageReporting(note, page);
		
	});

	$('#showTrefis').bind("click", function() {
		if($(this).is("input:checked")){
			$('#trefisChartModule div.trefisChartModuleBottom').toggleClass('trefisHidden');
			//usage reporting
			var page = 'Charts Page';
			var note = 'Show Trefis Price Forecast checked';
			common.usageReporting(note, page);
			common.saveToSession('preferences','TrefisChartCheckbox','checked');
		}else{
			$('#trefisChartModule div.trefisChartModuleBottom').toggleClass('trefisHidden');
			common.saveToSession('preferences','TrefisChartCheckbox','unchecked');
		}
		window.setTimeout('location.reload(true)', 1000);
	});	
}
trefis_js.prototype.cotdModule = function(){
	var modelTitle = 'TREFIS PRICE ANALYSIS';
	$('#trefisCOTDMod a.modelOverlayPopup').bind("click", function() {
		trefis.trefisPopup(this);
		//usage Reporting
		var whatWasClicked = $(this).html();
		var page = 'Stock Ideas page';
		var note = '';
		if(whatWasClicked.indexOf('img') === -1){
			note = "View and Edit Analysis Link Clicked";
		}else{
			note = "Sankey Clicked";
		}
		common.usageReporting(note, page);
	});
	$('#trefisCOTDMod a.modelOverlayPopup').bind("mouseover", function(){
		var mouseoverURL = $(this).attr("data-mouseover");
		$(this).find('img').attr('src', mouseoverURL);
	})
	$('#trefisCOTDMod a.modelOverlayPopup').bind("mouseout", function(){
		var mouseoutURL = $(this).attr("data-mouseout");
		$(this).find('img').attr('src', mouseoutURL);
	})
	var luTitle = 'LATEST UPDATE';
	$('#trefisCOTDMod a.luOverlayPopup').bind("click", function() {
		var popupURL = $(this).attr("data-iframeURL");
		common.overlayPopup({body: popupURL,title: luTitle});
	});

	$('#trefisModNav .hand').bind("click", function() {
		overviewIdeas.updateNextTrefis(this);
	});
	
	var id = parseInt($('#trefisModNav .active a').html());
	switch(id){
		case 1:
			$('#trefisModNav td.moduleNavControls').find('span.leftModArrow').addClass('hidden');
			$("#trefisModNav td[data-label="+(id+3)+"]").addClass("hidden");
			$("#trefisModNav td[data-label="+(id+4)+"]").addClass("hidden");
		break;
		case 2:
			$("#trefisModNav td[data-label="+(id+2)+"]").addClass("hidden");
			$("#trefisModNav td[data-label="+(id+3)+"]").addClass("hidden");
		break;
		case 3:
			$("#trefisModNav td[data-label="+(id+1)+"]").addClass("hidden");
			$("#trefisModNav td[data-label="+(id+2)+"]").addClass("hidden");
		break;
		case 4:
			$("#trefisModNav td[data-label="+(id-3)+"]").addClass("hidden");
			$("#trefisModNav td[data-label="+(id+1)+"]").addClass("hidden");
		break;
		case 5:
			$('#trefisModNav td.moduleNavControls').find('span.rightModArrow').addClass('hidden')
			$("#trefisModNav td[data-label="+(id-4)+"]").addClass("hidden");
			$("#trefisModNav td[data-label="+(id-3)+"]").addClass("hidden")
		break;
	}
}
trefis_js.prototype.trefisStory = function(page) {
	//usage Reporting
	var page = page;
	var note = "Trefis Story Clicked";
	common.usageReporting(note, page); 
	
	window.open("https://www.trefis.com/trefis-story", "_blank", "width=650,height=600,scrollbars=1"); 
}

//resize
if (!$.browser.msie || $.browser.version != 7.0) {//dont dynamically resize for IE7
	$(window).resize(function() {
		if($('#overlayPopup').length > 0){
			window.setTimeout(function(){
				common.resizeOverlayPopup();
			}, 1000);
		}
	});
}


