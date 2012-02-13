// Figure out what browser is being used
chart.prototype.browser = function(){
	return common.browser();
}

chart.prototype.browserIsIE = function() {
	var browserDetails = chart.browser();
	return browserDetails.msie;
}

chart.prototype.showLoadingIndicator = function(){
	var load = Element.get('loading_cht');
	if(load){
		Element.remove(load);
	}
	common.showLoading('cht',0,0); //div, has rounded corners, gif position
}

chart.prototype.changeSize = function(sz) {
	this.activateUpperSettingsControls();
	if (!sz) { sz = "sm"; }
	//document.location.href = 'charts.asp?chartsize='+sz;
	this.chartsize = sz;
	this.load();
}

// change duration
chart.prototype.chgDuration = function(duration) {
	this.activateUpperSettingsControls();
	if (duration == 10000) {
	} else {
		this.dMin = 0;
		this.dMax = 0;
		this.hasCustom = 0;
		this.lastduration = duration;
		this.dMenu = Element.get("cht_10000");
		this.dMenu.className = "href hand";
		this.dMenu.style.color = '039';
	}
	if (!duration) {duration = this.duration;}

	this.updateDurationMenu(duration);
	this.showCustom(duration);
	
	/*
	this.News = Element.get("News");
	if (this.News) {
		if (duration > 60) {
			this.News.disabled = true;
		} else {
			this.News.disabled = false;
		}
	}
	*/
	
	if (duration == 10000) {
	} else {
		this.duration = duration;
		if (this.isHistorical) {
			this.updateHistoricalFrequency(duration);
		} else {
			this.updateFrequency(duration);
		}
		this.load();
	}
}

// Update duration Buttons
chart.prototype.updateDurationMenu = function(duration){

	if (Element.get("custom").style.display == 'block'  || this.hasCustom == 0) {
		if (this.hasCustom == 0) {
			this.dMenu = Element.get("cht_10000");
			this.dMenu.className = "href hand";
			this.dMenu.style.color = '039';
		}
	}
	
	if (duration != 10000) {
		this.dMenu = Element.get("cht_"+this.duration);
		this.dMenu.className = "href hand";
		this.dMenu.style.color = '039';
		this.dMenu.innerHTML = this.durations[this.duration].label;
	}
	
	if (duration != 10000 || Element.get("custom").style.display == 'none') {
		this.dMenu = Element.get("cht_"+duration);
		this.dMenu.className = "href hand on";
		this.dMenu.style.color = 'fff';
	}
	
	if (this.isPublic == 1) {
		chart.showPublicZoom(0);
	}	
}

// show public zoom out
chart.prototype.showPublicZoom = function(view){
	this.tearoff = Element.get("tearoff");
	if (this.isPublic == 1) {
		if (view == 1) {
			this.tearoff.innerHTML = '<div style="text-decoration:underline;" class="normal txt11 href hand" onclick="chart.chgDuration();">Zoom Out</div>';
		} else {
			this.tearoff.innerHTML = '';
		}
	}
}


// update comparison menu
chart.prototype.updateCompareMenu = function(){
	this.compareMenu = Element.get("compareMenu");
	if (!this.compareMenu) {
		return false;
	}
	var content = [];
	this.resizeMe = 1;
	if (this.compareMenu.style.display == 'none') {

		var m = 0;var mIsSet = 0;
		for (var i in this.meunindices) {
			var label = this.meunindices[i].label;
			var pSymbol = this.meunindices[i].symbol;
			
			if (m > 2 && mIsSet == 0) {
				content.push('<div class="dotsT" style="height:16px;color:#000;padding:4px 0 2px 7px;cursor:default;">Industry Peers</div>');
				mIsSet = 1;
			}			
			
			if (m > 2) {
				content.push('<div style="height:21px;color:#000;padding-left:3px;" id="div_'+i+'"><span title="'+this.meunindices[i].fName+' ('+this.meunindices[i].dSymbol+')" class="normal" onclick="addCheckbox(\''+i+'\',\'compare\',\''+label+'\');"><span class="checkBorder" '+this.checkUpperColor(i)+'><input type="checkbox" id="'+i+'" '+this.checkUpper(i)+'></span>&nbsp;'+label+'</span></div>');
			} else {
				content.push('<div style="height:21px;color:#000;padding-left:3px;" id="div_'+i+'"><span class="normal" onclick="addCheckbox(\''+i+'\',\'compare\',\''+label+'\');"><span class="checkBorder" '+this.checkUpperColor(i)+'><input type="checkbox" id="'+i+'" '+this.checkUpper(i)+'></span>&nbsp;'+label+'</span></div>');
			}

			m++;
		}
		
		content.push('<div class="dotsT" style="height:1px;line-height:1px;padding:0px;cursor:default;">&nbsp;</div>');
		
		// first add option handling
		if (chart.isOption) {
			
			//the first in this array is the option's Bridge symbol needed for the data request
			//the second in this array is the DISPLAY symbol to show as the indicator label
			var params = [chart.optionSymbol,chart.optionDisplaySymbol.toUpperCase()].join(",");
			
			content.push('<table style="margin-left:4px;margin-bottom:4px;padding:0px;height:30px;"><tr><td><img src="https://images.etrade.wallst.com/v1/images/info.gif" /></td><td><span class="href hand" onclick="chart.addLower({id:\'onesymbol\'},{params:\''+params+'\'});"> Add option <b>'+unescape(chart.optionDisplaySymbol.toUpperCase())+'</b><br><span class="txt10 lh10">as lower indicator</span></span></td></tr></table>');

			content.push('<div class="dotsT" style="height:1px;line-height:1px;padding:0px;cursor:default;">&nbsp;</div>');
		}

		content.push(
		'<div class="subitem2" id="compare" onmouseover="showSubItem(this,1,0,170);hl(this,1,2);" onmouseout="showSubItem(this,0,0,170);hl(this,0,2);">More Comparisons</div>',
		'<table style="margin-left:2px;padding:0px;">',
			'<tr><td class="right"><input id="symbolsC" class="grey9 txt10" onsubmit="chart.addUpperSymbols(); return false;" onfocus="this.value=\'\';this.style.color=\'#000\'" type="text" maxlength="16" value="Add Symbol" style="margin-left:4px;width:80px;" /></td><td align="middle"><input type="image" src="../../images/charts/addcompare.gif" onclick="chart.addUpperSymbols(); return false;"></td></tr>',
		'</table>');
	
		this.compareMenu.style.display = 'block';

		Element.get("compareTab").className = "menuitemHL";
		if (mIsSet) {
			this.compareMenu.style.height = m * 27 + 50 + 'px';
		} else {
			this.compareMenu.style.height = m * 27 + 38 + 'px';
		}
		
		if (chart.isOption) {
			this.compareMenu.style.height = parseInt(this.compareMenu.style.height) + 38 + 'px';
		}
		
		this.compareMenu.innerHTML = content.join("");
	} else {
		this.compareMenu.style.display = 'none';
		Element.get("compareTab").className = "menuitem";
	}
}


// update LOWER comparison menu
chart.prototype.updateCompareLowMenu = function() {

	this.compareLowMenu = Element.get("compareLowMenu");

	var content = [];
	this.resizeMe = 1;

	if (this.compareLowMenu.style.display == 'none') {

		content.push('<div style="height:5px;line-height:5px;padding:0px;">&nbsp;</div>');
		
		// Add Lower Compare
		
		content.push('<form name="aLS" style="display:inline;" action="javascript:void(0);" onsubmit="chart.addLowerSymbol();">');
		content.push('<table style="margin-left:2px;padding:0px;"><tr>');
			content.push('<td class="right"><input id="symbolsLC" class="grey9 txt10" onsubmit="chart.addLowerSymbol(); return false;" onfocus="this.value=\'\';this.style.color=\'#000\'" type="text" maxlength="16" value="Add Symbol" style="margin-left:4px;width:80px;" /></td>');
			content.push('<td align="middle"><input type="image" src="../../images/charts/addcompare.gif" onclick="chart.addLowerSymbol(); return false;"></td>');
		content.push('</tr></table>');
		content.push('</form>');

		content.push('<div style="height:3px;line-height:3px;padding:0px;">&nbsp;</div>');

		// Add Lower Relative
		
		content.push('<form name="aLCS" style="display:inline;" action="javascript:void(0);" onsubmit="chart.addLowerCompareSymbol();">');
		content.push('<table style="margin-left:2px;padding:0px;"><tr>');
			content.push('<td class="right"><strong style="width:40px;margin-left:4px;">'+chart.display_symbol+' / </strong><input id="symbolsLCS" class="grey9 txt10" onsubmit="chart.addLowerCompareSymbol(); return false;" onfocus="this.value=\'\';this.style.color=\'#000\'" type="text" maxlength="16" value="Symbol" style="margin-left:4px;width:40px;" /></td>');
			content.push('<td align="middle"><input type="image" src="../../images/charts/addcompare.gif" onclick="chart.addLowerCompareSymbol(); return false;"></td>');
		content.push('</tr></table>');
		content.push('</form>');

		

		this.compareLowMenu.style.display = 'block';
		this.compareLowMenu.style.height = 76 + 'px';

		Element.get("compareLowTab").className = "menuitemHL";

		this.compareLowMenu.innerHTML = content.join("");
		
	} else {
		this.compareLowMenu.style.display = 'none';
		Element.get("compareLowTab").className = "menuitem";
	}
}

