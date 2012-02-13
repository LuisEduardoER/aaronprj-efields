toolboxObj = function() {
	if (chart) {
		this.currentTool = chart.currentTool;
	} else {
		this.currentTool = "zoom";
	}
	this.tool = [];
	this.tool["trendline"] = [];
	this.maxTrendlines = 6;

	// toggle to determine if we should show mousemovement
	this.showZoomMove = 1;
}

toolboxObj.prototype.getNewData = function() {
	this.init();
	if (chart.exportData) {
		this.chartData = getParsedData();

		//var cWidth = d.yX - d.cS;
		var cWidth = d.cE - d.cS;
		this.spacing = (cWidth / d.cDS.length);
	}
}

function changeTool(tool, rememberLast) {

	chart.activateUpperSettingsControls();

	if (!tool) { tool = "zoom"; }

	if (tool == 'trendline') {
		toolbox.currentTool = "trendline";
	} else if (tool == 'zoom') {
		toolbox.currentTool = "zoom";
		Element.get('trendradio').checked = false;
		Element.get('zoomradio').checked = true;
	} else if (tool == 'ball') {
		toolbox.currentTool = "ball";
		Element.get('trendradio').checked = false;
		Element.get('zoomradio').checked = true;
	} else if (tool == 'crosshair') {
		toolbox.currentTool = "crosshair";
		Element.get('trendradio').checked = false;
		Element.get('zoomradio').checked = true;
	} else if (tool == 'normal') {
		toolbox.currentTool = "normal";
		Element.get('trendradio').checked = false;
		Element.get('zoomradio').checked = true;
		toolbox.clearTrendlines();
	}

	if (tool == 'zoom') {
		Element.get('cursor').value = tool;
	}

	if (rememberLast) {
		chart.lastUsedTool = tool;
	}

	if (tool && tool != "undefined") {
		common.cb.load({
			url: "update_tool.asp",
			data: { currentTool: tool },
			method: "get"
		});
	}

	chart.currentTool = toolbox.currentTool;
	toolbox.init();

}

// init Toolbox
toolboxObj.prototype.init = function() {
	// Get Coords of Chart
	this.chartArea = document.getElementById("cht");
	this.origin = chart.getPos(this.chartArea, 0, 8);

	this.regionX = { x0: d.cS, x1: d.yX }; // d.cS d.yX is the width of the x axis, or x pos of y axis
	this.regionY = [{ y0: 0, y1: chart.upperHeight}];

	// toggle to determine if we should show mousemovement
	this.showZoomMove = 1;

	// setup legend
	this.infoDiv = document.getElementById("infoDiv");
	with (this.infoDiv.style) { // dynamic position
		top = this.origin.y + 'px';
		left = this.origin.x + 'px';
	}

	// Fix for Safari/Mozilla - Add events to Div instead of the actual chart area
	if (typeof (document.all) == "undefined") {
		this.divMoz = document.getElementById("mozWin");
		with (this.divMoz.style) { // dynamic position
			width = chart.width + 'px';
			height = chart.height + 'px';
			top = this.origin.y + 'px';
			left = this.origin.x + 'px';
		}
		addEvent(this.divMoz, "mouseup", userAction);
		addEvent(this.divMoz, "mousedown", userAction);
		addEvent(this.divMoz, "mousemove", userAction); // ie needs this.
		addEvent(this.divMoz, "selectstart", cancelEvent);
		addEvent(this.divMoz, "dblclick", instantiateTrade);
	} else {
		// i.e works much better like this
		addEvent(this.chartArea, "mouseup", userAction);
		addEvent(this.chartArea, "mousedown", userAction);
		addEvent(this.chartArea, "mousemove", userAction); // ie needs this.
		addEvent(this.chartArea, "selectstart", cancelEvent);
		addEvent(this.chartArea, "dblclick", instantiateTrade);
	}

	// Add Handlers/User Action for Trendlines
	var canvasID;
	for (var x = 0; x < this.maxTrendlines; x++) {
		canvasID = document.getElementById("canvas" + x);
		addEvent(canvasID, "mouseup", userAction);
	}

	// Some reference vars for the Trendlines
	this.outLeft = function(x0) { return x0 <= this.regionX.x0 + this.origin.x; }
	this.outRight = function(x0) { return x0 >= this.regionX.x1 + this.origin.x; }
	this.outTop = function(y0) { return y0 <= this.regionY[0].y0 + this.origin.y }
	this.outBottom = function(y0) { return y0 >= this.regionY[0].y1 + this.origin.y; }

	// Initialize Zooming
	if (this.currentTool == 'zoom' || this.currentTool == 'normal' || this.currentTool == 'crosshair' || this.currentTool == 'ball') {
		this.tool["zoom"] = new zoomObj();
		this.tool["zoom"].init();
	} else if (this.currentTool == 'trendline') {
		// clear old cross hair
		if (this.tool["zoom"]) {
			this.tool["zoom"].divZoom.style.visibility = "hidden";
		}
		if (this.tool["zoom"]) {
			this.tool["zoom"].divZoomH.style.visibility = "hidden";
		}
	}
}

