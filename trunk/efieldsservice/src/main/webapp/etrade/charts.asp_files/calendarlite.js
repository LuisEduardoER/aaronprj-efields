/*

Cleint Side Calendar Drawing Class

modified just for use on etrade.com
*/

var Calendar = function(sDomId){
	
	//id to give Calendar Element
	this._DomId = sDomId || "Calendar";
	
	/*set dom calendar element*/
	//this._setCalendarElement();
	
	/*defaults*/
	this._currentDate = new Date();
	this.monthDisplay = "full";
	this.dayDisplay = "short"
	this.titleHeaderElement = "h2";
	this.monthHeaderElement = "h3";
	this.closeElement = "div";
	
	this._title = false;
	this._showClose = true;
	
	this._events = {};
	
}

/* ------------- Configurable ------------------ */


Calendar.prototype.setMonthDisplay = function(sDisplayType) {
	
	this.monthDisplay = sDisplayType || this.monthDisplay;
	
}

Calendar.prototype.setDayDisplay = function(sDisplayType) {
	
	this.dayDisplay = sDisplayType || this.dayDisplay;
	
}

Calendar.prototype.subscribeSelectHandler = function(handler,context, data){
	
	this._customHandler = {
	
		handler:handler
		,context:context
		,data:data
	
	}
	
}

Calendar.prototype.setTitle = function(sTitleText){
	
	if(sTitleText){
		
		this._title = sTitleText;
		
	}
	
}

Calendar.prototype.disableCloseDisplay = function(bDisable) {
	
	this._showClose = !bDisable;
	
}

/* ------------- Public Methods ------------------ */

Calendar.prototype.draw = function(oContainer) {
	
	if(oContainer) {
		
		this.setContainer(oContainer);
		
	}
	
	this._setCalendarElement();
	
	if (chart.cal.newX || chart.cal.newY) {
		this._resetCalendarPosition(chart.cal.newX,chart.cal.newY);
	}
	
	this._drawCloseElement();
	
	this._drawTitle();
	
	this._drawMonthLabel();
	
	this._drawIncrementButtons();
	
	this._drawCalendarTable();
	
	Element.setStyle(this._DomId,"display:block");
}

Calendar.prototype.getSelectedDate = function(){
	
	return this.selectedDate || false;
	
}

Calendar.prototype.incrementMonth = function(){
	
	var oNewDate = new Date(this._currentDate.getFullYear(),this._currentDate.getMonth()+2,0);
	
	this._setCalendarElement();
	
	this._setCurrentDate(oNewDate);
	
	this.draw();
	
}

Calendar.prototype.decrementMonth = function(){
	
	var oNewDate = new Date(this._currentDate.getFullYear(),this._currentDate.getMonth(),0);
	
	this._setCalendarElement();
	
	this._setCurrentDate(oNewDate);
	
	this.draw();
	
}

Calendar.prototype.selectDay = function(event,el,data) {
	
	//remove current selected
	var rSelected = Element.parseSelector("TD.selected",this.CalendarElement);
	
	if(rSelected && rSelected.length){
	
		Element.removeClass(rSelected,"selected");
		
	}
	
	//add selected class
	
	Element.addClass(el,"selected");
	
	//save selected date
	this._setSelectedDate(data.date);
	
	//for updating month display
	this._setCurrentDate(data.date);
	
	//highlight dates w/in range of selected && highlight point
	this.draw();
	
	//fire custom user event
	this._fireCustomSelectHandler(event,el);
	
}

Calendar.prototype.setContainer = function(oContainer){
	
	var oContainer = Element.get(oContainer);
	
	this._containerElement = oContainer;
	
}

Calendar.prototype.setSelectedDay = function(oDate){
	
	this._setSelectedDate(oDate);
	
	this._setCurrentDate(oDate);
	
}

//oRange = {from:oDate,to:oDate}
Calendar.prototype.addDisabledDateRange = function(oRange) {
	
	this._disabledRanges = this._disabledRanges || [];
	
	//default to/from dates if none provided
	oRange.to = oRange.to || new Date(9999,1,1);
	
	oRange.from = oRange.from || new Date(1,1,1);
	
	this._disabledRanges.push(oRange);
	
}