// check if upper selected
chart.prototype.checkUpper = function(value){
	var len = this.upperManager.length;

	for (var i=0;i<len;i++) {
		if (this.upperManager[i].value == value) {
			if (chart.browserIsIE()) {
				return ' style="border:1px solid #'+this.upperManager[i].color+';" checked="checked"';
			} else {
				return ' checked="checked"';
			}
		}
	}
	return '';
}

// check if upper selected
chart.prototype.checkUpperColor = function(value){
	var len = this.upperManager.length;

	for (var i=0;i<len;i++) {
		if (this.upperManager[i].value == value) {
			if (chart.browserIsIE()) {
				return '';
			} else {
				return ' style="border:1px solid #'+this.upperManager[i].color+';"';
			}
		}
	}
	return '';
}

// update comparison menu
chart.prototype.updateEventsMenu = function(){
	this.eventsMenu = Element.get("eventsMenu");
	var content = [];
	this.resizeMe = 1;
	if (this.eventsMenu.style.display == 'none') {

		content.push('<div style="height:21px;color:#000;"><div onclick="addCheckbox(\'splits\',\'event\',\'Splits\');"><span class="checkBorder" '+this.checkUpperColor('splits')+'><input type="checkbox" id="splits" '+this.checkUpper('splits')+' /></span>&nbsp;Splits</div></div>');
		content.push('<div style="height:21px;color:#000;"><div onclick="addCheckbox(\'dividends\',\'event\',\'Dividends\');"><span class="checkBorder" '+this.checkUpperColor('dividends')+'><input type="checkbox" id="dividends" '+this.checkUpper('dividends')+'></span>&nbsp;Dividends</div></div>');

		if (this.isMutualFund != 1) {
			content.push('<div style="height:21px;color:#000;"><div onclick="addCheckbox(\'earnings\',\'event\',\'Earnings (QTR)\');"><span class="checkBorder" '+this.checkUpperColor('earnings')+'><input type="checkbox" id="earnings" '+this.checkUpper('earnings')+'></span>&nbsp;Earnings (QTR)</div></div>');
			content.push('<div style="height:21px;color:#000;"><div onclick="addCheckbox(\'earningsbar\',\'event\',\'Earnings Trend Bar (QTR)\');"><span class="checkBorder" '+this.checkUpperColor('earningsbar')+'><input type="checkbox" id="earningsbar" '+this.checkUpper('earningsbar')+'></span>&nbsp;Earnings Trend Bar</div></div>');
			content.push('<div style="height:21px;color:#000;"><div onclick="addCheckbox(\'insider\',\'event\',\'Insider Trades\');"><span class="checkBorder" '+this.checkUpperColor('insider')+'><input type="checkbox" id="insider" '+this.checkUpper('insider')+'></span>&nbsp;Insider Trades</div></div>');
		}

		this.eventsMenu.style.display = 'block';

		Element.get("eventsTab").className = "menuitemHL";
		this.eventsMenu.style.height = '110px';
		this.eventsMenu.innerHTML = content.join("");
	} else {
		this.eventsMenu.style.display = 'none';
		Element.get("eventsTab").className = "menuitem";
	}
}

// Updates Frequency Menu Options
chart.prototype.updateFrequency = function(fromwhere) {	
	this.frequencyMenu = Element.get("frequencyMenu");
	var content = [];
	this.resizeMe = 1;

	if ((this.frequencyMenu.style.display == 'none' && fromwhere == 'menu') || (this.frequencyMenu.style.display == 'block' && fromwhere != 'menu')) {

		if (this.duration == 10950) {
			this.freqOptions = [this.frequency];
		} else {
			this.freqOptions = this.durations[this.duration].options;
			this.freqOptions = this.freqOptions.split(",");
			//this.frequency = this.durations[this.duration].interval; // if previous default not avail, use data default
			this.frequency = this.getFrequency();
		}

		content.push('<ul id="freqlist">');
		for (var f = 0; f < this.freqOptions.length; f++) {
			var chk = '';
			if (this.freqOptions[f] == this.frequency) {
				chk = ' checked="checked"';
			}
			content.push(
				'<li>',
					'<div onclick="chart.changeFrequency(\'', this.freqOptions[f], '\');Element.get(\'', this.freqOptions[f], '\').checked = true;">',
						'<input type="radio" name="freq" id="', this.freqOptions[f], '"', chk, ' />',
						this.frequencies[this.freqOptions[f]],
					'</div>',
				'</li>'
			);
		}
		content.push('</ul>');

		var freqTab = Element.get("frequencyTab");

		this.frequencyMenu.style.display = 'block';
		if (freqTab) { freqTab.className = "menuitemHL"; }
		this.frequencyMenu.style.height = f * 27 + 'px';
		this.frequencyMenu.innerHTML = content.join("");
	} else {
		this.frequency = this.durations[this.duration].interval;
		Element.get("frequencyTab").className = "menuitem";
		this.frequency = this.getFrequency(fromwhere); // set frequency
		this.frequencyMenu.style.display = 'none';
	}
}

chart.prototype.getFrequency = function(fromwhere) {
	
	//check if user-selected frequency matches allowed frequency for selected duration
	//if match found, return user-selected frequency
	//if no match found, return interval default for user-selected duration
	
	//assumes this.duration exists!
	
	if ((this.frequencyMenu.style.display == 'block' && fromwhere != 'menu')) {
		if (this.duration==1) {
			this.frequency = this.durations[1].interval;
		}
	}
	
	var options = this.durations[this.duration].options.split(",");
	var hasMatch = 0;
	
	for (var f=0; f<options.length; f++) {
		if (this.frequency == options[f]) {
			hasMatch = 1;
			break;
		}
	}
	
	
	if (hasMatch) {
		return this.frequency;
	} else {
		return this.durations[this.duration].interval;
	}	
}

// update display menu
chart.prototype.updateDisplayMenu = function(){
	this.displayMenu = Element.get("displayMenu");
	var content = [];
	this.resizeMe = 1;
	if (this.displayMenu.style.display == 'none') {
		content.push('<ul id="displist">');
		var d = 0;
		for (var i in this.displays) {
		
			if (i == this.display) {
				var chk = ' checked=true';
			} else { chk = ''; }
			d++;
			
			content.push('<li><div onclick="chart.changeDisplay(\''+i+'\');Element.get(\''+i+'\').checked = true;"><input type="radio" name="dispgroup" id="'+i+'" '+chk+' />'+this.displays[i].label+'</div></li>');
		}
		content.push('</ul>');

		this.displayMenu.style.display = 'block';
		Element.get("displayTab").className = "menuitemHL";
		this.displayMenu.style.height = d * 27 + 'px';
		this.displayMenu.innerHTML = content.join("");
	} else {
		this.displayMenu.style.display = 'none';
		Element.get("displayTab").className = "menuitem";
	}
}

// update scale menu
chart.prototype.updateScaleMenu = function(){
	this.scaleMenu = Element.get("scaleMenu");
	var content = [];
	this.resizeMe = 1;
	if (this.scaleMenu.style.display == 'none') {
		content.push('<ul id="scalelist">');

		if (this.scaling == 'linear') {var chk = ' checked=true';} else { chk = ''; }

		content.push('<li><div onclick="chart.changeScale(\'linear\');Element.get(\'linear\').checked = true;"><input type="radio" name="scale" id="linear" '+chk+' />Linear</div></li>');
			
		if (this.scaling == 'log') {var chk = ' checked=true';} else { chk = ''; }
			
		content.push('<li><div onclick="chart.changeScale(\'log\');Element.get(\'log\').checked = true;"><input type="radio" name="scale" id="log" '+chk+' />Logarithmic</div></li>');
		content.push('</ul>');

		this.scaleMenu.style.display = 'block';
		Element.get("scaleTab").className = "menuitemHL";
		this.scaleMenu.style.height = '56px';
		this.scaleMenu.innerHTML = content.join("");
	} else {
		this.scaleMenu.style.display = 'none';
		Element.get("scaleTab").className = "menuitem";
	}
}


// Change Chart Display Style
chart.prototype.changeDisplay = function(who) {
	this.activateUpperSettingsControls();
	if (who && who.id) {
		this.display = who.id;
	} else {
		this.display = who;
	}	
	this.load();
}
// Change Chart Frequency
chart.prototype.changeFrequency = function(who) {
this.activateUpperSettingsControls();
	if (who && who.id) {
		this.frequency = who.id;
	} else {
		this.frequency = who;
	}
	this.load();
}
// Change Chart Scaling Type
chart.prototype.changeScale = function(who) {
this.activateUpperSettingsControls();
	this.scaling = who;//who.id;
	this.load();
}
// Save Current Settings
chart.prototype.SaveSetting = function(who) {
	var savedSettingName = document.getElementById('aSavedSetting').value + '';

	var isDefaultSetting = document.getElementById('aIsDefaultSetting');
	
	var setDefault = '';
	if (isDefaultSetting.checked) {
		setDefault = "&default_chart=" + escape(savedSettingName);
	}

	if (savedSettingName && savedSettingName.length > 2 && savedSettingName.indexOf("undefined") == -1) {
		document.location.href = "?action=save&action_value=" + escape(savedSettingName) + setDefault;
	} else {
		alert("Please enter a name with at least 3 characters");
	}
}  