// quick util for finding array key
toolboxObj.prototype.getSnapIndex = function(xIn) {

	//xIn = xIn - d.cS;

	this.dataKey = 0; //Math.floor((xIn - this.spacing) / this.spacing);
	while (xIn - this.spacing / 2 > (d.xDS[this.dataKey])) {
		this.dataKey++;
	}
	if (typeof (d.cDS[this.dataKey]) == "undefined") {
		return ((xIn < 300 || d.cDS.length == 0) ? 0 : d.cDS.length - 1)
	}
	return this.dataKey;
}

// Update Price Legend
toolboxObj.prototype.updateLegend = function(x0, x1, ixStart, ixStop) {

	//console.log(this.chartData);

	if (x1) { // being dragged		

		this.tradeRef = ixStop;

		if (chart.issueType == 'MF') {
			var volume1 = '';
			var volume2 = '';
		} else {
			var volume1 = '<div class="inLab" style="width:40px;">Volume</div><div class="inData" style="width:120px;">' + this.chartData[ixStart].v + '</div>';
			var volume2 = '<div class="inLab" style="width:40px;">Volume</div><div class="inData" style="width:120px;">' + this.chartData[ixStop].v + '</div>';
		}
		this.infoDiv.innerHTML = '<div><div class="inDa">' + this.chartData[ixStart].df + '</div><div class="inLab">Open</div><div class="inData">' + this.chartData[ixStart].o + '</div><div class="inLab">High</div><div class="inData">' + this.chartData[ixStart].h + '</div><div class="inLab">Low</div><div class="inData">' + this.chartData[ixStart].l + '</div><div class="inLab">Close</div><div class="inData">' + this.chartData[ixStart].cF + '</div>' + volume1 + '<br class="clear" /><div class="inDa">' + this.chartData[ixStop].df + '</div><div class="inLab">Open</div><div class="inData">' + this.chartData[ixStop].o + '</div><div class="inLab">High</div><div class="inData">' + this.chartData[ixStop].h + '</div><div class="inLab">Low</div><div class="inData">' + this.chartData[ixStop].l + '</div><div class="inLab">Close</div><div class="inData" id="tradeClose">' + this.chartData[ixStop].cF + '</div>' + volume2 + '</div>';
		this.infoDiv.innerHTML = this.infoDiv.innerHTML + '<div class="clear pL2 t4 pR2" style="width:500px"><div class="fLeft t2"></div><div class="fLeft">Double Click to Place a Limit Order at <span class="bold txt11">' + this.chartData[ixStop].cF + '</span></div></div>';

	} else { // crosshair

		this.tradeRef = ixStart;

		try {
			if (chart.issueType == 'MF') {
				var volume1 = '';
			} else {
				var volume1 = '<div class="inLab" style="width:40px;">Volume</div><div class="inData" style="width:120px;">' + this.chartData[ixStart].v + '</div>';
			}
			this.infoDiv.innerHTML = '<div><div class="inDa">' + this.chartData[ixStart].df + '</div><div class="inLab">Open</div><div class="inData">' + this.chartData[ixStart].o + '</div><div class="inLab">High</div><div class="inData">' + this.chartData[ixStart].h + '</div><div class="inLab">Low</div><div class="inData">' + this.chartData[ixStart].l + '</div><div class="inLab">Close</div><div class="inData"  id="tradeClose">' + this.chartData[ixStart].cF + '</div>' + volume1 + '</div>';
			this.infoDiv.innerHTML = this.infoDiv.innerHTML + '<div class="clear pL2 t4" style="width:500px"><div class="fLeft t2 pR2"></div><div class="fLeft" >Double Click to Place a Limit Order at <span class="bold txt11">' + this.chartData[ixStart].cF + '</span></div></div>';

			this.updateLowerIndicatorLegends(ixStart);

		} catch (e) { }
	}
}

toolboxObj.prototype.updateLowerIndicatorLegends = function(ixStart) {
	//update with values
	try {

		//extra datasets for lower indicator rollovers (should never have > 4 datasets)
		var lowerIndDS = [];
		lowerIndDS[0] = this.chartData[ixStart].yV0;
		lowerIndDS[1] = this.chartData[ixStart].yV1;
		lowerIndDS[2] = this.chartData[ixStart].yV2;
		lowerIndDS[3] = this.chartData[ixStart].yV3;

		for (var l = 0; l < lowerIndDS.length; l++) {
			try {
				var div = document.getElementById("yDSvalInfo_" + (l + 1));
				var data = this.getDSWithinLowerDS(lowerIndDS[l]);

				if (div && data) {
					//if we have multiple data points, find their divs and update
					if (data.subDS) {
						for (var x = 0; x < data.subDS.length; x++) {
							var subDiv = document.getElementById("yDSvalInfo_" + (l + 1) + "_" + x);
							var subData = data.subDS[x];
							if (subDiv && subData) {
								subDiv.innerHTML = this.getFormattedValue(subData);
							}
						}
					} else {
						//we only have a single data point	
						div.innerHTML = this.getFormattedValue(data.ds);
					}
				}
			} catch (e) { }
		}

	} catch (e) { }
};

// ----------------------------------------------------------
// helpful for lower indicators with multiple datasets
// ---
toolboxObj.prototype.getFormattedValue = function(value) {

	if (value != undefined && value != "undefined") {

		if (Math.abs(parseFloat(value)) > 9999) {
			value = Format(value, "ShortMagnitude");

		} else if (Math.abs(parseFloat(value)) > 999) {
			value = Format(value, "comma");

		} else {
			value = value;
		}


	} else {
		value = "--";
	}

	return value;

}