Calendar.prototype.close = function(){
	
	Element.remove(this.CalendarElement);	
	
}

//add .highlight to dates between this date and selected date
Calendar.prototype.setHighlightPoint = function(oDate){
	
	this._highlightPoint = oDate;
	
}

Calendar.prototype.addEvent = function(oDate, sEvent){
	
	var sDate = this._incrementDateByDay(oDate,0).getTime();

	this._events[sDate] = this._events[sDate] || [];
	
	this._events[sDate].push(sEvent);
	
}

/* ------------- Constants ------------------ */

Calendar.prototype.MONTH_LABELS =  [
	{ abbr: "Jan", num: "01", full: "January" },
	{ abbr: "Feb", num: "02", full: "February" },
	{ abbr: "Mar", num: "03", full: "March" },
	{ abbr: "Apr", num: "04", full: "April" },
	{ abbr: "May", num: "05", full: "May" },
	{ abbr: "Jun", num: "06", full: "June" },
	{ abbr: "Jul", num: "07", full: "July" },
	{ abbr: "Aug", num: "08", full: "August" },
	{ abbr: "Sep", num: "09", full: "September" },
	{ abbr: "Oct", num: "10", full: "October" },
	{ abbr: "Nov", num: "11", full: "November" },
	{ abbr: "Dec", num: "12", full: "December" }
	];
	
Calendar.prototype.DAYS = [
		{"short":"S",abbr: "Sun",full:"Sunday"}
		,{"short":"M",abbr: "Mon",full:"Monday"}
		,{"short":"T",abbr: "Tue",full:"Tuesday"}
		,{"short":"W",abbr: "Wed",full:"Wednesday"}
		,{"short":"T",abbr: "Thur",full:"Thursday"}
		,{"short":"F",abbr: "Fri",full:"Friday"}
		,{"short":"S",abbr: "Sat",full:"Saturday"}
];

Calendar.prototype.CSS_CLASS_NAME = "calendar";

/* ------------- Private Methods ------------------ */

Calendar.prototype._resetCalendarPosition = function(left,top){
		
	if (this._DomId) {
	
		var c = Element.get(this._DomId);
		if (left){
			c.style.left = left+"px";
		}
		if (top){
			c.style.top = top+"px";
		}
		
	}
}

Calendar.prototype._fireCustomSelectHandler = function(event,el){
	
	if(this._customHandler) {
		
		var oContext = this._customHandler.context || window;

		this._customHandler.handler.apply(oContext,[event,el,this._customHandler.data,this.getSelectedDate()]);
		
	}
	
}

Calendar.prototype._setCurrentDate = function(oDate){
	
	this._currentDate = oDate;
	
}

Calendar.prototype._incrementDateByDay = function(oDate, iDays){
	
	return new Date(oDate.getFullYear(),oDate.getMonth(),oDate.getDate() + iDays);
	
}

Calendar.prototype._setSelectedDate = function(oDate){
	
	this.selectedDate = oDate;
	
}


Calendar.prototype._getFirstDayOfMonth = function(){
	
	return new Date(this._currentDate.getFullYear(),this._currentDate.getMonth(),1).getDay();
	
}

Calendar.prototype._getDaysInMonth = function() {
	
	var iYear = this._currentDate.getFullYear();
	
	var iMonth = this._currentDate.getMonth();
	
	var oDate = new Date(iYear, iMonth+1, 0);
	
	return oDate.getDate();

}

Calendar.prototype._setCalendarElement = function(){
	
	var oParentElement = this._containerElement || document.body;
	
	if(this.CalendarElement && this.CalendarElement.parentNode) {
		
			Element.remove(this.CalendarElement);
			
	}
	
	if(this._DomId) {
			
			this.CalendarElement = Element.create("div",{className:this.CSS_CLASS_NAME,id:this._DomId,style:"display:none"},null,oParentElement);
		
	} else {
	
		this.CalendarElement = Element.create("div",{className:this.CSS_CLASS_NAME,style:"display:none"},null,oParentElement);
		
	}
	
}