chart.prototype.gotoSetting = function(who, type) {	
	var urlAppend = "";
	if (this.cType == "tearoff") {
		urlAppend = "&width=" + this.width + "&height=" + this.height + "";
	}

	if (type == 'save') {
		location.href = '?action=save&action_value=' + who + urlAppend;
	} else if (type == 'delete') {
		location.href = '?action=delete&action_value=' + who + urlAppend;
	} else if (type == 'removedefault') {
		location.href = '?action=removedefault&action_value=' + who + urlAppend;
	} else if (type == 'setdefault') {
		location.href = '?action=loadsetting&default_chart=' + who + urlAppend + '&action_value=' + who + urlAppend ;
	} else {
		location.href = '?action=loadsetting&action_value=' + who + urlAppend;
	}
}
chart.prototype.showSettingsWin = function(who) {
	if (who) {
		if (who == 1) {
			//position save settings window near save settings button
			var pos = Element.getXY('settings'); //Your Saved Settings button container
			this.subuppermenu.style.left = (pos.x + 150) + 'px';
			this.subuppermenu.style.top = pos.y + 'px';
		} else {
			//this is for an alternate view of the box for the upper saved settings div.
			var pos = Element.getXY('newSettingsLink'); //Your Saved Settings button container
			this.subuppermenu.style.left = (pos.x) + 'px';
			this.subuppermenu.style.top = (pos.y + 50) + 'px';
		}
		//this.subuppermenu.style.left = 350 + 'px';
		//this.subuppermenu.style.top = 500 + 'px';
		this.subuppermenu.style.display = 'block';
		this.subuppermenu.innerHTML = Element.get('saveSettingsWin').innerHTML;
		if (Element.get('aSavedSetting')) {
			Element.get('aSavedSetting').focus();
		}
	} else {
		this.subuppermenu.style.display = 'none';
	}
}


//this is the functionality for the close box on the window for saved settings at the top of the interactive chart div.
chart.prototype.closeUpperSettingsWindow = function() {
	//get the div
	var div = Element.get('savedSettingsMenu');
	//set the style to remove layout.
	div.style["display"] = "none";

	/*
	var tearoff = Element.get('tearoff');
	tearoffPos = tearoff.style["top"];
	console.log(tearoffPos);
	*/
}

chart.prototype.activateUpperSettingsControls = function() {
	var saveUpperSettings = Element.get("saveUpperSettings");
	var newSettingsLink = Element.get("newSettingsLink");

	if (saveUpperSettings) {

		var saveUpperSettingsClasses = saveUpperSettings.className;
		var newSettingsLinkClasses = newSettingsLink.className;

		if (saveUpperSettingsClasses.indexOf("active") == -1) {
			saveUpperSettings.className = saveUpperSettingsClasses + ' active';
			newSettingsLink.className = newSettingsLinkClasses + ' active';
		}
	}

}

// Validates and Adds user entered symbols
chart.prototype.addUpperSymbols = function() {
	var val = Element.get('symbolsC').value + '';
		val = val.toUpperCase();
	var currSymbol = unescape(this.symbol).toUpperCase();
	if (currSymbol.indexOf(";") > -1){
		currSymbol = currSymbol.replace("US;","");
	}
	if (val && val != currSymbol) {
		var symQS = "validateChartSym.asp?symbols="+val+"&s="+currSymbol+'&type=upper';
		symbolGen.document.location.replace(symQS);
	} else {
		alert('Please enter a unique symbol');
	}
}

chart.prototype.addLowerSymbol = function() {
	var val = document.getElementById('symbolsLC').value + '';
		val = val.toUpperCase();
	if (val) {
		var symQS = "validateChartSym.asp?symbols="+val+'&type=lower';
		symbolGen.document.location.replace(symQS);
	}
}
chart.prototype.addLowerCompareSymbol = function() {
	var val = document.getElementById('symbolsLCS').value + '';
		val = val.toUpperCase();
	if (val) {
		var symQS = "validateChartSym.asp?symbols="+val+'&type=lowerC';
		symbolGen.document.location.replace(symQS);
	}
}

// Add Upper Indicator
chart.prototype.addUpper = function(who, type, options, ischeck) {

	this.activateUpperSettingsControls();

	if (who && who.id) {
	} else {
		who = Element.get(who);
	}

	// set limit
	if (this.upperManager.length > this.upperLimit) {
		try {
			document.getElementById("u" + this.upperManager[this.upperLimit].key).style.display = "none"; // removes over limit
		} catch (err) { }
		this.limit = this.upperLimit;
	} else {
		this.limit = this.upperManager.length;
	}

	// check for dups
	if (type == 'compare' || type == 'event') {
		for (var i = this.limit; i > 0; i--) {
			var label = this.upperManager[(i - 1)].label;
			if (label == who.innerHTML) {
				return false;
			}
		}
	}

	if (who.id != "News") {
		this.upperOptionsMenu.className = "fLeft uOptionsMenu";
	}

	// moves upper indicators around, and enforces limit
	for (var i = this.limit; i > 0; i--) {
		this.upperManager[i] = { value: this.upperManager[(i - 1)].value, color: this.upperManager[(i - 1)].color, label: this.upperManager[(i - 1)].label, type: this.upperManager[(i - 1)].type, key: this.upperManager[(i - 1)].key, params: this.upperManager[(i - 1)].params }
	}

	//specific colors for events, otherwise use color bucket
	if ("event" == type) {
		var iColor = this._getEventColor(who.id);
	} else {
		var iColor = this.selectUpperColor();
	}

	var iKey = parseInt(Math.random() * 1000000); // random key used for ID

	this.exportData = 1;
	if (type == 'compare' || type == 'event') {
		var label = who.innerHTML;
		if (!label) {
			label = options;
		}

		if (ischeck && who.id != "News") {
			if (chart.browserIsIE()) {
				who.style.border = "1px solid #" + iColor + "";
			} else {
				var borderSpan = who.parentNode;
				borderSpan.style.border = "1px solid #" + iColor + ""; //add border to span around checkbox, not checkbox itself
			}
		}

		this.upperManager[0] = { value: who.id, color: iColor, label: label, type: type, key: iKey, params: "" }

		if (who.id == "News") {
			this.addUpperOptions("News");
		} else {
			this.addUpperOptions(type);
		}

	} else {
		var u = this.upper[who.id];
		var label = u.label;
		this.upperManager[0] = { value: who.id, color: iColor, label: label, type: type, key: iKey, params: u.params }
		this.addUpperOptions();
	}
	this.load();
}

chart.prototype.addUpperOptions = function(type) {	
	var u = this.upperManager[0];
	var params = this.upperManager[0].params;
	if (params) {
		var label = this.upperManager[0].label + ' (' + params + ')';
	} else {
		var label = this.upperManager[0].label;
	}

	var content = [];
	if (type == "News") { // so the News option doesn't appear up top
		content.push('<div id="u' + this.upperManager[0].key + '" class="fLeft" style="width:0px;height:0px;display:none;"></div>');
	} else {
		content.push('<div id="u' + this.upperManager[0].key + '" class="fLeft upperOption" onclick="showUpperItem(this,1);">');
		content.push('<table cellpadding="0" cellspacing="0"><tr><td class="upperOptionLeft">&nbsp;</td><td class="upperOptionMiddle" style="color:#' + this.upperManager[0].color + ';">' + label + '</td><td class="upperOptionClose"><div class="upperOptionClose hand" onclick="chart.removeUpper(\'' + u.value + '\',\'' + u.key + '\');">&nbsp;</div></td><td class="upperOptionRight">&nbsp;</td></tr></table>');
		content.push('</div>');
	}

	this.upperOptionsMenu.innerHTML = content.join("") + this.upperOptionsMenu.innerHTML;
}


//action to take when the "other popular periods" choices are clicked.
chart.prototype.updateMovingAveragePeriod = function(value, id, paramsLength, inputKey) {

	var inputField = document.getElementById(inputKey);
	inputField.value = value;
	this.updateUpper(id, paramsLength);
}


// Updates the Upper Indicator
chart.prototype.updateUpper = function(upperIndex, numParams) {
	// get props
	var label = this.upperManager[upperIndex].label;
	var key = this.upperManager[upperIndex].key;

	// get all params
	var params = [];
	for (var i = 0; i < numParams; i++) {
		var value = document.getElementById("i" + key + "_" + i);

		if (value) {
			value = value.value;
		} else {
			return null; //no input control found
		}

		if (label.indexOf("Envelope") > -1 && i == 0) { // basic upper error checking
			value = value.toUpperCase();
			if (value == 'EMA' || value == 'SMA' || value == 'WMA') {
			} else {
				alert("Value must be either SMA, EMA, or WMA");
				return null;
			}
		} else {
			value = parseFloat(value);
			if (value < 0 || value > 1000 || isNaN(value)) {
				alert("Value must be within acceptable range");
				return null;
			}
		}
		params.push(value);
	}
	
	var tmpParams = params.join(",");
	var u = this.upperManager[upperIndex];
	this.upperManager[upperIndex].params = tmpParams;

	if (tmpParams) {
		label += ' (' + tmpParams + ')';
	}

	document.getElementById("u" + key).innerHTML = '<table cellpadding="0" cellspacing="0"><tr><td class="upperOptionLeft">&nbsp;</td><td class="upperOptionMiddle" style="color:#' + u.color + ';">' + label + '</td><td class="upperOptionClose"><div class="upperOptionClose hand" onclick="chart.removeUpper(\'' + u.value + '\',\'' + u.key + '\');">&nbsp;</div></td><td class="upperOptionRight">&nbsp;</td></tr></table>';

	this.exportData = 1;
	this.subuppermenu.innerHTML = '';
	this.subuppermenu.style.display = 'none';
	this.closeUpperItem();
	this.load();
}