// ----------------------------------------------------------
// helpful for lower indicators with multiple datasets
// ---
toolboxObj.prototype.getDSWithinLowerDS = function(ds) {

	//if it's not a string with pipes, send it right back.
	if (typeof (ds) != "string" || typeof (ds) == undefined) {
		return { ds: ds };
	}

	var subDS = [];
	if (ds && ds.indexOf("|") > -1) {
		subDS = ds.split("|");
	}
	return { ds: ds, subDS: subDS };
};

// ----------------------------------------------------------
// Trendline Features
// ----------------------------------------------------------
toolboxObj.prototype.clearTrendlines = function() {
	for (var x = toolbox.tool["trendline"].length - 1; x >= 0; x--) {
		document.getElementById("canvas" + x).innerHTML = '';
		toolbox.tool["trendline"][x].clearHTM();
		toolbox.tool["trendline"][x].hideLabel();
		toolbox.tool["trendline"][x].hideHandle(0);
		toolbox.tool["trendline"][x].hideHandle(1);
	}
}

// Get Price
toolboxObj.prototype.getPrice = function(yIn) {
	if (typeof (d.pDS[(parseInt(yIn, 10) - this.origin.y)]) != "undefined") {
		return d.pDS[(parseInt(yIn, 10) - this.origin.y)];
	}
	return 0;
}
// Create a new Trendline - try to organize better
toolboxObj.prototype.createNewTrendLine = function(x0, y0) {
	if (typeof (this.currLine) == "undefined") {
		this.currLine = 0;
	} else if (this.tool["trendline"][this.currLine].x1 && this.tool["trendline"][this.currLine].y1) {
		// only increment if dragging did actually occur.
		this.currLine += 1;
	}

	if (this.currLine >= this.maxTrendlines) {
		this.currLine = 0;
	}
	if (this.currLine > this.tool["trendline"].length - 1) {
		this.tool["trendline"][this.currLine] = new trendlineObj(this.currLine);
	}
	this.tool["trendline"][this.currLine].dragStart(x0, y0);
}

// check boundry
toolboxObj.prototype.checkCoords = function(cX, cY) {
	return (cY > this.regionY[0].y0 &&
	cY < this.regionY[0].y1 &&
	cX > this.regionX.x0 &&
	cX < this.regionX.x1
	);
}
toolboxObj.prototype.checkRollCoords = function(cX, cY) {
	return (cY > this.regionY[0].y0 &&
	cX > (this.regionX.x0) && (cY < chart.height - 10)); //add 12 to regionX.x0 to keep coords inside show/hide button
}
toolboxObj.prototype.checkPositiveCoords = function() {
	for (var x = 0; x < arguments.length; x++) {
		if (arguments[x] < 0) {
			return false;
		}
	}
	return true;
}

// ----------------------------------------------------------
// EVENT HANDLERS
// ----------------------------------------------------------
function userAction(what, who) {
	try { // needed for actions before toolbox is fully inited

		// event handling
		if (what == "move") {

		} else {
			if (arguments.length == 0) {
				var what = window.event.type.replace("mouse", "");
			} else if (typeof (what) == "object") {
				var what = what.type.replace("mouse", "");
			}
		}

		var xOffset = toolbox.origin.x + 2; // because the window layout is stretchy, need to offset by x pos of chart
		var yOffset = toolbox.origin.y; // dito for y

		// call specific handler
		switch (what) {
			case "move":
				{
					if (toolbox.currentTool == "zoom" || toolbox.currentTool == "normal" || toolbox.currentTool == "crosshair" || toolbox.currentTool == "ball") {
						if (chart.isHistorical && chart.isHistorical == 1) { // makes sure historical chart always rolls
							if (toolbox.checkRollCoords(mouse.x - xOffset, mouse.y - yOffset)) { // remove restriction on lower
								toolbox.tool["zoom"].roll(mouse.x - xOffset);
							}
						} else if (chart.mView == 0 || chart.mView2 == 0 || chart.submenu.style.display == 'block' || toolbox.showZoomMove == 0) {
							// don't roll
						} else {
							if (toolbox.checkRollCoords(mouse.x - xOffset, mouse.y - yOffset)) { // remove restriction on lower
								toolbox.tool["zoom"].roll(mouse.x - xOffset);
							}
						}
					} else if (toolbox.currentTool == "trendline" && typeof (toolbox.currLine) != "undefined" && typeof (toolbox.tool["trendline"][toolbox.currLine]) != "undefined") {
						//toolbox.tool["zoom"].roll(mouse.x - xOffset);
						toolbox.tool["trendline"][toolbox.currLine].roll(mouse.x, mouse.y);
					}
					break;
				}

			case "down":
				{
					if (toolbox.currentTool == "zoom" || toolbox.currentTool == "crosshair" || toolbox.currentTool == "ball") {
						toolbox.tool["zoom"].dragStart(mouse.x - xOffset);
						cancelEvent();
					} else if (toolbox.currentTool == "trendline") {
						if (toolbox.checkCoords(mouse.x - xOffset, mouse.y - yOffset)) {
							toolbox.createNewTrendLine(mouse.x, mouse.y);
							cancelEvent();
						}
					}
					break;
				}

			case "up":
				{
					if (toolbox.currentTool == "zoom" || toolbox.currentTool == "crosshair" || toolbox.currentTool == "ball") {
						toolbox.tool["zoom"].dragStop(mouse.x - xOffset);
						cancelEvent();
					} else if (toolbox.currentTool == "trendline") { // && typeof(toolbox.currLine) != "undefined"
						toolbox.tool["trendline"][toolbox.currLine].dragStop();
					}
					break;
				}

			case "trendHandleDrag":
				{
					toolbox.currLine = parseInt(who.substr(0, 1));
					toolbox.tool["trendline"][toolbox.currLine].startTrendHandleDrag(who.substr(0, 1), who.substr(1, 1));
					break;
				}
		}

	} catch (err) { }

	return false;
}