//store/reset date info for current element being drawn
Calendar.prototype._setDayDrawing = function(iDay){
	
	var oDayDrawing = {};
	
	var oDate = new Date(this._currentDate.getFullYear(),this._currentDate.getMonth(),iDay);
	
	oDayDrawing.Date = oDate;
	
	oDayDrawing.year = oDate.getFullYear();
	
	oDayDrawing.month = oDate.getMonth();
	
	oDayDrawing.day = oDate.getDate();
	
	oDayDrawing.time = oDate.getTime();
	
	this._dayDrawing = oDayDrawing;
	
}

Calendar.prototype._checkDayIsToday = function(){
	
	var oNow = new Date();
	
	if(oNow.getFullYear() != this._dayDrawing.year) {
		
		return false;
		
	}
	
	if(oNow.getMonth() != this._dayDrawing.month) {
		
		return false;
		
	}
	
	if(oNow.getDate() == this._dayDrawing.day) {
		
		return true;
		
	}
	
	return false;
	
}

Calendar.prototype._checkIsSelected = function(){
	
	if(!this.selectedDate) {
		
		return false;
		
	}
	
	if(this.selectedDate.getFullYear() != this._dayDrawing.year){
		
		return false;
		
	}
	
	if(this.selectedDate.getMonth() != this._dayDrawing.month){
		
		return false;
		
	}
	
	if(this.selectedDate.getDate() == this._dayDrawing.day) {
		
		return true;
		
	}
	
	return false;
	
}

Calendar.prototype._checkIsDisabled = function(){
	
	if(!this._disabledRanges) {
		
		return false;
		
	}
	
	for(var i=0;i<this._disabledRanges.length;i++) {
		
		var oRange = this._disabledRanges[i];
		
		if(this._dayDrawing.Date >= oRange.from && this._dayDrawing.Date <= oRange.to) {
			
			return true
			
		}
		
	}
	
	return false;
	
}

Calendar.prototype._checkIsHighlightPoint = function(){
	
	if(!this._highlightPoint){
		
		return false;
		
	}
	
	if(this._highlightPoint.getFullYear() != this._dayDrawing.year) {
		
		return false;
		
	}
	
	if(this._highlightPoint.getMonth() != this._dayDrawing.month) {
		
		return false
		
	}
	
	if(this._highlightPoint.getDate() == this._dayDrawing.day) {
		
		return true;
		
	}
	
	return false;
	
}

Calendar.prototype._checkIsHighlighted = function(){
	
	if(this._highlightPoint && this.selectedDate) {
		
		var oDate = this._dayDrawing.Date;
		
		var bIsBetween = (oDate > this._highlightPoint && oDate < this.selectedDate) || (oDate < this._highlightPoint && oDate > this.selectedDate);
		
		return bIsBetween;
		
	}
	
	return false;
	
}

Calendar.prototype._getDateClass = function(iDay){

	var rClassNames = ["date"];
	
	if(this._checkIsHighlightPoint()){
		
		rClassNames.push("highlightPoint");
		
	}

	if(this._checkDayIsToday()){
		
		rClassNames.push("today");
		
	}
	
	if(this._checkIsSelected()) {
		
		rClassNames.push("selected");
		
	}
	
	if(this._checkIsDisabled()) {
		
		rClassNames.push("disabled");
		
	}
	
	if(this._checkIsHighlighted()) {
		
		rClassNames.push("highlight");
		
	}
	
	if(!this._dayDrawing.isInMonth) {
		
		rClassNames.push("outOfMonth");
		
	}
	
	//events
	rEvents = this._events[this._dayDrawing.time] || [];

	if(rEvents.length){
		rClassNames = rClassNames.concat(rEvents);
	}
	
	return rClassNames.join(" ");

}