// Removes an Uppper Indicator
chart.prototype.removeUpper = function(value, key) {
	// Handles removing from manager w/standard js
	var len = this.upperManager.length;


	// for the checkboxes
	try {
		this.activateUpperSettingsControls();
		if (Element.get(value).checked) {
			if (value != "News") {

				if (chart.browserIsIE()) {
					Element.get(value).style.border = "1px solid #fff";
				} else {
					var borderSpan = Element.get(value).parentNode;
					borderSpan.style.border = "1px solid #fff";
				}

			}
			Element.get(value).checked = false;
		}
	} catch (e) { }

	// When only 1 force clean
	if (len == 1) {
		this.upperOptionsMenu.className = "fLeft uOptionsMenu collapse";
		this.upperOptionsMenu.innerHTML = '&nbsp;';
		this.upperManager = [];
	} else {
		var tempArray = [];
		var count = 0;

		for (var i = 0; i < len; i++) {
			if (this.upperManager[i].key == key) {
				var count = parseInt(i);
				break;
			} else {
				tempArray[i] = { value: this.upperManager[i].value, color: this.upperManager[i].color, type: this.upperManager[i].type, label: this.upperManager[i].label, key: this.upperManager[i].key, params: this.upperManager[i].params }
			}
		}

		for (var c = count; c < (len - 1); c++) {
			var x = parseInt(c) + 1;
			tempArray[c] = { value: this.upperManager[x].value, color: this.upperManager[x].color, type: this.upperManager[x].type, label: this.upperManager[x].label, key: this.upperManager[x].key, params: this.upperManager[x].params }
		}
		// replace upperManager Array
		this.upperManager = tempArray;

		// get rid of menu item
		document.getElementById("u" + key).style.display = "none";
	}
	this.exportData = 1;
	this.subuppermenu.innerHTML = '';
	this.subuppermenu.style.display = 'none';
	this.closeUpperItem();
	this.load();
}

function addCheckbox(who,what,options) {
	if (typeof(who) == 'string') {
		who = Element.get(who);
	}
	
	var len = chart.upperManager.length;
	who.checked = false;
	
	if (options != "News") {
		if (chart.browserIsIE()) {
			who.style.border = "1px solid #fff";
		} else {
			var borderSpan = who.parentNode;
			borderSpan.style.border = "1px solid #fff";//remove colored border to span around checkbox, not checkbox itself 
		}
	}
	
	for (var i=0;i<len;i++) {
		if (chart.upperManager[i].value == who.id) {
			chart.removeUpperCheckBox(who,what,options);
			return false;
		}
	}

	chart.addUpper(who,what,options,1);
	who.checked = true;
}

// Removes an Uppper Indicator
chart.prototype.removeUpperCheckBox = function(value) {
	// Handles removing from manager w/standard js
	var len = this.upperManager.length;
	value = value.id;

	// When only 1 force clean
	if (len == 1) {
		this.upperOptionsMenu.className = "fLeft uOptionsMenu collapse";
		this.upperOptionsMenu.innerHTML = '&nbsp;';
		this.upperManager = [];
	} else {
		var tempArray = [];
		var count = 0;

		for (var i=0;i<len;i++) {

			if (this.upperManager[i].value == value) {
				var count = parseInt(i);
				var key = this.upperManager[i].key;
				
				// get rid of menu item
				document.getElementById("u"+key).style.display = "none";
				break;
			} else {
				tempArray[i] = {value:this.upperManager[i].value,color:this.upperManager[i].color,type:this.upperManager[i].type,label:this.upperManager[i].label,key:this.upperManager[i].key,params:this.upperManager[i].params }
			}
		}
		

		for (var c = count;c<(len - 1);c++) {
			var x = parseInt(c) + 1;
			tempArray[c] = {value:this.upperManager[x].value,color:this.upperManager[x].color,type:this.upperManager[x].type,label:this.upperManager[x].label,key:this.upperManager[x].key,params:this.upperManager[x].params }
		}
		// replace upperManager Array
		this.upperManager = tempArray;
	}
	this.exportData = 1;
	this.subuppermenu.innerHTML = '';
	this.subuppermenu.style.display = 'none';
	this.closeUpperItem();
	this.load();
}


// Add Lower Indicator
chart.prototype.addLower = function(who, lowObj) {
	this.activateUpperSettingsControls();
	if (!lowObj) {
		var lowObj = this.lower[who.id];
	}
	if (this.lowerManager.length > this.lowerLimit) {
		this.limit = this.lowerLimit;
	} else {
		this.limit = this.lowerManager.length;
	}
	// moves lower indicators, and enforces limit
	for (var i = this.limit; i > 0; i--) {
		this.lowerManager[i] = { value: this.lowerManager[(i - 1)].value, params: this.lowerManager[(i - 1)].params }
	}
	this.lowerManager[0] = { value: who.id, params: lowObj.params }
	this.load();
}
// Updates the Lower Indicator
chart.prototype.updateLower = function(lowerIndex,numParams) {
	// get props
	var type = this.lowerManager[lowerIndex].value;
	// get all params
	var params = [];
	for (var i=0;i<numParams;i++) {
		var value = document.getElementById("i"+lowerIndex+"_"+i).value;
		if (type.indexOf("volume") > -1 && i == 0) {
			value = value.toUpperCase();
			if (value == 'EMA' || value == 'SMA' || value == 'WMA') {

			} else {
				alert("Value must be either SMA, EMA, or WMA");
				return null;
			}
		} else if (type.indexOf("relativeratio") > -1) {
			value = value + '';
			if (value.length < 1 || value.length > 6) {
				alert("Please enter a valid symbol to compare");
				return null;
			}
		} else {
			value = parseFloat(value);
			if (value < 0 || value > 1000 || isNaN(value)) {
				alert("Value must be within acceptable range");
				return null;
			}
		}
		params.push(value);
	}

	var tmpParams = params.join(",");
	this.lowerManager[lowerIndex].params = tmpParams;

	this.sublowermenu.style.display = 'none';
	this.closeLowerItem();
	this.load();
}

// Logic for removing all params
chart.prototype.removeParams = function(lowerIndex) {
	this.sublowermenu.style.display = 'none';
	this.closeLowerItem();
	this.lowerManager[lowerIndex].params = '';
	this.load();
}

// Removes an Lower Indicator
chart.prototype.removeLower = function(key) {
	var len = this.lowerManager.length;

	// When only 1 force clean
	if (len == 1) {
		this.lowerManager = [];
	} else {
		var tempArray = [];
		var count = 0;
		
		for (var i=0;i<len;i++) {
			if (i == key) {
				var count = parseInt(i);
				break;
			} else {
				tempArray[i] = {value:this.lowerManager[i].value,params:this.lowerManager[i].params}
			}
		}
		
		for (var c = count;c<(len - 1);c++) {
			var x = parseInt(c) + 1;
			tempArray[c] = {value:this.lowerManager[x].value,params:this.lowerManager[x].params}
		}
		// replace Array
		this.lowerManager = tempArray;
	}
	this.sublowermenu.style.display = 'none';
	this.closeLowerItem();
	this.load();
}

// -- Display Inline Menu --
chart.prototype.showSubMenu = function(who,show,content) {
	var menu 	= document.getElementById(who.id+'Menu');
	var options = document.getElementById(who.id+'Options');
	
	if (menu.style.display == 'block') {
		menu.style.display = 'none';
		who.parentNode.className = "menuitem";
	} else {
		menu.style.display = 'block';
		menu.innerHTML = options.innerHTML;
		who.parentNode.className = "menuitemHL";
	}
	
	this.resizeMe = 1; //don't reload chart when opening/closing menus
}