function cancelEvent() {
	if (window.event.preventDefault) { window.event.preventDefault() };
	if (window.event.stopPropagation) { window.event.stopPropagation() }
	window.event.cancelBubble = true;
	window.event.returnValue = false;
	return false;
}

// ----------------------------------------------------------
// Zoom
// ----------------------------------------------------------
function zoomObj() {
	this.isCrosshair = true;
	this.isBeingDragged = false;
	this.divZoom = document.getElementById("divZoom"); // vertical crosshair
	this.divZoomH = document.getElementById("divZoomH"); // horizontal crosshair
	this.ball = document.getElementById("ball"); // track ball
	this.ball0 = document.getElementById("ball0");
	this.ball1 = document.getElementById("ball1");
	this.ball2 = document.getElementById("ball2");
	this.ball3 = document.getElementById("ball3");

	if (chart.lowerManager.length > 3) {
		var chH = chart.upperHeight + 17 + (chart.lowerManager.length * (chart.lowerHeight + 22))
	} else if (chart.lowerManager.length > 2) {
		var chH = chart.upperHeight + 17 + (chart.lowerManager.length * (chart.lowerHeight + 22))
	} else if (chart.lowerManager.length > 1) {
		var chH = chart.upperHeight + 17 + (chart.lowerManager.length * (chart.lowerHeight + 22))
	} else {
		var chH = chart.height;
	}

	chH = chH - 8;

	this.init = function() {

		this.indexStart = 0;
		this.indexStop = null;
		this.isBeingDragged = false;

		if (toolbox.currentTool == "normal") {

			this.divZoom.style.visibility = "hidden";
			this.divZoomH.style.visibility = "hidden";
			this.ball.style.visibility = "hidden";

			this.ball0.style.visibility = "hidden";
			this.ball1.style.visibility = "hidden";
			this.ball2.style.visibility = "hidden";
			this.ball3.style.visibility = "hidden";

		} else {

			this.divZoom.style.top = toolbox.origin.y + "px";
			this.divZoom.style.width = "1px";
			this.divZoom.style.height = chH + "px";
			this.divZoom.style.background = "#999999";
			this.divZoom.style.visibility = "hidden";

			addEvent(this.divZoom, "mouseup", userAction);
			addEvent(this.divZoom, "mousemove", userAction);
			addEvent(this.divZoom, "mousedown", userAction);

			this.isCrosshair = true;

			if (toolbox.currentTool == "crosshair") { // Add cross hair - support/resistance

				this.divZoomH.style.width = chart.cht.style.width;
				this.divZoomH.style.left = toolbox.origin.x + 'px';
				this.divZoomH.style.background = "#999999";
				this.divZoomH.style.visibility = "visible";

			} else {

				this.divZoomH.style.visibility = "hidden";
			}
		}
	}

	var x0, x1;
	var mmXold = 0;

	this.roll = function(xIn) {

		this.indexStop = toolbox.getSnapIndex(xIn);

		if (!this.isBeingDragged && (toolbox.currentTool == "crosshair" || toolbox.currentTool == "ball")) {
			this.isCrosshair = true;

			try {
				this.draw(toolbox.chartData[this.indexStop].x, 0, this.indexStop);
				setTimeout('toolbox.updateLegend(' + toolbox.chartData[this.indexStop].x + ',false,' + this.indexStop + ')', 1);
			} catch (e) { }

		} else if (!this.isBeingDragged || toolbox.currentTool == "normal") {
			this.isCrosshair = true;

			try {
				if (!mmXold || mmXold != toolbox.chartData[this.indexStop].x) {

					this.draw(toolbox.chartData[this.indexStop].x);
					setTimeout('toolbox.updateLegend(' + toolbox.chartData[this.indexStop].x + ',false,' + this.indexStop + ')', 1);

					mmXold = toolbox.chartData[this.indexStop].x;
				}
			} catch (e) { }

		} else {

			toolbox.dragDirRight = this.indexStop == Math.max(this.indexStart, this.indexStop)

			if (toolbox.dragDirRight) {

				x0 = toolbox.chartData[this.indexStart].x;
				x1 = toolbox.chartData[this.indexStop].x;

			} else {
				x0 = toolbox.chartData[this.indexStop].x;
				x1 = toolbox.chartData[this.indexStart].x;
			}

			this.dragWidth = Math.abs(x1 - x0);

			if (this.dragWidth > 0 && this.isCrosshair) {

				this.isCrosshair = false;
				this.divZoom.innerHTML = '<table class="dragTable" style="height:' + chH + 'px;" cellpadding="0" cellspacing="0"><tr><td><img class="dragRegion" src="/gif/x.gif" style="height:' + chH + 'px;"></td></tr></table>';

			} else if (this.dragWidth == 0 && !this.isCrosshair) {
				this.isCrosshair = true;
			}

			this.draw(x0, x1);
			toolbox.updateLegend(x0, x1, this.indexStart, this.indexStop);
		}
	}

	this.draw = function(x0, x1, dKey) {

		if (!x0) { return false; }

		if (toolbox.currentTool == "normal" || toolbox.currentTool == "trendline") {

			this.divZoom.style.visibility = "hidden";
			this.divZoomH.style.visibility = "hidden";
			this.ball.style.visibility = "hidden";

			this.ball0.style.visibility = "hidden";
			this.ball1.style.visibility = "hidden";
			this.ball2.style.visibility = "hidden";
			this.ball3.style.visibility = "hidden";

		} else if (toolbox.currentTool == "ball" && !x1) {

			this.divZoom.style.visibility = "hidden";
			this.divZoomH.style.visibility = "hidden";

			this.x2 = x0;

			this.ball.style.visibility = "visible";
			this.ball.style.left = (this.x2 - 8 - toolbox.origin.x) + "px";
			this.ball.style.top = ((toolbox.chartData[dKey].y + toolbox.origin.y) - toolbox.origin.y) + "px";

			// other balls
			if (d.lowLen > 0) {
				this.ball0.style.visibility = "visible";
				this.ball0.style.left = (this.x2 - 8 - toolbox.origin.x) + "px";
				this.ball0.style.top = ((toolbox.chartData[dKey].y0 + toolbox.origin.y) - toolbox.origin.y) + "px";
			}

			if (d.lowLen > 1) {
				this.ball1.style.visibility = "visible";
				this.ball1.style.left = (this.x2 - 8 - toolbox.origin.x) + "px";
				this.ball1.style.top = ((toolbox.chartData[dKey].y1 + toolbox.origin.y) - toolbox.origin.y) + "px";
			}

			if (d.lowLen > 2) {
				this.ball2.style.visibility = "visible";
				this.ball2.style.left = (this.x2 - 8 - toolbox.origin.x) + "px";
				this.ball2.style.top = ((toolbox.chartData[dKey].y2 + toolbox.origin.y) - toolbox.origin.y) + "px";
			}

			if (d.lowLen > 3) {
				this.ball3.style.visibility = "visible";
				this.ball3.style.left = (this.x2 - 8 - toolbox.origin.x) + "px";
				this.ball3.style.top = ((toolbox.chartData[dKey].y2 + toolbox.origin.y) - toolbox.origin.y) + "px";
			}

		} else {

			var customIsClosed = 0;
			if (document.getElementById("custom").style.display == "block") {
				customIsClosed = 1;
			}

			if (!this.isBeingDragged) {
				if (!customIsClosed) {
					if (x0 < (toolbox.origin.x + 12)) {
						//shrink line (and align it to the bottom) 
						this.divZoom.style.height = (chart.height - 49) + "px";
						this.divZoom.style.marginTop = "40px";
					} else {
						//set line back to full height
						this.divZoom.style.height = (chart.height - 8) + "px";
						this.divZoom.style.marginTop = "0px";
					}
				} else {
					//make sure line is full-height
					this.divZoom.style.height = (chart.height - 8) + "px";
					this.divZoom.style.marginTop = "0px";
				}
			} else {
				//make sure line is full-height
				this.divZoom.style.height = (chart.height - 8) + "px";
				this.divZoom.style.marginTop = "0px";
			}

			this.divZoom.style.visibility = "visible";
			this.divZoomH.style.visibility = "hidden";
			this.ball.style.visibility = "hidden";

			this.ball0.style.visibility = "hidden";
			this.ball1.style.visibility = "hidden";
			this.ball2.style.visibility = "hidden";
			this.ball3.style.visibility = "hidden";

			this.x2 = x0;

			if (x1) { // dragged
				this.divZoom.style.left = this.x2 + "px";
				this.divZoom.style.width = (x1 - x0 + 1) + "px";
				this.divZoom.style.background = "none";
			} else { // crosshair
				this.divZoom.style.left = this.x2 + 1 + "px";
			}

			if (toolbox.currentTool == "crosshair") {
				this.divZoomH.style.visibility = "visible";
				this.divZoomH.style.top = mouse.y + "px";
			}
		}
	}

	this.dragStart = function(xStart) {
		toolbox.dragDirRight = false;
		this.isBeingDragged = true;
		this.indexStart = toolbox.getSnapIndex(xStart);
	}

	this.dragStop = function(xStop) {

		this.indexStop = toolbox.getSnapIndex(xStop)
		if (toolbox.chartData.length == 0) { return false }
		var dMin = Math.min(toolbox.chartData[this.indexStart].d, toolbox.chartData[this.indexStop].d)
		var dMax = Math.max(toolbox.chartData[this.indexStart].d, toolbox.chartData[this.indexStop].d)
		if (dMin != dMax && this.isBeingDragged) { // eh Drag Stop is called to much, need some restraints
			chart.dMin = dMin;
			chart.dMax = dMax;
			chart.exportData = 1;
			toolbox.clearTrendlines();
			chart.updateCustomSelectArea();
			if (chart.cType == 'historical') {
				chart.updateHistoricalFrequency(0, 1);
			} else if (chart.isPublic == 1) {
				chart.showPublicZoom(1);
			}
			setTimeout('chart.load();', 1);
		}
		this.isBeingDragged = false;
		this.divZoom.innerHTML = '&nbsp;';
		this.divZoom.style.width = '1px';
		this.divZoom.style.background = "#999999";
	}
}