//Private Draw Methods
Calendar.prototype._drawCloseElement = function(){
	
	if (true == this._showClose) {
		var oClose = Element.create(this.closeElement,{className:"close"},"Close",this.CalendarElement);

		Events.add({
			element:oClose
			,type:"click"
			,handler:this.close
			,context:this
		});
	}
	
}

Calendar.prototype._drawMonthLabel = function() {
	
	var oDate = this._currentDate;
	
	var sMonth = this.MONTH_LABELS[oDate.getMonth()][this.monthDisplay];
	
	var sYear = oDate.getFullYear();
	
	var sMonthHeader = sMonth + " " + sYear;
	
	Element.create(this.monthHeaderElement,null,sMonthHeader,this.CalendarElement);
	
}

Calendar.prototype._drawTitle = function(){
	
	if(this._title){
		
		Element.create(this.titleHeaderElement,null,this._title,this.CalendarElement);
		
	}
	
}

Calendar.prototype._drawCalendarTable = function(){
	
	var oTableHeader = this._getDayLabels();
	
	var oCalendarBody = this._getCalendarBody();
	
	var rTBody = [oTableHeader].concat(oCalendarBody);
	
	var oTBody = Element.create("tbody",null,rTBody,null);
	
	this.CalendarTable = Element.create("table",{cellSpacing:0,cellPadding:0},oTBody,this.CalendarElement);
	
}

Calendar.prototype._drawIncrementButtons = function(){
	
	var oThis = this;
	
	var oPrev = Element.create("a",{className:"calendarPreviousMonth",href:"javascript:void(0);"},"Previous",null);
	
	var oNext = Element.create("a",{className:"calendarNextMonth",href:"javascript:void(0);"},"Next",null);
	
	//switch out to adding inline events above - place I am working on this only has Element.2 so this is not available
	
	Events.add({
		
		element:oNext
		,type:"click"
		,handler:this.incrementMonth
		,context:this
		
	});
	
	Events.add({
		
		element:oPrev
		,type:"click"
		,handler:this.decrementMonth
		,context:this
		
	});
	
	Element.addChild(this.CalendarElement,oPrev);
	
	Element.addChild(this.CalendarElement,oNext);
	
}

Calendar.prototype._getDayLabels = function(){
	
	var rTH = [];
	
	for(var i=0;i<7;i++) {
		
		rTH.push(
		
			Element.create("th",null,this.DAYS[i][this.dayDisplay],null)
		
		);
		
	}
	
	return Element.create("tr",null,rTH,null);
	
}

Calendar.prototype._getCalendarBody = function(){
	
	var iFirstDay = this._getFirstDayOfMonth();
	
	var iDaysInMonth = this._getDaysInMonth();
	
	var rTRs = [];
	
	var iDay = 1-iFirstDay;
	
	for(var iWeek=0;iWeek<6;iWeek++) {
		
		var rTDs = [];
		var bFirst = true;
		for(var i=7*iWeek+1;i<7*(iWeek+1)+1;i++){
			
			this._setDayDrawing(iDay); //object storing properties for current day being drawn
				
			iDay++;
				
			this._dayDrawing.isInMonth = (iDay<=iDaysInMonth+1 && iDay>1);

			if(iDay>iDaysInMonth && bFirst){
				break;
			}
			
			var sTDClass = this._getDateClass(iDay);
			
			if (0 == (i % 7 - 1) || 0 == (i % 7)) {
				sTDClass += " weekend";
			}
			
			var oTD = Element.create("td",{className:sTDClass},this._dayDrawing.day,null);
			
			if(!new RegExp(/disabled/).test(sTDClass)) {
			
				Events.add({
					
					element:oTD
					,type:"click"
					,handler:this.selectDay
					,context:this
					,data:{
						date:this._dayDrawing.Date
					}
					
				});
				
			}
			
			rTDs.push(oTD);
			bFirst = false;
		}
		
		rTRs.push(Element.create("tr",null,rTDs,null));
		
		if(this._dayDrawing.month != this._currentDate.getMonth()) {
			break;	
		}
		
	}
	
	return rTRs;
	
}

/* Private Event Adding Methods */