// -- Side Menu Display --
chart.prototype.showSubItem = function(who,show,offset,width) {
	if (show == 1) {
		if (!offset) {offset = 0;}
		if (typeof(document.all) == "undefined") {
			var pos = this.getPos(who,150 - offset,-5);
		} else {
			var pos = this.getPos(who,150 - offset,-5); // ie 6,7
		}
		
		this.submenu.style.display = 'block';
		this.submenu.style.left = pos.x + 'px';
		this.submenu.style.top = pos.y + 'px';
		if (offset) {
			this.submenu.style.width = 150 + offset + 'px';
		} else {
			this.submenu.style.width = '150px';
		}

		if (width) {
			this.submenu.style.width = width + 'px';
		}
		
		//get saved setting menus, hide cursor for IE only
		var savedSettingWho = Element.parseSelector('div.subitem2',Element.get('settingsMenu'));
		var hideCursor = 0;
		for (var w in savedSettingWho) {
			if (this.browserIsIE() && who.id == savedSettingWho[w].id) {
				hideCursor = 1;
			}
		}
		
		if (Element.get("cursor") && this.browserIsIE() && (who.id == "uppers" || who.id == "lowers" || hideCursor)) {
			Element.get("cursor").style.visibility = "hidden";
		}
		
		if (this.browserIsIE() && Element.get("chartsize")){
			Element.get("chartsize").style.visibility = "hidden";
		}
		
		this.submenu.innerHTML = document.getElementById(who.id+'Content').innerHTML;
		this.mView = 0;
		this.clearMenuTimeout();
		this.clearMenuTimeout2();

	} else if (show == 2) {
		if (typeof(document.all) == "undefined") {
			var left = 153;
			if (width) {left = width - 2;}
		} else {
			var left = 152;
			if (width) {left = width - 2;}
		}

		var pos = this.getPos(who,left,0);
		
		this.submenu2.style.display = 'block';
		this.submenu2.style.left = pos.x + 'px';
		this.submenu2.style.top = pos.y + 'px';
		if (width) {
			this.submenu2.style.width = width + 'px';
		}
		this.submenu2.innerHTML = document.getElementById(who.id+'Content').innerHTML;
		this.mView = 0;
		this.mView2 = 0;
		this.clearMenuTimeout();
		this.clearMenuTimeout2();
	} else if (show == 3) {
		this.mView = 1;
		this.mView2 = 1;
		this.mViewID = window.setTimeout("chart.closeSubItem();",200);
		this.mViewID2 = window.setTimeout("chart.closeSubItem2();",200);
	}else {
		this.mView = 1;
		this.mView2 = 1;
		this.mViewID = window.setTimeout("chart.closeSubItem();",200);
		this.mViewID2 = window.setTimeout("chart.closeSubItem2();",200);
	}
}
// close menu
chart.prototype.closeSubItem = function() {
	if (this.mView) {
		var cursor = Element.get("cursor");
		var chartSize = Element.get("chartsize");
		if (cursor) {
			cursor.style.visibility = "visible";
			if (this.browserIsIE() && chartSize){
				chartSize.style.visibility = "visible";
			}
		}
		this.submenu.style.display = 'none';
		this.submenu2.style.display = 'none';
	}
	window.clearTimeout(chart.mViewID);
}
chart.prototype.clearMenuTimeout = function() {
	this.mView = 0;
	window.clearTimeout(chart.mViewID);
}
// close secondary menu
chart.prototype.closeSubItem2 = function() {
	if (this.mView2) {
	this.submenu2.style.display = 'none';
	}
	window.clearTimeout(chart.mViewID2);
}
chart.prototype.clearMenuTimeout2 = function() {
	this.mView = 0;this.mView2 = 0;
	window.clearTimeout(chart.mViewID);
	window.clearTimeout(chart.mViewID2);
}

// highlight menu item
chart.prototype.hlMenu = function(who,what,type)
{
	if (!type) {type = '';}
	if (what) {
		//who.className = 'subitem'+type+' subitem'+type+'HL';
		Element.addClass(who,'subitem'+type+'HL');
	} else {
		//who.className = 'subitem'+type;
		Element.removeClass(who,'subitem'+type+'HL');
	}
}

// -- Upper Options Menu --
chart.prototype.showUpperItem = function(who,show) {
	if (show == 1) {
		this.lastWho = who;
		this.subuppermenu.style.display = 'block';
		this.subuppermenu.style.left = 500 + 'px';
		this.subuppermenu.style.top = 470 + 'px';
		this.subuppermenu.innerHTML = this.getUpperOptions(who.id);
		this.uView = 0;
	} else {
		this.uView = 1;
		//who.className = 'fLeft upperOption';
		this.lastWho.className = 'fLeft upperOption';
	}
}

chart.prototype.getUpperOptions = function(key) {
	for (var i = 0; i < this.upperManager.length; i++) {
		if (key == 'u' + this.upperManager[i].key) {
			var u = this.upperManager[i];
			var content = [];
			content.push('<div class="subuppermenuTop"></div>');
			content.push('<div class="subuppermenuTitle">' + u.label + '   ');

			content.push('<span onclick="chart.subuppermenu.style.display = \'none\';"><img src="../../images/charts/closechart.png" /></span>');

			content.push('</div>');

			content.push('<div class="subuppermenuBody">');
			content.push('<div class="pL10 t4">');

			// <table cellspacing="0" width="210">

			if (u.type == 'event' || u.type == 'compare' || u.value == 'MOMENTUMBARS' || u.value == 'LINEARREGRESSION' || u.value == 'NEWS') {
				var paramslength = 0;
			} else {
				var params = u.params.split(",");

				content.push('<form onsubmit="chart.updateUpper(' + i + ',' + params.length + ');return false;">');

				var paramLabels = this.upper[u.value].paramLabel.split(",");
				content.push('<table class="paramsTable" cellpadding="0"><tr>');
				for (var p = 0; p < params.length; p++) {
					var tdStyle = "";
					if (u.value == "WMA" || u.value == "EMA" || u.value == "SMA") {
						tdStyle = 'style="padding-right: 20px"';
					}

					content.push('<td ', tdStyle, '>' + paramLabels[p] + '</td>');

				}
				if (u.value == "WMA" || u.value == "EMA" || u.value == "SMA") {
					content.push('<td class="solidMed">Other Popular Periods</td>');
				}

				content.push('</tr><tr>');
				for (var p = 0; p < params.length; p++) {
					var inputKey = 'i' + u.key + '_' + p;
					content.push('<td><input id="' + inputKey + '" class="paramsInput" type="text" value="' + params[p] + '" maxlength="3" /></td>');
					if (u.value == "WMA" || u.value == "EMA" || u.value == "SMA") {
						content.push('<td>',
										'<a href="javascript:void(0);" onclick="chart.updateMovingAveragePeriod(5,', i, ', ', params.length, ',\'', inputKey, '\')" class="hand bold pR8 txt12">5</a>',
										'<a href="javascript:void(0);" onclick="chart.updateMovingAveragePeriod(10,', i, ', ', params.length, ',\'', inputKey, '\')" class="hand bold pR8 txt12">10</a>',
										'<a href="javascript:void(0);" onclick="chart.updateMovingAveragePeriod(20,', i, ', ', params.length, ',\'', inputKey, '\')"  class="hand bold pR8 txt12">20</a>',
										'<a href="javascript:void(0);" onclick="chart.updateMovingAveragePeriod(50,', i, ', ', params.length, ',\'', inputKey, '\')"  class="hand bold pR8 txt12">50</a>',
										'<a href="javascript:void(0);" onclick="chart.updateMovingAveragePeriod(100,', i, ', ', params.length, ',\'', inputKey, '\')" class="hand bold pR8 txt12">100</a>',
									'</td>');
					}
				}
				content.push('</tr></table>');

				content.push('<input type="image" class="hand" src="../../images/charts/update_chart.png" onclick="chart.updateUpper(' + i + ',' + params.length + ');" /> &nbsp; ');
			}

			content.push('<span onclick="chart.removeUpper(\'' + u.value + '\',\'' + u.key + '\');"><img src="../../images/charts/remove_chart.png" /></span>');

			content.push('</form></div"></div">');

			return content.join("");
			break;
		}
	}
	return "";
}
// close upper menu
chart.prototype.closeUpperItem = function() {
	if (this.uView) {
		this.subuppermenu.style.display = 'none';
	}
	window.clearTimeout(chart.uViewID);
}
chart.prototype.clearUpperTimeout = function() {
	this.uView = 0;
	this.lastWho.className = 'fLeft upperOption';
	window.clearTimeout(chart.uViewID);
}

// -- Lower Options Menu --
chart.prototype.showLowerItem = function(who,show) {
	if (show == 1) {
		var pos = this.getPos(who,1,14);
		this.lastWho = who;
		this.sublowermenu.style.display = 'block';
		this.sublowermenu.style.left = (pos.x + 50) + 'px';
		this.sublowermenu.style.top = (pos.y - 40) + 'px';
		this.sublowermenu.innerHTML = this.getLowerOptions(who.id);
	} else {}
}
chart.prototype.getLowerOptions = function(key) {

	var key = key.split("_");
		lIndex = key[1] - 1;

	var lowObj = this.lowerManager[lIndex];
	var params = lowObj.params + '';
	if (!params) {
		params = 'EMA,13';
	}
	
	var params = params.split(",");
	if (this.lower[lowObj.value]) {
		var paramLabels = this.lower[lowObj.value].paramLabel.split(",");
		var numParams = this.lower[lowObj.value].numParams;
	} else {
		var paramLabels = [];var numParams = 0;
	}

	var content = [];
	
	var content = [];
		content.push('<div class="subuppermenuTop"></div>');
		content.push('<div class="subuppermenuTitle">'+this.lower[lowObj.value].label+'   ');
		
			content.push('<span class="hand" onclick="chart.sublowermenu.style.display = \'none\';"><img src="../../images/charts/closechart.png" /></span>');
		
		content.push('</div>');
		
		content.push('<div class="subuppermenuBody">');
		content.push('<div class="pL10 t4"><form onsubmit="chart.updateLower(\''+lIndex+'\','+numParams+');return false;">');	
	

	if (numParams > 0 && lowObj.value != 'onesymbol') {
			content.push('<table class="paramsTable left" cellpadding="0"><tr>');

		for (var p = 0;p<numParams;p++) {
			content.push('<td>'+paramLabels[p]+'</td>');
		}
			content.push('</tr><tr>');

		for (var p = 0;p<numParams;p++) {
			content.push('<td><input id="i'+lIndex+'_'+p+'" class="paramsInput" type="text" value="'+params[p]+'" maxlength="5" /></td>');
		}
		content.push('</tr></table>');
		
		//content.push('<span class="hand" onclick="chart.updateLower(\''+lIndex+'\','+numParams+');"><img src="../../images/charts/update_chart.png" /></span> &nbsp; ');
		content.push('<input type="image" class="hand" src="../../images/charts/update_chart.png" onclick="chart.updateLower(\''+lIndex+'\','+numParams+');" /> &nbsp; ');
		

	} // end if params check
	
	if (paramLabels[0] == 'MAType') {
		content.push('<span class="hand" onclick="chart.removeParams(\''+lIndex+'\');"><img src="../../images/charts/remove_chart.png" /></span>');
	} else {
		content.push('<span class="hand" onclick="chart.removeLower(\''+lIndex+'\');"><img src="../../images/charts/remove_chart.png" /></span>');
	}
			
	content.push('</form></div"></div">');	
	return content.join("");
}
// close lower menu
chart.prototype.closeLowerItem = function() {
	//this.sublowermenu.style.display = 'none';
	/*
	if (this.lView) {
		this.sublowermenu.style.display = 'none';
	}
	window.clearTimeout(chart.lViewID);
	*/
}
chart.prototype.clearLowerTimeout = function() {
	this.lView = 0;
	this.lastWho.className = 'lowerOption lowerOptionHL';
	window.clearTimeout(chart.lViewID);
}