// ----------------------------------------------------------
// Trendlines
// ----------------------------------------------------------
function trendlineObj(idx) {
	this.idx = idx;
	this.id = "trendline";
	this.initialized = false;
	this.colorUp = "#2E9F1A";
	this.colorDn = "#890000";
	this.colorUnch = "#999999";
	this.htm = [];
	this.lineRegex = /%(\d+);(\d+);(\d+);(\d+)/g;
	this.labelVal = false;

	this.init = function() {

		this.initialized = true;
		this.myCanvas = document.getElementById("canvas" + idx);
		this.isBeingDragged = false;
		this.x0 = false; this.x1 = false;
		this.y0 = false; this.y1 = false;

		// LABEL
		this.divLabel = document.createElement("DIV");
		this.divLabel.className = "divTrendLabel";
		this.divLabel.innerHTML = " ";
		document.body.appendChild(this.divLabel);

		// HANDLES
		this.handle = [
			document.createElement("DIV"),
			document.createElement("DIV")
		]

		for (var x = 0; x < 2; x++) {
			this.handle[x].id = "" + idx + x;
			//addEvent(this.handle[x], "mouseover", userAction);
			addEvent(this.handle[x], "mouseup", userAction);
			addEvent(this.handle[x], "mousemove", userAction);
			addEvent(this.handle[x], "selectstart", userAction);
			this.handle[x].innerHTML = '<div id="' + ("" + idx + x + 2 + 'a') + '" onmousedown="trendHandleDrag(this.id);"><img src="trendPt.gif" /></div>';
			this.handle[x].className = "divTrendHandle";
			document.body.appendChild(this.handle[x]);
		}
	}

	this.init();

	this.dragStart = function(newX, newY) {

		if (d.cDS.length > 1) {
			this.x0 = newX;
			this.y0 = newY;
			this.x1 = false;
			this.y1 = false;
			this.indexStart = toolbox.getSnapIndex(newX);
			this.drawHandle(newX - 2, newY - 2, 0);
			this.isBeingDragged = true;
		} else {
			return false;
		}
	}

	this.dragStop = function() {
		this.isBeingDragged = false;
		if (!this.x1 || !this.y1) { // no dragging has occurred, so remove dot.
			this.hideHandle(0);
		}
	}

	this.drawHandle = function(x, y, idx) {
		this.handle[idx].style.left = x + "px";
		this.handle[idx].style.top = y + "px";
		this.handle[idx].style.visibility = "visible";
	}

	this.hideHandle = function(idx) {
		this.handle[idx].style.visibility = "hidden";
	}

	this.startTrendHandleDrag = function(idx, which) {
		if (which == "0") { // flip label side.
			var tmp0 = this.x1;
			var tmp1 = this.y1;
			var tmp2 = this.indexStop;
			this.x1 = this.x0;
			this.y1 = this.y0;
			this.indexStop = this.indexStart;
			this.x0 = tmp0;
			this.y0 = tmp1;
			this.indexStart = tmp2;
			this.drawHandle(this.x0 - 2, this.y0 - 2, 0)
		}
		this.isBeingDragged = true;
	}

	this.roll = function(newX, newY) {

		if (this.isBeingDragged) {
			this.indexStop = toolbox.getSnapIndex(newX);
			this.collideLeft = false; this.collideTop = false;
			this.collideRight = false; this.collideBottom = false;
			this.collideLeftLabel = false;
			if (toolbox.outLeft(newX - 40)) { this.collideLeftLabel = true; }
			if (toolbox.outLeft(newX - 10)) {

				newX = toolbox.regionX.x0 + toolbox.origin.x + 10;
				this.collideLeft = true;

			} else if (toolbox.outRight(newX)) {
				newX = toolbox.regionX.x1 + toolbox.origin.x - 10;
			}

			if (toolbox.outTop(newY - 10)) {
				newY = toolbox.regionY[0].y0 + toolbox.origin.y + 10;
			} else if (toolbox.outBottom(newY + 10)) {
				newY = toolbox.regionY[0].y1 + toolbox.origin.y - 10;
			}

			this.x1 = newX;
			this.y1 = newY;

			toolbox.tool["trendline"][toolbox.currLine].drawLine(this.x0, this.y0, this.x1, this.y1)
		}
		return false;
	}

	this.drawLine = function(x0, y0, x1, y1) {

		this.labelYmin = Math.min(y0, y1);
		this.labelYmax = Math.max(y0, y1);
		this.dirLeft = x0 > x1;
		this.drawLeft = this.dirLeft && !this.collideLeftLabel;

		if (d.nml == 1) { // Detect if Chart is using normalized data
			this.labelVal = formatPrice(Math.abs(toolbox.getPrice(this.labelYmax) - toolbox.getPrice(this.labelYmin)));
		} else {
			if (y0 == this.labelYmax) {
				this.labelVal = Math.round(((toolbox.getPrice(this.labelYmin) / toolbox.getPrice(this.labelYmax)) - 1) * 10000) / 100;
			} else {
				this.labelVal = Math.round((1 - ((toolbox.getPrice(this.labelYmax) / toolbox.getPrice(this.labelYmin)))) * 10000) / 100;
			}
		}

		this.lineUp = (x0 < x1 && y0 >= y1) || (x0 >= x1 && y0 < y1)
		this.lineColor = (this.labelVal == 0) ? this.colorUnch : (this.lineUp) ? this.colorUp : this.colorDn;
		this.clearHTM()

		this.mkLine(x0, y0, x1, y1);
		this.paint()
		this.drawHandle(this.x1 - 2, this.y1 - 2, 1);
		this.drawLabel(((this.drawLeft) ? x1 - 38 : x1 + 5), y1 - 8, this.labelVal)

	}

	this.hideLabel = function() { this.divLabel.style.visibility = "hidden"; }

	this.drawLabel = function(x0, y0, val) {

		if (!this.drawLabel) { return false; }

		with (this.divLabel.style) {
			left = x0 + "px";
			top = y0 + "px";
			border = "1px solid " + this.lineColor;
			borderLeft = "2px solid " + this.lineColor;
		}

		if (this.divLabel.style.visibility != "visible") {
			this.divLabel.style.visibility = "visible"
		}

		this.divLabel.innerHTML = "&nbsp;" + val + "%&nbsp;";
	}

	this.clearHTM = function() {
		this.htm = [];
	}

	this.paint = function() {
		this.myCanvas.innerHTML = this.htm.join("").replace(this.lineRegex, '<div class=t  style=background:' + this.lineColor + ';left:$1px;top:$2px;width:$3px;height:$4px;></div>');
	}

	this.mkLine = function(x1, y1, x2, y2) { if (x1 > x2) { _x2 = x2; _y2 = y2; x2 = x1; y2 = y1; x1 = _x2; y1 = _y2; }; dx = x2 - x1; dy = Math.abs(y2 - y1); x = x1; y = y1; yIncr = (y1 > y2) ? -1 : 1; if (dx >= dy) { pr = dy << 1; pru = pr - (dx << 1); p = pr - dx; ox = x; while ((dx--) > 1) { ++x; if (p > 0) { this.htm[this.htm.length] = '%' + ox + ';' + y + ';' + (x - ox) + ';2'; y += yIncr; p += pru; ox = x; } else p += pr; }; this.htm[this.htm.length] = '%' + ox + ';' + y + ';' + (x2 - ox + 2) + ';2'; } else { pr = dx << 1; pru = pr - (dy << 1); p = pr - dy; oy = y; if (y2 <= y1) { while ((dy--) > 1) { if (p > 0) { this.htm[this.htm.length] = '%' + (x++) + ';' + y + ';2;' + (oy - y + 2); y += yIncr; p += pru; oy = y; } else { y += yIncr; p += pr; } }; this.htm[this.htm.length] = '%' + x2 + ';' + y2 + ';2;' + (oy - y2 + 2); } else { while ((dy--) > 1) { y += yIncr; if (p > 0) { this.htm[this.htm.length] = '%' + (x++) + ';' + oy + ';2;' + (y - oy); p += pru; oy = y; } else { p += pr; } }; this.htm[this.htm.length] = '%' + x2 + ';' + oy + ';2;' + (y2 - oy + 2); } } };
}

function trendHandleDrag(id) {
	userAction("trendHandleDrag", id);
}

function instantiateTrade(){
	var close = document.getElementById("tradeClose").innerHTML;
	var sym = chart.display_symbol;
	//
	//SIT Acceptance Environment	
	//var url = "https://sit7w86m7.etrade.com/e/t/invest/socreateentry?ordertype=1&pricetype=2&symbol=" + sym + "&limitprice=" + close;
	
	if(chart.issueType == "MF"){
		var url = etradeRootUrl + "/e/t/mftrading/mfbuy?symbol=" + sym + "&limitprice=" + close;
	} else {
		var url = etradeRootUrl + "/e/t/invest/socreateentry?ordertype=1&pricetype=2&symbol=" + sym + "&limitprice=" + close;
	}

	etWin(url, 'tradeTicket', '800', '600');
}

// UTIL Functions

function addEvent(obj, eventType, afunction, isCapture) {
	if (obj.addEventListener) { // W3C DOM
		obj.addEventListener(eventType, afunction, isCapture);
		return true;
	} else if (obj.attachEvent) { // is ie
		return obj.attachEvent("on" + eventType, afunction);
	} else {
		return false;
	}
}

function getParsedData() {
	var data = [];
	for (var x = 0; x < d.cDS.length; x++) {
		var dF = formatD(d.dDS[x]); // check time zone
		data[data.length] = {
			o: formatPrice(d.oDS[x]),
			h: formatPrice(d.hDS[x]),
			l: formatPrice(d.lDS[x]),
			c: d.cDS[x],
			v: formatPrice((d.vDS[x] * 100), -1),
			d: d.dDS[x],
			x: d.xDS[x] + toolbox.origin.x,
			y: d.yDS[x],
			df: dF,
			cF: formatPrice(d.cDS[x]),

			y0: d.yDS0[x],
			y1: d.yDS1[x],
			y2: d.yDS2[x],
			y3: d.yDS3[x],

			yV0: d.yDSVal0[x],
			yV1: d.yDSVal1[x],
			yV2: d.yDSVal2[x],
			yV3: d.yDSVal3[x]
		};
	}
	return data;
}