// wrappers
function clearUpperTimeout() {
	try {
		chart.clearUpperTimeout();
	} catch(e) {}
}
function showUpperItem(who,what) {
	try {
		chart.showUpperItem(who,what);
	} catch(e) {}
}
function clearLowerTimeout() {
	try {
		chart.clearLowerTimeout();
	} catch(e) {}
}
function showLowerItem(who,what) {
	try {
		chart.showLowerItem(who,what);
	} catch(e) {}
}
function hl(who,what,type) {
	try {
	chart.hlMenu(who,what,type);
	} catch(e) {}
}
function showSubItem(who,show,offset,width) {
	try {
	chart.showSubItem(who,show,offset,width);
	} catch(e) {}
}

function showSubMenu(who,show,content) {
	try {
	chart.showSubMenu(who,show,content);
	} catch(e) {}
}


function aU(who,what,options) {
	try {
	chart.addUpper(who,what,options);
	} catch(e) {}
}
function aL(who) {
	try {
	chart.addLower(who);
	} catch(e) {}
}

// Builds Interactive Chart
chart.prototype.load = function(action, action_value) {

	this._setupColors();

	if (toolbox.divZoom) {
		toolbox.divZoom.style.visibility = "hidden";
	}
	if (toolbox.divZoomH) {
		toolbox.divZoomH.style.visibility = "hidden";
	}
	if (toolbox.ball) {
		toolbox.ball.style.visibility = "hidden";
	}

	document.getElementById("infoDiv").innerHTML = '';

	this.showLoadingIndicator();

	var uM = serializer.serialize(this.upperManager);
	var lM = serializer.serialize(this.lowerManager);
	uM = uM.replace(/&amp;/gi, "-AND-");
	uM = uM.replace(/&/gi, "-AND-");
	lM = lM.replace(/&/gi, "-AND-");

	if (!action) { action = ''; }
	if (!action_value) { action_value = ''; }

	var qs = 'update_chart.asp?toolbarView=' + this.toolbarView + '&duration=' + this.duration + '&frequency=' + this.frequency + '&scaling=' + this.scaling + '&display=' + this.display + '&exportData=' + this.exportData + '&dMin=' + this.dMin + '&dMax=' + this.dMax + '&uppers=' + uM + '&lowers=' + lM + '&lastColorUsed=' + this.lastColorUsed + '&action=' + action + '&action_value=' + action_value + '&symbol=' + this.display_symbol + '&eventview=' + this.eventview + '&width=' + this.width + '&height=' + this.height + '&cType=' + this.cType + '&sKey=' + this.sKey + '&currentTool=' + this.currentTool + '&chartsize=' + this.chartsize;

	commonGen.document.location.replace(qs);

	this.eventview = '';
	this.resizeMe = 1;
}

chart.prototype.resize = function(){
	var self = this;
	if (!this.resizeMe) {
		this.lcid = window.setTimeout(function(){
			if (!self.resizeMe){
				self.load();
			}	
		},300);
		this.resizeMe = 1;
	} else {
		this.resizeMe = 0;
	}
}

// -- Helper --
// keeps track of which color to assign to upper indicator nav item
chart.prototype.selectUpperColor = function() {
	if (this.lastColorUsed < this.colors.length) {
		var color = this.colors[this.lastColorUsed];
		this.lastColorUsed++;
	} else {
		this.lastColorUsed = 0;
		var color = this.colors[this.lastColorUsed];
		this.lastColorUsed++;
	}
	return color;
}

/**
 * Enforce some rules for colors on uppers (dependent on chart type)
 *
 */
chart.prototype._setupColors = function(){
	
	var tmpColors = [];
	tmpColors.push('6633CC');
	tmpColors.push('990000');//red
	tmpColors.push('FFCC00');
	tmpColors.push('1061A9');//blue
	tmpColors.push('FF9933');
	tmpColors.push('009900');//green
	tmpColors.push('004C6D');//blue
	tmpColors.push('66008D');
	tmpColors.push('000000');//black
	tmpColors.push('8E4F16');
	tmpColors.push('4A6DB6');//price line--had to move down in the order (weird issue where first color in array was ignored?!)
	
	//manage colors
	this.colors = [];
	var matchFound = false;
	for (var c in tmpColors) {
		
		if (!this._getColorByName("blue",tmpColors[c]) && (this.display == "mountain")) {
		
			this.colors.push(tmpColors[c]);//add all, EXCEPT blues
			matchFound = true;
			
		} else if(!this._getColorByName("black",tmpColors[c]) && (this.display == "ohlc" || this.display == "candlestick")) {
			
			this.colors.push(tmpColors[c]);//add all, EXCEPT black
			matchFound = true;
			
		} else if((!this._getColorByName("red",tmpColors[c]) && !this._getColorByName("green",tmpColors[c])) && (this.display == "candlestickcolor" || this.display == "lineclip")) {
			
			this.colors.push(tmpColors[c]);//add all, EXCEPT reds and greens
			matchFound = true;
			
		} else if (!matchFound) {
		
			this.colors.push(tmpColors[c]);//add all
			
		}
	}
};

/**
 * Gets colors by name (vs hex) -- returns boolean
 *
 * @param strName {String} Color name, e.g. "blue", "red"
 * @param strColor {String} Actual hex color to compare
 */
chart.prototype._getColorByName = function(strName,strColor){
		
	if (strName == "blue" && (strColor == "4A6DB6" || strColor == "004C6D" || strColor == "1061A9")) {
		return true;
	} else if (strName == "red" && strColor == "990000") {
		return true;
	} else if (strName == "green" && strColor == "009900") {
		return true;
	} else if (strName == "black" && strColor == "000000") {
		return true;
	} else {
		return false;
	}		
};

/**
 * Enforce colors for Company Events (so Splits are always black, Dividends always orange, etc)
 *
 * @param companyEvent {String} The event (split, dividend, earnings, etc)
 *
 */
chart.prototype._getEventColor = function(companyEvent){
	
	var color;
	if ("splits" == companyEvent) {
		color = "000000";
	} else if ("dividends" == companyEvent) {
		color = "FD835D";
	} else if ("earnings" == companyEvent) {
		color = "990000";
	} else if ("earningsbar" == companyEvent) {
		color = "1061A9";
	} else if ("insider" == companyEvent) {
		color = "009900";
	}
	
	return color;		
};

// get pos of any element
chart.prototype.getPos = function(who,xOff,yOff){
	this.eleOffset = who;

	if (!xOff) { xOff = 0; }
	if (!yOff) { yOff = 0; }

	var x = 0;var y = 0;
	while (this.eleOffset.offsetParent != null) {
		x += this.eleOffset.offsetLeft;
		y += this.eleOffset.offsetTop;
		this.eleOffset = this.eleOffset.offsetParent;
	}
	
	x += this.eleOffset.offsetLeft + xOff;
	y += this.eleOffset.offsetTop + yOff;

	var pos = [];pos.x = x;pos.y = y;
	return pos;
}

// -- Events --
// Displays Insider/splits/earngs transaction rollover
chart.prototype.displayInfo = function(who,what,left,top) {
	try {
		this.iWin = document.getElementById(who+"Win");
		if (what) {
			this.iWin.style.display = "block";
			this.iWin.style.left = left + 20 + 'px';
			this.iWin.style.top = top + 'px';
		} else {
			this.iWin.style.display = "none";
		}
	} catch(e){};
}
function rWrap(who,what,left,top) {
	try {
	chart.displayInfo(who,what,left,top);
	} catch(e) {}
}