function formatPrice(value, sig) {
	if (value > 999 || sig == -1) {
		var sig = 0;
	} else if (value < .01 && value > 0) {
		var sig = 4;
	} else {
		var sig = 2;
	}

	if (value) {
		value = String(value.toFixed(sig));
		if (value.length < 7 && value.indexOf(".") > -1 || sig == 4) {
			return value;
		} else {
			x = value.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';

			if (x1.length > 3) {
				var rgx = /(\d+)(\d{3})/;
				while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + ',' + '$2');
				}
			}
			return x1 + x2;
		}
	} else {
		return '--';
	}
}

function formatD(dValue, format) {

	if (chart.durations[chart.duration].interval.indexOf('minu') > -1 && format != 'custom') { // if intraday	

		// exchange local time in milliseconds
		var exchangeLocalInMilliSeconds = (dValue - 25569) * 86400000;

		// Exchange Local Offset to UTC in milliseconds
		var exchangeUTCOffsetTime = chart.tzO * 60 * 1000;

		// ET offset (server time) in milliseconds
		var ETUTCOffsetTime = chart.serverTZ * 60 * 1000;

		// First goto UTC		
		var UTCTime = exchangeLocalInMilliSeconds + exchangeUTCOffsetTime;

		// Now goto ET
		var ETTime = UTCTime - ETUTCOffsetTime - exchangeUTCOffsetTime;
	} else {
		var ETTime = parseFloat((dValue - 25569) * 86400000);
	}

	var t = new Date(ETTime);
	var day = t.getUTCDate();
	var mon = t.getUTCMonth();
	var year = t.getUTCFullYear();
	var formatDatemo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	if (chart.isPinkSheet && (chart.duration == 1 || chart.duration == 3 || chart.duration == 5)) {
		var is_not_pink = 0;
	} else {
		var is_not_pink = 1;
	}

	if (chart.durations[chart.duration].interval.indexOf('minu') > -1 && format != 'custom' && is_not_pink) {
		var h = t.getUTCHours();
		var minute = t.getUTCMinutes() + '';

		if (h > 11 || h < 1) {
			if (h < 1) {
				h = 12;
				var ampm = 'AM';
			} else {
				if (h == 12) {

				} else {
					h = h - 12;
				}
				var ampm = 'PM';
			}

		} else { var ampm = 'AM'; }

		if (minute.length == 1) { minute = '0' + minute; }
		return h + ':' + minute + ' ' + ampm;
	} else {
		if (format == 'custom') {
			return (mon + 1) + '/' + day + '/' + year;
		} else {
			//no 1899
			if (year == 1899) {
				return '--';
			} else {
				return formatDatemo[mon] + ' ' + day + ', ' + year;
			}
		}
	}
}

// ------------------------------------------------------------
// mouse stuff
// ------------------------------------------------------------
var mouse = []; mouse.x = 0; mouse.y = 0;

var m_xOff, m_yOff, m_ev, m_isStandard;

// some browser stuff
var agent = navigator.appName.toLowerCase();

var isSafari = false;
var isNav6 = false;
if (agent.indexOf('safari') != -1) {
	isSafari = true;
} else if (agent.indexOf('gecko') > -1) {
	if (agent.indexOf('netscape') > -1) {
		isNav6 = true
	}

	//sl - 4/9/2010 - ticket: PROB0060361 - Safari 4 is coming back as netscape for some odd reason.
} else if (agent.indexOf('netscape') != -1) {
	isNav6 = true;
}

if (window.addEventListener) {
	window.addEventListener("mousemove", watchMouseCoords, true);
} else { // check safari
	document.attachEvent("onmousemove", watchMouseCoords);
}

function watchMouseCoords(e) {
	if (isSafari) {
		m_ev = event;
	} else {
		m_ev = e;
	}

	if (isNav6) { // need to catch the various implementations of scrollTop
		m_yOff = window.pageYOffset;
		m_xOff = window.pageXOffset;
	} else {
		isStandard = (document.compatMode && document.compatMode == "CSS1Compat") ? true : false;

		if (isStandard) {
			m_yOff = document.documentElement.scrollTop;
		} else {
			m_yOff = document.body.scrollTop;
		}
		if (isStandard) {
			m_xOff = document.documentElement.scrollLeft;
		} else {
			m_xOff = document.body.scrollLeft;
		}

		m_xOff = document.documentElement.scrollLeft;
		m_yOff = document.documentElement.scrollTop;
	}

	if (isSafari) { // eh check on this, but safari seems to only like doc element scrolltop
		//m_yOff = 0 
		// Latest version likes below better
	}

	mouse.x = m_ev.clientX + m_xOff;
	mouse.y = m_ev.clientY + m_yOff;

	if (mouse.callback) { mouse.callback() }
}

// callback function is executed onmousemove in mouse.js.
mouse.callback = function() {
	userAction("move", "callback");
};