// show news
chart.prototype.displayNews = function(who,what,left,date) {
	try {
		if (Element.get("cursor").style.visibility == "hidden") {
			Element.get("cursor").style.visibility = "visible";
		}
		this.newsWin = Element.get('newsWin');
		this.newsWin.style.display = 'block';
		
		this.newsWin.style.left = (toolbox.origin.x - 20) + 'px';
		this.newsWin.style.top = (toolbox.origin.y + 30) + 'px';
		
		this.iWin = Element.get(who+"Win");
		this.newsContent = Element.get('newsContent');
		this.newsContent.innerHTML = this.iWin.innerHTML;
		
		var sizeOfNews = Element.getSize(this.newsWin);
		var sizeOfChart = Element.getSize(Element.get('chtimg'));
		
		if (sizeOfNews.height > sizeOfChart.height) {		
			Element.get("cursor").style.visibility = "hidden"; //only hide if neccessary
		}
		
		Element.get('newsDate').innerHTML = date;
	} catch(e){};
}
function dNews(who,what,left,date) {
	try {
	chart.displayNews(who,what,left,date);
	} catch(e) {}
}

function cNews() {
	Element.get("cursor").style.visibility = "visible";
	Element.get('newsWin').style.display = 'none';
}

// !! Hide / Show Controls !!


// hide side menu
chart.prototype.hideMenu = function(isTrefis) {

	var isTrefisJs = false;
	if(isTrefis == 'True' && isTrefis){isTrefisJs = true}else{isTrefisJs = false};
	
	this.control = Element.get("control");
	this.showhide = Element.get("showhide");
	this.upperOptionsMenu = Element.get("upperOptionsMenu");
	this.chtimg = Element.get("chtimg");
	this.infoDiv = Element.get("infoDiv");
	this.topControls = Element.get("topControls");
	this.custom = Element.get("custom");
	this.durationM = Element.get("durationM");
	
	if (toolbox.tool["zoom"] && toolbox.tool["zoom"].divZoom) {
		toolbox.tool["zoom"].divZoom.style.visibility = "hidden";
	}
	
	toolbox.showZoomMove = 0;

	if (this.control.style.display == "block") { //hides side bar
		this.toolbarView = 'hide';
		var twidth = chart.cWidthFull;
		this.durationM.style.marginLeft = '6px';
		this.control.style.display = "none";
		this.showhide.style.left = '6px';
		this.showhide.innerHTML = '<img src="../../images/charts/showchart.gif" />';
		//this.upperOptionsMenu.style.width = (twidth - 18)+'px';
		if(isTrefisJs){
			this.upperOptionsMenu.style.width = (twidth - 222)+'px';
		}else{
			this.upperOptionsMenu.style.width = (twidth - 18)+'px';
		}
		this.infoDiv.style.width = (twidth - 18)+'px';
		this.width = twidth+'px';
		this.cht.style.width = twidth+'px';
		this.chtimg.style.width = twidth+'px';
		this.topControls.style.width = (twidth - 2)+'px';
		this.custom.style.width = (twidth - 2)+'px';
		if (this.cType == 'tearoff' && Element.get("cursorNewsPrint")) {
			Element.get("cursorNewsPrint").style.width = twidth+'px';
		}
		
	} else { // shows side bar
		this.toolbarView = 'show';
		var twidth = chart.cWidth;
		this.durationM.style.marginLeft = '12px';
		this.durationM.style.width = (twidth - 12)+'px';
		this.control.style.display = "block";
		this.showhide.style.left = '159px';
		this.showhide.innerHTML = '<img src="../../images/charts/hidechart.gif" />';
		if(isTrefisJs){
			this.upperOptionsMenu.style.width = (twidth - 222)+'px';
		}else{
			this.upperOptionsMenu.style.width = (twidth - 18)+'px';
		}
		this.infoDiv.style.width = (twidth - 18)+'px';
		this.width = twidth+'px';
		this.cht.style.width = twidth+'px';
		this.chtimg.style.width = twidth+'px';
		this.topControls.style.width = (twidth - 2)+'px';
		this.custom.style.width = (twidth - 2)+'px';
		if (this.cType == 'tearoff' && Element.get("cursorNewsPrint")) {
			Element.get("cursorNewsPrint").style.width = twidth+'px';
		}
	}

	this.load();
	
	// update coords and data for rollovers
	if (this.custom.style.display == "block") {
		this.getNewCustomTimeData();
		this.initCustomEvents();
	}
}

// open up tear off
chart.prototype.openTearOff = function() {

	var savedSettingQS = "";
	var savedSettingName = document.getElementById("savedSettingName");

	if (savedSettingName) {
		var savedSettingsMenu = document.getElementById("savedSettingsMenu");

		if (savedSettingsMenu.style["display"] != "none") {
			savedSettingQS = "&action=load&action_value=" + savedSettingName.innerHTML;
		}
	}	
	
	var randomKey = parseInt(Math.random() * 1000);
	var winName = 'chart_' + randomKey;
	this.popWindow = window.open('liquid.asp?iWidth=1024&sKey=' + randomKey + '&symbol=' + this.display_symbol + savedSettingQS, winName, 'width=1024,height=768,scrollbars=yes,menubar=0,status=no,toolbar=0,resizable=yes');
	this.popWindow.focus();
}

// print
chart.prototype.print = function(){
	var winName = 'chart_'+parseInt(Math.random() * 1000);
	this.popWindow = window.open('print.asp', winName, 'width=800,height=768,scrollbars=yes,menubar=1,status=no,toolbar=1,resizable=no');
	this.popWindow.focus();
}



// !!! next custom time range code !!!
chart.prototype.dateToMs = function(date,fromUpdate) {

	if (date && date.length > 7) {
		
		var dateParts = date.split("/");
		if (dateParts.length > 1) {
		
			var m = dateParts[0];
			var d = dateParts[1];
			var y = dateParts[2];
					
			if (y < 1970) {
				this.calError = "Please enter a valid year.";
				this.updateDateErrorMessage();
				return false;
			}
			
			if (m > 12 || m < 1) {
				this.calError = "Please enter a valid month.";
				this.updateDateErrorMessage();
				return false;
			}

			if (m == 2 && (d > 29 || d < 1)) {
				this.calError = "Please enter a valid day.";
				this.updateDateErrorMessage();
				return false;
			} else if ((m == 4 || m == 6 || m == 9 || m == 11) && (d > 30 || d < 1)) {
				this.calError = "Please enter a valid day.";
				this.updateDateErrorMessage();
				return false;
			} else if ((m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12) && (d > 31 || d < 1)) {
				this.calError = "Please enter a valid day.";
				this.updateDateErrorMessage();
				return false;
			}	

			// add error handling
			var t = new Date();
				t.setFullYear(y,(m - 1),d);
				var timezoneOffset = t.getTimezoneOffset() / (60 * 24)
				var msDateObj = (t.getTime() / 86400000) + (25569 - timezoneOffset)
			return parseInt(msDateObj);
		}
	}
	
	return false;
}

// update custom time
chart.prototype.updateDateErrorMessage = function(){
	window.clearTimeout(chart.dateErrID);
	this.dateErrID = window.setTimeout("chart.updateDateErrorMessageTime();",500); //2000
}

chart.prototype.updateDateErrorMessageTime = function() {
	this.grayChartError = '<div style="width:'+(this.width - 2)+'px;height:'+(this.upperHeight + 118)+'px;border:1px solid #999;background:#eee;text-align:center;"><span class="block" style="padding-top:'+(this.upperHeight / 2 - 12)+'px;">The chart is not available for the selected criteria.  Please change the criteria or <a href="?reset=9">reset the chart</a>.</span></div>'
	this.cht.innerHTML = this.grayChartError;
	toolbox.showZoomMove = 0;
	alert(chart.calError); // could be a bit more fancy
}

// custom time chart data
chart.prototype.getNewCustomTimeData = function() {
	this.customData = [];
	for (var x=0; x < dC.dDS.length; x++){
		var dF = formatD(dC.dDS[x],'custom'); // check time zone

		this.customData[this.customData.length] = {
			d:dC.dDS[x],
			x:dC.xDS[x],
			df:dF
		};
	}
	this.customspacing = (434 / dC.dDS.length);
	this.customOrigin = chart.getPos(Element.get('custom'));
}

// quick util for finding array key
chart.prototype.getCustomIndex = function(xIn) {
	this.dataKey = Math.floor((xIn - this.customspacing) / this.customspacing);
	while (xIn > (d.xDS[this.dataKey]+(this.customspacing*.75))) {
		this.dataKey++;
	}
	return this.dataKey;
}

chart.prototype.getXLocFromDate = function(msDateIn) {

	if (this.customData) {
		var len = this.customData.length - 1;
		for (var i = 0;i<this.customData.length;i++) {
			if (msDateIn <= this.customData[i].d) {
				return this.customData[i].x;
			}
		}
		return this.customData[len].x;
	}
	return 0;
}


// !!! Drag Handles !!!!

chart.prototype.initCustomEvents = function() {

	// Custom Time Range Areas
	this.ctLeft = Element.get('ctLeft');
	this.ctRight = Element.get('ctRight');
	this.target = null;
	
	// Custom Time Range Handles
	this.controlLeft = Element.get('ctHandleL');
	this.controlRight = Element.get('ctHandleR');

    Events.add({element:document.body, type:"mousemove", handler:this.mouseMove, context:this});
    Events.add({element:document.body, type:"mousedown", handler:this.mouseDown, context:this});
    Events.add({element:document.body, type:"mouseup",   handler:this.mouseUp, context:this});
    
	this.initAreaPos();
}

chart.prototype.initAreaPos = function() {
	// Set Init Ranges
	this.fromMS = this.dateToMs(this.saveCustomFrom.value);
	this.toMS = this.dateToMs(this.saveCustomTo.value);

	this.initLeftPos = this.getXLocFromDate(this.fromMS);
	this.initRightPos = this.getXLocFromDate(this.toMS);
	
	if (this.initLeftPos < 10) {
		this.initLeftPos = this.initLeftPos + 10;//need to show the left handle
	}
	
	//console.log(this.initLeftPos);
	
	this.ctLeft = this.ctLeft || Element.get("ctLeft");
	this.ctLeft.style.width = this.initLeftPos + 'px';
	
	if (this.initRightPos >= 433 && this.initRightPos > 1) {
		Element.setStyle(this.ctRight,'width:10px;');
		Element.setStyle(this.ctRight,'left:'+this.initRightPos+'px;');
	} else if (this.initRightPos < 434 && this.initRightPos > 1) {
		Element.setStyle(this.ctRight,'width:'+(434 - this.initRightPos)+'px;');
		Element.setStyle(this.ctRight,'left:'+this.initRightPos+'px;~left:'+(this.initRightPos-20)+'px;');
	} else {
		this.ctRight = this.ctRight || Element.get("ctRight");
		this.ctRight.style.width =  '10px';
		Element.setStyle(this.ctRight,'left:434px;');
	}
}

// update area that is selected on custom area
chart.prototype.updateCustomSelectArea = function(){

	if (Element.get("custom").style.display == 'block') {
		// Set Init Ranges
		this.fromMS = parseInt(this.dMin);
		this.toMS = parseInt(this.dMax);
		
		this.initLeftPos = this.getXLocFromDate(this.fromMS);
		this.initRightPos = this.getXLocFromDate(this.toMS);
	
		this.ctLeft.style.width = this.initLeftPos + 'px';
	
		if (this.initRightPos < 434 && this.initRightPos > 1) {
			this.ctRight.style.width = (434 - this.initRightPos) + 'px';
			this.ctRight.style.left =  this.initRightPos + 'px';
		} else {
			this.ctRight.style.width =  '10px';
			Element.setStyle(this.ctRight,'left:434px;~left:428px;');
		}
	}
}
	
// update custom time
chart.prototype.updateCustom = function(el,e) {
	window.clearTimeout(chart.cvID);	
	this.cvID = window.setTimeout("chart.updateCustomTime();",2000);
}

chart.prototype.updateCustomTime = function() {	

	//this is an important method because it handles frequencies and durations based on what user selects from calendar pickers

	this.fromMS = this.dateToMs(this.saveCustomFrom.value, 1);
	this.toMS = this.dateToMs(this.saveCustomTo.value, 1);

	if (this.fromMS && this.toMS) {

		if (this.fromMS > this.toMS) {
			this.calError = "The \'From\' date must be before the \'To\' date."
			this.updateDateErrorMessage();
			return false;
		}

		this.dMin = parseFloat(this.fromMS);
		this.dMax = parseFloat(this.toMS);
		this.frequency = '1week';
		if (this.duration != 3653 || this.duration == 10000) { // turn off old duration
			this.dMenu = Element.get("cht_" + this.lastduration);
			this.dMenu.className = "href hand";
			this.dMenu.style.color = '039';
		}
		
		this.duration = 3653; //default to 10 years...but possibly override below 

		var maxDiff = parseFloat(this.toMS - this.fromMS);

		//check and override, if necc, the intra/interday data switch if request is more than 5 days ago
		var diffBetweenTodayAndToDate = parseFloat(this.today - this.fromMS);
		if (diffBetweenTodayAndToDate > 5) {

			if (this.dMin == this.dMax) { this.dMax++; }

			if (diffBetweenTodayAndToDate <= 1) {
				this.duration = this.durations[1].value;
				this.frequency = this.durations[1].interval;
			} else if (diffBetweenTodayAndToDate <= 5) {
				this.duration = this.durations[5].value;
				this.frequency = this.durations[5].interval;
			} else if (diffBetweenTodayAndToDate <= 31) {
				this.duration = this.durations[31].value;
				this.frequency = this.durations[31].interval;
			} else if (diffBetweenTodayAndToDate <= 90) {
				this.duration = this.durations[90].value;
				this.frequency = this.durations[90].interval;
			} else if (diffBetweenTodayAndToDate <= 365) {
				this.duration = this.durations[365].value;
				this.frequency = this.durations[365].interval;
			} else if (diffBetweenTodayAndToDate <= 1096) {
				this.duration = this.durations[1096].value;
				this.frequency = this.durations[1096].interval;
			} else if (diffBetweenTodayAndToDate <= 1826) {
				this.duration = this.durations[1826].value;
				this.frequency = this.durations[1826].interval;
			} else if (diffBetweenTodayAndToDate <= 3653) {
				this.duration = this.durations[3653].value;
				this.frequency = this.durations[3653].interval;
			} else {
				this.duration = this.durations[10950].value;
				this.frequency = this.durations[10950].interval;
			}

		} else {

			if (maxDiff < 1) { //this must be *today*
				this.duration = 1;
				this.frequency = this.durations[1].interval; //'1minute'
				this.dMin = 0;
				this.dMax = 0;
			} else if (maxDiff < 6) {
				this.duration = 5;
				this.dMax++;
				this.frequency = this.durations[5].interval; //'15minute'
			} else if (maxDiff < 31) {
				this.duration = 31;
				this.frequency = this.durations[5].interval; //'1day'
			} else if (maxDiff < 90) {
				this.duration = 90;
				this.frequency = this.durations[90].interval; //'1day'
			} else if (maxDiff < 365) {
				this.duration = 365;
				this.frequency = this.durations[365].interval; //'1day'
			} else if (maxDiff < 1096) {
				this.duration = 1096;
				this.frequency = this.durations[1096].interval; //'1day'
			} else if (maxDiff < 1826) {
				this.duration = 1826;
				this.frequency = this.durations[1826].interval; //'1week';
			} else if (maxDiff < 3653) {
				this.duration = 3653;
				this.frequency = this.durations[3653].interval; //'1week';
			} else {
				this.duration = 10950;
				this.frequency = this.durations[10950].interval; //'1month'
			}

		}

		//make sure max date isn't greater than today
		if (this.dMax >= parseInt(this.todayMS)) {
			this.dMax == parseInt(this.todayMS);
		}

		this.updateFrequency(); //update frequency menu

		this.hasCustom = 1;
		this.initAreaPos();
		this.load();
	}
}

// show custom time range area
chart.prototype.showCustom = function(duration){
	this.custom = Element.get("custom");
	this.tearoff = Element.get("tearoff");
	this.resizeMe = 1;
	
	if (duration == 10000) {
		if (this.custom.style.display == 'none') {
			this.custom.style.display = 'block';
				
			if (this.hasCustom == 0) {
				this.saveCustomFrom.value = this.customStart;
				this.saveCustomTo.value = this.customEnd;
			} else {
				if (this.customData && this.customData.length > 0) {
					this.updateCustomSelectArea();
				}
			}
			
			this.loadcustomchart();
		} else {
			this.custom.style.display = 'none';
		}
	} else {
		this.custom.style.display = 'none';
	}
	
	if (this.cType == "tearoff") {
		setButtonPosition(true);//move Large Chart/tearoff button
	}
	toolbox.init();
}

// Builds Custom Time
chart.prototype.loadcustomchart = function(width){
	Element.get('customChart').innerHTML = '&nbsp; loading ...';
	var qs = '../charts/update_customchart.asp';
	commonGen.document.location.replace(qs);
}


// EVENTS
chart.prototype.mouseDown = function(ev,el) {
    this.target = ev.getTarget();
    this.disableTextSelect();
}

chart.prototype.mouseUp = function(ev,el) {

	if (this.target && (this.target.id == 'ctHandleL' || this.target.id == 'ctHandleR')) {
		this.updateCustom();
	}
	this.target = null;
	this.enableTextSelect();
}

chart.prototype.mouseMove = function(ev,el) {
    
    var xLoc = mouse.x - chart.customOrigin.x - 18;
    
    if (this.target == this.controlLeft) {
        var ctPos = Element.get('ctRight').style.left.replace('px','');
        if(xLoc && xLoc > 1 && xLoc < (ctPos-3)) {
            chart.saveCustomFrom.value = chart.customData[chart.getCustomIndex(xLoc)].df;
            Element.get('ctLeft').style.width = (xLoc + 5) + 'px';
        }
    }
    if (this.target == this.controlRight) {
		var ctPos = Element.get('ctLeft').style.width.replace('px','');
		if(xLoc > ctPos) {
			if (chart.customData[chart.getCustomIndex(xLoc)]) {
				chart.saveCustomTo.value = chart.customData[chart.getCustomIndex(xLoc)].df;
				
				if (xLoc < 434) {
					Element.get('ctRight').style.width =  (434 - xLoc) + 'px';
					Element.get('ctRight').style.left =  xLoc + 'px';
				} else {
					Element.get('ctRight').style.width =  '10px';
					Element.get('ctRight').style.left =  '434px';
				}
			} else {
				Element.get('ctRight').style.width =  '10px';
				Element.get('ctRight').style.left =  '434px';
			}
        }
    }
}

chart.prototype.disableTextSelect = function() {
    if (!document.onselectstart) {
	    document.onselectstart = function() {
		    return false;
	    }
    }
}

chart.prototype.enableTextSelect = function() {
	if (document.onselectstart) {
		document.onselectstart = null;
	}
}